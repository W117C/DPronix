use super::*;

#[tauri::command]
pub async fn get_sandbox_config() -> Result<SandboxConfig, String> {
    let path = sandbox_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(SandboxConfig {
            enabled: true,
            allowed_paths: vec![std::env::current_dir()
                .map(|p| p.display().to_string())
                .unwrap_or_default()],
            blocked_paths: vec!["/etc".into(), "/var".into(), "~/.ssh".into()],
            isolate_env: true,
            csp_enabled: true,
        })
    }
}

#[tauri::command]
pub async fn set_sandbox_config(config: SandboxConfig) -> Result<(), String> {
    let path = sandbox_config_path();
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&config).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("sandbox config updated");
    Ok(())
}
