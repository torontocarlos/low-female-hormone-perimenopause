import { FREQ_0_3, InstrumentDef, InstrumentScore } from "./types";

// ── PHQ-9 ─────────────────────────────────────────────────────────────────
// 9 items, 0–3. Item 9 (self-harm) ≥ 1 triggers the crisis interrupt.

export const PHQ9: InstrumentDef = {
  code: "PHQ9",
  name: "PHQ-9",
  version: "1.0",
  attribution: "PHQ-9 © Pfizer Inc.",
  intro:
    "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
  items: [
    { id: "phq9_1", text: "Little interest or pleasure in doing things", options: FREQ_0_3 },
    { id: "phq9_2", text: "Feeling down, depressed, or hopeless", options: FREQ_0_3 },
    { id: "phq9_3", text: "Trouble falling or staying asleep, or sleeping too much", options: FREQ_0_3 },
    { id: "phq9_4", text: "Feeling tired or having little energy", options: FREQ_0_3 },
    { id: "phq9_5", text: "Poor appetite or overeating", options: FREQ_0_3 },
    {
      id: "phq9_6",
      text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      options: FREQ_0_3,
    },
    {
      id: "phq9_7",
      text: "Trouble concentrating on things, such as reading the newspaper or watching television",
      options: FREQ_0_3,
    },
    {
      id: "phq9_8",
      text: "Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual",
      options: FREQ_0_3,
    },
    {
      id: "phq9_9",
      text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
      options: FREQ_0_3,
    },
  ],
};

export function phq9Band(total: number): string {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  if (total <= 19) return "moderately severe";
  return "severe";
}

export function scorePHQ9(responses: Record<string, number>): InstrumentScore {
  const itemScores: Record<string, number> = {};
  let total = 0;
  for (const item of PHQ9.items) {
    const v = responses[item.id] ?? 0;
    itemScores[item.id] = v;
    total += v;
  }
  const item9 = itemScores["phq9_9"] ?? 0;
  return {
    code: PHQ9.code,
    name: PHQ9.name,
    version: PHQ9.version,
    total,
    maxTotal: 27,
    band: phq9Band(total),
    itemScores,
    extra: { item9, item9Positive: item9 >= 1 },
  };
}
