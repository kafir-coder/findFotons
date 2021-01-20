import { Router } from 'express';
import {} from '../controllers/reacter@controller';
import { store, index, get, update, drop } from '../controllers/reacter@controller';

const reacter = Router();

reacter.post('/', store);
reacter.get('/', index);
reacter.get('/:id', get);
reacter.put('/:update', update);
reacter.delete('/:drop', drop);

export default reacter;