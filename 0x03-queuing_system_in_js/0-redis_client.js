import { createClient } from 'redis';

const redisClient = () => {
  const client = createClient();

  client.on('connect', () => {
    console.log('Redis client connected to the server');
  }).on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  });
};

redisClient();
