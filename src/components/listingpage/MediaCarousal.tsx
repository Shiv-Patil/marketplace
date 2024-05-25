"use client";

import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export function CarousalElement({
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

export function CarousalElementSkeleton() {
  return <Skeleton className="aspect-square h-16" />;
}
