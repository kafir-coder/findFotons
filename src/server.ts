import {Server} from 'http';
import express, {Request, Response} from 'express';
import {config} from 'dotenv';
import RedisConnect from './database/index';
import routes from './routes';


config();
const app = express();
const redis = new RedisConnect(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)
redis.setConnection();
routes(app);

app.get('/', function(req: Request, res: Response) {
  res.send("Olá mundo");
});

const httpServer = new Server(app);
httpServer.listen(process.env.NODE_PORT, function() {
  console.log(`App running on port ${process.env.NODE_PORT}`)
});

export const redis_socket = redis.getConnection;