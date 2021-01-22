// @ts-nocheck
import {httpReponseMessages} from '../__constants__';
import * as jot from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {redis_socket} from '../../server';
import {httpReponseMessages} from '../__constants__';

/**
 *
 * @param {Request} req object containing all request information
 * @param {Response} res object containing all response informatin
 * @param {NextFunction} next the next function to be called
 */
async function auth(req: Request, res: Response, next: NextFunction) {
  let authToken = req.header('authorization');

  if (!authToken) {
    return res.status(401).send(httpReponseMessages.ANAUTHORIZED_401);
  }

  try {
    if (authToken.startsWith('Bearer session:')) {
      // Remove Bearer from string
      authToken = authToken.replace('Bearer session:', '');
    }
    // const verified = await jot.verify(authToken, process.env.JOT_SECRET);
    //req.agent = verified;
    redis_socket.get(`token:${authToken}`).then(value => {
      if (value === null) return res.status(401).send(httpReponseMessages.ANAUTHORIZED_401);
      next();
    });
  } catch (err) {
    res.status(401).send({
      message: httpReponseMessages.ANAUTHORIZED_401,
    });
  }
};

export default auth;




// @ts-nocheck
/* eslint-disable require-jsdoc */
/**
 *
 * Nesta controller irão se fazer:
 *  cadastramento de agentes (customer e companhia)
 *  login de agente (customer e companhia)
 */




// @ts-nocheck
