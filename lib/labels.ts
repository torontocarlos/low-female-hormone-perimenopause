// Human-readable labels for enum-ish intake values, shared by both outputs.

export const MENSTRUATING_STATUS: Record<string, string> = {
  yes_regular: "Having periods — regular",
  yes_irregular: "Having periods — irregular",
  no_lt12: "No periods for less than 12 months",
  no_12plus: "No periods for 12+ months",
  hysterectomy: "Hysterectomy",
  no_other: "No periods (other reason)",
};

export const MHT_OPENNESS: Record<string, string> = {
  yes: "Open to hormone therapy if appropriate",
  not_sure: "Not sure about hormone therapy",
  prefer_not: "Prefers not to use hormone therapy",
  unsure_what_involves: "Unsure what hormone therapy involves",
};

export const MIGRAINE: Record<string, string> = {
  none: "No migraine",
  without_aura: "Migraine without aura",
  with_aura: "Migraine with aura",
  unsure: "Migraine — aura status unsure",
};

export const SMOKING: Record<string, string> = {
  never: "Never smoker",
  former: "Former smoker",
  current: "Current smoker",
};

export const FREQ4: Record<string, string> = {
  none: "None",
  occasional: "Occasional",
  often: "Often",
  always: "Always",
};

export const IMPACT: Record<string, string> = {
  none: "None",
  some: "Some",
  significant: "Significant",
  severe: "Reduced hours / considered leaving",
};

export const OOPHORECTOMY: Record<string, string> = {
  retained: "Ovaries retained",
  removed: "Ovaries removed (bilateral oophorectomy)",
  unsure: "Ovary status unsure",
};

export const DURATION: Record<string, string> = {
  weeks: "A few weeks",
  months: "A few months",
  a_year_plus: "A year or more",
  always_wondered: "Always wondered",
};

export function yn(v?: boolean): string | undefined {
  if (v === undefined) return undefined;
  return v ? "Yes" : "No";
}

export function lookup(map: Record<string, string>, key?: string): string | undefined {
  if (!key) return undefined;
  return map[key] ?? key;
}
