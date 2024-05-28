import { getListings } from "@/server/queries/get_listings";
import Listing from "./Listing";

export default async function Listings() {
  const listings = await getListings();

  return listings.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {listings.map((e, index) => (
        <Listing data={e} key={index} />
      ))}
    </div>
  ) : (
    <div className="relative w-full py-14 text-center text-sm text-secondary-foreground">
      No listings to show
    </div>
  );
}
