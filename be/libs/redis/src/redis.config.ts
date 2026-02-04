import { registerAs } from '@nestjs/config';

export const RedisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  db: parseInt(process.env.REDIS_DB || '0', 10),
}));
