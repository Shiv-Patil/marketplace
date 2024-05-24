import "server-only";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { listings } from "../db/schema";

export async function getListing(id: number) {
  "use server";
  if (isNaN(id)) return null;
  return await db.query.listings.findFirst({
    with: {
      seller: true,
      media: true,
      bids: true,
    },
    where: eq(listings.listingId, id),
  });
}
