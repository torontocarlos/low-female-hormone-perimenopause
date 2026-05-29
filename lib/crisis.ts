// Crisis resources surfaced by the CrisisInterrupt. National Canadian numbers
// are always shown; regional lookup by FSA is a PARKING-LOT item (§15 —
// "confirm regional crisis resource lookup by FSA").

export interface CrisisResource {
  name: string;
  detail: string;
  href?: string;
}

export const NATIONAL_CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "9-8-8 Suicide Crisis Helpline",
    detail: "Call or text 9-8-8, any time, anywhere in Canada.",
    href: "tel:988",
  },
  {
    name: "Emergency",
    detail: "If you are in immediate danger, call 9-1-1 or go to your nearest emergency department.",
    href: "tel:911",
  },
  {
    name: "Talk Suicide Canada",
    detail: "1-833-456-4566 (24/7).",
    href: "tel:18334564566",
  },
];

/**
 * Regional crisis resources by postal FSA.
 * PARKING LOT: this is a stub. Ajax/Durham FSAs (L1S, L1T, L1Z, etc.) should
 * map to Durham regional crisis lines once Carlos confirms the directory.
 */
export function regionalCrisisResources(_fsa?: string): CrisisResource[] {
  return [];
}
