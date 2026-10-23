import Link from "next/link";
import { demoFinding } from "@/lib/data";
import { FindingDetail } from "@/components/finding-detail";

export const metadata = { title: "Demonstration finding" };

export default function DemoPage() {
  return <div className="mx-auto max-w-[1100px] px-5 pb-8 pt-9 sm:px-10">
    <Link href="/laws/act-4-2017/" className="text-[12px] font-semibold text-[#477982] hover:underline">← Act 4-2017</Link>
    <div className="mb-8 mt-9"><p className="eyebrow mb-3">Layout demonstration</p><h1 className="font-serif text-[26px] tracking-[-.025em] text-[#17373b] sm:text-[28px]">How a finding is presented</h1><p className="mt-3 max-w-[70ch] text-[14px] leading-7 text-[#60716e]">The sentences below are fictional. They are not quotations from Puerto Rico law or evidence that Act 4-2017 contains this discrepancy.</p></div>
    <FindingDetail finding={demoFinding} demo />
  </div>;
}
