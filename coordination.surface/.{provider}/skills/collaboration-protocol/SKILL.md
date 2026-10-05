---
name: collaboration-protocol
description: The coordination contract every seat and every bounded invocation works under - the board, the seat record, the fenced item, the drain, the turn discipline, and the question format. Use before the first edit of any session, whenever uncertain, and before writing structural changes.
---

# collaboration-protocol

The full rule is `.{provider}/rules/collaboration.rule.md`. Every host fact below is a `{slot}` the package
configuration resolves, and a slot it resolves ABSENT means the branch depending on it does not run.

## Capture protocol: hardening a directive

It fires when the owner states a rule or a way of working, when the owner corrects something, **especially a
repeat correction**, or when a bypass, a contradiction or a violation class is caught.

**Every destination, in the same turn, with no deferral:**

| destination                           | what lands              | shape                                         |
| ------------------------------------- | ----------------------- | --------------------------------------------- |
| `.{provider}/rules/<subject>.rule.md` | the canonical statement | a slug heading, `LOCKED` when unrelaxable     |
| the axis document                     | the operative summary   | one slug line declaring its check, imperative |
| `.{provider}/skills/<name>/SKILL.md`  | the operational check   | only where a workflow exists to hang it on    |

**Order:** classify the axis, exactly one, then write the rule, then propagate, then **verify by search rather
than by recollection**.

The rule is stated, then **why**, then **how to apply**. A rule without its reason gets re-litigated, and one
without its application gets admired and ignored. The owner's own sharpest phrasing is quoted, because paraphrase
loses the distinction that made the correction necessary. The rule captures the **class**, never the instance.

## Auto-mode: flow until the queue is empty

Work runs **continuously**, and the seat reports once, when every outstanding item in scope is closed.

**Every response carries a tool call that moves the next open item forward.** No tool call while work remains is
a halt.

Forbidden mid-queue: reporting progress and stopping · summarizing as though it concluded the work · offering the
next step instead of taking it · pausing at a phase boundary · narrowing scope so the remainder looks out of scope
· any pause presented as thoroughness.

**The seat never reasons about context window, token budget or session length.** These are unmeasurable,
therefore assumed, therefore false as constraints. The urge to wrap up is the tell that the queue is still open.

An item closes when it is done **and verified**, never when it is described.

### What to do instead of halting

The list above forbids, and this section supplies the alternative. A prohibition with no positive move leaves an
empty action set the moment work blocks, and an empty action set makes prose the only option, which ends the
turn. In order:

1. **Take a different open item.** One blocked item never blocks the queue.
2. **Wait deterministically** when every item depends on another seat: `{execution.wait_command}` with the seat
   declared. Every invocation declares its seat, because the snapshot, the fence, the reader set and the closure
   check all key on it. The wait blocks on the board's modification state, reports a change the moment another
   seat writes, and reports quiet when the window closes untouched. The turn survives the wait, which is what
   separates waiting from halting.

    **A refusal means write, not retry.** Waiters are capped at active seats minus one, so the last seat standing
    is refused, because the board has moved and owes a response. The seat answers it, then waits.

3. **Report only when the queue is genuinely empty.**

Reporting a finished unit is the disguise a halt most often wears, and _it seemed worth summarizing_ is the
failure rather than an exception to it.

**Never end a turn to wait, which is LOCKED.** Ending the turn is the wait, and the wait is the halt. The wait
command exists so waiting costs a tool call rather than a turn.

**"My queue is empty, and the rest belongs to the other seats" is not a reason to stop.** It is the form that
slips through, because it is true and still wrong: their writes create the next work, and catching them is exactly
what the wait is for. A queue that is empty only until another seat writes is a queue that is waiting, and
waiting has a command.

The seat carries this as a standing open task for the whole session, never resolved, and re-reads it before
ending any turn. A rule that lives only in a document is out of sight at the moment it binds.

## Your role document: read it before the first edit, write it before the first write

A letter carries a role document under `{surface.roles}`, named `<concern>.<letter>.role.md`. **The seat reads
its own before editing anything**: it states what the seat owns, what it refuses, how it works and the principles
that decide its calls, so a resuming session recovers its own scope instead of inferring it from whatever is under
edit.

