# Documentation style

These rules are absolute. They override any habit, template or convention that conflicts.

## `present_tense_only`

Every document, comment, record, config note and data file describes **what is true right now**, and
nothing else, with no exceptions.

Before any file is saved, it is scanned for the construct: a referent in this tree followed by a past-form
verb, a superseded-state marker on one of our own records, and any date attached to one of our own actions.
Each hit is a violation unless it describes third-party platform state per `platform_state_is_not_history`.

**The marker set is data the check cites, never a list this digest spells.** A rule that enumerates its
instances must be edited every time the language supplies one more. Measured on this very file, a prohibition
list written as literal tokens is matched by the detector for those tokens, so the digest that bans the
construct becomes the tree's largest reporter of it. The check holds the tokens, and the rule states the
shape.

## `history_has_two_homes`

None of the following constructs is ever written into a document, a comment, a configuration or a data file.
Each is named as a shape, because the token that realizes it is data the check carries:

- a past-form statement about this tree or its contents
- a change note, a migration note, an upgrade note, or a what-changed section
- a prior-name or prior-location clause attached to a current thing
- a lifecycle date tied to one of our own actions: created, added, copied or deleted
- a superseded-state marker on one of our own records
- an elapsed-time or reversal clause: a thing stated as having stopped, or as once having been otherwise
- an explanation of a current state expressed in terms of a former one
- diff-style or before-and-after commentary
- provenance describing where a thing came from and what we then did to it

A thing that does not exist is not mentioned at all.

There are exactly two destinations for anything historical or change-related:

1. The history accumulator the configuration resolves, which is the host's own history file where it declares one and the package's otherwise. It is the only file permitted to contain project history, and naming it by literal here would be a resolution asserted in a document rather than read from a binding.
2. A message directly to the owner in conversation.

Nowhere else: not in the behavior document, a digest, a record, an upstream tree, a comment, or a
commit-style note inside a file.

## `platform_state_is_not_history`

The tense rules cover **this project and its codebase**: our files, our folders, our records, our config and
our resources.

They do not cover facts about third-party software that happen to reference versions, such as a setting
absent from one build of a runtime, a defect repaired in a vendor release, or an interface whose behavior
differs between versions. Those describe the current state of the environment we run in and are operational
knowledge rather than project archaeology, so they are written in present tense too: a named setting **does
not exist** in that runtime, rather than _was removed_ from it.

## `mechanism_consumed_date_is_an_operand`

**A date a reader interprets is narrative, and a date a mechanism consumes to compute a verdict is an
operand.** The first is forbidden by `history_has_two_homes`. The second is machine state, in the same class
as any value inside a generated report, and it is legal.

**The discriminator is neither the value's format nor where it sits, but whether something reads it to
decide.** A timestamp a gate compares against a window is an input to a computation. A timestamp a party
reads to learn when we did something is project archaeology, and no wrapper makes it otherwise.

**The same discriminator governs any retained prior value, not only a date.** A mechanism that must report a
change needs both states, so the earlier one is an operand of the comparison rather than a record of the
past: a verdict that moved, a count that fell, a member that left a set. Where the comparison exists and
consumes it, the retained value is machine state in the same class as any other input.

**The bound is consumption, and it is the whole of the permission.** A prior value retained while nothing
compares it is a diary with a technical spelling, and the tell is that removing the comparison would leave
the value still written. So the earlier state is retained by the mechanism that consumes it, in the artifact
that mechanism computes, and it goes when the comparison goes.

**It is stated because the alternative reading refuses a whole class of useful mechanism for a
resemblance.** A change report looks like history, with two states and one of them earlier, and a rule
matching on that shape would forbid every drift detector, every staleness axis and every moved-set
comparison this package already runs. These rules forbid a narrative about our own past, and they do not
forbid a computation whose input happens to be a past value.

**This ruling is mandatory rather than tidy, because the conflict is invisible where it occurs.** `tense`
declares taxonomy jurisdiction and markdown, so neither a generated JSON file nor the coordination board is
in its scope. **A timestamp written to either would breach a LOCKED rule with no gate reporting anything.**
The rule binds every artifact while the scan reaches a subset, so the only mechanism standing between the two
is a written ruling that the next author can find.

**A precedent that was never scanned is not a precedent.** The claim that an existing generated timestamp
"went through the tense gate and no party called it history" is false in its second half, because nothing
looked. An absence of findings over an unscanned surface is evidence about the scan, never about the surface.

