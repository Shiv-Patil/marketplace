import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { getMessagesType } from "@/server/mutations/get_messages";
import ChatBottombar from "@/components/chatpage/ChatBottomBar";
import type { NewMessage } from "@/components/chatpage/ChatBottomBar";

export function ChatList({
  data,
  sendMessage,
  validateInput,
  socketId,
}: {
  data: getMessagesType;
  sendMessage: (newMessage: NewMessage) => void;
  validateInput: (content: string) => string | undefined;
  socketId: string;
}) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollEle = messagesContainerRef.current;
    if (
      scrollEle &&
      scrollEle.scrollHeight - scrollEle.clientHeight - scrollEle.scrollTop <
        500
    ) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [data.messages]);

  return (
    <div className="flex h-full flex-col py-4">
      <div className="relative h-full">
        <div
          ref={messagesContainerRef}
          className="!absolute bottom-0 left-0 right-0 top-0 flex flex-col overflow-y-auto px-2"
        >
          <AnimatePresence>
            {data.messages?.map((message, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.2,
                    duration: index * 0.01 + 0.2,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn(
                  "flex flex-col gap-2 whitespace-pre-wrap",
                  message.sender.name !== data.withUser.name
                    ? "items-end"
                    : "items-start"
                )}
              >
                <div className="flex items-start gap-3 pb-4 text-sm sm:text-base">
                  {message.sender.name === data.withUser.name && (
                    <Avatar className="flex items-center justify-center">
                      <AvatarFallback className="text-xs text-muted-foreground">
                        user
                      </AvatarFallback>
                      <AvatarImage
                        src={message.sender.image || ""}
                        alt={message.sender.name}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                  <span className=" max-w-xs rounded-md bg-accent p-2">
                    {message.content}
                  </span>
                  {message.sender.name !== data.withUser.name && (
                    <Avatar className="flex items-center justify-center">
                      <AvatarFallback className="text-xs text-muted-foreground">
                        user
                      </AvatarFallback>
                      <AvatarImage
                        src={message.sender.image || ""}
                        alt={message.sender.name}
                        width={6}
                        height={6}
                      />
                    </Avatar>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        validateInput={validateInput}
        socketId={socketId}
      />
    </div>
  );
}
