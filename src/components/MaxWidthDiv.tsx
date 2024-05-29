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
        "mx-auto flex w-full max-w-screen-xl flex-col px-4 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthDiv;
