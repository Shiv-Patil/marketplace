import NewPage from "@/components/newpage/NewPage";
import { Suspense } from "react";

async function NewPageWrapper() {
  // fetch data here
  return <NewPage />;
}

export default function NewPageWrapperSuspense() {
  return (
    <Suspense fallback={"loading"}>
      <NewPageWrapper />
    </Suspense>
  );
}
