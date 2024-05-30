import { headers } from "next/headers";

export default function getIp() {
  const reqHeaders = headers();
  console.log(reqHeaders.entries());
  return reqHeaders.get("x-real-ip") ?? "0.0.0.0";
}
