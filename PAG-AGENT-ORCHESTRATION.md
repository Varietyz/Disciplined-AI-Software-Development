<div align="center">

<img src="https://banes-lab.com/assets/images/banes_lab/700px_Main_Animated.gif" width="70" />

<a href="https://github.com/Varietyz/Disciplined-AI-Software-Development">Pattern Abstract Grammar Documentation</a> © 2025 by <a href="https://www.linkedin.com/in/jay-baleine/">Jay Baleine</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" width="16" height="16">

</div>

---

# PAG Orchestration Guide

Multi-agent orchestration coordinates sequential agent execution through shared documents, handoff signals, and validation gates. In this guide, I cover the patterns and structures I use for building orchestrations.

---

## 1. The Bookend Pattern

Every phase follows VERIFY → VALIDATE → ACTION → VERIFY structure. Verification agents wrap action agents to establish baseline before work and confirm results after.

### 8-Agent Phase Structure

| Position | Agent Role | Responsibility |
|----------|-----------|----------------|
| 1 | Entry Verifier | Documents baseline state, verifies prerequisites |
| 2 | Architecture Validator | Analyzes integration points, finds dependencies |
| 3 | Primary Implementer | Executes core implementation tasks |
| 4 | Refactor Specialist | Optimizes and migrates code |
| 5 | Compliance Agent | Applies architectural patterns (SRP/SOC) |
| 6 | Testing Agent | Validates implementation via test gates |
| 7 | Exit Validator | Analyzes post-implementation state |
| 8 | Completion Verifier | Verifies phase completion, creates handoff |

### Agent Documentation Rules

```
SET verification_agents = [1, 2, 7, 8]
SET action_agents = [3, 4, 5, 6]

FOR EACH agent IN verification_agents:
    WRITE findings TO shared_documents

FOR EACH agent IN action_agents:
    EXECUTE tasks
    SEND completion
```

**Why this separation matters:** Action agents are scoped to implementation tasks only. Verification agents are scoped to documentation tasks. This separation may reduce context pollution — action agent prompts omit documentation instructions, and verification agent prompts omit implementation instructions.

---

## 2. Shared Document Protocol

Orchestrations use a fixed set of documents that persist across all phases. The orchestrator pre-creates these before Phase 1 begins.

### Core Documents

| Document | Purpose | Updated By |
|----------|---------|------------|
| `prerequisite-status` | Baseline state, phase prerequisites, readiness reports | Entry/Exit verifiers |
| `implementation-log` | Chronological actions, file modifications, test results | Verification agents |
| `architecture-decisions` | Choices, rationale, pre/post architecture states | Architecture validators |
| `integration-points` | Traced relationships, import paths, dependencies | Architecture validators |
| `validation-results` | Gate results, test outcomes, failure analysis | Exit validators |
| `workflow-state` | Current phase/agent, blockers, handoff context | All verification agents |

### Document Lifecycle

```
SET document_lifecycle = "orchestrator-creates-agents-refine"

SET phase_0_action = "orchestrator pre-creates empty documents"
SET phase_n_action = "agents read existing content, edit in-place"
```

### Single Source of Truth

All agents reference the same documents. There are no agent-specific copies that could drift out of sync.

```
SET single_source_of_truth = true
SET workspace_sharing_mode = "all-agents-same-documents"
```

---

## 3. Phase Dependencies

Phases execute sequentially. Each phase declares prerequisites that must pass before execution begins.

### Dependency Declaration

```
DECLARE phase_1: object
SET phase_1.prerequisite = "Phase 0 complete"
SET phase_1.verify_before_start = [
    "Foundation components operational",
    "Helper utilities functional",
    "Core module restored"
]

DECLARE phase_2: object
SET phase_2.prerequisite = "Phase 1 complete"
SET phase_2.verify_before_start = [
    "Feature layer available",
    "Validation scoring operational"
]
```

### Entry Verification Pattern

The first agent of each phase (Entry Verifier) checks prerequisites:

