# Governance tooling

The toolspace is the governance. A rule without a check is discipline, and discipline decays. These
rules govern how enforcement is built, never what it enforces.

## `gate_every_pattern` (LOCKED)

Every construct ships with the check that enforces it, in the same change. The check is the fix, and the
content edit is the cleanup.

Triggers, without exception:

| event                          | obligation                                 |
| ------------------------------ | ------------------------------------------ |
| a new construct or shape       | a new checked rule                         |
| a new surface or interface     | a new checked rule                         |
| a new structural addition      | a new checked rule                         |
| a bypass or a duplicate caught | the affected rule absorbs the anti-pattern |
| a better approach found        | a rule governing every similar construct   |

A construct that genuinely cannot be checked statically is surfaced, never used as license to skip the
check.

## `determinism_is_the_one_axis` (LOCKED)

**Determinism is not one property among several, because the other four are derived from it.** A
deterministic subject is **auto-healable**, because exactly one correct answer exists to apply. It is
**enforceable**, because a check can decide it. It is **predictable**, because the same input yields the same
verdict. And it is **scalable**, because none of the three degrades as the population or the party count grows.
Without determinism, all four go together.

### Why it is stated as one axis rather than four goals

**Each of the four reads as a separate thing to pursue, and pursuing them separately produces mechanisms that
have none of them.** A healer over a judgment call guesses. A check over a non-deterministic subject
saturates or flakes. A verdict that depends on who ran it cannot be quoted. A protocol resting on care
multiplies its cost by party count while its enforcement stays flat. **Every one of those is the same defect,
and naming determinism as the source makes the four testable with one question.**

**So the first question a mechanism answers is whether its subject is deterministic, not whether it can be
checked.** Where the answer is no, the mechanism says so and stops, rather than building something that
appears to check it.

### How to apply it

1. **Test the subject before designing the mechanism.** Is there exactly one correct answer, derivable from
   the artifact? If yes, the check and its healer both follow. If no, no amount of mechanism recovers them.
2. **A non-deterministic rule is stated as such and carries its evidence**, which is what the conduct roster
   is for. Its cell says whether a deterministic half exists, because a rule is often one of each.
3. **Where a subject can be made deterministic, that is the work.** The subject is changed and the check is
   never loosened: an act nothing records becomes an act a writer records, and the same rule becomes
   enforceable without a word of it changing.

### What it does not license

**It is not a reason to narrow a rule until it is checkable.** A rule bounded to what a scanner can see
governs the scanner rather than the concern. The order is to state the rule at its real scope, name which half
is deterministic, gate that half, and record the rest as what it is.

## `gate_constructs_not_literals` (LOCKED)

A rule matches a construct: a shape in a syntax tree, a token sequence, a structural relation. It never
matches a specific name, path, vendor, filename or threshold.

Instances live as data the rule cites. A rule's identity and its message read unchanged when the same
shape recurs elsewhere, so a rule naming an instance is a defect in the rule.

**A path literal is the instance form this package is most exposed to**, because the package does not know
where it sits. A root spelled in a constant is a claim about a host, and it resolves onto the host's own tree
or onto nothing. Every root resolves through the configuration, which computes the prefix from its own
location.

## `gate_that_saturates_is_not_built`

**A check every seat can satisfy for free, on a build that is red until they do, is not a check.** It is a
field that always says the same thing, and a field that always says the same thing cannot be told apart from
a field no party reads.

The failure is worse than a missing check, because **its own greenness becomes the evidence that the thing it
measures is working.** An inert mechanism is then installed inside a mechanism, and it is hardest to see where
it is most tempting: a self-reported marker every party marks, on a surface every party wants green.

**The discriminator is whether anything can disagree with the field.** A value carrying a reference an
auditor can resolve can be wrong, and a value whose only cost is typing it cannot. A self-reported
declaration is admissible only where it carries something a party other than its author can falsify, which
is why a row's owner is legitimate while a bare acknowledgment is not.

