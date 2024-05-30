"use client";

import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.documentElement.classList.add("h-full");
    document.body.classList.add("max-h-full");
    return () => {
      document.body.classList.remove("max-h-full");
      document.documentElement.classList.remove("h-full");
    };
  }, []);

  return <>{children}</>;
}
