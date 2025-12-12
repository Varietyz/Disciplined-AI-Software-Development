<div align="center">

<img src="https://banes-lab.com/assets/images/banes_lab/700px_Main_Animated.gif" width="70" />

<a href="https://github.com/Varietyz/Disciplined-AI-Software-Development">Pattern Abstract Grammar Documentation</a> © 2025 by <a href="https://www.linkedin.com/in/jay-baleine/">Jay Baleine</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" width="16" height="16">

</div>

---

# AI Collaboration Guide

## How to Use This Guide

**Who this is for:** Developers integrating AI coding assistants into their workflows, whether setting up a new environment or refining an existing one.

**Prerequisites:** Familiarity with command-line tools, version control, and general software development practices. No prior experience with AI coding tools is required.

**Reading approach:** The document follows a sequential structure—introduction through troubleshooting. New users benefit from reading linearly. Experienced users can jump to specific sections as needed.

**Document structure:**

- Sections 1–2 establish context and constraints
- Sections 3–4 cover setup and configuration
- Section 5 covers daily operation patterns
- Section 6 covers maintenance and validation
- Section 7 addresses common issues

---

## Quick Start

For experienced users who want minimal setup:

1. Create `.claude/` directory at project root
2. Create `CLAUDE.md` with project context (architecture, conventions, key commands)
3. Run `claude` in your project directory
4. Start with a focused request: "Read the codebase structure and summarize the architecture"

Return to the full document when you need configuration details, troubleshooting, or advanced patterns.

---

## Section 1: Introduction

### What Is AI-Assisted Development

AI-assisted development uses language models as collaborative tools for software engineering tasks. The AI receives context about code, requirements, and constraints, then generates suggestions, implementations, or analysis based on that context.

This differs from traditional tooling. The AI processes natural language instructions, responds to project-specific conventions provided in context, and generates outputs for tasks that would otherwise require manual implementation. It operates within configured boundaries.

**How it works in practice:** You describe what you need—in natural language or structured format—and the AI generates code, identifies issues, or performs analysis. The AI reads files, executes commands (with permission), and produces artifacts. You review, verify, and iterate.

**What changes:** Development becomes conversational. Instead of writing everything manually, you direct an assistant that can handle implementation details while you focus on architecture and requirements. The quality of results may be influenced by communication clarity and environment configuration, though outcomes vary.

### What This Approach Covers

This methodology addresses collaborative workflows between humans and AI coding assistants. It covers workspace organization, configuration, daily operation patterns, validation tooling, and issue resolution.

The approach applies to projects using Claude Code CLI or similar AI development environments. The principles extend to other AI coding tools, though specific configuration details may differ.

**Core components:**

- Workspace structure that organizes context for AI consumption
- Configuration that defines permissions, commands, and automation
- Operation patterns that may improve daily work efficiency
- Validation tooling that detects architectural violations
- Troubleshooting approaches for common issues

**Role of PAG:** Throughout this methodology, PAG (Pattern Abstract Grammar) provides structured syntax for AI instructions. Where prose instructions may be interpreted variably, PAG offers explicit keywords, phases, and validation gates. This document references PAG patterns where they apply—see the main [PAG documentation](/pag?tab=guide) for complete syntax.

### Expected Outcomes

A configured workspace where AI assistance integrates with existing development workflows. May reduce repetition of context and instructions across sessions. Validation tooling that can catch violations before they accumulate. Structured patterns for multi-step and multi-agent work.

Results depend on configuration quality and consistent application. The approach requires upfront investment that may pay returns across subsequent work.

**What to expect initially:** Setup takes time. Writing memory files, configuring permissions, creating custom commands—this is front-loaded work. Early sessions may feel slower than working without AI as you establish patterns.

**What to expect long-term:** As configuration matures, sessions can become more efficient. The AI arrives with context already loaded. Common workflows execute through commands rather than repeated explanation. Validation catches issues automatically.

---

## Section 2: Constraints and Limitations

Understanding constraints prevents frustration and misaligned expectations. These are not flaws to work around—they are characteristics to design for.

### What AI Cannot Guarantee

AI systems are probabilistic. They do not guarantee exact compliance with instructions, deterministic outputs across invocations, or consistent behavior across different models. Outputs require verification.

**Specific limitations:**

- The AI cannot access information outside its context window
- It cannot verify claims about external systems without tooling
- It cannot guarantee generated code is correct without testing
- It may interpret ambiguous instructions differently across sessions
- It tends to drift from established patterns during long conversations

**Practical implication:** Treat AI output as a starting point, not a finished product. Verification is part of the workflow, not an optional step.

### Behavioral Boundaries

AI assistance works within defined boundaries. Permission systems control which files can be read or modified. Tool configurations limit available capabilities. System prompts shape but do not guarantee behavior.

