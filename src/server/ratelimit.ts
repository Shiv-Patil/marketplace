import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/server/redis";

export const ratelimit = {
  query: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(4, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  }),
  mutation: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, "10 s"),
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
