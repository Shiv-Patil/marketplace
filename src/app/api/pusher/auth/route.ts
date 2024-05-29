import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { pusher } from "@/server/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const params = new URLSearchParams(await req.text());
  const { socket_id, channel_name } = {
    socket_id: params.get("socket_id"),
    channel_name: params.get("channel_name"),
  };
  const session = await getServerAuthSession();

  if (!socket_id || !channel_name)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  if (channel_name.startsWith("private-messages_")) {
    const conversationId = +channel_name.split("_")[1];
    const data =
      session && !isNaN(conversationId)
        ? await db.query.user_conversations.findFirst({
            columns: { conversationId: true },
            where: (fields, { and, eq }) =>
              and(
                eq(fields.userId, session.user.id),
                eq(fields.conversationId, conversationId)
              ),
          })
        : undefined;
    if (data) {
      const authData = pusher.authorizeChannel(socket_id, channel_name, {
        user_id: session!.user.id,
      });
      return NextResponse.json(authData, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
