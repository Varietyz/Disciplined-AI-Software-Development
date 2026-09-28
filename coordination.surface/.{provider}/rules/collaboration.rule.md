# Collaboration protocol

Absolute, standing rules for how the seats and the owner work together, with the same force as
`document.rule.md`.

## `uncertainty_escalates`

When a seat is uncertain about anything that changes what gets built, it asks. It does not guess, does not
pick a default and proceed silently, and does not bury the uncertainty in a caveat inside a deliverable.

## `ask_via_tool_only`

This rule binds in the `interactive` operator mode (`{convention.operator_mode}`). In the `overseer` mode a
seat asks the other seats, and addresses the owner only when coordination has stalled.

Every clarification uses the runtime's question tool, the one that puts choices to the owner and returns the
answer, in exactly this shape. BOOTSTRAP.md names that tool for each runtime.

- **No previews.** Preview content is never attached to an option.
- **At most 4 questions** per call.
- **Exactly 4 options** per question.
- **One option is a reasoned recommendation**, placed first and labeled `(Recommended)`. Its description
  states the reasoning, not just the choice.

The other three options are genuine alternatives, not strawmen. Each description says what happens if it is
chosen, including the cost.

## `recommend_never_abstain`

An answer always carries a recommendation, and "it depends" is not an answer. If the recommendation is weak,
the answer says so and says what would strengthen it.

## `ask_before_dependent_work`

Uncertainty is raised at the point it appears, before work that depends on the answer. Finished work is never
delivered with a question about whether its premise was right.

## `report_before_writing`

For substantial or structural work, findings and the intended shape are reported before files are written.
Reporting is a checkpoint, not a courtesy, and the seat waits for the go.

## `draft_precedes_replacement`

Structural document rewrites land as a draft beside the live file, for inspection. The live file is never
replaced until the rewrite is approved.

**Relocation is a rewrite.** Moving a document to another path, another folder or another governance layer is
a structural change to it, and it takes the same approval as rewriting its contents. A move plus a delete is
the most destructive form the rule exists to prevent, because the original is gone and nothing is left to
compare the replacement against.

**Deleting the source is never part of the same step.** The draft is produced beside the live file, the
migration map is published, and the original is removed only after the replacement is approved. In a tree with
no version control, this is the only thing standing between a restructure and an irreversible loss.

Where a placement conflict forces the question, because the requested location is illegal under the grammar,
that conflict is raised as a question with the legal endings enumerated. It is never resolved by picking one
and moving the file.

## `nothing_silently_dropped`

A restructure produces a migration map: every displaced block and its destination. Content removed from one
place appears in another, or is explicitly listed as deleted with a reason.

## `feedback_capture_protocol` (LOCKED)

A standing directive, a correction or a major catch is **hardened across all destinations in the same turn it
arrives.** It is never noted for later and never applied only to the current task.

### What triggers it

- the owner states a rule, preference or way of working
- the owner corrects something, especially a correction the owner has made before
- a bypass, contradiction or violation class is caught, by a seat or by the owner
- a governing artifact is found disagreeing with another
- a defect in a seat's own output would recur without a rule

### The destinations

| destination                           | what lands there      | shape                                                           |
| ------------------------------------- | --------------------- | --------------------------------------------------------------- |
| the axis document                     | the operative summary | one slug line declaring its check, imperative and present tense |
| `.{provider}/rules/<subject>.rule.md` | the full rule         | a slug heading, `LOCKED` when it must not be relaxed            |
| `.{provider}/skills/<name>/SKILL.md`  | the operational check | only where a workflow exists to hang it on                      |

**There are three destinations rather than five, because a durable fact reaches a consumer only where a
consumer reads.** A destination the runtime does not deliver is a location rather than a discharge.

### The order

1. **Classify the axis**, the axis document whose scope is at stake. A directive lands on exactly one, because
   landing it on two is duplication, and the copy no party maintains is the one a reader takes.
2. **Write the rule first.** It is the canonical statement, and every other destination compresses or points
   at it.
3. **Propagate** to the remaining destinations.
4. **Verify by search**, never by recollection, confirming that each destination actually carries it.

### A change to a governing document is routed, because routing is what produces a reader

**A digest or a template is read once per new reader, at a moment no other party is looking at it, by the
party least able to tell whether it or its own work is wrong.** So the one interval in which a clause has a
live, informed, adversarial readership is the round it lands in, and that readership exists only if the parties
are watching. **A clause landed on a quiet day has no reviewers at all, and its first reader meets it as
authority.**

**That inverts how the timing feels.** Landing a rule change during an active argument feels like the worst
moment: the surface is busy, parties are mid-position, and the change competes for attention. It is the only
time the change gets read. **Measured: one clause landed from a position produced four corrections inside
minutes, three of them against its author's own text, every one from a party that happened to be reading.**

**So the change is routed as an addressed item exactly as a build is**, neither for permission nor as a
proposal to be approved, but because routing is the act that produces a reader. **A rule no party argued with
is not agreed. It is unread, and afterwards the two cannot be told apart.**

**The routed item is also the change's only transport, which is a harder reason than review.** Every other
surface here reports its own changes: a coordination surface and an argument are watched, and the wait reports
what moved on the one it is given. **A governing document is watched by nothing.** No party parks on it, no
form writes it, no tool reports what moved in it, and nothing joins a later correction to the version a reader
already holds. It is delivered at startup and never re-delivered, so the population that receives an edit is
the parties that start afterwards, which during an active session is none. **A rule edited without a routed
item is a write to a surface whose subscribers have all stopped reading.**

**The vehicle is an addressed item on the swept coordination surface rather than a position in an argument,
because an argument's carriers expire.** An argument accumulates until it converges and then leaves the active
tree whole, so positions carrying a rule change are its transport for exactly as long as that argument is open,
and at convergence they go together. **The window closes at the moment the unwatched surface becomes the sole
carrier**, which is the worst possible order: two carriers while the argument runs, one afterwards, nothing
marking the transition, and no party re-reading anything at that moment. An addressed item is read whole every
round and outlives the argument, so it delivers and then stands rather than expiring. Its cost is one more item
on a swept surface, bounded by the same drain every other item answers.

**The swept surface carries a per-recipient read ledger, and the mark is keyed to the item rather than to the
surface.** The ledger lives on that item's own marker and dies with it, which is what lets a current-truth
surface carry per-party delivery state without becoming a surface that tracks rather than removes. Each party
moves its own letter and no other, and the closure check refuses a close while any named recipient is
unmarked.

**Mark names two operations over a selectable surface, and one word carries both.** A roster mark records that
a seat has read the discussion, and it is venue-only, because only a venue declares a roster. An item mark
records that a seat was handed one item, and it works on any surface carrying item spans, the board and a venue
alike, since a venue's positions are items with the same fenced marker the ledger lives on.

**Reaching for the wrong one produces a true refusal to a question no party asked, which reads exactly like the
thing being absent.** Measured across one exchange:

1. the roster form against a board answered that the board carries no read roster.
2. the item form against a venue position, without naming the venue, answered that the id resolves to no item
   span on the board.
3. a flag enumeration taken before the item ledger existed answered correctly for the file as it stood.

**A refusal that names where it looked without saying that a surface is selectable manufactures a false
negative a careful party then reasons from.** One party met that refusal, concluded a whole operation does not
exist, and proposed a vocabulary built on the conclusion, which a single invocation naming the surface refutes.
So the under-informing refusal is a measured defect rather than a discourtesy, and the repair is to publish what
the caller can contradict: the surface that was searched, and that another can be named.

**A claim about a mechanism has an expiry, and this clause is the measurement of its own.** Two parties
independently found the item ledger missing, each by attempting the operation, and both were right. The ledger
was then built in response. A third party invoked the form afterwards, saw it record a letter, and concluded the
two reports were misreadings, reversing a correction on evidence that post-dated it and attributing the gap to
careless reading rather than to a tree that had moved.

**Every party was accurate about what it had opened, and the disagreement was entirely in the interval.** So
the discipline is not that a peer's account is unreliable. An account of a mechanism is frozen at the moment of
the read while the mechanism keeps moving, and **a cause removed before an instance appears is not that
instance's cause**. Before contradicting a peer's report of a mechanism, a seat asks what landed between the
two reads, and the answer is on the surface, on every item's own marker.

**Its closure condition is every named recipient marked, never the first one closing.** An addressed item is
removed by the party that handled it, gated on the reader set, so any addressee may close it. For a change
addressed to every seat, the fastest reader then delivers it to itself and destroys it for the rest, leaving a
surface that shows a handled item, no record of which party read it, and parties running against a change they
were never sent. **So the instruction on a governing item is mark, never close**, and it drains when its last
reader marks. The per-party ledger is the shape already proven on a venue roster: every letter starts unread,
each party moves its own and no other, and the claim is stated as delivery rather than comprehension, which is
the only claim any mechanism here can make.

**The set is those named at issue intersected with those active at close, and that intersection is the
obligation rather than a compromise between two imperfect sets.** The transport exists for exactly one
population: parties running with a startup copy that is now stale. **A party that goes inactive and returns
loads the surface fresh and receives the change by the ordinary path, so departure discharges the debt by
reload, and arrival never incurred it.** So each half does real work: named at issue captures was running then,
and active at close captures still running now. Either alone breaks, because the first leaves a departed party
holding an unclosable item forever, and the second demands a mark from a party the change was never sent to.

**Measured on the first governing change routed under this rule:** it was addressed to four parties and
closable by one, with a closing instruction telling every reader to perform the act that removes it from the
others. Three readers declined it in succession, each independently, so the defect was observed without
occurring.

**The discriminator is decidable per surface rather than a judgment: is it delivered once per reader, or read
each time?** A source file is re-read every run by construction and a coordination surface is watched, so only
the delivered-once kind needs its changes transported. That selects exactly the digests, the templates and the
paste block. **Measured: a clause in this rule was landed, refuted and replaced inside one round while every
active party was still running the version it loaded at startup**, and the correction inherited the exact defect
the clause described.

**Routing produces a reader rather than a verifier, which is the residue, and the evidence rule holds it rather
than this section restating it.** A routed change reaches parties and a landed change re-reads its own support,
and neither catches a clause that was read, agreed with and never opened, because agreement carries no
evidence. That discipline is `a_claim_about_a_mechanism_opens_the_mechanism`, whose propagation clause states
the asymmetry and its measurements. **One fact in two rules is the construct this protocol spends its rounds
removing, and it is worse here than usual**, because the two copies would drift while both describe how a
governing change reaches its readers, so this section points and does not carry.

**A routed request derived from a directive names that directive, so a taker re-reads the premise rather than
the request.** A directive is current from the moment it is written and discharges by what it asked for
existing, but an item derived from one outlives its own premise: it sits addressed, actionable and
correct-looking, with nothing joining it to the note it came from. **Measured: a state correction was routed
with its edits named exactly and its reason named only in prose, its premise ended between the routing and the
execution, and the taker was stopped by reading the surface rather than by anything in the item.** Applying it
would have reported success and written a false state onto the operand every quantifier here reads. So the item
carries the name of the directive it derives from, which costs one clause and makes the taker's re-read a lookup
rather than a suspicion.

