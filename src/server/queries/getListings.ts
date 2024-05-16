import "server-only";
import { db } from "@/server/db";
import {
  Listing as ListingType,
  Media as MediaType,
  User as UserType,
  Bid as BidType,
  bids as bidsTable,
  listings as listingsTable,
  media as mediaTable,
  users as usersTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getListings() {
  const rows = await db
    .select()
    .from(listingsTable)
    .innerJoin(usersTable, eq(usersTable.id, listingsTable.sellerId))
    .innerJoin(mediaTable, eq(listingsTable.listingId, mediaTable.listingId))
    .leftJoin(bidsTable, eq(bidsTable.listingId, listingsTable.listingId));
  const listings = rows.reduce<
    Record<
      number,
      {
        listing: ListingType;
        user: UserType;
        media: MediaType;
        bids: BidType[];
      }
    >
  >((acc, row) => {
    const listing = row.listing;
    const user = row.user;
    const media = row.media;
    if (!acc[listing.listingId]) {
      acc[listing.listingId] = { listing, user, media, bids: [] };
    }
    if (row.bid) acc[listing.listingId].bids.push(row.bid);
    return acc;
  }, {});
  return Object.values(listings).sort(
    (a, b) => b.listing.startDate.getTime() - a.listing.startDate.getTime()
  );
}

export type getListingsType = {
  listing: ListingType;
  user: UserType;
  media: MediaType;
  bids: BidType[];
}[];
