import { Router } from 'express';
import { index, get, update, drop} from '../controllers/agency@controller';

const agency = Router();

agency.get('/', index);
agency.get('/:id', get);
agency.put('/:id', update);
agency.delete('/:id', drop);

export default agency;
