use super::*;

#[tauri::command]
pub async fn list_skills() -> Result<Vec<SkillSummary>, String> {
    let mut skills = Vec::new();
    let paths = [".deepseeknova/skills", ".agents/skills"];
    for path_str in &paths {
        let loader = deepseeknova_skills::SkillLoader::new(path_str);
        if let Ok(loaded) = loader.load_all() {
            for skill in loaded {
                skills.push(SkillSummary {
                    name: skill.name,
                    description: skill.description,
                    tools_allowed: skill.tools_allowed,
                });
            }
        }
    }
    Ok(skills)
}

#[tauri::command]
pub async fn list_providers() -> Result<Vec<ProviderSummary>, String> {
    let config = deepseeknova_config::Config::load().map_err(|e| format!("config error: {e}"))?;
    Ok(config
        .providers
        .iter()
        .map(|p| ProviderSummary {
            name: p.name.clone(),
            kind: p.kind.clone(),
            model: p.model.clone(),
            base_url: p.base_url.clone(),
        })
        .collect())
}
