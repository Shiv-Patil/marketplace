import MaxWidthDiv from "@/components/MaxWidthDiv";
import ChatPage from "@/components/chatpage/ChatPage";
import { getMessages } from "@/server/mutations/get_messages";
import { redirect } from "next/navigation";

export default async function Chat({
  params: { id: withUserId },
}: {
  params: { id: string };
}) {
  let data = undefined;
  try {
    data = await getMessages({ withUserId });
  } catch (err) {
    return redirect("/");
  }
  return (
    <>
      <main className="flex h-full bg-background">
        <MaxWidthDiv>
          <div className="relative flex-1">
            <ChatPage data={data} />
          </div>
        </MaxWidthDiv>
      </main>
    </>
  );
}