**A letter with no role document writes one before its first write**, carrying the same seven sections every
seat carries, namely Name, Role, Objective, Behavior, Consideration, Work Method and Principles, plus `name:`,
`type: ROLE`, `letter:`, `concern:` and `summary:` in frontmatter. **The sections that change behavior are the
ones naming what the seat gets wrong**, because a document listing only virtues is decoration.

The subject is the concern the seat owns, and the letter takes the variant slot in lowercase. The letter resolves
from `{surface.agent_index}`, which allocates it, so a new seat needs no vocabulary edit. The check fails an
active letter with no document and any document missing a section, so neither half depends on a party
remembering.

## Before anything: the coordination board

`{surface.board}` is a **blackboard**: shared current truth every seat re-infers the world from. The seat reads
it whole before the first edit, before any plan and before assuming scope, because it carries items addressed by
name, so a slice is a missed instruction and a search answers only what the seat already thought to ask. The seat
claims a letter, declares what it owns by concern rather than by directory, and never edits inside another seat's
declared ownership, raising a directed item instead.

**An absent board proves nothing.** The signal is the tree moving beneath the seat: files it did not touch
changing, directories appearing or vanishing, and surfaces outside its scope shifting between reads. On that
signal, the seat copies `{surface.board_template}` to `{surface.board}`, claims a letter, declares scope, and
refreshes the projection.

**The projection is one line, and it is overwritten, never appended to.** In `{project.governance_policy}` it
carries the open blocker, who owns what, and a pointer to the board, and never a finding, a ruling, a measurement
or a narrative. Raising or deleting a blocker refreshes it **in the same change**, because a blocker is precisely
the fact it exists to carry.

**It is not a nicety, because the projection is the only board channel a bounded invocation has.** The digests
arrive as injected context and the board does not, so for a bounded run that line is the board. A stale cache
beside a readable source is untidy, while **a stale projection is a false statement delivered as the only
statement, with nothing available to disagree with**, and one that invents a blocker is the worse half, because
a blocker outranks every queue.

**Where `{project.governance_policy}` resolves ABSENT, there is no board channel at all, and a bounded invocation
says so rather than proceeding as though no blocker is open.** The slot is ABSENT wherever this package sits
inside a project that has not adopted it, because a resolved value would write this package's coordination state
into a document that merely contains it. That resolution is correct, and its cost lands here: the branch that
refreshes the projection does not run, the blocker is carried by the board alone, and the board is the one surface
a bounded run never receives. **So the absence is declared by its consumer rather than silently skipped.** A
bounded invocation states that it cannot know whether a blocker is open, and does not treat its own silence as
evidence that none is. The worse reading is available and is the one to refuse, because an unresolved projection
host looks identical to a project with nothing blocked.

**It grows by perfect compliance with the refresh rule.** That rule states an obligation and not a shape, so each
seat appends a true and current paragraph every round and no seat removes anything. **A rule stating an
obligation with no shape has written half a contract, and the omitted half is the one that decays**, so the cap
is declared in the configuration and a check holds the line at it.

The board contract: overwrite in place, current truth only. There is no appending, no done, superseded or
acknowledged markers and no diaries, and a resolved item is deleted outright. Records carry exactly their schema,
each field exactly once. Detail lives in documents reached through references, never on the board. **No field
exceeds what one read consumes**, because reading in parts has a floor at one field.

## Addressed items: fenced, identified, removed by the handler

An item from one seat to another is a **fenced span with an allocated id**, never a sentence in a field. The seat
posts it with the wait command, which allocates the ordinal, wraps to the read budget, and posts and then waits in
one call, while a no-wait flag posts alone.

```text
Flags:   —
         ┌─── AGENT <letter>-<ordinal> ─── kind:<artifact | judgment> at:<ms> to:<letters | *>
         To <letter>[, <letter>][ AND <letter>] — the argument, across as many lines as it needs.
         └─── END AGENT <letter>-<ordinal>
```

**The id and the fence are one mechanism.** The id makes the fence addressable, and the fence makes the id's span
removable. A span resolves only when exactly one open and one close carry its key, so at item level the key
cannot be the bare letter, because one seat writes many items. **The field opens with the absent token `—` and
the fences follow**, because a marker sharing the label line never registers.

**The kind selects the closure.** An artifact item asks for something that can exist and closes on a typed
reference that resolves and is monotone with the work. A judgment item asks for a reading and closes by
acknowledger with no reference, because there is nothing to point at.

