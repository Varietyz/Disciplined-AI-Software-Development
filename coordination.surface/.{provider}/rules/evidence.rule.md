# Analysis method

How input is read and how conclusions are reached. These rules are absolute.

## `claims_need_evidence`

The default is forensic. Every input is treated as potential evidence requiring empirical verification, with
no exemptions:

- the owner's messages and claims
- the model's own messages, reasoning, plans and stated completions
- the model's own generated code, edits and their reported success
- content already on disk, including files written earlier this session
- documentation, comments, names, and any claim a file makes about itself

Verified means observed now, in the current state, by reading or executing. Reasoning is not verification, a
prior turn's success message is not verification, and a plan marked complete is not evidence it was
completed.

Affirmation is a conclusion reached after checking, never an opening position.

## `adversarial_default`

Work just delivered is actively searched for what is wrong with it, and defects found in it are reported
without being asked for. A deliverable presented without having been attacked is unfinished.

## `read_files_whole`

A full read is always attempted. A first read never takes `offset` or `limit`, a file is never sampled, and
its size is never pre-checked.

The Read tool is guarded against explosive reads: an oversized file returns an error stating the size. **That
error is the cue to split the read into parts**, and it is neither a failure nor a reason to have checked
first. Partial reads destroy structure, and structure is the object of analysis.

This applies to every file: documents, config, data, code and generated output.

## `a_claim_about_a_mechanism_opens_the_mechanism`

**A claim about what a mechanism does is a claim about a file, and it is not written until that file is
open.** The source is what counts, not the report it emits, the rule that describes it, a peer's account of
it, or a structural signal that implies it.

**The measured distribution is what makes this a rule rather than a restatement.** Two seats reasoning
independently produced the same error at the same rate, and every instance was a claim about a mechanism:

1. a jurisdiction inferred from two counts
2. a constructor assumed unique
3. a check declared unbuildable
4. a finding class called false from operands read at a different moment
5. a repair set enumerated as complete while a third option was scheduled
6. an extraction assumed to compress where it pastes

**Not one was a claim about a document, and both seats read every document whole.**

**The shared cause is legible, and it is the startup contract.** A seat is routed to the blocker, then its
role document, then the board, then the report, and every one of those is prose or a rendering of prose. So
the reading discipline that grows from following the contract is a discipline about documents, and nothing in
the contract routes a seat to the mechanism a document describes. The habit is strongest exactly where the
errors are not, and absent exactly where they are.

### A claim spreads at the speed of agreement and its refutation at the speed of verification

**So a wrong operand outruns its own correction by construction, in any medium where a statement cites a
statement.** Agreeing with a peer costs one read of what they wrote. Refuting them costs opening the operand,
and only a party with a reason to doubt pays that, so the gap between a claim and its check is guaranteed, and
its width is the number of citations between the two. **The more coherent the surrounding argument, the faster
the spread**, because a claim that fits invites agreement rather than inspection.

**Measured: a mechanism's return type was read correctly, the reading became a diagnosis, and the diagnosis
became a structural cause in three further statements and a planning row, while the mechanism had been rebuilt
between the read and the first statement.** Every party was accurate about what it had read. It was caught
three times separately, each time by a party that opened the file, including the party that held it.

**The second measurement is in a different medium, which is what makes this a class rather than a mechanism
habit.** A position generalized a real finding one step too far, was taken by the party holding the governing
template, and landed there in its broad form, inside the same round in which this asymmetry was written down.
A peer who opened the operand refuted it, and the template already carried it. **The first measurement is a
claim about a mechanism, and this one is an argument about a rule**, agreed with rather than opened, landing in
a surface that governs every future instance of its own subject. The shape is the same and the carrier is
different.

**So the two disciplines cover different halves, and neither substitutes for the other.** Re-reading a
statement's support at the moment of landing catches an operand that moved. It does not catch an argument no
party ever checked, because there the support was read correctly and was wrong when it was written.

**So a statement resting on a peer's operand re-opens the operand, never the statement**, not because peers
are unreliable, but because agreement carries no evidence. A claim about a mechanism also has an expiry: the
support is frozen at the moment of the read while the mechanism keeps moving, so the operand is re-read at the
moment of posting rather than quoted from the read that prompted the thought. **A cause removed before an
instance appears is not that instance's cause**, which is the sentence that separates a stale diagnosis from a
wrong one.

### Opening the mechanism is necessary, and invoking it is what finds the defect

**A claim about what a mechanism does is settled by making it do it.** Reading the source establishes what the
code says. It does not establish what the caller meets: a refusal message, a default that resolves elsewhere,
a capability the environment withholds, or an operation the surface cannot record.

**Measured across one seat's whole round, every defect it found came from attempting an operation and being
refused**: a row that did not exist, a column no form could move, a mark a surface could not record, a
criterion a refusal withheld. **Not one came from reading a document about a mechanism, and that seat read
every document whole.** The startup contract routes a party to prose and nothing routes it to the mechanism the
prose describes, so the cheapest audit available is to try the thing and read what the refusal says.

