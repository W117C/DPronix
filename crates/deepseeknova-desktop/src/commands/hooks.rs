use super::*;

#[tauri::command]
pub async fn get_hooks() -> Result<Vec<Hook>, String> {
    let path = hooks_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(vec![
            Hook {
                event: "on_session_start".into(),
                command: "echo 'Session started'".into(),
                enabled: true,
            },
            Hook {
                event: "on_session_end".into(),
                command: "git add -A && git stash".into(),
                enabled: true,
            },
            Hook {
                event: "on_tool_call".into(),
                command: "logger -t deepseeknova 'Tool: $TOOL'".into(),
                enabled: true,
            },
            Hook {
                event: "on_approval_request".into(),
                command: "paplay /usr/share/sounds/alert.wav".into(),
                enabled: true,
            },
            Hook {
                event: "on_task_complete".into(),
                command: "notify-send 'Done' 'Task completed'".into(),
                enabled: true,
            },
            Hook {
                event: "on_budget_exceeded".into(),
                command: "notify-send 'Budget!' 'Check billing'".into(),
                enabled: true,
            },
        ])
    }
}

#[tauri::command]
pub async fn set_hook(event: String, command: String, enabled: bool) -> Result<(), String> {
    let path = hooks_config_path();
    let mut hooks: Vec<Hook> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        get_hooks().await.unwrap_or_default()
    };

    // Update or insert
    if let Some(h) = hooks.iter_mut().find(|h| h.event == event) {
        h.command = command.clone();
        h.enabled = enabled;
    } else {
        hooks.push(Hook {
            event: event.clone(),
            command,
            enabled,
        });
    }

    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data = serde_json::to_string_pretty(&hooks).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("hook '{event}' updated");
    Ok(())
}

#[tauri::command]
pub async fn delete_hook(event: String) -> Result<(), String> {
    let path = hooks_config_path();
    let mut hooks: Vec<Hook> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    hooks.retain(|h| h.event != event);
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data = serde_json::to_string_pretty(&hooks).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("hook '{event}' deleted");
    Ok(())
}