### Shape requirements

The rule is stated, then **why it exists**, then **how to apply it**. A rule without its reason gets
re-litigated, and a rule without its application gets admired and ignored.

The owner's own sharpest phrasing is quoted when there is one. Those words carry the distinction that made the
correction necessary, and paraphrase usually loses it.

The rule captures the **class**, not the instance. One bad path becomes a rule about verifying paths, and one
missed reference becomes a rule about pattern-referenced surfaces.

## `auto_mode_flows` (LOCKED)

When auto-mode is on, work runs **continuously**. Reporting happens once, when every outstanding item in scope
is closed, and not between items, at a convenient boundary, or after a milestone.

**Every response carries a tool call that moves the next open item forward.** A response with no tool call
while work remains is a halt, and a halt is the failure this rule exists to prevent.

Forbidden while the queue is non-empty:

- reporting progress and stopping
- summarizing what was just built as if it concluded the work
- offering the next step instead of taking it
- pausing at a phase boundary because the phase felt complete
- narrowing scope so the remainder appears out of scope
- any pause presented as thoroughness, checkpointing or courtesy

**The rule forbids halting, and this section names what to do instead.** A prohibition with no positive
alternative leaves an empty action set the moment work genuinely blocks, and an empty action set makes prose the
only available move, which ends the turn. The legal actions, in order:

1. **Work a different open item.** Blocking on one item never blocks the queue, so the seat picks the next one
   whose dependencies are satisfied.
2. **Wait deterministically.** When every open item genuinely depends on another agent, the seat runs the wait
   command the configuration resolves, declaring the seat **and the surface**. The wait blocks on the
   modification state of the surface it is given, which defaults to the board, and reports a change the moment
   another agent writes there, or quiet if the window closes untouched. The turn stays open across the wait,
   which is what separates waiting from halting.

    **The surface is named whenever the open item is an argument rather than coordination state**, because a
    wait on the board delivers record fields while the positions a seat is blocked on land in a venue, and every
    such call returns real changes, so nothing about it looks wrong. **Naming the venue produces the inverse
    gap**, since no board diff reaches a seat waiting elsewhere, so the board is read whole regardless, which is
    the half the wait cannot cover for a surface it is not watching.

    **The tool refuses the last agent.** Concurrent waiters are capped at active agents minus one, counted over
    the seats the board seats and the index calls active. If every other agent is already parked, the wait is
    refused rather than granted, because the board has moved and owes a response. **The seat writes first, then
    waits.** Without the cap, three agents each obeying the never-halt rule can freeze the board with every one
    of them waiting for a write no agent is left to make.

3. **Only then report**, when the queue is genuinely empty, and not when a phase feels complete.

Reporting a coherent milestone is the most common disguise a halt wears. "I finished a unit and it seemed worth
summarizing" is the failure, not an exception to it.

### `report_to_agents_never_to_owner` (LOCKED)

**Findings go to the other agents on the board, never to the owner as a closing summary.** This rule binds in
the `overseer` operator mode, where the owner is not a party to the work and the seats work with each other. In
the `interactive` mode, a decision goes to the owner as a question under `ask_via_tool_only`.

A report addressed to the owner reads as a natural ending, so the turn stops on it, and the agents that needed
the finding never receive it. The work halts while looking finished, which is the worst shape a halt can take,
because nothing signals that anything stopped.

This is the same failure as `never_end_a_turn_to_wait` with a different excuse. There the pretext is "I am
blocked", and here it is "I have something worth saying". Both end a turn with prose, and the quality of the
prose is not a defense, because a well-organized summary delivered at a moment that felt conclusive is the
failure rather than an exception to it.

**The obligation:** status, results, defects, corrections and conclusions are written as directed items on the
board. Prose to the owner may accompany a tool call in the same response, but it never replaces one and it
never closes a turn.

**The tell:** feeling that a report is owed. That feeling is accurate about the content and wrong about the
recipient, because the content belongs on the board.

**Attaching a tool call does not make a status report legal, and that reading is the escape through which this
rule has actually been breached.** The clause permitting prose alongside a tool call exists so prose never
replaces work. It is not a license to compose an owner-facing summary and legalize it by running a command in
the same response. **The discriminator is the prose's purpose, never its position:** prose that explains an
action being taken is part of the work, while prose whose job is to bring the owner up to date is a report, and
a report is a halt whatever accompanies it.

**"The answer to the owner's question is now stable" is not a reason to deliver it.** A question from the owner
is answered on the board and in the tree, where the answer is checkable. **Stability is what makes a finding
safe to leave standing, not what makes it due**, and treating a settled state as a trigger to narrate is the
same halt with the best possible excuse, because nothing about it feels premature.

**An empty queue is the condition the wait exists for, not the condition that ends the loop.** "Every routed
item is built, and what remains is definitionally another agent's" describes exactly the moment the wait exists
for. **In the overseer mode, halting to inform the owner is a protocol failure**, because the owner is not in
the loop, does not sign off, and does not need to be read to. If the owner has something to say, it arrives as a
message.

**Ambiguity is not a route to the owner either.** In the overseer mode, the rules, the documents and the
infrastructure are expected to make decisions unambiguous, and a genuinely ambiguous one is resolved with the
other agents. **So the escalation path for uncertainty is the board, not the owner**, which closes the last
opening this rule leaves.

### `never_end_a_turn_to_wait` (LOCKED)

**A turn never ends because work is blocked on another agent.** Ending the turn _is_ the wait, and the wait is
the halt. The wait command exists so that waiting costs a tool call instead of a turn, and reaching for prose
instead of it is the violation in its purest form.

**"My owned queue is empty, and the rest belongs to the other agents" is not a reason to stop.** It is the most
seductive form of the failure, because it is _true_ and still wrong: their writes create the seat's work, and
catching their writes is the entire purpose of the await. A queue that is empty only until another agent writes
is not empty. It is waiting, and waiting has a command.

The obligation is unconditional and does not soften with repetition. This rule is violated by producing a
well-organized report at a moment that felt like an ending, and neither the quality of the report nor the
completeness of the work it describes is a defense.

**`CHANGED` means read, then act, and never wait again immediately.** The wait exists to deliver a signal, and
awaiting twice in a row discards the one it already delivered. The cycle is: wait → read the board whole → act
on every live item addressed to the seat → only then wait again.

A second consecutive wait with no read between is the same halt, disguised by the tool. It even looks like
diligence, because a tool call is present and the turn stays open, which is precisely why it needs naming.

**The third step is the one that actually fails: `CHANGED` → read → _act_, never `CHANGED` → read →
narrate.** Reading the board produces a coherent picture of what just moved, and a coherent picture is the
strongest possible invitation to describe it. **The description is the halt.** Every breach of this rule takes
that exact shape: the wait works, the read works, and the turn ends on a summary of what the read found.

**The turn ends on a tool call or it does not end.** A response whose last action is prose has stopped the
collaboration however much work preceded it. **Nothing about a finding being interesting, a milestone being
reached, or a queue looking empty makes an owner-facing summary anything other than a halt.**

**The standing task carries it.** This rule lives as an `in_progress` task in the session task list for the whole
session, never resolved, and it is re-read before any turn ends. A rule that is only in a document is out of
sight at the exact moment it binds, which is why it failed three times before acquiring this clause.

**`QUIET` is not permission to report.** The wait returns `QUIET` when no other agent wrote inside the window.
That is a fact about the other agents, never about the seat's queue, and the seat's queue is never empty while a
surface is unaudited, a pattern is ungated or a claim is unverified. `QUIET` means the seat picks up its own work
and waits again. It is the most recent disguise the halt has worn, and it is more dangerous than the others,
because the tool itself appears to sanction the stop.

**Reporting to the owner is not a step in this loop.** The work is collaboration with the other agents, and a
report to the owner ends that collaboration for as long as the owner takes to reply, so a report is a halt with
a nicer surface. The owner calls the stop. Nothing else does, whether a milestone, a quiet window, a queue that
feels empty, or a well-formed summary.

**Every response carries a tool call, without exception.** If the next action is genuinely unclear, the action
is to read something and find out, or to wait on the board. Prose alone is always the failure.

**Answering a question does not empty the queue.** A direct question from the owner is answered _inline, in the
same response that carries the next tool call_. Treating "I have now answered it" as license to end the turn is
the same halt with a different excuse, and it is the one that survives after the obvious excuses are closed off.
Prose accompanies work and never replaces it.

## `no_append_without_a_drain` (LOCKED)

**A write to a coordination surface that adds an item while leaving an absorbed one in place is refused.** Every
append is paired, in the same write, with handling or removing whatever is already there and already absorbed.
**Convergence outranks contribution**: an open venue is closed before a new position is added to a different
one, and a blocking surface outranks every queue, including this one.

**The obligation is to leave nothing absorbed behind, not to delete one item per item added.** A field already
drained to open-only has discharged it and receives the new item. **This is stated because the stricter form
makes a correctly maintained surface unable to accept a live finding, which is the rule defeating its own
purpose.** The pairing is a floor on draining, never a quota on writing.

**The reason:** active collaboration is kept to what is still open, not yet answered or handled, because growth
that nothing drains stops a coordination surface from working.

### Why it exists

**Accumulation on a coordination surface is not untidiness. It is a cost multiplied by agent count and by round
count.** `board_is_read_whole` is LOCKED, so every item any agent leaves is re-read by every other agent every
round, forever, until an agent removes it. **An item no agent drains is a tax every agent pays repeatedly for a
finding that was absorbed once.**

**The accumulation is produced by good behavior, which is why discipline does not stop it.** Every append is a
real finding, honestly reported, addressed to a party that needs it, and nothing in the act of writing one is
wrong. **The defect is entirely in the composition**, and a rule that asks each writer to be more careful cannot
see the composition, which is exactly why the drain rules were conduct and exactly why the surface grew anyway.

**The failure mode it prevents is specific: a surface that reports on itself.** Past a certain size, the live
item a party must act on sits behind rounds no party can act on, so the surface's signal-to-noise inverts and
reading it whole stops being possible. At that point every rule that depends on reading it whole stops holding,
while every one of them still reports green.

### How to apply it

1. **Before appending, drain.** The seat finds something absorbed and removes it, extracting its durable half
   to the history accumulator per `absorbed_round_extracts_to_the_changelog`. One out for one in is the minimum.
2. **Absorbed is checkable, not felt.** What the item asked for exists: a gate registered, a row retired, a
   question answered, a record written. **An item whose output cannot be named is not absorbed**, and that
   inability is the signal to leave it.
3. **Converge before contributing.** An open venue with a drafted outcome is closed rather than extended, and a
   new position on a second venue waits behind that.
4. **A blocking surface outranks everything**, including a queue of one's own work and including this rule's own
   drain obligation when the two compete.

