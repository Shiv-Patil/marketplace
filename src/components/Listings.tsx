"use client";

import { getListingsType } from "@/server/queries/get_listings";
import Listing from "@/components/Listing";
import { cn } from "@/lib/utils";

export const listingsContainerStyle = cn(
  "grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4"
);

export default function Listings({ listings }: { listings: getListingsType }) {
  return listings.length ? (
    <div className={listingsContainerStyle}>
      {listings.map((e, index) => (
        <Listing data={e} key={index} />
      ))}
    </div>
  ) : (
    <div className="relative w-full py-6 text-center text-sm text-secondary-foreground">
      No listings
    </div>
  );
}
