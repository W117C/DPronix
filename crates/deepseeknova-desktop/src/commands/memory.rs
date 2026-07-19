use super::*;

#[tauri::command]
pub async fn get_memories() -> Result<Vec<MemoryEntry>, String> {
    let path = memory_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(vec![
            MemoryEntry {
                id: "1".into(),
                memory_type: "project".into(),
                text: "项目使用 Rust + Tauri 2.0 构建".into(),
                created_at: "2 天前".into(),
            },
            MemoryEntry {
                id: "2".into(),
                memory_type: "user".into(),
                text: "用户偏好 VS Code 和深色主题".into(),
                created_at: "1 天前".into(),
            },
            MemoryEntry {
                id: "3".into(),
                memory_type: "global".into(),
                text: "Flash 用于日常，Pro 用于复杂推理".into(),
                created_at: "3 天前".into(),
            },
        ])
    }
}

#[tauri::command]
pub async fn add_memory(memory_type: String, text: String) -> Result<MemoryEntry, String> {
    let path = memory_config_path();
    let mut memories: Vec<MemoryEntry> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };

    let entry = MemoryEntry {
        id: generate_id(),
        memory_type,
        text,
        created_at: "刚刚".into(),
    };
    memories.push(entry.clone());

    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&memories).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("memory added");
    Ok(entry)
}

#[tauri::command]
pub async fn delete_memory(id: String) -> Result<(), String> {
    let path = memory_config_path();
    let mut memories: Vec<MemoryEntry> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    memories.retain(|m| m.id != id);
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&memories).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("memory {id} deleted");
    Ok(())
}
