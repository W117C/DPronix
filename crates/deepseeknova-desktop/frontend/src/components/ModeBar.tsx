/**
 * ModeBar.tsx — 模式选择器 (Plan / Act / YOLO)
 */

import { useStore } from "../store";
import type { Mode } from "../types";

const modes: { id: Mode; label: string; title: string; color: string }[] = [
  { id: "plan", label: "Plan", title: "只读审计模式 — 不执行写操作", color: "var(--blue)" },
  { id: "act", label: "Act", title: "执行模式 — 写操作需要审批", color: "var(--amber)" },
  { id: "yolo", label: "YOLO", title: "全自动模式 — 无需审批", color: "var(--red)" },
];

export default function ModeBar() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  return (
    <div className="mode-selector" title="Agent 执行模式">
      {modes.map((m) => (
        <button
          key={m.id}
          className={`mode-btn ${mode === m.id ? "active" : ""}`}
          onClick={() => setMode(m.id)}
          title={m.title}
          style={mode === m.id ? { background: m.color, color: "white" } : {}}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