## `rule_evidence_is_a_measurement_not_a_narrative`

**A rule may state the measured failure that produced it in past tense, inside the rule it justifies, and
nowhere else.** That statement is evidence the rule depends on, not archaeology beside it.

**The tension is real, and it is between two rules that are both right.** `present_tense_only` is LOCKED.
`feedback_capture_protocol` mandates that a rule state its reason, on the ground that a rule without one gets
re-litigated, and where the rule is about a failure, the reason is the failure. **A scan that resolved this by
firing on every rule digest would red the build on the documents that carry the governance**, which is a gate
reporting a defect in the thing it exists to protect.

**The discriminator is the one `mechanism_consumed_date_is_an_operand` already draws.** There, a date a
mechanism consumes to compute a verdict is an operand, and a date a reader interprets is narrative. Here, a
past-tense clause a rule depends on for its justification is an operand of that rule, and a past-tense clause
nothing depends on is archaeology. **The discriminator is dependence, never tense and never location.**

### The bound, which carries the permission

A permission with no bound is `history_has_two_homes` repealed by degrees. Three constraints apply, all
checkable:

| permitted                                                    | refused                                               |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| the shape that failed, and how it presented                  | who did it, and when                                  |
| a measurement, such as a count, a construct or an observable | a sequence of events                                  |
| inside the body of the rule it justifies                     | anywhere else in the document, and any other document |

**No dates, no agent names, no ordering.** A rule stating _a whole-file write destroyed a neighbor's record_
carries a construct, while the same sentence with a name and a timestamp is a diary entry dressed as a rule,
and it is the form that grows.

**The permission is scoped to the rules root by construction rather than by exemption.** Nothing outside
`.{provider}/rules/` carries a rule's justification, so nothing outside it has an operand to claim. A document
elsewhere reaching for this permission is asserting that something depends on its past tense, which is
exactly the claim it must then be able to name.

**The gate is bounded to the same construct**: a past-form verb about this project is admissible where it
sits inside a rule body under the rules root, and fails everywhere else. That leaves the suppressed set small,
cited as data, and checkable against the digests themselves.

### Reach for the permission last, because present tense almost always carries the evidence

**The scan matches a project referent followed by a past-form verb, not past tense in general**, so a
measurement stated as a shape rather than as an episode passes untouched. _A record leaves a live surface while
its template still declares it_ carries exactly what _a record was removed and the template still declared it_
carries, and names no episode. **Measured across the digests, the evidence prose is already almost entirely in
this form.**

**So the permission covers a residue rather than a practice, and the residue is where present tense genuinely
cannot state the measurement.** That is rare enough that hitting the gate is a prompt to rephrase before it is
a prompt to invoke the permission.

**The order matters because of which party would be widening what.** The rules, the gates that check them and
the documents they govern can sit with one seat, and in that state relaxing a gate to admit one's own prose
cannot be told apart from implementing a declared decision. **Rephrasing costs a sentence and settles the
question, while widening costs a gate and reopens it**, so the rephrase is taken first and the permission is
invoked only when the rephrase does not work.

## `a_measured_entry_retires_by_extraction`

**A measured failure mode is evidence, it exists in exactly one place, and that place is a surface whose
declared lifetime licenses overwriting it.** So a measured entry in a seat's role document, or in any
governing surface that records what has actually been observed about its subject, is retired only by
extraction to the history accumulator, exactly as a coordination item is.

### Why it exists

**A seat's measured error distribution is the only evidence it has about itself, and nothing else in the tree
holds a copy.** A rule carries the shape it enforces, a gate carries a verdict, and the accumulator carries
what a discussion concluded. **None of them records what one seat repeatedly gets wrong**, which is the input
that makes a role document more than a job description.

**The surface it lives on is current-truth-only, which is correct for every other part of it.** A role
document states what a seat does, so `present_tense_only` and `overwrite_dont_annotate` both bind, and under
them a measured section is freely replaceable. **The two rules compose into a license to delete the only copy
of a measurement**, with no gate objecting in either direction: a prune and a restore both land silently.

**The distinction is the one `mechanism_consumed_date_is_an_operand` already draws.** A statement of what a
seat does is current truth, replaced when it changes. **A measurement of what a seat has done is an operand of
that statement**, because something depends on it, so it is evidence rather than description, and evidence is
not overwritten by the thing it supports.

