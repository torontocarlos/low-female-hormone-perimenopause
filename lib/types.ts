// Intake answer shapes for the perimenopause pathway. These mirror §5 of the
// clinical brief. Most picklist fields are string unions; free-text and
// multi-select fields are strings / string[]. All fields are optional because
// the intake is filled progressively and save-and-continue is supported.

export type MenstruatingStatus =
  | "yes_regular"
  | "yes_irregular"
  | "no_lt12" // no periods for less than 12 months
  | "no_12plus" // no periods for 12+ months
  | "hysterectomy"
  | "no_other";

export type YesNoSometimes = "yes" | "no" | "sometimes";
export type ImpactLevel = "none" | "some" | "significant" | "severe";

export interface IntakeAnswers {
  // 5.1 demographics & consent
  age?: number;
  postal_fsa?: string;
  gender_identity?: string; // optional self-description (§5.1)
  consent_ack_1?: boolean;
  consent_ack_2?: boolean;
  consent_ack_3?: boolean;

  // 5.2 opening
  opener_freetext?: string;
  opener_duration?: "weeks" | "months" | "a_year_plus" | "always_wondered";

  // 5.3 menstrual history
  menstruating_status?: MenstruatingStatus;
  cycle_length_current?: string;
  cycle_change?: string;
  irregularity_pattern?: string;
  lmp_date?: string; // approximate ok ("2024-03", "2023", etc.)
  hysterectomy_year?: string;
  oophorectomy_status?: "retained" | "removed" | "unsure";
  menarche_age?: number;
  family_menopause_age?: string;

  // 5.6 symptom impact context
  top_symptom?: string;
  impact_work?: ImpactLevel;
  impact_relationships?: ImpactLevel;
  impact_sleep?: ImpactLevel;
  impact_freetext?: string;

  // 5.7 vasomotor detail
  hot_flash_frequency?: string;
  hot_flash_severity?: "none" | "mild" | "moderate" | "severe";
  night_sweat_frequency?: string;
  vms_sleep_disruption?: "none" | "some" | "significant";
  vms_duration?: string;

  // 5.8 genitourinary
  vaginal_dryness?: "none" | "occasional" | "often" | "always";
  dyspareunia?: "none" | "occasional" | "often" | "always";
  urinary_frequency?: "none" | "occasional" | "often" | "always";
  recurrent_uti?: number;
  gsm_disclosure_barrier?: YesNoSometimes;

  // 5.9 mood/sleep/cognition self-report
  mood_changes?: string[];
  mood_changes_freetext?: string;
  cognitive_complaints?: "none" | "occasional" | "frequent" | "significant";

  // 5.10 medical history
  breast_cancer_personal?: boolean;
  gyn_cancer_personal?: boolean;
  vte_personal?: boolean;
  cv_personal?: boolean;
  unexplained_bleeding?: boolean;
  liver_disease?: boolean;
  migraine_status?: "none" | "without_aura" | "with_aura" | "unsure";
  htn?: boolean;
  dm?: boolean;
  fhx_breast_cancer?: string;
  fhx_vte?: string;

  // 5.11 medications & supplements
  meds_freetext?: string;
  current_hormones?: string;
  menopause_supplements?: string;

  // 5.12 reproductive & contraception
  pregnancy_possible?: boolean;
  current_contraception?: string;
  sexual_activity_pregnancy_risk?: boolean;
  missed_period_recent?: boolean;

  // 5.13 lifestyle
  smoking_status?: "never" | "former" | "current";
  alcohol_regular?: boolean;
  physical_activity?: string;
  weight_bearing_exercise?: string;
  caffeine_intake?: string;

  // 5.14 goals & preferences
  goals_freetext?: string;
  goals_select?: string[];
  mht_openness?: "yes" | "not_sure" | "prefer_not" | "unsure_what_involves";
  non_hormonal_tried?: string[];

  // bone-health screening helpers (drive FRAX trigger)
  family_hip_fracture?: boolean;
  known_osteopenia?: boolean;
  frax_result?: string; // pasted-back 10-year risk from the link-out FRAX tool
}

export interface InstrumentResponses {
  MRS?: Record<string, number>;
  PHQ9?: Record<string, number>;
  GAD7?: Record<string, number>;
  ISI?: Record<string, number>;
  AUDIT_C?: Record<string, number>;
}

export type FlagSeverity =
  | "crisis"
  | "urgent"
  | "hard_contraindication"
  | "significant"
  | "caution"
  | "comorbidity";

export interface Flag {
  code: string;
  severity: FlagSeverity;
  /** Short clinician-facing label. */
  clinicianNote: string;
  /** Plain-language, non-excluding patient-facing framing (may be empty). */
  patientNote?: string;
}

export type StageKey =
  | "late_reproductive"
  | "early_transition"
  | "late_transition"
  | "early_postmenopause"
  | "late_postmenopause"
  | "surgical_menopause"
  | "needs_assessment";

export interface StageResult {
  key: StageKey;
  label: string;
  rationale: string;
  confidence: "high" | "moderate" | "low";
  /** True when within the MHT "10 years / under 60" initiation window, if computable. */
  withinMhtWindow?: boolean | null;
}

export interface SessionState {
  sessionId: string;
  appVersion: string;
  intakeVersion: number;
  status: "in_progress" | "completed" | "crisis_interrupted";
  email?: string;
  answers: IntakeAnswers;
  instruments: InstrumentResponses;
  stepIndex: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
