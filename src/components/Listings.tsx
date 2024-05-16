import { getListings } from "@/server/queries/getListings";
import Listing from "./Listing";

export default async function Listings() {
  const listings = await getListings();

  return listings.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {listings.map((e) => (
        <Listing
          coverImage={e.media.url}
          name={e.listing.name}
          description={e.listing.shortDescription}
          price={+e.listing.basePrice}
          sellerAvatar={e.user.image}
          sellerName={e.user.name}
          endDate={e.listing.endDate}
          bids={e.bids.length}
          key={e.listing.listingId}
        />
      ))}
    </div>
  ) : (
    <div className="relative w-full py-14 text-center text-sm text-secondary-foreground">
      No listings to show
    </div>
  );
}