**Where the falsifiable half is unavailable, the check is held rather than shipped weaker**, and the property
given up is written down. Otherwise the design later reads as though it had that property, and a declined
mechanism becomes an assumed one.

**This is not the binary-verdict rule restated.** That rule refuses a middle verdict, and this one refuses a
check whose verdict is uniform by construction. A saturating check returns pass or fail correctly and
measures nothing.

### A harness that cannot fail is the same class

**A stub standing in for an absent foreign environment is legitimate and answers only that class.** A
permissive stub that also absorbs the subject's own missing symbols converts every genuine defect into a
silent success.

**Narrowness covers both which symbols the stub supplies and whether its return values move the way the real
ones do.** A stub returning a constant where the real collaborator returns a counter passes a defect that
depends on movement, so an invariant asserting _an unchanged world writes once_ proves nothing when the stub's
world cannot change. The invariant worth writing is the adversarial one: a collaborator that moves on every
call must not, alone, provoke a write.

**A deliberate failure that does not fire is evidence about the harness rather than about the subject**, which
is the mirror of a check that has only ever passed.

## `gate_fires_before_it_is_trusted` (LOCKED)

A new check is broken on purpose and watched to fire before it is believed. A check no party has seen fail
cannot be told apart from one that cannot fail.

**A guard that returns early makes every later check conditional on the earlier one passing**, and the
condition is invisible from the finding list, because a check that never ran and a check that passed produce
the same silence.

**A comparison guard is only as honest as the widest field it compares.** A write-only-when-changed guard
compares a serialization of state against the last one written, and it is correct exactly while every field
in that serialization is state. The moment one field is a measurement, such as a counter, a rolling average,
a timestamp or a peak, the comparison differs on every call. The guard then suppresses nothing, and the write
happens at full frequency forever while the code reads as carefully conditional. **The discriminator is
whether a field moves on its own:** state moves when something happens, and a measurement moves because time
passed. Non-determinism in the serializer counts as measurement, so an unordered collection is ordered before
it is compared. The failure is invisible from both directions, since the guard reads as a correct comparison
and the record reads as correct contents, and its only symptom is a cost no party attributes to it.

## `positive_control_precedes_trust`

A check ships once at least one member of its real population passes for the right reason. A check whose
every member fails has been shown to reject rather than to discriminate, and its first green cannot be told
apart from a scope that stopped reaching.

Where no member can yet pass because the correct shape does not exist in the tree, the population is built
before the check, rather than the check being trusted to describe it.

## `scoping_re_runs_the_motivating_case`

A rule is authored against a case and then narrowed for precision, and narrowing is where a correct rule
silently loses its subject. Every refinement is judged on the false positives it removes, and no party re-runs
the true positive, so a scope that excludes the motivating case reads exactly like a scope that merely got
tighter.

**So after scoping, the motivating case is run again.** It costs a sentence, and it is the only step that
distinguishes a rule that became precise from one that became blind.

**The tell is that the cheapest scoping is usually the harmful one**, because it keys on the property the
correct members share rather than on the property the defect has. Measured three times in one round, twice by
the party who proposed the refinement:

1. a gate proposed to catch a consumer reading a subset of a record, which a declared read-set would have
   matched exactly and passed.
2. a scope narrowing a rule to functions whose parameter type is the declared record, where every correct
   member takes it that way and the failing one resolves the record inside its own body.
3. a proposal endorsed into an outcome without being run against the defect that motivated it.

A party running the case caught each of them, and reading the scope caught none.

**It composes with the population count rather than replacing it.** A false-positive count answers whether
the rule discriminates, and re-running the motivating case answers whether it still reaches. A rule carrying
only the first can be precise about a subject it does not reach.

## `remediation_is_reachable` (LOCKED)

