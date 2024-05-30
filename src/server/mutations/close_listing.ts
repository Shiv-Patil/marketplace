"use server";
import "server-only";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { listings } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { ratelimit } from "@/server/ratelimit";

const prepared = db
  .update(listings)
  .set({ status: "expired" })
  .where(eq(listings.listingId, sql.placeholder("id")))
  .returning()
  .prepare("close_listing");

export default async function closeListing({
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
  if (listing.status !== "active") throw new Error("Listing is already closed");

  const updated = await prepared.execute({ id: listingId });

  revalidatePath(`/listing/${listingId}`);
}
