/**
 * ToolCard.tsx — 工具调用卡片（展开/折叠）
 */

import { useState } from "react";
import type { Message } from "../types";

export default function ToolCard({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);

  const hasResult = !!message.toolResult;
  const status = hasResult ? "done" : "running";

  return (
    <div className="tool-card">
      <div
        className="tool-card-header"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: expanded ? "rotate(90deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="tool-card-name">{message.toolName || "tool"}</span>
        <span className="tool-card-status">
          {status === "running" ? (
            <span style={{ color: "var(--amber)" }}>⏳ 执行中…</span>
          ) : (
            <span style={{ color: "var(--green)" }}>✓ 完成</span>
          )}
        </span>
      </div>

      {expanded && (
        <div className="tool-card-body">
          {message.toolArgs && (
            <div className="tool-card-args">
              <span style={{ color: "var(--text-3)" }}>参数: </span>
              {message.toolArgs}
            </div>
          )}
          {message.toolResult && (
            <div className="tool-card-result">
              <span style={{ color: "var(--text-3)" }}>结果: </span>
              {message.toolResult.length > 2000
                ? message.toolResult.slice(0, 2000) + "\n… (已截断)"
                : message.toolResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
