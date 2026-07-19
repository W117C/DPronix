use super::*;

#[tauri::command]
pub async fn get_permissions() -> Result<Vec<PermissionRule>, String> {
    let path = permissions_config_path();
    if path.exists() {
        let data = std::fs::read_to_string(&path).map_err(|e| format!("read error: {e}"))?;
        serde_json::from_str(&data).map_err(|e| format!("parse error: {e}"))
    } else {
        Ok(vec![
            PermissionRule {
                name: "目录沙箱".into(),
                description: "所有工具仅能访问启动时的项目目录".into(),
                enabled: true,
                rule_type: "文件".into(),
            },
            PermissionRule {
                name: "Plan 模式".into(),
                description: "AI 只能读，不能写，必须先提交计划".into(),
                enabled: false,
                rule_type: "执行".into(),
            },
            PermissionRule {
                name: "Review 审批".into(),
                description: "写操作进入审核队列，每次确认".into(),
                enabled: true,
                rule_type: "执行".into(),
            },
            PermissionRule {
                name: "Shell 命令确认".into(),
                description: "所有 Shell 命令都需要用户确认".into(),
                enabled: true,
                rule_type: "执行".into(),
            },
            PermissionRule {
                name: "自动提交".into(),
                description: "Agent 完成任务后自动 git commit".into(),
                enabled: false,
                rule_type: "Git".into(),
            },
            PermissionRule {
                name: "网络访问".into(),
                description: "允许 Agent 访问网络".into(),
                enabled: true,
                rule_type: "网络".into(),
            },
            PermissionRule {
                name: "文件删除".into(),
                description: "允许 Agent 删除文件".into(),
                enabled: false,
                rule_type: "文件".into(),
            },
            PermissionRule {
                name: "文件大小限制".into(),
                description: "单文件读写最大 10MB".into(),
                enabled: true,
                rule_type: "限制".into(),
            },
            PermissionRule {
                name: "Token 预算".into(),
                description: "单会话 Token 上限 500K".into(),
                enabled: true,
                rule_type: "限制".into(),
            },
            PermissionRule {
                name: "敏感文件保护".into(),
                description: "禁止访问 .env、.ssh、.aws 等".into(),
                enabled: true,
                rule_type: "安全".into(),
            },
            PermissionRule {
                name: "多标签隔离".into(),
                description: "标签之间完全隔离".into(),
                enabled: true,
                rule_type: "隔离".into(),
            },
            PermissionRule {
                name: "剪贴板访问".into(),
                description: "允许 Agent 读取剪贴板".into(),
                enabled: false,
                rule_type: "隐私".into(),
            },
        ])
    }
}

#[tauri::command]
pub async fn set_permission_rule(name: String, enabled: bool) -> Result<(), String> {
    let path = permissions_config_path();
    let mut rules: Vec<PermissionRule> = if path.exists() {
        std::fs::read_to_string(&path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    } else {
        // Load defaults
        get_permissions().await.unwrap_or_default()
    };

    for rule in &mut rules {
        if rule.name == name {
            rule.enabled = enabled;
        }
    }

    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let data = serde_json::to_string_pretty(&rules).map_err(|e| format!("serialize error: {e}"))?;
    std::fs::write(&path, data).map_err(|e| format!("write error: {e}"))?;
    info!("permission rule '{name}' set to {enabled}");
    Ok(())
}
