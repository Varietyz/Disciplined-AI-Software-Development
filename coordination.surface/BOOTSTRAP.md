---
name: bootstrap
type: GUIDE
summary: The adoption procedure an agent runtime follows once, to rename the package's behavior folder to its own, point the configuration at it, and adapt the entry file, the agent frontmatter and the operation map to itself.
---

# Adopting this package into an agent runtime

This package keeps its rules, skills, agent files, reasoning templates and bindings in one folder named `.{provider}`, and its main instruction file is `AGENTS.md` at the package root. Each agent runtime reads its instructions from a folder with its own name, so the folder is renamed once for the runtime the package runs in. Follow the steps below in order, and follow them again after switching to a different runtime.

## 1. Identify the runtime and read its own documentation

Name the runtime and open its current documentation for four facts:

1. the folder it reads project instructions, agents and skills from
2. the instruction file it loads at startup, and whether it reads `AGENTS.md` without configuration
3. the frontmatter keys it reads on an agent specification and on a skill
4. the tool it provides for each semantic operation the templates name (DISCOVER_RESOURCES, READ_RESOURCE, SEARCH_CONTENT, ANALYZE_CONTENT, EXECUTE_TOOL, PERSIST_ARTIFACT, REQUEST_DECISION, REPORT_RESULT), including the tool that asks the developer a question

Where the runtime's documentation and section 5 disagree, the documentation decides, and section 5 is corrected to match it.

## 2. Rename the behavior folder

Rename `.{provider}` to the folder the runtime reads, such as `.claude` for Claude Code. Quote the path in any command that types it, because some shells and glob tools read braces.

Then replace the literal `.{provider}` with the new name everywhere outside this file:

- `config/surface.config.ts` (`BEHAVIOR_TREE`)
- `config/taxonomy.config.ts` (the governed-root keys)
- `package.json` (`files`)
- every document path, including the digest list at the end of `AGENTS.md`

After the rename, search the package for `.{provider}`. A match outside this file is a path the rename missed, and `npm run govern` also reports a document that still names it.

## 3. Make the runtime load the instructions

If the runtime reads `AGENTS.md` at startup, it already loads the instructions. If it reads a different file, create that file, make it import or include `AGENTS.md` and the digest list in the runtime's own syntax, and add the file's name to `boundaryDocuments` in `config/taxonomy.config.ts`. If the package sits inside a host project, add the contents of `AGENTS.md` to the host's instruction file, or make that file import it.

## 4. Adapt the agents, the skills and the configuration

Add the frontmatter keys the runtime reads on an agent file to `convention.agent_keys` in `config/surface.config.ts`, then add to each agent the keys it needs. Instructions stay in the body.

If the runtime preloads skills from a frontmatter key, copy each agent's `SKILLS:` line into that key. If it has no such key, the agent is asked to load the skills its `SKILLS:` line names before its first action.

If the runtime finds agents and skills only in the host project's own folder, copy them there. The package's copies stay the source, and repeating this step replaces the host's copies.

Finally, add the runtime's tool for each semantic operation, and its question tool, to its entry in section 5.

## 5. Runtime notes

Each entry states what one runtime reads and delivers. Check an entry against the runtime's documentation before relying on it.

### Claude Code

| fact                                      | value                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| folder                                    | `.claude`, holding `agents/` and `skills/`                                                                                                                                                                                                                                                                                                                                                                                                           |
| instruction file                          | `CLAUDE.md`, loaded at every level of its folder hierarchy. It imports another file with `@path`, so it imports `AGENTS.md` and the digests                                                                                                                                                                                                                                                                                                          |
| agent keys                                | `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`                                                                                                                                                                                                                                                   |
| skill keys                                | `name`, `description`, `user-invocable`, `allowed-tools`, `context`, `disable-model-invocation`                                                                                                                                                                                                                                                                                                                                                      |
| an invocable agent receives               | its body as system prompt with environment details, the delegation message, every level of the `CLAUDE.md` hierarchy (the built-in Explore and Plan agents skip it), a repository-status snapshot from the parent session's start, the full content of every skill named in `skills:`, and a sibling roster where `SendMessage` is among its tools                                                                                                   |
| an invocable agent never receives         | the parent's conversation, output style or memory, or any file the parent read                                                                                                                                                                                                                                                                                                                                                                       |
| keys that behave unlike their name        | `initialPrompt` applies only to the main session agent. `name` is the identity, the filename need not match it, and a name containing `:` is not loaded. `model` defaults to `inherit`, and an environment variable and a per-invocation parameter override it. A skill with `disable-model-invocation: true` cannot be preloaded. `description` triggers delegation and is truncated at 1,536 characters in the listing together with `when_to_use` |
| tools withheld from every invocable agent | `AskUserQuestion`, `EndConversation`, `EnterPlanMode`, and `Agent` at the depth limit                                                                                                                                                                                                                                                                                                                                                                |
| tools a background agent keeps            | every MCP tool plus `Read`, `Grep`, `Glob`, `Bash`, `PowerShell`, `Edit`, `Write`, `NotebookEdit`, `WebFetch`, `WebSearch`, `TodoWrite`, `Skill`, `ToolSearch`, `EnterWorktree`, `ExitWorktree`, `Monitor`, `TaskStop`, `SendMessage`, `Artifact`. Any other tool is removed without an error                                                                                                                                                        |
| plugins                                   | agents shipped in a plugin ignore `permissionMode`, `mcpServers` and `hooks`                                                                                                                                                                                                                                                                                                                                                                         |
| reload                                    | an edited agent file is picked up within seconds, except in an `agents` folder that did not exist when the session started, or in a session started with slash commands disabled                                                                                                                                                                                                                                                                     |
| operation map                             | DISCOVER_RESOURCES → `Glob`, SEARCH_CONTENT → `Grep`, READ_RESOURCE → `Read`, EXECUTE_TOOL and ANALYZE_CONTENT → `Bash`, PERSIST_ARTIFACT → `Write` or `Edit`, REQUEST_DECISION → `AskUserQuestion`                                                                                                                                                                                                                                                  |

### Other runtimes

A runtime without an entry, such as Codex, Gemini CLI, Cursor or GitHub Copilot, gets one at its first adoption, written from the four facts in step 1 in the same shape as the Claude Code entry.

## 6. Verify

Run `npm run govern` until two runs in a row report the same result, and that result is the verdict. The first run repairs what it can, and each check that reads the previous run's report needs one more run to see the repair. A finding for an undeclared agent key or a skill that does not resolve means a step above is incomplete.
