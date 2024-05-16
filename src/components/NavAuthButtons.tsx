"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function NavAuthButtons() {
  const { data: session } = useSession();
  return (
    <div className="flex h-full items-center gap-4">
      {session ? <SignOut /> : <SignIn />}
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
