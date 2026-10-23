import type { Impact } from "@/lib/types";

const styles: Record<Impact, string> = {
  major: "border-[#c8a7a0] bg-[#f6eae6] text-[#813c34]",
  limited: "border-[#c9bf9a] bg-[#f5f0de] text-[#755e23]",
  unrated: "border-[#d4d4cb] bg-[#f1f1ed] text-[#5c6663]",
};

export function ImpactBadge({ impact }: { impact: Impact }) {
  return <span className={`inline-flex rounded-sm border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.08em] ${styles[impact]}`}>{impact}</span>;
}
