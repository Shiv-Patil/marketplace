import "server-only";

import { headers } from "next/headers";
export const FALLBACK_IP_ADDRESS = "0.0.0.0";

export default function getIp() {
  const forwardedFor = headers().get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }
  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
