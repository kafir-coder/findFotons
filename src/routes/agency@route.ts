import { Router } from 'express';
import {store, index, get, update, drop} from '../controllers/agency@controller';

const agency = Router();


agency.post('/', store);
agency.get('/', index);
agency.get('/:id', get);
agency.put('/:id', update);
agency.delete('/:id', drop);

export default agency;
