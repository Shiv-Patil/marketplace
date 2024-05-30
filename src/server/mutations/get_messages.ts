"use server";
import "server-only";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { eq } from "drizzle-orm";
import {
  conversations,
  messages,
  user_conversations,
  users,
} from "@/server/db/schema";
import { intersect } from "drizzle-orm/pg-core";
import { ratelimit } from "@/server/ratelimit";

// Not a sever action as it is not exported !! DO NOT EXPORT
async function getConversationIdQuery(user1: string, user2: string) {
  const userConversations = db
    .select({ conversationId: user_conversations.conversationId })
    .from(user_conversations)
    .where(eq(user_conversations.userId, user1));

  const withUserConversations = db
    .select({ conversationId: user_conversations.conversationId })
    .from(user_conversations)
    .where(eq(user_conversations.userId, user2));

  const data = await intersect(userConversations, withUserConversations);

  if (!data.length) {
    return await db.transaction(async (tx) => {
      const { conversationId } = (
        await tx.insert(conversations).values({}).returning()
      )[0];
      await tx.insert(user_conversations).values([
        { conversationId, userId: user1 },
        { conversationId, userId: user2 },
      ]);
      return conversationId;
    });
  }

  return data[0].conversationId;
}

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
          name: true,
          image: true,
        },
      },
    },
  });

  return { withUser, messages: data.reverse(), conversationId };
}

export type getMessagesType = Awaited<ReturnType<typeof getMessages>>;