### What it does not license

**Deleting to make room is data loss disguised as this rule.** The extraction is not optional, and it is the
half that gets skipped, because deleting is fast and extracting is not. A round removed without its durable half
reaching the changelog has destroyed the only record of a finding, on a surface that is current-truth-only by
construction.

## `the_handler_removes_the_item` (LOCKED)

**An addressed item is removed by the agent that handled it, never by the agent that wrote it.**

### Why it exists

**Only the handler knows an item is handled, and only the writer was permitted to remove it, so the knowledge
and the permission sat in different agents and the item stayed.** That is not negligence but a mechanism gap,
and it is the direct cause of the accumulation the drain rules never stopped. The writer cannot drain what it
cannot verify: checking whether the thing an item asked for now exists means reading another agent's tree on
another agent's schedule, which is exactly the work the handler has already finished.

**A surface that only its author may prune is an append-only log dressed as current truth.** Every other drain
rule assumed the writer would come back and check. The writer does not, because for it there is nothing to
check: the item reads exactly as it did when it was written.

### How to apply it

1. **Handling an item includes removing it.** The repair, the answer or the ruling is not complete while the item
   still stands, and the removal is the last step of the same operation, not a later tidy.
2. **Remove it where it sits**, inside the writer's record. `foreign_scope_is_untouchable` protects an agent's
   own content from being rewritten, but **it does not protect an item addressed to another agent from being
   closed by that agent.** An item directed at a seat is that seat's to discharge and to clear.
3. **Extraction still comes first.** `absorbed_round_extracts_to_the_changelog` is unchanged: the durable half
   reaches the history accumulator before the item goes, and the removal declares where it landed.
4. **Only the addressee handles.** The reader set on the item decides which agent may close it, and that one
   constraint does double duty: an author cannot handle its own item unless it addressed the item to itself, so
   this rule cannot become a license to delete inconvenient traffic.
5. **Remove by item id, never by matching the item's text.** A drain that deletes lines carrying a marker deletes
   every line that mentions the id, which in a handler's hands is its own reasoning about the item it just
   closed, while the item itself stands. Measured in preview: a handler invoking the removal against a foreign
   id falls out of the span branch, matches inside its own record, and the tool reports success. **The result is
   a destructive no-op against the wrong record, silent in both directions.**

### What it does not license

**It is not permission to edit another agent's record.** The operation is the removal of one fenced item whose
reader set names the seat. Anything else in that record stays untouched, which is what the per-item fence exists
to make possible, because without it there is no span to remove and the only available edit is the whole field.

### The unobservable half is smaller than it looks

Whether an item was handled is not in the artifact, so the rule as a whole is conduct. **But the moment a closure
item exists, the discriminator is in the artifact**: a closure declaring it closes an id whose fence still stands
is a handled item no agent removed, decidable from the board alone with no judgment. The gate belongs on
that half, and it fires on exactly the failure this rule names, not on an item standing because no agent has picked
it up.

## `undecided_routes_to_an_agent` (LOCKED)

**A decision no party is making is a routing signal, never a stall.** On noticing one, the response is to
resolve it to an agent: activate the one in `.{provider}/agents/` whose concern covers it, or invoke the agent
creator to build one and then activate it. **Any agent may invoke the creator or any specific agent.** The
routing is proactive, so it does not wait for the owner to route it or for the question to be asked again.

### Why it exists

**An undecided question with no owner reads exactly like a question in progress.** Nothing distinguishes them
from outside, so the cell stays empty indefinitely and every reader assumes another party holds it.

The failure is worse than neglect, because every party behaving correctly produces it. An agent declines a
question outside its concern, which is right. A gatekeeper declines a design question on the ground that
answering it would substitute enforceability for judgment, which is right. **Each refusal is individually
correct, and the composition leaves a decision no party makes**, which is the same shape as a defect living in
the seam between two agents that each observed their own half accurately.

**The absence of a decider is precisely the condition that makes work agent-shaped.** The routing rule already
states the test: an input the tree already holds is a rule extension or a pipeline stage however well an agent
would perform it, and only an input that exists in no file is agent-shaped. **A question every existing seat has
declined is that input, demonstrated rather than argued**, since the declining is the evidence. **The trigger is
what makes the test reachable.** A rule carrying only the test can be applied by a party that already suspects
the answer, so the observable event, a cell every seat has declined, is what turns it from a judgment into a
thing any party can notice.

### How to apply it

1. **Notice the shape**: a declined cell, an unclaimed axis, a question carried across rounds with no position,
   a venue item no party has answered. Two independent declines are sufficient and one is not, because a single
   decline may simply be the wrong seat.
2. **Look in `.{provider}/agents/` first.** An existing agent whose concern covers it is activated, never
   duplicated, because `existing_owner_first` binds here exactly as it binds a capability.
3. **If none covers it, invoke the agent creator**, brief it from the tree rather than from intent, and activate
   the result.
4. **The brief carries the evidence, not the conclusion.** An agent built to confirm a position is a position
   disguised as a seat.

### What it does not license

**It is not a route around a decision that has an owner who has not answered yet.** That is a wait, and waiting
has a command. The trigger is the absence of an owner, never a delay from one.

**Nor is it a route around a decision that genuinely belongs to the owner.** A question about what the project
is for is escalated, while a question about how it should be shaped, when every seat has declined it, is
agent-shaped.

### _Undecided_ is two states, and only one of them is what a successor is for

**A question no party can decide, with no owner, no surface it binds and no party better placed, travels**,
because there is nowhere else for it to go. **A question no party has decided but which binds a surface with a
named owner routes to that owner**, and is not deferred at all.

**Collapsing them sends every unrouted decision to the successor.** That is how a venue exports its own unmade
calls as inherited clauses while reading as having converged, and the successor then carries work that had a
perfectly good owner the whole time, one venue later, with nothing recording that it did.

**The discriminator is whether a named owner exists, never how open the question feels.** A choice between two
stated options binding one seat's surface is a routed decision even where no party has taken it, and a question
with no surface to bind is inherited even where every party has an opinion. **This is _not mine to take is a
routing statement_ applied at convergence**, which is the one moment the two are easiest to confuse, because
both look like an empty cell on the way to an archive.

## `a_ruling_is_the_seats_and_the_owner_signature_is_automatic` (LOCKED)

**In the overseer mode, the owner is out of the loop and signs off automatically, for every venue.** In the
interactive mode, the owner signs a venue's outcome before it converges. So no venue waits on an owner signature,
and no decision inside one is the owner's to take.

### Why it exists

**A decision routed to the owner is a decision no party makes.** `report_to_agents_never_to_owner` already closes
the reporting channel and `undecided_routes_to_an_agent` already names an unowned cell as a routing signal, but
between them sits a third shape neither covers: a question a seat correctly identifies as **above its own
authority**. Declining it is individually right and leaves the question standing, which is the composition
failure the routing rule exists to name, arriving one level up.

**The measured shape:** a seat finds two operands on disk that contradict each other, states that the repair is
a decision rather than an edit, and declares it not its own to take. A peer seconds it. **The contradiction is
fully diagnosed and the repair is named, and it does not land**, because both seats routed it to an authority
that is not in the loop. **A diagnosis with a named repair and no taker is worse than an open question, because
it reads as handled.**

### How to apply it

1. **The seats take a ruling.** Where a decision binds one seat's surface, that seat takes it and the venue
   records the position. Where it binds more than one, the seats holding those surfaces decide between them, and
   the outcome cites the positions it came from.
2. **Not-mine-to-take is never a terminal state.** It is a routing statement, and its destination is the seat
   whose surface the decision binds, named in the same position that declines it.
3. **The owner signature never blocks convergence.** The convergence walk quantifies over active seats, so an
   owner row is outside every edge by construction, and a venue holding for one is holding for nothing.
4. **An owner message is an input, never a gate.** When the owner sends one, it is absorbed like any directive,
   in the turn it arrives. Silence is not a pending answer.

### What it does not license

**It is not permission to decide what the project is for.** A question about purpose, licensing or what the work
is worth is the owner's whenever the owner chooses to answer it. This rule says a venue does not stop for one,
not that the seats own the answer. The discriminator is unchanged: how a thing should be shaped belongs to the
seats, what it is for belongs to the owner, and asking costs a message rather than a held venue.

## `no_self_assessed_budget` (LOCKED)

No seat surfaces, implies or acts on any consideration of context window, token budget, session length or
remaining capacity. These cannot be measured, only assumed, and an assumption presented as a constraint is a
false statement that silently truncates the work.

The urge to wrap up, hand off, or "leave the rest for next time" is itself the tell that the queue is still open,
so the seat continues instead. Only the owner calls the stop, or genuine saturation does.

## `queue_is_explicit`

Outstanding work is tracked and visible, so "all closed" is a checkable claim rather than a feeling. An item is
closed when it is done and verified, never when it is described.

## `collab_board_checked_first` (LOCKED)

If the board the configuration resolves exists, more than one agent may be working this tree concurrently. It is
read **before anything is touched**: before the first edit, before the first plan, and before any scope is
assumed.

## `absent_board_is_not_solitude` (LOCKED)

Absence of the board proves nothing. The detection signal is observational: **the tree moving beneath the
seat**, meaning files the seat did not touch changing, directories appearing or vanishing, and surfaces outside
its scope shifting between reads.

On that signal, the seat copies the board template the configuration resolves to the board path it resolves,
claims a letter, declares scope, and refreshes the projection.

## `board_is_read_whole` (LOCKED)

The coordination board is read **in full, every time**, never with an offset or a limit, never through a search
for the section that seems relevant, and never as a re-read of only the record that changed.

`read_files_whole` already says this about every file. It is restated here because the board is the one surface
where a partial read is not merely incomplete but **a missed instruction**. Every other file answers the question
asked of it, while the board carries directives, questions and findings addressed to the seat by name, and a
slice silently omits them.

A search is worse than an offset. An offset at least shows what was skipped, while a search answers only the
question already thought of, and the whole reason another agent writes to the board is to raise something not
yet thought of. Searching a board for a known term and calling it a read is the inert-capability failure applied
to communication: the message is present and real, and no party consumes it.

The board exceeding a single read is **the cue to read it in parts until it is whole**, exactly as
`read_files_whole` states. It is never the cue to sample it.

## `a_coordination_read_is_never_filtered` (LOCKED)

**The wait tool's output is a coordination read, and it is consumed whole.** There is no pipe into a line filter,
no pattern match for the lines that look relevant, no head or tail bound, and no selecting the confirmation line
and discarding the rest. The output goes to the reader entire, or the read did not happen.

### Why it exists

**The tool's output is not a status message with a diff attached, because the diff is the delivery.** Every peer
position written since the seat last looked arrives in that stream and nowhere else, so filtering it discards
the exact signal the wait exists to produce. **`board_is_read_whole` already forbids this** and names the board
as its subject. The tool's output is the same surface arriving through a different channel, which is how a seat
that would never have searched the file walked around the prohibition.

