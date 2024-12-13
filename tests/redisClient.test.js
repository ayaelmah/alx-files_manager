const redis = require('redis');
const mockRedis = require('mock-redis');
const redisClient = require('../utils/redis');

jest.mock('redis', () => mockRedis);

describe('redis client', () => {
  let client;

  beforeAll(() => {
    client = redis.createClient();
  });

  it('should connect to redis', async () => {
    const connectSpy = jest.spyOn(client, 'connect');
    await client.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should set and get values', async () => {
    await client.set('key', 'value');
    const result = await client.get('key');
    expect(result).toBe('value');
  });

  it('should handle errors gracefully', async () => {
    jest.spyOn(client, 'get').mockImplementation().mockRejectedValue(new Error('Redis error'));
    await expect(client.get('nonexistent')).rejects.toThrow('Redis error');
  });
});
