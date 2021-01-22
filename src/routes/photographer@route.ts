import { Router } from 'express';
import auth from '../libraries/middlewares/authentication';
import { index, get, update, drop } from '../controllers/photographer@controller';

const photographer = Router();
photographer.use(auth);
photographer.get('/', index);
photographer.get('/:id', get);
photographer.put('/:id', update);
photographer.delete('/:id', drop);

export default photographer;