<!-- META TEMPLATE: the coordination graph. Every other template in this folder instantiates it. -->

# Coordination is a dependency graph. Surfaces are nodes, citations are edges, states are derived.

# Instantiate per project. Nothing here names a project, an agent, a tool or a count.

═══════════════════ MODEL ═══════════════════

## Nodes

| node    | is                                     | writers                                        | carries              |
| ------- | -------------------------------------- | ---------------------------------------------- | -------------------- |
| surface | a file agents read and write           | one or many, each owning its own records       | header, records      |
| record  | one addressable claim inside a surface | **exactly one**, declared on the record itself | schema fields, edges |

**One writer per record is the load-bearing invariant, and the quantifier is the whole of it.** Ordinals
allocate without coordination, last-writer-wins cannot occur, and foreign-scope protection becomes checkable
per record. Every other guarantee below assumes it.

**It is inapplicable to an outcome surface, and that is declared here rather than assumed.** A coordination
surface carries per-party claims, so a record is the unit and one writer per record is what the fence
implements. An outcome surface carries one product, authored jointly, such as a contract, a class statement or
a measured baseline, and it has no per-party unit for the invariant to range over. So the invariant does not
hold there weakly or partially: it has **no operand**, which is a third state distinct from held and violated.

**The declaration is the point, because the alternative is the contradicted-invariant class.** An invariant
silently assumed to cover a surface it has no operand on reads as held, so every derivation above it inherits
a guarantee that was never available, and nothing objects, because there is nothing to object about. Stating
the inapplicability with its reason is what makes the gap a decision rather than an oversight.

**Record structure is refused for these surfaces rather than merely unnecessary.** Partitioning a contract
into per-party spans would make it read as several parties' opinions where its value is that it reads as one
statement, and it would not buy what a fence buys anyway. The collision on an outcome surface is between
meanings, two authors independently deciding the same content is owed, and a fence protects a span while
observing nothing about a distant span stating the same contract. **So the mechanism that reaches it is the
announcement plus each author cutting its own duplicate**, which is a different instrument, and naming it
here is what stops a later reader proposing the fence.

**Stated per surface, it is false wherever a surface is shared, which is the normal case.** A coordination
surface every party writes has as many writers as parties, one record each, so the per-surface form does not
merely overstate the invariant: it describes a topology in which the shared surface cannot exist. The
per-record form is what the fence implements. The delimiter names its own writer, which is what gives a
neighbor a span to edit against and makes a whole-file write the unsafe path.

**And the two forms cannot be told apart at a single-writer surface, which is why the error survives.** Where
one party happens to own a whole file, per-surface and per-record agree on every observable, so the wrong
quantifier is correct on the easy case and wrong on the case the topology is for.

═══════════════════ STATING AN INVARIANT ═══════════════════

**A topology relies on invariants, and one it relies on without stating cannot be told apart from a property
a reader happened to infer.** Every guarantee derived from the topology then rests on that inference, so the
derivation is only as sound as an assumption no party wrote down. That is why an unstated invariant is not a
documentation gap but a defect in every claim standing on it.

**The test is not whether the invariant is true. It is whether anything would disagree if it stopped being.**
A property that holds today and has no dissenting mechanism is held by circumstance: nothing observes its
loss, so the first violation is silent and the guarantee above it keeps reading as sound. So an invariant is
stated with the thing that would object, such as a check, a refusal, a comparison or a party that would
notice, or it is stated as unheld and the derivations resting on it are marked with it.

**And it is stated in a surface the parties bound by it receive.** An invariant delivered to no party is a
capability nothing consumes: the tool that must honor it never reads it, the party that must not break it is
never told, and the statement is true in a file and absent everywhere it matters. **A mechanism that must
honor an invariant is the hardest consumer to remember, because it is the only one that cannot ask.**

## What an invariant is, against what it is not

| construct     | is                                                                             | is not                                                                                                     |
| ------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| an invariant  | a property the topology relies on, whose loss invalidates derivations above it | a measurement, since nothing records it firing, and it is what every mechanism assumes                     |
| a class       | the shape of a defect, transferable to a tree with nothing else in common      | a property of one topology, which is what an invariant is                                                  |
| a measurement | a reading taken at one coordinate, with its evidence, range and consumer       | a law, and a measurement copied into a template makes the next adopter inherit another project's incidents |

**So an invariant lands in neither surface unaltered and in both surfaces once split.** Its class, meaning
what kind of property it is, how one is stated and what a reader may derive from a stated one, belongs where
classes belong. Its row, meaning this topology's own instance, with what watches it, over which members, for
which consumer, and the failure mode any repair answered, belongs where measurements belong. **The invariant
itself is neither, and treating the row as the invariant is what makes it look homeless.**

## What a reader may not derive from a stated invariant

**It does not follow that the invariant is enforced.** A statement is a claim about the topology, and a check
is a mechanism over artifacts. Where one exists without the other, the honest form names which. An invariant
held by a tool rather than by a check holds exactly as long as every party uses the tool, and a hand path
around it is invisible to everything.

**Half-held is the common case and the one a bare statement cannot express**: a property observed on one axis
and assumed on another reads as whole, and the axis no party watches is where the first violation lands.

**Whether it holds over the whole structure is a separate question with its own section**, _how an invariant
reaches its set_, which states when a reader may derive structure-wide truth from a local check and when only
a walk decides it. That clause is not restated here: three sections of this document independently required
a statement to name its own set, and one contract in three places is the construct this model spends a whole
section refusing.

## A serialized hold is an invariant, and it is the one most often left implicit

**Where a construct holds every party's work, at most one of it exists at a time, and that is a property to
state rather than a consequence to mention.** A hold is a serialization point. Its whole function is that
everything waits on it, so two of them are two waits with no defined order between them, and the parties are
left to infer which one binds.

**It is left implicit because its violation looks like ordinary progress.** Nothing about a second hold appears
malformed. Each one is well-formed and reports itself correctly, and a mechanism counting holds reports two
blockers rather than one violation, so a reader must count to see it, and counting is the step no party takes
against a number that was one for a long time.

**The severe form is that a second hold can discharge an ordering the first one gated.** Where a closure edge
tests that something downstream exists, creating that downstream thing early satisfies the edge. So the
violation does not merely add a wait, it removes a brake, and the closure then reads as closer to ready than
before. **An invariant whose violation strengthens the appearance of readiness is worse than one whose
violation is merely unobserved**, because the party about to act is being told the wrong direction rather than
nothing.

**So the objector is named with the property: a count over the population of holds.** That comparison ranges
over a set the hold-reporting mechanism already assembles, which makes it decidable, and until it exists, the
invariant is held by every party independently remembering it, which is the state this section exists to name.

## The three slots a stated invariant fills

**Omitting any one of them leaves it unstated.** The property, in a form that could be false, since a
statement nothing could contradict states nothing. The set it quantifies over, since a property established
at one node and asserted for the whole structure is a verdict beyond its range. And the parties it binds,
because an invariant constrains actors rather than describing a shape, and the parties are what decides where
it must be delivered.

