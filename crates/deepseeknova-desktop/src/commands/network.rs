use super::*;

#[tauri::command]
pub async fn get_network_config() -> Result<NetworkConfig, String> {
    let path = network_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(NetworkConfig {
            allow_network: true,
            proxy: None,
            timeout_secs: 30,
            max_retries: 3,
            ssl_verify: true,
            auto_reconnect: true,
        })
    }
}

#[tauri::command]
pub async fn set_network_config(config: NetworkConfig) -> Result<(), String> {
    let path = network_config_path();
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&config).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("network config updated");
    Ok(())
}

/// Network diagnostics — currently returns placeholder data.
/// TODO: implement real connectivity checks (ping API endpoints, measure latency).
#[tauri::command]
pub async fn network_diagnostics() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "mock": true,
        "results": [
            {"name": "DeepSeek API", "status": "pending", "detail": "未实际检测"},
            {"name": "GitHub API", "status": "pending", "detail": "未实际检测"},
            {"name": "MCP: web-search", "status": "pending", "detail": "未实际检测"},
        ]
    }))
}
