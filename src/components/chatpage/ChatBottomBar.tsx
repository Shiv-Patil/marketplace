"use client";

import { SendHorizontal } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { getMessagesType } from "@/server/mutations/get_messages";
import { useSession } from "next-auth/react";
import {
  AutosizeTextAreaRef,
  AutosizeTextarea,
} from "@/components/ui/autosize-textarea";
import { toast } from "@/components/ui/use-toast";

export default function ChatBottombar({
  sendMessage,
  validateInput,
}: {
  sendMessage: (newMessage: getMessagesType["messages"][number]) => void;
  validateInput: (content: string) => string | undefined;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<AutosizeTextAreaRef>(null);
  const { status: authStatus, data: authData } = useSession();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    const validated = validateInput(message);

    if (authStatus !== "authenticated")
      return toast({
        title: "Error",
        description: "Please log in again",
        variant: "destructive",
      });

    if (!validated || !validated.length) return;

    const newMessage: getMessagesType["messages"][number] = {
      content: validated,
      createdAt: new Date(),
      sender: {
        name: authData.user.name || "Name",
        image: authData.user.image || null,
      },
    };
    sendMessage(newMessage);
    setMessage("");
    inputRef.current?.setTriggerAutoSize("");

    if (inputRef.current) {
      inputRef.current.textArea.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative flex-1"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              duration: 0.05,
              ease: "linear",
            },
          }}
        >
          <AutosizeTextarea
            maxHeight={200}
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Send message..."
            className="resize-none"
          ></AutosizeTextarea>
        </motion.div>

        <Button
          variant="ghost"
          title="send"
          size="icon"
          className={cn(
            "h-9 w-9",
            "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
          onClick={handleSend}
        >
          <SendHorizontal size={20} className="text-muted-foreground" />
        </Button>
      </AnimatePresence>
    </div>
  );
}
