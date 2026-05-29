"use client";

// Standard call-to-action menu (§8). In the shared kit this is
// @ahc/pathway-kit/CTAMenu. The email + booking actions are wired to
// PARKING-LOT placeholders for v0.

export function CTAMenu({
  onEmail,
  onPrint,
  email,
  onEmailChange,
}: {
  onEmail: () => void;
  onPrint: () => void;
  email: string;
  onEmailChange: (v: string) => void;
}) {
  return (
    <div className="no-print mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-plum-900">What next?</h2>

      {/* Extra-warm email CTA per §8 tonal note. */}
      <div className="card border-clay-200 bg-clay-50">
        <h3 className="text-lg font-semibold text-clay-800">
          Email this to yourself
        </h3>
        <p className="mt-1 text-sm text-plum-700">
          Many women using this tool haven’t raised these things with a clinician
          yet. Having a clear summary to bring in can make that first
          conversation much easier — whether you see Dr. Yu or your own doctor.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            className="text-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <button onClick={onEmail} className="btn-primary whitespace-nowrap">
            Email my summary
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={onPrint} className="btn-secondary">
          Print or download (PDF)
        </button>
        <a href="https://www.menopauseandu.ca" target="_blank" rel="noreferrer" className="btn-secondary">
          Visit menopauseandu.ca
        </a>
      </div>

      <div className="card">
        <h3 className="font-semibold text-plum-900">Book a conversation</h3>
        <ul className="mt-2 space-y-2 text-sm text-plum-700">
          <li>
            <strong>Already an Ajax Harwood Clinic patient?</strong> Book with
            Dr. Yu through the clinic.{" "}
            <span className="text-plum-500">(Booking link — coming soon.)</span>
          </li>
          <li>
            <strong>Not an AHC patient?</strong> Bring the clinician version of
            this summary to your family doctor, or ask them for a referral.
          </li>
          <li>
            <strong>Not ready yet?</strong> Email yourself the summary above and
            come back to it when you are.
          </li>
        </ul>
      </div>
    </div>
  );
}
