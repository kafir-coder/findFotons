import {
  Router
} from 'express';
import auth from '../libraries/middlewares/authentication';
import {
  index,
  get,
  update,
  drop,
  index_followers,
  get_follower,
  publish,
  index_publication,
  get_publication,
  index_photos,
  get_photo
} from '../controllers/photographer@controller';

const photographer = Router();
//photographer.use(auth);
photographer.get('/', index);
photographer.get('/:id', get);
photographer.put('/:id', update);
photographer.delete('/:id', drop);
photographer.get('/:id/followers/', index_followers);
photographer.get('/:id/followers/:fid', get_follower);
photographer.post('/:id/posts/', publish);
photographer.get('/:id/posts', index_publication);
photographer.get('/:id/posts/:pid', get_publication);
photographer.get('/:id/posts/:pid/photos', index_photos);

export default photographer;