import MaxWidthDiv from "@/components/MaxWidthDiv";
import ListingPage from "@/components/listingpage/ListingPage";
import ListingSkeleton from "@/components/listingpage/Skeletons";
import { getListing } from "@/server/queries/get_listing";

export default async function Listing({
  params: { id: listingId },
}: {
  params: { id: string };
}) {
  let error: string | undefined = undefined;
  const data = await getListing(+listingId).catch((err) => {
    error =
      err instanceof Error && err.message.length
        ? err.message
        : "Unknown error";
    return undefined;
  });
  if (!data) return <ListingSkeleton error={error} />;
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