### How to apply it

1. **Retire by extracting first.** The entry reaches the accumulator, under the class it belongs to, before it
   leaves the role document, in the same order as every drain here.
2. **An anticipated entry never takes the place of a measured one.** An unfired prediction and an observed shape
   are different kinds of claim, and the second outranks the first and is never displaced by it.
3. **Adding a measurement needs nothing.** The obligation is on removal only, so recording a newly observed
   shape stays as cheap as it should be.

### What it does not license

**It is not a history section inside a role document.** The document states the current measured set, and
what left it lives in the accumulator, reached by its class name. **A retired entry annotated in place is
exactly the diary this file's other rules exist to prevent**, and extraction is what makes deletion honest,
not an exemption from deleting.

## `overwrite_dont_annotate`

When something changes, **the text is rewritten so it describes the new state.** No note is appended,
nothing is struck through or marked retired, and the superseded text is not kept alongside the new. Obsolete
records are removed entirely rather than flagged.

## `checklist_is_current_and_future` (LOCKED)

A checklist states **what is true now and what remains**, and nothing else.

It carries tasks, their contracts, and the requirements that bind them. It does not carry:

- findings about defects already repaired
- narrative about how the checklist itself came to be, or what an earlier draft said
- commentary on the author's reasoning, corrections, or changes of mind
- inventories of what exists, which drift into archaeology the moment the tree moves
- a closed task left in place with a note explaining that it is closed

**A closed task is deleted, not annotated.** Deleting it is what makes the remaining set the work.

The danger is specific and worse than untidiness. Past on a checklist invites **re-implementing work already
done**, because a reader cannot tell a finished row from an open one without going to the tree. It also seeds
confusion about intent: a task written against a state that has moved describes a destination no party is
still traveling toward.

Where a constraint carries weight, it lives in the task's non-goal, never in prose beside it. Reasoning that
produced a task is not part of the task.

History has the same two homes it always has: the history accumulator, or a message to the owner.

The `checklist` gate enforces the observable half: past markers, status markers and history headings in every
planning surface the configuration declares, matched at word boundaries so a mention inside a path or a quoted
term is not a false positive.

**A transcribed count is the same failure expressed as a number.** A planning surface that states how many
rules, phases, tasks, files or specs exist has copied a fact the pipeline derives, and the copy is wrong from
the first change no party propagated, so it reads as current while describing a tree that has moved.
`checklist/literalCount` fails a digit-form numeral immediately followed by a noun naming a set the pipeline
derives, across every root planning surface rather than only the contract-declaring ones.

The match is deliberately narrow on two axes, and both follow from the same judgment. **Digit form only**,
because prose counts in words: "one file per unit" is grammar and "1304 files" is a measurement, and no
discriminator separates them more cheaply than the form the author already chose. **Only nouns the pipeline
actually derives**, so the rule forbids transcribing what the toolchain computes and says nothing about
counting anything else. A wider match would rewrite arguments that merely contain a number, and a false
rewrite of a correct document is worse than a missed literal, because the reader sees the miss and never sees
the rewrite.

**Deleting a closed task is what makes retirement structural, and it is also what breaks references.** Every
dependency note, ordering claim and directed flag cites tasks by id, so the same gate holds both ends of that
graph. An id declared twice makes every citation of it ambiguous with no error anywhere, and an id cited after
its task is deleted points at nothing while reading as a live dependency. Both are decidable from the file
alone, since the declared set is the tasks and the cited set is every three-part id in prose, and neither
heals, because which of two colliding rows should move and whether a dangling citation should be rewritten or
removed are both judgments.

## `caught_means_fixed`

The moment a violation enters context, whether it is read, searched, found in a file opened for any reason,
or noticed in passing, **it is fixed immediately, in that same turn.**

- It is not reported and left.
- It is not put to the owner as a question.
- It is not added to a list for later.
- It does not wait for the current task to finish.
- It is not declared out of scope, because there is no out of scope for this.

This applies to every kind of staleness, not just tense: wrong paths, dead references, outdated counts,
superseded instructions, and contradictions between files.

Deferring is what creates the debt. A "not now, later" is a new accumulation that gets forgotten, leaves
documents contradicting each other, and breaks future work. Fixing on sight is cheaper every single time.

The only exception is content inside the history accumulator, which is history by design.
