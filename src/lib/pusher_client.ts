import Pusher from "pusher-js";
Pusher.logToConsole = process.env.NODE_ENV !== "production" ? true : false;

export default function newPusher() {
  if (process.env.NODE_ENV !== "production")
    console.log("NEW PUSHER CONNECTION");
  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
  });
}
