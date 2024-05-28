"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWidthDiv from "@/components/MaxWidthDiv";

export function BidRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="flex gap-4 font-medium">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="hidden w-64 md:block" />
      </TableCell>
      <TableCell className="opacity-50">Today</TableCell>
      <TableCell className="text-right opacity-50">$69.420</TableCell>
    </TableRow>
  );
}

export function CarousalElementSkeleton() {
  return <Skeleton className="aspect-square h-16" />;
}

export default function ListingSkeleton() {
  return (
    <main className="bg-background">
      <MaxWidthDiv>
        <section
          about="details"
          className="flex flex-col gap-8 pb-10 pt-12 text-white md:flex-row md:items-start"
        >
          <div className="flex flex-col gap-2 md:flex-1 lg:flex-[1.5] lg:flex-row-reverse">
            <Skeleton className="aspect-square lg:flex-1" />
            <div className="flex gap-2 overflow-hidden p-2 lg:flex-col">
              <CarousalElementSkeleton />
              <CarousalElementSkeleton />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-1">
            <Skeleton className="h-14" />
            <Separator />
            <Skeleton className="h-10" />
            <Separator />
            <Skeleton className="h-44" />
          </div>
        </section>

        <section about="bids" className="flex flex-col gap-4 py-6 pb-12">
          <Table>
            <TableCaption>Bid history</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Bidder</TableHead>
                <TableHead className="">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <BidRowSkeleton />
              <BidRowSkeleton />
              <BidRowSkeleton />
            </TableBody>
          </Table>
        </section>
      </MaxWidthDiv>
    </main>
  );
}
