import "server-only";
import { db } from "@/server/db";

export async function getListings() {
  "use server";
  return await db.query.listings.findMany({
    orderBy: (listings, { desc }) => [desc(listings.startDate)],
    with: {
      seller: true,
      media: {
        limit: 1,
      },
      bids: true,
    },
  });
}
