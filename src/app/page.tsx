"use client";

import Listing from "@/components/Listing";
import Navbar from "@/components/Navbar";
import MaxWidthDiv from "@/components/layout/MaxWidthDiv";
import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { useState } from "react";

function Listings() {
  const [listings, setListings] = useState(
    new Array(4).fill({
      coverImage: "/monitor.jpg",
      name: "Monitor",
      description: "Ultra hd 4k hot 69hz",
      end: "2024-05-15",
      sellerAvatar: "",
      sellerName: "Batman",
      price: 69420,
      views: 1,
    })
  );

  return listings.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {listings.map((e, index) => (
        <Listing {...e} key={index} />
      ))}
    </div>
  ) : (
    <div className="relative mx-auto h-40 w-40 py-14 text-sm text-secondary-foreground">
      No listings to show
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background">
        <MaxWidthDiv>
          <section about="hero" className="flex pb-10 pt-20">
            <div className="flex flex-grow flex-col items-center gap-4 pt-8 lg:flex-grow-0 lg:items-stretch">
              <h1 className="text-center text-5xl lg:text-left">
                Buy, sell, and auction
                <br />
                All in one place.
              </h1>
              <div className="py-4 lg:py-8"></div>
              <SearchBar placeholder="Looking for something specific?" />
            </div>
            <div className="relative hidden min-w-48 lg:block lg:flex-grow">
              <Image
                src="hero.svg"
                alt="hero"
                fill={true}
                className="object-contain"
              />
            </div>
          </section>

          <section
            about="recent listings"
            className="flex flex-col gap-6 pt-10"
          >
            <h1 className="text-3xl">Recent listings</h1>
            <Listings />
          </section>
        </MaxWidthDiv>
      </main>
    </>
  );
}
