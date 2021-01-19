import IO, {Redis} from 'ioredis';
import {config} from 'dotenv';

config();

class RedisConnection {
  private readonly port: (string | undefined) = process.env.REDIS_PORT;
  private readonly host: (string | undefined) = process.env.REDIS_HOST;
  private connectionObject: Redis;
  
  constructor (port: (string | undefined), host: (string | undefined)) {
    this.port = port;
    this.host = host;
  }
  setConnection() {
    try {
      this.connectionObject = new IO(this.port, {
        host: this.host,
      });
      console.log('Redis connected on port', this.port);
    } catch(exception) {
      console.log('Unable to connect to redis server');
    }
    
  }
  getConnection() {
    return this.connectionObject;
  }
}

export default RedisConnection;