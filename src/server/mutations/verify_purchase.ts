"use server";
import "server-only";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { desc, eq } from "drizzle-orm";
import { bids, listings } from "@/server/db/schema";
import getSchema, { schemaType } from "@/lib/input_schemas/verify_purchase";
import { ratelimit } from "@/server/ratelimit";
import { redis } from "@/server/redis";
import { getVerificationRedisKey } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export default async function verifyPurchase(data: schemaType) {
  const formSchema = getSchema();
  const res = formSchema.safeParse(data);
  if (!res.success) throw new Error(res.error.errors[0].message);
  data = res.data;

  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const limited = await ratelimit.mutation.limit(user.user.id);
  if (!limited.success) throw new Error(`Ratelimited`);

  const listing = await db.query.listings.findFirst({
    where: eq(listings.listingId, data.listingId),
    with: {
      bids: {
        orderBy: desc(bids.bidDate),
      },
    },
  });
  if (!listing) throw new Error("Listing not found");

  const timeleft = listing.endDate.getTime() - new Date().getTime();
  if (listing.status === "active" && timeleft > 0)
    throw new Error("Listing is active");

  if (listing.status === "sold") throw new Error("Already verified");

  if (!listing.bids.length || listing.bids[0].bidderId != user.user.id)
    throw new Error("User is not the highest bidder");

  const otp: string | null = `${await redis.get(
    getVerificationRedisKey(data.listingId)
  )}`;
  if (!otp) throw new Error("Ask the seller to generate a new OTP");

  if (otp !== data.otp) throw new Error("Invalid OTP entered");

  await db
    .update(listings)
    .set({ status: "sold" })
    .where(eq(listings.listingId, data.listingId));

  revalidatePath(`/listing/${listing.listingId}`);
}
