import SearchBar from "@/components/homepage/SearchBar";

export default function Hero() {
  return (
    <section about="hero" className="flex gap-8 pb-10 pt-20">
      <div className="flex flex-grow flex-col items-center gap-4 pt-8 lg:items-stretch">
        <h1 className="text-center text-4xl lg:text-left">
          Buy, sell, and auction
          <br />
          All in one place.
        </h1>
        <div className="py-4 lg:py-8"></div>
        <SearchBar placeholder="Search listings" />
      </div>
      <div className="relative hidden min-w-48 lg:block lg:flex-grow"></div>
    </section>
  );
}
