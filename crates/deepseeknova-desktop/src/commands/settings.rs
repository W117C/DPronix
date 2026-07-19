use super::*;

#[tauri::command]
pub async fn save_settings(settings: serde_json::Value) -> Result<(), String> {
    let path = settings_path();
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&settings).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("settings saved");
    Ok(())
}

#[tauri::command]
pub async fn load_settings() -> Result<serde_json::Value, String> {
    let path = settings_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(serde_json::json!({}))
    }
}
