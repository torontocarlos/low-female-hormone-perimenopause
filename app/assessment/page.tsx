"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CrisisInterrupt } from "@/components/CrisisInterrupt";
import { CTAMenu } from "@/components/CTAMenu";
import { InstrumentForm, instrumentComplete } from "@/components/InstrumentForm";
import { ClinicianPacket } from "@/components/outputs/ClinicianPacket";
import { PatientSummary } from "@/components/outputs/PatientSummary";
import { NATIONAL_CRISIS_RESOURCES, regionalCrisisResources } from "@/lib/crisis";
import { INSTRUMENTS } from "@/lib/instruments";
import { computeAssessment } from "@/lib/assessment";
import {
  APP_VERSION,
  clearSession,
  loadSession,
  newSession,
  saveSession,
} from "@/lib/storage";
import { IntakeAnswers, SessionState } from "@/lib/types";
import { IntakeBody, buildSteps, intakeComplete } from "./steps";

export default function AssessmentPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [crisisAck, setCrisisAck] = useState(false);
  const [view, setView] = useState<"patient" | "clinician">("patient");

  useEffect(() => {
    setSession(loadSession() ?? newSession());
  }, []);

  // Mark the session completed once the results step is reached.
  useEffect(() => {
    if (!session) return;
    const built = buildSteps(session.answers);
    const i = Math.min(Math.max(session.stepIndex, 0), built.length - 1);
    if (built[i].kind === "results" && session.status !== "completed") {
      const next: SessionState = {
        ...session,
        status: "completed",
        completedAt: new Date().toISOString(),
      };
      setSession(next);
      saveSession(next);
    }
  }, [session]);

  if (!session) {
    return (
      <main className="mx-auto max-w-prose px-5 py-12 text-plum-600">
        Loading…
      </main>
    );
  }

  const { answers, instruments } = session;
  const steps = buildSteps(answers);
  const idx = Math.min(Math.max(session.stepIndex, 0), steps.length - 1);
  const step = steps[idx];
  const totalQuestions = steps.length - 1; // exclude results

  function persist(next: SessionState) {
    setSession(next);
    saveSession(next);
  }

  function set(patch: Partial<IntakeAnswers>) {
    persist({ ...session!, answers: { ...session!.answers, ...patch } });
  }

  function setInstrument(code: string, id: string, value: number) {
    const prev = (session!.instruments as Record<string, Record<string, number>>)[code] ?? {};
    persist({
      ...session!,
      instruments: { ...session!.instruments, [code]: { ...prev, [id]: value } },
    });
  }

  function goTo(n: number) {
    const clamped = Math.min(Math.max(n, 0), steps.length - 1);
    persist({ ...session!, stepIndex: clamped });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function restart() {
    clearSession();
    const fresh = newSession();
    setCrisisAck(false);
    setView("patient");
    persist(fresh);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  // Crisis interrupt: PHQ-9 item 9 endorsed at any level.
  const item9 = instruments.PHQ9?.["phq9_9"] ?? 0;
  const showCrisis = item9 >= 1 && !crisisAck;
  const crisisResources = [
    ...regionalCrisisResources(answers.postal_fsa),
    ...NATIONAL_CRISIS_RESOURCES,
  ];

  // ── Results ───────────────────────────────────────────────────────────────
  if (step.kind === "results") {
    const result = computeAssessment(answers, instruments);
    const generatedAt = session.completedAt ?? new Date().toISOString();
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        {showCrisis && (
          <CrisisInterrupt
            resources={crisisResources}
            onAcknowledge={() => setCrisisAck(true)}
          />
        )}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-plum-900">
            Your results
          </h1>
          <div className="inline-flex rounded-full border border-plum-300 p-1">
            <button
              onClick={() => setView("patient")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                view === "patient" ? "bg-plum-700 text-white" : "text-plum-700"
              }`}
            >
              For me
            </button>
            <button
              onClick={() => setView("clinician")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                view === "clinician" ? "bg-plum-700 text-white" : "text-plum-700"
              }`}
            >
              For my clinician
            </button>
          </div>
        </div>

        {view === "patient" ? (
          <PatientSummary answers={answers} result={result} />
        ) : (
          <ClinicianPacket
            answers={answers}
            result={result}
            appVersion={APP_VERSION}
            generatedAt={generatedAt}
          />
        )}

        <CTAMenu
          email={session.email ?? ""}
          onEmailChange={(v) => persist({ ...session, email: v })}
          onEmail={() => {
            if (session.email) persist({ ...session, email: session.email });
            window.alert(
              "Email delivery is coming soon. Your answers are saved on this device — in the meantime you can print or download this summary as a PDF."
            );
          }}
          onPrint={() => window.print()}
        />

        <div className="no-print mt-8 flex flex-wrap gap-3">
          <button onClick={() => goTo(idx - 1)} className="btn-secondary">
            Back to questions
          </button>
          <button onClick={restart} className="btn-secondary">
            Start over
          </button>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </main>
    );
  }

  // ── Question steps ──────────────────────────────────────────────────────--
  const canAdvance =
    step.kind === "intake"
      ? intakeComplete(step.key, answers)
      : instrumentComplete(INSTRUMENTS[step.code], instruments[step.code] ?? {});

  const progressPct = Math.round((Math.min(idx, totalQuestions) / totalQuestions) * 100);

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      {showCrisis && (
        <CrisisInterrupt
          resources={crisisResources}
          onAcknowledge={() => setCrisisAck(true)}
        />
      )}

      <div className="no-print mb-6">
        <div className="flex items-center justify-between text-sm text-plum-600">
          <span>
            Step {idx + 1} of {totalQuestions}
          </span>
          <span>Saved automatically</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-plum-100">
          <div
            className="h-full bg-plum-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-plum-900">{step.title}</h1>

      <div className="mt-6">
        {step.kind === "intake" ? (
          <IntakeBody stepKey={step.key} answers={answers} set={set} />
        ) : (
          <InstrumentForm
            def={INSTRUMENTS[step.code]}
            responses={instruments[step.code] ?? {}}
            onChange={(id, value) => setInstrument(step.code, id, value)}
          />
        )}
      </div>

      <div className="no-print mt-8 flex items-center justify-between gap-3">
        {idx > 0 ? (
          <button onClick={() => goTo(idx - 1)} className="btn-secondary">
            Back
          </button>
        ) : (
          <Link href="/" className="btn-secondary">
            Cancel
          </Link>
        )}
        <button
          onClick={() => goTo(idx + 1)}
          disabled={!canAdvance}
          className="btn-primary"
        >
          {steps[idx + 1]?.kind === "results" ? "See my results" : "Continue"}
        </button>
      </div>

      {!canAdvance && (
        <p className="no-print mt-3 text-right text-sm text-plum-500">
          {step.kind === "instrument"
            ? "Please answer each item to continue."
            : "Please complete the required fields to continue."}
        </p>
      )}
    </main>
  );
}