A finding whose only repair the **toolchain refuses to perform** is withdrawn, or exempted with that refusal
written down as the reason.

**A report no party can drain is worse than a gap.** A gap announces itself and stays countable, while a
permanent red trains every reader to discount the color, **and the cost lands on the findings beside it**
rather than on itself. The binary-verdict rule's own failure then arrives from outside: a verdict that is
technically fail and operationally ignorable is a warning tier no party declared.

**The shape, measured.** A check correctly identifies an undelivered duplicate of a rights notice and
requires its deletion. The rule authorizing that deletion is written and on disk. The edit is then refused
by an enforcement surface outside this package that matches the construct of a rights-holder line being
removed. That surface reads none of these rules and cannot be argued with.

**That surface is not wrong, and this is the half that matters.** It matches a construct rather than a
literal, which is what a good check does. **Routing around it lands the same bytes and inverts the bypass
rule**, whether the route is a rewrite through another tool, a whole-file write, or a deletion split small
enough to slip the matcher. It takes a bypass because one party disagrees with a check it does not own. The
refusal is evidence about reachability, never license.

**So the exemption is environmental rather than editorial.** It carries the refusal as its reason, is held as
data beside the rule, and is checkable by any party that tries the repair. It says nothing about whether the
finding was right.

**A refusal is per-seat before it is per-tool, and that order decides whether an exemption is even
available.** Measured on one removal operation: two seats were refused by their own write-path enforcer and a
third was permitted, with the same tool, the same operands and the same tree. **So a refusal carries only the
boundary of the party that hit it**, and a conclusion about the tool drawn from one environment is the
scope-of-a-negative class, where a refused seat and a broken mechanism produce the same sentence.

**The consequence is routing rather than exemption.** A refused repair is re-addressed to the other seats as
a directed item carrying the operation's operands and the refusal, and the first permitted seat discharges
it. **An exemption is available only once the repair is refused outright rather than refused for one seat**,
which means one permitted instance withdraws it and no number of refusals establishes it.

**It also names a third party the model did not have.** A check reads an artifact, a seat executes a delivery
of it, **and a write-path enforcer decides what either may commit.** Every gap named until then sits between
an artifact and its consumer, and this one sits between a rule and the write itself.

## `no_warning_tier` (LOCKED)

Every check returns pass or fail, zero or one. There is no warning tier, no info tier and no advisory level.
A check that would warn is promoted or deleted, because a warn tier is a deferral queue in disguise.

Severity survives as **repair ordering** among failures, never as a softer verdict. A middle tier lets a run
terminate as successful while a failure is still open, which is the outcome the binary verdict exists to
prevent.

## `no_regex`

Regular expressions are refused in authored tooling. Matching is done by:

- syntax-tree traversal over parsed input
- token matching over a scanner's output
- exact string and character comparison

A hand-written scanner is the expected mechanism. A pattern language hides the grammar it implements, fails
silently on the edge cases that matter, and cannot express a structural relation.

A scanner inspecting source for a banned construct distinguishes **use from mention**. A token inside a
string literal or a comment is data, and a detector matching its own detection strings reports itself.
Quote-state and comment-state tracking is part of the mechanism rather than a refinement of it.

**The detector tests the call form, never a list of names.** A literal reaching any member that accepts one
is the construct, and the members that accept one are instances. **A name list violates the
construct-not-literal rule inside the check enforcing it.** It passes over every form no party thought to
enumerate, and it reopens the moment the language, a library or a rewrite supplies one more name.

**A name list also cannot be shown to have a hole.** A call-form test is falsifiable: it is broken on a form
outside the listed set and watched to fire. A name list only ever proves the names it already holds, which is
the shape a check no party has seen fail always takes.

## `derived_not_heuristic`

Mechanisms are derived rather than guessed. Heuristics, approximation, probabilistic matching and
good-enough detection are refused in favor of exact structural reasoning, because a check that is usually
right is wrong.

