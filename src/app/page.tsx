import { laws, findings } from "@/lib/data";
import { LawList } from "@/components/law-list";

export default function Home() {
  const published = findings.filter((finding) => finding.published);
  return (
    <div className="mx-auto max-w-[1460px] px-5 pb-14 pt-8 sm:px-8 lg:px-12">
      <h1 className="font-serif text-[27px] leading-tight tracking-[-.025em] text-[#30343a] sm:text-[31px]">Puerto Rico Translation Inconsistencies</h1>
      <p className="mt-2 text-[16px] text-[#5c6268]">Explore differences in meaning between the original Spanish text and official English translations of Puerto Rico legislation.</p>
      <p className="mt-1 text-[13px] text-[#697078]">{laws.length} acts · {published.length} published findings · {published.filter((f) => f.impact === "major").length} major potential · {published.filter((f) => f.impact === "limited").length} limited potential</p>
      <LawList laws={laws} findings={published} />
    </div>
  );
}
