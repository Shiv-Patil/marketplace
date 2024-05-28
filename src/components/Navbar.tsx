"use client";

import Link from "next/link";
import MaxWidthDiv from "@/components/MaxWidthDiv";
import Image from "next/image";
import NavAuthButtons from "./NavAuthButtons";
import ThemeToggle from "./ui/theme-toggle";

const Navbar = () => {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-16 w-full border-b bg-background/75 backdrop-blur-lg transition-all">
      <MaxWidthDiv className="h-full flex-row items-center justify-between">
        <div className="flex items-center gap-4 self-stretch">
          <Link href="/" className="flex gap-4 text-lg font-semibold">
            <Image
              src="/logo.svg"
              height={32}
              width={32}
              className="h-8 w-8 object-contain"
              alt="logo"
            />
            <span className="hidden sm:block">Marketplace</span>
          </Link>
          <ThemeToggle />
        </div>

        <NavAuthButtons />
      </MaxWidthDiv>
    </nav>
  );
};

export default Navbar;