These boundaries are protective, not restrictive. They prevent accidental modifications to sensitive files, enforce review requirements for critical operations, and maintain security posture during development.

**Why boundaries matter:** An AI with unrestricted access can make well-intentioned changes that cause problems—modifying configuration files, overwriting important data, or executing destructive commands. Boundaries create predictable operating parameters.

### Uncertainty Handling

When the AI cannot verify something empirically, or lacks confidence about an approach, this should be surfaced rather than hidden. Workspaces can establish conventions for uncertainty markers—visual indicators that flag areas needing clarification.

The principle extends to capability boundaries. When asked to do something outside verifiable capability, the appropriate response is to flag the limitation and suggest steps toward resolution rather than attempting to simulate competence.

**Recommended practice:** Configure the workspace to encourage explicit uncertainty. An AI that says "I'm not certain about this approach" is more useful than one that proceeds confidently into error.

### Context Limitations

AI context windows have finite capacity. Large codebases cannot be processed entirely in a single interaction. Long conversations accumulate context that may dilute focus on current tasks.

**What this means in practice:**

- The AI may "forget" earlier parts of long conversations
- Large files may not fit entirely in context
- Complex multi-file changes require careful staging
- Session breaks can reset accumulated understanding

Workspace organization addresses this through structure. Relevant information lives in predictable locations. The AI can be directed to specific files rather than searching broadly. Shared documents persist state across context boundaries.

---

## Section 3: Transport and Storage

### Migrating Workspace Configurations

Workspace configurations can be moved between machines or environments. The .claude/ directory contains all project-specific settings, commands, agents, and hooks. Copy this directory to transfer configuration to a new environment.

Memory files (CLAUDE.md) should accompany the codebase. When version controlled with the project, they migrate automatically with git clone or similar operations.

Personal settings in .claude/settings.local.json should not be migrated—these contain machine-specific or user-specific configurations that may not apply elsewhere.

### Backing Up Configuration

Before major changes to workspace configuration, preserve the current state. Copy the .claude/ directory to a backup location. Include CLAUDE.md files at all levels (project root, subdirectories).

Version control provides implicit backup for shared configuration. Each commit preserves the configuration state at that point. Personal settings require separate backup procedures since they are typically git-ignored.

### Sharing Configuration

Workspace configuration can be shared through version control. The .claude/ directory (excluding settings.local.json) and CLAUDE.md files can be committed to the repository.

When someone clones the repository, they receive the configuration automatically. Updates to shared configuration propagate through normal git workflows—pull to receive, commit and push to distribute.

Document any manual setup steps that cannot be captured in configuration files. Environment variables, external tool installations, or MCP server authentication may require additional steps beyond cloning.

### Preserving State Before Upgrades

Before upgrading Claude Code or related tooling, document the current working state. Note which features are in use, which configurations are critical, and which workflows depend on specific behavior.

Export or backup custom commands, agents, and hooks. These may require adjustment after upgrades if APIs or configuration formats change.

Test upgraded environments against documented workflows before full migration. Verify that critical operations still function as expected.

---

## Section 4: Workspace Setup and Configuration

### Prerequisites and Dependencies

Before setup, ensure the following are installed:

- **Node.js** (v18 or later) — required for Claude Code CLI
- **Claude Code CLI** — install via `npm install -g @anthropic-ai/claude-code`
- **Git** — for version control of configuration
- **API access** — valid Anthropic API key or Claude Pro/Team subscription

Verify installation by running `claude --version` in your terminal.

### The .claude/ Directory

Claude Code reads configuration from the .claude/ directory within projects. This directory contains settings, custom commands, agent definitions, and automation hooks.

Create this directory at the project root. Add it to version control to share configuration across machines or with others. Use .claude/settings.local.json for personal settings that should not be shared.

### Memory Files

The CLAUDE.md file serves as project memory for AI interactions. When Claude Code starts, it automatically loads this file, providing immediate context.

Place CLAUDE.md at the project root or in .claude/. Include architecture decisions, coding conventions, important file locations, and build commands. Keep content concise and actionable—describe what to do and where to find things.

**Structuring memory files with PAG:** Memory files can use PAG syntax to provide structured instructions. Structured formats may reduce ambiguity compared to prose, though processing consistency is not guaranteed. ALWAYS/NEVER blocks define behavioral boundaries. Phase structures organize multi-step workflows. Validation gates specify success criteria. See the [PAG Guide](/pag?tab=guide) for syntax patterns.

**Example:** A memory file using PAG structure in `CLAUDE.md`:

```
# Project: MyApp

THIS INSTRUCTION DEFINES workspace conventions for MyApp development.

## Architecture
- Frontend: React + TypeScript in /src/components
- Backend: Node.js + Express in /src/api
- Tests: Jest in /tests, run with `npm test`

## Build Commands
- Development: `npm run dev`
- Production: `npm run build`
- Lint: `npm run lint:fix`

ALWAYS:
- Run tests before committing changes
- Use TypeScript strict mode
- Follow existing naming conventions

NEVER:
- Modify /src/config/production.json directly
- Commit .env files
- Skip type definitions
```

