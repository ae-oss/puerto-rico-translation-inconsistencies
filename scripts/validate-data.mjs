import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const laws = read("../src/data/laws.json");
const findings = read("../src/data/findings.json");
const federalGuidance = read("../src/data/federal-guidance.json");
const demo = read("../src/data/demo.json");
const reviewNotes = read("../src/data/review-notes.json");
const actTexts = read("../src/data/act-texts.json");
const errors = [];
const lawIds = new Set();
const findingIds = new Set();
const reviewNoteIds = new Set();
const impacts = new Set(["major", "limited", "unrated"]);
const statuses = new Set(["pending", "initial-review", "critical-review", "reviewed"]);

function check(condition, message) { if (!condition) errors.push(message); }
function text(value) { return typeof value === "string" && value.trim().length > 0; }
function https(value) { return typeof value === "string" && /^https:\/\//.test(value); }
function parts(value) { return Array.isArray(value) && value.length > 0 && value.every((part) => text(part.text) && typeof part.highlight === "boolean"); }

check(Array.isArray(laws), "laws.json must be an array");
check(Array.isArray(findings), "findings.json must be an array");
check(Array.isArray(federalGuidance), "federal-guidance.json must be an array");
check(Array.isArray(reviewNotes), "review-notes.json must be an array");
if (Array.isArray(laws)) for (const law of laws) {
  check(text(law.id) && !lawIds.has(law.id), `Law has a missing or duplicate ID: ${law.id}`);
  lawIds.add(law.id);
  for (const key of ["number", "title", "spanishTitle", "description", "edition"]) check(text(law[key]), `Law ${law.id}: ${key} is required`);
  check(["awaiting-review", "in-review", "reviewed"].includes(law.status), `Law ${law.id}: invalid status`);
  check(text(law.coverage?.label) && Number.isInteger(law.coverage?.reviewedSections) && law.coverage.reviewedSections >= 0 && (law.coverage.totalSections === null || (Number.isInteger(law.coverage.totalSections) && law.coverage.reviewedSections <= law.coverage.totalSections)), `Law ${law.id}: coverage is incomplete`);
  check(Array.isArray(law.sources) && law.sources.some((source) => source.kind === "official-text" && source.language === "es" && https(source.url)) && law.sources.some((source) => source.kind === "official-translation" && source.language === "en" && https(source.url)), `Law ${law.id}: both official source links are required`);
}
if (Array.isArray(findings) && Array.isArray(federalGuidance)) for (const finding of [...findings, ...federalGuidance]) {
  const isGuidance = federalGuidance.includes(finding);
  check(text(finding.id) && !findingIds.has(finding.id), `Finding has a missing or duplicate ID: ${finding.id}`);
  findingIds.add(finding.id);
  check(isGuidance ? finding.lawId === null : lawIds.has(finding.lawId), `Finding ${finding.id}: incorrect law association`);
  check(typeof finding.published === "boolean", `Finding ${finding.id}: published must be boolean`);
  check(finding.published === true, `Finding ${finding.id}: unpublished drafts must stay in the Git-ignored research file, not public findings.json`);
  check(text(finding.section) && text(finding.title), `Finding ${finding.id}: section and title are required`);
  check(impacts.has(finding.impact) && statuses.has(finding.status), `Finding ${finding.id}: impact or review status is invalid`);
  check(["low", "medium", "high"].includes(finding.confidence), `Finding ${finding.id}: confidence is required`);
  for (const key of ["spanish", "officialEnglish", "independentEnglish"]) check(parts(finding[key]), `Finding ${finding.id}: ${key} must contain text parts`);
  for (const key of ["meaning", "potentialConsequence", "impactReason", "initialAssessment", "criticalReview"]) check(text(finding[key]), `Finding ${finding.id}: ${key} is required`);
  check(["confirmed", "potential", "none-demonstrated", "not-assessed"].includes(finding.downstream?.status) && text(finding.downstream?.summary), `Finding ${finding.id}: downstream assessment is incomplete`);
  check(Array.isArray(finding.downstream?.citations) && finding.downstream.citations.every((source) => text(source.label) && https(source.url)), `Finding ${finding.id}: invalid downstream citation`);
  const law = laws.find((candidate) => candidate.id === finding.lawId);
  const requiredSources = isGuidance
    ? ["https://www.dol.gov/agencies/whd/fmla/faq", "https://www.dol.gov/agencies/whd/fmla/faq-spanish", "https://www.ecfr.gov/current/title-29/section-"]
    : law?.sources.filter((source) => ["official-text", "official-translation"].includes(source.kind)).map((source) => source.url) || [];
  check(Array.isArray(finding.sources) && requiredSources.every((url) => finding.sources.some((citation) => isGuidance && url.includes("ecfr.gov") ? citation.url.startsWith(url) : citation.url === url)) && finding.sources.every((source) => text(source.label) && https(source.url)), `Finding ${finding.id}: required source citations are missing`);
}
if (Array.isArray(reviewNotes)) for (const note of reviewNotes) {
  check(text(note.id) && !reviewNoteIds.has(note.id) && !findingIds.has(note.id), `Review note has a missing or duplicate ID: ${note.id}`);
  reviewNoteIds.add(note.id);
  check(lawIds.has(note.lawId), `Review note ${note.id}: unknown law ID`);
  check(text(note.section) && text(note.title) && text(note.summary), `Review note ${note.id}: section, title and summary are required`);
  check(["unresolved", "excluded"].includes(note.disposition), `Review note ${note.id}: invalid disposition`);
}
check(demo.published === false && demo.status === "demonstration" && demo.lawId === null, "Demonstration must remain unpublished and unlinked to a law");
for (const law of laws) {
  const pages = actTexts[law.id];
  check(Array.isArray(pages) && pages.length > 0, `Law ${law.id}: extracted English text is required`);
  if (!Array.isArray(pages)) continue;
  const linked = new Set();
  for (const page of pages) {
    check(Number.isInteger(page.page) && text(page.text), `Law ${law.id}: a text page is incomplete`);
    check(Array.isArray(page.findingIds) && Array.isArray(page.highlights), `Law ${law.id}: finding links are missing`);
    for (const id of page.findingIds || []) linked.add(id);
    for (const span of page.highlights || []) check(Number.isInteger(span.start) && Number.isInteger(span.end) && span.start >= 0 && span.start < span.end && span.end <= page.text.length && findingIds.has(span.findingId), `Law ${law.id} page ${page.page}: invalid highlight`);
  }
  for (const finding of findings.filter((item) => item.lawId === law.id)) check(linked.has(finding.id), `Finding ${finding.id}: no matching page in English text`);
}

if (errors.length) { for (const error of errors) console.error(`â€¢ ${error}`); process.exit(1); }
console.log(`Validated ${laws.length} law(s), ${findings.length} legislative finding(s), ${federalGuidance.length} federal-guidance finding(s), and ${reviewNotes.length} screening note(s); demonstration data remains separate.`);
