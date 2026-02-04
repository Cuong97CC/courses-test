import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redlock, { Lock, Settings } from 'redlock';

@Injectable()
export class LockService {
  private readonly redlock: Redlock;

  constructor(@InjectRedis() private readonly redis: Redis) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.redlock = new Redlock([this.redis]);
  }

  async lock(
    resources: string[],
    ttlInSec: number,
    settings?: Partial<Settings>,
  ): Promise<Lock> {
    return await this.redlock.acquire(resources, ttlInSec * 1000, settings);
  }
}
