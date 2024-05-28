import MaxWidthDiv from "@/components/MaxWidthDiv";
import UserPage from "@/components/userpage/UserPage";
import UserSkeleton from "@/components/userpage/Skeletons";
import { getUser } from "@/server/queries/get_user";

export default async function User({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  const data = await getUser({ userId });
  if (!data) return <UserSkeleton />;
  return (
    <>
      <main className="bg-background">
        <MaxWidthDiv>
          <UserPage data={data} />
        </MaxWidthDiv>
      </main>
    </>
  );
}
