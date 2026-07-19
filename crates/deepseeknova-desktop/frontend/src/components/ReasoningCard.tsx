/**
 * ReasoningCard.tsx — 推理/思考卡片（金色主题，可折叠）
 */

import { useState } from "react";
import type { Message } from "../types";

export default function ReasoningCard({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="reasoning-card">
      <div
        className="reasoning-card-header"
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
        <span className="reasoning-card-title">
          💭 推理过程 {message.reasoningDone ? "" : "（进行中…）"}
        </span>
      </div>
      {expanded && (
        <div className="reasoning-card-body">{message.content}</div>
      )}
    </div>
  );
}
