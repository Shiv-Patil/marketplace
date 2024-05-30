"use client";

import { getListingsType } from "@/server/queries/get_listings";
import Listing, { ListingSkeleton } from "@/components/Listing";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "./ui/use-toast";

export const listingsContainerStyle = cn(
  "grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4"
);

export default function Listings({
  listings,
  error,
}: {
  listings: getListingsType;
  error?: string;
}) {
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error]);
  return listings.length || error ? (
    <div className={listingsContainerStyle}>
      {error ? (
        <ListingSkeleton />
      ) : (
        listings.map((e, index) => <Listing data={e} key={index} />)
      )}
    </div>
  ) : (
    <div className="relative w-full py-6 text-center text-sm text-secondary-foreground">
      No listings
    </div>
  );
}
