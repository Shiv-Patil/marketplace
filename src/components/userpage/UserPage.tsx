"use client";

import { MessageCircleMoreIcon, PlusCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Listings from "@/components/Listings";
import { getUserType } from "@/server/queries/get_user";
import assert from "assert";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserPage({ data }: { data: getUserType }) {
  assert(data);
  const { data: authData } = useSession();

  const isSelf = data.id === authData?.user.id;

  return (
    <>
      <section about="user details" className="flex gap-8 pb-10 pt-10">
        <div className="flex flex-grow flex-col items-center justify-center gap-4 pt-8 sm:flex-row sm:gap-8">
          <Avatar className="h-28 w-28 sm:h-48 sm:w-48">
            <AvatarImage src={data.image || undefined} />
            <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
              USER
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="text-xl">{data.name}</span>
            <span className="pb-2 text-sm text-muted-foreground sm:text-base">
              {data.email}
            </span>
            {!isSelf ? (
              <Link
                href={`/chat/${data.id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex w-32 gap-2 sm:w-48"
                )}
              >
                <MessageCircleMoreIcon /> Chat
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section about="user listings" className="flex flex-col gap-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl">User listings</h1>
          {isSelf ? (
            <Link
              href="/new/"
              className={cn(
                "flex items-center gap-2",
                buttonVariants({ variant: "outline" })
              )}
            >
              <PlusCircleIcon />
              New Listing
            </Link>
          ) : null}
        </div>
        <Separator />
        <Listings listings={data.listings ? data.listings : []} />
      </section>
    </>
  );
}
