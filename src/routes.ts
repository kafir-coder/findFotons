import agency from './routes/agency@route';
import photographer from './routes/photographer@route';
import reacter from './routes/reacter@routes';
import auth from './routes/auth@routes';
import {Express} from 'express'; 

const router = (app: Express) => {
  app.use('/auth', auth)
  app.use('/photographers', photographer);
  app.use('/agencies', agency);
  app.use('/reacters', reacter);
}

export default router