import {
  DomainScore,
  InstrumentDef,
  InstrumentScore,
  SEVERITY_0_4,
} from "./types";

// ── Menopause Rating Scale (MRS) ──────────────────────────────────────────
// 11 items, each scored 0–4. Three subscales.
//
// The clinical brief specifies contiguous grouping: items 1–4 somato-vegetative,
// 5–8 psychological, 9–11 urogenital. The OFFICIAL MRS assigns the same three
// domains but in a different *canonical* item order (joint/muscular -> somato,
// sexual problems -> urogenital). We reconcile the two by presenting the items
// in an order where the brief's contiguous blocks ALSO match the validated
// clinical domains, so domain subscores and total match the published reference.
//
// Domain bands below are the published MRS subscale cut-offs.

export const MRS: InstrumentDef = {
  code: "MRS",
  name: "Menopause Rating Scale",
  version: "1.0",
  attribution:
    "Menopause Rating Scale — Heinemann, Potthoff, Schneider. Berlin Center for Epidemiology and Health Research.",
  intro:
    "Below is a list of symptoms many women notice around the menopause transition. For each one, choose how much it has been bothering you lately. If a symptom does not apply to you, choose “None.”",
  items: [
    // Somato-vegetative (1–4)
    {
      id: "mrs_hot_flushes",
      domain: "somato",
      text: "Hot flushes, sweating",
      hint: "Episodes of sweating, flushing of the face or body.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_heart",
      domain: "somato",
      text: "Heart discomfort",
      hint: "Unusual awareness of heartbeat, heart skipping, racing, or tightness.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_sleep",
      domain: "somato",
      text: "Sleep problems",
      hint: "Difficulty falling asleep, staying asleep, or waking too early.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_joint",
      domain: "somato",
      text: "Joint and muscular discomfort",
      hint: "Pain in the joints, rheumatic-type complaints.",
      options: SEVERITY_0_4,
    },
    // Psychological (5–8)
    {
      id: "mrs_depressive",
      domain: "psych",
      text: "Depressive mood",
      hint: "Feeling down, sad, on the verge of tears, lack of drive, mood swings.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_irritability",
      domain: "psych",
      text: "Irritability",
      hint: "Feeling nervous, inner tension, feeling aggressive.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_anxiety",
      domain: "psych",
      text: "Anxiety",
      hint: "Inner restlessness, feeling panicky.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_exhaustion",
      domain: "psych",
      text: "Physical and mental exhaustion",
      hint: "General decrease in performance, impaired memory, poor concentration, forgetfulness.",
      options: SEVERITY_0_4,
    },
    // Urogenital (9–11)
    {
      id: "mrs_sexual",
      domain: "uro",
      text: "Sexual problems",
      hint: "Change in sexual desire, in sexual activity and satisfaction.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_bladder",
      domain: "uro",
      text: "Bladder problems",
      hint: "Difficulty urinating, increased need to urinate, bladder incontinence.",
      options: SEVERITY_0_4,
    },
    {
      id: "mrs_dryness",
      domain: "uro",
      text: "Dryness of the vagina",
      hint: "Sensation of dryness or burning, discomfort with intercourse.",
      options: SEVERITY_0_4,
    },
  ],
};

const DOMAIN_META: Record<string, { key: string; label: string }> = {
  somato: { key: "somato", label: "Somato-vegetative" },
  psych: { key: "psych", label: "Psychological" },
  uro: { key: "uro", label: "Urogenital" },
};

/** Published MRS total-score band. */
export function mrsTotalBand(total: number): string {
  if (total <= 4) return "none/little";
  if (total <= 8) return "mild";
  if (total <= 15) return "moderate";
  return "severe";
}

/** Published MRS subscale bands. */
function domainBand(domainKey: string, score: number): string {
  switch (domainKey) {
    case "somato":
      if (score <= 2) return "none/little";
      if (score <= 4) return "mild";
      if (score <= 8) return "moderate";
      return "severe";
    case "psych":
      if (score <= 1) return "none/little";
      if (score <= 3) return "mild";
      if (score <= 6) return "moderate";
      return "severe";
    case "uro":
      if (score <= 0) return "none/little";
      if (score <= 1) return "mild";
      if (score <= 3) return "moderate";
      return "severe";
    default:
      return "unknown";
  }
}

export function scoreMRS(responses: Record<string, number>): InstrumentScore {
  const itemScores: Record<string, number> = {};
  const domainTotals: Record<string, number> = { somato: 0, psych: 0, uro: 0 };

  for (const item of MRS.items) {
    const v = responses[item.id] ?? 0;
    itemScores[item.id] = v;
    if (item.domain) domainTotals[item.domain] += v;
  }

  const total = Object.values(domainTotals).reduce((a, b) => a + b, 0);

  const domains: DomainScore[] = Object.keys(domainTotals).map((key) => ({
    key: DOMAIN_META[key].key,
    label: DOMAIN_META[key].label,
    score: domainTotals[key],
    band: domainBand(key, domainTotals[key]),
  }));

  return {
    code: MRS.code,
    name: MRS.name,
    version: MRS.version,
    total,
    maxTotal: 44,
    band: mrsTotalBand(total),
    domains,
    itemScores,
  };
}
