import "server-only";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { listings } from "../db/schema";

export async function getListing(id: number) {
  "use server";
  if (isNaN(id)) return undefined;
  const data = await db.query.listings.findFirst({
    with: {
      seller: true,
      media: true,
      bids: {
        orderBy(fields, operators) {
          return operators.desc(fields.amount);
        },
        with: {
          bidder: true,
        },
      },
    },
    where: eq(listings.listingId, id),
  });
  const timeleft = data ? data.endDate.getTime() - new Date().getTime() : 0;
  if (timeleft <= 0 && data) data.status = "expired";
  return data;
}