Memory files follow a hierarchy: broader policies take precedence over project files, which take precedence over personal preferences. This allows layered configuration where project-level settings can be overridden or extended.

### Permission Configuration

The settings.json file defines permissions for tool access. Configure permissions for known safe operations to reduce friction during development while maintaining security boundaries.

Permission rules follow patterns: allow all git commands, permit npm scripts, enable reading from source directories. Sensitive operations like pushing to remote repositories can require explicit confirmation even when other git operations are allowed.

**Example:** Permission configuration in `.claude/settings.json`:

```json
{
    "permissions": {
        "allow": [
            "Read(**)",
            "Glob(**)",
            "Grep(**)",
            "Bash(npm run:*)",
            "Bash(npm test:*)",
            "Bash(git status:*)",
            "Bash(git diff:*)",
            "Bash(git log:*)"
        ],
        "deny": ["Read(.env*)", "Read(**/secrets/**)", "Bash(rm -rf:*)"]
    }
}
```

**Permission patterns:**

- `Read(**)` — allow reading any file
- `Bash(npm run:*)` — allow any npm run command
- `Bash(git:*)` — allow all git commands
- Deny rules take precedence over allow rules

### Workspace Zones

Organize the workspace into zones with different access patterns. Zones are conceptual organizational patterns implemented through folder structure and permission rules.

**Example zone structure:**

```
project-root/
├── <config-dir>/               # Configuration (shared)
├── <workspace-dir>/            # AI working area
│   ├── <shared-zone>/          # Shared zone: any agent reads/writes
│   │   ├── findings.md         # Accumulated discoveries
│   │   └── decisions.md        # Architectural decisions
│   ├── <owner-zone>/           # Owner zone: work-in-progress
│   │   └── current-task.md     # Active task state
│   └── <readonly-zone>/        # Read-only zone: protected templates
│       └── checklist.md        # Standard templates
├── <source-dir>/               # Source code
└── <docs-dir>/                 # Documentation
```

**Zone types:**

- **Shared zone** — Any agent can read and write; used for accumulated knowledge and handoff artifacts
- **Owner zone** — Individual work-in-progress; cleared between tasks
- **Read-only zone** — Protected templates and architectural decisions; requires explicit permission to modify

This organization serves both human and AI needs. Humans can find information in predictable locations. AI systems operate within defined boundaries. Critical documents remain protected from accidental modification.

### Custom Slash Commands

Repetitive prompts become slash commands. A code review workflow becomes /review. A deployment checklist becomes /deploy. Commands are markdown files in .claude/commands/ with optional frontmatter for configuration.

The command content is the prompt itself, with placeholders for arguments. Commands can include shell execution for dynamic context—a review command might run git diff before the AI sees the prompt.

**Example:** A simple review command in `.claude/commands/review.md`:

```
---
description: Review recent changes for code quality
---
Review the recent git changes for:
- Code style consistency
- Potential bugs or edge cases
- Missing error handling

Recent changes: !git diff --staged
```

Commands can be shared through version control. Sharing command files makes workflows reusable across projects or machines.

### Custom Agents

Specialized agents handle specific task types. A code reviewer agent applies configured review criteria. A debugger agent uses systematic investigation methodology. A documentation agent generates project-appropriate documentation.

Agents are markdown files in .claude/agents/ with system prompts and tool configurations. The system prompt defines the agent's approach. Tool configurations limit available capabilities—a reviewer might only need read access.

**Defining agents with PAG:** Agent system prompts can benefit from PAG structure. The document declaration (THIS AGENT PERFORMS...) establishes purpose. Phased instructions guide the agent through systematic workflows. ALWAYS/NEVER constraints define behavioral boundaries. Validation gates aim to verify each phase completes before proceeding. See [PAG Templates](/pag?tab=templates) for agent definition patterns.

**Example:** A code reviewer agent in `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Reviews code changes for quality, security, and consistency
tools: Read, Glob, Grep
---

THIS AGENT PERFORMS systematic code review.

# PHASE 1: Discovery

READ recent changes via git diff
IDENTIFY modified files and their purposes

VALIDATION GATE:
✅ All changed files identified
✅ Change scope understood

# PHASE 2: Analysis

FOR EACH modified file:
CHECK code style consistency
CHECK error handling completeness
CHECK security implications
APPEND findings TO review_notes

# PHASE 3: Report

CREATE summary of findings
CATEGORIZE by severity: critical, warning, suggestion
REPORT review_notes

ALWAYS:

- Cite specific line numbers
- Explain why something is problematic
- Suggest concrete fixes

NEVER:

- Approve without reviewing all changes
- Ignore security-related modifications
```

