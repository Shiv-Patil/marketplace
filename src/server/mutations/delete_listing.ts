"use server";
import "server-only";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { listings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ratelimit } from "@/server/ratelimit";

export default async function deleteListing({
  listingId,
}: {
  listingId: number;
}) {
  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const limited = await ratelimit.mutation.limit(user.user.id);
  if (!limited.success) throw new Error(`Ratelimited`);

  const listing = await db.query.listings.findFirst({
    where: eq(listings.listingId, listingId),
  });
  if (!listing) throw new Error("Listing does not exist");

  if (listing.sellerId !== user.user.id) throw new Error("Unauthorized");

  await db.delete(listings).where(eq(listings.listingId, listingId));

  revalidatePath(`/listings`);
}