//! # Progress Tracker — Real-time multi-agent execution monitoring
//!
//! Provides a shared, thread-safe progress tracker that the desktop frontend
//! can query to display real-time status of multi-agent orchestration.

use crate::swarm::SwarmConfig;
use crate::types::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::time::Instant;

/// Overall orchestration status.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OrchStatus {
    /// No orchestration running.
    Idle,
    /// Planning phase — decomposing goal into actions.
    Planning,
    /// Executing actions via swarm workers.
    Executing,
    /// All actions completed successfully.
    Completed,
    /// Orchestration failed.
    Failed(String),
}

/// Progress snapshot for a single action/task.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionProgress {
    pub action_id: String,
    pub name: String,
    pub description: String,
    pub status: ActionStatus,
    pub assigned_to: Option<String>,
    pub started_at: Option<u64>,
    pub completed_at: Option<u64>,
    pub output_summary: Option<String>,
    pub retry_count: u32,
}

/// Full orchestration progress report — serializable for the frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrchProgressReport {
    pub status: OrchStatus,
    pub goal: Option<String>,
    pub total_actions: usize,
    pub completed_actions: usize,
    pub failed_actions: usize,
    pub in_progress_actions: usize,
    pub elapsed_secs: f64,
    pub actions: Vec<ActionProgress>,
    pub model_routing: ModelRoutingInfo,
}

/// Model routing info for the frontend display.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelRoutingInfo {
    pub planner_model: String,
    pub worker_model: String,
    pub thinking_enabled: bool,
    pub reasoning_effort: String,
}

/// Thread-safe progress tracker shared between the orchestration engine
/// and the desktop frontend (via Tauri commands).
#[derive(Clone)]
pub struct ProgressTracker {
    inner: Arc<RwLock<TrackerState>>,
}

struct TrackerState {
    status: OrchStatus,
    goal: Option<String>,
    actions: HashMap<String, ActionProgress>,
    action_order: Vec<String>,
    start_time: Option<Instant>,
    model_routing: ModelRoutingInfo,
}

impl ProgressTracker {
    /// Create a new idle progress tracker.
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(TrackerState {
                status: OrchStatus::Idle,
                goal: None,
                actions: HashMap::new(),
                action_order: Vec::new(),
                start_time: None,
                model_routing: ModelRoutingInfo {
                    planner_model: "deepseek-v4-pro".into(),
                    worker_model: "deepseek-v4-flash".into(),
                    thinking_enabled: true,
                    reasoning_effort: "high".into(),
                },
            })),
        }
    }

    /// Begin a new orchestration run.
    pub fn start(&self, goal: &str, config: &SwarmConfig) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        state.status = OrchStatus::Planning;
        state.goal = Some(goal.to_string());
        state.actions.clear();
        state.action_order.clear();
        state.start_time = Some(Instant::now());
        state.model_routing = ModelRoutingInfo {
            planner_model: config.model_routing.planner_model.clone(),
            worker_model: config.model_routing.worker_model.clone(),
            thinking_enabled: config.thinking_enabled,
            reasoning_effort: config.reasoning_effort.clone(),
        };
    }

    /// Register actions from a plan.
    pub fn register_plan(&self, plan: &Plan) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        state.status = OrchStatus::Executing;
        for action in &plan.actions {
            let progress = ActionProgress {
                action_id: action.id.clone(),
                name: action.name.clone(),
                description: action.description.clone(),
                status: ActionStatus::Pending,
                assigned_to: None,
                started_at: None,
                completed_at: None,
                output_summary: None,
                retry_count: 0,
            };
            state.action_order.push(action.id.clone());
            state.actions.insert(action.id.clone(), progress);
        }
    }

    /// Mark an action as in-progress.
    pub fn mark_started(&self, action_id: &str, assigned_to: &str) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        if let Some(action) = state.actions.get_mut(action_id) {
            action.status = ActionStatus::InProgress;
            action.assigned_to = Some(assigned_to.to_string());
            action.started_at = Some(now_epoch());
        }
    }

    /// Mark an action as completed with output.
    pub fn mark_completed(&self, action_id: &str, output: &str) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        if let Some(action) = state.actions.get_mut(action_id) {
            action.status = ActionStatus::Completed;
            action.completed_at = Some(now_epoch());
            action.output_summary = Some(
                if output.len() > 200 { format!("{}…", &output[..200]) } else { output.to_string() },
            );
        }
    }

    /// Mark an action as failed.
    pub fn mark_failed(&self, action_id: &str, reason: &str) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        if let Some(action) = state.actions.get_mut(action_id) {
            action.status = ActionStatus::Failed(reason.to_string());
            action.completed_at = Some(now_epoch());
        }
    }

    /// Record a retry for an action.
    pub fn record_retry(&self, action_id: &str) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        if let Some(action) = state.actions.get_mut(action_id) {
            action.retry_count += 1;
            action.status = ActionStatus::InProgress;
        }
    }

    /// Mark the entire orchestration as completed.
    pub fn finish(&self) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        let has_failures = state.actions.values().any(|a| matches!(a.status, ActionStatus::Failed(_)));
        state.status = if has_failures {
            OrchStatus::Failed("some actions failed".into())
        } else {
            OrchStatus::Completed
        };
    }

    /// Reset to idle state.
    pub fn reset(&self) {
        let mut state = self.inner.write().unwrap_or_else(|e| e.into_inner());
        state.status = OrchStatus::Idle;
        state.goal = None;
        state.actions.clear();
        state.action_order.clear();
        state.start_time = None;
    }

    /// Generate a progress report for the frontend.
    pub fn report(&self) -> OrchProgressReport {
        let state = self.inner.read().unwrap_or_else(|e| e.into_inner());
        let elapsed = state.start_time.map(|s| s.elapsed().as_secs_f64()).unwrap_or(0.0);

        let actions: Vec<ActionProgress> = state
            .action_order
            .iter()
            .filter_map(|id| state.actions.get(id).cloned())
            .collect();

        let completed = actions.iter().filter(|a| a.status == ActionStatus::Completed).count();
        let failed = actions.iter().filter(|a| matches!(a.status, ActionStatus::Failed(_))).count();
        let in_progress = actions.iter().filter(|a| a.status == ActionStatus::InProgress).count();

        OrchProgressReport {
            status: state.status.clone(),
            goal: state.goal.clone(),
            total_actions: actions.len(),
            completed_actions: completed,
            failed_actions: failed,
            in_progress_actions: in_progress,
            elapsed_secs: (elapsed * 10.0).round() / 10.0,
            actions,
            model_routing: state.model_routing.clone(),
        }
    }
}

