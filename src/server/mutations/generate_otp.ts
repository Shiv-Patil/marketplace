"use server";
import "server-only";
import { getServerAuthSession } from "@/server/auth";
import { ratelimit } from "@/server/ratelimit";
import { db } from "@/server/db";
import { listings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/server/redis";
import { generateOTPString, getVerificationRedisKey } from "@/lib/utils";

export default async function generateOTP({
  listingId,
}: {
  listingId: number;
}) {
  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const limited = await ratelimit.mutation.limit(user.user.id);
  if (!limited.success) throw new Error(`You are generating OTPs too fast`);

  const listing = await db.query.listings.findFirst({
    where: eq(listings.listingId, listingId),
  });
  if (!listing) throw new Error("Listing does not exist");
  if (listing.sellerId !== user.user.id) throw new Error("Unauthorized");

  const timeleft = listing.endDate.getTime() - new Date().getTime();
  if (listing.status === "active" && timeleft > 0)
    throw new Error("Listing is active");

  if (listing.status === "sold") throw new Error("Already verified");
  const otp = generateOTPString();
  await redis.set(getVerificationRedisKey(listingId), otp, {
    ex: 60 * 5, // 5-minute expiry
  });
  return otp;
}
