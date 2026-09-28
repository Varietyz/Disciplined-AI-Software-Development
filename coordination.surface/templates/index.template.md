<!-- WORKSPACE INDEX -->

# The workspace root: what files exist, who writes each, and how they reduce upward.

# Copy to the workspace root as the operative protocol. The INDEX block is generated and never hand-written.

# An agent starting fresh reads this file first and needs nothing else to place a document or find one.

# Model: `models/coordination.model.md`.

═══════════════════ LAYOUT (permanent) ═══════════════════

```text
<workspace>/
  README.md                     GENERATED from the manifest — protocol and index alike; edit the manifest
  _manifest.json                the authored source every layer of README.md renders from
  <concern>/                    one folder per declared concern
    <subject>.<concern>.md      a surface — one writer, declared Key
  templates/                    the shapes every document here is copied from
```

- A leading `_` marks an accumulator: append-only, and exempt from the current-truth rule. Nothing else is exempt.
- Everything else holds current truth only, and the tense rules bind it.
- Placement is derived from the declared container and concern. A file outside the grammar is a finding.
- Conversion between surfaces is a move, never a copy.

═══════════════════ PROTOCOL (permanent) ═══════════════════

## Which file does this go in

| what you have                           | goes to                                | closes when                                              |
| --------------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| something another agent must act on now | the board, as a pointer                | it is acted on                                           |
| correspondence needing a reply          | a `round` surface here                 | its acknowledger closes it                               |
| a claim against a plan row              | the plan row's own state               | the row retires                                          |
| a durable finding                       | the durable-record surface             | never, since it is referenced                            |
| a decision                              | the surface owning the axis it binds   | never, since it is cited by id                           |
| a defect in a tree you do not own       | a `repair` record, addressed not asked | the change is on disk                                    |
| an absorbed round                       | `_changelogs.txt` at the package root  | never, since it is history and there is one history home |

## Surface header (every file except the accumulators)

Type: <the record schema this surface carries>
Owner: <the single writer>
Key: <declared surface key, with ids of the form `<Key>-<ordinal>`>
Parent: <surface key this reduces upward into, or the absent token `—` at the root>

## Reduction

Surfaces form a tree through `Parent`. Downward is distribute, and upward is reduce: a parent publishes the
fused result of its children, never their raw records. Reading binds to the surface an agent owns and its inbox,
both bounded. The global view is derived, never read.

## Gate

- Every file is present in the INDEX below, and every INDEX entry is present on disk, checked in both directions.
- `Key` is unique across the workspace, each surface has exactly one `Owner`, and `Parent` resolves or is the root.
- Every scan is depth-agnostic. A scan anchored to a fixed depth reads PASS over what sits below it.
- Workspace rules register with the single governance entry point. No workspace-local runner exists.

═══════════════════ INDEX (generated, do not edit) ═══════════════════

| file   | type   | owner   | key   | parent     | records |
| ------ | ------ | ------- | ----- | ---------- | ------- |
| <path> | <type> | <agent> | <key> | <key or —> | <n>     |

═══════════════════ OPEN (unresolved only) ═══════════════════

- (none)