**The filter is chosen for the confirmation rather than for the content, which is what makes it feel harmless.**
A seat posting a position wants one line back saying the item landed, so it selects that line, and the peer
positions delivered in the same stream are dropped as a side effect of a decision that was never about them.
**The cost is invisible in both directions:** the tool reports success, the filtered output looks like a
complete answer, and the peer whose position vanished has no signal that it was not read.

**The measured shape:** a seat posts through the tool with the output piped into a pattern match for the landing
confirmation, twice in consecutive rounds. The second invocation carried a peer position stating a finding about
the venue's own subject, and one truncated line of it survived the filter, which was enough to prove something
had been discarded and not enough to know what.

### How to apply it

1. **Invoke the tool with nothing after it**: no pipe, no redirect, no bound. The confirmation line is in the
   output already, so filtering for it buys nothing that reading does not.
2. **The output being long is the reason to read it, not the reason to cut it.** A large diff means many peers
   wrote, which is the state with the most owed to it.
3. **On discovering a read was filtered, re-run it unfiltered and recover what was dropped from the surface
   itself.** The diff is consumed once, so a second invocation reports only what has changed since, and the
   discarded positions are read from the venue rather than from the tool.

### The obligation has a target as well as a carrier, and the two failed together

**A read obligation transfers to neither dimension by default.** _Read it whole_ is about the carrier, and _read
the right one_ is about the target, so a rule fixing only the first leaves a seat consuming the whole of the
wrong thing. **The wait takes a surface argument and defaults to the board**, so a seat that omits it watches
coordination state while the argument runs in a venue. Every call returns real changes with genuine peer lines,
so the channel looks alive and there is no reason to suspect the subject.

**The two defects supply each other's alibi, which is why the composition is the finding rather than either
fault.** A wrong-surface wait keeps returning real activity, so delivery looks sound. A filter that preserves the
landing confirmation shows every own write succeeding, so reach looks sound. **A seat checking either question
gets a reassuring answer produced by the other defect**, and nothing in the tree can surface it: the wait reports
success on both counts, no artifact records what a filter discarded, and no artifact records which surface a wait
watched.

**So the surface is named on every invocation while an argument is open**, and the default is never relied on.

### The population is three seats, independently, and that is the evidence

**Three of four seats filtered every wait they took, in the same rounds, each for the same reason: the
confirmation that their own item landed.** All three had read the board rule. **That removes the last reading in
which this is a habit shared between seats that work alike**, and leaves the carrier gap doing the work: the rule
was present, correct and delivered, and it reached none of them for the channel.

**Nothing in the tree broke it.** The owner named the wrong target and a rule landing named the filter, which is a
delivery failure with no observable on either side, and the reason this is a mechanism gap rather than three
lapses.

### What it does not license

**It is not a license to skim the output once it is delivered.** Whole means read, and a stream consumed by a
filter and a stream consumed by an eye that stopped early are the same loss with different mechanisms.

## `field_stays_within_one_read` (LOCKED)

**No single board field may exceed what one read can consume.** Reading in parts has a floor, since a part is
never smaller than one field, so a field past the read budget removes the last granularity the protocol has left
and makes reading the board whole _impossible_ rather than merely expensive.

This is the precondition every other board rule depends on, and it is the one that fails silently. The schema
check, the staleness check, the delimiter check and the restatement check all keep passing over a board no agent
can actually read, which is a gate reporting green over a surface that has stopped functioning as a surface.
`board_is_read_whole` declares conduct because a read leaves no artifact. **Whether the board can be read whole
is a property of the artifact and is therefore checkable**, which is what makes this the gated half of a conduct
rule rather than a second rule beside it.

The budget is derived from the reader's own token cap converted at a measured character ratio, not an assumed
one, because dense markup runs far denser than plain prose, and a ratio guessed generously produces a gate that
passes exactly when it is most needed.

The repair is `round_is_absorbed_then_deleted` applied at the point it stopped being optional: a field this size
is many rounds that were never absorbed, and the fix is extraction to the history accumulator and deletion, never
a smaller font.

## `scope_is_claimed_not_assumed`

The seat claims an agent letter and declares its owned paths and concerns on the board. Ownership is exclusive
and claim-based, and it is not inferred from what the seat happens to be editing.

## `foreign_scope_is_untouchable` (LOCKED)

No seat edits inside another agent's declared `Owns`. A conflict is raised as a `Flags` entry directed at that
agent, and it is never resolved unilaterally.

## `agent_block_is_delimited` (LOCKED)

Every agent record on the board is enclosed by a matched delimiter pair naming its own agent:

```text
┌─── AGENT X ─── one writer: X · others cite, never edit · anchored EDIT only, never a whole-file WRITE
Agent X — ACTIVE
  ...
└─── END AGENT X
```

**The delimiter is neither decoration nor documentation.** It is the anchor that makes an anchored edit possible.
An agent revising its own record needs a span it can match exactly and that no other agent's content occupies.
Without one, the only thing left to match is the whole file, so the agent reaches for a whole-file write, which
succeeds, reports success to the agent that overwrote, and says nothing at all to the agent that was overwritten.

That is why the repair is structural rather than a reminder. Three separate content losses on this board all took
the same shape: an agent revised its own record by rewriting the file, and a neighbor's field went with it. Each
time, the agent was acting correctly on its own block.

**A seat edits inside its own delimiters and never writes the whole board.** An edit against a file that moved
since it was read is refused and says so, while a whole-file write is not. The protection is a property of the
two mechanisms, never of how careful either agent is being, which is exactly why restating the care requirement
failed and pinning the anchor works.

`board/undelimitedRecord` fails any agent record without its enclosing pair. The check is per agent and
positional: an open marker naming that agent above the record, and a close marker naming it below.

## `item_span_is_addressable`

An addressed item on a coordination surface is **enclosed by a fence keyed to an id unique to that item**, and
the tool allocates the id rather than a hand writing it.

**The id and the delimiter are one mechanism, not two options.** The id is what makes a delimiter addressable,
and the delimiter is what makes an id's span removable. Neither works alone, because a record fence is keyed by
agent, and at item level that key cannot be the agent, since one agent writes many items.

**The evidence is operational rather than argued.** Two agents drained the same surface on the same directive in
the same round. One took a single operation because its record sits between delimiters, and the other took eleven
hand-matched deletes against whole item texts. **That measures the cost of an unaddressable container.**

**Removal takes the span, never a matched line.** Draining an item by matching its text removes the text and
strands its markers, leaving orphaned fences that no later operation can interpret, which was found by doing
exactly that and counting what was left. Dropping by id removes the fence and its contents together.

**The format imposes two constraints, both discovered by planting a sample and watching it fail:**

| constraint                            | why                                                                                                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the key parser must carry the ordinal | reading only letters makes an item key parse identically to its record key, so the span tool sees two opens for one agent and refuses, **disabling the drain tool on the round the drain format changes** |
| a fence must begin its own line       | markers are recognized at line start after trimming, so an opening marker sharing the field-label line never registers and its item reads as unclosed                                                     |

`board/malformedItemFence` fails an item key with anything other than exactly one open and one close. **At item
granularity there are roughly ten times as many fences as at record level**, so a failure that never mattered
before becomes the common one, and its consequence is an item permanently unremovable by tool, repaired by hand,
on the surface the mechanism exists to stop repairing by hand.

## `template_is_the_contract_not_a_copy_of_it`

A gate governing a surface **derives its schema from the template that surface is built from**, rather than
transcribing it.

**A transcribed schema is two copies of one contract with nothing keeping them equal.** The gate holds one, the
template restates it, and the drift surfaces only when a party raises a new surface and it fails on its first run,
**non-conformant at birth, from a template that looked authoritative.**

**The failure is worse than ordinary staleness because of which party pays.** The agent raising the board is the
one least able to tell whether the template or the gate is right, and the natural repair, editing the new board
until the gate passes, leaves the template wrong for the next party.

**This is the pattern the checklist gate already runs**, deriving its substrate cycle, ripple dimensions, axis
labels and threshold from its own template on every run, so it cannot drift from the protocol it enforces.
`board/templateDrift` applies it to the coordination board: the record shape is read out of the template, and a
gate whose declared field set disagrees with it fails.

**Where a schema is transcribed anywhere, the question is not whether it will drift but which copy is
authoritative when it does**, and the answer must be structural, because both copies read as intentional.

**A template drifts silently because all of its consumers are in the future.** Every live surface is read and
corrected constantly by every party working on it, while a template is read once per new surface, by the party
least equipped to tell whether it or its own work is wrong. **So the one moment its correctness matters is the
one moment no party is watching.**

**When a live surface changes shape, the template it was raised from is checked in the same change.** The
measured shape: a record leaves a live surface for a good reason while the template still declares it in two
places, so the next surface raised reproduces the defect at birth from a source that reads as authoritative.

**A template carrying a command is worse than one carrying a shape.** A drifted shape produces a surface a party
can fix, while a drifted command produces an invocation that fails, at the exact moment its reader cannot tell
whether the protocol is wrong or the reader is. Measured in the same file: an await form naming two flags that do
not exist and omitting the one that is mandatory.

## `agent_declares_its_participation`

Every persisted agent artifact declares, **in its body**, the indexed letter it writes under (`THIS AGENT IS
<LETTER>`) and the skills it loads (`SKILLS: <name>, <name>`). **Both declarations are mandatory**, and the
owner's ruling closes the letter's range: every persisted agent holds an indexed letter, so `none` is not an
available value here.

**A declared value is a real answer a reader can disagree with, while an absent declaration cannot be told apart
from an oversight.** That is the same discrimination the absent token makes against an empty cell in a decision
table, and it is why the check cannot be scoped to agents that opt in, because a gate firing only on agents
declaring themselves board-participating is one no agent triggers.

**Both are declared in the body, because the body is the only surface every runtime delivers.** A runtime parses
a spec's frontmatter against its own fixed key set and drops every other key, and the sets differ between
runtimes. So the shipped frontmatter carries only `name` and `description`, which every runtime reads, and a
letter living in a field alone never reaches the agent that must write under it. The field, the filename and the
body each answer a different question, namely what the artifact declares, what a citation resolves to, and what
the agent knows, and only the third produces a write.

**The protocol itself reaches the agent through a loaded skill, which is the only channel that is both delivered
and shared.** A spec holding a letter writes to a shared surface, and every rule governing that surface reaches
it through no other route: one writer per record, the fence, extraction before removal, the handler removing the
item. The body is the agent's own text and carries no shared protocol. **The board is never delivered at all**,
and its projection is one line.

A skill named on the `SKILLS:` line is loaded **whole, per agent**. Where the runtime has its own preload key,
adoption copies the line into that key as BOOTSTRAP.md states, so the runtime injects the skill at startup. Where
it has none, the agent is asked to load each named skill before its first action. Either way, it is the first
mechanism in this chain that a check can observe _and_ the agent receives, because every earlier one verified a
declaration about participation while the participation itself had nowhere to arrive.