## The contradicted invariant, which no check can see

**Where the topology states the opposite somewhere else, every mechanism stays green while the invariant is
violated.** A mechanism implementing the contradictory statement faithfully satisfies every ordering its own
path checks, so nothing reports a defect: the contradiction is between two statements, and no query ranges
over both. This is the failure that outlives every other repair here, because each statement is individually
correct, each was written deliberately, and the disagreement exists only in a reader who happens to hold both
at once.

**So a statement is not the unit of the check, and the set of statements is.** An invariant is restated
wherever a party needs it, which is what delivery demands, and every restatement is a copy that can disagree
with the others. Adding a statement therefore adds an obligation: the set is re-derived whenever the invariant
changes, ordered by how often each copy is delivered rather than by which file is easiest to reason about,
since the copy a party meets most often is the one least likely to read as a statement of the rule at all.

## Edges

An edge is **an id in a field**. One construct serves whatever the relation, so one resolver answers all of
them and adding a relation adds no check.

| edge                                 | from → to         | means                              |
| ------------------------------------ | ----------------- | ---------------------------------- |
| `parent`                             | surface → surface | the target reduces this one upward |
| `satisfied-by`                       | record → artifact | resolves when the artifact exists  |
| `blocks`                             | record → record   | the target cannot close first      |
| `answers` · `refutes` · `supersedes` | record → record   | this record acts on the target     |

## Identity

```text
surface key = <declared>            in the header, never derived from the path
record id   = <surface-key>-<ordinal>   allocated once, never recomputed, never reused
subject key = <declared>            what the record is ABOUT, re-derived and compared every run
```

Two fields exist because one cannot survive both renames. An id derived from location breaks when the
surface moves, and an id derived from subject breaks when the subject is renamed. **Allocate identity,
declare subject.** Two records sharing a subject key is a finding, which is what catches re-derivation, and it
is why the subject key is not optional.

═══════════════════ STATES ═══════════════════

**No agent writes a state.** Every state is a query over the graph. A written state is a marker, a marker goes
stale, and a stale marker manufactures a false belief where an absent one reads as absence.

| state    | derived from                                                                  |
| -------- | ----------------------------------------------------------------------------- |
| open     | outbound `satisfied-by` unresolved, or none and no acknowledger has closed it |
| blocked  | an inbound `blocks` from a node that is open                                  |
| absorbed | outbound `satisfied-by` resolves                                              |

**Absorbed is a transition, never a resting state**: extract to the accumulator, then delete in the same
change. A record resting in `absorbed` is a status marker under a different spelling.

## Closing

| the record is satisfied by | closes by                                     | check                                       |
| -------------------------- | --------------------------------------------- | ------------------------------------------- |
| an artifact                | derivation, as the gate resolves the citation | none needed, since it is a query            |
| a judgment                 | its declared `acknowledger`                   | unacknowledged past `N` rounds is a finding |

`acknowledger` is **required or forbidden, never optional**. It is required where satisfaction is a judgment,
and forbidden where an artifact resolves it. Optional reintroduces an acknowledgement marker at the author's
discretion, which is the construct the derived states exist to remove.

`N` is declared as data the rule cites. It bounds a lifetime, not a size: a stall is literally a duration, so
it stands in for no construct. Size bounds do stand in for constructs and are refused, because they punish a
record carrying many short live items and are satisfied most cheaply by deleting a live one.

═══════════════════ SCOPE ═══════════════════

- A surface declares its scope, the scope is exclusive, and overlap is a finding.
- **A role is a declaration, not an address.** Addresses recur at every level of a hierarchy, so what an agent
  owns is claimed on its own surface and its letter or number is only where to reach it.
- Nothing is raised without a declared destination. Deletion is then lossless by construction rather than by
  the author remembering to extract first, since at delete time the incentive runs the other way.
- Reading binds to the surface an agent owns and its inbox, both bounded. A global surface every agent must
  read whole is unreadable at scale, and a rule that cannot be obeyed is worse than no rule: every party
  violates it privately and each concludes the fault is its own.

═══════════════════ READER CLASSES ═══════════════════

**A reader's class is derived from what it received, never from what it decides it is.** There are two
classes, and the rules divide unevenly between them.

| class          | receives                                                               | ends by                                         |
| -------------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| participant    | the surfaces it owns and its inbox                                     | never, since it waits and waiting has a command |
| bounded reader | a task and whatever the host injects, **never a coordination surface** | returning, which is its contract                |

- **The projection is the bounded reader's only channel to the graph.** Where a host injects a standing
  context, one derived line of it is the whole of what a bounded reader knows about every surface, so a fact
  absent from that line does not exist for anything spawned, however loudly a surface carries it.
- **A stale cache beside a readable source is untidy, and a stale projection is a false statement delivered
  as the only statement**, with no second source available to disagree with it. **The projection is
  therefore refreshed in the same change as the fact it carries**, never afterwards.
- **Its shape is part of its contract, not its style.** A refresh obligation that states when to write and not
  what shape to write has written half a contract, and the omitted half is the one that decays: every
  participant appends something true and current, no participant removes anything, and the projection grows
  past the size that makes it one. **A field whose name asserts a size is claiming a shape, and where no check
  reads it, the name is documentation and the shape is a hope.**
- **The rules divide into three classes, and the third is the dangerous one.** Reader rules, such as verifying
  before claiming, reading whole and attacking one's own output, bind both. Surface rules, such as fences,
  drains and schema, are vacuous for a bounded reader, which owns no record. **Turn-owning rules invert**:
  obeying _never end a turn_ literally forbids returning, and returning is the contract. **An inert rule does
  nothing, and an inverted one is actively wrong while reading as governed**, which is why the class is derived
  at authoring time rather than discovered at review.

═══════════════════ SCALE ═══════════════════

Surfaces form a tree through `parent`. Fan-in with no reduction grows without bound, and that growth is the
accumulation itself rather than a defect beside it.

| direction | operation                                                                                |
| --------- | ---------------------------------------------------------------------------------------- |
| down      | distribute: a parent hands scope to children                                             |
| up        | **reduce**: a parent publishes the fused result of its children, never their raw records |

Both paths are one requirement. Reduction without a bounded read still hands every agent a file it must
slice, and a bounded read without reduction is a slice with a nicer name.

**Reduction must be derived and checkable.** A fusion that silently drops one live item underneath it fails
exactly as a dropped record does.

═══════════════════ INDEX ═══════════════════

The index is generated from the directory on every run. **It is never hand-written**, because a hand-kept index
drifts, and it drifts silently since nothing compares it to what it indexes.

**It is checked in both directions**: an entry with no file, and a file with no entry. Checking one direction is
decorative, because the failure that occurs is a scan resolving a smaller set than it claims and the difference
reading as coverage.

**Every scan is depth-agnostic.** A scan anchored to a fixed depth reports PASS over what sits one level below
it.

═══════════════════ TEMPLATE CONTRACT ═══════════════════