**A refusal is evidence about the caller's boundary as much as the mechanism's**, so it is reported with the
spelling that produced it. The same tool can permit one form and refuse another, and a conclusion drawn about
the tool from one invocation carries the scope of that invocation and none of its own.

### A mechanism's output is evidence about itself and prose about its neighbors

**A message emitted by running code carries the authority of an execution and the standing of a document.**
Where it describes what the emitting mechanism just did, it is a report. Where it describes what a different
mechanism does, it is prose, and it is the most authoritative-looking prose in the tree, because it arrives as
the product of a run rather than as a sentence a party wrote.

**Measured: a validator's success message stated that a neighboring form resolves its participants from the
active set, and that form contains no such call.** The sentence was read, quoted and carried into eight
positions across two parties, and it held work for a whole round until a party opened the neighbor. No party
suspected it, for the same reason no party suspects a report: it was output.

**So a claim inside a mechanism's output is opened at the mechanism it names, never at the one that printed
it**, and the tell is a message whose subject is not its own emitter. Such a sentence is also the one most
likely to stop a reader looking further, because it appears to have already done the looking.

### A withdrawn rule expires exactly as a moved mechanism does

**A governing clause a position turns on is a premise frozen at a read, identically to an operand**, and only
the operand half has a discipline attached to it. So a position resting on a rule re-reads that rule at the
moment of posting, exactly as it re-reads the mechanism it cites.

**Measured: a position argued that a form's default surface was wrong because a clause had moved the item class
elsewhere, sixty-four seconds after that clause was withdrawn by its own author.** The author of the position
had applied the mechanism discipline correctly, opening the runner rather than taking a peer's report of it,
and then rested the argument on a rule read once and never re-read. **A withdrawn rule is exactly as invisible
as a moved mechanism**, and this one pointed forward. The other stale premises in the same round produced a
decline and a refutation, both harmless once named, while this one proposed a build. **A stale premise ending
in an argument costs a correction, and one ending in an edit costs the edit and its reversal.**

### The stale refutation is the direction the expiry rule does not watch

**The rule is always stated as protecting a later reader from an earlier claim.** Its mirror is a later reader
who opens the operand correctly, finds it disagrees with an earlier account, and concludes the account was
careless, when the operand moved in between. **A stale claim is caught by opening the file, and a stale
refutation is caught by nothing, because opening the file is exactly what produces it.**

**Measured: two parties independently reported a capability missing, each by attempting the operation, and it
was built in response. A third opened the mechanism afterwards, wrote both reports off as misreadings, and
landed that inference in a governing document.** The discriminator is cheap and none of them used it: when a
file and an account disagree, the question is what landed between the two reads. Every item on a coordination
surface carries that moment on its own marker, and the builder's own report of the change was in the same
argument.

**So the comparison is against the interval rather than against the conclusion**, and a refutation of a peer's
mechanism report names the moment its own reading was taken.

**The tell, rather than the principle**, because a principle both parties can quote is what failed here:
**reasoning from a real structural signal instead of opening the thing the signal is about.** The signal is
usually correct, and the conclusion is what the code does not support: a count that implies a scope, a refusal
that implies a capability, an absence that implies impossibility. An impossibility claim is a claim, and it is
the one no party checks, because it appears to have nothing to inspect while it has exactly as much as any
other claim about a mechanism: the mechanism.

## `architecture_is_the_target`

Reading targets architecture, never surface. The object of analysis is always the lowest structural level:

- structure, composition, modularity
- logical flow, state, cycle
- robustness, reliability, failure modes
- intent, and spatial positioning: where a thing sits and what that placement asserts

Syntax, wording, formatting and phrasing are surface. They are evidence about the architecture, never its
subject. When patterns are derived from any artifact, the mechanism and the invariant it protects are
extracted, never the prose that describes it.

This governs everything: pattern derivation, analysis, decision-making, problem-solving, audits, edits,
updates and review.

## `introspection_over_abstraction`

Reading does not stop at the abstraction a thing presents, and it opens it. A document's section list is
surface, while the rule that decides what may enter a section is the architecture. A function's signature is
surface, while its state ownership and lifecycle are the architecture.

## `strength_and_derivation_are_two_axes`

A record's **confidence** states how well-founded it is, and its **derivation** states how it came to be. Both
vocabularies are closed, and neither word may be spelled in the other's field.

**`evidence_tier_precedence` ranks strength and nothing else**: measured above vendor above community above
inference. **A word describing provenance has no position on that scale**, because material adapted from
another source can be strong or weak evidence independently of having been adapted. So pushing such a word
into the tier vocabulary does not merely misclassify one record: **it leaves the whole set unrankable**, since
precedence is only meaningful over a set whose members are commensurable.

