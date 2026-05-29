import { IntakeAnswers, StageResult } from "./types";

// ── STRAW+10 working stage ────────────────────────────────────────────────
// Best-effort computation from the menstrual history in §5.3. This is the most
// clinically-loaded computed field in the pathway. The brief (§14 #3, §15)
// says Carlos will provide 10 reference scenarios to validate this against, so
// the exact thresholds are PARKING-LOT items pending that sign-off. Everywhere
// it surfaces, it is hedged as a "working description, not a diagnosis."

const STAGE_LABELS: Record<StageResult["key"], string> = {
  late_reproductive: "late reproductive stage",
  early_transition: "early menopause transition (early perimenopause)",
  late_transition: "late menopause transition (late perimenopause)",
  early_postmenopause: "early postmenopause",
  late_postmenopause: "late postmenopause",
  surgical_menopause: "surgical menopause",
  needs_assessment: "needs clinician assessment",
};

/** Parse an approximate LMP string into a Date (first of month/year). */
function parseApproxDate(s?: string): Date | null {
  if (!s) return null;
  const trimmed = s.trim();
  // YYYY-MM
  let m = /^(\d{4})-(\d{1,2})$/.exec(trimmed);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, 1);
  // YYYY
  m = /^(\d{4})$/.exec(trimmed);
  if (m) return new Date(Number(m[1]), 0, 1);
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

function yearsSince(date: Date, now: Date): number {
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

export function computeStage(
  a: IntakeAnswers,
  now: Date = new Date()
): StageResult {
  const status = a.menstruating_status;
  const age = a.age;

  const mk = (
    key: StageResult["key"],
    rationale: string,
    confidence: StageResult["confidence"],
    withinMhtWindow: boolean | null = null
  ): StageResult => ({
    key,
    label: STAGE_LABELS[key],
    rationale,
    confidence,
    withinMhtWindow,
  });

  // Surgical menopause: hysterectomy with ovaries removed.
  if (status === "hysterectomy") {
    if (a.oophorectomy_status === "removed") {
      const within = age != null ? age < 60 : null;
      return mk(
        "surgical_menopause",
        "Hysterectomy with both ovaries removed (bilateral oophorectomy) — surgical menopause.",
        "high",
        within
      );
    }
    // Ovaries retained (or unknown): cannot stage by bleeding pattern.
    return mk(
      "needs_assessment",
      "Hysterectomy with ovaries retained or status unknown — menopausal stage cannot be determined from bleeding pattern; assess by symptoms (and bloodwork only if clinically needed).",
      "low"
    );
  }

  // 12+ months amenorrhea → postmenopause; split early/late by years since LMP.
  if (status === "no_12plus") {
    const lmp = parseApproxDate(a.lmp_date);
    if (lmp) {
      const yrs = yearsSince(lmp, now);
      const within = (age != null ? age < 60 : true) && yrs < 10;
      if (yrs < 6) {
        return mk(
          "early_postmenopause",
          `No menses for 12+ months; last menstrual period ~${yrs.toFixed(
            1
          )} years ago (within the first several years of postmenopause).`,
          "moderate",
          within
        );
      }
      return mk(
        "late_postmenopause",
        `No menses for 12+ months; last menstrual period ~${yrs.toFixed(
          1
        )} years ago.`,
        "moderate",
        within
      );
    }
    // No LMP date — postmenopausal but can't split early/late.
    return mk(
      "early_postmenopause",
      "No menses for 12+ months (postmenopausal). Date of last period not provided, so early-vs-late postmenopause is approximate.",
      "low",
      age != null ? age < 60 : null
    );
  }

  // No periods for <12 months: straddles late transition / early postmenopause.
  if (status === "no_lt12") {
    return mk(
      "late_transition",
      "No menses for less than 12 months — late menopause transition; the 12-month mark needed to confirm menopause has not yet been reached.",
      "moderate",
      age != null ? age < 60 : true
    );
  }

  // Irregular periods: early vs late transition by skipped-months pattern.
  if (status === "yes_irregular") {
    const pattern = (a.irregularity_pattern || "").toLowerCase();
    const skipped =
      /skip|miss|60|two month|2 month|gap|absent|no period for/.test(pattern);
    if (skipped) {
      return mk(
        "late_transition",
        "Irregular cycles with skipped months / intervals of amenorrhoea — consistent with late menopause transition.",
        "moderate",
        true
      );
    }
    return mk(
      "early_transition",
      "Cycles becoming irregular (persistent variability) — consistent with early menopause transition.",
      "moderate",
      true
    );
  }

  // Regular periods.
  if (status === "yes_regular") {
    const changed = !!(a.cycle_change && a.cycle_change.trim().length > 0);
    if (changed) {
      return mk(
        "early_transition",
        "Periods still occurring but with a noticeable change in pattern — may represent the very start of the menopause transition.",
        "low",
        true
      );
    }
    return mk(
      "late_reproductive",
      "Regular periods without a notable change in pattern — late reproductive stage. Symptoms, if present, warrant assessment for other causes.",
      "moderate",
      null
    );
  }

  // No periods for another reason, or nothing provided.
  return mk(
    "needs_assessment",
    "Menstrual pattern is ambiguous or not provided — clinician assessment needed to determine stage.",
    "low"
  );
}
