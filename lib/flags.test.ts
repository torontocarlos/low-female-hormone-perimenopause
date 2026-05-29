import { describe, expect, it } from "vitest";
import { computeFlags, shouldOfferFRAX, shouldOfferAUDITC } from "./flags";
import { IntakeAnswers, InstrumentResponses } from "./types";

const NO_EXCLUSION = /you (do not|don't) qualify|you cannot be treated|not eligible/i;

describe("flag engine", () => {
  it("fires crisis flag on PHQ-9 item 9", () => {
    const instruments: InstrumentResponses = {
      PHQ9: { phq9_9: 1 },
    };
    const flags = computeFlags({}, instruments);
    const crisis = flags.find((f) => f.code === "phq9_item9");
    expect(crisis).toBeTruthy();
    expect(crisis!.severity).toBe("crisis");
  });

  it("does not fire crisis flag when item 9 is 0", () => {
    const flags = computeFlags({}, { PHQ9: { phq9_9: 0 } });
    expect(flags.find((f) => f.code === "phq9_item9")).toBeFalsy();
  });

  it("fires urgent bleeding flag", () => {
    const flags = computeFlags({ unexplained_bleeding: true }, {});
    const f = flags.find((x) => x.code === "unexplained_bleeding");
    expect(f?.severity).toBe("urgent");
  });

  it("breast cancer is a hard contraindication but never excludes the patient", () => {
    const flags = computeFlags({ breast_cancer_personal: true }, {});
    const f = flags.find((x) => x.code === "breast_cancer_personal");
    expect(f?.severity).toBe("hard_contraindication");
    expect(f?.patientNote).toBeTruthy();
    expect(NO_EXCLUSION.test(f!.patientNote!)).toBe(false);
  });

  it("never uses exclusion language in any patient note", () => {
    const a: IntakeAnswers = {
      age: 52,
      breast_cancer_personal: true,
      vte_personal: true,
      cv_personal: true,
      migraine_status: "with_aura",
      smoking_status: "current",
      unexplained_bleeding: true,
    };
    const flags = computeFlags(a, { MRS: { mrs_hot_flushes: 4, mrs_sleep: 4, mrs_heart: 4, mrs_joint: 4 } });
    for (const f of flags) {
      if (f.patientNote) expect(NO_EXCLUSION.test(f.patientNote)).toBe(false);
    }
  });

  it("flags POI workup for under-40 with a perimenopausal picture", () => {
    const flags = computeFlags(
      { age: 36, menstruating_status: "yes_irregular" },
      {}
    );
    expect(flags.find((f) => f.code === "poi_workup")).toBeTruthy();
  });

  it("flags severe MRS burden", () => {
    const flags = computeFlags(
      {},
      { MRS: { mrs_hot_flushes: 4, mrs_sleep: 4, mrs_heart: 4, mrs_joint: 4 } }
    );
    expect(flags.find((f) => f.code === "mrs_severe")).toBeTruthy();
  });
});

describe("conditional instrument triggers", () => {
  it("offers FRAX at age >= 50", () => {
    expect(shouldOfferFRAX({ age: 50 })).toBe(true);
    expect(shouldOfferFRAX({ age: 44 })).toBe(false);
  });
  it("offers FRAX on family hip fracture", () => {
    expect(shouldOfferFRAX({ age: 42, family_hip_fracture: true })).toBe(true);
  });
  it("offers AUDIT-C only with regular alcohol use", () => {
    expect(shouldOfferAUDITC({ alcohol_regular: true })).toBe(true);
    expect(shouldOfferAUDITC({ alcohol_regular: false })).toBe(false);
  });
});
