"use server";
import "server-only";
import { db } from "@/server/db";
import { ratelimit } from "@/server/ratelimit";
import getIp from "@/server/ip";

export async function getUser({ userId }: { userId: string }) {
  const limited = await ratelimit.query.limit(getIp());
  if (!limited.success)
    throw new Error(
      `Try again after ${Math.ceil((limited.reset - Date.now()) / 1000)} second(s)`
    );
  const data = await db.query.users.findFirst({
    with: {
      listings: {
        orderBy: (listings, { desc }) => [desc(listings.startDate)],
        with: {
          bids: {
            orderBy(fields, operators) {
              return operators.desc(fields.bidDate);
            },
          },
          media: {
            limit: 1,
          },
          seller: true,
        },
      },
    },
    where: (users, { eq }) => eq(users.id, userId),
  });
  return data
    ? {
        ...data,
        listings: data.listings.map((el) => {
          const timeleft = el.endDate.getTime() - new Date().getTime();
          return {
            currentPrice: el.bids.length ? el.bids[0].amount : el.basePrice,
            ...el,
            status: timeleft <= 0 ? "expired" : el.status,
          };
        }),
      }
    : undefined;
}

export type getUserType = Awaited<ReturnType<typeof getUser>>;
