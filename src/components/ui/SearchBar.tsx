import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

const SearchBar = ({
  className,
  placeholder,
  callback,
}: {
  className?: string;
  placeholder?: string;
  callback?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className={cn("flex w-60 items-center gap-2 sm:w-80", className)}>
      <Input
        type="text"
        className="flex-1 px-3 py-2"
        placeholder={placeholder || "Search..."}
      />
      <Button className="px-2 py-2" onClick={callback} variant="outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </Button>
    </div>
  );
};

export default SearchBar;
