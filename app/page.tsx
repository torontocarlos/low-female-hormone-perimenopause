import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-prose px-5 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-clay-600">
        Menopause &amp; perimenopause
      </p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight text-plum-900 sm:text-4xl">
        Am I in perimenopause?
      </h1>
      <p className="mt-4 text-lg text-plum-700">
        If you’ve been wondering whether what you’re feeling is the start of the
        menopause transition — the changes in your cycle, the sleep, the heat,
        the mood, the fog — this tool helps you describe it clearly and prepare
        for a conversation where you’re taken seriously.
      </p>

      <div className="card mt-8">
        <h2 className="text-lg font-semibold text-plum-900">
          What this is — and isn’t
        </h2>
        <ul className="mt-3 space-y-2 text-plum-700">
          <li>
            • It walks you through a validated symptom questionnaire and a few
            questions about your history.
          </li>
          <li>
            • It gives you a plain-language summary, and a one-page summary you
            can bring to your clinician.
          </li>
          <li>
            • It does <strong>not</strong> diagnose you, prescribe anything, or
            decide what treatment you can have. Your clinician does that, with
            you.
          </li>
        </ul>
        <p className="mt-4 text-sm text-plum-600">
          It takes about 15–20 minutes. You can stop and come back. Nothing about
          your hormones, sexuality, or bleeding is shared anywhere unless you
          choose to send the summary to a clinician.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/assessment" className="btn-primary">
          Begin
        </Link>
      </div>

      <p className="mt-10 text-xs text-plum-500">
        For women and anyone experiencing menopause-related symptoms, age 35+.
        This is a pilot tool. If you’re in crisis, call or text 9-8-8 any time,
        or call 911 in an emergency.
      </p>
    </main>
  );
}