impl Default for ProgressTracker {
    fn default() -> Self {
        Self::new()
    }
}

fn now_epoch() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tracker_lifecycle() {
        let tracker = ProgressTracker::new();
        assert_eq!(tracker.report().status, OrchStatus::Idle);

        let config = SwarmConfig::default();
        tracker.start("Build a REST API", &config);
        assert_eq!(tracker.report().status, OrchStatus::Planning);
        assert_eq!(tracker.report().goal.as_deref(), Some("Build a REST API"));

        // Register a plan
        let plan = Plan {
            id: "p1".into(),
            goal: Goal { description: "Build a REST API".into(), constraints: vec![], criteria: vec![] },
            actions: vec![
                Action {
                    id: "a1".into(), name: "create_schema".into(),
                    description: "Create DB schema".into(), preconditions: vec![],
                    effects: vec![], cost: 1.0, tool: None, tool_args: None,
                    delegatable: true, status: ActionStatus::Pending,
                },
                Action {
                    id: "a2".into(), name: "write_tests".into(),
                    description: "Write integration tests".into(), preconditions: vec![],
                    effects: vec![], cost: 2.0, tool: None, tool_args: None,
                    delegatable: true, status: ActionStatus::Pending,
                },
            ],
            dependencies: HashMap::new(),
            status: PlanStatus::Draft,
            reasoning: None,
            usage: None,
        };
        tracker.register_plan(&plan);

        let report = tracker.report();
        assert_eq!(report.status, OrchStatus::Executing);
        assert_eq!(report.total_actions, 2);
        assert_eq!(report.completed_actions, 0);

        // Progress through actions
        tracker.mark_started("a1", "worker-1");
        assert_eq!(tracker.report().in_progress_actions, 1);

        tracker.mark_completed("a1", "Schema created successfully");
        assert_eq!(tracker.report().completed_actions, 1);

        tracker.mark_started("a2", "worker-2");
        tracker.mark_failed("a2", "test framework not found");
        assert_eq!(tracker.report().failed_actions, 1);

        tracker.finish();
        assert!(matches!(tracker.report().status, OrchStatus::Failed(_)));

        // Reset
        tracker.reset();
        assert_eq!(tracker.report().status, OrchStatus::Idle);
    }

    #[test]
    fn test_retry_tracking() {
        let tracker = ProgressTracker::new();
        let config = SwarmConfig::default();
        tracker.start("test", &config);

        let plan = Plan {
            id: "p1".into(),
            goal: Goal { description: "test".into(), constraints: vec![], criteria: vec![] },
            actions: vec![Action {
                id: "a1".into(), name: "flaky".into(),
                description: "Flaky action".into(), preconditions: vec![],
                effects: vec![], cost: 1.0, tool: None, tool_args: None,
                delegatable: true, status: ActionStatus::Pending,
            }],
            dependencies: HashMap::new(),
            status: PlanStatus::Draft,
            reasoning: None,
            usage: None,
        };
        tracker.register_plan(&plan);
        tracker.mark_started("a1", "w1");
        tracker.record_retry("a1");
        tracker.record_retry("a1");

        let report = tracker.report();
        assert_eq!(report.actions[0].retry_count, 2);
    }
}