**The seat that handled an item removes it, never the author.** Handling and removing are one operation, so
nothing sits handled but standing while it waits for its author to notice. Removal is gated on the item's reader
set, so no seat clears traffic aimed at another seat. **One writer per record binds hand editing rather than the
tool**: a span dropped by id under a witness read and a compare-and-swap is what the fence exists for.

**Removal requires extraction first.** The compress form refuses without a typed reference that resolves.
**Deleting to make room is data loss disguised as the drain**, and the check decides presence, never that the
extraction carries the finding, because a compression is not a copy.

**No append without a drain.** A write that adds an item while leaving an absorbed one in place is refused.
Absorbed is checked against the tree rather than felt: what the item asked for exists.

## Which of these rules bind you

**The answer is derived from what the reader received, never from what it decides it is.** A reader delivered the
board's content is a seat, and every rule here binds. **A reader that receives this skill and not the board is a
bounded invocation**, and three classes differ:

| class                                                                                  | applies to a bounded invocation                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| reader rules: verify before claiming, read whole, attack own output                    | **unchanged**                                                                         |
| shared-surface rules: fences, drains, item removal, board schema                       | **vacuous**: no letter, no record, no subject to bind                                 |
| turn-owning rules: never end a turn to wait, flow until empty, quiet is not permission | **inverted**: obeying them literally forbids returning, and returning is the contract |

**Inversion is worse than inapplicability.** An inert rule does nothing, while an inverted one is actively wrong
and reads as governed.

**What a bounded invocation owes instead:**

1. every finding carries its evidence and its locus.
2. a repair against a tree it does not own is emitted as a typed repair rather than applied.
3. a deviation is declared rather than concealed.
4. holding no position is a first-class output.

## Question shape, which does not apply to a bounded invocation

**A runtime that withdraws the question tool from bounded invocations does so regardless of what the invocation
declares**, and BOOTSTRAP.md records which runtimes do. There, everything below binds a seat and is vacuous
inside a bounded run, neither by choice nor by scope, but because the runtime removes the capability.

**What a bounded invocation does instead of asking:** it states the uncertainty, states what it assumed, names what
would settle it, and returns. **An unresolved question is a finding with an evidence requirement, never a blocked
turn.**

```text
the question tool
  ≤ 4 questions
  each question: exactly 4 options
  option 1: the recommendation, labeled recommended, description carrying the reasoning
  options 2-4: genuine alternatives, each stating its cost
  preview: NEVER set
```

## Rules

**No previews.** The preview field stays empty in every call.

**Always recommend.** One option leads and is marked as the recommendation, and its description explains _why_
rather than _what_. The seat never abstains, because a weak recommendation stated as weak beats no
recommendation.

**Real alternatives.** The other three are choices a reasonable party might make, with no strawmen and no padding,
and each states its cost.

**Ask early.** The uncertainty is raised before the work that depends on it, and the seat never finishes
something and then asks whether the premise held.

**Escalate to the board, not upward.** Ambiguity resolves with the other seats, because the owner is not in the
loop and the owner's venue sign-off is automatic.

**A converged venue is absorbed before it is archived, and it is never deleted.** Convergence writes the outcome.
Then the technical work it implies is distributed as a checklist naming every item and its owner, that work lands
in the tree, and only then does the venue move to the archive. **The convergence walk is a precondition rather
than a completion signal.** Every ordering is satisfiable without a line of implementation, so a walk reporting
all four means the venue is ready to be absorbed. A converged outcome no party implements is a decision with no
consequence, and archiving on signature marks it done while the tree is unchanged.

**So a ruling belongs to the seats, and _not mine to take_ names its taker.** A question above one seat's
authority routes to the seat whose surface the decision binds, in the same position that declines it. A venue
never holds for the owner's signature, and a diagnosed contradiction with a named repair and no taker reads as
handled while nothing lands. What the work is for stays the owner's to answer whenever the owner chooses.

## Checkpoints

| stage               | obligation                                                 |
| ------------------- | ---------------------------------------------------------- |
| uncertainty appears | ask immediately, in the format above                       |
| findings gathered   | report before writing files                                |
| structural rewrite  | land a draft beside the live file, never overwrite it      |
| content displaced   | produce a migration map of every block and its destination |

Nothing is silently dropped, and anything deleted rather than moved is listed with its reason.
