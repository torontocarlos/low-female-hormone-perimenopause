"use client";

import { InstrumentOption } from "@/lib/instruments/types";

// ── Small, dependency-free form primitives ────────────────────────────────

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  hint?: string;
  value: string | number | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {hint && <span className="field-hint">{hint}</span>}
      <input
        type={type}
        className="text-input"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  hint?: string;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {hint && <span className="field-hint">{hint}</span>}
      <textarea
        className="text-input"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export function ChoiceGroup<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label?: string;
  hint?: string;
  options: Choice<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      {label && <legend className="field-label">{label}</legend>}
      {hint && <span className="field-hint">{hint}</span>}
      <div className="space-y-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`choice ${selected ? "choice-selected" : ""}`}
            >
              <input
                type="radio"
                className="mt-1"
                checked={selected}
                onChange={() => onChange(opt.value)}
              />
              <span>
                <span className="block">{opt.label}</span>
                {opt.hint && (
                  <span className="block text-sm text-plum-600">{opt.hint}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CheckboxGroup({
  label,
  hint,
  options,
  value = [],
  onChange,
}: {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
  value: string[] | undefined;
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => {
    const set = new Set(value);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange(Array.from(set));
  };
  return (
    <fieldset>
      {label && <legend className="field-label">{label}</legend>}
      {hint && <span className="field-hint">{hint}</span>}
      <div className="space-y-2">
        {options.map((opt) => {
          const selected = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`choice ${selected ? "choice-selected" : ""}`}
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selected}
                onChange={() => toggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={`choice ${checked ? "choice-selected" : ""}`}>
      <input
        type="checkbox"
        className="mt-1"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function BoolChoice({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <ChoiceGroup<"yes" | "no">
      label={label}
      hint={hint}
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      value={value === undefined ? undefined : value ? "yes" : "no"}
      onChange={(v) => onChange(v === "yes")}
    />
  );
}

/** A single 0–N instrument item rendered as a horizontal/stacked radio row. */
export function ScaleItem({
  text,
  hint,
  options,
  value,
  onChange,
  index,
}: {
  text: string;
  hint?: string;
  options: InstrumentOption[];
  value: number | undefined;
  onChange: (v: number) => void;
  index?: number;
}) {
  return (
    <div className="border-b border-plum-100 py-4 last:border-0">
      <p className="mb-1 font-medium text-plum-900">
        {index != null && <span className="text-plum-400">{index}. </span>}
        {text}
      </p>
      {hint && <p className="mb-3 text-sm text-plum-600">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                selected
                  ? "border-plum-600 bg-plum-100 font-medium text-plum-900 ring-1 ring-plum-500"
                  : "border-plum-200 bg-white text-plum-700 hover:border-plum-400"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
