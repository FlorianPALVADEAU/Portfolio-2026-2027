/** Career path in display order; `end: null` means ongoing. Role and summary text live in messages. */
export const experience = [
  { id: "jcdecaux", organization: "JCDecaux", start: 2025, end: null },
  { id: "overbound", organization: "Overbound", start: 2025, end: null },
  { id: "apprentice", organization: "JCDecaux", start: 2023, end: 2025 },
  { id: "neurones", organization: "Neurones IT", start: 2022, end: 2023 },
] as const;

export function formatPeriod(start: number, end: number | null, presentLabel: string): string {
  return `${start} – ${end ?? presentLabel}`;
}
