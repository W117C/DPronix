#[tauri::command]
pub async fn get_wiki_pages() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!([
        {"title": "项目架构", "desc": "Rust + Tauri 2.0 + React 18 + TypeScript", "icon": "🏗️", "updated": "2 天前", "sections": 12},
        {"title": "API 文档", "desc": "工具调用规范、流式 SSE 协议、错误处理", "icon": "📡", "updated": "1 天前", "sections": 8},
        {"title": "开发指南", "desc": "环境搭建、构建流程、调试技巧、发布", "icon": "📖", "updated": "3 天前", "sections": 15},
        {"title": "缓存机制", "desc": "Prefix-Cache 三层架构", "icon": "💡", "updated": "5 天前", "sections": 6},
    ]))
}

#[tauri::command]
pub async fn get_knowledge_cards() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!([
        {"title": "Rust 异步编程", "desc": "tokio + async/await 最佳实践", "tag": "编程", "confidence": 95},
        {"title": "Tauri IPC 通信", "desc": "invoke() 和 emit() 性能对比", "tag": "架构", "confidence": 88},
        {"title": "React 性能优化", "desc": "useMemo、useCallback 和 memo", "tag": "前端", "confidence": 92},
        {"title": "DeepSeek API", "desc": "V4 Flash 和 Pro 选择策略", "tag": "AI", "confidence": 98},
    ]))
}
