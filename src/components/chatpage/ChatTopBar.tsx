import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessagesType } from "@/server/mutations/get_messages";

export default function ChatTopbar({
  withUser,
}: {
  withUser: getMessagesType["withUser"];
}) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b py-4">
      <div className="flex items-center gap-2">
        <Avatar className="flex h-10 w-10 items-center justify-center">
          <AvatarFallback className="text-xs text-muted-foreground">
            user
          </AvatarFallback>
          <AvatarImage src={withUser.image || ""} alt={withUser.name} />
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            You are chatting with
          </span>
          <span className="font-medium">{withUser.name}</span>
        </div>
      </div>
    </div>
  );
}