**Invoking agents:** Use explicit invocation with "use the code-reviewer agent" or let Claude delegate automatically when a task matches an agent's description. Agents can also be invoked via slash commands that reference them.

### Hooks

Hooks execute shell commands at specific points in the AI workflow. They run deterministically when trigger conditions match—the shell command executes regardless of AI state, providing predictable automation that does not depend on prompt compliance.

**Available hook events:**

- `PreToolUse` — Before a tool executes; can block execution
- `PostToolUse` — After a tool completes; for formatting, logging, validation
- `Notification` — When Claude sends a notification
- `Stop` — When Claude completes a response

Post-edit hooks can format code after every file modification. Pre-commit hooks can validate changes before they're saved. Notification hooks can integrate with external systems.

**Example:** A post-edit hook that formats JavaScript files in `.claude/settings.json`:

```json
{
    "hooks": {
        "PostToolUse": [
            {
                "matcher": "Edit|Write",
                "hooks": [
                    {
                        "type": "command",
                        "command": "npx prettier --write \"$FILE_PATH\""
                    }
                ]
            }
        ]
    }
}
```

The value of hooks is deterministic execution. The formatting tool runs every time, though the tool itself may succeed or fail. The AI doesn't need to be prompted—the hook triggers automatically.

### MCP Server Integration

The Model Context Protocol extends capabilities through external integrations. Database servers let the AI query project data. Issue tracker integrations bring bug context into conversations. API connections enable real-time data access.

**Adding an MCP server:**

```bash
# Add a server (stored in project .mcp.json)
claude mcp add github --transport http --url https://api.github.com/mcp

# Add with environment variables
claude mcp add database --transport stdio -- npx db-server \
  --env DATABASE_URL=postgresql://localhost/mydb

# List configured servers
claude mcp list
```

**Example:** MCP configuration in `.mcp.json`:

```json
{
    "mcpServers": {
        "github": {
            "type": "http",
            "url": "https://api.github.com/mcp"
        }
    }
}
```

MCP servers can be scoped to projects, users, or locally. Common integrations can be standardized while permitting individual customization. The AI uses MCP tools naturally as part of responses.

### Your First Session

After completing setup, verify the configuration works:

1. **Start Claude Code** in your project directory: `claude`
2. **Check memory loaded**: Ask "What do you know about this project?" — the AI should reflect CLAUDE.md content
3. **Test permissions**: Try a permitted command like `git status`
4. **Test a workflow**: If you created a /review command, run it

**What to watch for:**

- Memory file content appears in AI responses
- Permitted operations execute without prompts
- Denied operations are blocked appropriately

**If something doesn't work:**

- Check file locations: CLAUDE.md at root or in .claude/
- Check JSON syntax in settings.json
- Run `claude --version` to verify installation

---

## Section 5: Operation

### The Iteration Cycle

AI-assisted work follows an iterative pattern: request → review → refine → verify. Recognizing this cycle can inform how you structure interactions.

**Single iteration:**

1. **Request** — Describe what you need with clear scope and completion criteria
2. **Review** — Examine the AI's output for correctness, completeness, and alignment with requirements
3. **Refine** — Provide feedback: what's correct, what needs adjustment, what's missing
4. **Verify** — Test or validate the refined output meets requirements

**When to iterate vs. restart:**

- Iterate when the AI understood the core requirement but needs adjustment
- Restart when the approach is fundamentally wrong or context has drifted significantly
- Restart when accumulated context is diluting focus on current work

Tasks often require multiple iterations. Complex tasks may require more. If iteration count exceeds several attempts without convergence, consider decomposing the task or restarting with clarified requirements.

### Communication Patterns

The quality of AI output may be influenced by input clarity. Vague requests may produce less focused results. Precise, focused requests with clear completion criteria may produce more useful output.

**Effective patterns:**

- Simple punctuation and short, clear sentences
- Technical terminology that is accurate and production-ready
- Avoiding marketing language or overconfidence in descriptions

When writing documentation or specifications, one effective approach is to write as the project owner in first-person perspective. Showing observed behavior and concrete situations rather than abstract descriptions tends to ground the collaboration in reality.

### Task Decomposition

Complex tasks benefit from decomposition into focused requests. A single large request may produce inconsistent results; multiple focused requests build incrementally.

**Decomposition guidelines:**

- Each request should have a single clear objective
- Dependencies should be explicit: what must exist before this task can start
- Scope should fit comfortably in one iteration cycle

**Example decomposition:**

```
Original: "Implement user authentication with login, registration, password reset, and session management"

Decomposed:
1. Create user data model and database schema
2. Implement registration endpoint with validation
3. Implement login endpoint with password verification
4. Add session token generation and validation
5. Implement password reset flow
6. Add authentication middleware to protected routes
```

