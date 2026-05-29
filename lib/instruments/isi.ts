import { InstrumentDef, InstrumentItem, InstrumentScore } from "./types";

// ── Insomnia Severity Index (ISI) ─────────────────────────────────────────
// 7 items, 0–4, with per-item anchors. Total 0–28.

const sevInsomnia: InstrumentItem["options"] = [
  { value: 0, label: "None" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" },
  { value: 4, label: "Very severe" },
];

const satisfaction: InstrumentItem["options"] = [
  { value: 0, label: "Very satisfied" },
  { value: 1, label: "Satisfied" },
  { value: 2, label: "Moderately satisfied" },
  { value: 3, label: "Dissatisfied" },
  { value: 4, label: "Very dissatisfied" },
];

const noticeable: InstrumentItem["options"] = [
  { value: 0, label: "Not at all noticeable" },
  { value: 1, label: "A little" },
  { value: 2, label: "Somewhat" },
  { value: 3, label: "Much" },
  { value: 4, label: "Very much noticeable" },
];

const worried: InstrumentItem["options"] = [
  { value: 0, label: "Not at all worried" },
  { value: 1, label: "A little" },
  { value: 2, label: "Somewhat" },
  { value: 3, label: "Much" },
  { value: 4, label: "Very much worried" },
];

const interfering: InstrumentItem["options"] = [
  { value: 0, label: "Not at all interfering" },
  { value: 1, label: "A little" },
  { value: 2, label: "Somewhat" },
  { value: 3, label: "Much" },
  { value: 4, label: "Very much interfering" },
];

export const ISI: InstrumentDef = {
  code: "ISI",
  name: "Insomnia Severity Index",
  version: "1.0",
  attribution: "Insomnia Severity Index — Charles M. Morin.",
  intro:
    "For the following questions, please rate the CURRENT (i.e. last 2 weeks) severity of your insomnia problem(s).",
  items: [
    { id: "isi_1", text: "Difficulty falling asleep", options: sevInsomnia },
    { id: "isi_2", text: "Difficulty staying asleep", options: sevInsomnia },
    { id: "isi_3", text: "Problem waking up too early", options: sevInsomnia },
    {
      id: "isi_4",
      text: "How satisfied/dissatisfied are you with your current sleep pattern?",
      options: satisfaction,
    },
    {
      id: "isi_5",
      text: "How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?",
      options: noticeable,
    },
    {
      id: "isi_6",
      text: "How worried/distressed are you about your current sleep problem?",
      options: worried,
    },
    {
      id: "isi_7",
      text: "To what extent do you consider your sleep problem to interfere with your daily functioning currently?",
      options: interfering,
    },
  ],
};

export function isiBand(total: number): string {
  if (total <= 7) return "no clinically significant insomnia";
  if (total <= 14) return "subthreshold insomnia";
  if (total <= 21) return "moderate clinical insomnia";
  return "severe clinical insomnia";
}

export function scoreISI(responses: Record<string, number>): InstrumentScore {
  const itemScores: Record<string, number> = {};
  let total = 0;
  for (const item of ISI.items) {
    const v = responses[item.id] ?? 0;
    itemScores[item.id] = v;
    total += v;
  }
  return {
    code: ISI.code,
    name: ISI.name,
    version: ISI.version,
    total,
    maxTotal: 28,
    band: isiBand(total),
    itemScores,
  };
}
