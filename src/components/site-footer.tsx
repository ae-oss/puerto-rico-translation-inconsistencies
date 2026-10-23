import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8dadd] bg-white">
      <div className="mx-auto flex max-w-[1460px] flex-col gap-4 px-5 py-6 text-[12px] leading-6 text-[#6e767b] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>Puerto Rico Translation Inconsistencies · A public research reader</p>
        <div className="flex gap-5">
          <Link href="/method/" className="hover:text-[#1b4c56]">Method &amp; limits</Link>
          <Link href="/" className="hover:text-[#1b4c56]">Browse source documents</Link>
        </div>
      </div>
    </footer>
  );
}
