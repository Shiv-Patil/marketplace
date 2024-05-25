import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const msPerSecond = 1000;
const msPerMinute = msPerSecond * 60;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;

export function getTimeLeftString(endDate: Date) {
  const timeleft = endDate.getTime() - new Date().getTime();
  const days = Math.floor(timeleft / msPerDay);
  const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / msPerHour);
  const minutes = Math.ceil((timeleft % (1000 * 60 * 60)) / msPerMinute);
  return timeleft <= 0
    ? "Ended"
    : (days
        ? days + (days == 1 ? " day" : " days")
        : hours
          ? hours + (hours == 1 ? " hour" : " hours")
          : minutes + (minutes == 1 ? " minute" : " minutes")) + " left";
}
