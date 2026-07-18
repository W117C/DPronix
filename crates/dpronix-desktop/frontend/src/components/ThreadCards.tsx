/**
 * ThreadCards — Reasonix UI: ApprovalCard, ToolCallCard, ReasoningDisclosure, PlanStepsCard
 */
import { useState } from "react";
import type { ApprovalRequest, ToolCall, PlanStep } from "../types";

export function ApprovalCard({ request, onApprove, onReject }: { request: ApprovalRequest; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  return (
    <div className="rx-approval-card" role="alert">
      <p className="rx-label">Needs Confirmation</p>
      <p className="rx-title">{request.title}</p>
      {request.description && <p className="rx-description">{request.description}</p>}
      <div className="rx-actions">
        <button className="rx-btn" onClick={() => onReject(request.id)}>Reject</button>
        <button className="rx-btn rx-btn-approve" onClick={() => onApprove(request.id)}>Approve</button>
      </div>
    </div>
  );
}

export function ToolCallCard({ call, defaultOpen }: { call: ToolCall; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const statusIcon = call.status === "running" ? "..." : call.status === "success" ? "\u2713" : "\u2715";
  return (
    <div className="rx-tool-card">
      <button className="rx-summary" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={`chevron${open ? " open" : ""}`}>&rsaquo;</span>
        <span className="rx-command">{call.command}</span>
        <span className={`status ${call.status}`}>{statusIcon}</span>
      </button>
      {open && call.detail && <pre className="rx-detail">{call.detail}</pre>}
    </div>
  );
}

export function ReasoningDisclosure({ durationSeconds, children }: { durationSeconds?: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rx-reasoning">
      <button className="rx-summary" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={`chevron${open ? " open" : ""}`}>&rsaquo;</span>
        <span>Reasoning{durationSeconds ? ` (${durationSeconds}s)` : ""}</span>
      </button>
      {open && <div className="rx-content">{children}</div>}
    </div>
  );
}

export function PlanStepsCard({ title, steps }: { title: string; steps: PlanStep[] }) {
  return (
    <div className="rx-plan-card">
      <p className="rx-title">{title}</p>
      <div className="rx-steps">
        {steps.map((s) => (
          <div key={s.id} className="rx-step">
            <span className={`icon ${s.status}`}>
              {s.status === "done" ? "\u2713" : s.status === "active" ? "\u25CF" : "\u25CB"}
            </span>
            <span className={`label ${s.status}`}>{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