Each decomposed task can be requested, reviewed, verified, and committed before moving to the next. This creates checkpoints and reduces risk of large-scale rework.

### Quality Gates

Quality gates define criteria that must pass before proceeding. They transform subjective "looks good" assessments into verifiable checklists.

**Gate categories:**

- **Correctness** — Does it work? Tests pass, no runtime errors, expected behavior verified
- **Completeness** — Is it done? All requirements addressed, no placeholder code, edge cases handled
- **Consistency** — Does it fit? Follows project conventions, matches existing patterns, integrates cleanly
- **Cleanliness** — Is it maintainable? No dead code, clear naming, appropriate structure

**Example gate for a feature implementation:**

```
VALIDATION GATE: Feature Complete
  ✅ All acceptance criteria met
  ✅ Unit tests written and passing
  ✅ Integration tests passing
  ✅ No linting errors
  ✅ Documentation updated
  ✅ Code reviewed
  IF FAIL: REPORT specific failing criteria
```

Gates apply at multiple levels:

- **Task level** — Before marking a single task complete
- **Feature level** — Before merging changes
- **Release level** — Before deployment

When a gate fails, address the specific failing criteria rather than bypassing the gate. Failed gates indicate incomplete work, not bureaucratic obstacles.

### Session Management

Sessions have natural boundaries. Knowing when to continue, pause, or restart can reduce wasted effort.

**When to continue the current session:**

- Working on related tasks in the same area
- Context from previous exchanges is still relevant
- Iteration is converging toward the goal

**When to start a new session:**

- Switching to unrelated work
- Context has accumulated beyond useful recall
- The AI is referencing outdated information
- Iteration is not converging after several attempts

**Session handoff pattern:**
Before ending a session with incomplete work:

1. Document current state in a shared file (not just conversation)
2. List completed items and remaining tasks
3. Note any blockers or decisions needed
4. Save any important context that should carry forward

This allows the next session to resume without re-establishing context from scratch.

**Preserving session state:**

```markdown
# Session State: Feature X Implementation

## Completed

- [x] Database schema created
- [x] API endpoints implemented
- [x] Unit tests for endpoints

## In Progress

- [ ] Frontend components (50% complete)

## Blockers

- Need design decision on error message format

## Context for Next Session

- Using React Query for data fetching (see /src/hooks/useFeatureX.ts)
- Authentication middleware already handles token validation
```

### Verification Workflow

A recommended pattern is to include verification with every significant change. For code changes, run tests. For configuration changes, validate the result. For documentation changes, confirm accuracy against implementation.

Verifying immediately rather than deferring can catch issues while context is fresh. When verification fails, investigation is more productive than abandonment. Each phase completes with verified success before the next begins.

The approach applies to the AI itself. Rather than trusting suggestions are correct, verify them. Rather than assuming the AI understood the requirement, check the result.

### Multi-Agent Workflows

Complex tasks can use orchestrated multi-agent execution. Specialized agents handle their domains. A tracer agent analyzes code flow. A distiller agent extracts patterns. A surgeon agent performs modifications.

Agents communicate through shared documents rather than direct message passing. The orchestrator creates initial documents. Each agent reads, enriches, and updates. This aims to maintain a single source of truth.

**Orchestrating with PAG:** Multi-agent workflows can be structured using PAG orchestration patterns. The bookend pattern (VERIFY → VALIDATE → ACTION → VERIFY) structures agent sequences. Handoff signals use PAG's SEND and REPORT keywords. Shared artifacts follow the single-source-of-truth protocol. See [PAG Orchestration](/pag?tab=orchestration) for coordination patterns.

Agents signal completion through structured handoff messages identifying what completed, where artifacts are located, what should run next, and what findings should carry forward.

### State Persistence

Long-running workflows persist state explicitly. Checkpoints mark completed work. Progress indicators show advancement. Task lists track remaining items.

The persistence format is human-readable. Markdown checklists work well—any agent or human can read the current state. When a session ends and resumes later, state persists in the workspace.

**PAG validation gates as checkpoints:** PAG's VALIDATION GATE syntax provides a structured format for checkpoints. Each gate lists specific conditions that should be true before proceeding. This aims to make progress verifiable and resumption clearer—an agent resuming work can check which gates passed and which remain.

---

## Section 6: Maintenance and Validation

### The Detect-Log-Fix Methodology

This collaboration pattern inverts the typical instruction flow. Rather than telling the AI about architectural principles and hoping for compliance, build tooling that detects violations and direct the AI to fix specific issues.

**Traditional approach (instruct and hope):**
```
Human: "Follow DRY principles when writing code"
AI: Generates code (may or may not follow DRY)
Human: Reviews, finds violations, explains what's wrong
AI: Fixes some issues, may introduce others
[Cycle repeats]
```

