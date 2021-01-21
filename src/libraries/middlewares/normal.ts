import bp from 'body-parser';
import morgan from 'morgan';
import {Application, json, urlencoded} from 'express';

// eslint-disable-next-line require-jsdoc
export default function(app: Application) {
  app.use(json());
  app.use(urlencoded({extended: false}));
  app.use(morgan('dev'));
};
