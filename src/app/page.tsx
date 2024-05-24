import { ListingSkeleton } from "@/components/Listing";
import Listings from "@/components/Listings";
import MaxWidthDiv from "@/components/layout/MaxWidthDiv";
import SearchBar from "@/components/ui/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <section about="hero" className="flex gap-8 pb-10 pt-20">
            <div className="flex flex-grow flex-col items-center gap-4 pt-8 lg:flex-grow-0 lg:items-stretch">
              <h1 className="text-center text-4xl lg:text-left">
                Buy, sell, and auction
                <br />
                All in one place.
              </h1>
              <div className="py-4 lg:py-8"></div>
              <SearchBar placeholder="Search listings" />
            </div>
            <div className="relative hidden min-w-48 lg:block lg:flex-grow"></div>
          </section>

          <section
            about="recent listings"
            className="flex flex-col gap-4 py-10"
          >
            <h1 className="text-xl">Recent listings</h1>
            <Separator />
            <Suspense
              fallback={
                <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
                  <ListingSkeleton />
                </div>
              }
            >
              <Listings />
            </Suspense>
          </section>
        </MaxWidthDiv>
      </main>
    </>
  );
}