**Closed-loop approach:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  SCAN    │───▶│   READ   │───▶│   FIX    │          │
│  │ codebase │    │  logs +  │    │violations│          │
│  │ with tool│    │  docs    │    │surgically│          │
│  └──────────┘    └──────────┘    └──────────┘          │
│       ▲                               │                 │
│       │                               │                 │
│       └───────────────────────────────┘                 │
│              [LOOP until gates pass]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

This is a closed-loop control system. The tooling provides the feedback signal. The AI reads structured output, applies fixes, and the tooling measures the result. Each iteration tends to reduce violations, though fixes may occasionally introduce new issues. The loop terminates when validation gates pass or bounds are reached.

The key insight: AI may produce more consistent results when refactoring existing code with specific targets than when generating from abstract principles. Accept imperfect generation, then use tooling to detect issues and AI to fix them. Data directs the refinement—not instructions, not principles, but structured violation reports with exact locations.

### How Tooling Changes the Collaboration

When validation tooling exists, the collaboration dynamic shifts. Instead of explaining principles and hoping they're followed, you point the AI at concrete violations. The conversation changes from "please follow DRY" to "fix the duplication reported at line 47."

This changes what you're trusting the AI to do. You're not trusting it to understand and internalize architectural principles. You're trusting it to read a violation report and modify the specific location indicated. The second task is more constrained, more verifiable, and tends to produce more consistent results.

The tooling handles detection. The AI handles remediation. You handle verification. Each participant does what they're suited for.

### What Makes Violation Reports Useful

For the AI to fix violations effectively, it needs to know exactly where problems are and what's expected instead. A report that says "there are DRY violations" isn't actionable. A report that says "lines 45-52 in this file duplicate lines 12-19 in that file" enables surgical correction.

Useful violation reports include:
- **Exact location** — file, line, column
- **What exists** — the actual problematic code or pattern
- **What's expected** — what compliance would look like
- **Severity** — which violations matter most

When the AI receives this level of detail, it can make targeted changes rather than broad rewrites. The fix scope matches the violation scope.

### What Can Be Detected Automatically

Tooling works well for violations that can be measured objectively: file size, code duplication, import patterns, naming conventions, presence of debug statements. These have clear pass/fail criteria.

Tooling works less well for subjective qualities: code clarity, appropriate abstraction level, good naming choices. These require human judgment.

Design your validation around the objective criteria. Use human review for subjective qualities. Combining both approaches addresses different types of quality concerns.

### The Validation Loop in Practice

The collaboration follows a rhythm: generate, scan, review violations, fix, scan again. This continues until the codebase passes or you decide remaining violations are acceptable.

**A typical cycle:**
1. Ask the AI to implement something
2. Run validation tooling
3. Share the violation report with the AI
4. Ask it to fix the reported issues
5. Run validation again
6. Repeat until clean or acceptable

The AI doesn't need to run the tooling itself—you run it and share results. This keeps you in control of what gets validated and when. You see exactly what the AI sees.

**When to stop iterating:**
- All violations resolved
- Remaining violations are acceptable exceptions
- Context is running low (save state, continue later)
- Iteration isn't converging (rethink the approach)

If you're iterating without progress, the task may need decomposition or the violations may indicate a deeper structural issue.

### Working with Violation Categories

Not all violations need fixing simultaneously. Focusing on one category per iteration can be more manageable than addressing everything at once.

Start with the highest-impact category—often the one with fewest violations but highest severity. Clear those completely before moving to the next category. This prevents the AI from making changes that fix one violation type while introducing another.

Example progression:
- First pass: Fix import violations (structural, affects other fixes)
- Second pass: Fix duplication (now that structure is stable)
- Third pass: Fix complexity (split large files)
- Final pass: Fix naming and style (cosmetic, do last)

This ordering respects dependencies. Structural fixes come before cosmetic ones. Each category reaches zero before the next begins.

### Keeping the AI Informed

One challenge in AI collaboration is context drift—the AI may work from outdated understanding of the codebase. Documentation helps, but manually maintained docs drift from reality.

Auto-generated documentation addresses this. Tooling scans the codebase and produces reference documents that reflect current state. When you regenerate, the docs update. The AI reads current facts, not stale descriptions.

This matters most for:
- **Architecture** — What patterns exist, what base classes are available
- **APIs** — What endpoints exist, what they expect
- **Conventions** — What naming patterns are in use, what rules apply
- **Current violations** — What needs fixing right now

When starting a session, regenerate the docs. The AI then has accurate context. When the codebase changes significantly during a session, regenerate again.

### Documentation as Shared Context

Generated documentation serves as shared context between you and the AI. You both see the same architectural summary, the same violation list, the same pattern inventory.

This creates alignment. When you say "follow the existing pattern for API handlers," the AI can look at the generated API registry and see exactly what that pattern is. No ambiguity about what you meant.

