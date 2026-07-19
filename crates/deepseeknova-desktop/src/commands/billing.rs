#[tauri::command]
pub async fn get_billing_stats() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "session": {
            "cache_hit": 1280,
            "cache_miss": 78,
            "completion_tokens": 856,
            "reasoning_tokens": 342,
            "total_tokens": 4382,
            "cache_rate": 94.2,
        },
        "cost": {
            "input_full": 0.0218,
            "input_cached": 0.0359,
            "output": 0.0753,
            "total": 0.133,
        },
        "history": [
            {"period": "今天", "sessions": 3, "cost": "¥0.42"},
            {"period": "昨天", "sessions": 5, "cost": "¥0.78"},
            {"period": "本周", "sessions": 18, "cost": "¥2.14"},
            {"period": "本月", "sessions": 62, "cost": "¥8.45"},
        ]
    }))
}
