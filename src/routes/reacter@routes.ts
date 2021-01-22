import { Router } from 'express';
import {index, get, update, drop } from '../controllers/reacter@controller';

const reacter = Router();
reacter.get('/', index);
reacter.get('/:id', get);
reacter.put('/:update', update);
reacter.delete('/:drop', drop);

export default reacter;