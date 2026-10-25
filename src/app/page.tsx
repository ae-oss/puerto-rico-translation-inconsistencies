import Link from "next/link";
import { laws, findings, federalGuidance } from "@/lib/data";
import { LawList } from "@/components/law-list";
import { SiteNav } from "@/components/site-header";

export default function Home() {
  const published = findings.filter((finding) => finding.published);
  return (
    <div className="mx-auto max-w-[1460px] px-5 pb-14 pt-8 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-serif text-[26px] leading-[1.25] tracking-[-.025em] text-[#30343a] sm:text-[28px]">Puerto Rico Translation Inconsistencies</h1>
        <SiteNav home />
      </div>
      <p className="mt-2 text-[14px] leading-[1.3] text-[#5c6268]">Explore differences in meaning between the original Spanish text and official English translations of Puerto Rico legislation.</p>
      <p className="mt-1 text-[12px] leading-[1.3] text-[#697078]">{laws.length} acts Â· {published.length} published findings Â· {published.filter((f) => f.impact === "major").length} major potential Â· {published.filter((f) => f.impact === "limited").length} limited potential</p>
      <p className="mt-3 text-[12px] leading-5 text-[#697078]"><Link href="/federal-guidance/" className="font-semibold text-[#286975] underline underline-offset-2">Federal guidance â†’</Link> {federalGuidance.length} separately reviewed DOL FMLA FAQ findings relevant to Puerto Rico.</p>
      <LawList laws={laws} findings={published} />
    </div>
  );
}
