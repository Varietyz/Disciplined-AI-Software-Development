# Concern taxonomy: naming and placement

**Scope:** how every governed file is **named** and **placed**. It governs folder creation, file creation,
renaming, refactoring, and the vocabulary itself.

The closed vocabularies, the declared containers and the depth cap live in the package configuration,
which is the one truth the placement and naming checks read. Slot resolution is the generated binding.

## `taxonomy_is_declared_jurisdiction` (LOCKED)

A declared container is a governed root. **No declaration, no enforcement.** Everything else sits outside
jurisdiction, each for a stated reason: a tree another system owns, an upstream tree, generated output, and
the vocabulary's own definition.

A declaration is a claim, so it is verified against the disk: the `declaration` check fails any declared
root, container or bucket that resolves to nothing. Declaring a folder before creating it governs nothing,
fails nothing, and reads exactly like coverage.

## `foreign_grammar_is_never_claimed` (LOCKED)

Existing is not the same as being ours to claim. A tree carrying another system's ownership markers is
**never declared a governed root**, and the check fails the declaration rather than the contents.

The markers are held as data, so the check matches the construct and adding an ecosystem is an entry rather
than a code change:

| marker                                      | what it means                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| a delimiter-wrapped folder name             | another grammar's grouping construct, which this one forbids outright                            |
| an ownership manifest at the directory root | the directory is a runtime-identified unit, so its name is an identifier something else resolves |

**A directory another runtime starts by name is an identifier rather than a filename.** Renaming one to
satisfy placement reorganizes nothing and silently breaks what reads it at the next start. Such a tree is
governed on the artifact axis, where its structure is a tension rather than a taxonomy rule.

The vocabulary's own definition is **structurally exempt**, because the check's own source cannot be
governed by the grammar it declares.

## `upstream_material_is_declared_never_governed` (LOCKED)

A tree holding material **authored elsewhere** is declared as an upstream root, and that one declaration
exempts it from the naming, the tense and the reference checks together.

**All three fail such a tree, and not one of the three failures is a defect in it.** Its filenames are its
author's, so the placement grammar has nothing to enforce. Its version statements describe a platform rather
than this project, which the platform-state rule already exempts, **and no scan can separate the two inside a
sentence, so the root makes the discrimination.** The paths it cites are illustrative, so resolving them
finds nothing and reports a disconnection that was never a connection.

**The exemption is one declaration the three checks cite, never three exemptions maintained in parallel.**
Three lists answering _is this ours_ are three places to disagree, and the one that goes stale is the one no
party re-reads. The measured shape: an upstream tree of a handful of documents produces findings across all
three checks, and a single declared root clears every one of them without a byte of those documents
changing.

**The declaration is also verified against disk.** An upstream root that exists only in the configuration
exempts nothing while reading as a considered exclusion, and the next tree landing under a similar name
inherits an exemption no party granted it. **A stale jurisdiction claim under-governs and announces itself,
while a stale exemption over-permits silently.**

## `taxonomy_grammar`

```text
folder = <container> | <subject> | <concern>        one word, never a dot
file   = <subject>.<concern>.<ext>
       | <subject>.<variant>.<concern>.<ext>        overflow form
```

The file's concern equals its parent folder's concern. That equality carries the whole guarantee: one pair of
patterns resolves the system, and neither is anchored to depth.

Names are kebab-case throughout. A hyphen inside a slot is spelling, and the dot is the only separator, so a
dotted folder name is always wrong.

## `resolution_is_positional`

Resolution is **positional rather than lexical**: a word is read by the slot it lands in, so a concern tag is
a legal subject. The one lexical bar is subject ≠ concern.

## `taxonomy_ordered_roles`

```text
container(1) → subject(2, optional) → concern(3) → file       depth within the declared cap
```

Roles resolve in order and are skippable, but never repeated and never revisited. The file's parent is
always a concern folder.

## `taxonomy_one_legal_path` (LOCKED)

A subject folder exists **if and only if** the container holds two or more sets of one concern that must not
merge. The _if and only if_ keeps one legal path per file, because optional grouping would give
classification two right answers and make placement uncheckable.

## `overflow_relieves_sideways`

**Overflow relieves sideways, never downward.** A collision takes the filename's variant slot, and breadth
takes a sibling subject folder. The depth cap is why both slots exist.

