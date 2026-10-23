export type Impact = "major" | "limited" | "unrated";
export type ReviewStatus = "demonstration" | "pending" | "initial-review" | "critical-review" | "reviewed";

export type TextPart = {
  text: string;
  highlight: boolean;
};

export type Citation = {
  label: string;
  url: string;
  note?: string;
};

export type Law = {
  id: string;
  number: string;
  title: string;
  spanishTitle: string;
  description: string;
  enactedOn: string;
  edition: string;
  status: "awaiting-review" | "in-review" | "reviewed";
  coverage: {
    label: string;
    reviewedSections: number;
    totalSections: number | null;
  };
  sources: (Citation & { language: "es" | "en"; kind: string })[];
};

export type Finding = {
  id: string;
  lawId: string | null;
  published: boolean;
  section: string;
  title: string;
  impact: Impact;
  status: ReviewStatus;
  confidence: "low" | "medium" | "high" | null;
  spanish: TextPart[];
  officialEnglish: TextPart[];
  independentEnglish: TextPart[];
  meaning: string;
  potentialConsequence: string;
  impactReason: string;
  initialAssessment: string;
  criticalReview: string;
  downstream: {
    status: "confirmed" | "potential" | "none-demonstrated" | "not-assessed";
    summary: string;
    citations: Citation[];
  };
  sources: Citation[];
};

export type ReviewNote = {
  id: string;
  lawId: string;
  section: string;
  title: string;
  disposition: "unresolved" | "excluded";
  summary: string;
};

export type ActTextPage = {
  page: number;
  text: string;
  findingIds: string[];
  highlights: { start: number; end: number; findingId: string }[];
};
