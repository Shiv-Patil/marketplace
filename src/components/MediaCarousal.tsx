"use client";

import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { getListing } from "@/server/queries/getListing";
import { useState } from "react";

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
      />
    </button>
  );
}

export function CarousalElementSkeleton() {
  return <Skeleton className="aspect-square h-16" />;
}

export function MediaCarousal({
  data,
}: {
  data: Awaited<ReturnType<typeof getListing>>;
}) {
  const [selected, setSelected] = useState(1);
  const media = data?.media;
  return (
    <>
      {media?.length ? (
        media.map((el, index) => (
          <CarousalElement
            onClick={() => {
              setSelected(index + 1);
            }}
            id={index + 1}
            selected={selected}
            mediaURL={el.url}
            key={index}
          />
        ))
      ) : (
        <CarousalElementSkeleton />
      )}
    </>
  );
}
