import { federalGuidance } from "@/lib/data";
import { FindingBrowser } from "@/components/finding-browser";

export const metadata = { title: "Federal guidance Â· FMLA" };

export default function FederalGuidancePage() {
  const published = federalGuidance.filter((finding) => finding.published);
  return <main className="mx-auto max-w-[1460px] px-5 pb-16 pt-9 sm:px-8 lg:px-12">
    <div className="border-b border-[#dfe1e1] pb-7">
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#6a787a]">Federal guidance relevant to Puerto Rico</p>
      <h1 className="mt-2 font-serif text-[26px] leading-[1.25] tracking-[-.025em] text-[#30343a] sm:text-[28px]">DOL FMLA questions and answers</h1>
      <p className="mt-3 max-w-[88ch] text-[14px] leading-6 text-[#5c6268]">Matched English and Spanish questions published by the U.S. Department of Labor. These are federal agency explanations for an eligible Puerto Rico audience, separate from the Puerto Rico legislative translations in this siteâ€™s main list.</p>
      <p className="mt-3 text-[12px] text-[#697078]">Checked 26 October 2026 Â· {published.length} findings Â· {published.filter((f) => f.impact === "major").length} major potential Â· {published.filter((f) => f.impact === "limited").length} limited potential</p>
    </div>
    <div className="my-7 max-w-[95ch] border-l-2 border-[#8da7a9] pl-4 text-[13px] leading-6 text-[#57676a]">
      <p>The two FAQ pages have no visible prose revision dates, so the review pairs the specific questions rather than claiming that both entire pages are synchronized editions. The current FMLA regulations govern. Matched optional DOL forms state the rules correctly. No reader reliance, denial of leave, or other actual harm was found.</p>
    </div>
    <FindingBrowser findings={published} guidance />
    <p className="mt-9 max-w-[95ch] text-[12px] leading-6 text-[#697078]">Impact labels describe possible consequences, not a change to federal law. This comparison does not claim a general duty for DOL to publish translations. Review scope is limited to the matched questions and related documents cited in each finding.</p>
  </main>;
}
