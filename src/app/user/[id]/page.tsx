import MaxWidthDiv from "@/components/MaxWidthDiv";
import UserPage from "@/components/userpage/UserPage";
import UserSkeleton from "@/components/userpage/Skeletons";
import { getUser } from "@/server/queries/get_user";

export default async function User({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  let error: string | undefined = undefined;
  const data = await getUser({ userId }).catch((err) => {
    error =
      err instanceof Error && err.message.length
        ? err.message
        : "Unknown error";
    return undefined;
  });
  if (!data) return <UserSkeleton error={error} />;
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
