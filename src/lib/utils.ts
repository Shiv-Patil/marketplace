import { type ClassValue, clsx } from "clsx";
import { INR, type Currency } from "@dinero.js/currencies";
import { dinero, toDecimal } from "dinero.js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const msPerSecond = 1000;
const msPerMinute = msPerSecond * 60;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;

export function getTimeLeftString(endDate: Date, expired?: boolean) {
  const timeleft = endDate.getTime() - new Date().getTime();
  const days = Math.floor(timeleft / msPerDay);
  const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / msPerHour);
  const minutes = Math.ceil((timeleft % (1000 * 60 * 60)) / msPerMinute);
  return timeleft <= 0 || expired
    ? "Ended"
    : (days
        ? days + (days == 1 ? " day" : " days")
        : hours
          ? hours + (hours == 1 ? " hour" : " hours")
          : minutes + (minutes == 1 ? " minute" : " minutes")) + " left";
}

export function getIncrement(val: number): number {
  if (val >= 20 && val < 60) return 2;
  else if (val >= 60 && val < 200) return 5;
  else if (val >= 200 && val < 500) return 10;
  else if (val >= 500 && val < 1000) return 25;
  else if (val >= 1000 && val < 2500) return 50;
  else if (val >= 2500 && val < 5000) return 100;
  else if (val >= 5000 && val < 10000) return 500;
  else if (val >= 10000 && val < 25000) return 1000;
  else if (val >= 25000 && val < 60000) return 2500;
  else if (val >= 60000 && val < 120000) return 5000;
  else if (val >= 120000 && val < 200000) return 7500;
  else if (val >= 200000 && val < 350000) return 10000;
  else if (val >= 350000 && val < 500000) return 15000;
  else if (val >= 500000) return 20000;
  return 0;
}

export function parseToDinero(val: string, currency?: Currency<number>) {
  if (!currency) currency = INR;
  val = typeof val !== "string" ? `${val}` : val.trim();
  let scale = 0;
  let _decimalIndex = val.indexOf(".");
  if (_decimalIndex !== -1) {
    val = val.slice(0, _decimalIndex) + val.slice(_decimalIndex + 1);
    scale = val.length - _decimalIndex;
  }
  const amount = +val;
  if (isNaN(amount) || amount > 1000000 || amount < 20) return null;
  try {
    return dinero({ amount, currency, scale });
  } catch {
    return null;
  }
}

export function getFormattedAmount(val: string) {
  const amt = parseToDinero(val);
  if (!amt) return "NaN";
  return Number(toDecimal(amt)).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function generateOTPString(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

export function getVerificationRedisKey(listingId: number) {
  return `verifyPurchase_${listingId}`;
}