Every template in this folder declares all four elements. **Schema alone transfers the shape and not the
guarantee**, since a stated rule with no gate reads as governance while each agent privately concludes the
backlog is its own indiscipline.

| element      | states                                                               |
| ------------ | -------------------------------------------------------------------- |
| SCHEMA       | the fields and their types                                           |
| LIFETIME     | when each field is written, and what deletes it                      |
| FAILURE MODE | what goes wrong when it is not obeyed, and how that failure presents |
| GATE         | the check that observes it, or `none` as declared debt               |

**A template ships classes, never instances.** The failure catalog carries shapes: a mechanism with no effect,
a green reading over a set that excluded its own subject, a hand-kept index drifting, a search used as a proxy
for a graph, a finding with no destination. It never carries which file or which agent, or the next project
inherits another project's incidents as laws.

═══════════════════ WRITE PROTOCOL ═══════════════════

| situation                                                 | mechanism                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| any write to a surface                                    | re-read immediately before writing, because a path not read this turn has unknown contents           |
| a tool rewriting a whole file it does not exclusively own | compare-and-swap: re-read, compare to the copy the transform was computed from, refuse on difference |
| a planned exclusive write to a shared surface             | barrier: proceed only once every peer is observed parked                                             |

The barrier and the compare-and-swap are complementary. The barrier covers the planned write, and the
compare-and-swap covers every other write, including the interval where a peer is active but not parked and
therefore invisible to the barrier.

**A compare-and-swap that refuses on any difference refuses mostly false contention.** Two writers editing
different records do not conflict semantically, because their operations commute and they collide only
textually, so a byte-level comparison cannot separate the two and rejects both. The refinement is to compare
**the writer's own span**: an untouched span replays the operation against the new content, and only a genuine
overlap refuses.

**This is only available because the surface is fenced per writer.** Without a per-writer span there is nothing
to compare and every collision looks identical, so the fence buys conflict resolution on top of the anchored
edit it was introduced for. **A queue is the wrong repair**, because it serializes every write where this
serializes only the overlapping ones.

**And a refusal carries the diff of that span, never the bare verdict.** _It changed_ sends a writer looking,
while the added and removed lines of its own span tell it what to re-derive against.

**Reporting success after losing a race is the one failure no downstream gate detects.** The file is
well-formed, every check passes, and the only evidence is content that is simply gone.

═══════════════════ CONVERGENCE ═══════════════════

A venue that **leaves the active surface when it converges** and an outcome that **survives convergence** are
two files. One discussion has one venue and one shape.

| stage   | rule                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------- |
| open    | the venue declares its own exit condition, or it is an indefinite halt                          |
| hold    | the venue's presence fails the pipeline, and that red is the intended state                     |
| sign    | one self-owned line per participant, and no participant countersigns another's record           |
| close   | the outcome is written to the surviving documents                                               |
| absorb  | the work the outcome implies is distributed as a checklist with an owner per item, and it lands |
| archive | once absorbed, the venue is moved to the archive, never on signature alone                      |

**Convergence certifies agreement and certifies nothing about the structure the decision was about.** Every
ordering a closure checks is satisfiable without a single change to the thing being decided, so a venue closed
on signature leaves a settled ruling, a clean gate and an unchanged system. **The stage that is invisible is the
one that clears the last visible signal.** While the venue stands, its presence reports that work is
outstanding, and the moment it closes, the only remaining work is the work nothing reports.

**So the closure has two questions and they need two surfaces.** _Is the decision unmade_ is answered by the
venue's own presence. _Is the decision built_ is answered by the distribution checklist, item by item, with an
owner on each. One surface answering both reports one state and hides the other.

**Leaving the active surface and leaving the repository are different operations, and a lifetime stated as
_deleted_ collapses them.** The first obligation is real, because a settled discussion that stays where seats
read every round is the accumulation the sweep exists to prevent. The second is not implied by it, and a
mechanism implementing the collapsed sentence faithfully destroys the argument while satisfying every ordering
the closure checks.

**The extraction does not cover the loss, because it is a compression by contract.** The durable half keeps the
class, its boundary and the mechanism revealed, and drops the positions, the refutations, the withdrawn claims
and the order they arrived in. So a reader holding the outcome and no argument cannot separate a ruling from a
preference, cannot see what was refuted on the way, and cannot tell whether a clause was contested.
**Extraction preserves the conclusion, and the archive preserves the reasoning.** A closure that performs only
the first has kept what it can restate and destroyed what it cannot.

**A position states its own `Costs`, and that field is not decoration.** An author naming what its own proposal
makes worse is what makes a position attackable, and a position no party can attack converges by exhaustion
rather than by agreement. Where this has been measured, most self-corrections in a convergence originate in that
field.

**Signing the outcome and conditioning the closure are two acts.** Conflating them either blocks agreement that
already exists or loses a rule no party disputed. A participant may sign the text without condition while asking
that a specific clause land before the venue leaves the active surface.

**Every outcome clause cites the position it came from, and an uncited clause is not agreed.** A party other
than the drafter runs the audit, because the failure it exists to catch is the drafter's own preferences entering
as consensus.

**Before the venue leaves the active surface, each participant walks its own records against the outcome.**
Anything durable that did not land is unreachable from the outcome afterwards, and "its durable half is already
there" is a claim until a party runs the check.

**A closure that destroys rather than archives is the one irreversible step, and it is not a step this model
prescribes.** Where a mechanism performs it, the mechanism is the defect. The closure obligations are satisfiable
in full without removing a byte from the repository, so a destructive closure buys nothing the move does not.

═══════════════════ SUPPORTED-CAPABILITY BASELINE ═══════════════════

**What this surface supports is read from the tree rather than believed, and a capability's state is not a
word.** Three fields decide it, and the six reachable states fall out of them rather than being chosen:

| field    | question                                            | permitted values                                    |
| -------- | --------------------------------------------------- | --------------------------------------------------- |
| evidence | has the mechanism been WATCHED, and with which sign | fires · fires-and-accepts · contradicted · none     |
| range    | over which members does that evidence hold          | the named set · NOT-APPLICABLE with its reason      |
| reach    | which consumer receives what it produces            | the named consumer · NOT-APPLICABLE with its reason |

**`range` and `reach` are NOT-APPLICABLE rather than false where no mechanism has been watched**, because there
is nothing for a range to quantify over and nothing for a consumer to receive, and a boolean asserts a value
where the question does not apply. That collapses the no-evidence region to two states, split by whether a
fixture or a surface is named, and leaves four where evidence exists, split by range and reach. The total is
six, not three and not eight.

**When a state set cannot express a real case, the missing thing is a member or a dimension.** A member is a
word the set forgot, and a dimension is a question the set never asked. Reaching for a word where the answer is
a dimension produces a tier, the construct a binary verdict refuses, and the two are separated by asking whether
the new state differs from an existing one by degree or by subject.

**The four states with evidence, each instantiated rather than argued:**

