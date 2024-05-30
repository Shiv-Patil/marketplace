"use server";
import "server-only";
import getSchema, { schemaType } from "@/lib/input_schemas/new_listing";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { listings, media } from "@/server/db/schema";
import { and, inArray, isNull } from "drizzle-orm";
import { ratelimit } from "@/server/ratelimit";

export default async function createNewListing(data: schemaType) {
  const formSchema = getSchema();
  const res = formSchema.safeParse(data);
  if (!res.success) throw new Error(res.error.errors[0].message);
  data = res.data;

  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const limited = await ratelimit.mutation.limit(user.user.id);
  if (!limited.success) throw new Error(`Ratelimited`);

  const createLimited = await ratelimit.createListing.limit(user.user.id);
  if (!createLimited.success)
    throw new Error(
      `Please wait ${Math.ceil((createLimited.reset - Date.now()) / 1000)} seconds before listing another item`
    );

  const listingId = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(listings)
      .values({
        basePrice: data.startingPrice,
        name: data.title,
        sellerId: user.user.id,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        endDate: data.endDate,
      })
      .returning()
      .catch(() => {});
    if (!inserted || !inserted.length) {
      throw new Error("Failed to create listing");
    }
    await tx
      .update(media)
      .set({ listingId: inserted[0].listingId })
      .where(and(inArray(media.mediaId, data.media), isNull(media.listingId)));
    return inserted[0].listingId;
  });

  return listingId;
}
