import { notFound } from "next/navigation";
import { LawReader } from "@/components/law-reader";
import { actTexts, getLaw, getLawFindings, getLawReviewNotes, laws } from "@/lib/data";

export function generateStaticParams() { return laws.map((law) => ({ id: law.id })); }

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => ({ title: getLaw(id)?.number || "Legislation" }));
}

export default async function LawPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const law = getLaw(id);
  if (!law) notFound();
  return <LawReader law={law} laws={laws} findings={getLawFindings(id)} reviewNotes={getLawReviewNotes(id)} pages={actTexts[id] || []} />;
}