```
READ workflow_state FROM previous_phase
VERIFY phase_0_validation_gate_passed
VERIFY foundation_components_available
VERIFY helper_utilities_functional

IF prerequisites_not_satisfied:
    WRITE blockers TO workflow_state
    SEND "PAUSE_FOR_USER"
ELSE:
    WRITE phase_1_baseline TO prerequisite_status
    SEND "ACTIVATE_NEXT_AGENT"
```

---

## 4. Agent Type Registry

Map logical role names to concrete agent implementations. This decouples workflows from specific agents — update the registry once rather than every workflow.

### Registry Definition

```
DECLARE agent_types: object

SET agent_types.entry_verifier = "your-verifier-agent"
SET agent_types.architecture_validator = "your-tracer-agent"
SET agent_types.primary_implementer = "your-implementer-agent"
SET agent_types.refactor_specialist = "your-refactor-agent"
SET agent_types.compliance_agent = "your-compliance-agent"
SET agent_types.testing_agent = "your-testing-agent"
SET agent_types.exit_validator = "your-tracer-agent"
SET agent_types.completion_verifier = "your-verifier-agent"
```

### Sequence Pattern

```
DECLARE agent_sequence_pattern: array

SET agent_sequence_pattern = [
    agent_types.entry_verifier,
    agent_types.architecture_validator,
    agent_types.primary_implementer,
    agent_types.refactor_specialist,
    agent_types.compliance_agent,
    agent_types.testing_agent,
    agent_types.exit_validator,
    agent_types.completion_verifier
]
```

Note: Entry verifier and completion verifier use the same agent type. Architecture validator and exit validator use the same agent type. The bookend pattern reuses verification agents at phase boundaries.

---

## 5. Handoff Signal Structure

When an agent completes, it emits a structured handoff signal. The orchestrator reads this to determine next action.

### Signal Format

```
DECLARE handoff_signal: object

SET handoff_signal.agent_completed = "architecture-validator"
SET handoff_signal.agent_phase = "1-validate-entry"
SET handoff_signal.artifacts_location = "{shared_zone}/{workflow_name}/"
SET handoff_signal.orchestrator_action = "ACTIVATE_NEXT_AGENT"

SET handoff_signal.handoff_context = {
    "phase_status": "complete",
    "validation_gates_passed": true,
    "critical_files": ["src/module.ts:142", "src/utils.ts:89"],
    "key_findings": ["12 components use helper()", "0 circular dependencies"],
    "blockers": []
}
```

### Orchestrator Actions

| Signal | Behavior | User Interaction |
|--------|----------|------------------|
| `ACTIVATE_NEXT_AGENT` | Execute next agent in sequence | None — automatic |
| `PAUSE_FOR_USER` | Present findings, wait for approval | Required |
| `WORKFLOW_COMPLETE` | Present final summary | None — workflow finished |

### Context Passing

The handoff context becomes input for the next agent:

```
WHEN handoff_signal_received:
    IF orchestrator_action === "ACTIVATE_NEXT_AGENT":
        SET next_agent = agent_sequence[current_index + 1]
        SET next_prompt = {
            "phase": current_phase,
            "focus_points": next_agent.focus_points,
            "previous_findings": handoff_signal.handoff_context.key_findings,
            "critical_files": handoff_signal.handoff_context.critical_files
        }
        TASK next_agent.type WITH prompt: next_prompt
```

---

## 6. Verification Failure Protocol

Failures don't halt the workflow immediately. They propagate through handoff context so verification agents can assess and document.

### Failure Flow

```
WRITE failure_details TO validation_results
SET failure_details.tests = failed_tests
SET failure_details.errors = error_messages
SET failure_details.files = involved_files

WRITE blocker TO workflow_state
SET blocker.nature = blocker_type
SET blocker.severity = severity_assessment

SEND completion WITH validation_gates_passed = false

READ validation_results
ANALYZE execution
FIND root_cause IN execution_trace
WRITE trace_findings TO validation_results

READ failure_context
READ analysis_results
VERIFY phase_completion_status

WRITE incomplete_phase_state TO workflow_state
CREATE handoff WITH failure_context
```

