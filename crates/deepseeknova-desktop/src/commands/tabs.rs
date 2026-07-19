use super::*;

#[tauri::command]
pub async fn list_tabs() -> Result<Vec<TabInfo>, String> {
    let path = tabs_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(vec![TabInfo {
            id: "1".into(),
            title: "主会话".into(),
        }])
    }
}

#[tauri::command]
pub async fn create_tab(title: String) -> Result<TabInfo, String> {
    let path = tabs_path();
    let mut tabs: Vec<TabInfo> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        vec![TabInfo {
            id: "1".into(),
            title: "主会话".into(),
        }]
    };

    let tab = TabInfo {
        id: generate_id(),
        title,
    };
    tabs.push(tab.clone());

    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data = serde_json::to_string_pretty(&tabs).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("tab created");
    Ok(tab)
}

#[tauri::command]
pub async fn close_tab(id: String) -> Result<(), String> {
    let path = tabs_path();
    let mut tabs: Vec<TabInfo> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    tabs.retain(|t| t.id != id);
    if tabs.is_empty() {
        tabs.push(TabInfo {
            id: "1".into(),
            title: "主会话".into(),
        });
    }
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data = serde_json::to_string_pretty(&tabs).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("tab {id} closed");
    Ok(())
}
