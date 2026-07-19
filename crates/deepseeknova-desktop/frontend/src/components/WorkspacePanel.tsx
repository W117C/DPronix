/**
 * WorkspacePanel.tsx — 工作区文件浏览器
 * 目录树 + 文件预览 + Git 状态
 */

import { useState } from "react";
import type { FileTreeNode } from "../types";

// 模拟文件树（实际从后端获取）
const mockTree: FileTreeNode[] = [
  {
    name: "src",
    path: "src",
    isDir: true,
    children: [
      { name: "main.rs", path: "src/main.rs", isDir: false },
      { name: "lib.rs", path: "src/lib.rs", isDir: false },
      {
        name: "memory",
        path: "src/memory",
        isDir: true,
        children: [
          { name: "mod.rs", path: "src/memory/mod.rs", isDir: false },
          { name: "store.rs", path: "src/memory/store.rs", isDir: false },
          { name: "recall.rs", path: "src/memory/recall.rs", isDir: false },
        ],
      },
      {
        name: "artifacts",
        path: "src/artifacts",
        isDir: true,
        children: [
          { name: "wiki.rs", path: "src/artifacts/wiki.rs", isDir: false },
          { name: "cards.rs", path: "src/artifacts/cards.rs", isDir: false },
          { name: "distill.rs", path: "src/artifacts/distill.rs", isDir: false },
        ],
      },
    ],
  },
  { name: "Cargo.toml", path: "Cargo.toml", isDir: false },
  { name: "README.md", path: "README.md", isDir: false },
];

export default function WorkspacePanel() {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["src"]));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleDir = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderNode = (node: FileTreeNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedPaths.has(node.path);

    return (
      <div key={node.path}>
        <div
          className="file-tree-node"
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => {
            if (node.isDir) toggleDir(node.path);
            else setSelectedFile(node.path);
          }}
        >
          {node.isDir ? (
            <>
              <span className="file-tree-icon">{isExpanded ? "📂" : "📁"}</span>
              <span className="file-tree-name">{node.name}</span>
            </>
          ) : (
            <>
              <span className="file-tree-icon">📄</span>
              <span className="file-tree-name">{node.name}</span>
              {node.gitStatus && (
                <span className={`tag tag-${node.gitStatus === "added" ? "green" : node.gitStatus === "deleted" ? "red" : "amber"}`}>
                  {node.gitStatus}
                </span>
              )}
            </>
          )}
        </div>
        {node.isDir && isExpanded && node.children &&
          node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ height: "100%", overflow: "auto", padding: "8px" }}>
      <div className="sidebar-header">
        <h3>工作区</h3>
        <span className="git-badge">
          <span className="git-branch">main</span>
        </span>
      </div>

      <div className="file-tree">
        {mockTree.map((node) => renderNode(node, 0))}
      </div>

      {selectedFile && (
        <>
          <div className="divider" />
          <div className="sidebar-header">
            <h3>{selectedFile.split("/").pop()}</h3>
          </div>
          <div style={{
            padding: "8px",
            background: "var(--bg-2)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--text-2)",
            maxHeight: "300px",
            overflow: "auto",
          }}>
            // 文件预览（从后端加载）
            <span style={{ color: "var(--text-muted)" }}>选择文件查看内容…</span>
          </div>
        </>
      )}
    </div>
  );
}
