import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthDiv = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full max-w-screen-xl flex-col px-8 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthDiv;