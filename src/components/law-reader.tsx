"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ActTextPage, Finding, Law, ReviewNote, TextPart } from "@/lib/types";

type Props = { law: Law; laws: Law[]; findings: Finding[]; reviewNotes: ReviewNote[]; pages: ActTextPage[] };
type Order = "text" | "impact";
type View = "full" | "highlights";

function readableDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function PlainPassage({ label, parts, lang }: { label: string; parts: TextPart[]; lang: string }) {
  return <div className="border-t border-[#e1e2e2] py-4 first:border-t-0"><h4 className="mb-2 text-[12px] font-semibold text-[#5b6367]">{label}</h4><blockquote lang={lang} className="font-serif text-[16px] leading-[1.52]">“{parts.map((part, index) => part.highlight ? <mark className="bg-[#fff0b5]" key={index}>{part.text}</mark> : <span key={index}>{part.text}</span>)}”</blockquote></div>;
}

export function LawReader({ law, laws, findings, reviewNotes, pages }: Props) {
  const [view, setView] = useState<View>("full");
  const [order, setOrder] = useState<Order>("text");
  const [impact, setImpact] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const legislationMenu = useRef<HTMLDetailsElement>(null);
  const englishSource = law.sources.find((source) => source.language === "en")?.url;
  const findingPage = useMemo(() => pages.reduce<Record<string, number>>((locations, page) => {
    for (const id of page.findingIds) locations[id] ??= page.page;
    return locations;
  }, {}), [pages]);
  const visiblePages = view === "highlights" ? pages.filter((page) => page.findingIds.length) : pages;
  const filtered = findings.filter((finding) => impact === "all" || finding.impact === impact).sort((a, b) => {
    if (order === "impact") return ({ major: 0, limited: 1, unrated: 2 }[a.impact] - { major: 0, limited: 1, unrated: 2 }[b.impact]) || ((findingPage[a.id] || 0) - (findingPage[b.id] || 0));
    return ((findingPage[a.id] || 0) - (findingPage[b.id] || 0)) || a.section.localeCompare(b.section);
  });
  const selected = findings.find((finding) => finding.id === selectedId) || null;
  const selectedIndex = filtered.findIndex((finding) => finding.id === selectedId);
  const places = new Set(filtered.map((finding) => finding.section)).size;

  useEffect(() => {
    function readHash() {
      const match = /^#finding=(.+)$/.exec(window.location.hash);
      setSelectedId(match && findings.some((finding) => finding.id === decodeURIComponent(match[1])) ? decodeURIComponent(match[1]) : null);
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [findings]);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (legislationMenu.current?.open && !legislationMenu.current.contains(event.target as Node)) {
        legislationMenu.current.open = false;
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && legislationMenu.current?.open) {
        legislationMenu.current.open = false;
        legislationMenu.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function selectFinding(id: string | null) {
    setSelectedId(id);
    history.replaceState(null, "", id ? `#finding=${encodeURIComponent(id)}` : window.location.pathname);
    if (id) {
      const page = findingPage[id];
      if (page) requestAnimationFrame(() => document.getElementById(`pdf-page-${page}`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
    }
  }

  function pageText(page: ActTextPage) {
    const spans = [...page.highlights].sort((a, b) => a.start - b.start);
    const result: React.ReactNode[] = [];
    let cursor = 0;
    for (const span of spans) {
      if (span.start < cursor || span.end > page.text.length) continue;
      result.push(<span key={`text-${cursor}`}>{page.text.slice(cursor, span.start)}</span>);
      result.push(<button key={`mark-${span.start}-${span.findingId}`} type="button" onClick={() => selectFinding(span.findingId)} title="Open related finding" className={`reader-mark text-left hover:underline ${selectedId === span.findingId ? "outline-2 outline-[#3478a2]" : ""}`}>{page.text.slice(span.start, span.end)}</button>);
      cursor = span.end;
    }
    result.push(<span key="tail">{page.text.slice(cursor)}</span>);
    return result;
  }

  return <div className="bg-[#f5f5f3]">
    <div className="border-b border-[#dedfdd] px-4 py-4 sm:px-7">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <details ref={legislationMenu} className="relative z-10"><summary className="inline-flex list-none cursor-pointer items-center gap-1.5 rounded border border-[#cdd0d0] bg-white px-3 py-2 text-[13px] font-semibold marker:hidden"><svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 fill-none stroke-current stroke-[1.5]"><path d="m2 4 4 4 4-4" /></svg>Change legislation</summary><div className="absolute left-0 top-11 min-w-[285px] border border-[#d8dada] bg-white p-2 shadow-lg">{laws.map((item) => <Link key={item.id} href={`/laws/${item.id}/`} className="block rounded px-3 py-2 text-[13px] hover:bg-[#f2f4f5]">{item.number} — {item.title}</Link>)}</div></details>
        <div className="min-w-0 flex-1"><h1 className="font-serif text-[20px] leading-[1.25] sm:text-[22px]">{law.number} — {law.title}</h1><p className="mt-1 text-[12px] text-[#687075]">{law.edition} · {readableDate(law.enactedOn)} <span className="mx-2 text-[#2b7255]">●</span>{law.coverage.label}</p></div>
      </div>
    </div>
    <div className="grid min-h-[calc(100vh-150px)] bg-white lg:grid-cols-[55%_45%]">
      <section aria-label="Official English act text" className="min-w-0 border-r border-[#dedfdd]">
        <div className="sticky top-0 z-[2] flex min-h-[54px] items-center justify-between gap-3 border-b border-[#dedfdd] bg-white px-4 sm:px-7"><div className="text-[12px] font-semibold"><span className="mr-2 bg-[#f1f1ef] px-2 py-1 text-[11px]">EN</span>English text</div><div className="flex items-center gap-4 text-[12px]"><button onClick={() => setView("full")} className={`py-4 ${view === "full" ? "border-b-2 border-[#2c78a5] font-semibold" : "text-[#687075]"}`}>{law.textScope === "selected" ? "Selected text" : "Full text"}</button><button onClick={() => setView("highlights")} className={`py-4 ${view === "highlights" ? "border-b-2 border-[#2c78a5] font-semibold" : "text-[#687075]"}`}>Highlights</button></div></div>
        <div className="reader-scroll max-h-[calc(100vh-205px)] overflow-y-auto px-5 pb-16 pt-5 sm:px-8 lg:px-9">
          <p className="mb-5 text-[12px] leading-5 text-[#626b70]">Official English translation · {pages.length} {law.textScope === "selected" ? "selected PDF pages" : ["act-80-1976", "act-100-1959"].includes(law.id) ? "archive spreads" : "pages"}. {englishSource && <a href={englishSource} target="_blank" rel="noopener noreferrer" className="text-[#2e78a5] underline underline-offset-2">Open source PDF ↗</a>}</p>
          {law.textScope === "selected" && <p className="mb-5 border-l-2 border-[#2c78a5] bg-[#f0f5f8] px-4 py-3 text-[12px] leading-5 text-[#4d626c]">Targeted review only: these are selected, noncontiguous context pages from the original Code. The remaining pages have not been screened for this project.</p>}
          {["act-80-1976", "act-100-1959"].includes(law.id) && <p className="mb-5 border-l-2 border-[#bc8b3a] bg-[#fbf8ee] px-4 py-3 text-[12px] leading-5 text-[#686255]">This archive is a scanned document. The searchable text below was extracted by OCR and may contain transcription mistakes. Check the official PDF for exact wording.</p>}
          {visiblePages.map((page) => <article id={`pdf-page-${page.page}`} key={page.page} className="scroll-mt-[70px] border-t border-[#e3e4e3] py-7 first:border-t-0 first:pt-0"><div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="text-[11px] font-bold uppercase tracking-[.1em] text-[#71777a]">PDF page {page.page}</h2>{page.findingIds.length > 0 && <div className="flex flex-wrap gap-2">{page.findingIds.map((id) => <button key={id} onClick={() => selectFinding(id)} className="rounded border border-[#d8dfe2] px-2 py-1 text-[11px] text-[#326d90] hover:bg-[#edf4f8]">Finding {findings.findIndex((finding) => finding.id === id) + 1} ↗</button>)}</div>}</div><div className="whitespace-pre-wrap break-words font-serif text-[16px] leading-[1.52] text-[#34383b]">{pageText(page)}</div></article>)}
        </div>
      </section>
      <section aria-label="Translation differences" className="min-w-0 bg-[#fafaf9]">
        <div className="flex min-h-[54px] items-center gap-5 border-b border-[#dedfdd] bg-[#fafaf9] px-5 text-[12px] sm:px-8"><button onClick={() => setOrder("text")} className={`py-4 ${order === "text" ? "border-b-2 border-[#2c78a5] font-semibold" : "text-[#687075]"}`}>Text order</button><button onClick={() => setOrder("impact")} className={`py-4 ${order === "impact" ? "border-b-2 border-[#2c78a5] font-semibold" : "text-[#687075]"}`}>Potential impact</button></div>
        <div className="reader-scroll max-h-[calc(100vh-205px)] overflow-y-auto px-5 pb-16 pt-5 sm:px-8">
          {selected ? <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><button onClick={() => selectFinding(null)} className="text-[13px] text-[#2d789f] hover:underline">← All differences</button><div className="flex items-center gap-3 text-[12px] text-[#677075]"><button disabled={selectedIndex <= 0} onClick={() => selectFinding(filtered[selectedIndex - 1]?.id)} className="disabled:opacity-35">← Previous</button><button disabled={selectedIndex < 0 || selectedIndex >= filtered.length - 1} onClick={() => selectFinding(filtered[selectedIndex + 1]?.id)} className="disabled:opacity-35">Next →</button></div></div>
            <p className="text-[12px] text-[#70777a]">{selected.section} · <span className="capitalize">{selected.impact}</span> potential impact · {selected.status.replaceAll("-", " ")}</p>
            <h2 className="mb-4 mt-2 font-serif text-[18px] leading-[1.25]">{selected.title}</h2>
            <PlainPassage label="Original Spanish" parts={selected.spanish} lang="es" />
            <PlainPassage label="Official English" parts={selected.officialEnglish} lang="en" />
            <PlainPassage label="Independent English translation of Spanish" parts={selected.independentEnglish} lang="en" />
            <div className="space-y-4 border-t border-[#e1e2e2] py-5 text-[14px] leading-6"><div><h3 className="font-semibold">Difference in meaning</h3><p>{selected.meaning}</p></div><div><h3 className="font-semibold">Potential consequence</h3><p>{selected.potentialConsequence}</p></div><div><h3 className="font-semibold">Impact assessment</h3><p>{selected.impactReason}</p></div></div>
            <details className="border-t border-[#e1e2e2] py-4"><summary className="cursor-pointer text-[13px] font-semibold">Review and sources ▾</summary><div className="mt-4 space-y-4 text-[13px] leading-6"><p><strong>Initial assessment.</strong> {selected.initialAssessment}</p><p><strong>Independent critical review.</strong> {selected.criticalReview}</p><p><strong>Downstream legal consequences.</strong> {selected.downstream.summary}</p><ul className="list-disc pl-5">{selected.sources.map((source, index) => <li key={`${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#2d789f] underline">{source.label}</a>{source.note && ` — ${source.note}`}</li>)}</ul></div></details>
          </> : <>
            <div className="grid gap-3 sm:grid-cols-2"><select aria-label="Filter by potential impact" value={impact} onChange={(event) => setImpact(event.target.value)} className="w-full rounded border border-[#dadcdc] bg-white px-3 py-2 text-[13px]"><option value="all">All differences ({findings.length})</option><option value="major">Major ({findings.filter((finding) => finding.impact === "major").length})</option><option value="limited">Limited ({findings.filter((finding) => finding.impact === "limited").length})</option><option value="unrated">No impact rating ({findings.filter((finding) => finding.impact === "unrated").length})</option></select><a href={englishSource} target="_blank" rel="noopener noreferrer" className="rounded border border-[#dadcdc] bg-white px-3 py-2 text-center text-[13px] text-[#2c769d]">Official English PDF ↗</a></div>
            <p className="mb-2 mt-6 text-[12px] text-[#6b7377]">{findings.length === 0 ? "No published findings from this initial comparison. Screened passages are listed below." : `${filtered.length} ${filtered.length === 1 ? "difference" : "differences"} in meaning at ${places} places in the text`}</p>
            <div>{filtered.map((finding, index) => <button onClick={() => selectFinding(finding.id)} key={finding.id} className="grid w-full grid-cols-[28px_1fr] gap-2 border-b border-[#dfe0df] py-4 text-left hover:bg-[#f1f4f5]"><span className="text-[12px] text-[#71777a]">{String(index + 1).padStart(2, "0")}</span><span><span className="block text-[14px] font-medium leading-[1.45]">{finding.title}</span><span className="mt-1 block text-[12px] text-[#70777a]">{finding.section} · {finding.impact === "unrated" ? "No impact rating yet" : `${finding.impact[0].toUpperCase()}${finding.impact.slice(1)} potential impact`}</span></span></button>)}</div>
            {findings.length === 0 && reviewNotes.length > 0 && <div className="mt-5 border-t border-[#dfe0df] pt-4"><h3 className="text-[13px] font-semibold">Screened passages</h3><ul className="mt-3 space-y-4">{reviewNotes.map((note) => <li key={note.id}><p className="text-[13px] font-medium">{note.section} · {note.title}</p><p className="mt-1 text-[12px] leading-5 text-[#606a6f]">{note.summary}</p></li>)}</ul></div>}
            <details className="mt-5 border-t border-[#dfe0df] py-4"><summary className="cursor-pointer text-[13px] text-[#626b70]">Review and sources</summary><div className="mt-4 space-y-4 text-[12px] leading-5 text-[#5c6669]"><p>A wording difference does not by itself establish a change in law. Ratings describe potential impact; downstream legal consequences are assessed separately.</p>{reviewNotes.length > 0 && <div><h3 className="font-semibold">Other screened passages ({reviewNotes.length})</h3><ul className="mt-2 list-disc pl-5">{reviewNotes.map((note) => <li key={note.id}>{note.section}: {note.title} — {note.disposition === "unresolved" ? "unresolved" : "excluded after context review"}</li>)}</ul></div>}{law.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#2d789f] underline">{source.label} ↗</a></p>)}</div></details>
          </>}
        </div>
      </section>
    </div>
  </div>;
}
