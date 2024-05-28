"use server";
import "server-only";
import { getServerAuthSession } from "@/server/auth";
import { getListing } from "@/server/queries/get_listing";
import { db } from "..";
import { revalidatePath } from "next/cache";
import { listings } from "../schema";
import { eq, sql } from "drizzle-orm";

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
  if (!user) throw new Error("Unauthorized. Please log in again.");

  const listing = await getListing(listingId);
  if (!listing) throw new Error("Listing does not exist");

  if (listing.sellerId !== user.user.id)
    throw new Error("Only the seller can close listing");
  if (listing.status !== "active") throw new Error("Listing is already closed");

  const updated = await prepared.execute({ id: listingId });

  console.log("Closed listing:", updated);
  revalidatePath(`/listing/${listingId}`);
}