- **Range and reach:** a fenced per-writer record, watched to fire on an undelimited record, watched to accept
  every conforming one, quantified over every record on its surface, and received by every party writing there.
- **Reach without range:** that same fence as first shipped, demonstrated on one surface, delivered to every
  reader of it, and believed for a concern it never covered. A second surface then shipped without the record
  entirely, which is the cost of the missing quantifier rather than of the mechanism.
- **Range without reach:** a projection check, correct over its declared population, with the branch that
  runs it disabled because its host slot resolves ABSENT. It fired never, accepted never, and is exempt by
  derivation.
- **Neither:** a roster filter matching a state cell by containment, where the longer state word contains the
  shorter. It returned every identity the accumulator had ever held, and nothing consumed the result as a
  discrimination, because until one party went inactive the wrong answer and the right answer are the same set.
  **It is a mechanism that has never discriminated on its axis, whose consumer could not have noticed.**

**A row records the state after a repair, so it also names the failure mode that repair answered.** Without it,
a later reader sees a proven capability and cannot tell that it was operationally absent for a whole prior
period, what made it reachable, or that the same absence returns the moment a new surface copies an old
template.

**There are three families of control, and the third is free:**

- A negative control is only safe where the check can see it, so a violation is never planted to demonstrate
  blindness, because the plant lands inside the blind spot and nothing reports it again.
- A blocked operation is the one place a destructive tool is tested honestly, because the precondition stopping
  the destructive branch is the same one making the refusal observable.
- **A violated ordering is a free negative control for the mechanism that answers it.** The collision has
  already run the experiment, so the sequence is to measure the violating state, land the declaration and
  confirm the accepting state, a pair drawn from reality rather than constructed. It is available only until
  the repair lands, and it salvages an edge that was hit rather than rewarding hitting one.
- **An honored ordering schedules a control**, because the state that makes a branch reachable arrives as a
  consequence of doing things in the right order. It is the only member of the family that costs nothing and
  needs no accident, and it is only as reliable as the schedule, so the read belongs in the precondition set
  rather than in an instruction a party remembers.

## Where the rows live

**The table this framework fills is an instance and never ships with the model.** Its rows name mechanisms,
populations and consumers that exist on one tree, and a row copied into a template makes the next adopter
inherit another project's incidents as laws, which the first three lines of this file forbid. So a project
instantiates the baseline on its own product-layer surface, and this file states only how a row is decided.

**A range is a population and never its size.** Where the population is one the pipeline derives, the row names
it, because a transcribed count is wrong from the first change no party propagated while reading as current,
and the report on disk already carries the size.

**A contradicted row is why a fourth state was proposed and rejected.** A capability no party tested and one a
party measured failing are both unproven, and only the second is a known defect with a reproduction. The
difference is a sign on the evidence axis rather than a new state word, and treating it as a word is the tier
move.

## When a set of local claims composes into a global one

**Each party declares its own scope and verifies it by declaring it, and the global property is a fact about the
set.** So the question is never whether each party checked its own, since every one of them did, correctly, but
whether anything holds two of them at once. Where nothing does, the global property is an assumption that every
local verification reinforces, because each verification is real and none of them ranges over the conjunction.

**Ask collapse first, before any of the three.** Where one fact is declared twice, the repair is not a comparison
at all: reduce it to one declaration and one derivation, and the divergence becomes unrepresentable rather than
detectable. A comparison is built only where collapse is unavailable, because every check that compares two
declarations of one fact is a mechanism paid for on every run to detect a state that need not exist.

**The test that selects it is whether either declaration is derivable from the other.** Where it is, the
derivable one stops being authored and the pair collapses. Where neither is, as with two independently observed
facts that merely agree, or a value and a judgment about it, collapse is unavailable and the three modes below
apply. **That is one question, and asking it first is what stops a comparison being built over a duplication
that should have been removed.**

**So the section reads as a design order rather than a taxonomy of checks:** collapse where possible, and only
then ask what kind of comparison the remainder needs.

**Three modes are separated by one question: does the operand to compare exist as a value?**

| mode        | the state                                                             | the repair                                                                               |
| ----------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| no operand  | one side is a PREDICATE whose extension is written nowhere            | **evaluate** it over the population, since there is nothing yet for a comparison to read |
| unjoined    | both operands exist and are readable, and nothing holds them together | **join** them                                                                            |
| false unity | several declarations DENOTE different things while reading as one     | **distinguish** them                                                                     |

**Mixing the last two is the expensive error in both directions.** A join applied to false unity builds a
mechanism over an empty intersection, and a distinction applied to an unjoined pair severs a relation that was
merely uncompared. Telling them apart is a question about what each operand denotes rather than about how the
two are worded.

### Comparability is a property of the kind pair, never of a claim

A claim names its scope in one of a few kinds, and the kinds decide what a comparison can do:

| pair                                        | how disjointness is decided                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| container against container                 | prefix                                                             |
| named instance against named instance       | equality                                                           |
| extensional class against extensional class | set intersection                                                   |
| container against named instance            | containment                                                        |
| **predicate against anything**              | **evaluate the predicate, since no textual comparison decides it** |

**So a claim set is only as comparable as its least comparable kind.** Admit one predicate kind and the
disjointness question stops being decidable by text for the whole set, because every other claim now has to be
checked against an extension no party has computed. A predicate claim and an extensional claim can be read side
by side indefinitely without their overlap appearing, which is why an overlap of that pair produces no symptom
and is found only by a party evaluating rather than reading.

### A predicate is evaluated against a member, so the invariant relocates rather than failing

**Evaluating a predicate needs something to evaluate it on, and that operand is never the other claim.** Two
claims of different kinds share no common operand, which is what makes the set question undecidable, while any
single member of the population supplies one to each: a container answers by prefix, an instance by equality, a
class by its type, and a predicate by being applied. **So the comparison moves from the pair to a member, and it
is well-formed there for every kind pair, including the one that has no textual decision.**

**The consequence is the useful half: a claim set can be uncheckable at set granularity and fully checkable at
member granularity.** The invariant is therefore restated over the things the claims govern rather than
abandoned. Every write, every artifact and every unit the claims are about is a member, and each one is a
decidable instance of the question the claim pair could not answer.

**That is why the manual finding arrives before the mechanism, every time.** A reader holding one artifact
against two claims is performing exactly this evaluation, one member at a time, and will produce collisions a set
comparison provably cannot. It is not a weaker method waiting to be automated. It is the correct operation at the
only granularity where the question has an answer, and the mechanism worth building is the one that performs it
over the whole population rather than one that compares the claims.

**The cost is that member granularity is unbounded where set granularity is finite.** A claim pair is one
comparison and a population is as many as it has members, so the relocation trades decidability for volume,
which is affordable exactly when the members are already enumerated by something else, and expensive when the
population has to be built to ask the question.

### A distinction is safe where the surfaces share an existing key

