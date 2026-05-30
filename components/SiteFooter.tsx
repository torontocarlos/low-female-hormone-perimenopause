import Link from "next/link";

// Canonical persistent footer (§6 of the AHC clinical-tools style guide):
// disclaimer + crisis line + clinic identification + build SHA. No marketing
// chrome. The build SHA comes from Vercel at build time and is omitted locally.
const BUILD_SHA = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-plum-200 bg-white">
      <div className="mx-auto max-w-prose space-y-3 px-5 py-8 text-sm text-plum-600">
        <p>
          These tools do not provide a diagnosis and are not a substitute for
          medical advice.
        </p>
        <p>
          If you’re in crisis, call or text{" "}
          <a href="tel:988" className="font-semibold text-plum-700 underline">
            9-8-8
          </a>{" "}
          any time, or call{" "}
          <a href="tel:911" className="font-semibold text-plum-700 underline">
            911
          </a>{" "}
          in an emergency.
        </p>
        <p>
          <a
            href="https://ajaxharwoodclinic.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-plum-700 hover:text-plum-900"
          >
            Ajax Harwood Clinic
          </a>
          <span className="text-plum-400">
            {" · "}88 Harwood Ave S, Ajax, ON · 905-683-0690
          </span>
        </p>
        {BUILD_SHA && (
          <p className="text-xs text-plum-400">Build {BUILD_SHA}</p>
        )}
      </div>
    </footer>
  );
}
