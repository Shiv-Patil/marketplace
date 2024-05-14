"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export const SignIn = () => {
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

export const SignOut = () => {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
};
