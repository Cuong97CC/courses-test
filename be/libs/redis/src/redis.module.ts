import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisConfig } from './redis.config';
import { RedisModule as BaseRedisModule } from '@nestjs-modules/ioredis';
import { LockService } from './services/lock.service';

@Module({
  imports: [
    ConfigModule.forFeature(RedisConfig),
    BaseRedisModule.forRootAsync({
      imports: [ConfigModule.forFeature(RedisConfig)],
      useFactory: (config: ConfigType<typeof RedisConfig>) => ({
        type: 'single',
        url: config.url,
        options: {
          db: config.db,
        },
      }),
      inject: [RedisConfig.KEY],
    }),
  ],
  providers: [CacheService, LockService],
  exports: [CacheService, LockService],
})
export class RedisModule {}
