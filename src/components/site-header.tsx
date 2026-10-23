import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[#dedbd3] bg-[#f9f8f4]">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-4 sm:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="Puerto Rico Translation Inconsistencies home">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#18363b] text-[11px] font-bold tracking-[.12em] text-white">PR</span>
          <span className="font-serif text-[17px] leading-tight tracking-[-.02em] text-[#173238] group-hover:text-[#38646a] sm:text-[19px]">
            Translation <span className="italic">Inconsistencies</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-[13px] font-medium text-[#435355] sm:gap-8">
          <Link className="hover:text-[#156978]" href="/">Legislation</Link>
          <Link className="hover:text-[#156978]" href="/method/">Method</Link>
        </nav>
      </div>
    </header>
  );
}
