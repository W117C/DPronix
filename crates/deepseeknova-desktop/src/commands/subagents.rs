use super::*;

#[tauri::command]
pub async fn list_subagents() -> Result<Vec<SubAgent>, String> {
    Ok(vec![
        SubAgent {
            name: "code-reviewer".into(),
            description: "代码审查专家".into(),
            model: "deepseek-v4-pro".into(),
            status: "idle".into(),
            tasks: 12,
        },
        SubAgent {
            name: "bug-hunter".into(),
            description: "Bug 检测和根因分析".into(),
            model: "deepseek-v4-pro".into(),
            status: "idle".into(),
            tasks: 5,
        },
        SubAgent {
            name: "test-generator".into(),
            description: "自动生成测试用例".into(),
            model: "deepseek-v4-flash".into(),
            status: "idle".into(),
            tasks: 8,
        },
        SubAgent {
            name: "refactor-assistant".into(),
            description: "代码重构建议".into(),
            model: "deepseek-v4-pro".into(),
            status: "running".into(),
            tasks: 3,
        },
        SubAgent {
            name: "frontend-design".into(),
            description: "前端 UI/UX 设计".into(),
            model: "deepseek-v4-flash".into(),
            status: "idle".into(),
            tasks: 7,
        },
        SubAgent {
            name: "doc-generator".into(),
            description: "文档生成".into(),
            model: "deepseek-v4-flash".into(),
            status: "idle".into(),
            tasks: 15,
        },
    ])
}
