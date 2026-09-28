# Reasoning templates

The templates in `.{provider}/templates/` are **protocols for the model's reasoning**, executed when it
produces a structured construct. They are not reference material and are not optional.

## `templates_are_executed` (LOCKED)

A template is a program. Producing a plan, checklist, task set, workflow, agent or verification flow means
**walking its ten-node loop as stated** and emitting the artifact the loop terminates on.

Reading a template and writing something template-shaped is not execution, and neither is skimming it for
ideas. The nodes, their contracts, their gates and their order are the procedure.

## `recurring_shape_is_a_template` (LOCKED)

**If a shape recurs, it is a template.** A second instance of an artifact shape is the trigger rather than a
signal to watch: the template is authored before that second instance is written, and every later instance is
raised from it rather than derived, copied or recalled.

### Why

**A shape with no template is re-derived by whichever party needs it next, and each derivation is locally
reasonable.** The author reads a sibling, infers the contract from what that sibling happens to contain, and
produces something close enough that nothing objects. The drift is then invisible at every step, and the
divergence is discovered only when a check derives its contract from one of them.

**Measured twice, and the second time by the party that holds the template tree.** First, four parties produced
four formats for one surface from four sources, on a rule every one of them broke identically, with the
contract one directory away and unread, which is a delivery failure rather than four lapses. Then a planning
surface was authored by reading a sibling planning surface, because no template for that shape existed. The
contract came out close and the derivation was the defect, since a sibling carries one instance's choices and
a template carries the constraint.

**The control is the surface whose shape no party has ever invented.** Where a template is delivered and a
form renders it, no party has produced a divergent instance, so the discriminator is delivery rather than
care.

### How to apply it

1. **The second instance is the trigger.** One instance is an artifact and two are a shape, and the second is
   authored from a template or it is authored twice.
2. **The template carries the contract and never one instance's content.** Its declared vocabularies, such as
   the axes, the dimensions, the gates and the field set, are what a check reads, so the check derives from the
   template rather than transcribing it and the two cannot drift.
3. **A raise form renders it.** A template that must be copied by hand is a template whose next instance is
   still derived, and the form is what makes raising cheaper than recalling.
4. **A raised surface's contract block is frozen.** A correction lands in the template and reaches every later
   instance, never in the instance where only its author will see it.

### What it does not license

**It is not a reason to template a one-off.** A shape that has occurred once has no evidence of recurrence,
and a template raised from a single instance encodes that instance's accidents as a contract. The trigger is
the second instance, which is also the first moment the invariant part can be told apart from the incidental
part.

## `template_selector_is_genesis`

Each template's LAYER 0 asks a distinct "how does X come to be?", and that question is the dispatch key.

| producing                                      | template    | genesis                           |
| ---------------------------------------------- | ----------- | --------------------------------- |
| a plan, checklist, task breakdown              | `checklist` | how does anything come to be?     |
| a verdict on claims, an audit, a context check | `claim`     | how does a verdict come to be?    |
| a shared abstraction from repeated evidence    | `pattern`   | how does a base come to be?       |
| a reusable specialized investigator            | `agent`     | how does the agent come to be?    |
| a template from an executed document           | `layer`     | how does the template come to be? |

When two could apply, the artifact being terminated on decides. When none applies, the model says so rather
than forcing one.

## `plan_is_drafted_then_restructured` (LOCKED)

Planning is a three-step sequence, never one step:

1. **Draft.** The first plan is written from the task.
2. **Compare.** `checklist` is read and the draft is compared against it, node by node and gate by gate.
3. **Restructure.** The plan is rewritten to what the template enforces. The template is the authority, and
   the draft is raw material.

The restructure is not cosmetic. It adds what an ordinary plan lacks, and it cannot be skipped because the
draft "already covers it":

- worth before work: the selected branch is `argmax(utility − cost)` over _admissible_ branches, with the
  ranking shown, rather than the first workable idea
- topology ordering: dependency-topological **then** genesis
- genesis consistency: a phase never depends on a later-genesis output than it produces
- the four dependency axes, sequential, lateral, diagonal and propagation, present per phase
- evidence contracts: every material claim carries its evidence, a named refuter, and a confidence at or
  above threshold, and "no contradiction found" is not support
- explicit termination: done means saturation and completion and verification, never self-assessed

## `follow_template_as_stated`

The template is executed as written. Its node order, mandatory gates, typed decisions, contracts and
invariants are not adapted to taste, condensed for brevity, or partially applied.

## `mechanism_transfers_catalogs_rederive`

Where a template's vocabulary does not fit the tree it runs in, the **mechanism transfers and the catalog is
re-derived**. The loop, the typing and the gates are domain-neutral, while a principle or pattern catalog is
re-resolved against the constructs that actually exist. Where the slot naming a construct resolves ABSENT, the
branch reading it does not run, rather than being re-pointed at the nearest thing available. Substituting the
mechanism is the violation, and re-deriving a catalog is the work.

**An example catalog is the half no token scan reaches**, so it is found by reading a protocol whole: its loop
can be perfectly domain-neutral while its examples assume a construct the tree does not carry.

## `four_gates_always_run`

`tel-priority` (worth), `constrain` (admissibility after realization), `ver-stop` (evidence) and `ter-stop`
(termination) run on every execution. The selectable epistemic axes run when relevant, and these four never
fold.

A gate that names no evidence is ceremony and fails.

## `decisions_are_typed`

Every decision resolves to its declared shape. A gate owing a ranking is not satisfied by a boolean, and a
gate owing a boolean is not satisfied by a ranking. An untyped decision is a defect.

## `severity_routes_never_orders`

Severity is metadata that routes a failure to its handler. It is never a grouping axis and never an ordering
axis, because ordering is dependency-topological, then genesis.

Severity also never softens a verdict. A gate returns pass or fail, and severity decides what gets repaired
first among the failures, not which failures are tolerable.

## `ripple_carries_names`

Impact is recorded as named entities, never as counts. "Three files affected" is not an impact record, and the
three names are. A dimension with no impact carries the evidence that it was assessed and found empty, never a
silent omission.

## `generation_gates_are_not_execution_gates`

Gates resolved while _producing_ an artifact are separated from the gates that will run when the artifact is
_executed_. The latter ship unchecked, and that is stated rather than conflated, because an artifact whose
generation gates passed is not an artifact whose execution gates passed.

## `repair_from_earliest_owner`

A failed gate routes backward to the **earliest** node that can supply the missing evidence, not to the
nearest. Repair invalidates every dependent record forward, and a downstream record is never restored after an
upstream repair. Repair is bounded, and exhaustion terminates as blocked rather than as success.

## `descriptive_is_not_full_shaped`

Only an _executed_ artifact, one that is run, takes the full loop. A _descriptive_ artifact (reference, spec,
contract, note) is not full-shaped, and forcing the loop onto it is the Procrustean failure the meta-template
names.

## `templates_stay_independent`

Each template inlines the whole structure by design. This is the one place the duplication rule is
deliberately overruled: the templates are never refactored toward a shared imported spine, because the shared
structure is what makes each one independently executable.
