import type { Finding, TextPart } from "@/lib/types";
import { ImpactBadge } from "@/components/badge";

function Passage({ label, parts, lang }: { label: string; parts: TextPart[]; lang?: string }) {
  return (
    <div className="border-t border-[#e4e2da] pt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.14em] text-[#66787a]">{label}</p>
      <blockquote lang={lang} className="font-serif text-[18px] leading-[1.65] text-[#223738] sm:text-[19px]">
        “{parts.map((part, index) => part.highlight ? <mark key={index} className="rounded-[2px] bg-[#dcebec] px-[2px] text-inherit">{part.text}</mark> : <span key={index}>{part.text}</span>)}”
      </blockquote>
    </div>
  );
}

function ReviewPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-[#e2e0d8] py-4 first:border-t-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-[#1d3538] marker:hidden">
        {title}<span aria-hidden="true" className="text-[20px] font-light leading-none text-[#55767a] transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="max-w-[70ch] pt-3 text-[14px] leading-7 text-[#4c5c5c]">{children}</div>
    </details>
  );
}

const downstreamLabels = {
  confirmed: "Confirmed downstream effect",
  potential: "Potential legal dependency",
  "none-demonstrated": "No demonstrated downstream effect",
  "not-assessed": "Downstream effect not yet assessed",
};

export function FindingDetail({ finding, demo = false }: { finding: Finding; demo?: boolean }) {
  return (
    <article className="overflow-hidden rounded-[4px] border border-[#dcdad2] bg-white shadow-[0_8px_32px_rgba(27,44,42,.045)]">
      {demo && <div className="border-b border-[#dccbaa] bg-[#faf3e4] px-5 py-3 text-[12px] font-semibold tracking-[.03em] text-[#70562e] sm:px-8">FICTIONAL EXAMPLE · Not a passage from a reviewed act</div>}
      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#6d8586]">{finding.section}</p>
            <h2 className="font-serif text-[22px] leading-tight tracking-[-.025em] text-[#173238] sm:text-[26px]">{finding.title}</h2>
          </div>
          <div className="flex flex-col items-start gap-2"><ImpactBadge impact={finding.impact} />{!demo && <span className="text-[11px] font-medium text-[#647877]">{finding.status.replaceAll("-", " ")} · {finding.confidence} assessment confidence</span>}</div>
        </div>
        <div className="grid gap-6 border-y border-[#e4e2da] py-7 lg:grid-cols-2 lg:gap-8">
          <Passage label="Original Spanish" parts={finding.spanish} lang="es" />
          <div className="space-y-5 border-t border-[#e4e2da] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <Passage label="Official English" parts={finding.officialEnglish} lang="en" />
            <Passage label="Independent translation of Spanish" parts={finding.independentEnglish} lang="en" />
          </div>
        </div>
        <div className="grid gap-7 py-8 md:grid-cols-2 md:gap-10">
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#557276]">What differs in meaning</h3>
            <p className="text-[15px] leading-7 text-[#314446]">{finding.meaning}</p>
          </section>
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#557276]">Potential consequence</h3>
            <p className="text-[15px] leading-7 text-[#314446]">{finding.potentialConsequence}</p>
          </section>
        </div>
        <div className="rounded-sm bg-[#f5f6f2] px-5 py-4 text-[13px] leading-6 text-[#506061]">
          <strong className="font-semibold text-[#2a4447]">Impact assessment: </strong>{finding.impactReason}
        </div>
      </div>
      <div className="border-t border-[#e4e2da] bg-[#fcfbf8] px-5 py-2 sm:px-8">
        <ReviewPanel title="Initial assessment"><p>{finding.initialAssessment}</p></ReviewPanel>
        <ReviewPanel title="Independent critical review"><p>{finding.criticalReview}</p></ReviewPanel>
        <ReviewPanel title="Downstream legal consequences">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.1em] text-[#6e7775]">{downstreamLabels[finding.downstream.status]}</p>
          <p>{finding.downstream.summary}</p>
          {finding.downstream.citations.length > 0 && <ul className="mt-3 list-disc pl-5">{finding.downstream.citations.map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-[#246471] underline underline-offset-2">{citation.label}</a>{citation.note && ` — ${citation.note}`}</li>)}</ul>}
        </ReviewPanel>
        <ReviewPanel title="Sources and citations">
          {finding.sources.length ? <ul className="list-disc pl-5">{finding.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#246471] underline underline-offset-2">{source.label}</a>{source.note && ` — ${source.note}`}</li>)}</ul> : <p>No sources are attached to this fictional example.</p>}
        </ReviewPanel>
      </div>
    </article>
  );
}