The documentation also persists across sessions. A new session can load the generated docs and understand the codebase without you re-explaining everything. The docs carry context forward.

### The Single Source of Truth Principle

The codebase is the source. Everything else—documentation, violation reports, pattern inventories—derives from it. When they conflict, the codebase wins.

This principle simplifies maintenance. You don't update docs manually; you regenerate them. You don't argue about whether the docs or code are correct; you check the code. The derived artifacts stay synchronized because they're always regenerated from source.

For collaboration, this means the AI can trust generated documentation. It reflects what actually exists, not what someone intended to document.

### Large-Scale Reorganization

Sometimes collaboration involves reorganizing significant portions of the codebase—renaming files, moving code between modules, updating class names. These changes ripple across many files.

Doing this through conversation alone is risky. You might say "rename Logger to CoreLogger and move it to the logging module," but ensuring all references update correctly is error-prone. Miss one import statement and the code breaks.

The safer approach: describe the intended changes in a structured document, validate that the changes are coherent, preview what will happen, then execute atomically. If anything fails, roll back entirely.

This collaboration pattern uses the AI for planning rather than execution. You might ask the AI to propose a reorganization manifest—what should move where, what should be renamed. Review the proposal, adjust as needed, then let tooling execute it precisely.

### Planning vs Executing Reorganizations

The AI can reason about reorganization: "If we want to separate concerns, these files should group together, these classes should rename to reflect their new module, these imports will need updating."

Execution is harder for AI: manually updating dozens of import statements, remembering all the places a class name appears, handling edge cases like dynamic imports or string references. These tasks involve precision across many files where a single miss breaks the build.

Consider using AI for planning and tooling for execution. The AI proposes. Tooling validates the proposal makes sense (no circular renames, no conflicts). Tooling executes all changes atomically. Tooling verifies the result.

This division of labor separates reasoning (where AI can contribute) from precise multi-file execution (where deterministic tooling provides consistency).

### When Things Move

Moving code between files creates cascading changes. Every file that imported from the old location needs updating. Every reference to a renamed class needs updating. Configuration files may reference paths that changed.

Tooling can track these cascades precisely. It finds all references, calculates new paths, updates everything in one operation. The AI would need to search, update, search again, potentially miss references in unexpected places.

The collaboration here is human judgment about what should move, AI assistance in planning the reorganization, and tooling precision in executing it.

### Maintaining Consistency

After reorganization, the codebase should be consistent—no broken imports, no missing references, no orphaned code. This is verifiable.

Run tests. Run validation tooling. Check that everything still works. If something broke, the atomic nature of reorganization lets you roll back and try again.

Consistency enforcement is ongoing, not just post-reorganization. Regular validation catches drift before it accumulates. Small corrections are easier than large cleanups.

### Code Hygiene

One approach to code hygiene is avoiding explanatory comments in production code. The principle is that well-structured code aims to be readable through naming and organization. Function names describe behavior. Variable names reveal purpose.

In this configuration, the AI does not add explanatory comments, does not preserve comments it finds, and removes comments when modifying files. The rationale: comments can become outdated when code is updated but comments are not.

A recommended practice for cleanup operations is targeting specific patterns with minimal collateral impact. Only the unused code disappears. Only the refactored sections change. Each cleanup is intentional, scoped, and justified.

### Rollback Procedures

When changes cause problems, having a clear rollback path prevents compounding errors with rushed fixes.

**Before making significant changes:**

1. Ensure changes are committed to version control in logical units
2. For configuration changes, copy current state to a backup location
3. For database changes, create a migration that can be reversed
4. Document what the rollback command would be

**Rollback by change type:**

| Change Type     | Rollback Method                                                |
| --------------- | -------------------------------------------------------------- |
| Code changes    | `git checkout HEAD~1 -- path/to/file` or `git revert <commit>` |
| Branch changes  | `git checkout previous-branch`                                 |
| Configuration   | Restore from backup copy                                       |
| Database schema | Run reverse migration                                          |
| npm packages    | `git checkout package.json package-lock.json && npm install`   |

**When rollback is needed:**

- Tests that passed before now fail
- Runtime errors appear in previously working code
- Configuration changes break functionality
- Dependencies conflict after updates

**Rollback workflow:**

```
ON ERROR breaking_change:
TRY:
  IDENTIFY last_known_good_state
  EXECUTE rollback TO last_known_good_state
  VERIFY system_functional
  THEN investigate_cause WITHOUT time_pressure
CATCH:
  REPORT "Rollback failed" WITH current_state
  ESCALATE to manual_intervention
```

The key principle: restore functionality first, then investigate. Attempting to fix forward under pressure can compound problems.

---

## Section 7: Troubleshooting

### When AI Drifts From Instructions

AI systems tend to drift from instructions over extended sessions. This is common behavior, not failure. The response is to provide reminders about principles and constraints.