### Failure Handoff

```
SET handoff_signal.handoff_context = {
    "phase_status": "incomplete",
    "validation_gates_passed": false,
    "critical_files": ["src/module.ts:142"],
    "key_findings": ["Test failures in feature detection"],
    "blockers": ["Component X does not inherit required data from Component Y"],
    "issues_noted": ["Requires investigation in Phase 2"]
}
```

**Why failures propagate:** Stopping immediately loses context. By flowing failures through verification agents, the workflow documents root cause analysis and creates actionable handoff notes.

---

## 7. Final Summary Pattern

The last agent in a workflow generates a comprehensive summary with four categories.

### Summary Structure

```
DECLARE final_summary: object

SET final_summary.gap_analysis = [
    "List functionality planned but not implemented",
    "Document blockers preventing implementation",
    "Identify architectural gaps requiring attention"
]

SET final_summary.delivered = [
    "List successfully implemented components",
    "Document validation gate pass/fail status",
    "Quantify implementation completeness (percentage)"
]

SET final_summary.already_implemented = [
    "List pre-existing functionality discovered during workflow",
    "Document components that did not require implementation",
    "Identify divergences between plans and actual codebase"
]

SET final_summary.recommendations = [
    "Next steps for completing gaps",
    "Known issues requiring attention",
    "Future enhancement opportunities",
    "Architectural improvements suggested"
]
```

### Final Agent Scope

```
READ shared_documents
VERIFY all_phases_complete

ANALYZE gaps
FIND planned_tasks NOT IN completed_tasks
FIND blocked_tasks WITH reasons

FIND components WHERE validation_gates_passed === true INTO delivered_components
SET delivered.completion_percentage = completion_percentage
WRITE delivered TO final_summary

FIND discoveries WHERE implementation_not_required INTO already_implemented_discoveries
FIND divergences FROM original_plan INTO already_implemented_divergences
WRITE already_implemented TO final_summary

FIND remaining_gaps BY impact INTO recommendations_gaps
FIND known_issues WITH severity INTO recommendations_issues
CREATE recommendations

WRITE final_summary TO workflow_state
SEND "WORKFLOW_COMPLETE"
```

---

## 8. Building an Orchestration

Here's my step-by-step process for creating a new orchestration.

### Step 1: Define the Goal

```
%% META %%:
intent: What the orchestration accomplishes
objective: Specific deliverables
context: Dependencies and constraints
priority: high | medium | low
```

### Step 2: Break into Phases

Each phase should have:
- Clear entry prerequisites
- Defined scope (what gets implemented)
- Exit criteria (validation gates)
- Handoff to next phase

```
DECLARE phases: array

SET phases[0] = {
    "name": "Foundation",
    "focus": "Establish base infrastructure",
    "prerequisites": [],
    "success_criteria": ["Component A operational", "Tests passing"]
}

SET phases[1] = {
    "name": "Integration",
    "focus": "Connect components",
    "prerequisites": ["Phase 0 complete"],
    "success_criteria": ["End-to-end flow working"]
}
```

### Step 3: Assign Agent Types

Map the 8-agent pattern to your specific needs:

```
FOR EACH phase IN phases:
    SET phase.agents = [
        { position: 1, type: "verifier", task: "VERIFY prerequisites" },
        { position: 2, type: "tracer", task: "FIND integration_points" },
        { position: 3, type: "implementer", task: "CREATE components" },
        { position: 4, type: "refactor", task: "EXECUTE optimization" },
        { position: 5, type: "compliance", task: "VALIDATE patterns" },
        { position: 6, type: "tester", task: "VALIDATE implementation" },
        { position: 7, type: "tracer", task: "VERIFY implementation" },
        { position: 8, type: "verifier", task: "VERIFY completion" }
    ]
```

### Step 4: Define Shared Documents

Create purpose-specific documents:

