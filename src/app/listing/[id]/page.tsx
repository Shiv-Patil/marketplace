import MaxWidthDiv from "@/components/MaxWidthDiv";
import ListingPage from "@/components/listingpage/ListingPage";
import ListingSkeleton from "@/components/listingpage/Skeletons";
import { getListing } from "@/server/queries/get_listing";

export default async function Listing({
  params: { id: listingId },
}: {
  params: { id: string };
}) {
  const data = await getListing(+listingId);
  if (!data) return <ListingSkeleton />;
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <ListingPage data={data} />
        </MaxWidthDiv>
      </main>
    </>
  );
}
