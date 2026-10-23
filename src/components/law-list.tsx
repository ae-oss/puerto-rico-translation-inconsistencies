"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Law, Finding } from "@/lib/types";

export function LawList({ laws, findings }: { laws: Law[]; findings: Finding[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => laws.filter((law) => {
    const text = `${law.number} ${law.title} ${law.spanishTitle} ${law.description}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (status === "all" || law.status === status);
  }), [laws, query, status]);

  return (
    <section id="legislation" className="mx-auto max-w-[1320px] px-5 pb-14 pt-12 sm:px-10 sm:pt-16">
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-3">Legislation library</p>
          <h2 className="font-serif text-[32px] tracking-[-.035em] text-[#18363b] sm:text-[38px]">Acts in the collection</h2>
        </div>
        <p className="max-w-[35ch] text-[13px] leading-6 text-[#667474]">Each count reflects published research findings. Demonstration content is excluded.</p>
      </div>
      <div className="mb-5 flex flex-col gap-3 rounded-[3px] border border-[#deded6] bg-white p-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-[2px] border border-[#e3e4de] bg-[#fafaf8] px-4">
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0 text-[#758889]"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg>
          <span className="sr-only">Search legislation</span>
          <input className="h-11 min-w-0 flex-1 bg-transparent text-[14px] text-[#203a3e] outline-none placeholder:text-[#8a9693]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search laws or topics" />
        </label>
        <label className="flex items-center gap-3 rounded-[2px] border border-[#e3e4de] bg-[#fafaf8] px-4 text-[12px] text-[#6b7c7b]">
          <span>Status</span>
          <select className="h-11 min-w-[155px] flex-1 bg-transparent text-[13px] font-medium text-[#274248] outline-none" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="awaiting-review">Awaiting review</option>
            <option value="in-review">In review</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </label>
      </div>
      <div className="space-y-4">
        {filtered.map((law) => {
          const published = findings.filter((finding) => finding.lawId === law.id && finding.published);
          const major = published.filter((finding) => finding.impact === "major").length;
          const limited = published.filter((finding) => finding.impact === "limited").length;
          return (
            <Link key={law.id} href={`/laws/${law.id}/`} className="group block rounded-[3px] border border-[#dcdcd3] bg-white p-6 transition-[border-color,box-shadow] hover:border-[#9cb5b5] hover:shadow-[0_8px_30px_rgba(25,53,54,.06)] sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                <div className="max-w-[700px]">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[.11em] text-[#6a7e80]">
                    <span>{law.number}</span><span className="h-[3px] w-[3px] rounded-full bg-[#95a5a4]"/><span>{law.edition}</span><span className="rounded-[2px] border border-[#cbd9d2] bg-[#eef5ef] px-2 py-1 text-[#456f65]">{law.status.replaceAll("-", " ")}</span>
                  </div>
                  <h3 className="font-serif text-[26px] leading-tight tracking-[-.03em] text-[#1b373b] group-hover:text-[#276774] sm:text-[30px]">{law.title}</h3>
                  <p className="mt-1 font-serif text-[15px] italic text-[#7a8581]">{law.spanishTitle}</p>
                  <p className="mt-4 max-w-[68ch] text-[14px] leading-6 text-[#5a6969]">{law.description}</p>
                </div>
                <div className="grid min-w-[250px] grid-cols-3 gap-2 border-t border-[#e8e6df] pt-5 text-center lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <div><strong className="block font-serif text-[26px] text-[#1c4046]">{published.length}</strong><span className="text-[10px] uppercase tracking-[.08em] text-[#788886]">Findings</span></div>
                  <div><strong className="block font-serif text-[26px] text-[#1c4046]">{major}</strong><span className="text-[10px] uppercase tracking-[.08em] text-[#788886]">Major</span></div>
                  <div><strong className="block font-serif text-[26px] text-[#1c4046]">{limited}</strong><span className="text-[10px] uppercase tracking-[.08em] text-[#788886]">Limited</span></div>
                  <span className="col-span-3 mt-3 border-t border-[#e8e6df] pt-3 text-left text-[12px] text-[#6b7775]">{law.coverage.label} <span className="float-right text-[#286773]">Explore act →</span></span>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && <div className="rounded-[3px] border border-dashed border-[#cfd6d1] bg-white px-6 py-12 text-center text-[14px] text-[#637372]">No legislation matches those filters.</div>}
      </div>
    </section>
  );
}