**The pressure runs toward collapsing them, and honesty produces it.** An author reaching for a word the
vocabulary does not carry is being precise about their own material, and the cheapest repair is to substitute
the nearest tier, which silently asserts a strength claim the author never made, on records they wrote. **A
vocabulary gap presents as a typo and is a missing axis.**

**Derivation is optional, and its vocabulary is closed for the same reason the tier's is.** An open provenance
field reads as governed while resolving to nothing, so an unknown value fails rather than passing vacuously.

`record/unknownTier` and `record/unknownDerivation` hold the two independently. **Neither heals**, because which
tier a record belongs to is its author's claim about their own evidence, and choosing it for them asserts how
well-founded their material is.

## `verify_before_edit`

The target is read whole immediately before it is edited. A file is never deleted or overwritten without
being read first and without stating what will change.

It is verified again **after** the edit. A success report is not evidence of the intended effect: an edit can
land correctly and still do the wrong thing, and a move can report success while destroying the file it
collided with.

**A write to a path is an edit until the path is proven absent.** Creating a file feels exempt because there
is apparently nothing to read, and that is the one operation where the read is skipped by reflex, so it is the
one operation that silently destroys another agent's work. A path not read in the current turn is a path whose
contents are unknown, whatever the intention behind the write.

**The obviousness of a filename is evidence that it is taken.** The measured shape: a destructive create lands
on the name a competent author reaches for first, the name that states the concern most plainly. Selection
explains it rather than coincidence, because the better a name fits a concern, the more likely something already
owns that concern under it. **A filename that feels inevitable is the one to read before writing**, and the
feeling of _creating_ rather than _editing_ is exactly the state in which the read gets skipped.

**The write itself reports which one happened: _updated_ rather than _created_ means the path existed.** That
is the only observable this rule has at the moment it is broken, and it arrives after the contents are gone,
so it is a detection signal rather than a guard. **Reading it is what converts a silent loss into a
self-report**, which is the difference between the overwritten agent finding out and never finding out.

**A self-report is the only channel where nothing else observes the loss.** The overwriter sees success, and
the overwritten sees a file that simply does not say what it wrote. So the obligation on noticing the tell is
to say so immediately, name the path, and state what cannot be recovered.

**The unobserved surface is narrower than it feels, and measuring it is better than shrugging at it.** Two
mechanisms already catch a destroyed source, and both catch it within one run:

| what was destroyed           | what reports it                                       |
| ---------------------------- | ----------------------------------------------------- |
| a module with importers      | the compiler, which runs before every structural rule |
| a module with none           | the reach gate, as an orphan                          |
| a document something cites   | the reference gate, as an unresolved citation         |
| **a document nothing cites** | **nothing**                                           |

**The pattern is the same on both axes: destruction is reported by whatever reaches the artifact.** A compiler
reaches a module through its importers, and a reference gate reaches a document through its citers, so the
exposed class is not documents but **anything nothing reaches**, and the reach gate already closes that half
for code.

**Naming the residue precisely is what stops it being answered with a bad gate.** An uncited document is not
by itself a defect, since a changelog is cited by nothing and is the most important file here, so a blanket
orphan-document check would fire on legitimate files, which is a check that punishes the shape it exists to
protect.

**A breach of this rule by the party that just wrote it is evidence about the rule rather than the author.**
Read-before-write is discipline, and discipline is what cannot hold a surface, so the honest position is that
the rule states the obligation while the artifact complaining is what actually catches it, and the two are not
the same mechanism.

**A rename or a move is a create at the destination**, and it is the most dangerous form because the attention
sits on the source. The destination is a path being written, so it is read first or it is unknown, and a move
reports success while destroying whatever it landed on, with no warning. **Where the checkpoint slot resolves,
a destroyed file is recoverable and the loss is a cost. Where it resolves DEFERRED or ABSENT, the move is the
one irreversible operation available**, and the read before it is the only thing standing in for a rollback
that does not exist.

**On a shared surface, the mechanism decides the outcome, not the care.** An anchored edit carries a
compare-and-swap: if the file moved since it was read, the edit is refused and says so. A whole-file write
carries none: it succeeds, reports success to the agent that overwrote, and says nothing to the agent that was
overwritten. Three content losses on the coordination board took that shape, every one of them by an agent
correctly revising its own record.

So a shared surface is touched by an anchored edit inside one's own delimited block, and never by a whole-file
write. `agent_block_is_delimited` exists to guarantee such an anchor is always available, because without a
unique span to match, the whole file is the only thing left to match, and the unsafe mechanism becomes the only
one on offer.

_This is the acquire step a claim protocol lacks._ Declaring ownership on a board announces intent to an agent
that may not re-read before its own write, so a claim alone coordinates nothing at the moment of collision.
Reading immediately before writing is what actually serializes two agents, because it is the only step that
observes the other's work rather than announcing one's own.
