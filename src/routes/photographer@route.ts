import { Router } from 'express';
import {} from '../controllers/photographer@controller';
import { store, index, get, update, drop } from '../controllers/photographer@controller';

const photographer = Router();

photographer.post('/', store);
photographer.get('/', index);
photographer.get('/:id', get);
photographer.put('/:id', update);
photographer.delete('/:id', drop);

export default photographer;