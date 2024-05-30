"use server";
import "server-only";
import { db } from "@/server/db";
import getIp from "@/server/ip";
import { ratelimit } from "@/server/ratelimit";

export async function getListings() {
  const ip = getIp();
  const limited = await ratelimit.query.limit(ip);
  if (!limited.success && ip.length)
    throw new Error(
      `Try again after ${Math.ceil((limited.reset - Date.now()) / 1000)} second(s)`
    );
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

export type getListingsType = Awaited<ReturnType<typeof getListings>>;