### A check reads its subject through the resolved value, never through text that looks like it

**A check recovering a binding by matching a quoted argument at a call site sees only the sites where the
value is spelled out.** The moment those values move into a table and the call passes an expression, which is
derivation obeyed, the scanner recovers nothing and reports clean. **It is strongest against the code that
needs it least and blind to the code that has been improved**, which makes it a heuristic whatever its
accuracy on the cases it can see. Resolving an alias first does not save it, because the defect is not the
alias: the argument is an expression the scanner cannot evaluate.

**The same failure reaches a check over what a member does.** Written against source text by reflex (find
the field, read the lines after it, match what they call), it works only while every member is an inline
literal. The moment one is assigned from a name defined elsewhere, which is a shape any tidy-up produces, the
text scan finds a bare identifier, matches nothing, and reports clean on exactly the files that have been
tidied.

**The subject is a loaded value, so the check asks the value.** A runtime that already resolved which
function a field holds can be asked for its defining source and line span, whatever name it was assigned
from. That is derivation rather than inference, and it cannot disagree with the program the way a parse of
the same file can. One level of local resolution is enough for the real cases, and **the depth is stated
rather than implied**, which is what separates a bounded mechanism from one that appears exhaustive.

**The measurement that justifies it:** a hand enumeration over one class of construct finds four instances
where the derived check finds seven, and the three missed sit behind well-named members, found by a party
looking specifically for that class.

**Where a pairing keeps drifting, the repair is structural rather than a stronger scanner.** One side takes
ownership of both halves, so the second half has no call site to miss. An invariant held by construction
needs no check, and that is the only case where declining to add one is not debt.

## `auto_fix_on_by_default` (LOCKED)

A violation whose remediation is **deterministically derivable heals on capture**, in the same run that
caught it, without being asked. Healing is the default state and the flag disables it. Detection without
remediation is the exception that needs justification.

A fix is applied, re-validated, and converges, and a fix that does not survive its own check is not a fix.

**Deterministic means exactly one correct answer exists.** A missing type the grammar computes, a form the
registry records and a name whose only legal spelling is derivable all heal. Anything requiring judgment,
such as which concern a file is or whether two roles split, does not heal, and carries its remediation as
data for a reasoning agent instead.

## `findings_are_machine_actionable` (LOCKED)

Every finding is machine-readable and dynamically valued, never static prose and never a sentence a reader
must parse back into intent.

| field           | content                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| the rule id     | which check fired                                                           |
| the path        | the file                                                                    |
| the locus       | the member, node, segment or slot the violation sits in                     |
| the stack       | the resolution trail: which checks ran, what each resolved, where it failed |
| the actual      | the observed value, computed                                                |
| the expected    | the derived correct value, computed, or absent where judgment is required   |
| the remediation | a typed action with real operands, never a description                      |
| the healed flag | whether the fix applied                                                     |

A remediation names an action and its operands, with every value resolved from the actual state. A sentence
describing a rename is a defect, and the action with its two operands is the contract.

**The reason is agent remediation.** A reasoning agent consumes the finding, so the finding is structurally
sufficient to act on without re-deriving the analysis. Where healing is impossible or ambiguous, the
remediation still carries the handle that makes the next step decidable.

## `type_assignment_is_spine`

Everything governed carries an assigned type, and the type selects the schema, the applicable rules, the
legal placement and the legal structure.

**For files, the concern taxonomy is that type system.** A file's concern is its assigned type, and its legal
placement derives from it. Untyped content is ungovernable, so assigning the type is the first operation, and
resolving to no type is itself a failure.

## `self_registration_over_wiring` (LOCKED)

A capability becomes active by declaring a contract a registry discovers at run time. If any core file must
learn its name, the design is wrong.

## `core_never_edited_for_features` (LOCKED)

The core is authored once and never edited to add a check. Adding governance is a single-file drop-in: the
file is authored and it is active.

