import { FREQ_0_3, InstrumentDef, InstrumentScore } from "./types";

// ── GAD-7 ─────────────────────────────────────────────────────────────────
// 7 items, 0–3.

export const GAD7: InstrumentDef = {
  code: "GAD7",
  name: "GAD-7",
  version: "1.0",
  attribution: "GAD-7 © Pfizer Inc.",
  intro:
    "Over the last 2 weeks, how often have you been bothered by the following problems?",
  items: [
    { id: "gad7_1", text: "Feeling nervous, anxious, or on edge", options: FREQ_0_3 },
    { id: "gad7_2", text: "Not being able to stop or control worrying", options: FREQ_0_3 },
    { id: "gad7_3", text: "Worrying too much about different things", options: FREQ_0_3 },
    { id: "gad7_4", text: "Trouble relaxing", options: FREQ_0_3 },
    { id: "gad7_5", text: "Being so restless that it is hard to sit still", options: FREQ_0_3 },
    { id: "gad7_6", text: "Becoming easily annoyed or irritable", options: FREQ_0_3 },
    { id: "gad7_7", text: "Feeling afraid, as if something awful might happen", options: FREQ_0_3 },
  ],
};

export function gad7Band(total: number): string {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  return "severe";
}

export function scoreGAD7(responses: Record<string, number>): InstrumentScore {
  const itemScores: Record<string, number> = {};
  let total = 0;
  for (const item of GAD7.items) {
    const v = responses[item.id] ?? 0;
    itemScores[item.id] = v;
    total += v;
  }
  return {
    code: GAD7.code,
    name: GAD7.name,
    version: GAD7.version,
    total,
    maxTotal: 21,
    band: gad7Band(total),
    itemScores,
  };
}
