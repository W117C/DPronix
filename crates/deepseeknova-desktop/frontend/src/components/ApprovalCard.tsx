/**
 * ApprovalCard.tsx — 危险命令审批卡片
 */

import { useStore } from "../store";
import type { ApprovalRequest } from "../types";

export default function ApprovalCard({ approval }: { approval: ApprovalRequest }) {
  const setPendingApproval = useStore((s) => s.setPendingApproval);

  const handleAction = (action: "allow" | "deny") => {
    // 这里通过 Tauri invoke 发送审批结果
    console.log(`Approval ${action} for ${approval.id}`);
    setPendingApproval(null);
  };

  return (
    <div className="approval-card">
      <div className="approval-title">
        ⚠️ 需要审批
      </div>
      <div className="approval-desc">
        <strong>{approval.title}</strong>
        {approval.description && (
          <pre style={{ marginTop: "4px", whiteSpace: "pre-wrap", fontSize: "12px" }}>
            {approval.description}
          </pre>
        )}
      </div>
      <div className="approval-actions">
        <button
          className="btn btn-primary"
          onClick={() => handleAction("allow")}
          title="允许执行此操作"
        >
          允许
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleAction("deny")}
          title="拒绝此操作"
        >
          拒绝
        </button>
      </div>
    </div>
  );
}
