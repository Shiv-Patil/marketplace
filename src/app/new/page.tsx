import MaxWidthDiv from "@/components/MaxWidthDiv";
import NewPageWrapper from "@/components/newpage/Wrapper";

export default function New() {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv className="py-8">
          <NewPageWrapper />
        </MaxWidthDiv>
      </main>
    </>
  );
}
