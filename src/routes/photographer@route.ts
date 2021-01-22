import { Router } from 'express';
import auth from '../libraries/middlewares/authentication';
import { index, get, update, drop, index_followers, get_follower } from '../controllers/photographer@controller';

const photographer = Router();
photographer.use(auth);
photographer.get('/', index);
photographer.get('/:id', get);
photographer.put('/:id', update);
photographer.delete('/:id', drop);
photographer.get('/:id/followers/', index_followers);
photographer.get('/:id/followers/:fid', get_follower);

export default photographer; 