"use client";

import {
  ImpactLevel,
  IntakeAnswers,
  MenstruatingStatus,
  YesNoSometimes,
} from "@/lib/types";
import {
  DURATION,
  FREQ4,
  IMPACT,
  MENSTRUATING_STATUS,
  MHT_OPENNESS,
  MIGRAINE,
  OOPHORECTOMY,
  SMOKING,
} from "@/lib/labels";
import { shouldOfferFRAX } from "@/lib/flags";
import {
  BoolChoice,
  Checkbox,
  CheckboxGroup,
  Choice,
  ChoiceGroup,
  TextArea,
  TextField,
} from "@/components/fields";

// ── Step model ─────────────────────────────────────────────────────────────
// The assessment is an ordered sequence of intake sections, validated
// instruments, and a terminal results step. AUDIT-C is the one conditional
// instrument (only administered when regular alcohol use is reported).

export type IntakeKey =
  | "intro"
  | "opening"
  | "menstrual"
  | "impact"
  | "vasomotor"
  | "genitourinary"
  | "mood_self"
  | "history"
  | "meds"
  | "reproductive"
  | "lifestyle"
  | "bone"
  | "goals";

export type InstrumentCode = "MRS" | "PHQ9" | "GAD7" | "ISI" | "AUDIT_C";

export type Step =
  | { kind: "intake"; key: IntakeKey; title: string }
  | { kind: "instrument"; key: InstrumentCode; code: InstrumentCode; title: string }
  | { kind: "results"; key: "results"; title: string };

const ORDER: Step[] = [
  { kind: "intake", key: "intro", title: "A little about you" },
  { kind: "intake", key: "opening", title: "What brings you here" },
  { kind: "intake", key: "menstrual", title: "Your periods" },
  { kind: "instrument", key: "MRS", code: "MRS", title: "Symptom check" },
  { kind: "intake", key: "impact", title: "How it’s affecting you" },
  { kind: "intake", key: "vasomotor", title: "Hot flashes & night sweats" },
  { kind: "intake", key: "genitourinary", title: "Vaginal & urinary symptoms" },
  { kind: "intake", key: "mood_self", title: "Mood, sleep & memory" },
  { kind: "instrument", key: "PHQ9", code: "PHQ9", title: "Mood" },
  { kind: "instrument", key: "GAD7", code: "GAD7", title: "Anxiety" },
  { kind: "instrument", key: "ISI", code: "ISI", title: "Sleep" },
  { kind: "intake", key: "history", title: "Your health history" },
  { kind: "intake", key: "meds", title: "Medications & supplements" },
  { kind: "intake", key: "reproductive", title: "Pregnancy & contraception" },
  { kind: "intake", key: "lifestyle", title: "Lifestyle" },
  { kind: "instrument", key: "AUDIT_C", code: "AUDIT_C", title: "Alcohol" },
  { kind: "intake", key: "bone", title: "Bone health" },
  { kind: "intake", key: "goals", title: "What you’re hoping for" },
  { kind: "results", key: "results", title: "Your results" },
];

/** Visible, ordered steps for the current answers (AUDIT-C is conditional). */
export function buildSteps(answers: IntakeAnswers): Step[] {
  return ORDER.filter((step) => {
    if (step.kind === "instrument" && step.code === "AUDIT_C") {
      return answers.alcohol_regular === true;
    }
    return true;
  });
}

// ── Option arrays ──────────────────────────────────────────────────────────

function choices<T extends string>(map: Record<string, string>): Choice<T>[] {
  return Object.entries(map).map(([value, label]) => ({
    value: value as T,
    label,
  }));
}

const MOOD_CHANGES = [
  { value: "low_mood", label: "Low mood" },
  { value: "irritability", label: "Irritability" },
  { value: "anxiety", label: "Anxiety" },
  { value: "tearful", label: "Tearfulness" },
  { value: "loss_interest", label: "Loss of interest in things" },
  { value: "rage", label: "Sudden anger or rage" },
];

const GOALS = [
  { value: "relief_vms", label: "Relief from hot flashes / night sweats" },
  { value: "sleep", label: "Better sleep" },
  { value: "mood", label: "Mood or anxiety support" },
  { value: "sexual", label: "Vaginal or sexual health" },
  { value: "energy", label: "More energy / less fatigue" },
  { value: "cognition", label: "Help with brain fog or memory" },
  { value: "bone", label: "Protecting my bones" },
  { value: "understand", label: "Understanding my options" },
  { value: "taken_seriously", label: "Being taken seriously" },
];