**Splitting a surface that holds two concerns is correct, and it manufactures a relation.** The two halves still
answer to one another, so the repair for false unity creates a candidate for the unjoined mode inside itself.
**The criterion is whether the resulting surfaces already share a key.** Where they do, the relation is
recoverable by an operand both sides carry and the split costs nothing. Where the relation would have to be
re-declared, the split trades a one-time overlap for a divergence every round, and that is the worse trade.

### Every divergence repair asks which side is authoritative, first

**A join reports that two declarations agree and can never report that the agreed value is right.** So the repair
splits into two operations that wear one word:

- **One side cites the other.** The direction is forced, because a citation follows its referent, and the repair is
  bookkeeping with no decision in it.
- **Both sides declare.** A decision is being taken about which value is correct, and the gradient runs toward
  whichever side is free to change. Converging on the cheap side and reporting it as maintenance is the
  substitution this whole section is about, performed by the party doing the repair.

**Asking which side is authoritative before touching either is what separates the two**, and it is one question.
The consequence for the check is that its green is a correctness verdict only where one operand is authoritative,
and elsewhere it says two things match without saying either is right.

## How an invariant reaches its set

**Naming the set is one fact and reaching it is another.** Where the structure nests, the second decides whether
local validation is sufficient, which is the entire reason to nest, so an invariant that leaves it unstated leaves
the nesting unjustified.

**An invariant composes where each node verifying it over its own children makes it true of the whole by
induction.** Containment is the case, and it needs a clause its usual statement omits. A child's scope inside its
parent's, plus siblings disjoint, gives global disjointness only if a parent's own scope is also disjoint from the
union of its children's. A child's scope is a subset of its parent's, so without that clause a parent and its
descendant overlap by construction, at every level, and the invariant permits exactly the collision it exists to
forbid. The omission is invisible in the usual three-clause form and compounds with depth.

**An invariant does not compose where it is false only in a configuration no single node can observe.**
Acyclicity is the case: a cycle is a property of a path that leaves a node and returns through nodes it does not
know, so every local check passes on a structure that contains one. Two further cases share the shape. One is what
survives a fusion, since a parent cannot verify that each child dropped a different thing. The other is what
happens when a child never reports, since the decision is one no child observes and no parent derives.

**Treating the two kinds alike is what makes a nested design look cheaper to verify than it is.** They read
identically as one line in a diagram, and the difference is the whole of what nesting buys. So an invariant is
stated as local with the induction that closes it, or global with the walk that decides it, and a reader may
derive tree-wide truth from a local check only in the first case.

**An operation that is exclusive over the whole structure has no home but the root and does not scale with it.**
That is inherent rather than a defect, and it is stated for that reason: an unnamed serialization point is planned
around by every party and budgeted by none.

## What a check evaluating one state can and cannot enforce

**A property that is a relation between two states is not enforceable by any check evaluated against one.**
Presence, shape, membership and conformance are all decided from a single reading, while a rule about how content
changes, such as that it may grow and not shrink, that it may be corrected and not removed, or that a value may
advance and not retreat, is decided only from two. The two questions read as one because a populated surface
satisfies both, and they separate exactly at the moment content leaves.

**So the guarantee such a check gives is directional, and the direction it omits is usually the one the rule was
written for.** A required section is enforced from empty to full and silent from full to empty. The reverse
transition passes every check that exists, so the operation the rule forbids is admitted by mechanisms that were
never asked about it, and their greenness is then read as covering it.

**This is not a strictness problem and cannot be repaired by tightening.** A stricter single-state check is still
evaluated against one reading, so it produces a more demanding check with the identical blind spot. The repair is
an arity change: retain the prior state and compare, which is a different mechanism rather than a stronger version
of the existing one.

**A retained prior state is legitimate exactly where a mechanism consumes it to compute a verdict**, and it lives
in the artifact that comparison produces, going when the comparison goes. A retained value nothing compares is a
record of the past in a technical spelling, and the test is whether removing the comparison would leave the value
still written.

### Which layer may hold the second state is a separate constraint, and the arity clause alone invites the wrong answer

**A single-state checker is a function of the current state by contract**, so the arity repair cannot be performed
where the checkers live. A checker is handed what exists now, meaning the members, their contents, whether each is
present, and the root they hang from, and every one of those describes one moment. A checker reaching outside that
to fetch its own prior output has stopped being a function of what it was given, and the contract refuses it for
the same reason it refuses any other undeclared read: what a mechanism consumes is what the surface handing it
work can see.

**So the second state belongs in the layer that already spans two runs**, the one that records each member as it
reads it, records again at the end, and publishes what moved between. That layer exists because something must
span runs for a report to describe a moment at all, and it is the only place a retained extent is held by a
mechanism rather than smuggled into one.

**Stating this beside the arity clause is what stops the clause producing the wrong build.** The clause says the
repair is a comparison across two readings and says nothing about where a comparison may live, so the obvious
implementation is a checker that remembers, which typechecks, computes correctly, and breaches the contract in a
way only a governance walk sees. The shape was measured twice on one mechanism in one round, first as a crash in an
operand it reached for, then as a contract breach when the operand was repaired. Both failures came from one
assumption, that a checker may hold whatever its comparison needs.

**And the split runs cleanly through a pair that looks like one job.** Comparing content against its own prior
extent needs two readings and belongs to the spanning layer. Comparing content against a declaration that governs
it needs one reading and is shaped like a checker, because the declaration is present in the same state as the
content. Those are two comparisons over one operand, one of arity two and one of arity one, so a pair consolidated
on the operand splits on the layer, and only building both reveals which line matters.

### The comparison has three results, and the third is the one a builder omits

**Unchanged, shortened, and not comparable.** The third arises whenever the two states were taken over different
sets, with one reading covering a narrower scope than the other, or covering only what some other mechanism
happened to open. A comparison built with two results encodes the third as one of them, and which one it picks
decides whether the failure is silence or a false accusation.

**The false accusation is the dangerous direction, because a refusal acts on it.** A mechanism that treats absence
from the set as absence from the surface reports every unreached member as removed, and a refusal keyed on that
blocks correct work on evidence the mechanism manufactured by being run narrowly once. Silence merely fails to
protect, while a false refusal punishes the party doing nothing wrong.

**So the retained state records the set it was taken over, and a comparison across differing sets refuses rather
than computing.** That single clause subsumes both hazards without either being special-cased. A narrowly scoped
reading declares its own range and the next comparison declines it, and a member outside the reading's range
reports unmeasured rather than unchanged. It is the rule that a verdict carries its set, applied to an operand
rather than to a report.

### A mandated field acquires a mechanism only in a form a mechanism can join on

**A field whose value is drawn from a closed set or is an identifier can acquire a consumer at any time, and a
field whose value is free prose cannot, ever, without changing its form.** Both are mandated, both are filled, and
both read as governed, so the distinction is invisible from the schema and decisive for everything downstream.

**The consequence is that an unread typed field is an opportunity and an unread prose field is not.** The first is
a complete population awaiting one mechanism, and the historical series comes free the moment a party writes it.
The second has nothing to be built on, because any mechanism over it would infer meaning from text, which is a
heuristic rather than a derivation.

