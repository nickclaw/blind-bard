import * as Redis from 'ioredis';

async function create() {
  const redis = new Redis({
    host: 'redis.local',
    port: 6379,
  });

  await redis.ping();

  return redis;
}

export default create();