import Link from "next/link";

// Canonical clinic identifier bar (§1 of the AHC clinical-tools style guide).
// Every patient-facing page shows this so a patient arriving at a *.vercel.app
// URL has a trust signal that this is a real Canadian primary-care clinic.
// The dot is recolored to this pathway's warm plum palette per §2; the clinic
// name string is identical across every AHC app.
export function ClinicHeader() {
  return (
    <header className="no-print border-b border-plum-200 bg-white">
      <div className="mx-auto flex max-w-prose items-center gap-2 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-plum-600" aria-hidden="true" />
        <Link
          href="/"
          className="rounded text-sm font-semibold tracking-wide text-plum-700 hover:text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-400 focus:ring-offset-2"
        >
          Ajax Harwood Clinic
        </Link>
      </div>
    </header>
  );
}
