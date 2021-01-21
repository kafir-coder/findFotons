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
    const {contacts} = body;
    const styles = body.styles.split(',');
    redis_socket.hgetall(`photographer:${contacts}`).then(async (record: IPhotographer) => {
      if (!R.isEmpty(record)) {
        return res.status(200).send({
          message: "This user already exists"
        });
      }
      const id = `${await crypto.randomBytes(10).toString('base64')}:${contacts}`;
      const token = `session:${id}`;

      const photographer: IPhotographer = {id, ...body};
      redis_socket.hmset(`photographer:${contacts}`, photographer).then(OK_MESSAGE => {
        if (OK_MESSAGE !== 'OK') return;
        redis_socket.set(`token:${id}`, token);
        redis_socket.get(`token:${id}`).then(value => {
          redis_socket.hgetall(`photographer:${contacts}`).then((photographer_record: IPhotographer) => {
            return res.status(201).send({...photographer_record, token: value})
          });
        });
      }).catch(error => {
        throw error;
      })
    });
  } catch (e) {
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
    const styles = body.styles;
    redis_socket.hgetall(`agency:${contact}`).then(async (record: IAgency) => {
      if (!R.isEmpty(record)) {
        return res.status(200).send({
          message: "This user already exists"
        });
      }
      const id = `${await crypto.randomBytes(10).toString('base64')}:${contact}`;
      const token = `session:${id}`;

      const agency: IAgency = {id, ...body};
      redis_socket.hmset(`agency:${contact}`, agency).then(OK_MESSAGE => {
        if (OK_MESSAGE !== 'OK') return;
        redis_socket.set(`token:${id}`, token);
        redis_socket.get(`token:${id}`).then(value => {
          redis_socket.hgetall(`agency:${contact}`).then((Arecord: IAgency) => {
            return res.status(201).send({...Arecord, token: value})
          });
        });
      }).catch(error => {
        throw error;
      })
    });
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
    const styles = body.styles;
    redis_socket.hgetall(`reacter:${contact}`).then(async (record: IReacter) => {
      if (!R.isEmpty(record)) {
        return res.status(200).send({
          message: "This user already exists"
        });
      }
      const id = `${await crypto.randomBytes(10).toString('base64')}:${contact}`;
      const token = `session:${id}`;

      const reacter: IReacter = {id, ...body};
      redis_socket.hmset(`reacter:${contact}`, reacter).then(OK_MESSAGE => {
        if (OK_MESSAGE !== 'OK') return;
        redis_socket.set(`token:${id}`, token);
        redis_socket.get(`token:${id}`).then(value => {
          redis_socket.hgetall(`reacter:${contact}`).then((Rrecord: IReacter) => {
            return res.status(201).send({...Rrecord, token: value})
          });
        });
      }).catch(error => {
        throw error;
      })
    });
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
    const body: ILogin = req.body;
    redis_socket.hgetall(`${body.role}:${body.contact}`).then((Genericrecord: (IReacter | IPhotographer | IAgency)) => {
      if (R.isEmpty(Genericrecord)) {
        return res.status(200).send({
          message: httpReponseMessages.FILE_NOT_FOUND_404
        });
      }

      if (Genericrecord.password !== body.password) {
        return res.status(401).send({
          message: httpReponseMessages.ANAUTHORIZED_401
        });
      }
      const {id} = Genericrecord;
      const token = `session:${id}`;
      redis_socket.set(`token:${id}`, token).then(value => {
        redis_socket.get(`token:${id}`).then(value => {
          return res.status(201).send({...Genericrecord, token: value})
        });
      });
    });
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