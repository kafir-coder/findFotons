import agency from './routes/agency@route';
import photographer from './routes/photographer@route';
import reacter from './routes/reacter@routes';
import {Express} from 'express'; 

const router = (app: Express) => {
  app.use('/photographers', photographer);
  app.use('/agencies', agency);
  app.use('/reacters', reacter);
}

export default router