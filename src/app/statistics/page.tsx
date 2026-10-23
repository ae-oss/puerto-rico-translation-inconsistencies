import Link from "next/link";
import { findings, laws } from "@/lib/data";

export const metadata = { title: "Statistics" };

export default function StatisticsPage() {
  const published = findings.filter((finding) => finding.published);
  const major = published.filter((finding) => finding.impact === "major").length;
  const limited = published.filter((finding) => finding.impact === "limited").length;
  const unrated = published.filter((finding) => finding.impact === "unrated").length;
  return <div className="mx-auto max-w-[1080px] px-5 py-9 sm:px-8">
    <h1 className="font-serif text-[28px]">Statistics</h1>
    <p className="mt-2 text-[14px] text-[#606970]">Published wording differences in the original acts currently under review.</p>
    <div className="mt-8 grid gap-4 border-y border-[#dfe1e1] py-7 sm:grid-cols-4">{[["Acts", laws.length], ["Differences", published.length], ["Major potential impact", major], ["Limited potential impact", limited]].map(([label, value]) => <div key={label}><p className="font-serif text-[28px]">{value}</p><p className="text-[12px] text-[#626b70]">{label}</p></div>)}</div>
    {unrated > 0 && <p className="mt-4 text-[13px]">{unrated} finding{unrated === 1 ? " has" : "s have"} no impact rating yet.</p>}
    <div className="mt-8 space-y-0">{laws.map((law) => { const group = published.filter((finding) => finding.lawId === law.id); return <div key={law.id} className="grid gap-2 border-b border-[#dfe1e1] py-6 sm:grid-cols-[1fr_220px]"><div><Link href={`/laws/${law.id}/`} className="font-serif text-[19px] hover:text-[#2c78a5]">{law.number} — {law.title} →</Link><p className="mt-1 text-[13px] text-[#697177]">{law.coverage.label}</p></div><p className="text-[13px] text-[#626b70]">{group.length} {group.length === 1 ? "finding" : "findings"} · {group.filter((finding) => finding.impact === "major").length} major · {group.filter((finding) => finding.impact === "limited").length} limited</p></div>; })}</div>
    <p className="mt-7 max-w-[75ch] text-[13px] leading-6 text-[#626b70]">These counts describe published comparisons, not the number of legal errors in the acts. Review coverage differs by act, and an impact label describes a potential consequence rather than a demonstrated legal effect. See the <Link href="/method/" className="text-[#2c78a5] underline">method</Link>.</p>
  </div>;
}
