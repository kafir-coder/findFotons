import {Request, Response, response} from 'express';
import {IPhotographer, IFollowers, IFollowing} from '../__constants__';
import { redis_socket } from '../server';

export async function index(req: Request, res: Response): Promise<IPhotographer[]> {
  try {
  } catch (error) {
    
  } 
}

export async function store(req: Request, res: Response): Promise<IPhotographer> {
  try {
    console.log(req.body);
  } catch (error) {
    
  }
}

export async function get(req: Request, res: Response): Promise<IPhotographer> {
  try {
    
  } catch (error) {
    
  }
}

export async function update(req: Request, res: Response): Promise<Boolean> {
  try {
    
  } catch (error) {
    
  }
}

export async function drop(req: Request, res: Response): Promise<Boolean> {
  try {
    
  } catch (error) {
    
  }
}