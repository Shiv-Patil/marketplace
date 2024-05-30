"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function NavAuthButtons() {
  const params = useParams<{ id?: string }>();
  const pathname = usePathname();
  const { status, data } = useSession();
  return (
    <div className="flex h-full items-center gap-4">
      {status === "authenticated" ? (
        <>
          {params.id === data.user.id && pathname.startsWith("/user") ? null : (
            <Link href={`/user/${data.user.id}`}>
              <Button variant="outline">My profile</Button>
            </Link>
          )}
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

const SignIn = () => {
  return (
    <Button
      onClick={() => {
        signIn("google");
      }}
    >
      Login
    </Button>
  );
};

const SignOut = () => {
  return (
    <Button
      onClick={() => {
        signOut({ redirect: false });
      }}
    >
      Logout
    </Button>
  );
};
