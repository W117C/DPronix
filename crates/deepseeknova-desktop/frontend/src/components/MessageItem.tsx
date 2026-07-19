/**
 * MessageItem.tsx — 用户/助手消息渲染
 */

import type { Message } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

export default function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className="message">
      <div className="message-header">
        <div className={`message-avatar ${isUser ? "user" : "assistant"}`}>
          {isUser ? "U" : "AI"}
        </div>
        <span className="message-role">{isUser ? "你" : "DeepseekNova"}</span>
        <span className="message-time">
          {new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="message-content">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