If drift persists, check that memory files are being loaded correctly. Verify that custom agents have appropriate system prompts. Consider breaking long sessions into shorter, focused interactions.

### When Validation Fails

Validation failures indicate violations to address, not reasons to abandon the approach. Review the specific violations reported. Determine whether they indicate genuine issues or false positives in the validation tooling.

For genuine issues, direct the AI to fix specific violations with file locations and line numbers. For false positives, adjust validation rules to reduce noise while maintaining useful detection.

### When Context Becomes Overloaded

Large conversations can accumulate context that dilutes focus. Symptoms include responses that miss recent instructions or reference outdated information.

Start fresh sessions for new task domains. Use shared documents to persist state rather than relying on conversation history. Direct the AI to specific files rather than expecting it to remember everything discussed.

### When Multi-Agent Workflows Fail

Agent handoffs can fail when context transfer is incomplete. Check that handoff signals include necessary information for successors. Verify that shared documents contain current state.

Failed handoffs should include failure context explaining what was attempted and what failed. The next agent or human inherits a clear problem statement rather than mysterious failure.

### When Reorganization Causes Breakage

AST-based reorganizations can cause issues if import updates miss edge cases. Run tests immediately after reorganization. Check for runtime errors indicating missing imports.

If breakage occurs, review the migration plan for missed references. AST tooling aims to identify all references, but dynamic imports or string-based requires may not be detected. These require manual verification.

### Iterative Resolution

Working with AI is iterative. Initial outputs may not match exactly what is needed. The collaboration pattern involves generating, reviewing, adjusting, and regenerating until the result meets requirements.

Treat the AI as a collaborator that needs feedback, not a service that should produce perfect output on first attempt. When something goes wrong, identify what caused the issue, adjust the approach, and continue.

---

## Summary

AI-assisted development integrates language model capabilities with software engineering workflows through structured configuration and disciplined operation.

The workspace provides structure. Memory files provide context. Custom commands provide consistency. Agents provide specialization. Hooks provide automation. Validation tooling detects architectural violations.

Results depend on configuration quality and consistent verification. The approach requires upfront investment in workspace setup and ongoing discipline in operation. The AI is a collaborator within defined boundaries—not a replacement for engineering judgment.

---

## Glossary

**Agent** — A specialized AI configuration designed for specific task types like code review or debugging. Agents have focused capabilities and constraints appropriate to their purpose.

**Atomic operation** — A change that either completes entirely or not at all. If a reorganization fails partway through, everything rolls back to the starting state. No partial changes.

**Closed-loop collaboration** — A workflow pattern where tooling detects issues, the AI fixes them, and tooling verifies the fixes. The loop continues until the codebase passes validation or you decide to stop.

**Context drift** — When the AI's understanding diverges from the actual codebase state, often during long sessions. Addressed by regenerating documentation and restarting sessions.

**Context window** — The amount of text an AI can process in a single interaction. Large codebases exceed this limit, requiring selective focus and documentation to carry context.

**Data-directed collaboration** — Working with the AI through concrete violation reports rather than abstract principles. Instead of "follow DRY," you say "fix the duplication at line 47."

**Generated documentation** — Reference material produced by scanning the codebase, always reflecting current state. The AI reads current facts rather than potentially stale manual documentation.

**Hook** — An automated action that executes at specific points in the AI workflow, such as formatting code after every edit. Hooks provide consistency without requiring the AI to remember.

**Manifest** — A document describing intended changes to the codebase (what should rename, move, or reorganize). Used for planning large changes before executing them atomically.

**MCP (Model Context Protocol)** — A way to connect AI assistants to external tools and data sources like databases, APIs, and issue trackers.

**Memory file** — A document that persists project context across AI sessions, automatically loaded when starting work. Contains architecture decisions, conventions, and key information.

**Orchestrator** — The coordinating component in multi-agent workflows that sequences work and manages handoffs between specialized agents.

**PAG (Pattern Abstract Grammar)** — A structured instruction format using keywords, phases, validation gates, and constraints. Provides explicit syntax as an alternative to prose instructions.

**Single source of truth** — The principle that the codebase is authoritative. Documentation, violation reports, and other artifacts derive from it and can be regenerated.

**Slash command** — A custom prompt triggered by typing a command like /review. Commands capture repeatable workflows so you don't re-explain them each session.

**Surgical fix** — A targeted code change at a specific location, as opposed to broad refactoring. Enabled by violation reports that pinpoint exact files and lines.

**System prompt** — Instructions that define an AI's behavior and constraints, configured before the conversation begins.

**Validation loop** — The cycle of generating code, running validation, sharing violations with the AI, fixing issues, and validating again until the codebase passes.

**Violation report** — Output from validation tooling showing exactly where issues exist, what's wrong, and what's expected. Enables the AI to make targeted fixes.
