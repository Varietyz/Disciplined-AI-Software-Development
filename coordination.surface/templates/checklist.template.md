<!-- CHECKLIST SURFACE -->

# A planning surface: what remains, who holds each item, and what would prove each one done.

# Copy to `<subject>.checklist.md` in the declared checklists root. The checklist walk derives its contract from here.

# Instantiate per project. Nothing raised from this template names a project, a party, a tool or a count.

# Model: `models/coordination.model.md`. The surface states what is true now and what remains, and nothing else.

═══════════════════ LIFETIME (declared, read rather than inferred) ═══════════════════

**The values are drawn from the closed sets the parameter surface declares and are not restated here.** A
mechanism resolves the members there, and this surface class states what each axis separates.

**The file default:** retention `current-truth`, because a closed task is deleted rather than marked, and
deleting it is what makes the remaining set the work. Mutability `owner-rewritable`, because a task's own owner
revises its row, and the surface's author revises the governing context. Removal authority `handler`, because the
party that did the work removes its row, since only it knows the work is done, and a row removed by any other
party records a completion no party observed.

| section                                    | axis       | value           | why                                                                                                 |
| ------------------------------------------ | ---------- | --------------- | --------------------------------------------------------------------------------------------------- |
| this LIFETIME block and the CONTRACT block | mutability | `frozen`        | written from the template and never edited in a live surface, so a correction lands in the template |
| the governing context                      | retention  | `current-truth` | it states what this distribution is for, and it is corrected in place when the objective moves      |
| a task row                                 | retention  | `until closed`  | what ends it is the completion of what it asked for, tested against the tree rather than felt       |

**An assignment outranks surface ownership for the item it names, and that is declared rather than assumed.**
Otherwise a distribution can only assign work to whoever already owns the file, which makes every outcome land
in the seat that produced it. **An unassigned write into another party's surface remains a breach**, and the
discriminator is the visible row, which can be contested where an edit cannot.

═══════════════════ CONTRACT (permanent) ═══════════════════

## What a checklist carries, and what it refuses

**A checklist states what is true now and what remains.** It carries tasks, their contracts, and the requirements
binding them. It does not carry findings about defects already repaired, narrative about how the surface came to
be, commentary on its author's reasoning, inventories that drift into archaeology, or a closed task left in place
with a note explaining that it is closed.

**Past on a checklist invites re-implementing finished work**, because a reader cannot tell a finished row from an
open one without going to the tree. It also seeds confusion about intent, since a task written against a state that
has moved describes a destination no party is still traveling toward.

**A transcribed count is the same failure in the form of a number.** A surface stating how many rules, phases,
tasks, files or specs exist has copied a fact the pipeline derives, so it is wrong from the first change no party
propagated while reading as current. **The enumeration is the fact, and nothing restates it.**

## The identifier grammar

**Every task carries an identifier unique across the surface, and every cited identifier resolves to a declared
task.** The form is `<phase>.<group>.<task>`, positional and stable. A duplicated identifier makes every citation
of it ambiguous with no error anywhere, and a citation surviving its task's deletion reads as a live dependency.
Both are decidable from the file alone and neither heals, because which of two colliding rows should move, and
whether a dangling citation should be rewritten or removed, are judgments.

**Identifiers are never renumbered to close a gap.** A deleted task leaves its number unused, because every
citation ever written resolves through it, and renumbering silently re-points them.

## The task contract: every field, on every row

| field      | states                                                                         | rendered as                                                                          | omitted means                                                                       |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| method     | how it is done, derived from the mechanism rather than from the defect's shape | the row's leading STATEMENT, carrying no marker because it is the row's own sentence | a builder inventing an approach the row was written to constrain                    |
| locus      | the file, tree or surface the row acts on                                      | `*file:*`                                                                            | a row whose target is inferred from its prose, which two builders infer differently |
| evidence   | what will be observable when it is done                                        | `*evidence:*`                                                                        | a completion claim resting on its author's account                                  |
| owner      | the party that will do it, or `unmeasured` with the rule that fills it         | `*owner:*`                                                                           | a row no party picks up                                                             |
| validation | the mechanism that decides it, or the reason none can                          | `*verifier:*`                                                                        | a row closed by its owner's judgment alone                                          |
| non-goal   | what this row deliberately does not do                                         | `*not:*`                                                                             | scope that grows silently, which is how a task becomes a project                    |
| done when  | the condition, testable against the tree                                       | `*done:*`                                                                            | a row that closes when it feels finished                                            |

**The rendered form is declared here so the walk derives it rather than transcribing it.** A check holding its own
marker set is a second copy of this contract, and the copy is what binds, so a field added to the table above
arrives in no check, every surface stays conformant to the copy, and nothing reports the disagreement. **The field
table answers what a row carries and this column answers how**, and a derivation needs both, because naming only
the fields leaves a check composing a marker from a field name, which is a spelling guess posing as a derivation.

**A row is its statement followed by its marked fields, each separated by the same divider**, in the order the table
declares:

```text
- [ ] <identifier> <the statement>. *file:* <locus> · *evidence:* <observable> · *owner:* <party> · *verifier:* <mechanism> · *not:* <non-goal> · *done:* <condition>
```

