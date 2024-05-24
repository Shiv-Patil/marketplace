import { getListings } from "@/server/queries/getListings";
import Listing from "./Listing";

export default async function Listings() {
  const listings = await getListings();

  return listings.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {listings.map((e) => (
        <Listing
          id={e.listingId}
          coverImage={e.media.length ? e.media[0].url : ""}
          name={e.name}
          description={e.shortDescription}
          price={+e.basePrice}
          sellerAvatar={e.seller.image}
          sellerName={e.seller.name}
          endDate={e.endDate}
          bids={e.bids.length}
          key={e.listingId}
        />
      ))}
    </div>
  ) : (
    <div className="relative w-full py-14 text-center text-sm text-secondary-foreground">
      No listings to show
    </div>
  );
}
