import { AssessmentResult } from "@/lib/assessment";
import { IntakeAnswers } from "@/lib/types";
import {
  DURATION,
  FREQ4,
  IMPACT,
  MENSTRUATING_STATUS,
  MHT_OPENNESS,
  MIGRAINE,
  OOPHORECTOMY,
  SMOKING,
  lookup,
  yn,
} from "@/lib/labels";
import { shouldOfferFRAX } from "@/lib/flags";
import { Row, Section, SEVERITY_LABEL, sortFlags } from "./shared";

export function ClinicianPacket({
  answers,
  result,
  appVersion,
  generatedAt,
}: {
  answers: IntakeAnswers;
  result: AssessmentResult;
  appVersion: string;
  generatedAt: string;
}) {
  const { stage, scores, flags, gsmPresent, mhtProfile, vmsPresent } = result;
  const sorted = sortFlags(flags);

  return (
    <article className="print-page mx-auto max-w-prose rounded-2xl border border-plum-200 bg-white p-7 text-plum-900 shadow-sm">
      <header className="border-b border-plum-300 pb-3">
        <h2 className="text-xl font-semibold">
          Perimenopause / Menopause — Clinician Packet
        </h2>
        <div className="mt-1 text-sm text-plum-600">
          Generated {new Date(generatedAt).toLocaleString("en-CA")} · App v
          {appVersion}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4">
          <Row label="Age" value={answers.age} />
          <Row label="Postal FSA" value={answers.postal_fsa?.toUpperCase()} />
          <Row
            label="Working stage (STRAW+10)"
            value={`${stage.label} (confidence: ${stage.confidence})`}
          />
          <Row
            label="MHT openness"
            value={lookup(MHT_OPENNESS, answers.mht_openness)}
          />
          {answers.gender_identity && (
            <Row label="Gender identity (self-described)" value={answers.gender_identity} />
          )}
        </div>
        <p className="mt-2 text-xs text-plum-500">
          Stage rationale: {stage.rationale}
        </p>
      </header>

      {/* Goals */}
      <Section title="Patient goals (verbatim)">
        {answers.goals_select && answers.goals_select.length > 0 && (
          <p className="text-sm">
            <span className="font-medium">Selected:</span>{" "}
            {answers.goals_select.join(", ")}
          </p>
        )}
        {answers.goals_freetext ? (
          <blockquote className="mt-1 border-l-2 border-plum-300 pl-3 text-sm italic">
            “{answers.goals_freetext}”
          </blockquote>
        ) : (
          <p className="text-sm text-plum-500">No free-text goal provided.</p>
        )}
      </Section>

      {/* Critical flags */}
      {sorted.length > 0 && (
        <Section title="Flags">
          <ul className="space-y-2">
            {sorted.map((f) => (
              <li
                key={f.code}
                className="rounded-lg border border-clay-300 bg-clay-50 p-3 text-sm"
              >
                <span className="font-semibold text-clay-800">
                  [{SEVERITY_LABEL[f.severity]}]
                </span>{" "}
                {f.clinicianNote}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Menstrual & reproductive snapshot */}
      <Section title="Menstrual & reproductive snapshot">
        <Row label="Menstrual status" value={lookup(MENSTRUATING_STATUS, answers.menstruating_status)} />
        <Row label="Cycle length (current)" value={answers.cycle_length_current} />
        <Row label="Change in pattern" value={answers.cycle_change} />
        <Row label="Irregularity pattern" value={answers.irregularity_pattern} />
        <Row label="Last menstrual period" value={answers.lmp_date} />
        <Row label="Hysterectomy year" value={answers.hysterectomy_year} />
        <Row label="Oophorectomy status" value={lookup(OOPHORECTOMY, answers.oophorectomy_status)} />
        <Row label="Age at menarche" value={answers.menarche_age} />
        <Row label="Family age at menopause" value={answers.family_menopause_age} />
        <Row label="Contraception" value={answers.current_contraception} />
        <Row label="Pregnancy possible" value={yn(answers.pregnancy_possible)} />
        <Row label="Sexually active, pregnancy risk" value={yn(answers.sexual_activity_pregnancy_risk)} />
      </Section>

      {/* MRS */}
      <Section title="Symptom severity — Menopause Rating Scale (MRS)">
        {scores.MRS ? (
          <>
            <p className="text-sm">
              <span className="font-medium">Total:</span> {scores.MRS.total}/44 ({scores.MRS.band})
            </p>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {scores.MRS.domains?.map((d) => (
                  <tr key={d.key} className="border-b border-plum-100">
                    <td className="py-1 pr-2 font-medium text-plum-700">{d.label}</td>
                    <td className="py-1 pr-2">{d.score}</td>
                    <td className="py-1 text-plum-600">{d.band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Row label="Most bothersome symptom" value={answers.top_symptom} />
            <div className="mt-2">
              <p className="text-sm font-medium text-plum-700">Functional impact</p>
              <Row label="Work" value={lookup(IMPACT, answers.impact_work)} />
              <Row label="Relationships" value={lookup(IMPACT, answers.impact_relationships)} />
              <Row label="Sleep" value={lookup(IMPACT, answers.impact_sleep)} />
              {answers.impact_freetext && (
                <blockquote className="mt-1 border-l-2 border-plum-300 pl-3 text-sm italic">
                  “{answers.impact_freetext}”
                </blockquote>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-plum-500">MRS not completed.</p>
        )}
      </Section>

      {/* Vasomotor */}
      <Section title="Vasomotor symptom detail">
        <Row label="Hot flash frequency" value={answers.hot_flash_frequency} />
        <Row label="Hot flash severity" value={answers.hot_flash_severity} />
        <Row label="Night sweat frequency" value={answers.night_sweat_frequency} />
        <Row label="VMS sleep disruption" value={answers.vms_sleep_disruption} />
        <Row label="Duration since onset" value={answers.vms_duration} />
      </Section>

      {/* Genitourinary */}
      <Section title="Genitourinary symptom detail (GSM)">
        <Row label="Vaginal dryness" value={lookup(FREQ4, answers.vaginal_dryness)} />
        <Row label="Pain with sexual activity" value={lookup(FREQ4, answers.dyspareunia)} />
        <Row label="Urinary frequency/urgency" value={lookup(FREQ4, answers.urinary_frequency)} />
        <Row label="Recurrent UTIs (past year)" value={answers.recurrent_uti} />
        {answers.gsm_disclosure_barrier && answers.gsm_disclosure_barrier !== "no" && (
          <p className="mt-1 rounded bg-clay-50 p-2 text-sm text-clay-800">
            Patient indicated she has been hesitant to raise these symptoms
            ({answers.gsm_disclosure_barrier}). Consider opening the door
            explicitly — local vaginal estrogen is highly effective and often
            appropriate even when systemic MHT is not.
          </p>
        )}
      </Section>

      {/* Mood / sleep / cognition */}
      <Section title="Mood / sleep / cognition">
        {scores.PHQ9 && (
          <Row
            label="PHQ-9"
            value={`${scores.PHQ9.total}/27 (${scores.PHQ9.band})${
              scores.PHQ9.extra?.item9Positive ? " — ITEM 9 POSITIVE" : ""
            }`}
          />
        )}
        {scores.GAD7 && <Row label="GAD-7" value={`${scores.GAD7.total}/21 (${scores.GAD7.band})`} />}
        {scores.ISI && <Row label="ISI" value={`${scores.ISI.total}/28 (${scores.ISI.band})`} />}
        <Row label="Cognitive complaints" value={answers.cognitive_complaints} />
        {answers.mood_changes && answers.mood_changes.length > 0 && (
          <Row label="Mood changes" value={answers.mood_changes.join(", ")} />
        )}
        {answers.mood_changes_freetext && (
          <blockquote className="mt-1 border-l-2 border-plum-300 pl-3 text-sm italic">
            “{answers.mood_changes_freetext}”
          </blockquote>
        )}
      </Section>

      {/* Medical history + MHT profile */}
      <Section title="Medical history relevant to MHT decision">
        <div className="grid grid-cols-2 gap-x-4">
          <Row label="Breast cancer (personal)" value={yn(answers.breast_cancer_personal)} />
          <Row label="Endometrial/ovarian cancer" value={yn(answers.gyn_cancer_personal)} />
          <Row label="VTE (DVT/PE)" value={yn(answers.vte_personal)} />
          <Row label="Stroke / MI / CAD" value={yn(answers.cv_personal)} />
          <Row label="Unexplained bleeding" value={yn(answers.unexplained_bleeding)} />
          <Row label="Liver disease" value={yn(answers.liver_disease)} />
          <Row label="Migraine" value={lookup(MIGRAINE, answers.migraine_status)} />
          <Row label="Hypertension" value={yn(answers.htn)} />
          <Row label="Diabetes" value={yn(answers.dm)} />
          <Row label="FHx breast cancer" value={answers.fhx_breast_cancer} />
          <Row label="FHx VTE" value={answers.fhx_vte} />
        </div>
        <p className="mt-3 rounded-lg border border-plum-200 bg-plum-50 p-3 text-sm">
          <span className="font-semibold">
            Systemic MHT profile (decision-support, not a verdict):
          </span>{" "}
          {mhtProfile.level === "clear" && "No contraindications captured."}
          {mhtProfile.level === "caution" && "Cautions present — weigh route/timing."}
          {mhtProfile.level === "contraindicated" && "Contraindication(s) to systemic MHT present."}
          {mhtProfile.reasons.length > 0 && (
            <> Reasons: {mhtProfile.reasons.join("; ")}.</>
          )}
          {gsmPresent && (
            <>
              {" "}
              GSM symptoms present — <strong>local vaginal estrogen is often
              appropriate even when systemic MHT is not.</strong>
            </>
          )}
        </p>
      </Section>

      {/* Bone health */}
      <Section title="Bone health">
        <Row
          label="FRAX"
          value={
            answers.frax_result
              ? answers.frax_result
              : shouldOfferFRAX(answers)
              ? "Indicated — complete via Canadian FRAX (link-out); result not yet captured"
              : "Not indicated by current screen"
          }
        />
        <Row label="Family hip fracture" value={yn(answers.family_hip_fracture)} />
        <Row label="Known osteopenia" value={yn(answers.known_osteopenia)} />
        <Row label="Weight-bearing exercise" value={answers.weight_bearing_exercise} />
      </Section>

      {/* Lifestyle & treatments */}
      <Section title="Lifestyle & current treatments">
        <Row label="Smoking" value={lookup(SMOKING, answers.smoking_status)} />
        <Row
          label="Alcohol (AUDIT-C)"
          value={
            scores.AUDIT_C
              ? `${scores.AUDIT_C.total}/12 (${scores.AUDIT_C.band})`
              : answers.alcohol_regular
              ? "Regular use — AUDIT-C not completed"
              : "No regular use reported"
          }
        />
        <Row label="Physical activity" value={answers.physical_activity} />
        <Row label="Caffeine" value={answers.caffeine_intake} />
        <Row label="Current hormones" value={answers.current_hormones} />
        <Row label="Menopause supplements" value={answers.menopause_supplements} />
        <Row label="Other meds" value={answers.meds_freetext} />
        {answers.non_hormonal_tried && answers.non_hormonal_tried.length > 0 && (
          <Row label="Non-hormonal approaches tried" value={answers.non_hormonal_tried.join(", ")} />
        )}
      </Section>

      {/* Suggested next steps */}
      <Section title="Suggested next steps (decision-support, not directive)">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {nextSteps(answers, result).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-plum-500">
          Reference: SOGC managing-menopause guidelines; patient resource
          menopauseandu.ca.
        </p>
      </Section>

      {/* Attribution + disclaimer */}
      <Section title="Attribution">
        <p className="text-xs text-plum-500">
          MRS — Heinemann, Potthoff, Schneider (Berlin Center for Epidemiology
          and Health Research). PHQ-9 / GAD-7 © Pfizer Inc. ISI — Charles M.
          Morin. AUDIT-C — World Health Organization. FRAX® — University of
          Sheffield. Brief v0.1 (2026-05-27). App v{appVersion}.
        </p>
      </Section>

      <p className="mt-4 rounded-lg bg-plum-50 p-3 text-xs text-plum-600">
        This is a structured symptom assessment and history packet. It is not a
        prescription, not an eligibility decision, and not a substitute for
        clinical evaluation. The choice of approach belongs to the clinician
        after a focused conversation with the patient.
      </p>
    </article>
  );
}

function nextSteps(a: IntakeAnswers, r: AssessmentResult): string[] {
  const steps: string[] = [];
  steps.push(
    "Consider TSH to rule out thyroid mimics. FSH is NOT routinely needed to diagnose menopause — a single FSH in perimenopause is often misleading."
  );
  if (a.pregnancy_possible && a.sexual_activity_pregnancy_risk) {
    steps.push("Pregnancy test before attributing symptoms to menopause.");
  }

  const mrs = r.scores.MRS;
  const moderateSevere = mrs ? mrs.total >= 9 : false;
  if (
    moderateSevere &&
    r.mhtProfile.level !== "contraindicated" &&
    r.stage.withinMhtWindow !== false
  ) {
    steps.push(
      "Moderate–severe symptoms, no systemic MHT contraindication, within the under-60 / <10-years-post-menopause window: MHT discussion is on the table (current Canadian guidance)."
    );
  }
  if (r.gsmPresent) {
    steps.push(
      "GSM symptoms present: discuss local vaginal estrogen — different risk profile from systemic MHT, often appropriate even with systemic contraindications."
    );
  }
  if (
    r.vmsPresent &&
    (r.mhtProfile.level === "contraindicated" || a.mht_openness === "prefer_not")
  ) {
    steps.push(
      "Vasomotor symptoms with MHT contraindication or preference against: consider non-hormonal pharmacotherapy (SSRI/SNRI, gabapentin, clonidine, or fezolinetant)."
    );
  }
  if (shouldOfferFRAX(a)) {
    steps.push("Bone-health planning: complete FRAX (± BMD) and address modifiable risk factors.");
  }
  const isiModerate = r.scores.ISI ? r.scores.ISI.total >= 15 : false;
  if (isiModerate || a.impact_sleep === "significant" || a.impact_sleep === "severe") {
    steps.push("Sleep is prominently affected: targeted sleep management approach.");
  }
  const moodProminent =
    (r.scores.PHQ9 ? r.scores.PHQ9.total >= 10 : false) ||
    (r.scores.GAD7 ? r.scores.GAD7.total >= 10 : false);
  if (moodProminent) {
    steps.push("Mood/anxiety prominent: address perimenopausal mood as its own entity (integrated approach).");
  }
  return steps;
}
