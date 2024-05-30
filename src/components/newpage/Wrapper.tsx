"use client";

import NewPage from "@/components/newpage/NewPage";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

export default function NewPageWrapper() {
  const { status, data } = useSession();
  if (status === "loading") return <Spinner className="self-center" />;
  if (status === "unauthenticated" || !data) {
    redirect("/");
  }
  return <NewPage userId={data.user.id} />;
}
