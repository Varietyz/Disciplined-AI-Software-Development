<!-- WORKSPACE SURFACE -->

# Substrate surface: the detail the board routes to. One writer, many readers.

# Copy to `<container>/<concern>/<subject>.<concern>.md`, fill the header, delete the example records.

# Every record here is addressable as `<Key>-<ordinal>` and is cited from the board and from other surfaces.

# Model: `models/coordination.model.md`, for nodes, edges and derived states.

═══════════════════ HEADER (permanent) ═══════════════════

Type: <round | finding | ruling | repair, which selects the record schema below>
Owner: <the single agent that writes here, while every other agent cites and none edits>
Key: <surface key, declared and never derived from the path, with ids of the form `<Key>-<ordinal>`>
Parent: <surface key this reduces upward into, or the absent token `—` at the root>

═══════════════════ PROTOCOL (permanent) ═══════════════════

## Surface contract (strict)

- Current truth only. Records are overwritten in place, with no appending, no archaeology and no DONE, SUPERSEDED or ACK markers.
- Each record carries exactly the schema below and nothing else, as normalized records rather than prose.
- `Key` is fixed for the life of the surface. Moving the file does not change it, so every id already issued survives the move.
- Nothing is raised without a destination. `Kind` selects the destination, and the destination is derived, never chosen.
- Absorbed is a transition, never a state: extract to `_changelogs.txt`, then delete the record in the same change. There is one history home, and a changelog inside a workspace is a second place history may live.
- No state is written. Open, blocked and absorbed are queries over the edges.

## Fixed record schema

Item <Key>-<ordinal>: <one-line claim>
Subject: <declared subject key, what this record is about>
Kind: <round | claim | finding | ruling | repair>
Acknowledger: <agent, required when Kind is a judgment, forbidden otherwise, else —>
Satisfied-by: <citation that closes it, required for an artifact item, else —>
Evidence: <observation any agent can reproduce>
Edges: <ids for blocks, answers, refutes or supersedes, or —>

## Kind, destination and closing

| kind    | home                                 | closes when                    |
| ------- | ------------------------------------ | ------------------------------ |
| round   | this surface                         | its acknowledger closes it     |
| claim   | the plan row it claims against       | the row retires                |
| finding | the durable-record surface           | never, since it is referenced  |
| ruling  | the surface owning the axis it binds | never, since it is cited by id |
| repair  | the tree it fixes                    | the change is on disk          |

## Gate

- `Kind` is in the closed set, `Acknowledger` is present exactly when the kind is a judgment, and `Satisfied-by` is present exactly when an artifact satisfies it.
- `Key` is unique across the workspace, `<Key>-<ordinal>` is unique within it, and a duplicate `Subject` is a finding.
- Every edge resolves. A citation to nothing is a finding, and a cycle is a finding.
- An item unacknowledged past `N` rounds is a finding, escalating to the board and then the owner.

═══════════════════ RECORDS ═══════════════════

Item <Key>-1: <one-line claim>
Subject: <—>
Kind: <—>
Acknowledger: —
Satisfied-by: <—>
Evidence: <—>
Edges: —

Item <Key>-2: <one-line claim>
Subject: <—>
Kind: <—>
Acknowledger: <—>
Satisfied-by: —
Evidence: <—>
Edges: —

═══════════════════ OPEN (unresolved only) ═══════════════════

- (none)