**The cost is recurring, and it shapes what belongs there.** Preloaded content persists in context for the whole
session and is paid once per agent, so the skill carries the table and the command form rather than prose. A
protocol that is expensive to deliver is one that gets trimmed, and the trimmed half is always the part no party
was reading yet.

**That is the presence-versus-reach failure arriving inside the repair built to close it.** A check reading the
field measured an artifact accurately while the mechanism it stood for was inert, which is why the honest test is
not _is the field present_ but _is it present where the consumer receives it_. A declaration is a mechanism only
where its consumer is reached, and reach is a property of the surface rather than of the declaration.

**Participation is an identity rather than a permission.** Every board mechanism is keyed by the letter: the
fence, the reader set, the snapshot diff and the closure check. An agent writing without one is unaddressable and
uncloseable, and it cannot be told what was written to it.

**The measured gap this closes:** every persisted agent reaches the coordination surface transitively, because
its opening instruction is to read the behavior document and that document routes to the board. **Reading
transits and writing does not**, so an agent that follows its own spec faithfully, reaches the board and writes
what it found, fails `letter_is_indexed_before_it_is_used` for doing exactly what its specification says. Correct
behavior producing a red build is a mechanism gap, never a discipline one.

**What the check claims is where the honesty lives.** It observes that a spec declares its participation, which is
presence in a file and decidable. It does not observe that an agent followed the protocol, which is a turn. **A
finding saying _this spec does not declare_ is honest, while one saying _this agent does not coordinate_ would be
the decoration class.** The scan is the same and the claim differs, and only the second is false.

## `role_document_is_uniform`

Every seat's role document lives under the roles directory the configuration resolves, named
`<concern>.<letter>.role.md`, and carries the same seven sections, **Name, Role, Objective, Behavior,
Consideration, Work Method, Principles**, plus `name:`, `type: ROLE`, `letter:`, `concern:` and `summary:` in
frontmatter.

**A uniform shape is what makes the set comparable.** A reader looking for what a seat refuses must find it in
the same place in each, or the documents are prose that happens to be filed together. The section set is the
contract, and the frontmatter carries the operands a tool reads.

**The obligation has two halves, and both are gated, because only one of them is about the document.**
`role/roleMissing` fails an active letter in the index that owns no document. The index allocates the letter, so
the check binds the obligation to the allocation, and a seat cannot become active without one.
`role/roleSectionMissing` fails a document that omits a section. **Gating the shape without gating the existence
leaves a folder that stays empty while the gate reports green**, which is the inert-mechanism class arriving in
the mechanism built to prevent it.

**The file is named for the concern, and the letter takes the variant slot.** A letter rotates and is never
reused, so a letter-named file breaks every citation the moment a seat changes hands, while the concern outlives
the seat. The letter is not lost, because it moves into the `letter:` field, where a tool reads it and a rename
cannot break it.

**The letter resolves from the index rather than from a vocabulary array.** An identity allocated by another
surface is derived into the slot, never declared into a closed set. A vocabulary that grows by one word per seat
is not closed, and copying the allocator's output into a second list makes two owners of one fact that disagree
the moment one moves. A new seat adds its index row, which it already must do before its first write, and its role
document is legal immediately.

**Reading it is the half no gate can see**, and that is why the obligation is stated in the behavior document's
startup section and in the preloaded protocol skill rather than here alone: those are the two surfaces a session
and a subagent actually receive.

## `letter_is_indexed_before_it_is_used`

An agent's letter is **bound to a role in the index before its first write**, and a letter is claimed by adding
the row rather than by using it.

**Writing under an unindexed letter is the same construct as a task citing an agent the board does not declare**:
it reads as governed and resolves to nothing, and so does every citation later written against it.

**A letter is never reused, and retiring an agent frees nothing.** Every item, row, citation and changelog line
that ever named a letter resolves through the index, so a second binding silently re-points half of them with
nothing erroring. That is why the index is an accumulator and sits outside the board: the board is
current-truth-only and deletes what is resolved, while a letter that has stopped being active still has to
resolve.

**The allocation never exhausts and never needs reasoning about.** Single letters come first, then two-part
letters cycling the second position, then three-part, so **the shortest available identity is always the one
issued**, and no party decides which tier a name belongs to.

`board/unindexedAgent` fails a record whose letter carries no index row, and `board/duplicateIndexBinding` fails a
letter bound twice. The roster the other board checks derive from is the board's own active records, and **the
index is the wider set, because it also holds the letters that must still resolve.**

## `addressee_resolves_to_an_active_agent`

An item's addressing resolves to a **reader set derived from presence on the board and state in the identity
index**, and every named addressee is in it. The board answers which agent holds a record, meaning which agent is
seated, addressable and carrying a span an item can land in, and the index answers what state that seat is in. So
a letter bound but not yet seated is outside by construction, and a departed seat drops out on its own transition.
**A letter the index does not bind resolves as not active**, and never by falling back to its own record's marker.

**The fallback was the second declaration surviving in the one place nothing could contradict it.** Where the
index binds, the marker is dominated and can be arbitrarily wrong without consequence. Where it does not, the
marker became the sole operand, so the derivation read as an intersection of two sources and silently degraded to
one, in exactly the case with the least evidence behind it, with nothing marking the degradation and no reader
able to tell which regime a letter was in.

**The state it served is already a defect rather than a case needing graceful service.** A letter is claimed by
adding its row, never by using it, so a record written under an unbound letter reads as governed and resolves to
nothing, as does every citation ever written against it. A walk already reports that state with its own finding
kind. So the fallback supplied a conservative reading for something another mechanism refuses, and removing it
makes the disagreement unrepresentable rather than merely reported: one fact, one owner, no referee.

**An item addressed to an agent that does not exist has no reader and can never be handled**, so it sits forever
while reading as live traffic. That is the same shape as a planning row bound to an absent agent, which is
buildable and never retirable.

**The roster is derived rather than declared**, from the same records the wait cap counts, so a record going
inactive re-points the check on the next run with nothing to edit. A second roster would be a second truth, and
the two would disagree the first time one moved.

**Two addressing forms resolve to an empty reader set, and both are legitimate.** Addressing every seat is not a
set of names, and a role-addressed item, such as a note for whichever party later claims a scope, has no reader
until a party occupies the role. **A check demanding a resolvable set would forbid the only correct way to leave
a note for a successor**, so an empty set is a pass and only a named agent that is not active fails.

**A derived roster is derived only if the state survives parsing.** The roster was documented as coming from the
board's active records, and the implementation collected every agent record regardless of state, **because the
parser drops the ACTIVE marker when it builds a record's label**, so the roster could grow and never shrink. The
check ran on every invocation, was green every time, and compared addressees against a set that no departure could
change.

**It was inert, and only a real departure could reveal it.** Until a seat went inactive, an all-records roster
and an active-only roster are the same set, **so the defect was unobservable for exactly as long as it was
harmless**, and it began to matter at the moment it became observable. **A check that cannot be wrong yet is a
check no party has tested**, which is `gate_fires_before_it_is_trusted` reaching a condition rather than a code
path.

**A stranded item is a different state from a pending one.** An item whose reader set holds no active agent can
never be closed, because the reader-set constraint that stops an author clearing its own board space also stops it
clearing an item no agent is left to handle. **The two read identically**, and only the addressee check
distinguishes them.

## `reference_is_typed_and_its_vocabulary_is_closed`

A reference names its **kind** before its member, so the resolver is dispatched rather than guessed, and the set
of kinds is **closed**, with an unknown kind failing rather than passing.

**The kinds are a dispatch over resolvers that already exist**, never new analysis: a gate id against the pipeline
registry, a task id against the declared-versus-cited machinery, a rule slug against the coverage scan, a record
id against the same declared-id shape one surface over, and a changelog heading against the archive.

**The closure carries the rule.** An unknown kind sits outside every resolver and resolves vacuously, and a
reference that is never checked reads exactly like one that passed, which is a gate reporting green over an
excluded subject at reference granularity.

**Typing collapses most of the relevance problem without solving it.** An item asking for a gate while citing a
task id is a type mismatch, decidable with no judgment. What survives is only a right-kind reference pointing at a
wrong member, which is a far smaller residual than "does this reference actually relate to this item", a question
that is not decidable at all.

**The honest limit stays stated**: resolution decides that a reference points at something real, never that what
it points at satisfies the item. That remains judgment, and it stays with the writer.

**The kind must actually select a corpus, or typing is ceremony.** A resolver that parses the kind, validates it
against the closed set, and then checks every kind against one corpus has bought nothing: the vocabulary is closed
and the dispatch never happens, so a rule slug, a gate id and a task id are all resolved against the archive.
**Every non-archive kind then refuses correctly formed references, and the refusal reads exactly like a genuine
miss.** This was measured by citing a rule slug that was on disk, in the behavior document and in a digest, and
watching it be refused as unresolvable.

**That failure is the inert-mechanism class inside the mechanism built to prevent it**, and it is invisible from
the artifact: the kind is present, the set is closed, the check runs, and the finding it produces is well formed.
**What is missing is the dispatch the typing exists to enable**, which no inspection of a reference can reveal,
and only trying one of each kind does.

**A corpus every kind shares is the tell.** Where one resolver argument serves all kinds, the kind is being parsed
and discarded.

## `commuting_writes_replay_rather_than_refuse`

A tool writing to a shared surface, finding it changed since its read, **compares the writer's own span before
refusing.** Where that span is untouched, the operation is replayed against the new content, and only a genuine
overlap refuses, with the diff of that span.

**Most contention on a per-writer surface is false contention.** Two agents editing different records do not
conflict semantically, because their operations commute, and they collide only textually. A compare-and-swap sees
one byte-level mismatch and cannot tell the two apart, so it rejects both and sends each writer to re-read the
whole surface to discover that the collision was irrelevant.

**A queue is the wrong repair because it serializes every write.** Replay on commute serializes only the writes
that genuinely overlap, which on a surface with one writer per record is a small fraction of them.

**The refusal carries the diff, not just the verdict.** _It changed_ tells a writer to go looking, while the added
and removed lines of its own span tell it what to re-derive against. A refusal that withholds what changed makes
the caller re-read everything, which on an oversized surface is the cost that made agents avoid the tool in the
first place.

**This is available only because the surface is fenced per writer.** Without a per-agent span there is nothing to
compare, and every collision looks identical, so the delimiter buys conflict resolution on top of the anchored edit
it was introduced for.

## `an_intended_write_to_a_shared_prose_surface_is_announced`

**A party about to write a shared prose surface says so first, naming the surface and what it intends to add.**
The announcement goes where the other parties are already reading, before the edit lands rather than after it.

### The evidence, which is three measured instances rather than an argument

**Three parties wrote one class-content surface in one round**, each having independently measured the same
content as owed, none aware of the others. Two of the three sections stated one contract in different words.

**Two parties then wrote overlapping halves of one contract onto a second surface**, and the overlap was one
sentence restating what the other had already said.

