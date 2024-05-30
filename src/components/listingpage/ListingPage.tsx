"use client";

import { type getListingType } from "@/server/queries/get_listing";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFormattedAmount, getTimeLeftString } from "@/lib/utils";
import { NewBidButton } from "@/components/listingpage/NewBid";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import assert from "assert";
import CloseListingButton from "@/components/listingpage/CloseListing";
import { CarousalElementSkeleton } from "@/components/listingpage/Skeletons";
import Link from "next/link";
import { GenerateOTP } from "./GenerateOTP";
import { VerifyPurchase } from "./InputOTP";

function CarousalElement({
  id,
  selected,
  mediaURL,
  onClick,
}: {
  id: number;
  selected: number;
  mediaURL: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={
        "relative aspect-square h-16 rounded-md border-foreground " +
        (selected === id ? "border-2 p-2" : "hover:border")
      }
      onClick={onClick}
    >
      <Image
        alt="media"
        src={mediaURL}
        fill={true}
        className="object-contain"
        sizes="64px"
      />
    </button>
  );
}

function BidRow({
  bidderImage,
  bidderName,
  bidDate,
  bidPrice,
}: {
  bidderImage: string | null;
  bidderName: string;
  bidDate: Date;
  bidPrice: string;
}) {
  return (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={bidderImage || undefined} />
          <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
            B
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:block">{bidderName}</span>
      </TableCell>
      <TableCell className="" suppressHydrationWarning>
        {bidDate.toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">{bidPrice}</TableCell>
    </TableRow>
  );
}

export default function ListingPage({ data }: { data: getListingType }) {
  assert(data);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const media = data?.media && data.media.length ? data.media : null;
  const { status: authStatus, data: authData } = useSession();
  const NewBidButtonWithAuth =
    authStatus === "authenticated" ? (
      <NewBidButton
        listingId={data.listingId}
        currentPrice={data.currentPrice}
      />
    ) : (
      <Button
        variant="outline"
        className="text-lg"
        onClick={() => signIn("google")}
      >
        Make an offer
      </Button>
    );
  return (
    <>
      <section
        about="details"
        className="flex flex-col gap-8 pb-10 pt-12 text-white md:flex-row md:items-start"
      >
        <div className="flex flex-col gap-2 md:flex-1 lg:flex-[1.5] lg:flex-row-reverse">
          <div className="relative aspect-square lg:flex-1">
            <Image
              alt="media-large"
              fill={true}
              className="object-contain"
              src={media ? media[selectedMedia].url : ""}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          </div>
          <div className="flex gap-2 overflow-hidden p-2 lg:flex-col">
            {media ? (
              media.map((el, index) => (
                <CarousalElement
                  onClick={() => {
                    setSelectedMedia(index);
                  }}
                  id={index}
                  selected={selectedMedia}
                  mediaURL={el.url}
                  key={index}
                />
              ))
            ) : (
              <>
                <CarousalElementSkeleton />
                <CarousalElementSkeleton />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-1">
          <div className="flex flex-col gap-1">
            <h3 className="text-ellipsis text-2xl">{data.name}</h3>
            <h4 className="text-ellipsis text-muted-foreground">
              {data.shortDescription}
            </h4>
          </div>
          <Separator />
          <Link
            className="flex items-center gap-2"
            href={`/user/${data.sellerId}`}
          >
            <Avatar>
              <AvatarImage src={data.seller.image || undefined} />
              <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
                S
              </AvatarFallback>
            </Avatar>
            {data.seller.name}
          </Link>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-ellipsis text-muted-foreground">
              Seller description
            </span>
            <Badge variant="outline">{data.status}</Badge>
          </div>
          <h4 className="text-ellipsis">
            {(data.longDescription || "").length ? (
              data.longDescription
            ) : (
              <span className="text-sm text-muted-foreground">
                Not provided
              </span>
            )}
          </h4>
          <div className="h-1" />
          {data.status !== "sold" ? (
            <>
              <div className="flex flex-col text-foreground">
                <span className="text-2xl">
                  {getFormattedAmount(data.currentPrice)}
                </span>
                <span className="text-sm text-muted-foreground">
                  current price
                </span>
                <span className="py-2 text-sm text-muted-foreground">
                  {getTimeLeftString(data.endDate, data.status === "expired")}
                </span>
              </div>
              {data.status === "expired" ? (
                data.bids.length && authData?.user.id === data.sellerId ? (
                  <GenerateOTP listingId={data.listingId} />
                ) : data.bids.length &&
                  authData?.user.id === data.bids[0].bidderId ? (
                  <VerifyPurchase listingId={data.listingId} />
                ) : null
              ) : authData?.user.id === data.sellerId ? (
                <CloseListingButton listingId={data.listingId} />
              ) : (
                NewBidButtonWithAuth
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">Sold to</span>
              <Link
                className="flex items-center gap-2"
                href={`/user/${data.bids[0].bidderId}`}
              >
                <Avatar>
                  <AvatarImage src={data.bids[0].bidder.image || undefined} />
                  <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
                    S
                  </AvatarFallback>
                </Avatar>
                {data.bids[0].bidder.name}
              </Link>
            </>
          )}
        </div>
      </section>

      <section about="bids" className="flex flex-col gap-4 py-6 pb-12">
        <Table>
          <TableCaption>Bid history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-full">Bidder</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.bids.map((el, index) => (
              <BidRow
                bidDate={el.bidDate}
                bidPrice={getFormattedAmount(el.amount)}
                bidderImage={el.bidder.image}
                bidderName={el.bidder.name}
                key={index}
              />
            ))}
            <BidRow
              key={-1}
              bidDate={data.startDate}
              bidPrice={getFormattedAmount(data.basePrice)}
              bidderImage={data.seller.image}
              bidderName="Starting bid"
            />
          </TableBody>
        </Table>
      </section>
    </>
  );
}
