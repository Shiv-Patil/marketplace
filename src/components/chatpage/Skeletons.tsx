import MaxWidthDiv from "@/components/MaxWidthDiv";
import { Spinner } from "@/components/ui/spinner";

export default function ChatSkeleton() {
  return (
    <main className="h-full bg-background">
      <MaxWidthDiv className="h-full items-center justify-center">
        <Spinner />
      </MaxWidthDiv>
    </main>
  );
}
