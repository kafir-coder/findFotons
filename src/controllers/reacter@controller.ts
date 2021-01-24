import {Request, Response} from 'express';
import {IReacter ,httpReponseMessages, IPhotographer, IPost} from '../__constants__';
import * as R from 'ramda';
import {redis_socket} from '../server';
import photographerModel from '../models/Photographer';
import reacterModel from '../models/Reacter';
import postModel from '../models/Post';
import paginate from '../libraries/helpers/paginate';

export async function index(req: Request, res: Response) {
  try {
    const {page, ...rest} = req.query;
    const count = await reacterModel.countDocuments();
    const records: IReacter[] = await reacterModel.find(rest).limit(5).skip((parseInt(page as string) - 1) * 5);
    res.header('x-Total-content', count);
    return res.status(200).json(records as IReacter[]);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const record = await reacterModel.findById(id as string, false);

    if (record === null || R.isEmpty(record as Object)) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    return res.status(200).json(record);
  } catch (error) {
    console.log(error);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const {id} = req.params;
    let record = await reacterModel.findById(id as string, false);

    if (record === null || R.isEmpty(record as Object)) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }

    const updated = await reacterModel.updateOne({
      _id: id
    }, req.body, {
      new: true,
      rawResult: true,

    });

    record = await reacterModel.findById(id as string, false);
    return res.status(200).json(record);
  } catch (error) {
    res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
    throw error
  }
}

export async function drop(req: Request, res: Response) {
  try {
    const {id} = req.params;
    console.log(id);
    let record = await reacterModel.findById(id as string, false);
    console.log(record)
    if (record === null || R.isEmpty(record as Object)) {
      return res.status(404).json({
        message: "Data already Deleted",
      });
    }

    let { deletedCount } = await reacterModel.deleteOne({_id: id});
    if (deletedCount !== 1) {
      return res.status(200).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404
      });
    }
    return res.status(200).json({
      message: httpReponseMessages.SUCESS_200
    });
  } catch (error) {
    res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
    throw error
  }
}

export async function store_follows(req: Request, res: Response) {
  try {
    
    const {photographerId} = req.query;
    const {id} = req.params;

    const hasPhotographer = await photographerModel.exists({
      _id: photographerId
    });
    if (!hasPhotographer) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
        resouce: 'Photographer'
      });
    }
    const hasReacter = await reacterModel.exists({
      _id: id
    });
    if (!hasReacter) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
        resouce: 'Reacter'
      });
    }


    //
    const wasSaved = await redis_socket.sadd(`following:${id}`, photographerId) && await redis_socket.sadd(`followers:${photographerId}`, id);
  
    if (!wasSaved) {
      return res.status(200).json({
        message: 'A unexpected problem ocurred'
      })
    }
    const offset = await redis_socket.scard(`followers:${photographerId}`);
    await redis_socket.hset(`follower:${photographerId}`, id, offset+1);
    const offsets = await redis_socket.hgetall(`follower:${photographerId}`);
    console.log(offsets);
    return res.status(201).json({
      message: httpReponseMessages.SUCESS_201
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
  }

}

export async function index_follows(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {page = 0} = req.query;

    const hasReacter = await reacterModel.exists({
      _id: id
    });
    if (!hasReacter) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
        resouce: 'Reacter'
      });
    }
    const following = await redis_socket.smembers(`following:${id}`);
    const count: unknown = await redis_socket.scard(`following:${id}`);
    res.header('x-Total-content', (count as string));
    const result = paginate(following, 5, (page as unknown as number));
    const followObject = [];
    for (let iterator of result) {
      const {name} = await photographerModel.findById(iterator);
      followObject.push({
        name: name,
        id: iterator
      });
    }
    return res.status(200).json(followObject);
  } catch (error) {
    
  }
}

export async function get_follow(req: Request, res: Response) {
  try {
    const {id, fid} = req.params;
    let hasRecord = await reacterModel.exists({
      _id: id
    });

    if (!hasRecord) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const record = await redis_socket.sismember(`following:${id}`, fid);

    if (!record) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404
      });
    }
    const {name} = await photographerModel.findById(fid);
    return res.status(200).json({
      name: name,
      id: fid
    })
  } catch (error) {
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
  }
}

export async function delete_follow(req: Request, res: Response) {
  try {
    const {id, fid} = req.params;
    let hasRecord = await reacterModel.exists({
      _id: id
    });

    if (!hasRecord) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const record = await redis_socket.sismember(`following:${id}`, fid);

    if (!record) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404
      });
    }
    await redis_socket.srem(`following:${id}`, fid);
    await redis_socket.srem(`followers:${fid}`, id);
    return res.status(200).json({
      message: httpReponseMessages.SUCESS_200
    });
  } catch (error) {
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
  }
}

export async function react(req: Request, res: Response) {
  try {

    const { post_id, action } = req.query;
    const {id} = req.params;
    const hasRecord = await postModel.exists({
      _id: post_id
    });

    if (!hasRecord) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const {owner}: IPost = await postModel.findById(post_id);
    const offset = await redis_socket.hget(`follower:${owner}`, id);
    await redis_socket.setbit(`likes:${post_id}`, parseInt(offset as string), (action as unknown as number));
    const liked = await redis_socket.getbit(`likes:${post_id}`,  parseInt(offset as string));
    return res.status(201).json({
      message: httpReponseMessages.SUCESS_201,
      action: liked
    })
  } catch (error) {
    
  }
}