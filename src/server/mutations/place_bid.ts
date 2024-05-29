"use server";
import "server-only";
import getSchema, { schemaType } from "@/lib/input_schemas/new_bid";
import { getServerAuthSession } from "@/server/auth";
import { getListing } from "@/server/queries/get_listing";
import { db } from "../db";
import { bids } from "../db/schema";
import { revalidatePath } from "next/cache";

export default async function placeBid(data: schemaType) {
  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const listing = await getListing(data.listingId);
  if (!listing) throw new Error("Listing does not exist");

  if (listing.status !== "active") throw new Error("Listing is inactive");
  if (listing.sellerId === user.user.id) throw new Error("Unauthorized");

  const { formSchema } = getSchema(listing.currentPrice);
  const res = formSchema.safeParse(data);
  if (!res.success) throw new Error(res.error.errors[0].message);

  const inserted = await db.transaction(async (tx) => {
    return await tx
      .insert(bids)
      .values({
        listingId: data.listingId,
        bidderId: user.user.id,
        amount: res.data.bid,
      })
      .returning();
  });

  console.log("New bid:", inserted.length ? inserted[0] : inserted);
  revalidatePath(`/listing/${listing.listingId}`);
}
