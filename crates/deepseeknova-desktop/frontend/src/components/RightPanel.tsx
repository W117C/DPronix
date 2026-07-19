/**
 * RightPanel.tsx — 右侧面板
 * 标签页：上下文 | 工作区 | 记忆 | TODO
 */

import { useStore } from "../store";
import ContextPanel from "./ContextPanel";
import WorkspacePanel from "./WorkspacePanel";
import MemoryPanel from "./MemoryPanel";
import TodoPanel from "./TodoPanel";

export default function RightPanel() {
  const collapsed = useStore((s) => s.rightCollapsed);
  const activeTab = useStore((s) => s.activeRightTab);
  const setActiveTab = useStore((s) => s.setActiveRightTab);

  if (collapsed) return null;

  const tabs = [
    { id: "context" as const, label: "上下文" },
    { id: "workspace" as const, label: "工作区" },
    { id: "memory" as const, label: "记忆" },
    { id: "todo" as const, label: "TODO" },
  ];

  return (
    <aside className="right-panel">
      <div className="tabs">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "context" && <ContextPanel />}
        {activeTab === "workspace" && <WorkspacePanel />}
        {activeTab === "memory" && <MemoryPanel />}
        {activeTab === "todo" && <TodoPanel />}
      </div>
    </aside>
  );
}
