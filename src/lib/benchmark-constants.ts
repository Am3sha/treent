// Single source of truth for company size values.
// Both the frontend (quiz) and backend (stats aggregation) must import from here.
export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];

// Pretty labels for UI display only — the actual stored/sent value stays plain (COMPANY_SIZES above).
export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  "1-10": "1 – 10",
  "11-50": "11 – 50",
  "51-200": "51 – 200",
  "201-1000": "201 – 1,000",
  "1000+": "1,000+",
};
