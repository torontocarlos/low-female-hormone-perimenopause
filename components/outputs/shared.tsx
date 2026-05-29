import { Flag, FlagSeverity } from "@/lib/types";

export const SEVERITY_LABEL: Record<FlagSeverity, string> = {
  crisis: "Crisis",
  urgent: "Urgent",
  hard_contraindication: "Hard contraindication (systemic MHT)",
  significant: "Significant consideration",
  caution: "Caution",
  comorbidity: "Note",
};

export const SEVERITY_ORDER: FlagSeverity[] = [
  "crisis",
  "urgent",
  "hard_contraindication",
  "significant",
  "caution",
  "comorbidity",
];

export function sortFlags(flags: Flag[]): Flag[] {
  return [...flags].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="border-b border-plum-200 pb-1 text-sm font-semibold uppercase tracking-wide text-plum-600">
        {title}
      </h3>
      <div className="mt-3 text-plum-900">{children}</div>
    </section>
  );
}

export function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-wrap gap-x-2 py-0.5 text-sm">
      <span className="font-medium text-plum-700">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
