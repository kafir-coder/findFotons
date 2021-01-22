import { Router } from 'express';
import {index, get, update, drop, store_follows, index_follows, get_follow, delete_follow } from '../controllers/reacter@controller';

const reacter = Router();
reacter.get('/', index);
reacter.get('/:id', get);
reacter.put('/:id', update);
reacter.delete('/:id', drop);
reacter.post('/:id/follows/', store_follows);
reacter.get('/:id/follows/', index_follows);
reacter.get('/:id/follows/:fid', get_follow);
reacter.delete('/:id/follows/:fid', delete_follow);

export default reacter;