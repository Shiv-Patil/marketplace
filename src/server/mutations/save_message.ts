"use server";
import "server-only";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { and, eq } from "drizzle-orm";
import { messages, user_conversations } from "@/server/db/schema";
import getSchema, { schemaType } from "@/lib/input_schemas/new_message";

export async function saveMessage(data: schemaType) {
  const formSchema = getSchema();
  const res = formSchema.safeParse(data);
  if (!res.success) throw new Error(res.error.errors[0].message);

  const user = await getServerAuthSession();
  if (!user) throw new Error("Unauthenticated. Please log in again.");

  const conversation = await db.query.user_conversations.findFirst({
    where: and(
      eq(user_conversations.conversationId, data.conversationId),
      eq(user_conversations.userId, user.user.id)
    ),
  });
  if (!conversation) throw new Error("Invalid conversation");

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
