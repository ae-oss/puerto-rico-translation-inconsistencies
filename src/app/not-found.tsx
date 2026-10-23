import Link from "next/link";

export default function NotFound() { return <div className="mx-auto max-w-[900px] px-5 py-28 text-center sm:px-10"><p className="eyebrow mb-4">Page not found</p><h1 className="font-serif text-[42px] text-[#17373b]">There is no page at this address.</h1><Link href="/" className="mt-6 inline-block text-[13px] font-semibold text-[#286975] underline underline-offset-4">Return to legislation</Link></div>; }