Every check exports a declaration the registry discovers: its id, its stage, the types it applies to, whether
it heals, and the check itself. The core reads declarations and never imports one by name.

Adding, removing or reordering governance touches **no core file**, and a check requiring a core edit is
defective. Duplication is the primary defect class, so two implementations of one mechanism are a failure
regardless of size.

## `one_entry_point_staged_pipeline` (LOCKED)

Governance runs through a single entry point. The whole pipeline is the default, and arguments narrow it and
never widen it.

| argument        | effect                                 |
| --------------- | -------------------------------------- |
| none            | every registered stage, whole scope    |
| a rule id       | only that check                        |
| a stage id      | only that stage                        |
| a scope path    | restrict to a file or a subtree        |
| a bypass id     | skip a stage, for local iteration only |
| the no-fix flag | disable healing, which is otherwise on |

A bypassed run never satisfies a completion claim, and verified requires one unbypassed whole-scope run.

**The pipeline checks everything that governs**, which is what makes it a pipeline rather than one checker
among several. A formatter, a type checker or an analyzer reachable only by its own command is
convention-only enforcement whatever its quality, because the run that decides green never invokes it. A
second entry point is legitimate only as a narrowing of what the pipeline already runs.

## `governance_governs_itself` (LOCKED)

The registration contract is itself checked. A rule failing the declaration schema, or emitting findings that
do not carry the required shape, is a finding the pipeline raises against itself.

The loop closes there: the mechanism enforcing every other rule is the one most able to decay silently,
because nothing else watches it. An unchecked check is discipline dressed as a check.

## `report_contract` (LOCKED)

Report emission is part of the registration contract rather than a step the pipeline performs on a check's
behalf. Every registered check writes its own report under the package's generated directory, and the
pipeline writes an aggregate across all of them.

A report carries the derivations, the evidence and the graph that produced the verdict, and not only the
verdict. Being unable to see why is itself a defect, and a derivation naming what the check actually reached
is what makes a green readable as coverage rather than as silence.

A check emitting no report is not registered, because its findings would exist only in the moment of the
run, which makes them unactionable the instant the process exits.

## `report_has_an_emitter` (LOCKED)

The contract runs both ways. A registered check owes a report, and **a report on disk owes an emitter** that
still exists and still writes it.

A withdrawn check whose report stays behind is worse than a missing one. The aggregate keeps reading it, so a
verdict frozen at withdrawal fails the build forever and no re-run can clear it, because nothing produces it.
The failure has no owner, no repair and no expiry.

The claim is derived rather than listed. An id is claimed when a declaration declares it or an emission names
it, read from the emitting sources themselves. A report declaring a check nothing claims is orphaned and is
deleted on capture, because the repair has exactly one correct answer.

**A claim set that can silently resolve to empty makes a healing check delete every report it should have
kept**, and subtraction is the sharpest form of the mechanism-with-no-effect class. Matching is on shape
rather than on a roster of known ids, so a report carrying its own tool identity is never touched, and adding
a tool needs no edit here.

## `a_run_that_cannot_replace_the_aggregate_streams` (LOCKED)

**There is exactly one aggregate, and it is overwritten so it is always the truth after a run. A run that
cannot honestly replace it streams its verdict instead of writing anywhere**, neither over the aggregate nor
beside it.

**A label describes a document and does not preserve the one it replaced.** Marking a narrowed aggregate as
non-authoritative is honest and insufficient, because after it lands there is nothing left to read. The
report-is-the-state guarantee is then not weakened but unavailable, and the only recovery is the full re-run
that rule exists to make unnecessary, which is why a narrowed run may not overwrite it.

**The line is the report's subject rather than its accuracy.** A per-check report is about that check whatever
the scope, so it is legitimately overwritten. An aggregate's subject is the whole scope, so a narrowed one is a
document about a different subject under the same name.

