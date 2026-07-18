/**
 * SidebarPanel — three-tab panel (Sessions / Files / Skills).
 *
 * Uses dp-* design system classes. Replaces the old Sidebar.tsx which
 * used Reasonix DOM names (.sidebar / .side-head / .session-list).
 */
import { useState } from "react";
import type { SessionSummary, SkillSummary } from "../types";

interface SidebarPanelProps {
  sessions: SessionSummary[];
  skills?: SkillSummary[];
  collapsed?: boolean;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  running?: boolean;
  messageCount?: number;
}

type Tab = "sessions" | "files" | "skills";

export default function SidebarPanel({
  sessions,
  skills = [],
  collapsed,
  onNewSession,
  onSelectSession,
  running,
  messageCount,
}: SidebarPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");

  if (collapsed) return null;

  return (
    <aside className="dp-sidebar">
      <div className="head">
        <button
          className="new-btn"
          onClick={onNewSession}
          disabled={running}
          title="New session"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>New chat</span>
        </button>
      </div>

      <div className="dp-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "sessions"}
          className={`tab${activeTab === "sessions" ? " active" : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          Sessions
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "files"}
          className={`tab${activeTab === "files" ? " active" : ""}`}
          onClick={() => setActiveTab("files")}
        >
          Files
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "skills"}
          className={`tab${activeTab === "skills" ? " active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </button>
      </div>

      <div className="dp-list">
        {activeTab === "sessions" &&
          sessions.map((s) => (
            <button
              key={s.id}
              className={`dp-list-item${s.active ? " active" : ""}`}
              onClick={() => onSelectSession?.(s.id)}
            >
              <span className="ico" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="label">{s.title}</span>
              {messageCount !== undefined && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--dp-muted)" }}>
                  {messageCount}
                </span>
              )}
            </button>
          ))}

        {activeTab === "files" && (
          <p className="dp-empty">Workspace file tree will appear here.</p>
        )}

        {activeTab === "skills" &&
          (skills.length > 0 ? (
            skills.map((s) => (
              <button
                key={s.name}
                className="dp-list-item"
                title={s.description}
              >
                <span className="ico" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                </span>
                <span className="label">{s.name}</span>
              </button>
            ))
          ) : (
            <p className="dp-empty">No skills loaded.</p>
          ))}
      </div>

      <div className="foot">
        <span>DPronix v0.3.0</span>
      </div>
    </aside>
  );
}
