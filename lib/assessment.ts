import {
  Flag,
  InstrumentResponses,
  IntakeAnswers,
  StageResult,
} from "./types";
import { InstrumentScore } from "./instruments/types";
import { scoreMRS } from "./instruments/mrs";
import { scorePHQ9 } from "./instruments/phq9";
import { scoreGAD7 } from "./instruments/gad7";
import { scoreISI } from "./instruments/isi";
import { scoreAUDITC } from "./instruments/auditc";
import { computeStage } from "./staging";
import { computeFlags } from "./flags";

export interface MhtProfile {
  /** 'contraindicated' | 'caution' | 'clear' for SYSTEMIC MHT. */
  level: "contraindicated" | "caution" | "clear";
  reasons: string[];
}

export interface AssessmentResult {
  stage: StageResult;
  scores: Partial<Record<string, InstrumentScore>>;
  flags: Flag[];
  gsmPresent: boolean;
  mhtProfile: MhtProfile;
  vmsPresent: boolean;
}

export function computeAssessment(
  answers: IntakeAnswers,
  instruments: InstrumentResponses
): AssessmentResult {
  const scores: Partial<Record<string, InstrumentScore>> = {};
  if (instruments.MRS) scores.MRS = scoreMRS(instruments.MRS);
  if (instruments.PHQ9) scores.PHQ9 = scorePHQ9(instruments.PHQ9);
  if (instruments.GAD7) scores.GAD7 = scoreGAD7(instruments.GAD7);
  if (instruments.ISI) scores.ISI = scoreISI(instruments.ISI);
  if (instruments.AUDIT_C) scores.AUDIT_C = scoreAUDITC(instruments.AUDIT_C);

  const stage = computeStage(answers);
  const flags = computeFlags(answers, instruments);

  const gsmPresent = isGsmPresent(answers);
  const vmsPresent =
    (!!answers.hot_flash_severity && answers.hot_flash_severity !== "none") ||
    !!answers.night_sweat_frequency ||
    (scores.MRS?.itemScores["mrs_hot_flushes"] ?? 0) >= 1;

  const mhtProfile = computeMhtProfile(answers);

  return { stage, scores, flags, gsmPresent, mhtProfile, vmsPresent };
}

function isGsmPresent(a: IntakeAnswers): boolean {
  const sym = (
    v?: "none" | "occasional" | "often" | "always"
  ): boolean => !!v && v !== "none";
  return (
    sym(a.vaginal_dryness) ||
    sym(a.dyspareunia) ||
    sym(a.urinary_frequency) ||
    (a.recurrent_uti ?? 0) > 0
  );
}

function computeMhtProfile(a: IntakeAnswers): MhtProfile {
  const reasons: string[] = [];
  let level: MhtProfile["level"] = "clear";

  if (a.breast_cancer_personal) {
    level = "contraindicated";
    reasons.push("Personal history of breast cancer");
  }
  if (a.unexplained_bleeding) {
    if (level !== "contraindicated") level = "caution";
    reasons.push("Unexplained vaginal bleeding (evaluate before starting MHT)");
  }

  const cautions: Array<[boolean | undefined, string]> = [
    [a.vte_personal, "Personal VTE — transdermal preferred, weigh suitability"],
    [a.cv_personal, "Personal stroke/MI/CAD — weigh route and timing"],
    [a.gyn_cancer_personal, "Personal endometrial/ovarian cancer — specialist input"],
    [a.migraine_status === "with_aura", "Migraine with aura — transdermal preferred"],
    [a.liver_disease, "Liver disease — avoid oral; weigh suitability"],
    [
      a.smoking_status === "current" && (a.age ?? 0) >= 35,
      "Current smoker age ≥ 35 — cardiovascular consideration",
    ],
  ];
  for (const [cond, reason] of cautions) {
    if (cond) {
      if (level === "clear") level = "caution";
      reasons.push(reason);
    }
  }

  return { level, reasons };
}