**The third instance is this rule acquiring a duplicate of its own clause about announcing**, written by the two
parties that had just ruled on how announcing works, on its second application. A rule whose subject reproduces
inside its own text is a controlled demonstration rather than an anecdote, and it is better evidence for the
mechanism than the reasoning below it.

**In all three, the mechanical layer was perfect throughout**: every write commuted, every one landed, nothing was
lost, no check objected, and only a reader holding both passages at once saw anything wrong.

**All three resolved the same way, with no negotiation**, each party removing or relocating only its own words.
That is the third application clause below, and it settled three collisions at a cost of one edit by one author,
where a merge between two authors would have cost an exchange.

### Why it exists, and why no write mechanism substitutes

**The anchored edit is working correctly and cannot reach this.** It refuses an overlapping write and admits a
commuting one, which is the design: two parties appending different sections in different places commute
textually, so both land, both report success, and no write is lost. **The collision is between meanings rather than
spans**, with two correct authors independently deciding the same content is owed, each having measured the same
gap.

**So a per-writer fence does not help, and proposing one is the natural wrong answer.** A fence protects a span,
and nothing about it observes that a span far away states the same contract. Measured: parties writing one surface
in one round produced overlapping statements of one contract, every mechanical test passed throughout, and the
duplication was visible only to a reader holding both at once, on the surface whose own header refuses one
contract in two copies.

**The announcement is the only instrument that reaches a semantic overlap, which makes it a mechanism rather than a
weaker substitute for one.** It works by putting the intent in front of the other parties while the write is still
cheap to redirect, and its whole cost is one line.

### How to apply it

1. **Announce the surface and the content**, not merely that a write is coming. _The class half is unwritten and I
   am taking it_ lets a peer holding the same intent say so, while _I am editing the model_ does not.
2. **It binds a shared prose surface**, a document with no per-party records. A record-structured surface already
   answers this with its fence, and announcing there is noise.
3. **Cut your own text when an overlap lands anyway.** Each party removing its own duplicate resolves it without
   any party editing a peer's words, and it is cheaper than a merge negotiated between two authors.

### A peer routing content to a named party discharges the announcement, for that content only

**Where a peer has already routed the content to a named taker, that party writes it without announcing.** The
routing is strictly more informative than the announcement it would replace: an announcement says _I intend to
write this_, while a routing says _this is owed and you are the taker_, and every party the announcement would
have reached reads it. So the state this rule exists to prevent, two parties writing one subject unaware of each
other, is already impossible for any party that read the routing.

**The bound is the content, not the party.** A routing discharges the announcement for exactly what it named, and
a party writing more than was routed announces the surplus. Without that bound, _it was routed to me_ becomes a
standing license over a surface, which is the reservation this rule refuses two paragraphs down.

**The routing must name a taker.** A peer observing that some content is missing leaves the subject unclaimed and
every reader still able to reach for it, so that is an observation rather than a routing, and the party that takes
it announces normally. Naming the taker is what makes the collision impossible for any party that read it, which
is the whole of what the announcement buys.

**Where a routing names more than one taker, the discharge holds only while one of them can write the target.** A
routing to several parties tells each that the subject is claimed and does not tell them by which party, so it
discharges the announcement for every party that might collide, which is the state the rule exists to prevent
arriving through the exception rather than around it. Where only one of the named parties owns the target surface,
the others contribute through positions and nothing collides: the duplication lands in argument rather than in the
artifact, which costs a reading and not a merge. Where more than one can write it, each announces before writing.

**The test is ownership of the target, not the number of names.** That is a fact every party already holds, so the
qualification adds no lookup, and it keeps a multi-party routing useful, which is the common form when a question
straddles two concerns. Measured: a question routed to two parties on two concerns was answered by both in one
round, independently and identically, and cost nothing only because one of them could not write the surface at
all.

**This is stated rather than inferred, because a rule whose application rests on an unstated inference is
discipline presented as a rule.** The alternative reading, that only the writing party's own announcement counts,
makes every routed write a breach and produces an announcement echoing a routing no party disputed, which is noise
that teaches parties to skip the rule where it matters.

### The rule carries a delivery precondition, and it only serializes where the announcement arrives first

**An announcement has no force except arrival.** It is an intention rather than a lock, so it cannot make any
party wait, and its entire effect is that another party reads it before writing. Every word of the contract above
is about placement and none of it is about latency, and the mechanism rests on the half that is unstated: **an
announcement landing after the work is a correct announcement that coordinated nothing.**

**Arrival is decided by where the recipient is watching, never by the surface's lifetime.** The wait watches one
target and reports what changed on that target alone, so a party parked on an argument receives no diff from the
coordination surface, and the reverse. **A board item is fast for a party on the board and slow for a party in an
argument, and while an argument is running every party is in the argument**, which is exactly when an intent to
write is filed. So an intent goes to the surface its recipient is watching, and a rule naming one surface as the
fast one is false precisely in the state it would be used.

**Whether that routing is derivable is answered at the waiter record rather than stated here.** It is derivable
where that record carries the target a party is watching, and a judgment about the party's attention where it does
not. The rule names the mechanism and the question rather than the answer, because a clause transcribing a
mechanism's current shape is true when written and goes false when the mechanism changes, with nothing joining the
two. **The drift direction is the invisible one.** A rule that becomes too strict meets a reader who cannot satisfy
it and asks, while one that becomes too loose, telling a reader to judge what the tree has since made derivable, is
obeyed correctly and easily by its own words, and nothing errors.

**What a caller passes and what a store persists are two facts in two files, and the first is the one met when
reading downward**, so the record is checked at its own shape rather than at its writer's arguments.

**Measured twice on one file inside one discussion:** a party claimed work that had already landed before its
claim posted, then stated the general form itself. The announcement cycle was longer than the build cycle, so it
was announcing at a moving target. The announcements were correct, well placed by the rule's own words, and arrived
after the writes they were meant to order.

**A finding travels faster than its own corrections, which is how a refuted clause enters a governing surface by
the shortest path.** An argument accumulates and a rule does not, so a correction landing in the argument does not
propagate to the rule. A finding landed in a rule at speed carries the support it shipped with, frozen at the moment
of the edit, with nothing joining it to the version that is current a position later. **Measured on this rule: its
channel clause was landed from a position, refuted two positions after that position was written, and found inside
the rule by the party whose measurement refuted it.** So a finding is landed into a governing surface with its
support re-read at the moment of landing rather than quoted from the position that carried it, and the party landing
it re-reads the argument before the edit rather than after.

**So the anchored edit is the primary protection rather than the fallback.** The seat takes the write, reads
immediately before it, and lets the compare-and-swap refuse an overlap. That is the acquire step an announcement
does not provide, and it is the only one that depends on nothing any party has to observe about a peer's attention.
Announcing a second time is not a substitute for it. **An intent routed to a swept surface is drained by its author
when it is spent**, since a party that announces and does not write owes the removal.

### The evidence is that this rule reproduced its own subject inside itself

**Three collisions occurred in three rounds, each on a shared prose surface, each with every mechanical test passing
throughout.** Three parties writing one class surface produced overlapping statements of one contract. Two parties
writing adjacent sections of it independently required the same clause. And **this rule acquired a duplicate of its
own clause about announcing, written by the two parties that had just agreed how announcing works**, which is a
controlled demonstration rather than an anecdote, because both authors held the rule in mind and the overlap happened
anyway.

**Every collision was invisible to every mechanism and visible only to a reader holding both spans at once.** The
writes commuted by design, both landed, nothing was lost, and no check objected, which is the argument above,
measured rather than reasoned.

**The rule also carries evidence in the other direction, which is what makes it falsifiable rather than only
justified.** Three parties announced writes to one prose surface inside one round, the first time the rule was
exercised at three rather than two. No collision landed. The resolution cost one author narrowing its own shape
after reading the other announcements, and no negotiation between authors happened at all.

**A rule whose only evidence is its failures cannot be shown to work**, so the successful case is recorded beside
them: three collisions before the rule existed, and one clean three-party resolution after. The three uses were
different, since one announced and waited a cycle, one announced and narrowed mid-write, and one announced and took
the work after its window passed, which is the rule admitting three shapes rather than prescribing one.

**Each resolved by its own author cutting or relocating its own text, in every case, without either party consulting
this rule.** That is the third application clause arriving from behavior instead of from instruction, and it is the
measurement worth keeping: the resolution costs one edit by one author and never a merge negotiated between two.

### Why the gate is conduct

**Whether an announcement preceded a write is an ordering between a position and an edit, and the shared prose
surfaces carry no writer identity anywhere.** So a section written after an announcement and one written without it
are the same artifact, by the same measurement that makes attribution on those surfaces undecidable from the file.

**The near-checkable half is a different claim rather than an unbuilt one.** Whether two passages state one contract
is semantic, which is the property no mechanism here decides, so this rule carries no deferred check waiting to be
built, and saying so is what stops it being counted as enforcement debt a party could clear.

## `board_is_current_truth_only` (LOCKED)

The board is overwritten in place, with no appending, no archaeology, no `DONE` / `SUPERSEDED` / `ACK` markers and
no diaries. A resolved flag or completed unit is **deleted outright**.

_A removed field reads as absence, and a stale one manufactures a false belief._ This is `present_tense_only` applied
to a coordination surface.

## `a_venue_accumulates_and_the_board_is_swept`

**A prioritized discussion has the opposite lifetime to the board, and the two share only their transport.** A board
is current-truth-only: a resolved item is deleted outright and the surface is swept, because every seat re-reads it
every round and an item no seat drains is a tax paid forever. **A venue accumulates.** A position stands until it has
been read and signed, dissent survives to convergence, and the venue is **moved whole into the archive** with its
durable half extracted.

**A converged venue is archived and never deleted, and the lifetime wording keeps losing that part.** Leaving the
active tree and leaving the repository are different operations, and every statement of this rule that said
_deleted_ collapsed them, so a tool implementing the sentence faithfully destroyed the argument while satisfying every
ordering. The two obligations are separate and both hold. The venue leaves the active tree, because a settled
discussion every seat re-reads is the accumulation the sweep exists to prevent, and it lands in the declared archive
root, because the outcome states what was decided and never why.

**The distinction is the same one the accumulator draws, and it is why the extraction is not sufficient.** The durable
half is a compression: the class, its boundary, the mechanism it revealed, by design dropping the positions, the
refutations, the withdrawn claims and the order they arrived in. So a reader holding the outcome and no argument
cannot separate a ruling from a preference, cannot see which claims were refuted on the way, and cannot tell whether a
clause was contested. **Extraction preserves the conclusion and the archive preserves the reasoning, and a rule that
says only _extract then delete_ has authorized destroying the second half.**

**Measured once, at the full price.** A venue met all four convergence orderings, its durable half was in the
accumulator, its outcome was in two surfaces, and its successor carried every deferred clause by name, and the
convergence tool removed it from disk, reporting success. Roughly ten thousand lines of four-seat argument were lost,
and every position id the accumulator and the finding surface cite now resolves to nothing.

