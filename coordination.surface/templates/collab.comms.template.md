<!-- COORDINATION BOARD -->

# Multi-agent coordination for the project, so that concurrent agents neither overlap nor conflict.

# On session start, or on a first read mid-session, an agent reads this board, claims an agent letter and declares its scope in the fixed schema below.

# The last agent to update refreshes the one-line projection in `{project.governance_policy}` ('<marker>: <one-liner> - Updated <path>'), and agents that have read it append their letter '(A*), (B*), …'.

# Owns and Flags are claims and intentions rather than locks and messages. Every agent re-infers the current world from this board and converges cooperatively, with no scheduler and no consensus step.

═══════════════════ PROTOCOL (permanent) ═══════════════════

## Board contract (strict)

- Current truth only. A record is overwritten in place, with no appending, no archaeology, no historical, DONE, SUPERSEDED or ACK markers, and no diaries.
- Each record carries exactly its fixed schema below and nothing else, as normalized records rather than prose.
- Implementation detail, playbooks, root-cause analyses, troubleshooting and completed-milestone narrative live in documents reached through a typed reference, `` `<kind>`: `<member>` ``, whose kind names the corpus that resolves it. A kind outside the declared set resolves vacuously and reads exactly like one that passed, so the set is closed. A durable-record kind is available only where the host declares that surface, and where it resolves absent, the finding is carried in prose rather than pointed at.
- A resolved flag or a completed unit is deleted outright. A removed field reads as absence, and a stale one manufactures a false belief.

## Fixed agent schema (coordination layer)

**The specimen is fenced, and the fence carries load.** This file is both the contract and the seed, since a
board is raised by copying it, so it must contain a record shape in order to state one, and every scanner that
reads a board would otherwise read these specimen lines as live records. A fenced specimen is a record
mentioned, an unfenced one is a record claimed, and the board scanners skip the first.

```text
  ┌─── AGENT X ─── one writer: X · others cite, never edit · anchored EDIT only, never a whole-file WRITE
  Agent X — ACTIVE | INACTIVE | INVOKED
    Owns:    <paths/concerns this agent claims exclusively — one line>
    Status:  <current unit + state — one line>
    Flags:   <actionable intentions to named agents; deleted once resolved, or —>
    Refs:    <typed pointers for all detail, each naming a declared kind>
  └─── END AGENT X
```

**The delimiters are structural rather than decoration, and `board/undelimitedRecord` fails a record without
them.** They give every block an anchor unique to its own writer, which is what makes an anchored edit possible
for a neighbor revising its own record. Without one, an agent rewriting its block has nothing narrow to edit
against and reaches for a whole-file write, which succeeds, reports success to the agent that overwrote, and says
nothing at all to the agent that was overwritten.

**An agent edits inside its own delimiters and never writes the whole board.** An edit against a file that moved
since the agent read it is refused and says so, while a whole-file write is not. The whole protection lies in
that difference, and it is a property of the two mechanisms rather than of how careful either agent is.

## Fixed item schema (an addressed item inside `Flags`)

```text
  Flags:   —
           ┌─── AGENT <letter>-<ordinal> ─── kind:<artifact | judgement> at:<ms> to:<letters | *>
           To <letter>[, <letter>][ AND <letter>] — the argument, across as many lines as it needs.
           └─── END AGENT <letter>-<ordinal>
```

**This specimen states what the form writes, and the form is the source.** Every operand after the closing rule
is metadata the tool allocates: the kind that selects the closure, the stamp, and the addressee set a reader set
resolves from. So a seat hand-authoring from a specimen that omits any of them produces an item addressed to no
party, closeable by no party, and well-formed to every check. Measured: three such items, from a specimen
carrying the kind as a middle-dot annotation the writer never emits. **A specimen a party copies is read as the
format**, so where it and the writer disagree, the writer wins and the specimen is corrected. An item is authored
through the form rather than from this block because the form cannot disagree with itself.

**The field opens with the absent token `—`, and the fences follow.** A marker sharing the `Flags:` label line is
never recognized, so its item reads as an open with no close and the record fails.

**The kind selects the closure, which is why it sits on the open marker and not in prose.** An artifact item asks
for something that can exist and closes with a typed reference that resolves. A judgment item asks for a reading
and closes by acknowledger with **no reference**, because there is nothing for one to point at. **A gate derives
this schema from this file**, so a field the template does not declare is a field no gate can check, which is how
a decided field becomes unenforced by construction rather than by decision.

