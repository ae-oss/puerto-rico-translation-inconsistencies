"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Law, Finding } from "@/lib/types";

type Sort = "date" | "findings" | "status";

export function LawList({ laws, findings }: { laws: Law[]; findings: Finding[] }) {
  const [sort, setSort] = useState<Sort>("date");
  const [reversed, setReversed] = useState(false);
  const ordered = useMemo(() => [...laws].sort((a, b) => {
    const count = (law: Law) => findings.filter((finding) => finding.lawId === law.id).length;
    const comparison = sort === "date" ? b.enactedOn.localeCompare(a.enactedOn) : sort === "findings" ? count(b) - count(a) : a.status.localeCompare(b.status);
    return reversed ? -comparison : comparison;
  }), [laws, findings, sort, reversed]);
  const chooseSort = (next: Sort) => { if (next === sort) setReversed((value) => !value); else { setSort(next); setReversed(false); } };

  return (
    <section id="legislation" aria-label="Available legislation" className="mt-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#d8dadd] pt-5 text-[14px]">
        <span className="text-[#70767c]">Sort by</span>
        <button aria-pressed={sort === "date"} onClick={() => chooseSort("date")} className={`sort-link ${sort === "date" ? "active" : ""}`}>Date of act {sort === "date" ? (reversed ? "· oldest first" : "· newest first") : ""}</button>
        <button aria-pressed={sort === "findings"} onClick={() => chooseSort("findings")} className={`sort-link ${sort === "findings" ? "active" : ""}`}>Differences {sort === "findings" ? (reversed ? "· fewest first" : "· most first") : ""}</button>
        <button aria-pressed={sort === "status"} onClick={() => chooseSort("status")} className={`sort-link ${sort === "status" ? "active" : ""}`}>Review status</button>
      </div>
      <div className="mt-2">
        {ordered.map((law) => {
          const published = findings.filter((finding) => finding.lawId === law.id);
          const major = published.filter((finding) => finding.impact === "major").length;
          const limited = published.filter((finding) => finding.impact === "limited").length;
          return (
            <article key={law.id} className="grid gap-4 border-b border-[#d9dcde] py-8 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] lg:gap-10">
              <div>
                <h2 className="font-serif text-[28px] leading-[1.18] tracking-[-.015em] text-[#30343a] sm:text-[33px]"><Link href={`/laws/${law.id}/`} className="hover:text-[#2f6789]">{law.number} — {law.title}</Link></h2>
                <p className="mt-3 max-w-[75ch] text-[15px] leading-6 text-[#626970]">{law.description}</p>
                <p className="mt-4 text-[13px] text-[#6a7178]">Original publication · {new Date(`${law.enactedOn}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })} · {law.edition}</p>
              </div>
              <div className="lg:pt-1">
                <Link href={`/laws/${law.id}/`} className="inline-flex items-center gap-3 text-[18px] font-semibold text-[#333a40] hover:text-[#2f6789]">{published.length} {published.length === 1 ? "difference" : "differences"} in meaning <span className="text-[#3879a3]" aria-hidden="true">→</span></Link>
                <p className="mt-3 flex items-center gap-2 text-[13px] text-[#5d676d]"><span className="h-[9px] w-[9px] rounded-full bg-[#2a705d]" aria-hidden="true" />{law.coverage.label}</p>
                <div className="mt-4 flex h-[8px] max-w-[470px] overflow-hidden bg-[#e4e6e6]" role="img" aria-label={`${major} major and ${limited} limited potential impact findings`}>
                  {major > 0 && <span className="bg-[#30353a]" style={{ width: `${major / published.length * 100}%` }} />}
                  {limited > 0 && <span className="bg-[#a1a7ab]" style={{ width: `${limited / published.length * 100}%` }} />}
                </div>
                <p className="mt-3 flex gap-5 text-[13px] text-[#555e64]"><span>■ Major {major}</span><span className="text-[#858d92]">■ Limited {limited}</span></p>
                <p className="mt-4 text-[13px] text-[#6b7379]">Spanish ↔ English · {law.status.replaceAll("-", " ")}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-[12px] text-[#737b80]">Impact labels describe potential consequences of wording differences. They do not establish an actual change in legal effect.</p>
    </section>
  );
}
