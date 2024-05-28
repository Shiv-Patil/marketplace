import { ListingSkeleton } from "@/components/Listing";
import Listings, { listingsContainerStyle } from "@/components/Listings";
import Hero from "@/components/homepage/Hero";
import MaxWidthDiv from "@/components/MaxWidthDiv";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { getListings } from "@/server/queries/get_listings";

async function ListingsWrapper() {
  const listings = await getListings();
  return <Listings listings={listings} />;
}

export default function Home() {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <Hero />

          <section
            about="recent listings"
            className="flex flex-col gap-4 py-10"
          >
            <h1 className="text-xl">Recent listings</h1>
            <Separator />
            <Suspense
              fallback={
                <div className={listingsContainerStyle}>
                  <ListingSkeleton />
                </div>
              }
            >
              <ListingsWrapper />
            </Suspense>
          </section>
        </MaxWidthDiv>
      </main>
    </>
  );
}
