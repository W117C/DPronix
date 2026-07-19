#[tauri::command]
pub async fn get_shortcuts() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!([
        {"action": "发送消息", "keys": "Enter", "category": "输入"},
        {"action": "换行", "keys": "Shift + Enter", "category": "输入"},
        {"action": "命令面板", "keys": "Ctrl/Cmd + P", "category": "全局"},
        {"action": "中断生成", "keys": "Esc", "category": "对话"},
        {"action": "新建会话", "keys": "Ctrl/Cmd + N", "category": "会话"},
        {"action": "关闭标签", "keys": "Ctrl/Cmd + W", "category": "会话"},
        {"action": "搜索会话", "keys": "Ctrl/Cmd + F", "category": "搜索"},
        {"action": "切换主题", "keys": "Ctrl/Cmd + Shift + T", "category": "全局"},
        {"action": "折叠侧边栏", "keys": "Ctrl/Cmd + B", "category": "全局"},
        {"action": "Plan 模式", "keys": "Ctrl/Cmd + Shift + 1", "category": "模式"},
        {"action": "Act 模式", "keys": "Ctrl/Cmd + Shift + 2", "category": "模式"},
        {"action": "YOLO 模式", "keys": "Ctrl/Cmd + Shift + 3", "category": "模式"},
    ]))
}

#[tauri::command]
pub async fn check_for_updates() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "update_available": false,
        "current_version": env!("CARGO_PKG_VERSION"),
        "latest_version": env!("CARGO_PKG_VERSION"),
        "release_notes": "",
    }))
}
