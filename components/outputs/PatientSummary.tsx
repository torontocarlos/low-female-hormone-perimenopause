import { AssessmentResult } from "@/lib/assessment";
import { IntakeAnswers } from "@/lib/types";
import { Section } from "./shared";

const BAND_PLAIN: Record<string, string> = {
  "none/little": "little to no",
  mild: "mild",
  moderate: "moderate",
  severe: "severe",
};

export function PatientSummary({
  answers,
  result,
}: {
  answers: IntakeAnswers;
  result: AssessmentResult;
}) {
  const { stage, scores, flags, gsmPresent } = result;
  const mrs = scores.MRS;
  const bleeding = flags.find((f) => f.code === "unexplained_bleeding");
  const gsmBarrier =
    gsmPresent &&
    answers.gsm_disclosure_barrier &&
    answers.gsm_disclosure_barrier !== "no";
  const moodProminent =
    (scores.PHQ9 ? scores.PHQ9.total >= 10 : false) ||
    (scores.GAD7 ? scores.GAD7.total >= 10 : false);
  const severe = mrs ? mrs.total >= 16 : false;

  return (
    <article className="print-page mx-auto max-w-prose rounded-2xl border border-plum-200 bg-white p-7 text-plum-900 shadow-sm">
      <h2 className="text-2xl font-semibold">Your summary</h2>
      <p className="mt-1 text-sm text-plum-600">
        Written for you. There’s a separate one-page version to bring to your
        clinician.
      </p>

      <Section title="Where you are on the transition">
        <p>
          Based on what you shared, you appear to be in the{" "}
          <strong>{stage.label}</strong>. This is a working description, not a
          diagnosis — your clinician will confirm with you in conversation.
        </p>
      </Section>

      {mrs && (
        <Section title="What you described">
          <p>
            You completed the Menopause Rating Scale, the most widely used
            symptom scale for the menopause transition. Your overall score was{" "}
            <strong>{mrs.total}</strong>, which falls in the{" "}
            <strong>{BAND_PLAIN[mrs.band] ?? mrs.band}</strong> range.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {mrs.domains?.map((d) => (
              <li key={d.key}>
                <span className="font-medium">{d.label} symptoms:</span>{" "}
                {BAND_PLAIN[d.band] ?? d.band}
              </li>
            ))}
          </ul>
          {answers.top_symptom && (
            <p className="mt-3">
              You mentioned that <strong>{answers.top_symptom}</strong> is
              bothering you most.
            </p>
          )}
        </Section>
      )}

      <Section title="Important things from what you shared">
        <ul className="space-y-3">
          {bleeding && (
            <li className="rounded-lg border border-clay-300 bg-clay-50 p-3">
              <strong>Please don’t wait on this:</strong> {bleeding.patientNote}
            </li>
          )}
          {gsmBarrier && (
            <li>
              Vaginal dryness, painful sex, and recurrent urinary infections are
              common around menopause and are often <em>very</em> treatable —
              frequently with a local treatment that’s different from hormone
              pills. Many women never bring these up. They’re worth raising, and
              your clinician will have heard it all before.
            </li>
          )}
          {moodProminent && (
            <li>
              Mood changes — low mood, irritability, anxiety — are real in
              perimenopause and are treatable. They are not something to just
              push through.
            </li>
          )}
          {severe && (
            <li>
              <strong>What you described is in the severe range.</strong> This
              deserves a substantive conversation, not a brush-off.
            </li>
          )}
          {!bleeding && !gsmBarrier && !moodProminent && !severe && (
            <li className="text-plum-600">
              Nothing here is urgent based on what you shared — but everything you
              described is worth a calm, thorough conversation.
            </li>
          )}
        </ul>
      </Section>

      <Section title="What the conversation might cover">
        <p className="text-sm text-plum-600">
          These are options your clinician may discuss with you. The right choice
          depends on your full picture.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Lifestyle approaches</strong> — sleep, activity, caffeine,
            alcohol. Helpful, though not always enough on their own.
          </li>
          <li>
            <strong>Non-hormonal medications</strong> for hot flashes and night
            sweats, for women who can’t or prefer not to use hormones.
          </li>
          <li>
            <strong>Menopausal hormone therapy (MHT)</strong> — for many women
            with bothersome symptoms, current Canadian guidance is that hormone
            therapy is the most effective option and can be started safely if
            you’re under 60 or within 10 years of menopause and don’t have
            specific contraindications. Whether it’s right for you is a
            conversation, not a foregone conclusion.
          </li>
          <li>
            <strong>Local vaginal estrogen</strong> for dryness, painful sex, and
            urinary symptoms — a different, lower-dose treatment that is often an
            option even when hormone pills aren’t.
          </li>
          <li>
            <strong>Bone-health planning</strong> as you move through menopause.
          </li>
          {moodProminent && (
            <li>
              <strong>Mental health support</strong> if mood or anxiety is part of
              the picture.
            </li>
          )}
        </ul>
      </Section>

      <Section title="What this is not">
        <p>
          This is not a diagnosis or a prescription. Your clinician will make the
          final call after talking with you.
        </p>
      </Section>

      <Section title="What to bring to your appointment">
        <ul className="list-disc space-y-1 pl-5">
          <li>The clinician version of this summary.</li>
          <li>
            A note about which symptom is bothering you most
            {answers.top_symptom ? ` (you said: ${answers.top_symptom})` : ""}.
          </li>
          <li>Any questions you want answered.</li>
        </ul>
      </Section>

      <Section title="A note on the “menopause blood test”">
        <p>
          For most women, perimenopause and menopause are diagnosed from your
          story and symptoms — not a blood test. Hormone levels swing so much
          during perimenopause that a single FSH or estradiol test is often
          misleading. Your clinician may decline to order one for good reasons —
          but they should still take your symptoms seriously and offer you
          options.
        </p>
      </Section>

      <Section title="Resources">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a className="text-plum-700 underline" href="https://www.menopauseandu.ca" target="_blank" rel="noreferrer">
              menopauseandu.ca
            </a>{" "}
            — Canadian patient resource from the SOGC.
          </li>
          <li>Canadian Menopause Society.</li>
          <li>
            If you ever feel in crisis: call or text <strong>9-8-8</strong>, any
            time.
          </li>
        </ul>
      </Section>
    </article>
  );
}