```
DECLARE core_documents: array

SET core_documents = [
    { name: "prerequisite-status", purpose: "Track phase prerequisites" },
    { name: "implementation-log", purpose: "Chronological action record" },
    { name: "architecture-decisions", purpose: "Rationale and trade-offs" },
    { name: "integration-points", purpose: "Dependencies and relationships" },
    { name: "validation-results", purpose: "Test outcomes and gate status" },
    { name: "workflow-state", purpose: "Current progress and handoff context" }
]
```

### Step 5: Define Validation Gates

Each agent definition requires explicit success criteria:

```
SET agent_3.validation_gates = [
    "Component A created",
    "Unit tests passing",
    "No circular dependencies introduced"
]
```

### Step 6: Define Handoff Signals

Specify what context passes between agents:

```
SET handoff_template = {
    "agent_completed": "{agent_name}",
    "phase_status": "complete | incomplete",
    "validation_gates_passed": true | false,
    "critical_files": [],
    "key_findings": [],
    "blockers": []
}
```

### Step 7: Define Final Summary

Specify what the last agent produces:

```
SET final_summary_sections = [
    "gap_analysis",
    "delivered",
    "already_implemented",
    "recommendations"
]
```

---

## 9. Orchestration Principles

These are guidelines I've extracted from working orchestrations.

### Document Management

- Orchestrator pre-creates documents before agents run
- Agents edit in-place, never create new versions
- Single source of truth — no local copies
- Surgical edits to specific sections, not full overwrites

### Agent Separation

- Verification agents are scoped to documentation; action agents are scoped to implementation
- Each agent reads shared documents before starting
- Each agent signals completion with structured handoff
- Failures propagate through verification agents for assessment

### Phase Boundaries

- Entry verifier checks prerequisites before phase begins
- Exit verifier assesses completion before handoff
- Phases are sequential — no parallel phase execution
- Later phases can reference artifacts from earlier phases

### Failure Handling

- Failures don't halt immediately
- Document failure → trace root cause → assess impact
- Handoff includes failure context for next phase
- Critical blockers trigger PAUSE_FOR_USER

### Context Preservation

- Handoff signals preserve findings between agents
- Workflow-state tracks current position for resumption
- All documents persist in shared zone for cross-session access
- Final summary captures comprehensive workflow outcome

---

## 10. Example: Minimal 2-Phase Orchestration

A simplified example showing the core structure.

```
SET artifact_base_path = "{shared_zone}/feature-x/"

DECLARE core_documents: array
SET core_documents = [
    "prerequisite-status.md",
    "implementation-log.md",
    "validation-results.md",
    "workflow-state.md"
]

VERIFY baseline_state
WRITE prerequisites TO prerequisite_status
SEND completion

ANALYZE existing_integration_points
FIND dependencies
SEND completion

CREATE foundation_components
SEND completion

EXECUTE optimization FOR consistency
SEND completion

EXECUTE architectural_patterns
SEND completion

VERIFY implementation_correctness
WRITE results TO validation_results
SEND completion

VERIFY phase_0_completion
CREATE phase_1_handoff
SEND completion

ANALYZE gaps
WRITE delivered TO final_summary
WRITE already_implemented TO final_summary
CREATE recommendations
SEND "WORKFLOW_COMPLETE"
```

---

## 11. Semantic File Extensions

Documents use semantic extensions to indicate their purpose. This aims to provide explicit signals for document type identification.

| Extension | Purpose | Example |
|-----------|---------|---------|
| `.agent-context.md` | Agent-specific context, logs, handoff data | `implementation-log.agent-context.md` |
| `.audit-report.md` | Verification results, compliance reports | `validation-results.audit-report.md` |
| `.task-checklist.md` | Progress tracking, workflow state | `workflow-state.task-checklist.md` |

### Document Naming Rules

```
FOR EACH document IN documents:
    VERIFY document.purpose !== ""
    VERIFY document.name NOT MATCHES /^(output|results|data)\./
    VERIFY document MATCHES semantic_naming_convention
```

