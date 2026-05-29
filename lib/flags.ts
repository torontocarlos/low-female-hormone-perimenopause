import { InstrumentResponses, IntakeAnswers, Flag } from "./types";
import { scoreMRS } from "./instruments/mrs";
import { scorePHQ9 } from "./instruments/phq9";

// ── Red-flag logic (§6) ───────────────────────────────────────────────────
// CRITICAL PRINCIPLE: none of the contraindication flags tell the woman she
// "cannot be treated." They tell the clinician what to weigh, and every patient
// note keeps an alternative path open.

export function computeFlags(
  a: IntakeAnswers,
  instruments: InstrumentResponses
): Flag[] {
  const flags: Flag[] = [];

  // PHQ-9 item 9 — crisis.
  if (instruments.PHQ9) {
    const phq = scorePHQ9(instruments.PHQ9);
    if ((phq.extra?.item9Positive as boolean) === true) {
      flags.push({
        code: "phq9_item9",
        severity: "crisis",
        clinicianNote:
          "PHQ-9 item 9 endorsed (thoughts of being better off dead or of self-harm). Crisis resources were shown to the patient. Assess safety.",
      });
    }
  }

  // Unexplained / concerning vaginal bleeding — urgent.
  if (a.unexplained_bleeding) {
    flags.push({
      code: "unexplained_bleeding",
      severity: "urgent",
      clinicianNote:
        "Reports unexplained or concerning vaginal bleeding (postmenopausal bleeding, or perimenopausal bleeding that is very heavy, between predicted cycles, or post-coital). Warrants timely evaluation.",
      patientNote:
        "Bleeding after menopause, or unusual bleeding patterns during perimenopause, needs to be checked — this is one of the few situations where you should book a visit rather than wait.",
    });
  }

  // Personal breast cancer — hard contraindication to systemic MHT.
  if (a.breast_cancer_personal) {
    flags.push({
      code: "breast_cancer_personal",
      severity: "hard_contraindication",
      clinicianNote:
        "Personal history of breast cancer — systemic MHT generally contraindicated. Consider non-hormonal options; local vaginal therapy only in consultation with oncology/gynaecology.",
      patientNote:
        "Systemic hormone therapy is generally not used for women with a history of breast cancer, but there are non-hormonal options, and for some women local vaginal therapy may still be discussed with their oncologist and gynecologist.",
    });
  }

  // Other gyn cancer.
  if (a.gyn_cancer_personal) {
    flags.push({
      code: "gyn_cancer_personal",
      severity: "significant",
      clinicianNote:
        "Personal history of endometrial or ovarian cancer — review hormone therapy suitability with the treating specialist.",
    });
  }

  // Personal VTE / stroke / MI — significant MHT consideration.
  if (a.vte_personal) {
    flags.push({
      code: "vte_personal",
      severity: "significant",
      clinicianNote:
        "Personal history of VTE (DVT/PE) — if MHT is considered, transdermal route is preferred and overall suitability must be weighed.",
      patientNote:
        "Because of your history of a blood clot, if hormone therapy is discussed your clinician will weigh the route (a patch or gel through the skin rather than a pill) and whether it is appropriate for you.",
    });
  }
  if (a.cv_personal) {
    flags.push({
      code: "cv_personal",
      severity: "significant",
      clinicianNote:
        "Personal history of stroke, MI, or coronary artery disease — significant consideration for systemic MHT; weigh route and timing.",
      patientNote:
        "Because of your heart/stroke history, your clinician will weigh whether hormone therapy is appropriate and, if so, which form.",
    });
  }

  // Migraine with aura.
  if (a.migraine_status === "with_aura") {
    flags.push({
      code: "migraine_aura",
      severity: "significant",
      clinicianNote:
        "Migraine with aura — transdermal route preferred if MHT is considered.",
      patientNote:
        "Because of migraine with aura, if hormone therapy is discussed your clinician will likely favour a patch or gel over a pill.",
    });
  }

  // Smoking + age ≥ 35.
  if (a.smoking_status === "current" && (a.age ?? 0) >= 35) {
    flags.push({
      code: "smoking_age35",
      severity: "significant",
      clinicianNote:
        "Current smoker, age ≥ 35 — cardiovascular consideration relevant to systemic MHT route and overall risk.",
      patientNote:
        "Smoking affects how some treatment options are weighed. Support to cut down or quit is part of the conversation, and there are options regardless.",
    });
  }

  // High symptom burden (MRS severe). Not a danger flag — a "take this seriously" flag.
  if (instruments.MRS) {
    const mrs = scoreMRS(instruments.MRS);
    if (mrs.total >= 16) {
      flags.push({
        code: "mrs_severe",
        severity: "comorbidity",
        clinicianNote: `MRS total ${mrs.total} (severe range) — high symptom burden; this patient warrants a substantive management conversation.`,
        patientNote:
          "What you described is in the severe range. This deserves a substantive conversation, not a brush-off.",
      });
    }
  }

  // Age < 40 with perimenopausal symptoms — POI workup.
  if ((a.age ?? 99) < 40 && hasPerimenopausalPicture(a, instruments)) {
    flags.push({
      code: "poi_workup",
      severity: "significant",
      clinicianNote:
        "Age < 40 with perimenopausal-type symptoms — consider primary ovarian insufficiency workup (FSH x2, estradiol, prolactin, TSH, karyotype/FMR1 as indicated) and gynaecology/endocrinology referral. Standard menopause framing does not apply at this age.",
      patientNote:
        "Because you are under 40, these symptoms deserve a specific workup rather than being assumed to be ordinary menopause. Your clinician may order some tests and may involve a specialist.",
    });
  }

  // Possible pregnancy.
  if (
    a.pregnancy_possible &&
    a.sexual_activity_pregnancy_risk &&
    a.missed_period_recent
  ) {
    flags.push({
      code: "pregnancy_possible",
      severity: "urgent",
      clinicianNote:
        "Pregnancy is possible (sexually active, contraception not reliable, recent missed period) — a pregnancy test is indicated before attributing symptoms to menopause.",
      patientNote:
        "Because pregnancy is still possible for you and you have missed a period, a pregnancy test is worth doing before assuming this is menopause.",
    });
  }

  return flags;
}

function hasPerimenopausalPicture(
  a: IntakeAnswers,
  instruments: InstrumentResponses
): boolean {
  const mrsSome = instruments.MRS
    ? scoreMRS(instruments.MRS).total >= 5
    : false;
  const irregular =
    a.menstruating_status === "yes_irregular" ||
    a.menstruating_status === "no_lt12" ||
    a.menstruating_status === "no_12plus";
  const vms =
    (a.hot_flash_severity && a.hot_flash_severity !== "none") ||
    !!a.night_sweat_frequency;
  return mrsSome || irregular || !!vms;
}

/** True if any FRAX trigger from §4 is met. */
export function shouldOfferFRAX(a: IntakeAnswers): boolean {
  if ((a.age ?? 0) >= 50) return true;
  if (a.known_osteopenia) return true;
  if (a.family_hip_fracture) return true;
  // Early menopause: surgical, or postmenopausal under ~45.
  if (a.menstruating_status === "hysterectomy" && a.oophorectomy_status === "removed")
    return true;
  if (a.menstruating_status === "no_12plus" && (a.age ?? 99) < 45) return true;
  return false;
}

/** True if AUDIT-C should be administered (§4). */
export function shouldOfferAUDITC(a: IntakeAnswers): boolean {
  return a.alcohol_regular === true;
}
