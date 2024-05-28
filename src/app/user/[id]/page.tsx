import MaxWidthDiv from "@/components/MaxWidthDiv";
import UserPage from "@/components/userpage/UserPage";
import UserSkeleton from "@/components/userpage/Skeletons";
import { getUser } from "@/server/queries/get_user";
import { Suspense } from "react";

async function UserPageWrapper({ userId }: { userId: string }) {
  const data = await getUser({ userId });
  if (!data) return <UserSkeleton />;
  return <UserPage data={data} />;
}

export default function User({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <Suspense fallback={<UserSkeleton />}>
            <UserPageWrapper userId={userId} />
          </Suspense>
        </MaxWidthDiv>
      </main>
    </>
  );
}
