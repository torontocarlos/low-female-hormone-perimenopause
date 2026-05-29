import { InstrumentDef, InstrumentItem, InstrumentScore } from "./types";

// ── AUDIT-C ───────────────────────────────────────────────────────────────
// 3 items, 0–4. Positive screen for women: total ≥ 3.

const freq: InstrumentItem["options"] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Monthly or less" },
  { value: 2, label: "2–4 times a month" },
  { value: 3, label: "2–3 times a week" },
  { value: 4, label: "4 or more times a week" },
];

const typicalDrinks: InstrumentItem["options"] = [
  { value: 0, label: "1 or 2" },
  { value: 1, label: "3 or 4" },
  { value: 2, label: "5 or 6" },
  { value: 3, label: "7 to 9" },
  { value: 4, label: "10 or more" },
];

const sixOrMore: InstrumentItem["options"] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Less than monthly" },
  { value: 2, label: "Monthly" },
  { value: 3, label: "Weekly" },
  { value: 4, label: "Daily or almost daily" },
];

export const AUDIT_C: InstrumentDef = {
  code: "AUDIT_C",
  name: "AUDIT-C",
  version: "1.0",
  attribution: "AUDIT-C — World Health Organization.",
  intro:
    "A few questions about alcohol. One standard drink is roughly a 341 mL bottle of beer (5%), a 142 mL glass of wine (12%), or a 43 mL shot of spirits (40%).",
  items: [
    {
      id: "auditc_1",
      text: "How often do you have a drink containing alcohol?",
      options: freq,
    },
    {
      id: "auditc_2",
      text: "How many standard drinks do you have on a typical day when you are drinking?",
      options: typicalDrinks,
    },
    {
      id: "auditc_3",
      text: "How often do you have six or more standard drinks on one occasion?",
      options: sixOrMore,
    },
  ],
};

export function auditcBand(total: number): string {
  // Positive screen for women is ≥ 3.
  if (total >= 3) return "positive (warrants discussion)";
  return "below screening threshold";
}

export function scoreAUDITC(responses: Record<string, number>): InstrumentScore {
  const itemScores: Record<string, number> = {};
  let total = 0;
  for (const item of AUDIT_C.items) {
    const v = responses[item.id] ?? 0;
    itemScores[item.id] = v;
    total += v;
  }
  return {
    code: AUDIT_C.code,
    name: AUDIT_C.name,
    version: AUDIT_C.version,
    total,
    maxTotal: 12,
    band: auditcBand(total),
    itemScores,
    extra: { positive: total >= 3 },
  };
}
