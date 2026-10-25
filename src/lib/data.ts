import lawsJson from "@/data/laws.json";
import findingsJson from "@/data/findings.json";
import federalGuidanceJson from "@/data/federal-guidance.json";
import demoJson from "@/data/demo.json";
import reviewNotesJson from "@/data/review-notes.json";
import actTextsJson from "@/data/act-texts.json";
import type { ActTextPage, Finding, Law, ReviewNote } from "@/lib/types";

export const laws = lawsJson as Law[];
export const findings = findingsJson as Finding[];
export const federalGuidance = federalGuidanceJson as Finding[];
export const demoFinding = demoJson as Finding;
export const reviewNotes = reviewNotesJson as ReviewNote[];
export const actTexts = actTextsJson as Record<string, ActTextPage[]>;

export function getLaw(id: string) {
  return laws.find((law) => law.id === id);
}

export function getLawFindings(id: string) {
  return findings.filter((finding) => finding.lawId === id && finding.published);
}

export function getLawReviewNotes(id: string) {
  return reviewNotes.filter((note) => note.lawId === id);
}

export function getCounts(id: string) {
  const published = getLawFindings(id);
  return {
    total: published.length,
    major: published.filter((finding) => finding.impact === "major").length,
    limited: published.filter((finding) => finding.impact === "limited").length,
    unrated: published.filter((finding) => finding.impact === "unrated").length,
  };
}
