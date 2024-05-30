"use client";

import { MessageCircleMoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Suspense, useEffect } from "react";
import { listingsContainerStyle } from "@/components/Listings";
import { ListingSkeleton } from "@/components/Listing";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthDiv from "@/components/MaxWidthDiv";
import { toast } from "@/components/ui/use-toast";

export default function UserSkeleton({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error]);
  return (
    <main className="bg-background">
      <MaxWidthDiv>
        <section about="user details" className="flex gap-8 pb-10 pt-10">
          <div className="flex flex-grow flex-col items-center justify-center gap-4 pt-8 sm:flex-row sm:gap-8">
            <Skeleton className="h-28 w-28 rounded-full sm:h-48 sm:w-48" />
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64 pb-2" />
              <Button variant="outline" className="flex w-32 gap-2 sm:w-48">
                <MessageCircleMoreIcon /> Chat
              </Button>
            </div>
          </div>
        </section>

        <section about="user listings" className="flex flex-col gap-4 py-10">
          <h1 className="text-xl">User listings</h1>
          <Separator />
          <Suspense
            fallback={
              <div className={listingsContainerStyle}>
                <ListingSkeleton />
              </div>
            }
          >
            <div className={listingsContainerStyle}>
              <ListingSkeleton />
            </div>
          </Suspense>
        </section>
      </MaxWidthDiv>
    </main>
  );
}