**So a field is mandated in a resolvable form, or it is declared to be for readers.** Stating which costs one word
and prevents the state where a surface reads as governed on a property nothing measures, and where the party
filling the field assumes a consumer while the party who would build one sees no operand, with neither wrong about
what it can see.

## What declares a lifetime, and what a declaration is made of

**The status axes and their two failure directions are stated above.** They are asked of each property axis, with
identity the failure of enforced-and-undeclared and action the failure of declared-and-unenforced. This section
states what makes a declaration one, which is a separate question and the one a repair turns on.

**Path shape may discover which surfaces are candidates, and it may not decide what they are.** Discovery by shape
keeps the coverage, since a shape test catches every member, including ones no party declared, and identity by
declaration fixes the lifetime. **And a declaration counts as declared where a mechanism resolves it.** Where the
text sits is a consequence rather than an axis, since a statement in a governance surface that something reads is
resolved, and a statement in a surface's own header that nothing reads is not.

## The declaring surfaces are inside the population

**A missing declaration on a governed surface is caught by whoever reads the governance. A missing declaration in
the governance is caught by no party**, because there is no layer above it to notice. That is the same asymmetry as
a mechanism that checks every rule except itself, and it takes the same answer: the governance is subject to its
own walk.

**So a rule that exempts the rules has installed its own blind spot.** A governing surface admits content classes
with opposite lifetimes exactly as a governed one does, such as a directive that is current until discharged,
beside evidence that retires only by extraction. A rule stating that split for one surface class while its own
class goes unstated is the gap arriving inside the mechanism built to close it.

**An obligation declared against a carrier does not transfer to another carrier of the same content**, and an
obligation naming a surface does not survive a tool whose surface is an argument with a default. Both were measured
on one channel at a complete population: every party bound by a read obligation, every one having read it, and
every one applying none of it to the stream. That is evidence that the consumer was never built rather than
evidence about where the statement should live.

## A lifetime is a set of axes, and one word makes the rest unstatable

**How long a surface's contents live is three independent questions, not one.** Retention asks what stays and for
how long. Mutability asks whether a landed statement may be rewritten. Removal authority asks which party, if any,
may take content out. No two are derivable from each other, and a topology that runs more than one kind of surface
will exhibit surfaces differing on each axis independently.

**A single-word vocabulary is true of every surface and sufficient for none.** Name two lifetimes and a reader
learns retention and infers the other two, and the inference is wrong in both directions: a surface that keeps
everything and forbids rewriting, one that keeps everything and admits any writer, one overwritten by a mechanism
rather than by a party. The word reads as complete while two thirds of what it claims to state is unavailable,
which is why its own presence is the evidence that lifetime is declared.

**And the axis a one-word form drops first is removal authority**, because it is the one a reader assumes follows
from retention. It does not. Keeping content and forbidding its removal are separate claims, and a mechanism
implementing the first faithfully can perform the second. Where the two collapse into one word, an operation that
ends a surface's contents is authorized by a sentence about how long they were meant to last.

**Each axis takes a value from a closed set, and that is what makes the declaration an operand rather than a
sentence.** A field whose value is drawn from a closed set or is an identifier can acquire a mechanism consumer
whenever one is built, and a field mandated as prose cannot, ever, without changing its form. So a lifetime written
as a paragraph reads as governed, satisfies every author, and is joinable by nothing.

**The members are declared in the parameter surface and are not restated here.** The three sets live under the
lifetime declaration's `values` field, where a mechanism resolves them, and this surface states what each axis
separates, which is the half no parameter surface should carry. So there is one member set with two consumers
rather than one set stated twice. A reader follows the meaning here and a check follows the members there, and
neither holds a copy of the other's half.

**The axis column below names each axis with its kind word attached**, so a row of this table is not shaped like a
declaration. A mechanism reading a lifetime looks for an axis name followed by its value, and a cell holding the
bare axis name followed by a sentence is a declaration carrying an off-vocabulary value to anything that joins on
shape. Naming the row for what it is, an axis described, is the use-versus-mention separation done on the mention
side, which is the sanctioned repair where a surface must contain the construct it describes.

| the axis                   | what separates its values                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| the retention axis         | what ENDS a piece of content: nothing, a newer version of itself, the completion of what it asked for, or its producer regenerating the whole surface |
| the mutability axis        | whether a landed statement may be rewritten, and by whom: its own writer, or no party                                                                 |
| the removal-authority axis | who may take content out: no party at any point, whoever wrote it, whoever discharged it, or the mechanism that regenerates it                        |

**The sets are closed against adding a value casually and open to a declared extension**, which is the same
discipline every controlled vocabulary here takes. An unlisted value is an approved edit to the declared set rather
than a naming choice taken at a use site, because a vocabulary that grows by one word per surface is not closed and
cannot be joined on. An extension therefore lands in the declaration and its separating clause lands here, in one
change, since a member with no stated separator is a token and a separator with no member is a description.

**The values are not ordered and none is a default.** A surface that declares nothing is undeclared rather than
accumulating by default, and collapsing the two makes an unmeasured surface indistinguishable from a measured one,
which is the distinction the whole declaration exists to draw.

### Retiring a surface is the worked example, because it moves some axes and preserves others

**The operation that ends a surface's working life is the case that proves the axes are independent, and it is
available in any topology that retires anything.** A surface is closed and relocated to a terminal position: its
contents are kept exactly as they stood, and nothing may be written to it again. Retention is unchanged, and that
preservation is the entire reason the operation is a relocation rather than a discharge. Mutability inverts
completely, from every participant to none. Removal authority changes in kind rather than in value, from a refusal
that would lift when the surface closed to one that never lifts.

**So no single word covers the surface before and after, and the two states are the same contents.** A form
carrying one lifetime per surface must file them as two unrelated entries, and the relation between them, that
retiring preserves what the surface was for and withdraws only who may add to it, has nowhere to live. **That
relation is the operation**, so a form that cannot express it cannot describe the one lifecycle the topology
performs.

**And the axis a summary drops here is the one the operation exists to guarantee.** Forced to one word, a reader
takes the weakest, that the surface is now unwritable, and loses the claim that everything in it is still there.
A topology that retires surfaces in order to keep their contents would then be documented as one that retires them
in order to close them, which is the opposite of why the operation is performed.

### The status axes are asked of each property axis, never of a surface

**Whether a lifetime is declared and whether it is enforced are two further questions, and they are asked of a
property rather than of a surface.** So a surface occupies one status cell per axis rather than one cell overall,
and the cells routinely differ: a property can be stated and unheld, held and unstated, both, or neither, and one
surface commonly exhibits three different answers at once.

**An aggregation over the axes reports the weakest one and does not say which.** A reader taking a single
per-surface cell inherits the strongest claim that weakest axis supports, so a surface whose retention is stated and
partly held reads as wholly ungoverned when its mutability is silent, which amounts to a verdict published without
the set it was taken over, at the granularity of a lifetime.

