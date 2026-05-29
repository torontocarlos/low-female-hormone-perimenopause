// Shared instrument shapes. In the eventual monorepo these move to
// @ahc/instruments (see PARKING_LOT.md — "extract shared kits").

export interface InstrumentOption {
  value: number;
  label: string;
}

export interface InstrumentItem {
  id: string;
  text: string;
  /** Optional helper / examples shown under the item text. */
  hint?: string;
  options: InstrumentOption[];
  /** Domain/subscale key, for instruments that report subscores (e.g. MRS). */
  domain?: string;
}

export interface InstrumentDef {
  code: string;
  name: string;
  version: string;
  attribution: string;
  /** One-line plain-language framing shown above the items. */
  intro: string;
  items: InstrumentItem[];
}

export interface DomainScore {
  key: string;
  label: string;
  score: number;
  band: string;
}

export interface InstrumentScore {
  code: string;
  name: string;
  version: string;
  total: number;
  maxTotal: number;
  band: string;
  /** Present only for instruments with subscales. */
  domains?: DomainScore[];
  itemScores: Record<string, number>;
  /** Instrument-specific extras (e.g. PHQ-9 item-9 flag). */
  extra?: Record<string, unknown>;
}

/** Standard 0–4 frequency-by-severity options used by the MRS. */
export const SEVERITY_0_4: InstrumentOption[] = [
  { value: 0, label: "None" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" },
  { value: 4, label: "Extremely severe" },
];

/** Standard PHQ-9 / GAD-7 "over the last 2 weeks" options. */
export const FREQ_0_3: InstrumentOption[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];
