import {Server} from 'http';
import express, {Request, Response} from 'express';
import {config} from 'dotenv';
import RedisConnect from './database/';
config();
const app = express();
const redis = new RedisConnect(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)
redis.setConnection();

app.get('/', function(req: Request, res: Response) {
  res.send("Olá mundo");
});

const httpServer = new Server(app);
httpServer.listen(process.env.NODE_PORT, function() {
  console.log(`App running on port ${process.env.NODE_PORT}`)
});