**A second document under a name derived from how the run was invoked is accumulation, which is the half a
write-beside-it rule licenses while appearing to protect something.** A keyed filename per scope, per caller
or per invocation produces a generated directory no party prunes. It holds verdicts about subjects no reader
can reconstruct, each one true of a moment and none of them the state. **Streaming costs the caller nothing it
does not already have**, since the verdict is in front of the party that asked for it, and it leaves the one
aggregate meaning exactly what its name says.

**One statement covers three cases where the write-beside form covered one.** A narrowed run streams. A
whole-scope run superseded by a later one streams rather than landing under a derived name. A run keyed to a
caller streams. The write-beside form answers only the first and licenses the third, which is the
accumulation the owner's directive removes.

**The destruction the first half prevents is done by the cheapest, most correct-feeling action available.**
Running one check after one edit is the right instinct and is what the narrowing arguments exist for, which
makes the heaviest offender whichever party iterates most carefully, and makes this a mechanism gap rather
than a discipline one.

## `report_is_the_state` (LOCKED)

The report is the re-readable state of a run. Outstanding work is answered by reading it from disk, never by
re-running a check to find out what is still open. Re-probing a verification already performed is waste, and
on a large scope it is the dominant cost.

The report is a **drainable worklist**: a resolved violation is removed from it, and the check re-runs once
the file is empty, which confirms the clearance rather than rediscovering it.

**Re-running a tool to filter its output differently is the common form, and it does not look like
re-verification.** Running a tool, finding the filter too broad, and running the whole tool again with a
narrower one repeats the entire verification to change a display decision, and each repetition reads as
progress because the question got sharper.

**The output of a run is a rendering, and the report is the state.** A rendering is filtered by re-running,
and a state is queried by reading. So the second look at any result goes to the report file, and a tool that
must be re-run to answer a follow-up is one whose report is incomplete, which is a defect in the emitter
rather than a reason to run it again.

**A run is warranted when the tree has changed**, which is the one case a re-read cannot cover. The report
describes the tree as it was, so after an edit the report is history and the run is the measurement. The tell
of the misuse is a second invocation whose only difference is the filter.

### A verdict carries a standing beside its value

**A run whose read set moved beneath it reports an interleaving rather than a state**, and the verdict alone
cannot tell the two apart. Every surface a run reads is stamped when read and re-stamped at the end, and a run
naming a non-empty moved set is **not authoritative**.

**What is withdrawn is the standing to be quoted, never the verdict.** A pass stays a pass, because declaring
it a failure would assert a defect nothing observed. So the mechanism withdraws exactly the property the
concurrency actually damaged, which is the report's claim to describe one moment. **A pass whose moved set is
non-empty is not a clearance.**

**The write barrier is the wrong repair, and declining it carries the design.** A barrier exists for exclusive
writes. Taking it across a read serializes every verification against every write, makes verification a
contention point, and blocks live peers to settle a question about the past. **The repair reuses a
distinction the report already carries** rather than adding a lock, which is the same move as replaying a
commuting write instead of queueing every one of them.

**The mechanism does not replace the discipline beside it.** A verdict is read from the report and quoted
afterwards, never authored in the same breath as the command producing it. **The mechanism makes the
unreliable case observable, and only the discipline stops a claim being written before its evidence exists.**
The measured shape is a report composed and its verification run in one invocation, where the run disagreed.

**The emission half is checked and the reading half is conduct**, which is stated rather than assumed. A
check emitting no report is an artifact question, while whether a reader re-ran a tool instead of opening its
report is a tool-call sequence no file records.

## `schema_declared_structure`

Governed structures are declared as schemas expressing variant and invariant shape, so structure is
predictable, validatable and machine-checkable rather than conventional.

## `a_destructive_tool_carries_every_standing_precondition` (LOCKED)

