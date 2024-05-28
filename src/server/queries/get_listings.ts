import "server-only";
import { db } from "@/server/db";

export async function getListings() {
  "use server";
  const data = await db.query.listings.findMany({
    orderBy: (listings, { desc }) => [desc(listings.startDate)],
    with: {
      seller: true,
      media: {
        limit: 1,
      },
      bids: {
        orderBy(fields, operators) {
          return operators.desc(fields.bidDate);
        },
      },
    },
  });
  return data.map((el) => {
    const timeleft = el.endDate.getTime() - new Date().getTime();
    return {
      currentPrice: el.bids.length ? el.bids[0].amount : el.basePrice,
      ...el,
      status: timeleft <= 0 ? "expired" : el.status,
    };
  });
}

export type getListingType = Awaited<ReturnType<typeof getListings>>;
