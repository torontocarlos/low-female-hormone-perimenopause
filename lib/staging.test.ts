import { describe, expect, it } from "vitest";
import { computeStage } from "./staging";

const NOW = new Date("2026-05-28T00:00:00Z");

describe("STRAW+10 working stage (best-effort, pending reference scenarios)", () => {
  it("regular periods, no change -> late reproductive", () => {
    const s = computeStage({ menstruating_status: "yes_regular" }, NOW);
    expect(s.key).toBe("late_reproductive");
  });

  it("irregular cycles -> early transition", () => {
    const s = computeStage(
      { menstruating_status: "yes_irregular", irregularity_pattern: "varies by a week or so" },
      NOW
    );
    expect(s.key).toBe("early_transition");
  });

  it("irregular with skipped months -> late transition", () => {
    const s = computeStage(
      { menstruating_status: "yes_irregular", irregularity_pattern: "I skip whole months sometimes" },
      NOW
    );
    expect(s.key).toBe("late_transition");
  });

  it("no periods <12 months -> late transition", () => {
    const s = computeStage({ menstruating_status: "no_lt12" }, NOW);
    expect(s.key).toBe("late_transition");
  });

  it("no periods 12+ months, recent LMP -> early postmenopause", () => {
    const s = computeStage(
      { menstruating_status: "no_12plus", lmp_date: "2024-06", age: 53 },
      NOW
    );
    expect(s.key).toBe("early_postmenopause");
    expect(s.withinMhtWindow).toBe(true);
  });

  it("no periods 12+ months, distant LMP -> late postmenopause", () => {
    const s = computeStage(
      { menstruating_status: "no_12plus", lmp_date: "2016-01", age: 62 },
      NOW
    );
    expect(s.key).toBe("late_postmenopause");
    expect(s.withinMhtWindow).toBe(false);
  });

  it("hysterectomy with oophorectomy -> surgical menopause", () => {
    const s = computeStage(
      { menstruating_status: "hysterectomy", oophorectomy_status: "removed", age: 49 },
      NOW
    );
    expect(s.key).toBe("surgical_menopause");
    expect(s.withinMhtWindow).toBe(true);
  });

  it("hysterectomy with ovaries retained -> needs assessment", () => {
    const s = computeStage(
      { menstruating_status: "hysterectomy", oophorectomy_status: "retained" },
      NOW
    );
    expect(s.key).toBe("needs_assessment");
  });
});
