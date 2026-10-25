"use client";

import { useEffect, useMemo, useState } from "react";
import type { Finding } from "@/lib/types";
import { FindingDetail } from "@/components/finding-detail";
import { ImpactBadge } from "@/components/badge";

export function FindingBrowser({ findings, guidance = false }: { findings: Finding[]; guidance?: boolean }) {
  const [query, setQuery] = useState("");
  const [impact, setImpact] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    const selectFromHash = () => {
      const id = new URLSearchParams(window.location.hash.slice(1)).get("finding");
      if (id && findings.some((finding) => finding.id === id)) setSelectedId(id);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [findings]);
  const filtered = useMemo(() => findings.filter((finding) => {
    const text = `${finding.title} ${finding.section} ${finding.meaning}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (impact === "all" || finding.impact === impact) && (status === "all" || finding.status === status);
  }), [findings, query, impact, status]);
  const selected = filtered.find((finding) => finding.id === selectedId) || filtered[0];
  const selectFinding = (id: string) => {
    setSelectedId(id);
    window.history.replaceState(null, "", `#finding=${encodeURIComponent(id)}`);
  };

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label><span className="sr-only">Search findings</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search findings" className="h-11 w-full rounded-[2px] border border-[#d9ded8] bg-white px-4 text-[13px] outline-none focus:border-[#36808c]" /></label>
        <label><span className="sr-only">Filter by impact</span><select value={impact} onChange={(event) => setImpact(event.target.value)} className="h-11 w-full rounded-[2px] border border-[#d9ded8] bg-white px-3 text-[13px] text-[#3c5658] outline-none focus:border-[#36808c]"><option value="all">All impacts</option><option value="major">Major</option><option value="limited">Limited</option><option value="unrated">Unrated</option></select></label>
        <label><span className="sr-only">Filter by review status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 w-full rounded-[2px] border border-[#d9ded8] bg-white px-3 text-[13px] text-[#3c5658] outline-none focus:border-[#36808c]"><option value="all">All review statuses</option><option value="pending">Pending</option><option value="initial-review">Initial review</option><option value="critical-review">Critical review</option><option value="reviewed">Reviewed</option></select></label>
      </div>
      {filtered.length ? <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-2" aria-label="Finding list">{filtered.map((finding) => <button key={finding.id} onClick={() => selectFinding(finding.id)} aria-pressed={selected?.id === finding.id} className={`w-full rounded-[2px] border p-4 text-left ${selected?.id === finding.id ? "border-[#9db9ba] bg-[#eaf2f0]" : "border-[#e1e2da] bg-white hover:border-[#aac2c0]"}`}><span className="block text-[11px] font-semibold uppercase tracking-[.1em] text-[#6c8080]">{finding.section}</span><strong className="my-2 block font-serif text-[18px] leading-snug text-[#213d41]">{finding.title}</strong><ImpactBadge impact={finding.impact} /></button>)}</div>
        {selected && <FindingDetail finding={selected} guidance={guidance} />}
      </div> : <div className="rounded-[3px] border border-dashed border-[#c9d5d1] bg-[#fbfcfa] px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#bdd0cc] font-serif text-[25px] text-[#558181]">—</div>
        <h3 className="font-serif text-[24px] text-[#284449]">{findings.length ? "No findings match" : "No verified findings yet"}</h3>
        <p className="mx-auto mt-2 max-w-[48ch] text-[13px] leading-6 text-[#6a7a78]">{findings.length ? "Try another search or filter." : "Findings will appear here when their source passages, assessment, and review record are ready for publication."}</p>
      </div>}
    </div>
  );
}
