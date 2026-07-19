/**
 * EffortSwitcher.tsx — 推理深度切换器
 */

import { useStore } from "../store";
import type { Effort } from "../types";

const efforts: { id: Effort; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Med" },
  { id: "high", label: "High" },
  { id: "max", label: "Max" },
];

export default function EffortSwitcher() {
  const effort = useStore((s) => s.effort);
  const setEffort = useStore((s) => s.setEffort);
  const capabilities = useStore((s) => s.capabilities);

  if (capabilities && !capabilities.supports_reasoning_effort) return null;

  return (
    <div className="effort-selector" title="推理深度">
      {efforts.map((e) => (
        <button
          key={e.id}
          className={`effort-btn ${effort === e.id ? "active" : ""}`}
          onClick={() => setEffort(e.id)}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}