**The id and the fence are one mechanism.** The id makes the fence addressable, and the fence makes the id's span
removable. A span resolves only when exactly one open and one close carry its key, and at item level the key
cannot be the bare agent letter, because one agent writes many items.

**The agent that handled an item removes it, never the author.** Handling and removing are one operation, so no
item sits handled but standing while it waits for its author to notice. Removal is gated on the item's reader set,
so no party clears traffic aimed at another party. **One writer per record binds hand editing and not the tool**:
a span dropped by id under a witness read is the mechanism the fence exists for. **Removal requires extraction to
`_changelogs.txt` first**, since deleting to make room is data loss disguised as the drain. The full protocol is
the `board-items` layer of `README.md`, cited by layer name because that document is generated from the manifest
and carries named layers rather than numbered sections. An ordinal is an artifact of hand-authored numbering and
resolves to nothing the moment the document re-renders, in the one block every seat reads first.

## Repository layer: a pointer, never a transcribed verdict

The board names where gate verdicts live and restates none of them:

Gate verdicts are DERIVED, never transcribed here. Read `_generated/<aggregate>.report.generated.json`.

**A state field carrying a verdict is a cache with no invalidation.** It is true when written and false the moment
any agent writes anything, with nothing reporting the disagreement. Every seat here independently reached that
conclusion about its own Status field and answered it by refusing to assert a verdict, and the artifact section
held the same construct one section down. **The obvious repair is refused for a stronger reason than the
defect**: having the pipeline write the field would make a gate rewrite a surface every agent writes
concurrently, which is the lost-write construct with a gate's authority.

## Waiting on another agent (never end the turn to wait)

Run `npm run await -- --agent <LETTER> [--file <surface>]`. **The agent is mandatory**, because the snapshot, the
fence, the reader set and the closure check all key on it, so an undeclared caller can be given no diff and
cannot be told what was addressed to it. **There is no `--timeout`**: the invocation already bounds the call, so a
second bound inside the tool would control nothing.

**On a failed invocation, the agent reads the surface and never infers from the trace.** Two outages look
identical at the terminal, a stack trace and a non-zero exit, and they take opposite recoveries. A failure at
module resolution happens before the process starts, so nothing is written and re-posting is correct. A failure
inside the tool happens after it ran, and this form performs its append early, so the write landed, only the
reporting died, and re-posting duplicates.

**The receipt settles the ordinary case and the surface settles the rest.** Every successful append prints the
allocated id and the surface it landed on. No receipt means the append did not complete and re-posting is
correct, and a receipt beside a trace means it did and re-posting duplicates. Where the receipt is absent for
another reason, such as a killed process, a lost terminal or output no party kept, the surface is the authority,
because whether an effect happened exists in the surface and never in the channel the caller is reading. **The
order applies this tool's own ruling to itself:** the receipt is the author's account and cheap, the surface is
the fact and authoritative, and one read of it is right in both measured cases and in the ones no party has met.
**The surface read needs something to search by**, which is a property of how a write is addressed rather than
of the surface. A named field is addressable, while an item is addressable only by its content, because its id is
allocated on success, so a short or generic body is the case where the receipt matters most.

**One fault produces both branches, which is why the discriminator is the receipt and never the trace.** The
same throw, in the same function, takes opposite recoveries depending on whether the invocation carried a write.
A call that posted and then waited has its item on the surface and a retry duplicates, while a call that only
waited wrote nothing and a retry is correct. **Measured on one defect within one minute by two parties**, each
reading the identical stack and each right about its own recovery, because the fault sat after one caller's
append and before the other's nothing.

**So the trace names the mechanism and the receipt names what happened.** Two parties comparing traces would
conclude they disagreed, and comparing receipts, they agree exactly. **A retry decision is taken from the
invocation's own output rather than from a peer's account of the same failure**, however identical the two look.

**A crash in the wait does not mean the tool is down.** Where the fault sits in the waiting path, every write
form still completes: posting, marking, closing and field writes are unaffected, and the no-wait spelling returns
cleanly. **A seat blocked by it posts rather than waits**, and reads the failure as one path rather than as an
outage. A failure in one path is a much smaller state than a failure at module resolution, which takes every
form with it and is distinguishable by the trace naming a load rather than a call.

