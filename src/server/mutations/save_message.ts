"use server";
import "server-only";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { and, eq } from "drizzle-orm";
import { messages, user_conversations } from "@/server/db/schema";
import getSchema, { schemaType } from "@/lib/input_schemas/new_message";
import { ratelimit } from "@/server/ratelimit";
import { pusher } from "@/server//pusher";
import { getMessagesType } from "@/server/mutations/get_messages";

export async function saveMessage(data: schemaType) {
  const formSchema = getSchema();
  const res = formSchema.safeParse(data);
  if (!res.success) throw new Error(res.error.errors[0].message);

  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const limited = await ratelimit.message.limit(user.user.id);
  if (!limited.success) throw new Error(`You are sending messages too fast`);

  const conversation = await db.query.user_conversations.findFirst({
    where: and(
      eq(user_conversations.conversationId, data.conversationId),
      eq(user_conversations.userId, user.user.id)
    ),
  });
  if (!conversation) throw new Error("Invalid conversation");

  const newMessage: getMessagesType["messages"][number] = {
    content: data.content,
    sender: {
      id: user.user.id,
      name: user.user.name || "Name",
      image: user.user.image || null,
    },
    createdAt: new Date(),
  };
  pusher.trigger(
    `private-messages_${data.conversationId}`,
    "client-new-message",
    newMessage
  );

  const saved = await db
    .insert(messages)
    .values({
      userId: user.user.id,
      conversationId: data.conversationId,
      content: data.content,
    })
    .returning();

  return saved;
}
