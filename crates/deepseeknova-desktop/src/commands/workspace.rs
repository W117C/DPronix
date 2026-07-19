#[tauri::command]
pub async fn get_workspace_files() -> Result<Vec<String>, String> {
    let cwd = std::env::current_dir().map_err(|e| format!("cwd error: {e}"))?;
    let mut entries = Vec::new();
    let mut dir = tokio::fs::read_dir(&cwd)
        .await
        .map_err(|e| format!("read_dir error: {e}"))?;
    while let Some(entry) = dir
        .next_entry()
        .await
        .map_err(|e| format!("entry error: {e}"))?
    {
        let path = entry.path();
        let display = if path.is_dir() {
            format!(
                "/{}/",
                path.file_name()
                    .map(|s| s.to_string_lossy())
                    .unwrap_or_default()
            )
        } else {
            path.file_name()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_default()
        };
        entries.push(display);
    }
    entries.sort();
    Ok(entries)
}

#[tauri::command]
pub async fn get_file_diff(file_path: String) -> Result<String, String> {
    // Use git diff to get the diff for the file
    let output = tokio::process::Command::new("git")
        .args(["diff", "--no-color", &file_path])
        .output()
        .await
        .map_err(|e| format!("git diff error: {e}"))?;

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
