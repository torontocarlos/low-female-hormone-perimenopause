import { describe, expect, it } from "vitest";
import { scoreMRS } from "./mrs";

const ITEMS = [
  "mrs_hot_flushes",
  "mrs_heart",
  "mrs_sleep",
  "mrs_joint",
  "mrs_depressive",
  "mrs_irritability",
  "mrs_anxiety",
  "mrs_exhaustion",
  "mrs_sexual",
  "mrs_bladder",
  "mrs_dryness",
];

function build(values: number[]): Record<string, number> {
  const r: Record<string, number> = {};
  ITEMS.forEach((id, i) => (r[id] = values[i]));
  return r;
}

describe("MRS scoring", () => {
  it("scores all-zero as none/little", () => {
    const s = scoreMRS(build([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    expect(s.total).toBe(0);
    expect(s.band).toBe("none/little");
    for (const d of s.domains!) {
      expect(d.score).toBe(0);
      expect(d.band).toBe("none/little");
    }
  });

  it("scores all-fours as max severe", () => {
    const s = scoreMRS(build([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]));
    expect(s.total).toBe(44);
    expect(s.band).toBe("severe");
    const somato = s.domains!.find((d) => d.key === "somato")!;
    const psych = s.domains!.find((d) => d.key === "psych")!;
    const uro = s.domains!.find((d) => d.key === "uro")!;
    expect(somato.score).toBe(16);
    expect(psych.score).toBe(16);
    expect(uro.score).toBe(12);
    expect(somato.band).toBe("severe");
    expect(psych.band).toBe("severe");
    expect(uro.band).toBe("severe");
  });

  it("computes domain subscores and total from a mixed reference", () => {
    // somato: 2+1+3+0 = 6 (moderate)
    // psych:  2+2+1+2 = 7 (severe)
    // uro:    1+0+2   = 3 (moderate)
    // total = 16 (severe)
    const s = scoreMRS(build([2, 1, 3, 0, 2, 2, 1, 2, 1, 0, 2]));
    expect(s.total).toBe(16);
    expect(s.band).toBe("severe");
    const somato = s.domains!.find((d) => d.key === "somato")!;
    const psych = s.domains!.find((d) => d.key === "psych")!;
    const uro = s.domains!.find((d) => d.key === "uro")!;
    expect(somato.score).toBe(6);
    expect(somato.band).toBe("moderate");
    expect(psych.score).toBe(7);
    expect(psych.band).toBe("severe");
    expect(uro.score).toBe(3);
    expect(uro.band).toBe("moderate");
  });

  it("applies total-score band boundaries", () => {
    expect(scoreMRS(build([4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).band).toBe(
      "none/little"
    ); // 4
    expect(scoreMRS(build([4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])).band).toBe(
      "mild"
    ); // 5
    expect(scoreMRS(build([4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0])).band).toBe(
      "moderate"
    ); // 9
    expect(scoreMRS(build([4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0])).band).toBe(
      "severe"
    ); // 16
  });
});