**Good names:**
- `prerequisite-status.agent-context.md`
- `architecture-decisions.audit-report.md`
- `integration-points.task-checklist.md`

**Bad names:**
- `output.md`
- `results.md`
- `data.json`

---

## 12. Dynamic Phase Delegation

Orchestrations can check workflow state and skip completed phases. This enables resumption after interruption.

### Phase Completion Check

```
READ artifact_base_path + "/workflow-state.task-checklist.md" INTO workflow_state
EXTRACT workflow_state.completed_phases INTO completed_phases
EXTRACT workflow_state.current_phase INTO current_phase

IF phase_0.phase_id NOT IN completed_phases:
    EXECUTE phase_0_workflow.workflow_file
ELSE:
    MARK phase_0 AS "COMPLETED"
    GOTO next_phase

IF phase_1.phase_id NOT IN completed_phases:
    VERIFY phase_0.phase_id IN completed_phases
    EXECUTE phase_1_workflow.workflow_file
ELSE:
    MARK phase_1 AS "COMPLETED"
```

### Phase Workflow Objects

Each phase is defined as an object with metadata:

```
DECLARE phase_1_workflow: object

SET phase_1_workflow.workflow_file = "workflows/phase-1-workflow.pag.md"
SET phase_1_workflow.artifact_path = shared_zone + "/phase-1-artifacts"
SET phase_1_workflow.agent_range = "9-16"
SET phase_1_workflow.focus = "Core Feature Implementation"
SET phase_1_workflow.prerequisite = phase_0_workflow.workflow_file
SET phase_1_workflow.phase_id = "phase-1"
```

This structure enables:
- Resumption from any phase
- Prerequisite verification before phase start
- Clear artifact locations per phase
- Modular workflow files

---

## 13. Agent Type Definitions

Define agent types with full metadata for documentation and orchestrator reference.

### Agent Type Object

```
DECLARE agent_types: object

SET agent_types["entry-verifier"] = {
    "type": "entry-verifier",
    "role": "VERIFICATION + DOCUMENTATION",
    "positions": [1, 8],
    "methodology": "Prerequisite verification and baseline documentation",
    "responsibilities": [
        "Verify baseline state and prerequisites",
        "Document current state in shared documents",
        "Generate handoff context for next phase or final summary"
    ]
}

SET agent_types["architecture-validator"] = {
    "type": "architecture-validator",
    "role": "VALIDATION + DOCUMENTATION",
    "positions": [2, 7],
    "methodology": "Execution path tracing",
    "responsibilities": [
        "Validate architecture and integration points",
        "Map execution flows and dependencies",
        "Document trace findings and verification results"
    ]
}

SET agent_types["primary-implementer"] = {
    "type": "primary-implementer",
    "role": "ACTION (no documentation)",
    "positions": [3],
    "methodology": "Evidence-based implementation",
    "responsibilities": [
        "Implement core functionality",
        "Execute primary implementation tasks",
        "Signal completion only (no documentation)"
    ]
}
```

### Role Types

| Role | Positions | Documents? | Purpose |
|------|-----------|------------|---------|
| VERIFICATION + DOCUMENTATION | 1, 8 | Yes | Baseline/completion verification |
| VALIDATION + DOCUMENTATION | 2, 7 | Yes | Architecture tracing |
| ACTION (no documentation) | 3, 4, 5, 6 | No | Implementation only |

---

## 14. Orchestration Invariants (ALWAYS/NEVER Rules)

Define invariants that must hold throughout the orchestration.

### Document Rules

```
ALWAYS READ workspace_config FROM config_file
ALWAYS SET artifact_paths FROM workspace_zones
ALWAYS CREATE shared_documents BEFORE phase_0
ALWAYS EDIT documents IN_PLACE
NEVER CREATE new_document_versions
NEVER WRITE duplicate_findings TO documents
NEVER SET document.name MATCHES /^(output|results|data)\./
```

### Agent Rules