const NON_HORMONAL = [
  { value: "lifestyle", label: "Lifestyle changes (sleep, exercise, diet)" },
  { value: "supplements", label: "Supplements or herbal products" },
  { value: "cbt", label: "Therapy / CBT" },
  { value: "antidepressant", label: "An antidepressant for mood or flashes" },
  { value: "nothing", label: "Nothing yet" },
];

// ── Intake body ──────────────────────────────────────────────────────────--

export interface BodyProps {
  answers: IntakeAnswers;
  set: (patch: Partial<IntakeAnswers>) => void;
}

function num(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export function IntakeBody({ stepKey, answers, set }: { stepKey: IntakeKey } & BodyProps) {
  switch (stepKey) {
    case "intro":
      return (
        <div className="space-y-5">
          <p className="text-plum-700">
            A few details to start. Everything you enter stays on this device
            unless you choose to email yourself a summary at the end.
          </p>
          <TextField
            label="Your age"
            type="number"
            value={answers.age}
            onChange={(v) => set({ age: num(v) })}
          />
          <TextField
            label="First half of your postal code (optional)"
            hint="For example, L1S. Helps us show local resources later — never shared."
            value={answers.postal_fsa}
            onChange={(v) => set({ postal_fsa: v })}
          />
          <TextField
            label="How you describe your gender (optional)"
            value={answers.gender_identity}
            onChange={(v) => set({ gender_identity: v })}
          />
          <div className="space-y-2">
            <p className="field-label">Before we begin, please confirm:</p>
            <Checkbox
              label="I understand this tool does not diagnose me or decide my treatment — my clinician does that, with me."
              checked={!!answers.consent_ack_1}
              onChange={(v) => set({ consent_ack_1: v })}
            />
            <Checkbox
              label="I understand my answers are stored only on this device unless I choose to email a summary."
              checked={!!answers.consent_ack_2}
              onChange={(v) => set({ consent_ack_2: v })}
            />
            <Checkbox
              label="I’m completing this for myself (or someone I care for), as accurately as I can."
              checked={!!answers.consent_ack_3}
              onChange={(v) => set({ consent_ack_3: v })}
            />
          </div>
        </div>
      );

    case "opening":
      return (
        <div className="space-y-5">
          <TextArea
            label="In your own words, what made you wonder about perimenopause?"
            hint="There’s no wrong answer. Whatever you’ve noticed is a good place to start."
            value={answers.opener_freetext}
            onChange={(v) => set({ opener_freetext: v })}
          />
          <ChoiceGroup<"weeks" | "months" | "a_year_plus" | "always_wondered">
            label="How long has this been on your mind?"
            options={choices(DURATION)}
            value={answers.opener_duration}
            onChange={(v) => set({ opener_duration: v })}
          />
        </div>
      );

    case "menstrual": {
      const status = answers.menstruating_status;
      const havingPeriods =
        status === "yes_regular" || status === "yes_irregular";
      const stopped = status === "no_lt12" || status === "no_12plus";
      return (
        <div className="space-y-5">
          <ChoiceGroup<MenstruatingStatus>
            label="Which best describes your periods right now?"
            options={choices(MENSTRUATING_STATUS)}
            value={status}
            onChange={(v) => set({ menstruating_status: v })}
          />
          {havingPeriods && (
            <>
              <TextField
                label="Roughly how many days is your cycle now?"
                hint="From the first day of one period to the first day of the next."
                value={answers.cycle_length_current}
                onChange={(v) => set({ cycle_length_current: v })}
              />
              <TextArea
                label="Has anything about your cycle changed?"
                hint="Heavier, lighter, closer together, further apart, more unpredictable…"
                rows={3}
                value={answers.cycle_change}
                onChange={(v) => set({ cycle_change: v })}
              />
            </>
          )}
          {status === "yes_irregular" && (
            <TextArea
              label="How is it irregular?"
              hint="For example: skipping months, two periods close together, no period for 60+ days."
              rows={3}
              value={answers.irregularity_pattern}
              onChange={(v) => set({ irregularity_pattern: v })}
            />
          )}
          {stopped && (
            <TextField
              label="Roughly when was your last period?"
              hint="An approximate month and year is fine — e.g. 2024-03 or 2023."
              value={answers.lmp_date}
              onChange={(v) => set({ lmp_date: v })}
            />
          )}
          {status === "hysterectomy" && (
            <>
              <TextField
                label="What year was your hysterectomy?"
                value={answers.hysterectomy_year}
                onChange={(v) => set({ hysterectomy_year: v })}
              />
              <ChoiceGroup<"retained" | "removed" | "unsure">
                label="Were your ovaries removed as well?"
                options={choices(OOPHORECTOMY)}
                value={answers.oophorectomy_status}
                onChange={(v) => set({ oophorectomy_status: v })}
              />
            </>
          )}
          <TextField
            label="Age when your periods first started (optional)"
            type="number"
            value={answers.menarche_age}
            onChange={(v) => set({ menarche_age: num(v) })}
          />
          <TextField
            label="If you know it, the age your mother or sisters reached menopause (optional)"
            value={answers.family_menopause_age}
            onChange={(v) => set({ family_menopause_age: v })}
          />
        </div>
      );
    }

    case "impact":
      return (
        <div className="space-y-5">
          <TextField
            label="Which symptom is bothering you most right now?"
            value={answers.top_symptom}
            onChange={(v) => set({ top_symptom: v })}
          />
          <ChoiceGroup<ImpactLevel>
            label="How much is this affecting your work or daily activities?"
            options={choices(IMPACT)}
            value={answers.impact_work}
            onChange={(v) => set({ impact_work: v })}
          />
          <ChoiceGroup<ImpactLevel>
            label="How much is it affecting your relationships?"
            options={choices(IMPACT)}
            value={answers.impact_relationships}
            onChange={(v) => set({ impact_relationships: v })}
          />
          <ChoiceGroup<ImpactLevel>
            label="How much is it affecting your sleep?"
            options={choices(IMPACT)}
            value={answers.impact_sleep}
            onChange={(v) => set({ impact_sleep: v })}
          />
          <TextArea
            label="Anything else you want your clinician to understand about the impact? (optional)"
            value={answers.impact_freetext}
            onChange={(v) => set({ impact_freetext: v })}
          />
        </div>
      );

    case "vasomotor":
      return (
        <div className="space-y-5">
          <ChoiceGroup<"none" | "mild" | "moderate" | "severe">
            label="How severe are your hot flashes, when you get them?"
            options={[
              { value: "none", label: "I don’t get them" },
              { value: "mild", label: "Mild" },
              { value: "moderate", label: "Moderate" },
              { value: "severe", label: "Severe" },
            ]}
            value={answers.hot_flash_severity}
            onChange={(v) => set({ hot_flash_severity: v })}
          />
          <TextField
            label="Roughly how often do hot flashes happen?"
            hint="For example: a few times a week, several a day…"
            value={answers.hot_flash_frequency}
            onChange={(v) => set({ hot_flash_frequency: v })}
          />
          <TextField
            label="How often do night sweats wake you?"
            value={answers.night_sweat_frequency}
            onChange={(v) => set({ night_sweat_frequency: v })}
          />
          <ChoiceGroup<"none" | "some" | "significant">
            label="How much do these disrupt your sleep?"
            options={[
              { value: "none", label: "Not at all" },
              { value: "some", label: "Somewhat" },
              { value: "significant", label: "Significantly" },
            ]}
            value={answers.vms_sleep_disruption}
            onChange={(v) => set({ vms_sleep_disruption: v })}
          />
          <TextField
            label="Roughly how long have you had these? (optional)"
            value={answers.vms_duration}
            onChange={(v) => set({ vms_duration: v })}
          />
        </div>
      );

    case "genitourinary":
      return (
        <div className="space-y-5">
          <p className="text-plum-700">
            These are common around menopause and are often very treatable.
            They’re worth describing honestly — your clinician will have heard it
            all before.
          </p>
          <ChoiceGroup<"none" | "occasional" | "often" | "always">
            label="Vaginal dryness, burning, or irritation"
            options={choices(FREQ4)}
            value={answers.vaginal_dryness}
            onChange={(v) => set({ vaginal_dryness: v })}
          />
          <ChoiceGroup<"none" | "occasional" | "often" | "always">
            label="Pain or discomfort with sexual activity"
            options={choices(FREQ4)}
            value={answers.dyspareunia}
            onChange={(v) => set({ dyspareunia: v })}
          />
          <ChoiceGroup<"none" | "occasional" | "often" | "always">
            label="Needing to urinate often or urgently"
            options={choices(FREQ4)}
            value={answers.urinary_frequency}
            onChange={(v) => set({ urinary_frequency: v })}
          />
          <TextField
            label="Urinary tract infections in the past year"
            type="number"
            value={answers.recurrent_uti}
            onChange={(v) => set({ recurrent_uti: num(v) })}
          />
          <ChoiceGroup<YesNoSometimes>
            label="Have you held back from raising these with a clinician before?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "sometimes", label: "Sometimes" },
              { value: "no", label: "No" },
            ]}
            value={answers.gsm_disclosure_barrier}
            onChange={(v) => set({ gsm_disclosure_barrier: v })}
          />
        </div>
      );

    case "mood_self":
      return (
        <div className="space-y-5">
          <CheckboxGroup
            label="Have you noticed any of these? (select any that apply)"
            options={MOOD_CHANGES}
            value={answers.mood_changes}
            onChange={(v) => set({ mood_changes: v })}
          />
          <TextArea
            label="Anything you’d add about your mood? (optional)"
            rows={3}
            value={answers.mood_changes_freetext}
            onChange={(v) => set({ mood_changes_freetext: v })}
          />
          <ChoiceGroup<"none" | "occasional" | "frequent" | "significant">
            label="How would you describe issues with focus, memory, or “brain fog”?"
            options={[
              { value: "none", label: "Not an issue" },
              { value: "occasional", label: "Occasional" },
              { value: "frequent", label: "Frequent" },
              { value: "significant", label: "Significant — it’s affecting me" },
            ]}
            value={answers.cognitive_complaints}
            onChange={(v) => set({ cognitive_complaints: v })}
          />
        </div>
      );

    case "history":
      return (
        <div className="space-y-5">
          <p className="text-plum-700">
            This helps your clinician weigh which options are right for you. None
            of these rule out getting help — they shape the conversation.
          </p>
          <BoolChoice
            label="Have you ever had breast cancer?"
            value={answers.breast_cancer_personal}
            onChange={(v) => set({ breast_cancer_personal: v })}
          />
          <BoolChoice
            label="Have you ever had cancer of the uterus or ovaries?"
            value={answers.gyn_cancer_personal}
            onChange={(v) => set({ gyn_cancer_personal: v })}
          />
          <BoolChoice
            label="Have you ever had a blood clot in the leg or lung (DVT or PE)?"
            value={answers.vte_personal}
            onChange={(v) => set({ vte_personal: v })}
          />
          <BoolChoice
            label="Have you ever had a stroke, heart attack, or heart disease?"
            value={answers.cv_personal}
            onChange={(v) => set({ cv_personal: v })}
          />
          <BoolChoice
            label="Any unexplained or unusual vaginal bleeding?"
            hint="For example: bleeding after menopause, very heavy bleeding, or bleeding after sex."
            value={answers.unexplained_bleeding}
            onChange={(v) => set({ unexplained_bleeding: v })}
          />
          <BoolChoice
            label="Do you have liver disease?"
            value={answers.liver_disease}
            onChange={(v) => set({ liver_disease: v })}
          />
          <ChoiceGroup<"none" | "without_aura" | "with_aura" | "unsure">
            label="Do you get migraines?"
            options={choices(MIGRAINE)}
            value={answers.migraine_status}
            onChange={(v) => set({ migraine_status: v })}
          />
          <BoolChoice
            label="Do you have high blood pressure?"
            value={answers.htn}
            onChange={(v) => set({ htn: v })}
          />
          <BoolChoice
            label="Do you have diabetes?"
            value={answers.dm}
            onChange={(v) => set({ dm: v })}
          />
          <TextField
            label="Family history of breast cancer (optional)"
            value={answers.fhx_breast_cancer}
            onChange={(v) => set({ fhx_breast_cancer: v })}
          />
          <TextField
            label="Family history of blood clots (optional)"
            value={answers.fhx_vte}
            onChange={(v) => set({ fhx_vte: v })}
          />
        </div>
      );

    case "meds":
      return (
        <div className="space-y-5">
          <TextArea
            label="What medications do you take? (optional)"
            hint="Prescription and over-the-counter."
            value={answers.meds_freetext}
            onChange={(v) => set({ meds_freetext: v })}
          />
          <TextField
            label="Are you currently using any hormones or birth control? (optional)"
            value={answers.current_hormones}
            onChange={(v) => set({ current_hormones: v })}
          />
          <TextField
            label="Any menopause supplements or herbal products? (optional)"
            value={answers.menopause_supplements}
            onChange={(v) => set({ menopause_supplements: v })}
          />
        </div>
      );

    case "reproductive":
      return (
        <div className="space-y-5">
          <BoolChoice
            label="Is it still possible for you to become pregnant?"
            value={answers.pregnancy_possible}
            onChange={(v) => set({ pregnancy_possible: v })}
          />
          <TextField
            label="What are you using for contraception, if anything? (optional)"
            value={answers.current_contraception}
            onChange={(v) => set({ current_contraception: v })}
          />
          <BoolChoice
            label="Are you sexually active in a way that could lead to pregnancy?"
            value={answers.sexual_activity_pregnancy_risk}
            onChange={(v) => set({ sexual_activity_pregnancy_risk: v })}
          />
          <BoolChoice
            label="Have you missed a period recently when you didn’t expect to?"
            value={answers.missed_period_recent}
            onChange={(v) => set({ missed_period_recent: v })}
          />
        </div>
      );

    case "lifestyle":
      return (
        <div className="space-y-5">
          <ChoiceGroup<"never" | "former" | "current">
            label="Do you smoke?"
            options={choices(SMOKING)}
            value={answers.smoking_status}
            onChange={(v) => set({ smoking_status: v })}
          />
          <BoolChoice
            label="Do you drink alcohol regularly?"
            value={answers.alcohol_regular}
            onChange={(v) => set({ alcohol_regular: v })}
          />
          <TextField
            label="How active are you in a typical week? (optional)"
            value={answers.physical_activity}
            onChange={(v) => set({ physical_activity: v })}
          />
          <TextField
            label="Any weight-bearing exercise (walking, weights, etc.)? (optional)"
            value={answers.weight_bearing_exercise}
            onChange={(v) => set({ weight_bearing_exercise: v })}
          />
          <TextField
            label="Roughly how much caffeine do you have? (optional)"
            value={answers.caffeine_intake}
            onChange={(v) => set({ caffeine_intake: v })}
          />
        </div>
      );

    case "bone":
      return (
        <div className="space-y-5">
          <BoolChoice
            label="Has a parent broken a hip?"
            value={answers.family_hip_fracture}
            onChange={(v) => set({ family_hip_fracture: v })}
          />
          <BoolChoice
            label="Have you been told you have low bone density (osteopenia or osteoporosis)?"
            value={answers.known_osteopenia}
            onChange={(v) => set({ known_osteopenia: v })}
          />
          {shouldOfferFRAX(answers) && (
            <div className="card bg-plum-50">
              <p className="text-sm text-plum-700">
                Based on your answers, a quick bone-health risk estimate (FRAX) is
                worth doing. You can complete the free Canadian tool and paste the
                10-year risk below if you like — or leave it for your clinician.
              </p>
              <a
                className="mt-2 inline-block text-sm font-medium text-plum-700 underline"
                href="https://www.sheffield.ac.uk/FRAX/tool.aspx?country=19"
                target="_blank"
                rel="noreferrer"
              >
                Open the Canadian FRAX tool
              </a>
              <div className="mt-3">
                <TextField
                  label="FRAX 10-year risk result (optional)"
                  value={answers.frax_result}
                  onChange={(v) => set({ frax_result: v })}
                />
              </div>
            </div>
          )}
        </div>
      );

    case "goals":
      return (
        <div className="space-y-5">
          <CheckboxGroup
            label="What would you most like help with? (select any)"
            options={GOALS}
            value={answers.goals_select}
            onChange={(v) => set({ goals_select: v })}
          />
          <TextArea
            label="In your own words, what are you hoping for? (optional)"
            rows={3}
            value={answers.goals_freetext}
            onChange={(v) => set({ goals_freetext: v })}
          />
          <ChoiceGroup<"yes" | "not_sure" | "prefer_not" | "unsure_what_involves">
            label="How do you feel about hormone therapy, if it were offered?"
            options={choices(MHT_OPENNESS)}
            value={answers.mht_openness}
            onChange={(v) => set({ mht_openness: v })}
          />
          <CheckboxGroup
            label="Have you already tried any of these? (select any)"
            options={NON_HORMONAL}
            value={answers.non_hormonal_tried}
            onChange={(v) => set({ non_hormonal_tried: v })}
          />
        </div>
      );

    default:
      return null;
  }
}

/** Whether a step's required fields are filled enough to advance. */
export function intakeComplete(stepKey: IntakeKey, answers: IntakeAnswers): boolean {
  switch (stepKey) {
    case "intro":
      return (
        answers.age != null &&
        !!answers.consent_ack_1 &&
        !!answers.consent_ack_2 &&
        !!answers.consent_ack_3
      );
    case "menstrual":
      return !!answers.menstruating_status;
    default:
      return true;
  }
}
