import { headers } from "next/headers";

export default function getIp() {
  const reqHeaders = headers();
  return reqHeaders.get("x-real-ip") || "";
}
