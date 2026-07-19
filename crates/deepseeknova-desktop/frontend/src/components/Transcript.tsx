/**
 * Transcript.tsx — 消息流（支持流式响应）
 */

import { useRef, useEffect } from "react";
import { useStore } from "../store";
import MessageItem from "./MessageItem";
import ToolCard from "./ToolCard";
import ReasoningCard from "./ReasoningCard";
import ApprovalCard from "./ApprovalCard";
import Welcome from "./Welcome";

export default function Transcript() {
  const messages = useStore((s) => s.messages);
  const running = useStore((s) => s.running);
  const pendingApproval = useStore((s) => s.pendingApproval);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !running) {
    return (
      <div className="transcript" ref={containerRef}>
        <Welcome />
      </div>
    );
  }

  return (
    <div className="transcript" ref={containerRef}>
      {messages.map((msg) => {
        if (msg.role === "reasoning") {
          return <ReasoningCard key={msg.id} message={msg} />;
        }
        if (msg.role === "tool") {
          return <ToolCard key={msg.id} message={msg} />;
        }
        return <MessageItem key={msg.id} message={msg} />;
      })}

      {/* 审批卡片 */}
      {pendingApproval && <ApprovalCard approval={pendingApproval} />}

      {/* 加载指示器 */}
      {running && messages.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", color: "var(--text-3)" }}>
          <div className="status-dot running" />
          <span style={{ fontSize: "12px" }}>Agent 思考中…</span>
        </div>
      )}
    </div>
  );
}
