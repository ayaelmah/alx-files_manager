import redis from 'ioredis';

class RedisClient {
  constructor() {
    this.client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  async isAlive() {
    return new Promise((resolve, reject) => {
      this.client.ping((err, res) => {
        if (err) {
          console.error('Error pinging Redis:', err);
          reject(false);
        } else {
          console.log('Redis ping response:', res);
          resolve(res === 'PONG');
        }
      });
    });
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting key from Redis:', error);
      return null;
    }
  }

  async set(key, value, durationInSeconds) {
    try {
      await this.client.setex(key, durationInSeconds, String(value));
    } catch (error) {
      console.error('Error setting key in Redis:', error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key in Redis:', error);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