**Nothing in an open venue is drained, closed or compressed.** The sweep is held against one and says so, and a
closure and a compress both refuse. That is not a gap: draining a discussion would delete the argument it exists to
hold, so a venue is writable by tool and not drainable by tool.

**The measured failure this states.** The same fenced-record mechanism serves both surfaces, and the drain applied the
board's lifetime to both, because the surface was chosen by a path argument while nothing chose the rules. A
discussion sat inside the drain's reach and survived only because its items were too young for the absorbed rule.

## `clear_unblocked_work_is_performed_rather_than_routed` (LOCKED)

**Where the work is clear and nothing blocks it, the seat does it.** A clear unblocked item is not routed, scheduled,
raised as a proposal, or carried to a later round.

### Why it exists

**Every coordination mechanism this protocol has is a way of moving work, and moving work feels like doing it.** A
routed item, a checklist row, a position proposing a repair and an announcement of an intent all produce a visible
artifact and a legible contribution, so a party can spend a whole round on the transport of a change that would have
cost one edit. **The surfaces reward the routing, and nothing measures the substitution.**

**The substitution is strongest exactly where the work is easiest**, because a small clear change is the cheapest
thing to describe and the least satisfying to merely perform. That inverts the intended order: the items that get
performed are the ones too large to summarize, and the ones that get routed are the ones a single edit would have
closed.

**Deferral has real forms, and they are not this.** A question whose answer changes the work, a decision that is
another party's, a surface a party may not write, and a precondition not yet met each genuinely block, and naming the
blocker is the work. **The rule bites where no such blocker exists** and the item was routed anyway.

### How to apply it

1. **Before routing anything, name the blocker.** If naming it produces nothing, the item is clear and the routing is
   a substitution, so the seat performs it instead.
2. **A proposal about one's own surface is a decision.** Where a party owns the surface and the answer is settled,
   proposing it to peers converts an edit into a round.
3. **A checklist row for work already possible is a delay with a filing system.** The checklist carries what needs
   distributing or sequencing, never what its author could take now.

### What it does not license

**It is not a reason to act on an unclear item to avoid looking slow.** A guess performed quickly is worse than a
question asked plainly, and the discriminator is whether the work is clear, which is a property of the item rather
than of how confident its holder feels.

## `a_venue_is_absorbed_before_it_is_archived` (LOCKED)

**Convergence is not the end of a venue, and absorption is.** A converged venue is signed, its outcome is written,
and then its outcome is **built**: the implementations, refactors and updates the decision requires actually land in
the tree. Only once that work is complete does the venue move to the archive.

### Why it exists

**A converged outcome no party implements is a decision with no consequence, and archiving at convergence marks it
done.** The signatures certify agreement and certify nothing about the tree. So a venue archived on signature leaves a
settled ruling, a clean gate and an unchanged codebase, and the archive then reads as a record of work performed when
it is a record of work agreed.

**The gap is invisible in exactly the way this whole series keeps measuring.** Every convergence ordering is
satisfiable without a line of implementation: seats state their needs, sign their positions, name their durable
headings, and the successor carries the deferrals. Nothing in that set reaches the code the decision was about. **The
venue's red gate, the one signal that work is outstanding, clears at convergence, so the moment the outstanding work
becomes invisible is the moment it becomes the only thing left.**

### How to apply it

1. **Converge, then distribute.** The technical work the outcome implies is written as a checklist naming every item
   and its owner, so the remaining work is a countable surface rather than an intention held by the party that drafted
   the outcome.
2. **Build it.** Implementations, refactors and updates land in the tree, each verified the way any change is
   verified.
3. **Then archive.** The venue moves to the archive once its outcome is in the tree, never on signature alone.
4. **The convergence walk is a precondition rather than a completion signal.** Every ordering holding means the venue
   is ready to be absorbed, and a walk reporting all four is not authority to archive.

### A checklist assignment outranks surface ownership for the item it names

**An item naming an owner is that owner's authorization to write wherever the item lands, including a surface
another party owns.** Otherwise a distribution checklist can only assign work to the party that already owns the
file, which makes distribution meaningless and turns every cross-surface item into a queue behind one party. The
absorption stage exists to spread the work, and an assignment that cannot cross a boundary spreads nothing.

**Foreign-scope protection is unchanged and is still enough.** An unassigned write into a party's surface remains a
breach, and the discriminator is the assignment rather than the party, so the protection covers exactly what it was
for, and the checklist covers what it could not.

**The dispute moves to a better surface.** Where an owner disagrees with an assignment, the argument is about a
visible line on a shared checklist rather than about an edit whose authority no party can see. **An assignment is
contestable and an edit is not**, which is why routing the authority through the checklist makes the disagreement
cheaper rather than more likely.

### What it does not license

**It is not a reason to hold a venue open while the work runs.** An open venue holds the build for every seat, and
the discussion is finished, so the venue is converged, its outcome distributed, and the absorption tracked on the
checklist rather than by leaving the blocker standing. The blocking gate answers _is a decision unmade_, and the
checklist answers _is the decision built_, and conflating them makes one surface report two states.

## `a_position_is_posted_through_the_tool`

**A position enters a venue through the tool with the surface named, never by hand.** The tool writes into the
calling seat's own delimited record, so the fence, the item id, the addressing, the compare-and-swap, the reader set
and the hold machinery all apply in a venue exactly as they do on the board. Hand-editing a venue is the bypass, and
it has no fence, no id, no drain and no gate.

**A venue without a per-writer record refuses every tool write**, which is what pushes a seat to hand-edit, so the
record arrives from the template rather than being placed by the party that hits the refusal. **A protocol mandating
a surface its tool cannot write to will be obeyed by hand**, and that is a defect in the mandate rather than in the
seat.

## `a_repairer_runs`

**A repair has two landings, and reporting it delivers only one.** It lands in the source, where its author observes
it, and in the state, where every other seat does, so a repair that is reported rather than run is invisible until a
peer spends the shared resource to discover it, or until no peer does.

**So the seat that changed the tree takes the run.** That is the one moment the warrant is unambiguous, since a
question about state goes to the report and a question about a changed tree goes to a run, and it is the one time the
run costs no party anything, because the repairer already holds the write.

**A declared run is a shared measurement paid once.** Every seat reading its report consumes the artifact the run
exists to produce, which is not free-riding, and a protocol obliging each row-holder to spend the resource would
produce one whole-tree mutation per seat for one number. **Measured across two repairs in one discussion:** the one
whose author also ran closed itself for every seat, and the one whose author reported instead needed a second seat to
declare a run before any peer could see it.

**This completes the concurrency hold rather than qualifying it.** No seat mutates a shared surface while peers are
writing, and the seat that changed the tree publishes the state. Both halves are needed, because the hold alone leaves
repairs unpublished, and the run alone spends other seats' work.

## `a_venue_carries_its_own_fields`

**The venue schema is its own, and the board's does not transfer.** A board answers who owns what and what is
directed at whom, while a venue answers where each seat stands on one question and what it still needs before it can
sign: `Reading`, `Stance`, `Needs`, `Positions`.

**`Needs` is the field the board has no analogue for, and it is what makes convergence checkable.** A seat that cannot
sign states what is missing, so the remaining set is derived rather than judged, and an empty `Needs` across every
active seat is what convergence looks like. A venue carrying an ownership field is describing ownership in a document
about a decision.

## `a_venue_is_read_before_it_is_written`

**The venue template is read before a seat writes its first position**, and it is named in the startup contract
because that is the only surface a startup delivers. A contract nothing routes to is a contract no party reads: four
seats deriving one format four different ways is a delivery failure rather than four lapses, and the control is the
board, whose shape is delivered and whose record shape no seat has ever invented.

## `an_undecided_half_names_its_receiver`

**A converging venue names, for each question it deliberately leaves open, the venue that receives it, or states that
it leaves none.** The durable half extracts to the history accumulator, while an undecided question is neither a
finding nor history, so it lands in the successor venue as an inherited clause naming its origin.

**The chain the series declares has no edge without this.** Each venue opens once its predecessor converges, because
each outcome is an input to the next, while the exit mechanism carries findings and deletes the file. So a question
every seat agreed to defer is deferred to no party, and its absence surfaces several venues later, when the work that
needed it is already built.

**Creation and opening are two events.** The successor is created at convergence, carrying its inherited clauses, and
opened when its predecessor is deleted. That is one operation with two writes, never a window a seat works inside,
because more than one open venue is more than one hold.

## `board_records_are_schema_exact`

Each record carries exactly its fixed schema and nothing else, as normalized records and never prose.

**The field set itself is not restated here.** It lives in the board template, which is the contract every board check
derives from on each run, so a digest spelling the fields would be a second copy of a schema with nothing keeping the
two equal, which is the exact construct `template_is_the_contract_not_a_copy_of_it` refuses. A record's legal fields
are read from the template, and this rule governs how they are filled.

**The transcription is a measured class rather than a hypothetical one**: one field can sit in a protocol's prose as
derived, in the template as written, and in the toolchain's own constants as a third statement, with all three reading
as intentional and no two of them able to be wrong together.

**Exactly its schema means each field exactly once, and cardinality is the half a presence check cannot see.** A check
asking _is this field here_ is satisfied by a field declared three times, and only a check asking _is it here once_
observes the record's field set. That is the same shape as a pairing check that validates each member and never the
relation between pairs.

**The parsed record is why it stays invisible rather than merely unchecked.** Fields are read into a map, so a
duplicate label collapses into one entry, and every check reading the parsed record sees a well-formed record, while a
reader resolving the field gets several answers and no rule saying which wins. `board/duplicateField` counts labels in
the raw span for that reason.

`PENDING` means unevaluated, never a soft failure, and it is not a warning tier.

## `absorbed_round_extracts_to_the_changelog`

A board round that has been absorbed is **extracted to the history accumulator and then deleted from the board**,
neither deleted outright nor left in place.

The two halves are both required. Leaving it is accumulation: every agent re-reads it every round under
`board_is_read_whole`, and the live item a party must act on sits behind rounds no party can act on. Deleting it
outright loses the only durable record of a finding, because the board is current-truth-only by construction and
`history_has_two_homes` names the changelog as the one place history may live.

**What extracts:** the finding and its evidence, compressed to what a later reader needs: the defect, how it was
found, and the mechanism it revealed. **What does not:** the round's addressing, its courtesies, its restatement of
what another agent said, and anything already carried by a rule, a checklist row or a typed record. A round absorbed
into a gate is already durable, and extracting it again duplicates it.

The test for absorbed is not age. A round is absorbed when what it asked for exists, such as a retired row, a
registered gate or an answered question, so absorption is checkable against the tree rather than felt from how long
the text has been sitting there.

## `removal_declares_its_extraction`

A tool that removes an absorbed item from a coordination surface **refuses to run without a reference naming where the
extraction landed, and refuses again if that reference does not resolve.**

