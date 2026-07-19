/**
 * ContextPanel.tsx — 上下文文件列表 + 变更类型
 */

import { useStore } from "../store";
import type { FileChangeType } from "../types";

const changeIcon: Record<FileChangeType, string> = {
  added: "🟢",
  removed: "🔴",
  modified: "🟡",
};

export default function ContextPanel() {
  const contextFiles = useStore((s) => s.contextFiles);
  const skills = useStore((s) => s.skills);

  return (
    <div style={{ height: "100%", overflow: "auto", padding: "8px" }}>
      <div className="sidebar-header">
        <h3>上下文文件</h3>
        <span className="tag">{contextFiles.length}</span>
      </div>

      {contextFiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">暂无上下文文件</div>
        </div>
      ) : (
        <>
          {contextFiles.map((f) => (
            <div
              key={f.path}
              className="sidebar-item"
              title={f.path}
              style={{ gap: "6px" }}
            >
              {f.changeType && (
                <span style={{ fontSize: "10px" }}>{changeIcon[f.changeType]}</span>
              )}
              <span className="sidebar-item-title" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                {f.path.split("/").pop()}
              </span>
              <span className="sidebar-item-meta">{f.path.split("/").slice(0, -1).join("/")}</span>
            </div>
          ))}
        </>
      )}

      <div className="divider" />

      <div className="sidebar-header">
        <h3>已加载技能</h3>
        <span className="tag">{skills.length}</span>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚡</div>
          <div className="empty-state-text">暂无技能加载</div>
        </div>
      ) : (
        skills.map((skill) => (
          <div key={skill.name} className="skill-card-mini" style={{ margin: "4px 0" }}>
            <div className="skill-card-mini-name">{skill.name}</div>
            <div className="skill-card-mini-desc">{skill.description}</div>
            {skill.tools_allowed.length > 0 && (
              <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                {skill.tools_allowed.map((t) => (
                  <span key={t} className="tag tag-cyan">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