**The two status failures need different repairs, which is why collapsing them loses the repair too.**
Enforced-and-undeclared fails on identity: the property is carried by something incidental, such as a name, a
location or a convention, so it changes when that changes, with nothing able to contradict. Declared-and-unenforced
fails on action: the statement is correct and every reader who reads it applies it correctly, and nothing stops the
one who does not.

### A section declares only where it differs from its file

**A surface whose sections carry different lifetimes cannot state one at file granularity without being false of
most of them.** A document holding an immutable preamble, an accumulating body, current-truth fields and a
write-once block has at least four, and the file-level word is true of whichever the author had in mind.

**The bound that keeps this cheap is that a section declares only where it differs from its file.** The file states
a default across the axes and each divergent section states only the axes on which it diverges, so the common case
is one statement and the exceptions are countable. Without the bound, the declaration multiplies by sections times
axes and is not written, and with it, the surface records answers that already exist.

**A mechanism operating on such a surface is correct by target rather than by reading.** Where an operation happens
to address the section whose lifetime matches the file's word, it behaves correctly for a reason unrelated to the
declaration, and the same operation pointed at a neighboring section would be authorized by the same sentence to do
the wrong thing.

**And the sub-unit is the part that must not change, which makes a file-level word wrong in a predictable direction
rather than a random one.** Wherever a surface divides, the narrower unit is the more constrained one. A document is
replaced while the evidence inside it may only be extracted, a discussion is written while its landed statements may
not be revised, and a record is edited while the identity that names it is fixed for good. The permissive answer
belongs to the container and the restrictive one to the part.

**So a single word inherited from the file is always the looser of the two, and it authorizes operations on exactly
the content that forbids them.** A reader taking the file's word for a sub-unit is never accidentally too strict.
The error has one direction, and the direction points at whatever the surface was most careful to protect. So the
sub-unit declares and the file defaults, rather than the reverse, because the exceptions are the constrained ones,
and constraints are what a declaration exists to make reachable.

**The granularity that divides is a property of the surface rather than a fixed level.** A document divides by
section, a record-structured surface by record and a tabular one by column, and the pattern holds at each, which is
what identifies it as one shape rather than three readings. A declaration form that names a fixed sub-unit is right
about the surfaces it anticipated and silent on the rest.

**And the dividing unit need not be structural at all, which is the case a form built from structure cannot
reach.** A surface can hold two classes of row that are identical in shape and differ in lifetime: one class written
by the parties the surface indexes, another shipped with the surface itself and never rewritten by any party.
Nothing in the layout separates them, and the discriminator is what the rows mean. So a declaration keyed on
structure finds one unit where there are two, and the class it misses is the frozen one, which is the direction the
clause above already names.

## A duplicate is decided by counting its distinguished copies, and the count has three verdicts

**A fact stated in more than one place is not yet a defect.** What decides the disposition is how many of its copies
are distinguished. A copy is distinguished by being the unique source every other is derived from, or by being the
unique copy a mechanism resolves. Every other copy is a member of the set and distinguishes nothing, which is a fact
about that copy rather than a reason to exclude it.

**Membership is any consumer at all, mechanism or reader.** A copy something resolves and a copy a party reads are
both members, because both are places the fact can be found and disagreed with, and only a copy nothing reaches is
outside. Whether a copy is resolved is recorded per copy rather than applied to admit or exclude it, since a
population defined by what a mechanism happens to join on measures the mechanism instead of the duplication.

**The count of distinguished copies yields exactly three verdicts, and each names a different action.** Exactly one
gives a direction: every other copy collapses toward it, and the collapse is takeable. Zero refuses as a cycle: no
copy is derived from any other and no copy is the one a mechanism reads, so nothing distinguishes a target, and
choosing one would invent an authority the set does not contain. More than one refuses as undeclared: two copies
each claim to be the source, which is a contradiction the set states about itself and which no reader can resolve
without deciding it.

### The zero-source refusal is the acyclicity ruling, in the form a duplicate reaches it

**A second declaration is an edge rather than a fact beside the first**, so a set of copies is a graph and its
collapse is a direction along that graph. Where exactly one copy is distinguished, the graph has a root and the
direction is read off it. Where none is, the graph has no root, because every copy points at every other or at
nothing, and a collapse would have to choose a root the structure does not supply.

**So acyclicity is the precondition for a collapse rather than a question beside it**, and the refusal is the
ruling. A set with no distinguished copy is refused because it is cyclic, not because the copies are hard to
reconcile. That is decidable from the set alone and needs no judgment about which copy is better.

**And refusing is the whole of the correct behavior there, which is the part a builder is most tempted to
improve.** A tiebreak fired over a cyclic set converts a correct refusal into a confident wrong answer: the set still
has no root, and the mechanism now reports a direction a party has to trust. A refusal that names the cycle leaves
the decision where the information is, and a tiebreak moves it to whoever wrote the tiebreak.

### The two stages are ordered, and the ordering is what keeps a refusal a refusal

**Derivation is counted first, and resolution is consulted only where derivation is silent.** A set with a unique
derivation source has its direction from that source alone. A set where no copy derives from another is where
resolution speaks: a unique copy a mechanism resolves distinguishes itself, and the direction follows.

**Where derivation has spoken by refusing at many sources, resolution is not consulted at all.** Two declared
sources are a contradiction the set states, and asking a second stage to break it produces a direction neither stage
supports, a refusal converted into an answer by consulting a tiebreak. So the stages are ordered rather than merged,
and the ordering matters exactly when a set is contended, which is the only time either stage carries weight.

**A merged form is safe wherever no member exercises the contended state, and that is a property of the population
rather than of the mechanism.** The distinction costs nothing to state and cannot be recovered once a member
arrives, which is the argument for ordering the stages before the case exists rather than after.

**The general form is therefore that a lifetime declaration is wrong at whatever granularity the surface was not
partitioned by**, and section, column and row class are three known cases rather than the set. A surface states its
own dividing unit because only its author knows what divides it, and a form that enumerates the units in advance
has guessed at a list whose next member arrives with the next surface.

## The period of a derivation decides what its copies are, and it has three values

**Where one copy of a fact derives from another, the edge between them runs at a period, and that period decides
whether the copy is stale or is a record.** It is not a refinement of the direction question. The direction says
which copy is the source, and the period says what the non-sources are.

| period     | the derivation         | what a comparator does                                 | disposition                                          |
| ---------- | ---------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| continuous | runs on every read     | saturates: the copy cannot differ                      | nothing is owed                                      |
| periodic   | runs between stores    | discriminates, and re-derivation repairs what it finds | a comparator is owed, and its absence is the finding |
| one-shot   | runs once, at creation | detects a difference **nothing can repair**            | DIAGNOSE the copies, repair the SOURCE               |

**A one-shot edge exists at the moment of creation and not afterwards**, so every later divergence is permanent by
construction: the source moves, the copy does not, and no regeneration exists to run. The copy is therefore a
record of what the source said at that moment rather than a stale instance of what it says now, which inverts the
repair, because collapsing it destroys evidence instead of removing duplication.