## `taxonomy_vocabulary_is_closed` (LOCKED)

All three slots draw from closed arrays. An undeclared word is an approved configuration edit rather than a
naming choice. The ladder runs in order: pick an existing word → reason the word → apply the is-a test → if
it fails, the filename is wrong → if the file has two roles, the file is wrong → only then propose it.

**An identity another surface allocates is derived into the slot and never declared into the array.** A
vocabulary that grows by one word per instance is not closed. Copying an allocator's output into a second
list makes two owners of one fact that disagree the moment one moves, so a seat letter resolves from the
index that allocates it and needs no vocabulary edit at all.

`manager`, `handler`, `helper` and `util` are not concerns. They name stature or nothing, so they classify
nothing. One generic subject is sanctioned, and only where the file names no domain noun anywhere in its own
source.

## `classification_is_judgment` (LOCKED)

The file is read, the narrowest accurate concern is named, the vocabulary is checked, and the name is
verified against the content rather than against the current filename. One concern per file applies, and two
concerns are a split, never a compromise tag.

**Tooling can count and cross-check, and it cannot reason.** Structure is machine-decidable and
classification is not: a check reports that a name does not parse or that a tag disagrees with its folder,
and never decides what a file _is_.

## `born_conformant`

A file created under a governed root is named and placed correctly **at creation**. There is no conversion
queue and no fix-it-in-the-sweep, because the first write is the conformant one.

## `ordering_is_not_naming`

A numeric prefix encodes load order, which belongs in an import list or a registry rather than in a name the
grammar must parse. Adopting the taxonomy removes them.

## `pattern_references_verified_after_rename` (LOCKED)

The precondition for any rename is enumerating every **pattern-referenced** surface, and the post-condition
is verifying that each resolves the same set afterwards. The reference-bearing fields across the governed
documents form a graph encoded in text, and the segment tool derives it, so the count is read from its report
rather than stated here. A missed rename fails silently: the reference resolves to nothing, nothing errors,
and the graph is quietly disconnected.

**A rename is a create at its destination**, so the destination is read first, and the enumeration happens
before the move rather than after it.

The `reference` check holds the post-condition continuously. Every in-tree reference is re-resolved on every
run, so a disconnection is caught at the next run rather than at the next read.

## `slot_absence_is_honored`

A consumer that names a slot the configuration resolves **ABSENT** declares that absence and does not run the
branch depending on it. **Reading an ABSENT slot as though it resolved is the defect**, and it is invisible
from the producer side.

**A check reading only the producer cannot see it.** The producer-side check fails a consumer naming a slot
the configuration does not declare, because it reads the configuration and never the reader. So a slot
correctly declared ABSENT passes that check, and every consumer treating it as a value passes with it: **one
check over two sides, watching the side that was already right.**

**The failure is worse than a missing value, because it manufactures a demand nothing can satisfy.** The
measured shape: an artifact consumes a slot the configuration declares ABSENT, and its own mandatory gate then
demands evidence of a decision the tree has no surface for. **The gate is satisfiable only by fabricating its
own evidence**, which is strictly worse than no gate, because a fabricated pass reads exactly like a real one
and the artifact records that a check ran.

**Both operands are files, so the check is decidable with no judgment**: the configuration states which slots
resolve ABSENT, and a consumer either declares that state beside its use or does not. It claims nothing about
whether the consumer behaved correctly, only that the artifact states the absence it is bound by, which is
presence standing for presence.

**The construct covers every non-resolving state rather than ABSENT alone.** DEFERRED means the slot will
exist and does not yet, so its branch is **blocked rather than skipped**. Collapsing the second into the first
answers a different question in the right shape, and a consumer falling back to the nearest existing surface
produces an answer no party asked for, in a form that passes review.

**Three false-positive classes are one error: the check scoped tighter than the practice it measures.**

1. Resolving a state by searching the state set in declaration order returns the earliest member of the set
   rather than the earliest match in the line, so a row whose prose mentions another state resolves wrong.
   **Position is the question whenever the source is prose.**
2. Honoring scoped to the consuming line fires on an artifact that declares the absence two lines later.
3. Honoring scoped to the declaring line fires on every slot a multi-line declaration names on a
   continuation.

