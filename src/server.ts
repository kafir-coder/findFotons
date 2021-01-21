import {Server} from 'http';
import express, {Request, Response} from 'express';
import {config} from 'dotenv';
import RedisConnect from './database/index';
import routes from './routes';
import connectMongo from './database/mongo-connection';
config();

const app = express();
const redis = new RedisConnect(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)
redis.setConnection();
if (process.env.NODE_ENV === 'development') {
  const midd = require('./libraries/middlewares/normal');
  midd.default(app);
}
if (process.env.NODE_ENV === 'production') {
  const midd = require('./libraries/middlewares/production');
  midd.default(app);
}
routes(app);

app.get('/', function(req: Request, res: Response) {
  res.send("Olá mundo");
});

const httpServer = new Server(app);
httpServer.listen(process.env.NODE_PORT, function() {
  connectMongo();
  console.log(`App running on port ${process.env.NODE_PORT}`)
});

export const redis_socket = redis.getConnection();