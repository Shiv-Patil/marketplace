import MaxWidthDiv from "@/components/MaxWidthDiv";
import NewPage from "@/components/newpage/NewPage";

export default function New() {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv className="py-8">
          <NewPage />
        </MaxWidthDiv>
      </main>
    </>
  );
}
