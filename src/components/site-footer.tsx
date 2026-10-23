import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#dedbd3] bg-[#f3f1eb]">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 py-8 text-[12px] leading-6 text-[#617071] sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>Puerto Rico Translation Inconsistencies · A public research reader</p>
        <div className="flex gap-5">
          <Link href="/method/" className="hover:text-[#1b4c56]">Method &amp; limits</Link>
          <Link href="/" className="hover:text-[#1b4c56]">Browse source documents</Link>
        </div>
      </div>
    </footer>
  );
}
