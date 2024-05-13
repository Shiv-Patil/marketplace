import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const msPerSecond = 1000;
const msPerMinute = msPerSecond * 60;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;

const Listing = ({
  coverImage,
  name,
  description,
  end,
  sellerAvatar,
  sellerName,
  price,
  views,
}: {
  coverImage: string;
  name: string;
  description: string;
  end: string;
  sellerAvatar: string;
  sellerName: string;
  price: number;
  views: number;
}) => {
  const timeleft = new Date(end).getTime() - new Date().getTime();
  const days = Math.floor(timeleft / msPerDay);
  const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / msPerHour);
  const minutes = Math.ceil((timeleft % (1000 * 60 * 60)) / msPerMinute);

  return (
    <Card>
      <div className="relative m-2 h-60 overflow-hidden rounded-lg">
        <Image
          alt="listing-blur"
          src={coverImage}
          fill={true}
          className="object-fill blur-2xl"
          placeholder="empty"
        />
        <Image
          alt="listing"
          src={coverImage}
          fill={true}
          className="object-contain"
          placeholder="empty"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {timeleft <= 0 ? (
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
            <AvatarImage src={sellerAvatar} />
            <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
              S
            </AvatarFallback>
          </Avatar>
          {sellerName}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">{price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">latest bid</p>
        </div>
        <div className="text-muted-foreground">
          {views} {views == 1 ? "view" : "views"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Listing;
