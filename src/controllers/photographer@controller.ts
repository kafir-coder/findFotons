import { Request, Response } from 'express';
import { IPhotographer, httpReponseMessages, IPost } from '../__constants__';
import * as R from 'ramda';
import photographerModel from '../models/Photographer';
import reacterModel from '../models/Reacter';
import {redis_socket} from '../server';
import paginate from '../libraries/helpers/paginate';
import postModel from '../models/Post';

export async function index(req: Request, res: Response) {
  try {
    if (req.headers.role !== 'reacter') {
      return res.status(401).send({
        message: httpReponseMessages.ANAUTHORIZED_401
      });
    }
    const {page, ...rest} = req.query;
    const count = await photographerModel.countDocuments();
    const records: IPhotographer[] = await photographerModel.find(rest).limit(5).skip((parseInt(page as string) - 1) * 5);
    res.header('x-Total-content', count);
    return res.status(200).json(records as IPhotographer[]);

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
    const record = await photographerModel.findById(id as string, false);

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
    let record = await photographerModel.findById(id as string, false);

    if (record === null || R.isEmpty(record as Object)) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }

    const updated = await photographerModel.updateOne({
      _id: id
    }, req.body, {
      new: true,
      rawResult: true,

    });

    record = await photographerModel.findById(id as string, false);
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
    let record = await photographerModel.findById(id as string, false);
    if (record === null || R.isEmpty(record as Object)) {
      return res.status(404).json({
        message: "Data already Deleted",
      });
    }

    let { deletedCount } = await photographerModel.deleteOne({_id: id});
    if (deletedCount === 1) {
      return res.status(200).json({
        message: httpReponseMessages.SUCESS_200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500
    })
    throw error
  }
}

export async function index_followers(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {page = 0} = req.query;

    const hasReacter = await photographerModel.exists({
      _id: id
    });
    if (!hasReacter) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
        resouce: 'Reacter'
      });
    }
    const followers = await redis_socket.smembers(`followers:${id}`);
    const count: unknown = await redis_socket.scard(`followers:${id}`);
    res.header('x-Total-content', (count as string));
    const result = paginate(followers, 5, (page as unknown as number));
    const followObject = [];
    for (let iterator of result) {
      const {name} = await reacterModel.findById(iterator);
      followObject.push({
        name: name,
        id: iterator
      });
    }
    return res.status(200).json(followObject);
  } catch (error) {
    
  }
}

export async function get_follower(req: Request, res: Response) {
  try {
    const {id, fid} = req.params;
    let hasRecord = await photographerModel.exists({
      _id: id
    });

    if (!hasRecord) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const record = await redis_socket.sismember(`followers:${id}`, fid);

    if (!record) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404
      });
    }
    const {name} = await reacterModel.findById(fid);
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

export async function publish(req: Request, res: Response) {
  try {
    
    const {photos, tags, description}: IPost = req.body;
    const {id} = req.params;

    const saved = await postModel.create({
      photos, tags, owner: id, description
    });
    return res.status(201).json(saved);
  } catch (error) {
    
  }
}

export async function index_publication(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {page = 1} = req.query;
    let records = await postModel.find({
      owner: id
    }).limit(5).skip((parseInt(page as string) - 1) * 5);

    if (R.isEmpty(records) || records === null) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    
    return res.status(200).json({
      message: records
    });

  } catch (error) {
    
  }
}

export async function get_publication(req: Request, res: Response) {
  try {
    const {id, pid} = req.params;
    const record = await photographerModel.exists({
      _id: id
    });
    if (!record) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const publication = await postModel.findById(pid); 
    return res.status(200).json(publication);

  } catch (error) {
    
  }
}

export async function index_photos(req: Request, res: Response) {
  try {
    const {id, pid} = req.params;
    const hasRecord = await photographerModel.exists({
      _id: id
    });
    if (!hasRecord) {
      return res.status(404).json({
        message: httpReponseMessages.FILE_NOT_FOUND_404,
      });
    }
    const {photos}: IPost = await postModel.findById({
      _id: pid 
    });

    return res.status(200).json(photos);

  } catch (error) {
    
  }
}