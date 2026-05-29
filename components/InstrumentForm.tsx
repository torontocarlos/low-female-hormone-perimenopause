"use client";

import { InstrumentDef } from "@/lib/instruments/types";
import { ScaleItem } from "./fields";

export function InstrumentForm({
  def,
  responses,
  onChange,
}: {
  def: InstrumentDef;
  responses: Record<string, number>;
  onChange: (id: string, value: number) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-plum-700">{def.intro}</p>
      <div className="card">
        {def.items.map((item, i) => (
          <ScaleItem
            key={item.id}
            index={i + 1}
            text={item.text}
            hint={item.hint}
            options={item.options}
            value={responses[item.id]}
            onChange={(v) => onChange(item.id, v)}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-plum-500">{def.attribution}</p>
    </div>
  );
}

export function instrumentComplete(
  def: InstrumentDef,
  responses: Record<string, number>
): boolean {
  return def.items.every((item) => responses[item.id] !== undefined);
}