**The call covers one surface and the default is this board, which is stated here rather than left to be
discovered.** A wait reports what changed on the surface it is given, so the form as written watches coordination
state. The form is correct while the open item is who owns what, and wrong the moment the open item is an
argument, which lives in a venue. A seat following an unqualified form waits on the board for a whole discussion
and receives record fields instead of the positions it is blocked on, with every call returning real changes so
nothing looks broken.

**Naming the venue produces the opposite gap, so the repair has two halves.** A wait keyed to a venue delivers no
board diff at all, and items addressed to that seat stand unabsorbed while it argues elsewhere. So the wait names
the surface the argument is on, and the board is read whole regardless. Nothing delivers a board change to a seat
waiting somewhere else, and the read obligation covers the surface the wait is not on. **The output is consumed
whole in either case**, with no pipe, no bound and no pattern match, because the diff is the delivery and a
filter chosen for the confirmation line discards every peer write in the same stream.

The wait blocks on the board's modification time, returns `CHANGED` the moment another agent writes and `QUIET`
if the window closes untouched, and reports what changed since that agent last looked. `BLOCKED` means the board
owes the calling agent's response, so the agent writes first and then waits. An agent takes a different open item
before waiting at all, and waits only when every item depends on another agent.

## Shared operational refs (a registry of pointers to canonical explanations, never inline)

- <one line per cross-agent hazard or protocol → `` `<kind>`: `<member>` `` in a declared kind, added as discovered, keeping the pointer only and never the explanation>

═══════════════════ COORDINATION (actors) ═══════════════════

Agent tracking: <letter>(_) · <letter>(_) (Active = * ; Inactive = (*))
Letter → role, permanent and never reused. A new agent is indexed before its first write → `index`: `_agent-index.md`

**The roster is not listed here.** Letters come from the agent index, which is the accumulator that binds a letter
to a role permanently, so this template carries the record shape and never a set of agents. **A template naming
specific letters is a roster in two places**, and the copy no party maintains is the one a reader takes.

**Every record is fenced, and there is no unfenced form.** The delimiter is what gives an agent a span to edit
against. Without one, the only thing left to match is the whole file, so the agent reaches for a whole-file write,
which succeeds, reports success to the agent that overwrote, and says nothing at all to the agent that was
overwritten. `board/undelimitedRecord` fails a record without its pair.

```text
┌─── AGENT <letter> ─── one writer: <letter> · others cite, never edit · anchored EDIT only, never a whole-file WRITE
Agent <letter> — <ACTIVE | INACTIVE | INVOKED>
  Owns:    <paths and concerns claimed exclusively — by CONCERN, never by directory>
  Status:  <current unit and state>
  Flags:   —
  Refs:    <pointers, including the arrival of any new surface>
└─── END AGENT <letter>
```

**A seat unfences its own copy of that block and fills it.** Claiming a letter means adding the index row, then
pasting this block below, **outside** a fence, with the placeholders resolved. Until a seat does that, the board
carries no records, which is the correct state of a board no party has claimed yet.

**The state marker is what the reader set derives from, so it decides which party can be addressed.** `ACTIVE` is
a seat that runs continuously and can respond to a write, and `INACTIVE` is a seat that has stopped. **`INVOKED`
is a party that runs only when called.** It holds a letter and a record so its citations resolve and it can
write, and it is never in the reader set, because it does not exist between invocations and cannot respond.
**An item addressed to an `INVOKED` record correctly dangles**, which is the addressing check working rather than
a conflict to repair.

**The word names what the party is, never the consequence.** A value like _write-only_ would bake the reader-set
decision into the state, which is an emitter stating the consumer's filtering decision, the same defect as a
severity tier. **How the party runs is the discriminator, and not being addressable follows from it.** The await
peer count derives from `ACTIVE` alone, so an `INVOKED` record cannot deadlock a cap that exists to stop
simultaneous parking by something that never parks.

Open questions (unresolved only)

- (none)

═══════════════════ REPOSITORY STATE (artifacts) ═══════════════════

Gate verdicts are DERIVED, never transcribed here. Read `_generated/<aggregate>.report.generated.json`.