```
ALWAYS EXECUTE agents WITH TASK tool
NEVER EXECUTE agent_simulation IN orchestrator
ALWAYS VERIFY agent_sequence_pattern
ALWAYS WRITE findings FROM verification_agents
NEVER WRITE findings FROM action_agents
ALWAYS APPEND handoff_context TO agent_signal
NEVER GOTO next_agent WITHOUT validation_gate
```

### Phase Rules

```
ALWAYS VERIFY prerequisites BEFORE phase_start
ALWAYS WRITE failures TO workflow-state BEFORE handoff
ALWAYS CREATE final_summary FROM last_agent
NEVER GOTO next_phase WITHOUT phase_completion_verification
ALWAYS WRITE artifacts TO shared_zone
```

### Policy Rules

```
ALWAYS ENFORCE zero_tech_debt_policy
ALWAYS ENFORCE zero_fallback_policy
ALWAYS ENFORCE zero_dual_path_policy
```

---

## 15. Alternative Orchestration Patterns

Beyond the standard bookend pattern, orchestrations can follow different structures depending on the task.

### Pattern A: Pipeline Enrichment

Each agent consumes artifacts from all previous agents and enriches them. Unlike the bookend pattern where verification agents handle documentation and action agents handle implementation, pipeline enrichment has every agent contributing to shared artifacts.

```
CREATE documentation WITH architecture_analysis
CREATE actions WITH recommended_changes
CREATE results WITH metrics
CREATE checklist WITH progress_tracking
SEND completion

READ artifacts
APPEND documentation WITH duplication_analysis
APPEND actions WITH pattern_migration_strategies
CREATE base_schematics
CREATE reusable_patterns
CREATE scalability_blueprints
APPEND checklist WITH pattern_validation_tasks
SEND completion

READ artifacts
APPEND documentation WITH responsibility_analysis
APPEND actions WITH compliance_justifications
VERIFY pattern_migrations AGAINST boundaries
APPEND checklist WITH compliance_tasks
SEND completion

READ artifacts
EXECUTE adversarial_review
APPEND documentation WITH risk_analysis
APPEND actions WITH mitigation_steps
WRITE verification_gates TO checklist
SEND completion

READ artifacts
FIND legacy_code FROM new_architecture
CREATE cleanup_checklist
SEND "WORKFLOW_COMPLETE"
```

**Key characteristics:**
- Artifacts grow richer with each agent
- Each agent has access to all previous findings
- Final agent creates cleanup checklist that must complete before implementation
- Two-checklist system: CLEANUP-CHECKLIST.md (old architecture removal) → CHECKLIST.md (new architecture implementation)

### Pattern B: INVESTIGATE → ACTION Cycle

Alternates between analysis phases and fix phases. The same agent type executes repeatedly, each time discovering gaps then fixing them.

```
EXTRACT claims FROM context
FOR EACH claim IN claims:
    VERIFY evidence
FIND gaps IN verification_results
WRITE gap_analysis

VERIFY environmental_assumptions
READ gap_analysis
REMOVE verified_items FROM gap_analysis
APPEND new_gaps TO gap_analysis
WRITE gap_analysis

EXECUTE security_tests
FIND vulnerabilities IN results
APPEND security_gaps TO gap_analysis
WRITE gap_analysis

RANK gaps BY priority
BACKUP working_copy TO versioned_backup
FOR EACH gap IN ranked_gaps:
    EXECUTE fix FOR gap
WRITE working_copy

VERIFY claims IN gap_analysis
EXECUTE test_suite
VERIFY gaps_resolved === true

EXECUTE deployment TO production
CREATE audit_trail
WRITE deployment_audit
```

**Key characteristics:**
- Single agent type throughout (self-recursive improvement)
- Alternating investigation and action phases
- Each investigation phase edits the same gap-analysis document
- Surgical document editing (remove outdated → add new)
- Versioning with backup before deployment

### Pattern C: Cleanup-First Implementation

