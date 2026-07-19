use super::*;

#[tauri::command]
pub async fn list_mcp_servers() -> Result<Vec<McpServer>, String> {
    let path = mcp_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(vec![
            McpServer {
                name: "filesystem".into(),
                command: "npx".into(),
                args: "@modelcontextprotocol/server-filesystem".into(),
                transport: "stdio".into(),
                status: "running".into(),
            },
            McpServer {
                name: "git".into(),
                command: "npx".into(),
                args: "@modelcontextprotocol/server-git".into(),
                transport: "stdio".into(),
                status: "running".into(),
            },
            McpServer {
                name: "shell".into(),
                command: "npx".into(),
                args: "@modelcontextprotocol/server-shell".into(),
                transport: "stdio".into(),
                status: "running".into(),
            },
            McpServer {
                name: "web-search".into(),
                command: "npx".into(),
                args: "@modelcontextprotocol/server-brave-search".into(),
                transport: "stdio".into(),
                status: "stopped".into(),
            },
        ])
    }
}

#[tauri::command]
pub async fn add_mcp_server(server: McpServer) -> Result<(), String> {
    let path = mcp_config_path();
    let mut servers: Vec<McpServer> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    servers.push(server);
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&servers).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("MCP server added");
    Ok(())
}

#[tauri::command]
pub async fn remove_mcp_server(name: String) -> Result<(), String> {
    let path = mcp_config_path();
    let mut servers: Vec<McpServer> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    servers.retain(|s| s.name != name);
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&servers).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("MCP server '{name}' removed");
    Ok(())
}

#[tauri::command]
pub async fn toggle_mcp_server(name: String, start: bool) -> Result<(), String> {
    let path = mcp_config_path();
    let mut servers: Vec<McpServer> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    for s in &mut servers {
        if s.name == name {
            s.status = if start {
                "running".into()
            } else {
                "stopped".into()
            };
        }
    }
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data =
        serde_json::to_string_pretty(&servers).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!(
        "MCP server '{name}' {}",
        if start { "started" } else { "stopped" }
    );
    Ok(())
}
