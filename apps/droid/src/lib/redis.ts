import { Redis } from "@upstash/redis";
import { env } from "../env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL ?? "https://mock.upstash.io",
  token: env.UPSTASH_REDIS_REST_TOKEN ?? "mock",
});
