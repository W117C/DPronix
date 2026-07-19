/**
 * ModelSelector.tsx — 模型选择下拉
 */

import { useState } from "react";
import { useStore } from "../store";

export default function ModelSelector() {
  const model = useStore((s) => s.model);
  const setModel = useStore((s) => s.setModel);
  const capabilities = useStore((s) => s.capabilities);
  const [open, setOpen] = useState(false);

  // 可用模型列表（从 capabilities 或默认）
  const models = [
    { id: "deepseek-chat", label: "DeepSeek Chat" },
    { id: "deepseek-reasoner", label: "DeepSeek Reasoner (R1)" },
    { id: "deepseek-coder", label: "DeepSeek Coder" },
  ];

  const current = models.find((m) => m.id === model) || models[0];

  return (
    <div style={{ position: "relative" }}>
      <button
        className="btn-ghost btn"
        onClick={() => setOpen(!open)}
        style={{ gap: "4px", fontSize: "12px" }}
      >
        <span style={{ color: "var(--accent)" }}>●</span>
        {current?.label || model}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "4px",
              background: "var(--bg-2)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-md)",
              zIndex: 100,
              overflow: "hidden",
              minWidth: "200px",
            }}
          >
            {models.map((m) => (
              <div
                key={m.id}
                className="sidebar-item"
                style={{ padding: "8px 12px" }}
                onClick={() => {
                  setModel(m.id);
                  setOpen(false);
                }}
              >
                <span className="sidebar-item-title">{m.label}</span>
                {m.id === model && (
                  <span style={{ color: "var(--accent)", fontSize: "12px" }}>✓</span>
                )}
              </div>
            ))}
            {capabilities?.supports_reasoning_effort && (
              <div style={{ padding: "4px 12px", fontSize: "11px", color: "var(--text-3)" }}>
                支持推理深度调节
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
