"use server";
import "server-only";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { eq } from "drizzle-orm";
import { messages, users } from "@/server/db/schema";
import { ratelimit } from "@/server/ratelimit";
import { getConversationIdQuery } from "@/server/utils";

export async function getMessages({ withUserId }: { withUserId: string }) {
  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");
  if (user.user.id === withUserId) throw new Error("Cannot message self");

  const limited = await ratelimit.mutation.limit(user.user.id);
  if (!limited.success) throw new Error(`Ratelimited`);

  const withUser = await db.query.users.findFirst({
    where: eq(users.id, withUserId),
  });
  if (!withUser) throw new Error("User does not exist");

  const conversationId = await getConversationIdQuery(user.user.id, withUserId);

  const data = await db.query.messages.findMany({
    where: eq(messages.conversationId, conversationId),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
    limit: 69,
    columns: {
      createdAt: true,
      content: true,
    },
    with: {
      sender: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return { withUser, messages: data.reverse(), conversationId };
}

export type getMessagesType = Awaited<ReturnType<typeof getMessages>>;