**A tool that performs an irreversible operation performs it without any standing precondition its code does
not implement, and it reports success.** So before one is invoked, the standing instructions bearing on that
operation are checked against what the tool does. Where the tool lacks a step an instruction requires, the
step is taken by hand first, or the tool is not invoked.

### Why it exists

**This is the mandate-with-no-tool inverted, and the inverted form is the destructive one.** Where a mechanism
mandates a write no tool performs, the cost is a hand write with no protections. **Where a tool performs a
deletion and a standing instruction requires a step before it, the cost is the step never happening**, and
nothing observes the omission, because the tool's report describes what it did rather than what was required.

**The measured shape:** a standing instruction requires a converged discussion to be moved to an archive
before it is removed, so a later reader can reference the argument. The convergence tool checks four
orderings, verifies that the durable half resolves, and then deletes the file. It has no archive step and
never claimed one. The first venue was archived by hand and the second was destroyed, not by disagreement but
because the instruction lived in a memory of a conversation while the tool lived on disk. **The tool was
correct and the instruction was correct, and nothing joined them.**

**The asymmetry that makes it dangerous is the same one everywhere else here.** A tool that omits a
non-destructive step leaves a gap a party can close later, while a tool that omits a step before a deletion
closes nothing later, because the operand is gone.

### How to apply it

1. **Before a destructive invocation, enumerate the standing preconditions and read the tool for each.** The
   read covers the tool's code rather than its documentation, because a precondition it does not implement is
   one its help has no reason to mention.
2. **Take the missing step by hand first, and declare it.** The hand step is a declared bypass under
   `a_mandated_surface_is_tool_writable_first`, which is a cost, while performing the deletion without it is a
   loss.
3. **Then encode the step in the tool**, so the next invocation does not depend on a party remembering. A
   precondition held by memory is discipline, and this rule exists because discipline lost an argument to a
   `rmSync`.

### What it does not license

**It is not a reason to avoid the tool.** The four orderings the convergence walk checks are exactly the
protections a hand deletion lacks. The answer is a tool that checks five things, never a hand deletion that
checks none.

## `a_mandated_surface_is_tool_writable_first` (LOCKED)

**A mechanism that requires a write to a surface makes that surface tool-writable before it requires it.**
Otherwise the requirement is discharged by hand, and a hand write has no fence, no allocated id, no
compare-and-swap, no reader set and no gate, so the protocol's own mandate forces the bypass it elsewhere
forbids.

### Why it exists

**The mandate and the write path are added by different changes, and only the mandate feels like the work.** A
mechanism is built, it needs an operand, the operand lives in a file, and the file is already there, so
nothing in building the mechanism raises the question of how that file gets written. The requirement lands
complete and correct, and the write it depends on is left to whichever party hits it.

**Measured on three surfaces, each found by a party attempting the operation rather than by a party reading
the tool:**

1. a history accumulator that a drain refuses to run without, with no tool path.
2. an identity index that letter allocation requires a row in, with no tool path.
3. a sign-off block that a convergence edge cannot be satisfied without, with no tool path.

Three mandates produced three hand writes, and none of them is visible from the mechanism that mandates them.

**The severity runs opposite to the protection.** The surfaces with tool paths are the ones something removes
from, a current-truth board and an accumulating venue, because a removal needed an addressable span. The
surfaces with none are the ones nothing removes from, which is exactly the set whose writes are permanent.
**So the machinery went where deletion was, and the irreversible writes got none of it.**

### How to apply it

1. **When a mechanism names a surface as its operand, ask what writes it.** If the answer is a party writing by
   hand, the mechanism is not finished.
2. **The write path takes the same protections as every other:** the calling party's own span, an allocated
   id, a compare-and-swap against a concurrent write, and a refusal that carries the diff.
3. **Where the path does not exist yet, the hand write is declared a bypass** rather than performed as an
   ordinary write, so the party taking it knows what it is taking, and the gap stays countable.

### The population is shared surfaces, and that is stated rather than assumed

