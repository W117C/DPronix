/**
 * MemoryPanel.tsx — 记忆面板（最近记忆 + 搜索）
 */

import { useState } from "react";
import { useStore } from "../store";

export default function MemoryPanel() {
  const memories = useStore((s) => s.memories);
  const [query, setQuery] = useState("");

  const filtered = query
    ? memories.filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    : memories;

  return (
    <div style={{ height: "100%", overflow: "auto", padding: "8px" }}>
      <div className="sidebar-header">
        <h3>长期记忆</h3>
        <span className="tag">{memories.length}</span>
      </div>

      <div className="sidebar-search" style={{ padding: "4px 0 8px" }}>
        <input
          className="input"
          placeholder="搜索记忆…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧠</div>
          <div className="empty-state-text">
            {query ? "未找到匹配记忆" : "暂无记忆<br/>对话中自动存储"}
          </div>
        </div>
      ) : (
        filtered.map((m) => (
          <div key={m.id} className="memory-item">
            <div className="memory-item-text">{m.text}</div>
            <div className="memory-item-time">
              {new Date(m.createdAt).toLocaleString("zh-CN")}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
