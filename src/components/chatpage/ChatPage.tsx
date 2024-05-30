"use client";

import { getMessagesType } from "@/server/mutations/get_messages";
import { useEffect, useState } from "react";
import ChatTopbar from "@/components/chatpage/ChatTopBar";
import { ChatList } from "@/components/chatpage/ChatList";
import { saveMessage } from "@/server/mutations/save_message";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import getSchema, { schemaType } from "@/lib/input_schemas/new_message";
import newPusher from "@/lib/pusher_client";
import Pusher from "pusher-js";

export default function ChatPage({ data }: { data: getMessagesType }) {
  const [messagesState, setMessages] = useState<getMessagesType["messages"]>(
    data.messages ?? []
  );
  const [pusher, setPusher] = useState<Pusher>();
  const channelName = `private-messages_${data.conversationId}`;

  const { mutateAsync } = useMutation({
    mutationFn: saveMessage,
  });

  const validateInput = (content: string) => {
    const formSchema = getSchema();
    const toSubmit: schemaType = {
      content,
      conversationId: data.conversationId,
    };
    const res = formSchema.safeParse(toSubmit);
    if (res.success) return res.data.content;
    toast({
      title: "Error",
      description: res.error.errors[0].message,
      variant: "destructive",
    });
  };

  const sendMessage = (newMessage: getMessagesType["messages"][number]) => {
    if (!pusher)
      return toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });

    setMessages([...messagesState, newMessage]);
    pusher.channel(channelName).trigger("client-new-message", newMessage);
    mutateAsync({
      content: newMessage.content,
      conversationId: data.conversationId,
    }).catch((reason: any) => {
      toast({
        title: "Error: Could not save message in database",
        description:
          reason instanceof Error
            ? reason.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    });
  };

  useEffect(() => {
    const pusher = newPusher();
    setPusher(pusher);
    const channel = pusher.subscribe(channelName);
    channel.bind(
      "client-new-message",
      (newMessage: getMessagesType["messages"][number]) =>
        setMessages((prevState) => [...prevState, newMessage])
    );
    return () => {
      pusher.disconnect();
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col">
      <ChatTopbar withUser={data.withUser} />

      <ChatList
        data={{ ...data, messages: messagesState }}
        sendMessage={sendMessage}
        validateInput={validateInput}
      />
    </div>
  );
}