**A comparator on a one-shot edge is correct and its finding is unrepairable**, which is the state a binary verdict
cannot express. It reports a permanent difference whose only remedy is destroying the record it reports on, so the
remediation is unreachable, and the honest instrument is a report naming the source, the one-shot edge and which
copies are unwritable, so a reader opening a copy learns it is a record.

### The nesting test separates periodic from one-shot, and it is a count rather than a reading

**Periodic copies nest.** Each was regenerated from one source at a point in a sequence, so an older copy carries a
subset of a newer one and the counts step down cleanly by copy.

**One-shot copies are independent combinations.** Each was fixed at its own moment against a source that was itself
mid-change, so different parts are missing from different copies with no version line through them.

**So the test is to count per clause rather than per document, and ask whether the sets nest.** Counting whole
documents gives one number and hides the answer, while counting the parts gives a set per part, and whether those
sets order themselves is the discriminator. That distinguishes pending work from an accumulated record with no
judgment about intent, and it is the same move as reading a value column rather than a summary cell.

## A statement about a concurrently written surface is a read rather than a state

**A party asserting what a shared surface contains is holding a copy derived once at the moment of reading.** The
assertion is true then and is a record afterwards, because the surface keeps moving and nothing re-derives the copy.
That is the one-shot edge above, arriving on the statements parties make about the tree rather than on the tree.

**And where several parties write one surface in a short window, two statements disagreeing about one fact are both
correct reports of different moments.** Each describes the surface accurately as of its own read, the surface itself
carries only its current contents, and no authority, seniority or later arrival settles which describes it now.

**Write-ordering and read-ordering are different questions with different records, and merging them is what makes a
disagreement look unsettleable.** Where statements land in an addressable transport, each carries the moment it
landed, so which was written first is precisely recoverable: a declaration present, correct, delivered on every
statement, and typically joined on by no reader. Read-ordering is a different operand, since a statement written
late may rest on the earliest read of all, so precedence is no evidence at all about staleness.

**Where a mechanism watches a surface for a party, the read is recorded for that party, as the content it last saw
rather than as a moment.** That is the stronger form, because staleness asks what was seen rather than when, and it
is already kept wherever a party is delivered a diff of what changed since it last looked. Joined against the
surface as it stands, those two are two derivations of one question, and they answer the interval directly.

**Where nothing watches the surface for the party, as with a shared prose surface with no per-party record, the read
is genuinely unrecorded, and that is where the operand is missing rather than merely unjoined.** The write path still
detects it, because an anchored edit against a surface that moved since its author read it reports exactly that.
The detection reaches the author and no reader, so the fact survives only if its author states it.

**So three questions take three instruments.** Precedence is settled by the landing stamps and needs nothing opened.
Staleness is settled by the party's own last-seen content where a mechanism keeps it, and by the author's report
where nothing does. Contents are settled only by opening the surface, and neither of the other two touches them.

**The shorter the window, the more confident the wrong reading.** A party reading a surface, reasoning about what it
found, and writing the conclusion has a gap between the read and the write that is invisible to it and fully occupied
by peers. Nothing about the read is careless. The state simply moved inside the gap, and the resulting statement is
stated in the present tense about a past moment.

**So the disposition is to diagnose against the surface rather than argue between the statements.** A disagreement
about contents is settled by opening the file, which costs one read and cannot be answered by reasoning from either
account, and the source to repair is the surface, never the statement, which stands as the record of what its author
held.

**That is why such a statement is written as a read rather than as a state.** Naming what was read and when it was
read converts a claim that will silently go stale into a record that is accurate forever, and it leaves a later
party able to tell a moved surface from a mistaken reading, which is a distinction no present-tense assertion
preserves.

## The apparatus walked end to end on one fact, because the axes decide each other

**The axes above are stated separately and are not applied separately.** A party holding all of them still has to
walk them in an order, and the order is not free: the count decides whether a direction exists, the period decides
what the non-sources are, and only both together decide what is owed. Walked out of order, the same set yields a
repair that destroys evidence or a comparator over an edge that cannot exist. The walk below takes one fact through
the whole apparatus, so a reader has an instance rather than five definitions.

**The fact.** A dispatch rule, one value selecting which of two closure paths a construct takes, stated in a
mechanism that resolves it and in several surfaces that describe it.

**Step one: enumerate the members, which is any consumer at all.** Every place the fact can be found and disagreed
with is a member: the branch that resolves it, the message printed when the choice is refused, the entry in a form's
own usage text, the paragraph in each governing document, the schema block in the surface it governs, and the copy
in the template that surface is raised from. A copy nothing reaches is outside, and a copy only a reader reaches is
inside, because a reader acting on a wrong copy is the failure the count exists to find. **Recording whether each
copy is resolved is not the same as admitting it**, since a population defined by what a mechanism joins on measures
the mechanism.

**Step two: count the distinguished copies.** Exactly one copy is the unique one a mechanism resolves. None of the
others derives from another, and none is a source any of the rest is generated from. So the count is one, the verdict
is a direction, and every other copy is nominally collapsible toward it.

**Step three: read the period of each edge before acting on the direction.** No derivation runs from the resolved
copy to any of the others, since each was authored once, by hand, against the fact as it stood. Every edge is
therefore one-shot, and the direction the count produced is a direction along edges that do not execute. **The count
says a collapse is permitted, and the period says what a collapse would cost**, and only the second knows that each
non-source is a record of what the fact said when that surface was written.

**Step four: the disposition inverts, which is the step a count alone cannot reach.** A one-shot copy is not a stale
instance awaiting regeneration. Collapsing it removes evidence and leaves the surfaces that carry it silent about a
value their readers must supply. So the repair is not the collapse the count authorized. It is to diagnose the copies
against the source and repair the source, and, where the copies disagree only in what they reach, to add the copy the
population is missing.

**Step five: the missing copy is found by asking what each one reaches rather than what it says.** Every copy here is
correct. The refusal reaches a party who omits the value, the usage text reaches a party who asks for it, the
governing paragraphs reach a party reading the protocol, and the schema reaches a party reading the surface. **None of
them reaches a party who supplies a correct value by copying a working invocation**, which is what a fluent party does,
and whose classification nothing checks. So the population is complete in content and has a hole in delivery, and the
hole is exactly the shape of the parties least likely to be caught.

**What the walk produces.** One new copy, printed on every successful use, delivered one step after the choice rather
than before it. It cannot prevent the first wrong value, since the moment a party composes one is not reachable, and
it reaches every party at the rate the decision is taken, while the construct is one edit from correct and before
anything has cited it.

**The general shape is that duplication and delivery are orthogonal.** The count answered how many copies exist, and
the period answered what they are. Neither answers whether any of them arrives where the fact is used. **A set of
copies can be fully collapsed and still deliver nothing**, and a set that cannot be collapsed at all can be made
correct by adding one more. So the last question of the walk is which consumer each copy reaches, and a copy count
that has never been asked it is measuring the wrong axis confidently.
