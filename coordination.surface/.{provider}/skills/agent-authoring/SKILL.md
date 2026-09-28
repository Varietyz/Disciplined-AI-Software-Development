---
name: agent-authoring
description: The contract for authoring or auditing an invocable agent or a skill - what reaches an agent at startup, where a binding instruction must live, how a seat differs from an invocable agent, and which rules invert inside one. Use before writing, reviewing, correcting or auditing any file under the behavior tree's agents or skills folders, and whenever a spec's declaration appears not to take effect.
---

# agent-authoring

**This skill carries what an author or auditor must not get wrong, and it does not restate any runtime's field
list.** That list belongs to the runtime's own documentation, which changes on the runtime's schedule rather than
ours. BOOTSTRAP.md records, per runtime, the frontmatter keys it reads, what it delivers at startup and which
tools it withholds, and adoption writes the adopted runtime's keys into `{convention.agent_keys}`. **The
directory is named by its slot rather than by a literal, because a citation carrying one folder name resolves
only in the host that happens to use that name.**

## The delivery rule, which most specs get wrong

**The body becomes the system prompt, and frontmatter is configuration, not instruction.** A directive written
into frontmatter governs nothing at invocation, and it reads as governing.

**So the shipped specs carry only `name` and `description` in frontmatter**, the two keys every runtime reads,
and declare everything else in the body: the letter (`THIS AGENT IS <LETTER>`), the skills it loads (`SKILLS:
<name>, <name>`), its non-goals and its operations. Adoption copies the `SKILLS:` line into the runtime's own
preload key where the runtime has one.

**An invocable agent's startup context is a closed list, and the list is the runtime's.** It always holds the
agent's own body as system prompt and the delegation message written by the party that spawned it. What else
arrives (the host's instruction files, a repository snapshot, the named skills, a sibling roster) differs per
runtime and is recorded in BOOTSTRAP.md. **What never arrives on any runtime:** the parent's conversation, any
file the parent read, and **any coordination surface**. A party that needs a shared file opens it.

## A seat and an invocable agent are different objects, and only one has a letter

**A file under `{surface.agents}` is a bounded invocation, never a seat.** It has no letter, no board record, no
role document and no place in any reader set, and the `role` gate does not reach it, because that gate derives
its roster from the board's own `— ACTIVE` records rather than from the agents directory.

|                    | seat                                                                        | invocable agent                                                    |
| ------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| identity           | a letter, allocated in `_agent-index.md`, never reused                      | a `name:`, resolved per invocation                                 |
| declaration        | a role document under the roles directory the configuration resolves, gated | its own body, which is the system prompt                           |
| receives the board | yes, and reads it whole                                                     | **never**, only the `collab-status` projection as injected context |
| ends its turn      | never, because it waits with a command                                      | **always**, and returning is the contract                          |

**The turn-owning rules invert rather than lapse.** _Never end a turn to wait_, _flow until the queue is empty_
and _quiet is not permission to report_ all bind a seat. Written into an invocable agent's body, they forbid the
one thing it exists to do. **An inert rule does nothing, while an inverted one is actively wrong while reading
as governed**, which is why this distinction belongs at authoring time rather than in a review.

**The projection is the whole of what it knows about the board.** A blocker not named in that one line does not
exist for anything spawned, however loudly the board carries it.

## Tools are withheld, and the withholding is silent

**A runtime withholds some tools from every invocable agent regardless of what the spec lists.** Where the
question tool is among them, **a rule about how to ask the owner is vacuous inside an invocable agent**, because
it has no channel to one. BOOTSTRAP.md names what each runtime withholds, including tools that differ between a
foreground and a background run. **The same definition can resolve to different tools depending on how it is
launched**, so a loop that depends on a withheld tool works in one launch mode and silently fails in the other.

## Authoring rules that follow

1. **Put every binding instruction in the body**, and keep frontmatter for configuration only.
2. **Declare non-goals in the body**, where they arrive, and place them before the node that selects the work,
   because a non-goal read after selection excludes nothing that has not already been paid for.
3. **Honor an ABSENT slot explicitly**, or do not name it. A gate written over a slot that may be ABSENT has no
   satisfiable state and **can only be met by fabricating its evidence**. Deriving the check list from the
   binding is correct, while adding _or declared ABSENT_ makes the check saturate.
4. **A check over a slot resolving ABSENT is not emitted**, rather than emitted with an escape clause.
5. **Never hardcode a runtime path, tool name or key in a contract that declares itself portable.** Name a slot
   or a semantic operation, and let the runtime's mapping in BOOTSTRAP.md resolve it.
6. **State the trust anchor and every deviation.** Holding no position is a first-class output.

## Skills

**Content persists in context for the whole session once loaded**, so every line is a recurring cost paid once
per reader. Standing instructions are written rather than one-time steps, because the file is not re-read.

A shipped skill carries `name` and `description` in frontmatter and nothing else. Keys that decide which party
may invoke a skill, which tools it grants or whether it runs as its own agent are runtime keys, added at
adoption where the runtime reads them.

## When a declaration appears not to take effect

Delivery is checked before correctness: was the spec read by this runtime at all, and does this runtime read the
key it is declared in? **A definition read before an edit lands is stale for that invocation and passes every
check on disk.**
