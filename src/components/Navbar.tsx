import Link from "next/link";
import MaxWidthDiv from "./layout/MaxWidthDiv";
import Image from "next/image";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const user = undefined;
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-16 w-full border-b border-secondary bg-background/75 backdrop-blur-lg transition-all">
      <MaxWidthDiv className="h-full flex-row items-center justify-between border-b">
        <Link href="/" className="flex gap-4 text-lg font-semibold">
          <Image
            src="logo.svg"
            height={32}
            width={32}
            className="object-contain"
            alt="logo"
          />{" "}
          Marketplace
        </Link>

        <div className="flex h-full items-center gap-4">
          {user ? (
            <></>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ size: "sm", variant: "secondary" })}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </MaxWidthDiv>
    </nav>
  );
};

export default Navbar;