**Both scopes are the block**, because the obligation is that the artifact states the state, rather than
restating it at every mention.

**A slot named beside a wildcard form is the slot vocabulary being enumerated rather than a slot being
read**, and matching it would make the detector match its own subject matter, inside a check about slot
consumption.

**The cost of the two error directions is asymmetric, and that decides the scoping.** A miss is invisible and
waits, while a false rewrite of a correct artifact is acted on, and it asks the author who did the right thing
to undo it. **A check that punishes the right answer teaches every party to write the wrong one.**

## Check inventory

The checks are split so a single misplaced file is never reported twice. The registered set is the check
directory rather than this list, and a run's aggregate carries what it actually loaded.

| check         | stage     | enforces                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`   | structure | a missing root, a missing or undeclared container, a nested special folder, a loose file at a root, a shape the grammar cannot read                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `slot`        | structure | a filename that does not parse, a concern tag disagreeing with its folder, a subject equal to its concern, a slot outside its closed array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `purity`      | structure | a module in the leaf tier importing from above it. The parameter surface is a substrate rather than a layer above, since it depends on nothing in the tree and so cannot close a cycle, and naming that is what lets the check pass every real leaf while still firing on an import that climbs out                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `literal`     | structure | a string literal handed to a filesystem call without passing through the parameter surface. The discriminator is the call rather than the value's shape, because a path assembled from single-segment literals contains no path in any one of them. A bare document name belonging to the host cannot be told apart from a legitimate basename, so this check does not reach that half and does not claim to                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `declaration` | meta      | every declared root and container, and every manifest workspace, subpath and script target, resolved against the disk                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `board`       | content   | the board's record schema and field cardinality, stale markers, a record restating one claim twice, an item addressed to an absent seat, the item fences, the letter index, and the projection's shape and size                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `role`        | content   | an active letter owning no role document, and a role document missing a section or a declared operand                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `blocking`    | content   | an open prioritized discussion still on disk, one declaring no exit condition, and a decision row naming neither a check nor a proof                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `checklist`   | content   | a planning surface carrying the task contract on every task, no history or status marker, a unique id per task, no citation to an id no task declares, and its cardinality derived rather than transcribed. A surface carrying the checklist concern additionally answers to the template protocol. Its contract is derived from that template on every run rather than transcribed into the check: the substrate cycle, the ripple dimensions, the dependency-axis labels and the confidence threshold are all read from the template's own declarations, so the check cannot drift from the protocol it enforces. Every owner and verifier binding resolves to a seat the board declares active, the roster derived from the board rather than declared, because a row bound to an absent seat can be built and never retired |
| `reference`   | content   | an in-tree citation that resolves to nothing, and an edit overlapping another writer's span                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `tense`       | content   | present-tense-only across authored surfaces, with the upstream and rule-justification exemptions declared once                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `template`    | content   | a template's mandatory gates, its independence, and an agent artifact's declared identity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `binding`     | meta      | a slot a consumer names that the configuration does not resolve, and a consumer naming a slot resolved ABSENT or DEFERRED without declaring that state. The first reads the producer and the second reads the reader, and a check that only ever reads the producer is green over every consumer that ignores what it produced                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `record`      | content   | a typed record against its declared schema, its closed confidence and derivation vocabularies, and the range and parent it names                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `secret`      | content   | a credential-shaped value outside the single artifact declared to bear it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `coverage`    | meta      | every rule declaring a check or declaring conduct with its written proof, every named check registered, and no digest declaring a check of its own                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `governance`  | meta      | the registration contract, the finding shape, and a report no declaration or emission claims, which it deletes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `entrypoint`  | meta      | opt-in healing, a second entry point running the pipeline, a narrowed aggregate replacing the whole-scope one, a removal without a resolvable extraction, and a file rewritten from an earlier read with no compared witness before the write                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `verdict`     | meta      | a middle verdict tier declared anywhere in the toolchain                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

The configuration's own type assertions govern the configuration: no subject shadows a concern, no variant
shadows either, and every declared layer resolves, so the vocabulary cannot become inconsistent without
failing to compile.

## Precedence

The host's behavior document > the paste block > this digest > the configuration and the check sources >
memory.

The disk wins on disagreement, and the document is corrected the turn it is noticed.