**Every protection a tool write path buys is a protection against a concurrent writer.** The fence gives a
neighbor a span to edit against, the allocated id makes a span addressable, the compare-and-swap refuses a
write against content that moved, and the reader set decides which party may close an item. On a surface with
exactly one writer by construction, all four defend against a party that cannot exist.

**So a mandated single-writer surface needs no tool path, and a mandated shared one does.** A document
describing one party, written only by that party, and addressed and closed by no other party, is satisfiable
by hand with no protection gap at all. The measured instances that hurt were all shared: a history
accumulator four parties append to, a sign-off block every party writes a row in, an identity index every
party adds to, and a planning surface every party adds and deletes rows on.

**The discriminator is decidable, and it is the surface's writer count rather than its content.** The writer
count is data a check reads rather than a judgment, and stating it here stops the rule reading as _every mandate
owes a tool_, which would make hand-authoring a single-writer document into debt it is not.

**The third axis is writability, which a shared-versus-single-writer split misses entirely.** A surface can be
shared and immutable, such as a closed record, an archived discussion, or a terminal state nothing will write
again, and there a mandated write with no path is the correct end state rather than a defect. So the
population is neither every mandated surface nor only the shared ones: **it is the surfaces that are shared
and still writable.** Measured on an archived discussion whose sign-off field was reported as owing a path it
will never need, where another walk had already derived the resolving exclusion from the same declared root.

**So the exclusion is derived from the declared immutable root rather than restated per walk.** Two walks
each carrying their own copy of one exclusion go out of step at the first change to either, and the copy no
party re-reads is the one a reader takes, so the root is read and the exclusion follows from it.

**This narrows what the rule claims and never what a check reports.** A check's population is changed by
the party that owns the check, deliberately and never as a side effect of a rule getting clearer. A finding on
a single-writer surface stays a finding until its owner decides otherwise, and this clause is the argument to
bring them rather than a license to exclude.

### What it does not license

**It is not an argument for fewer mandates.** The requirement is usually right, and what is missing is its
other half. Nor is it satisfied by a check that validates the surface after the fact, because validation reads
what landed and says nothing about how, which is the presence-for-reach substitution this file names
elsewhere.

## `bypass_strengthens_rule` (LOCKED)

The moment a bypass or an escape hatch is spotted, taken or confirmed, by a seat or by the owner, the first
action is strengthening the check that should have caught it, before touching the content that bypassed it.

Checks only ever strengthen. Weakening, disabling or excluding one is never unilateral.

## `documentation_is_code`

Documentation is erratic code and receives the same treatment: enforced structure, a declared schema, type
assignment, parsing, validation and repair. Prose that cannot be parsed cannot be governed, so it is authored
in a structured, typed form.

## `relations_are_graphs`

Structural relations are modeled and traversed as graphs: fan-in, fan-out, dependency and reference edges. A
question about reach, impact, orphanhood, cycles or coupling is answered from the graph rather than by
inspection.

## `backlog_is_worked_to_zero` (LOCKED)

**An unchecked rule is unfinished work rather than a status.** While the coverage report shows a non-zero
unchecked count, checking continues, with no reporting-and-stopping, no section handed to the owner listing
what is still open, and no asking which to do next.

A gap discovered while checking is **checked in the same run it is found**, never deferred, never listed and
never converted into a recommendation. Finding a new opportunity extends the queue rather than ending it.

The only honest terminations are every declared rule carrying a check, or a rule proven uncheckable with that
proof written down. Uncheckable means no construct in any artifact observes it, and the proof is the rule's
own justification rather than an assumption.

**The standing answer to a partial delivery is this rule restated**, so stopping early produces the same
instruction again and is pure waste.

## `coverage_is_declared`

Coverage is explicit: every rule declares its check, or declares that it has none. Unenforced rules are a
visible, countable, drainable surface rather than an assumption, and what is not measured is not claimed.