Separates cleanup from implementation into two sequential workflows with a hard gate between them.

```
DECLARE cleanup_tasks: array
SET cleanup_tasks = [
    "FIND legacy_code FROM new_architecture",
    "FIND unused_code WITH empirical_testing",
    "FIND deprecations IN replacements",
    "ANALYZE fallbacks AGAINST requirements",
    "ANALYZE tech_debt",
    "VERIFY removal_safety",
    "REMOVE validated_code",
    "WRITE cleanup_results"
]

FOR EACH task IN cleanup_tasks:
    EXECUTE task
    MARK task AS "COMPLETED" IN cleanup_checklist

VERIFY cleanup_checklist === "100% complete"

IF cleanup_checklist !== "100% complete":
    STOP

DECLARE implementation_tasks: array
SET implementation_tasks = [
    "CREATE new_components",
    "EXECUTE integration WITH existing_system",
    "VERIFY edge_cases",
    "VERIFY architectural_compliance",
    "EXECUTE deployment"
]

FOR EACH task IN implementation_tasks:
    EXECUTE task
    MARK task AS "COMPLETED" IN checklist
```

**Key characteristics:**
- Implementation cannot start until cleanup finishes
- Clean slate principle — old architecture removed before new begins
- Two separate checklists with explicit dependency
- Reduces "ship of Theseus" problems where old and new code coexist

---

## 16. Workflow Templates

Orchestrations can be templated for reuse across different domains. Templates use parameter placeholders that get replaced during instantiation.

### Template Parameter Categories

| Category | Examples | Purpose |
|----------|----------|---------|
| **Workflow Identity** | `{{workflow_name}}`, `{{implementation_domain}}` | Names and identifiers |
| **Context Paths** | `{{config_file_path}}`, `{{checklist_phase_0_path}}` | File locations |
| **Agent Configuration** | `{{agent_type_1}}`, `{{agent_type_1_abbrev}}` | Agent types and abbreviations |
| **Phase Definitions** | `{{phase_0_title}}`, `{{phase_0_focus}}` | Phase metadata |
| **Agent Actions** | `{{phase_0_agent_1_verify_1}}` | Specific agent tasks |

### Template Parameter Example

```
---
name: {{workflow_name}}
type: multi-agent-implementation-workflow
description: {{phase_title}} execution through 8-agent orchestration
---

THIS WORKFLOW IMPLEMENTS {{phase_title}} through VERIFY → VALIDATE → ACTION → VERIFY pattern

%% META %%:
intent: Execute {{phase_title}} implementation
objective: {{phase_objective}}
context: Depends on {{prerequisite_phase}} completion
priority: high
```

### Array Parameters with Iteration

For repeating structures, templates use iteration syntax:

```
SET agent_1.focus_points = [
{{#EACH agent_1_focus_points}}
    "{{this}}"{{#unless @last}},{{/unless}}
{{/EACH}}
]
```

Provide arrays in the parameter set:
```
agent_1_focus_points: [
    "VERIFY: Phase 0 validation gate passed",
    "VERIFY: Foundation components available",
    "VERIFY: Helper utilities functional"
]
```

### Document Inheritance Between Phases

Single-phase workflows inherit documents from previous phases:

```
SET previous_phase_artifacts = shared_zone + "/{{previous_phase_artifact_name}}"

VERIFY {{prerequisite_phase}} complete FROM previous_phase_artifacts + "/workflow-state.task-checklist.md"

DECLARE core_documents: array
SET core_documents = [
    "prerequisite-status.agent-context.md",
    "implementation-log.agent-context.md",
    "architecture-decisions.audit-report.md",
    "integration-points.task-checklist.md",
    "validation-results.audit-report.md",
    "workflow-state.task-checklist.md"
]
```

Documents persist across phases — later phases read and edit documents from earlier phases.

### Phase Linking

Each phase defines its relationship to adjacent phases:

