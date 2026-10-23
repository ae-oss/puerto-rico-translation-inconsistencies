import Link from "next/link";
import { laws, findings } from "@/lib/data";
import { LawList } from "@/components/law-list";

export default function Home() {
  const publishedFindings = findings.filter((finding) => finding.published);
  const publishedCount = publishedFindings.length;
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#ddded5] bg-[#f2f3ee]">
        <div className="pointer-events-none absolute right-[-10%] top-[-25%] h-[570px] w-[570px] rounded-full border border-[#dae4de] opacity-65" />
        <div className="pointer-events-none absolute right-[-5%] top-[-15%] h-[400px] w-[400px] rounded-full border border-[#d2dfd9] opacity-70" />
        <div className="relative mx-auto grid max-w-[1320px] gap-10 px-5 pb-16 pt-16 sm:px-10 sm:pb-20 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow mb-6">Puerto Rico · bilingual legislation</p>
            <h1 className="text-balance max-w-[900px] font-serif text-[46px] leading-[1.08] tracking-[-.045em] text-[#17373b] sm:text-[62px] lg:text-[72px]">
              When two versions of a law <em className="font-normal text-[#397681]">say different things.</em>
            </h1>
            <p className="mt-7 max-w-[68ch] text-[16px] leading-8 text-[#526768] sm:text-[17px]">Explore carefully reviewed differences between the original Spanish wording of Puerto Rican legislation and its official English translations. Each finding shows the source text, the reasoning, and what the difference could—and could not—change.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#legislation" className="inline-flex items-center gap-3 rounded-[2px] bg-[#1f555f] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#16444c]">Browse legislation <span aria-hidden="true">→</span></Link>
              <Link href="/method/" className="inline-flex items-center rounded-[2px] border border-[#b9c9c5] bg-white/70 px-5 py-3 text-[13px] font-semibold text-[#315e65] hover:border-[#82aaa8]">How findings are reviewed</Link>
            </div>
          </div>
          <aside className="border-l border-[#b7cac6] pl-6 text-[#385e62]">
            <p className="text-[11px] font-bold uppercase tracking-[.15em]">In the library</p>
            <div className="mt-5 flex items-baseline gap-3"><span className="font-serif text-[47px] leading-none">{String(laws.length).padStart(2, "0")}</span><span className="text-[13px]">{laws.length === 1 ? "law" : "laws"} in the library</span></div>
            <div className="mt-3 flex items-baseline gap-3"><span className="font-serif text-[47px] leading-none">{String(publishedCount).padStart(2, "0")}</span><span className="text-[13px]">published findings</span></div>
            <p className="mt-5 border-t border-[#c6d4ce] pt-4 text-[12px] leading-6 text-[#5e7272]">{publishedCount === 0 ? "Findings will appear after review." : "Each published finding links its analysis to original sources and explains the limits of the evidence."}</p>
          </aside>
        </div>
      </section>
      <LawList laws={laws} findings={publishedFindings} />
      <section className="mx-auto max-w-[1320px] px-5 pb-6 sm:px-10">
        <div className="grid gap-8 rounded-[3px] border border-[#d9dfd9] bg-[#edf3ef] px-6 py-8 sm:px-9 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
          <div>
            <p className="eyebrow mb-3">A necessary distinction</p>
            <h2 className="font-serif text-[27px] tracking-[-.025em] text-[#244247]">Possible wording impact is not a proven legal effect.</h2>
            <p className="mt-3 max-w-[75ch] text-[13px] leading-6 text-[#5a6f6d]">The site separately evaluates whether a translation differs, whether that difference could matter, and whether later law or court decisions actually relied on it. Puerto Rico’s current Civil Code generally gives the Spanish text priority unless a law provides otherwise.</p>
          </div>
          <Link href="/method/" className="inline-flex justify-center rounded-[2px] border border-[#aec7c0] bg-white px-5 py-3 text-[13px] font-semibold text-[#285d63] hover:border-[#75a29b]">Read the method <span aria-hidden="true" className="ml-3">→</span></Link>
        </div>
      </section>
    </>
  );
}
