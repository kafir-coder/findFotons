// @ts-nocheck
/* eslint-disable require-jsdoc */
/**
 *
 * Nesta controller irão se fazer:
 *  cadastramento de agentes (customer e companhia)
 *  login de agente (customer e companhia)
 */
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import * as R from 'ramda';
import { redis_socket } from '../server';
import {IPhotographer, IAgency, IReacter, ILogin, httpReponseMessages} from '../__constants__';
import photographerModel from '../models/Photographer';
import agencyModel from '../models/Agency';
import reacterModel from '../models/Reacter';
import * as crypto from 'crypto';
import photographer from 'routes/photographer@route';
import reacter from 'routes/reacter@routes';
import { clearScreenDown } from 'readline';

export async function registerP(req: Request, res: Response): Promise<IPhotographer> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body)
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const body: IPhotographer = req.body;
    const {contact} = body;
    const styles = body.styles.split(',');
    console.log(JSON.stringify(body.birth))
    const exists = await photographerModel.findOne({
      contact: contact
    });
    console.log(exists)
    if (exists !== null) {
      return res.status(200).send({
        message: "This user already exists"
      });
    }
    await photographerModel.create(body as IPhotographer);
    const record: IPhotographer = await photographerModel.findOne({
      contact: contact
    });
    let token = `session:${await crypto.randomBytes(10).toString('base64')}:${record.id}:${contact}:${Date.now()}`;

    await redis_socket.set(`token:${record.id}`, token);
    token = await redis_socket.get(`token:${record.id}`);
    return res.status(201).send({record, token: token})
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}

export async function registerA(req: Request, res: Response): Promise<IAgency> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body)
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const body: IAgency = req.body;
    const {contact} = body;
    const styles = body.styles.split(',');
    const exists = await agencyModel.findOne({
      contact: contact
    });
    if (exists !== null) {
      return res.status(200).send({
        message: "This user already exists"
      });
    }
    await agencyModel.create(body as IAgency);
    const record: IAgency = await agencyModel.findOne({
      contact: contact
    });
    let token = `session:${await crypto.randomBytes(10).toString('base64')}:${record.id}:${contact}:${Date.now()}`;

    await redis_socket.set(`token:${record.id}`, token);
    token = await redis_socket.get(`token:${record.id}`);
    return res.status(201).send({record, token: token})
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}

export async function registerR(req: Request, res: Response): Promise<IReacter> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body)
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const body: IReacter = req.body;
    const {contact} = body;
    const styles = body.styles.split(',');
    const exists = await reacterModel.findOne({
      contact: contact
    });
    if (exists !== null) {
      return res.status(200).send({
        message: "This user already exists"
      });
    }
    await reacterModel.create(body as IReacter);
    const record: IReacter = await reacterModel.findOne({
      contact: contact
    });
    let token = `session:${await crypto.randomBytes(10).toString('base64')}:${record.id}:${contact}:${Date.now()}`;

    await redis_socket.set(`token:${record.id}`, token);
    token = await redis_socket.get(`token:${record.id}`);
    return res.status(201).send({record, token: token})
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}
export async function login(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {contact, password, role} = req.body;

    switch (role) {
      case 'photographer':{
        const aRecord: IPhotographer = await photographerModel.findOne({
          contact: contact
        });
        if (aRecord === null) {
          return res.status(200).send({
            message: httpReponseMessages.FILE_NOT_FOUND_404
          });
        }
        const samePassword = aRecord.authenticatePhotographer(password);
        console.log(samePassword);
        if (!samePassword) {
          return res.status(491).send({
            message: httpReponseMessages.ANAUTHORIZED_401
          });
        }
        const token = `session:${await crypto.randomBytes(10).toString('base64')}:${aRecord.id}:${contact}:${Date.now()}`;
        await redis_socket.set(`token:${aRecord.id}`, token);
        return res.status(201).send({aRecord, token: token})
      }break;
      case 'agency': {
        const aRecord: IAgency = await agencyModel.findOne({
          contact: contact
        });
        if (aRecord === null) {
          return res.status(200).send({
            message: httpReponseMessages.FILE_NOT_FOUND_404
          });
        }
        const samePassword = aRecord.authenticateAgency(password)
        if (!samePassword) {
          return res.status(491).send({
            message: httpReponseMessages.ANAUTHORIZED_401
          });
        }
        const token = `session:${await crypto.randomBytes(10).toString('base64')}:${aRecord.id}:${contact}:${Date.now()}`;
        await redis_socket.set(`token:${aRecord.id}`, token);
        return res.status(201).send({aRecord, token: token})
      }break;
      case 'reacter': {
        const aRecord: IReacter = await reacterModel.findOne({
          contact: contact
        });
        if (aRecord === null) {
          return res.status(200).send({
            message: httpReponseMessages.FILE_NOT_FOUND_404
          });
        }
        const samePassword = aRecord.authenticateReacter(password)
        if (!samePassword) {
          return res.status(491).send({
            message: httpReponseMessages.ANAUTHORIZED_401
          });
        }
        const token = `session:${await crypto.randomBytes(10).toString('base64')}:${aRecord.id}:${contact}:${Date.now()}`;
        await redis_socket.set(`token:${aRecord.id}`, token);
        return res.status(201).send({aRecord, token: token})
      }break;
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer session:', '');
    redis_socket.get(`token:${token}`).then(value => {

      redis_socket.del(`token:${token}`).then(message => {
        console.log(message);
        return res.status(201).send({
          message: "logouted with sucess"
        });
      });
      
    });
  } catch (e) {
    return res.status(500).json({
      message: httpReponseMessages.SERVER_ERROR_500,
    });
  }
}