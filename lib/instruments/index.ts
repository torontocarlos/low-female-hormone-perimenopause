export * from "./types";
export { MRS, scoreMRS, mrsTotalBand } from "./mrs";
export { PHQ9, scorePHQ9, phq9Band } from "./phq9";
export { GAD7, scoreGAD7, gad7Band } from "./gad7";
export { ISI, scoreISI, isiBand } from "./isi";
export { AUDIT_C, scoreAUDITC, auditcBand } from "./auditc";

import { InstrumentDef } from "./types";
import { MRS } from "./mrs";
import { PHQ9 } from "./phq9";
import { GAD7 } from "./gad7";
import { ISI } from "./isi";
import { AUDIT_C } from "./auditc";

export const INSTRUMENTS: Record<string, InstrumentDef> = {
  MRS,
  PHQ9,
  GAD7,
  ISI,
  AUDIT_C,
};