```
SET phase_1.prerequisite = "Phase 0"
SET phase_1.next_phase = "Phase 2"
SET phase_1.next_workflow_path = "workflows/phase-2-workflow.pag.md"
SET phase_1.previous_phase_artifact_name = "phase-0-artifacts"
```

### Immutable 8-Agent Pattern

The agent position pattern is fixed across all templates:

| Position | Role | Abbrev | Documents? |
|----------|------|--------|------------|
| 1 | Entry Verifier | ev | Yes |
| 2 | Architecture Validator | av | Yes |
| 3 | Primary Implementer | pi | No |
| 4 | Refactorer | rf | No |
| 5 | Compliance Enforcer | ce | No |
| 6 | Tester | ts | No |
| 7 | Exit Verifier | av | Yes |
| 8 | Completion Verifier | ev | Yes |

Pattern: `ev → av → pi → rf → ce → ts → av → ev`

This pattern is domain-agnostic — only the agent-specific tasks change between implementations.

---

## 17. Choosing an Orchestration Pattern

| Pattern | When to Use | Agent Count | Complexity |
|---------|-------------|-------------|------------|
| **Bookend (VERIFY→ACTION→VERIFY)** | Implementation tasks with clear phases | 8 per phase | Medium |
| **Pipeline Enrichment** | Analysis tasks building toward comprehensive report | 4-6 total | Medium |
| **INVESTIGATE→ACTION Cycle** | Self-improvement, iterative refinement | Single agent, multiple phases | Low |
| **Cleanup-First** | Refactoring, migration, technical debt | Two sequential workflows | High |

### Decision Guide

**Use Bookend when:**
- Building new functionality
- Multiple specialized agents with distinct roles
- Need verification at phase boundaries

**Use Pipeline Enrichment when:**
- Performing codebase analysis
- Each agent adds perspective to shared findings
- Output is documentation/recommendations (not code)

**Use INVESTIGATE→ACTION when:**
- Single domain of expertise
- Iterative improvement cycle
- Self-referential tasks (agent improving itself)

**Use Cleanup-First when:**
- Removing technical debt
- Migrating between architectures
- Old code must not coexist with new

---

## Summary

Orchestration coordinates multiple agents through:

**Core Concepts (Sections 1-10):**
1. **Bookend Pattern** — 8 agents per phase: verification wraps action
2. **Shared Documents** — Pre-created, edited in-place, single source of truth
3. **Phase Dependencies** — Sequential execution with explicit prerequisites
4. **Agent Registry** — Logical roles mapped to concrete implementations
5. **Handoff Signals** — Structured context passing between agents
6. **Failure Protocol** — Propagate through verification for assessment
7. **Final Summary** — Gap analysis, delivered, already-implemented, recommendations
8. **Building Process** — 7-step guide from goal to completion
9. **Orchestration Principles** — Document management, agent separation, failure handling
10. **Example** — Minimal 2-phase orchestration template

**Advanced Concepts (Sections 11-16):**
11. **Semantic Extensions** — `.agent-context.md`, `.audit-report.md`, `.task-checklist.md`
12. **Dynamic Delegation** — Phase completion check, resumption support
13. **Agent Type Definitions** — Role metadata, positions, responsibilities
14. **Invariants** — ALWAYS/NEVER rules for documents, agents, phases, policies
15. **Alternative Patterns** — Pipeline enrichment, INVESTIGATE→ACTION, cleanup-first
16. **Workflow Templates** — Parameter placeholders, iteration syntax, document inheritance

**Orchestration Patterns (Section 17):**
- **Bookend (VERIFY→ACTION→VERIFY)** — 8 agents per phase, verification wraps action
- **Pipeline Enrichment** — Each agent enriches artifacts from all previous agents
- **INVESTIGATE→ACTION Cycle** — Single agent alternates analysis and fix phases
- **Cleanup-First** — Two sequential workflows with hard gate between cleanup and implementation

The patterns range from single-agent cycles to multi-agent implementations with varying complexity. Choose based on task type: implementation (bookend), analysis (pipeline), self-improvement (cycle), or migration (cleanup-first).
