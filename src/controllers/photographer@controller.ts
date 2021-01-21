import { Request, Response } from 'express';
import { IPhotographer, httpReponseMessages } from '../__constants__';
import * as R from 'ramda';
import photographerModel from '../models/Photographer';

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