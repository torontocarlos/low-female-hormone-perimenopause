"use client";

import { CrisisResource } from "@/lib/crisis";

export function CrisisInterrupt({
  resources,
  onAcknowledge,
}: {
  resources: CrisisResource[];
  onAcknowledge: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum-900/60 p-4">
      <div className="max-w-lg rounded-2xl bg-white p-7 shadow-xl">
        <h2 className="text-xl font-semibold text-clay-700">
          Before you continue
        </h2>
        <p className="mt-3 text-plum-800">
          You mentioned having thoughts that you would be better off dead, or of
          hurting yourself. That matters, and you deserve support right now —
          not just at your next appointment.
        </p>
        <p className="mt-2 text-plum-800">
          Please reach out to one of these. They are free, confidential, and
          available now.
        </p>
        <ul className="mt-4 space-y-3">
          {resources.map((r) => (
            <li
              key={r.name}
              className="rounded-xl border border-clay-200 bg-clay-50 p-4"
            >
              <p className="font-semibold text-clay-800">{r.name}</p>
              <p className="text-sm text-plum-700">{r.detail}</p>
              {r.href && (
                <a
                  href={r.href}
                  className="mt-1 inline-block text-sm font-medium text-plum-700 underline"
                >
                  {r.href.startsWith("tel:") ? "Call now" : "Open"}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-plum-600">
          You can keep going with this tool when you’re ready — what you share
          will help your clinician understand how you’re doing.
        </p>
        <button onClick={onAcknowledge} className="btn-primary mt-5 w-full">
          I understand — continue
        </button>
      </div>
    </div>
  );
}
