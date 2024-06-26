import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/server/redis";
import getIp, { FALLBACK_IP_ADDRESS } from "@/server/ip";

export const ratelimit = {
  query: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(4, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
  mutation: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(4, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
  uploadthing: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(2, "10 s"),
    prefix: "@upstash/ratelimit",
  }),
  bid: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
  createListing: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
  message: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
};

export async function ratelimitWithIp() {
  const ip = getIp();
  if (ip !== FALLBACK_IP_ADDRESS) {
    const limited = await ratelimit.query.limit(ip);
    if (!limited.success)
      throw new Error(
        `Try again after ${Math.ceil((limited.reset - Date.now()) / 1000)} second(s)`
      );
  }
}
