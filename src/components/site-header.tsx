import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[#d8dadd] bg-white">
      <div className="mx-auto flex max-w-[1460px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="font-serif text-[17px] tracking-[-.02em] text-[#30343a] hover:text-[#2f6789]" aria-label="Puerto Rico Translation Inconsistencies home">Puerto Rico Translation Inconsistencies</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-2 text-[13px] text-[#3d444a]">
          <Link className="nav-link" href="/">Legislation</Link>
          <Link className="nav-link" href="/method/">Method</Link>
          <Link className="nav-link" href="/statistics/">Statistics</Link>
        </nav>
      </div>
    </header>
  );
}