**Owner and validation are two fields and take two markers, which is the one place this declaration separates what a
row may have collapsed.** A party is not a mechanism. A row naming a party where the mechanism belongs states that the
work is decided by whoever did it, which is exactly the state the validation field exists to refuse, and the two read
identically once one marker carries both.

**A method clause is authored from the mechanism and never from the defect's shape.** A rule is delivered once to a
reader who quotes it, and a row is delivered once to a builder who acts, so the obligation to open the mechanism is
identical and the cost of skipping it is not.

**`unmeasured` is a real owner value and states its filling rule.** Where an operation may be refused for one party
and permitted for another, naming a party in advance authors a row that party may be unable to discharge, and the
rule that fills it is the row's operand.

## The declared axes, which a walk reads from here rather than transcribing them

**The substrate cycle.** A phase declares its genesis, and phases order by dependency and then by genesis. A phase
never depends on a later-genesis output than it produces.

`existence` → `difference` → `relation` → `structure` → `transformation` → `constraint` → `emergence`

**The dependency axes.** Every phase declares all four, and an axis with nothing on it carries the evidence that it
was assessed and found empty.

| axis            | asks                                                            |
| --------------- | --------------------------------------------------------------- |
| Z (sequential)  | what this phase consumes from the phase before it               |
| X (lateral)     | which items inside this phase are peer-independent              |
| Y (diagonal)    | what this phase shares with a phase it does not directly follow |
| W (propagation) | what changes downstream when this phase lands                   |

**The ripple dimensions.** Every phase renders each dimension with the entity it touches, what lies downstream, and
the consequence if it is omitted. **Impact is recorded as named entities rather than as counts**, and a dimension with
no impact carries the evidence that it was assessed and found empty rather than being silently dropped.

`registry` · `contracts` · `persistence` · `security` · `infrastructure` · `performance` · `observability` ·
`enforcement` · `consumers`

**The generation gates.** These resolve while the surface is produced, and each carries its result and its evidence.
They are separate from the phase gates, which run when the checklist is executed and ship unchecked, and conflating
the two lets a surface whose generation gates passed read as one whose execution gates did.

| gate         | owes                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| tel-priority | the selected branch as argmax(utility − cost) over the ADMISSIBLE set, with the rejected branches named and the reason each fails |
| constrain    | every item tracing to the selected branch, and the limit-breach set empty over the limits that RESOLVE                            |
| ver-stop     | every item naming what measured it and the surface it lands in, each falsifiable by opening that surface                          |
| ter-stop     | saturation AND completion AND verification, stated as conditions rather than as a judgment that the work feels done               |

**A gate that names no evidence is ceremony and fails.**

**The confidence threshold.** The surface declares a confidence, and a material claim below the declared threshold is
carried with what would raise it rather than asserted. _No contradiction found_ is not support.

## The principle disposition

**Every principle the catalog declares is dispositioned as `applies`, `recommended`, `uncertain` or `n/a`, with its
reason and its validator.** An absent disposition makes an oversight indistinguishable from an assessed decision,
which is the same distinction the empty-versus-missing rule draws everywhere else here. An `n/a` states what was
checked and found inapplicable rather than what was skipped.

## Ownership resolution

**Every owner and every validator binding resolves to a party the coordination surface declares active**, and the
roster is derived rather than declared here. A row bound to an absent party can be built and never retired, which is
the same shape as an item addressed to a party that does not exist.

## Gate

- A closed task present on the surface fails, because deleting it is what makes the remaining set the work.
- A status marker, a past-tense narrative or a history heading fails wherever it appears.
- A digit-form count immediately followed by a noun naming a set the pipeline derives fails.
- Every task carries every contract field, and an absent field fails as unstated rather than as permissive.
- Every identifier is unique, and every cited identifier resolves to a declared task.
- Every phase renders all four dependency axes and every ripple dimension, including the empty ones.
- Every generation gate carries a result and its evidence.
- Every owner and validator binding resolves to a party the coordination surface declares active.

═══════════════════ CHECKLIST ═══════════════════

### PHASE `existence`

### PHASE `difference`

### PHASE `relation`

### PHASE `structure`

### PHASE `transformation`

### PHASE `constraint`

### PHASE `emergence`

**A surface raised from this template carries no task until its distribution is known.** The section is born present
and empty, which can be told apart from a populated one, while an absent section states nothing, and that is what
makes an oversight read exactly like a decision.

**What a raise carries is the permanent blocks and one bare phase span per stage of the substrate cycle**, so a raised
surface is a checklist by the walk's own test while asking its reader for nothing. The phase contract, meaning the
dependency axes, the ripple chain and the genesis stage, binds a surface put to work rather than one merely raised,
and a bare span states an intended cycle without claiming work it cannot close.

**Everything below is authored rather than rendered, and the order is the shape the author fills:**

1. the title, what this surface distributes and which identifier it closes
2. the declared confidence and the principle catalog it dispositions against
3. the governing context, the generation gates and the principle disposition
4. each phase span, carrying its genesis, its loop class, its severity, its dependency axes, its ripple chain and its
   tasks
5. the appendices: where each artifact lands, the evidence inventory, and what the distribution deliberately excludes
   with the reason for each exclusion
