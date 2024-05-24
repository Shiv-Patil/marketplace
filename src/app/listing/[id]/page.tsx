import { MediaCarousal } from "@/components/MediaCarousal";
import MaxWidthDiv from "@/components/layout/MaxWidthDiv";
import { ListingSkeleton } from "@/components/listingpage/Skeletons";
import { getListing } from "@/server/queries/getListing";
import { Suspense } from "react";

async function MediaCarousalWrapper({ listingId }: { listingId: number }) {
  const data = await getListing(listingId);
  return <MediaCarousal data={data} />;
}

export default function Listing({
  params: { id: listingId },
}: {
  params: { id: string };
}) {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <ListingSkeleton />
          {/* <section
            about="details"
            className="flex flex-col gap-8 pb-10 pt-20 text-white md:flex-row"
          >
            <div className="flex flex-col gap-2 lg:flex-row">
              <div></div>
              <div className="flex gap-2 overflow-hidden p-2 lg:flex-col">
                <Suspense fallback={<CarousalElementSkeleton />}>
                  <MediaCarousalWrapper listingId={+listingId} />
                </Suspense>
              </div>
            </div>
          </section>

          <section about="bids" className="flex flex-col gap-4 py-10"></section> */}
        </MaxWidthDiv>
      </main>
    </>
  );
}
