// @ts-nocheck
import bp from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compress from 'compression';
import helmet from 'helmet';
import {Application} from 'express';

// eslint-disable-next-line require-jsdoc
export default function(app: Application) {
  app.use(bp.json());
  app.use(bp.urlencoded({extended: false}));
  app.use(morgan('combined'));
  app.use(helmet);
  app.use(compress);
  app.use(cors);
};
