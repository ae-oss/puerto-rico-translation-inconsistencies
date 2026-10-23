import Link from "next/link";
import { notFound } from "next/navigation";
import { laws, getLaw, getLawFindings, getLawReviewNotes, getCounts } from "@/lib/data";
import { FindingBrowser } from "@/components/finding-browser";

export function generateStaticParams() { return laws.map((law) => ({ id: law.id })); }

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => ({ title: getLaw(id)?.number || "Legislation" }));
}

export default async function LawPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const law = getLaw(id);
  if (!law) notFound();
  const lawFindings = getLawFindings(id);
  const reviewNotes = getLawReviewNotes(id);
  const counts = getCounts(id);

  return (
    <>
      <section className="border-b border-[#dfe1d8] bg-[#f2f3ee]">
        <div className="mx-auto max-w-[1320px] px-5 pb-11 pt-8 sm:px-10 sm:pb-14 sm:pt-10">
          <Link href="/" className="text-[12px] font-semibold text-[#477982] hover:underline">← All legislation</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[.14em] text-[#5f7777]"><span>{law.number}</span><span aria-hidden="true">·</span><span>{law.edition}</span></div>
          <h1 className="mt-4 max-w-[850px] font-serif text-[42px] leading-[1.1] tracking-[-.045em] text-[#17373b] sm:text-[55px]">{law.title}</h1>
          <p className="mt-3 font-serif text-[18px] italic text-[#6a7c78]">{law.spanishTitle}</p>
          <p className="mt-6 max-w-[78ch] text-[15px] leading-7 text-[#536968]">{law.description}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div>
          <div className="mb-10 flex flex-wrap gap-3">
            <span className="rounded-[2px] border border-[#cbd9d2] bg-[#eef5ef] px-3 py-2 text-[11px] font-semibold uppercase tracking-[.08em] text-[#456f65]">{law.status.replaceAll("-", " ")}</span>
            <span className="rounded-[2px] border border-[#deded7] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[.08em] text-[#667777]">{law.coverage.label}</span>
          </div>
          <section id="findings">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
              <div><p className="eyebrow mb-2">Passage comparisons</p><h2 className="font-serif text-[33px] tracking-[-.035em] text-[#17373b]">Findings</h2></div>
              <p className="text-[12px] text-[#697977]">{counts.total} published · {counts.major} major · {counts.limited} limited</p>
            </div>
            <FindingBrowser findings={lawFindings} />
          </section>
          {reviewNotes.length > 0 && <section className="mt-10 rounded-[3px] border border-[#d7ddd8] bg-white px-6 py-6 sm:px-8">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:hidden">
                <span><span className="eyebrow mb-2 block">Review record</span><span className="font-serif text-[25px] text-[#27464a]">Other screened passages</span><span className="mt-2 block text-[12px] leading-5 text-[#687a77]">{reviewNotes.length} {reviewNotes.length === 1 ? "note" : "notes"} held outside the finding counts because their legal meaning is unresolved or the context resolves the wording.</span></span>
                <span aria-hidden="true" className="text-[25px] font-light text-[#55767a] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-6 space-y-5 border-t border-[#e4e8e2] pt-6">{reviewNotes.map((note) => <article key={note.id} className="border-l-2 border-[#c9d9d4] pl-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#6a807d]">{note.section}</span><span className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#8b8067]">{note.disposition === "unresolved" ? "Unrated research note" : "Excluded after context review"}</span></div>
                <h3 className="mt-1 font-serif text-[20px] text-[#294549]">{note.title}</h3>
                <p className="mt-1 text-[13px] leading-6 text-[#5e706e]">{note.summary}</p>
              </article>)}</div>
            </details>
          </section>}
          {lawFindings.length === 0 && <section className="mt-10 rounded-[3px] border border-[#d7dfd8] bg-[#f0f4ee] px-6 py-7 sm:px-8">
            <p className="eyebrow mb-2">Preview the format</p>
            <h3 className="font-serif text-[24px] text-[#28464a]">See how a future finding will read</h3>
            <p className="mt-2 max-w-[65ch] text-[13px] leading-6 text-[#5b706d]">A fictional sentence demonstrates phrase highlighting, impact labels, and the three review sections. It is not evidence of an inconsistency in this act.</p>
            <Link href="/demo/" className="mt-5 inline-flex rounded-[2px] bg-[#2b616a] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#1c4c55]">View demonstration <span aria-hidden="true" className="ml-3">→</span></Link>
          </section>}
        </div>
        <aside className="space-y-7 lg:pt-1">
          <div className="rounded-[3px] border border-[#dfe1d8] bg-white p-5">
            <p className="eyebrow mb-5">Official sources</p>
            <div className="space-y-4">{law.sources.map((source) => <div key={source.url} className="border-t border-[#e9e9e3] pt-4 first:border-t-0 first:pt-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.12em] text-[#8a9995]">{source.language === "es" ? "Spanish" : "English"} · {source.kind.replaceAll("-", " ")}</span><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold leading-5 text-[#2c6570] hover:underline">{source.label} ↗</a></div>)}</div>
            <p className="mt-5 border-t border-[#e9e9e3] pt-4 text-[11px] leading-5 text-[#83908b]">{law.id === "act-80-1976" ? "These government archive extracts contain the original 1976 Act 80. Each begins with the end of Act 79 on PDF page 1; the comparison covers Act 80 only." : "These are the original 2017 documents linked by the Puerto Rico Legislative Assembly. They are not later consolidated editions."}</p>
          </div>
          <div className="border-l-2 border-[#a7c6c1] pl-5">
            <p className="eyebrow mb-3">Reading note</p>
            <p className="text-[12px] leading-6 text-[#5f706e]">A difference in wording does not establish a change in the law. Each finding distinguishes potential impact from demonstrated downstream legal consequences.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
