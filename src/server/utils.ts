import "server-only";
import { db } from "@/server/db";
import { conversations, user_conversations } from "@/server/db/schema";
import { intersect } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

// Not a server action - unsafe to call from client
export async function getConversationIdQuery(user1: string, user2: string) {
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
