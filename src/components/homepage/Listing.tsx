"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { getListingsType } from "@/server/queries/get_listings";
import { getFormattedAmount } from "@/lib/utils";

const msPerSecond = 1000;
const msPerMinute = msPerSecond * 60;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;

const Listing = ({ data }: { data: getListingsType[0] }) => {
  const timeleft = data.endDate.getTime() - new Date().getTime();
  const days = Math.floor(timeleft / msPerDay);
  const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / msPerHour);
  const minutes = Math.ceil((timeleft % (1000 * 60 * 60)) / msPerMinute);

  const coverImage = data.media.length ? data.media[0].url : "";
  const currentPrice = getFormattedAmount(data.currentPrice);
  const bids = data.bids.length;

  return (
    <Link href={`/listing/${data.listingId}`}>
      <Card>
        <div className="relative m-2 h-60 overflow-hidden rounded-lg">
          <Image
            alt="listing-blur"
            src={coverImage}
            fill={true}
            className="object-fill blur-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 250px"
            placeholder="empty"
          />
          <Image
            alt="listing"
            src={coverImage}
            fill={true}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 250px"
            placeholder="empty"
          />
        </div>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription className="overflow-clip overflow-ellipsis">
            {data.shortDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {timeleft <= 0 || data.status === "expired" ? (
            <p className="text-muted-foreground">Ended</p>
          ) : (
            <p>
              {days
                ? days + (days == 1 ? " day" : " days")
                : hours
                  ? hours + (hours == 1 ? " hour" : " hours")
                  : minutes + (minutes == 1 ? " minute" : " minutes")}{" "}
              left
            </p>
          )}
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data.seller.image || undefined} />
              <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
                S
              </AvatarFallback>
            </Avatar>
            {data.seller.name}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">{currentPrice}</p>
            <p className="text-sm text-muted-foreground">current price</p>
          </div>
          <div className="text-muted-foreground">
            {bids} {bids == 1 ? "bid" : "bids"}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const ListingSkeleton = () => {
  return (
    <Card>
      <div className="relative m-2 flex h-60 overflow-hidden rounded-lg">
        <Skeleton className="flex-1" />
      </div>
      <CardHeader>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default Listing;
