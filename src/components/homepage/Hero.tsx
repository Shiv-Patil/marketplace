import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export default function Hero() {
  return (
    <section about="hero" className="flex gap-8 pb-10 pt-10">
      <div className="flex flex-grow flex-col items-center gap-4 pt-8 lg:items-stretch">
        <h1 className="text-center text-4xl lg:text-left">
          Buy, sell, auction
          <br />
          All in one place.
        </h1>
        <div className="py-2 lg:py-4"></div>
        <a href="https://github.com/Shiv-Patil/marketplace">
          <Button className="flex w-fit gap-2" variant="outline">
            View source code <Code2 />
          </Button>
        </a>
      </div>
      <div className="relative hidden min-w-48 lg:block lg:flex-grow"></div>
    </section>
  );
}
