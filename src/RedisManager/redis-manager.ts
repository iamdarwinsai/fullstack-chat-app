import { url } from "inspector";
import Redis from "ioredis";
import { RedisClient } from "ioredis/built/connectors/SentinelConnector/types";

export class RedisInstance {
  private static instance: RedisInstance;
  private subscriber: Redis;
  private publisher: Redis;

  private constructor(url: string) {
    this.subscriber = new Redis(url);
    this.publisher = new Redis(url);
  }

  public static getInstance(url: string): RedisInstance {
    if (!RedisInstance.instance) {
      RedisInstance.instance = new RedisInstance(url);
    }
    return RedisInstance.instance;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  getPublisher(): Redis {
    return this.publisher;
  }
}