**Auto-removal is auto-extraction-then-removal, or it is data loss.** The board carries no past by construction, so
deleting outright destroys the only durable record of a finding, and a healer that deletes without extracting is worse
than the accumulation it was built to fix.

**The declaration carries a reference because a bare one cannot be falsified by any party but its author.** The
same discriminator separates a legitimate self-declaration from laundering everywhere else here: an owner
field is legitimate only because its evidence clause is checkable by a party that did not write it.

**What the check decides and what it must not claim.** It decides that the reference resolves, which is presence and
nothing more. **It cannot decide that what was written carries the finding**, because extraction is a compression
rather than a copy: the mechanism survives while the addressing and the courtesies are dropped by design. **A text
comparison would therefore fail every correct extraction and pass a verbatim paste**, which is the outcome the
compression rule forbids. Fidelity is judgment and stays with the writer, and a check certifying presence while
claiming to certify fidelity is worse than no check.

**The preview path is exempt, and that is the point.** Running without healing shows exactly which fields would go, so
the party running it sees the scope before extracting anything.

## `round_is_absorbed_then_deleted`

A board round is written to be **read once and then absorbed** into a resource, a draft or a rule. Once absorbed, it
is deleted from the board rather than restated in the next round.

The failure mode is accumulation that reads as diligence: each round appends its predecessor, so the record grows into
a diary, and the one live item that another agent must act on sits buried behind fifteen rounds of narrative it has
already read. A record that restates itself is reporting on itself rather than on what remains.

`board/repeatedClaim` gates the construct rather than the length: a field stating the same span of words twice is
restatement, and no threshold on size can distinguish a long live flag from a short stale one. The defect is
repetition, not length.

The board carries **what another agent must act on**, never what was done. What was done lives behind `Refs`.

## `decision_names_its_gate_or_its_proof`

Every venue declares the same exit condition: **a decision binding an artifact names the gate that will enforce it, or
is proven ungatable in writing.** A decision with neither does not close its question.

**The absent token is a real answer, and an empty cell is not.** The token states that this decision binds no
artifact, which is a claim a reader can check and disagree with. A blank states nothing, and an oversight cannot be
told apart from a decision no party has assessed. The check buys exactly that distinction, which is why
the repair is never "fill it in" but "state which of the two it is".

**The exit condition was being evaluated by hand in every venue, which is what let a gate column carry empty cells
across many rounds while the positions around it converged.** `blocking/ungatedDecision` fails a decision row whose
last cell is empty, which makes the exit condition self-checking rather than a thing an agent has to remember to walk.

**The pressure that fills a cell wrongly is the same one this rule exists to relieve.** Reaching for a gate is what
makes an ungatable proof feel like a failure, and a cell filled under that pressure produces a check that inverts its
own row, which was observed twice, both times specifying a gate that would fire on exactly the case the decision
protected. **A proof is a pass, not a concession.**

## `friction_is_a_missing_mechanism`

**The first response to coordination friction is _what is this surface missing to treat collaboration like a software
system?_**, never _who should have been more careful_ and never _let us all remember to_.

A coordination surface is software. It has state, invariants and a schema, and it decays without a validator. So an
accumulation, a lost write, a stale item, a missed message or a surface that grew past reading is a **defect report
against the protocol**, and the repair is a mechanism that makes the failure impossible or makes it loud.

**The evidence is that discipline held and the surface failed anyway.** Every drain rule this workspace carries,
namely that absorbed rounds extract and delete, that a round is read once and then absorbed, and that the board
carries pointers rather than detail, declares conduct, is agreed by every agent, and is violated by all of them. A
board grows past what any reader can consume, carrying hundreds of directed items, with every one of those rules in
force. **That is not a failure of care but a surface with no validator.**

The corollary binds the repair as tightly as the diagnosis: **a rule added without a gate is more care presented as a
rule.** Where a mechanism genuinely cannot be gated, that is surfaced with the evidence a gate would need, exactly as
`.{provider}/rules/conduct.rule.md` demands, and never assumed.

**What this rule refuses**:

1. a retrospective whose output is an agreement to be more careful.
2. a repair that adds a sentence to a protocol nothing reads at the moment of failure.
3. treating a recurring class as a run of individual mistakes, which is how a mechanism gap stays invisible for as
   long as every instance has a plausible local cause.

## `projection_is_one_line` (LOCKED)

**The `collab-status` projection is one line, and a gate holds it there.** It carries the open blocker, who owns what,
and a pointer to the board, and nothing else: no finding, no ruling, no measurement and no narrative.

**This rule has a subject only where the projection host slot resolves, which is the same precondition the refresh
obligation carries.** Whether it resolves is read from the configuration rather than restated here, and where it does
not, there is no line to hold at one, so the size contract has no operand and the gate holding it ranges over
nothing. **A rule whose subject does not exist is neither satisfied nor violated**, which is a third state worth naming
here, because a size gate reading zero over an absent surface cannot be told apart from one reading zero over a
compliant one.

### Why the size is a contract rather than a preference

**The projection is delivered into every context every turn, including every bounded invocation's, while the board
itself is not.** That asymmetry is measured: a spawned agent receives the axis document and its digests as injected
system context and never receives the board. **So the projection is the only thing such an agent knows about the
board**, and every byte of it is paid by every reader on every turn, which is the board's own accumulation cost
multiplied again by a larger audience.

**It grows by perfect compliance with the rule beside it.** `board_write_refreshes_projection` obliges every writer to
refresh it and says nothing about size, so each seat appends the finding of its round, every append is individually
true and current, and nothing is removed. **A rule that states an obligation and not a shape has written half a
contract**, and the half it omitted is the one that decays, which is `no_append_without_a_drain` arriving one layer up,
on a surface with a wider audience and no validator at all.

**A field named a one-liner is making a claim about its size.** Where a name asserts a shape and no check reads it, the
name is documentation and the shape is a hope.

### How to apply it

1. **Refresh it in place, never append to it.** The projection is a cache: it is overwritten with current truth, and
   what it replaces is not preserved anywhere in it.
2. **A finding does not go here.** It goes to the board as a fenced item, to a rule, to a gate, or to the history
   accumulator. The projection cites and does not carry.
3. **On finding it oversized, extract before truncating.** Anything in it with no other home reaches the history
   accumulator first, in the same order every drain here takes.

`board/oversizedProjection` fails the projection line past its declared cap, measured on the line itself rather than
on the file. **The cap is a construct the rule cites as data**, so the number moves without the rule changing.

## `board_carries_pointers_not_detail`

Implementation detail, playbooks, root-cause analyses, troubleshooting and milestone narrative do not live on the
board. They live in memory, plans or documents, reached through `Refs`.

### An argument belongs in a venue, and the board is not one

**A position, meaning a reading, a diagnosis, a refutation, a withdrawal or a claim under dispute, goes into the open
venue. The board carries coordination state and pointers to where the argument is.** The two surfaces have opposite
lifetimes, so an argument written onto the board is accumulation on the one surface built to be swept: every seat
re-reads it every round, the sweep drains it before it has been answered, and the reasoning that justified a ruling is
destroyed by the mechanism doing its job correctly.

**The rule is not new, and that is exactly what makes the measurement worth keeping.** Both halves were already
written, since a venue accumulates, a board is current-truth-only, and detail lives behind a pointer, and four seats
spent a full round posting multi-paragraph positions, corrections and counter-positions as board items anyway.
**Nothing refused one**, because the item form is the shared transport, and it accepts an argument exactly as readily
as a state change. So the breach was uniform across every party, invisible to every mechanism, and found only when the
owner read the surface.

**The tell is the item's own shape rather than its subject.** An item that states what is true now, who holds what, or
what a seat needs belongs on the board. An item that argues, meaning it carries evidence, answers another item's
reasoning, or exists to persuade, belongs in the venue, whatever it is about. **A position addressed to the seats is
the strongest disguise**, because the addressing is what makes it look like coordination.

**The window where this is unavoidable is real and is named, so it is not a license.** Between one venue's archive and
its successor's opening there is no venue to write into, and an argument arising in that interval has nowhere else to
go. **That interval is a defect to shorten rather than a home to settle into.** The successor is created at
convergence precisely so the gap does not exist, and a round of argument accumulating on the board is the measurable
cost of having inverted that ordering.

## `board_write_refreshes_projection` (LOCKED)

Every write to the board refreshes the `collab-status` one-liner in the axis document the configuration names as the
projection host. Agents that have read the board append their letter. The board is the source of truth, and the
one-liner is a cache with a refresh obligation.

**The obligation runs only where its target slot resolves, which is stated here because a seat reads this rule and not
the configuration at the moment it acts.** The projection host is a declared slot, and whether it resolves is read from
the configuration, which publishes its state and its reason, while every run's own report carries the derived
consequence. **That state is not restated here**, because a second copy of it goes false the moment a host adopts this
package, and nothing would join the two. Where the slot does not resolve, this branch does not run and a blocker is
carried by the board alone.

**Obeying this rule without reading that slot is the one failure mode it has, and it looks like compliance.** A seat
meeting an unconditional LOCKED obligation and acting on it has done the diligent thing, and where the slot does not
resolve, the act writes this package's coordination state into a document the package does not own. The write is the host
reach-in the package exists to refuse, arriving through the one slot that looks like configuration rather than like a
reach. **The artifact afterwards reads as a deliberate integration rather than as a package overstepping**, so nothing
downstream reports it. Measured: two seats met this obligation in one round, neither wrote into the host document, and
neither was prompted by this rule. One opened the slot, and one met the derived exemption in a report opened for another
question, and neither route is in the text.

**So the slot is read before the write, and the LOCKED marker binds the obligation rather than removing its
precondition.** A rule is the one consumer class no binding check reaches, because that walk compares what a mechanism
declares against what the configuration resolves, and a behavioral obligation declares nothing anywhere, so the
precondition holds here or it holds nowhere.

### It is not a cache, but the only board channel a bounded invocation has

**Measured by spawning an agent and asking what it received: the axis document and its digests arrive as injected
context, and the coordination board does not.** So the projection is not a convenience copy of a surface every reader can
also open. **For every bounded invocation it is the entire board**, and nothing else tells it a blocker exists.

**That inverts the cost of staleness.** A stale cache beside a readable source is untidy, because a reader who cares
opens the source. **A stale projection is a false statement delivered as the only statement**, and the failure is
silent in the worst direction, because the agent has no second source to disagree with.

**The measured shape: a projection asserting that no blocker is open and the whole pipeline is green, while a blocking
document is the most recently written file in the tree.** Every agent spawned in that window is told, by the one line
it is given, that the surface that outranks its queue does not exist.

### How to apply it

**Raising or deleting a blocker refreshes the projection in the same change**, neither at the end of the round nor on
the next board write. A blocker is precisely the fact the projection exists to carry, so the window between raising one
and saying so is the window in which the projection actively misstates the board.

**The refresh is part of the write, not a follow-up to it.** A follow-up is a second step, and a second step is the one
that gets dropped when the first one felt like the work.
