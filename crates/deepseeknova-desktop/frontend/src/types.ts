/**
 * types.ts — Wire contract matching commands.rs and runner.rs WireEvent.
 */

/** A single event pushed from the Rust backend through a Tauri Channel. */
export type WireEvent =
  | { kind: "text_delta"; text: string }
  | { kind: "reasoning_delta"; text: string; signature: string | null }
  | { kind: "tool_call_start"; id: string; name: string }
  | { kind: "tool_call_delta"; id: string; args_delta: string }
  | { kind: "tool_call_end"; id: string; name: string; arguments: string }
  | { kind: "tool_result"; call_id: string; result: string }
  | {
      kind: "usage";
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      cache_hit_tokens: number;
      cache_miss_tokens: number;
      reasoning_tokens: number;
      session_cache_hit_tokens: number;
      session_cache_miss_tokens: number;
    }
  | { kind: "turn_complete" }
  | { kind: "approval_request"; id: string; title: string; description: string | null }
  | { kind: "done"; text: string; usage: UsageInfo | null }
  | { kind: "error"; message: string };

export interface UsageInfo {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cache_hit_tokens: number;
  cache_miss_tokens: number;
  reasoning_tokens: number;
  session_cache_hit_tokens: number;
  session_cache_miss_tokens: number;
}

export interface SubmitRequest {
  prompt: string;
  model?: string;
  reasoning_effort?: string;
  thinking_enabled?: boolean;
}

export interface SkillSummary {
  name: string;
  description: string;
  tools_allowed: string[];
}

export interface ProviderSummary {
  name: string;
  kind: string;
  model?: string;
  base_url?: string;
  connected?: boolean;
}

export interface Capabilities {
  version: string;
  supports_thinking: boolean;
  supports_reasoning_effort: boolean;
  supports_tools: boolean;
  supports_mcp: boolean;
  supports_images: boolean;
  max_steps_default: number;
  reasoning_effort_levels: string[];
}

/** One message in the conversation transcript. */
export type MessageRole = "user" | "assistant" | "reasoning" | "tool";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  toolName?: string;
  toolId?: string;
  toolArgs?: string;
  toolResult?: string;
  reasoningDone?: boolean;
}

/** A pending tool approval request (Act mode). */
export interface ApprovalRequest {
  id: string;
  title: string;
  description: string | null;
  toolName?: string;
  toolArgs?: string;
}

// ── Desktop-only types (UI state, not wire protocol) ──────────────────────

/** Agent execution mode. */
export type Mode = "plan" | "act" | "yolo";

/** Reasoning effort level. */
export type Effort = "low" | "medium" | "high" | "max";

/** Agent runtime status. */
export type AgentStatus = "ready" | "running";

/** File change type for context panel badges. */
export type FileChangeType = "added" | "removed" | "modified";

/** A file entry in the context panel. */
export interface ContextFile {
  path: string;
  changeType?: FileChangeType;
}

/** A session summary for the sidebar. */
export interface SessionSummary {
  id: string;
  title: string;
  active?: boolean;
}

/** MCP server status for settings/sidebar. */
export interface McpServer {
  name: string;
  status: "connected" | "disconnected" | "error";
  command: string;
  args: string[];
  tool_count: number;
  error?: string;
}

/** App config for settings panel. */
export interface AppConfig {
  default_mode: Mode;
  max_steps: number;
  auto_mode: boolean;
}

// ── 扩展类型（UI 层使用）────────────────────────────────────

/** TODO 项 */
export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  status: "pending" | "in_progress" | "completed";
}

/** 记忆项 */
export interface MemoryItem {
  id: string;
  text: string;
  createdAt: number;
}

/** 文件树节点 */
export interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileTreeNode[];
  gitStatus?: "modified" | "added" | "deleted" | "untracked";
}

/** Slash 命令 */
export interface SlashCommand {
  name: string;
  description: string;
}

/** 工具调用信息 */
export interface ToolCallInfo {
  id: string;
  name: string;
  args: string;
  result?: string;
  status: "running" | "done" | "error";
}
