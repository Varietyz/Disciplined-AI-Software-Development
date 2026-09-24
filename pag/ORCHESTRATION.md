© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Orchestration — PAG — Bane's Lab

> Orchestration is the part of a document that says how work is ordered and where it runs in parallel, and the grammar does not let that be implied. A document…

Canonical: https://banes-lab.com/pag/orchestration

# Pattern Abstract Grammar

Structured instructions for LLMs

# Orchestration

## Orchestration as declared structure

[Orchestration](../ontology/PRINCIPLES.md#arch-orchestration) is the part of a document that says how work is ordered and where it runs in parallel, and the grammar does not let that be implied. A document declares its structure with constructs, each tied to the representation it makes explicit, as shown in [A1·d prose or construct](#declared-structure-panel-d). A [dependency graph](../ontology/PRINCIPLES.md#arch-dependency-graph) covers a partial order with forward dependencies; [A1·a dependency graph](#declared-structure-panel-a) declares one by name, and [A1·e name, never number](#declared-structure-panel-e) shows what the name gains. A [finite state machine](../ontology/PRINCIPLES.md#arch-finite-state-machine) covers a lifecycle drawn from a closed set of states, as shown in [A1·b state machine](#declared-structure-panel-b). Alongside these are a priority queue for a ranking, a flowchart for the rendered view of any of them, a surface for state that several parties share, a parallel block for readers that return, and a wait for a reader that never returns; [A1·c join and wait](#declared-structure-panel-c) writes that last pair. The same idea is taught in [the plan is a graph](../PLAN.md#the-flat-checklist). Here it is the project stage of [the loop](../START.md#the-loop), and it yields an edge-list. Ordering carried by the order of sentences is [temporal coupling](../ontology/PRINCIPLES.md#arch-temporal-coupling), and a model given prose reconstructs a structure of its own.

### Structure is declared

Ordering implied by the order in which sentences appear is reconstructed by every reader, and each reconstructs it differently. A sequence of decisions is numbered, one is raised out of dependency order because the next number was free, and every citation of the displaced decision resolves to the wrong thing with nothing erroring. A sentence has an order and a graph has edges, and only the second survives being read by a party that did not write it.

For this reason concurrency and [event ordering](../ontology/PRINCIPLES.md#arch-event-ordering) are declared as structure, never implied by the order of the text. The order goes in a graph and the lifecycle in a state machine, rather than the units being numbered and the sequence narrated. In practice, an order is modelled as a dependency graph whose nodes name what they depend on, so the order is partial and a number never stands in for an edge. A lifecycle is modelled as a finite state machine whose states form a closed set, whose transitions name their trigger and their guard, and whose current state is derived from the tree by a function rather than written by a party. Independent investigations run as bounded readers in a parallel block, with their artifacts joined by an await, and a participant waits through a command with its turn kept open.

To check this, reorder the sentences of a node and run it again. Where the outcome changed, the ordering was carried by prose, and the repair is the construct that carries it explicitly. Whether a declared parallel group actually runs in parallel is a fact about the harness. The grammar declares that the readers are independent, the binding decides what that gains, and a harness with no [concurrency](../ontology/PRINCIPLES.md#arch-concurrency) runs them in order without the document changing.

A dependency graph is the construct for work whose order is a set of edges rather than a line. A node names what it depends on and what comes after it, and the successor is declared by name rather than derived from a position, for the reason given in [the board and the venue](../COLLABORATE.md#the-board-and-the-venue). A [directed acyclic graph](../ontology/PRINCIPLES.md#arch-directed-acyclic-graph) turns a [circular dependency](../ontology/PRINCIPLES.md#arch-circular-dependency) into a defect the reader can see. Where one unit holds every other party's work, at most one such unit is open at a time, because two holds are two waits with no defined order between them.

A finite state machine is the construct for a lifecycle, and its states form a closed set because a mechanism can join on a value from a closed set but not on a sentence. A unit moves forward through its states over its life and never backwards, with one correction allowed where an act is reversed before anything depends on it. The current state is a [derived state](../VERIFY.md#derived-state), a function over the tree, and no party writes it. Both constructs are [declarative configuration](../ontology/PRINCIPLES.md#arch-declarative-configuration) of a run, where a paragraph would only imply the configuration.

A parallel block with an await is the construct for readers that return: each is spawned with a task, receives nothing shared, and returns exactly one typed artifact. Investigations that read a tree and write nothing belong there, one per concern, because reading contends with nothing. A wait is the construct for a participant, which never returns; for a participant, [posting and waiting are one operation](../COLLABORATE.md#posting-and-waiting-are-one-operation), and a wait is a call rather than a halt. The two constructs are not interchangeable, because an await joins a reader that was always going to end, while a wait keeps open a reader that must not end.

A1·a dependency graph

```pag
# NODE 5 — PROJECT   [epistemic · reasoning · graph · yields: edge-list]
@purpose: "Declare the order as edges, so a reader who did not write it can still resolve it"
@cue: "DECLARE_THE_EDGES"

CONTRACT:
input:        <the units of work>
transform:    for each unit -> name what it depends on -> refuse a cycle -> name the groups that are independent
constraints:  a successor is declared by name, never derived from a position; at most one unit that holds the others is open at a time
output:       DAG <units>
handoff:      acyclic AND every unit names its dependencies (yields: edge-list + boolean)

DAG <units>:
NODE <unit-a>:
<what settles it>
NODE <unit-b> AFTER <unit-a>:
<what settles it>
NODE <unit-c> DEPENDS_ON [<unit-a>]:
<what settles it>
PARALLEL_GROUP: <unit-b>, <unit-c>

HANDOFF GATE (evidence-bearing):
rule_id: "PROJECT"   yields: edge-list + boolean
[check] no unit depends on itself through any path (evidence: the walk over DAG <units>) over: <units> measured: <acyclic> / <units>
[check] every successor is named, none is a number (evidence: the AFTER and DEPENDS_ON clauses)
[check] at most one holding unit is open (evidence: count of open holds)
result: pass -> NODE 6 | a cycle -> REPAIR (owner: NODE 5) | unknown -> BLOCKED
```

A1·b state machine

```pag
# a lifecycle as a closed set of states · a transition names its trigger and its guard
STATE_MACHINE <unit>:
STATE <planned>:
ENTRY: <no artifact exists yet>
STATE <open>:
ENTRY: <a party has begun>
STATE <settled>:
ENTRY: <every condition of the exit holds>
STATE <retired>:
ENTRY: <what the settlement implies has landed>

TRANSITION FROM <planned> TO <open> ON <first-reading>
TRANSITION FROM <open> TO <settled> ON <exit-condition>
GUARD: <every party that must agree has agreed>
TRANSITION FROM <settled> TO <retired> ON <implied-work-landed>
GUARD: <nothing the settlement distributed is still open>
TRANSITION FROM <open> TO <planned> ON <artifact-removed>
GUARD: <no argument has landed yet>

FUNCTION state_of(unit):
# derived from the tree on every read · never written by a party
IF NOT EXISTS(unit.artifact): RETURN <planned>
IF every_exit_condition_holds(unit) AND implied_work_landed(unit): RETURN <retired>
IF every_exit_condition_holds(unit): RETURN <settled>
RETURN <open>
```

A1·c join and wait

```pag
# NODE 6 — ACT   [epistemic · formalisation · computation · yields: procedures]
CONTRACT:
input:        DAG <units>
transform:    run each independent group as bounded readers -> join their artifacts -> a participant waits rather than returns
constraints:  a bounded reader receives a task and nothing shared; whether a group runs together is the harness's fact, declared independence is the document's
output:       artifacts[] per group
handoff:      every group joined or explicitly still open (yields: procedure)

PARALLEL:
TASK "<investigate unit b · mutate nothing>" WITH agent: <role-b> -> <artifact-b>
TASK "<investigate unit c · mutate nothing>" WITH agent: <role-c> -> <artifact-c>
END
AWAIT <artifact-b>, <artifact-c> INTO <artifacts>

# a participant does not join · it waits, and a wait is a call rather than a halt
WAIT ON <the shared surface> AS <party> INTO <change>
IF <change> == <changed>:
READ_RESOURCE <the shared surface> whole INTO <current>
```

A1·d prose or construct

```mermaid
flowchart TB
prose["Prose · 'first do this, then that, meanwhile the other'"]
implied["Ordering implied by sentence order · the model reconstructs it"]
declared["A construct · DAG, STATE_MACHINE, PARALLEL, AWAIT, WAIT"]
explicit["Edges, states and groups every reader shares"]
prose --> implied
declared --> explicit
```

A1·e name, never number

```mermaid
flowchart LR
ordinal["An ordinal · a position in a total order"]
hidden["A unit raised before its predecessor settles · every number still intact"]
name["A declared successor · an edge in a partial order"]
caught["A successor nobody created, or a unit no predecessor declared · both decidable"]
ordinal -. preserves the violation .-> hidden
name --> caught
```

## Composing a collaboration

This section covers how a collaboration is put together from parties, as shown in [B1·d parties over a partition](#composing-a-workflow-panel-d). The methodology page states the premise in [coordination is software](../COLLABORATE.md#coordination-is-software), and the grammar expresses it as documents. [B1·a two terminal nodes](#composing-a-workflow-panel-a) shows how a document states its reader class, [B1·b change across ownership](#composing-a-workflow-panel-b) shows how a finding travels to its owner, and [B1·c party count](#composing-a-workflow-panel-c) shows how the count is derived rather than chosen. A document cannot make the parties agree; it can only make their disagreement land where a reader can see it.

### Parties over a partition

A workflow written as a sequence of agents with fixed positions runs the same shape on every task, and no task has that shape. A workflow names four positions before the work is examined, the work has three concerns, one position spends the run relaying between the other three, and the relay is where every message is lost. A party that holds the order for the others is a party every other party waits on, and a design where finders also fix has parties writing a tree that other parties are still reading.

For this reason a collaboration is a set of parties over a partition of the work, coordinating through surfaces with nothing between them. The parties are derived from the partition rather than assigned positions, and the order is given to the surfaces rather than to a controller. In practice, the work is partitioned into concerns that must be able to contradict each other, and each concern gets one document. The terminal node states the reader class, so the ending is derived: a participant re-enters after a wait, and a bounded reader returns one typed artifact. A change across ownership travels as an item carrying what was observed, what was expected and the one edit, and the owner's act node is the only one that writes.

To check this, take a running collaboration and remove any one document. Where the others stall, that document was a controller; where they route around it, the composition held. One writer and one tree is not a collaboration, and the constructs here defend against a party that cannot exist there. A single document with a single reader takes none of this, and adding it is ceremony.

A document's terminal node states the reader class, and the class decides what the node yields: a participant's node re-enters after a wait, and a bounded reader's yields one typed artifact. Which class a reader belongs to, and why the rules about turns invert for one of them, is explained in coordination is software. A document whose terminal node states its class makes the inversion legible, while one that leaves it to the reader gets both classes' rules applied at once.

Ownership is what replaces the controller. Scope is claimed by concern rather than by location, because two parties can claim one folder through two claims that never mention each other. A finding that lands on a surface its finder does not own is a real finding and a forbidden edit at the same time, and the two rules are reconciled by kind rather than by restraint. The finder's act node emits an item carrying the surface, the location, what it observed, what it expected and the one change, and the owner makes the change. The finder's set of operations forbids the mutation, and its handoff gate carries the evidence that nothing it applied touched a surface it does not own. The conflict between fixing on sight and leaving another party's scope alone therefore has a structural answer rather than one that depends on care.

The count is an output, and what a document carries is the function that derives it rather than a number. The floor is one party per concern, as described in [a concern is a component](../architecture/SCALE.md#a-concern-is-a-component). The ceiling is the point where a stale claim costs more than one more perspective gains, as described in [the ceiling moves by cost](../architecture/SCALE.md#the-ceiling-moves-by-cost).

B1·a two terminal nodes

```pag
# the reader class is derived from what a document receives · its terminal node says which

# NODE 10 — TERMINATE   [evaluative · termination · set-theory · yields: ter-stop boolean]
# a participant · receives what it owns and what is addressed to it, and never returns
CONTRACT:
input:        <items addressed to me> + <open units of my own concern>
transform:    handle what is addressed to me -> perform my own clear work -> WAIT on the shared surface -> re-enter
constraints:  ter-stop is the developer's call; a quiet wait is a fact about the peers, never about the queue
output:       nothing terminal · the loop re-enters at NODE 1
handoff:      <changed> -> NODE 1 ORIENT (read the surface whole, then act) | <quiet> -> my own work, then WAIT again

# NODE 10 — TERMINATE   [evaluative · termination · set-theory · yields: ter-stop boolean]
# a bounded reader · receives a task and nothing shared, and returns exactly once
CONTRACT:
input:        <the task it received>
transform:    evaluate saturation AND completion AND verification -> emit one typed artifact
constraints:  no shared surface is read, so no surface rule binds; an unresolved question is a finding with what would settle it, never a held turn
output:       one typed artifact | a blocked report naming what would settle it
handoff:      TERMINATE
```

B1·b change across ownership

```pag
# a finding on a surface I do not own becomes an item, never an edit · the op-set forbids it, not restraint

FUNCTION emit_repair(finding):
IF owner_of(finding.surface) == <me>: RETURN {route: "act", change: finding.change}
SET item = {kind: artifact, to: [owner_of(finding.surface)], surface: finding.surface, locus: finding.locus, observed: finding.observed, expected: finding.expected, change: finding.change}
PERSIST_ARTIFACT item TO <the shared surface> AS <me>
RETURN {route: "sent", item: item}

# NODE 6 — ACT   [epistemic · formalisation · computation · yields: procedures]
CONTRACT:
input:        findings
transform:    for each finding -> emit_repair -> apply only what routes to "act"
constraints:  an INVESTIGATE op-set performs no mutation; a mutation on another's surface is a breach whatever its correctness
output:       applied[] + sent[]
handoff:      every finding either applied on my own surface or sent to its owner (yields: boolean)

HANDOFF GATE (evidence-bearing):
rule_id: "ACT"   yields: boolean
[check] no applied change touched a surface I do not own (evidence: applied[].surface)
[check] every sent item names its owner, its locus and the one change (evidence: sent[])
[check] every finding routed exactly once (evidence: applied[] and sent[] partition findings)
result: pass -> NODE 7 | a foreign write -> REPAIR (owner: NODE 6) | unknown -> BLOCKED
```

B1·c party count

```pag
# the party count is an output of the structure, never an input to it

FUNCTION derive_count(work):
ANALYZE_CONTENT work FOR <pairs of surfaces where a change to one forces a change to the other> INTO coupling   # yields: edge-list
EXTRACT_FACTS connected_components FROM coupling INTO concerns                                                 # yields: set
CALCULATE_METRIC floor = count(concerns)                                                                        # one party per concern
ANALYZE_CONTENT claims FOR <how many rest on one surface> INTO fan_in                                          # yields: number
CALCULATE_METRIC ceiling = <the population past which a claim is stale more often than it is useful>
RETURN {concerns: concerns, floor: floor, ceiling: ceiling}
```

B1·d parties over a partition

```mermaid
flowchart TB
work["A body of work"]
concerns["Concerns that must be able to contradict each other"]
parties["One party per concern · each a document, none above the others"]
surfaces["Shared surfaces · what each owns, what is addressed to whom"]
owner["A change to another's surface travels as an item · the owner makes it"]
work --> concerns --> parties --> surfaces --> owner
parties -. nothing here .-> controller["A controller"]
```

## Shared surfaces

When more than one party writes to one tree, the surfaces they share are [shared mutable state](../ontology/PRINCIPLES.md#arch-shared-mutable-state). A document expresses four things about them, the schema, the records, the items and their lifetime, as written in [C1·a surface declared](#shared-surfaces-panel-a) and shown in [C1·d surface to state](#shared-surfaces-panel-d). The definitions and the reasons are given in [coordination is software](../COLLABORATE.md#coordination-is-software) and in [the board and the venue](../COLLABORATE.md#the-board-and-the-venue); this section declares the shape. [C1·b state as function](#shared-surfaces-panel-b) shows how a state is read and a write is fenced, [C1·e a write lands](#shared-surfaces-panel-e) shows where a write lands or is refused, and [C1·c lifetime axes](#shared-surfaces-panel-c) shows the declaration a mechanism reads.

### Records, items, derived states

A shared document with no declared writer per span is one that every party rewrites whole. Two parties revise their own records by rewriting the file, each correctly, and the second write is a [lost update](../ontology/PRINCIPLES.md#arch-lost-update) for the first party, with no error anywhere. A file offers no span a party can anchor on unless the document declares one, so the only edit available is the whole file.

For this reason a shared surface holds records with one writer each, and every state is a query over those records. The surface is declared as a schema a tool can refuse against, rather than described in prose the parties have to keep in mind. In practice, a shared surface is declared as a schema: its key in the header, one record per writer with the writer named on the record, and a fence around each record so that an edit has a span to anchor on. An item is declared with an id the surface allocates, a kind that selects its closure, and the readers it is addressed to. Open, blocked and absorbed are derived by a function over the edges, an absorbed item's durable half is extracted and the item deleted in the same change, and each surface's lifetime is declared on retention, mutability and removal.

To check this, take the last write to a shared surface and name the span it was anchored on. A write with no span was a whole-file write, and the neighbour it overwrote is the finding. An outcome surface written jointly has no per-party unit for the one-writer rule to range over, so the invariant is declared inapplicable there, with its reason. A clash of meaning on such a surface is caught by announcing the intended write, with each author removing its own duplicate.

The document states the one writer per record on the record itself. The act node that writes carries the mechanism as its contract: a witness read, an anchor on its own fence, and a refusal when the surface has moved. An edit against a moved surface is therefore refused with the diff, and a whole-file write is never the available path.

The document writes no state. Every state is a function over the edges, declared once and evaluated on every read, as described in [derived state](../VERIFY.md#derived-state), and an item whose citation resolves is extracted and deleted in the same change rather than left resting in a state.

A lifetime is declared on the three axes derived in [stating an invariant](../COLLABORATE.md#stating-an-invariant), each drawn from a closed set, so the declaration is a value a mechanism can join on rather than a sentence. A mechanism decides what it may do to a surface from that declaration, never from the shape of the surface's path.

C1·a surface declared

```pag
# the four things a document declares about a shared surface · a structure declaration, never prose
SURFACE <key>:                                   # declared in the header, never derived from the path
RECORD <key>-1 subject: <what it is about>   # one writer, named on the record · the fence an edit anchors on
ITEM <key>-1-1 TO <reader>: <a claim>    # an addressed span · its id allocated once, never reused
SATISFIED_BY <artifact>              # an edge · an id in a field · resolves or does not
BLOCKS <key>-2-1
RECORD <key>-2 subject: <what it is about>
ITEM <key>-2-1 TO <reader>: <a claim>
ANSWERS <key>-1-1

# the states are derived from the edges, never written
state: OPEN | BLOCKED | ABSORBED

# the lifetime, declared on three axes a mechanism can join on
DECLARE lifetime: object
SET lifetime = {retention: <what ends a piece of content>, mutability: <who may rewrite a landed statement>, removal: <who may take content out>}
```

C1·b state as function

```pag
# no party writes a state · every state is a function over the edges, evaluated on every read
FUNCTION state_of(item):
IF resolves(item.edges.satisfied_by): RETURN <absorbed>       # a transition · extract, then delete in the same change
FOR EACH edge IN inbound(item, <blocks>):
IF state_of(edge.from) == <open>: RETURN <blocked>
RETURN <open>

# NODE 6 — ACT   [epistemic · formalisation · computation · yields: procedures]
CONTRACT:
input:        <my record> + <the surface as it stands>
transform:    read the surface whole -> anchor on my own fence -> land the edit inside it
constraints:  a write to a path not read this turn is an edit to unknown contents; a whole-file write reports success to the one who overwrote and nothing to the one overwritten
output:       <my record, revised>
handoff:      the edit landed inside my fence and the surface had not moved, or the edit was refused with the diff (yields: boolean)

HANDOFF GATE (evidence-bearing):
rule_id: "ACT"   yields: boolean
[check] nothing outside my fence changed (evidence: the diff of the surface) over: the surface's records measured: <untouched> / <records>
[check] the surface was read whole immediately before the write (evidence: the witness read)
[check] a moved surface refused the write, or the write commuted and replayed (evidence: the compare against my own span)
refuse: the surface moved inside my span since the witness read before PERSIST_ARTIFACT
standing: moved-set <the records that moved outside my span>
result: pass -> NODE 7 | a write outside my fence -> REPAIR (owner: NODE 6) | unknown -> BLOCKED
```

C1·c lifetime axes

```pag
# a lifetime is three independent axes · one word for it drops the axis a reader assumes follows
DECLARE lifetimes: array
SET lifetimes = [
{surface: <a coordination surface>, retention: <current-truth>,  mutability: <owner-rewritable>, removal: <the handler of an item>},
{surface: <an argument>,            retention: <accumulating>,   mutability: <append-only>,      removal: <none while open · moved whole when settled>},
{surface: <an archive>,             retention: <accumulating>,   mutability: <frozen>,           removal: <none>}
]

FUNCTION may_remove(party, content, surface):
# decided from the declaration, never from the shape of the path
SET lifetime = lifetimes[surface]
RETURN lifetime.removal == party.role_on(content)
```

C1·d surface to state

```mermaid
flowchart TB
surface["A surface · a file the parties read and write"]
r1["Record · one writer, declared on the record"]
r2["Record · one writer"]
item["Item · an allocated id, a kind, its readers"]
ref["An edge · an id in a field · resolves or does not"]
state["State · a function over the edges, written by no party"]
surface --> r1
surface --> r2
r1 --> item --> ref --> state
```

C1·e a write lands

```mermaid
flowchart TB
intent["A party intends a write"]
read["Read the surface whole"]
span["Anchor on its own fence"]
moved{"Surface moved since the read?"}
land["Land inside the span"]
overlap{"Overlap with its own span?"}
replay["Replay · the writes commute"]
refuse["Refuse · with the diff of the span"]
intent --> read --> span --> moved
moved -- no --> land
moved -- yes --> overlap
overlap -- no --> replay --> land
overlap -- yes --> refuse
```

## Phase binding

This section covers how a run is bound to one of two kinds before it touches anything, as derived in [agents as executed contracts](../COLLABORATE.md#agents-as-executed-contracts) and shown in [D1·d two kinds](#phase-binding-panel-d). The orient node binds the kind, as written in [D1·a binding the kind](#phase-binding-panel-a), and the constrain node asks afterwards whether the binding held, as written in [D1·b admissibility](#phase-binding-panel-b). [D1·c the cycle](#phase-binding-panel-c) and [D1·e cycle, not line](#phase-binding-panel-e) show the shape the two kinds make together.

### Investigate or act

A run asked to look starts repairing what it sees. A run finds a defect, repairs it in passing, and reports the defect as open, so the next run repairs it again against a tree where it no longer exists. A finding is a claim about a tree, and a tree the finder also mutated is a different tree from the one the finding describes.

For this reason a run either investigates or acts, and the operations allowed to each have nothing in common. The kind is bound in the orient node before any operation, rather than declared in prose in the hope that the operations stay within it. In practice, every run is bound to one kind in its orient node, and the operations it permits and forbids are derived from that kind rather than listed by hand. An investigation discovers, reads, searches and analyzes, and it persists exactly one report. An action reads the report, repairs each gap in dependency order, and logs what changed. The constrain node then checks, once the operations exist, that each stayed inside its set, and a breach is routed to the node that owns the fix.

To check this, list the operations of a run and mark each as reading or writing. A run that has both kinds is unbound, and its first write is where it splits. A single-party task with one read and one write is one action run, and splitting it into an investigation and an action doubles the document for nothing. The binding matters where the findings will be read by a party that did not produce them.

The binding is a property of the run, declared in its orient node before any operation, and the permitted operations follow from it, which is [state isolation](../ontology/PRINCIPLES.md#arch-state-isolation) applied to a run. An investigation may discover, read, search and analyze resources, and it may persist one artifact, its report. It may not edit, write anywhere else, or run a command that changes the tree, and that includes the [verification](../ontology/PRINCIPLES.md#arch-verification) chain, because the chain's early stages rewrite the tree. An action may persist, execute and fix, but it may not widen its scope, because scope discovered in the middle of an action is a finding that was never reported and will never be verified. The same binding is taught in agents as executed contracts; here it is the contract of one node.

The shape that follows is a cycle rather than a line. The work is investigated, then acted on, then investigated again to verify what the action did, and it stops when the second investigation finds every gap either resolved or carried forward with a reason. Each investigation reads the same report and removes what is settled, so the report converges rather than growing. A fixed pipeline of positions cannot express this, because it has no edge back, and the edge back is where a repair that missed is caught.

A run declared as an investigation can still contain a write that went unnoticed, and a check that reads only the declaration passes it. So the constrain node checks the observations against the operations the binding allowed, and a breach is routed to the node that owns the fix rather than repaired in place, because a repair made in place is the same breach, committed by the node that found it.

D1·a binding the kind

```pag
# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: run-context]
@purpose: "Bind the run to exactly one phase kind before touching anything, so the op-set is a contract rather than restraint"
@cue: "DISCLOSE_THEN_BIND"

CONTRACT:
input:        <the invocation>
transform:    detect the phase kind -> bind its allowed and forbidden operations -> bind the one artifact it emits
constraints:  INVESTIGATE and ACTION are mutually exclusive; the checks that heal rewrite the tree, so they belong to ACTION
output:       run_context { phase, allowed_ops, forbidden_ops, artifact }
handoff:      phase bound to exactly one AND the two op-sets disjoint (yields: boolean)

FUNCTION bind_phase(invocation):
DETERMINE kind FROM invocation   # INVESTIGATE | ACTION
IF kind == "INVESTIGATE":
RETURN {phase: "INVESTIGATE", allowed_ops: [DISCOVER_RESOURCES, READ_RESOURCE, SEARCH_CONTENT, ANALYZE_CONTENT], forbidden_ops: [<mutation>, <gap fixing>], artifact: <investigation report>}
IF kind == "ACTION":
RETURN {phase: "ACTION", allowed_ops: [<bounded fix>, PERSIST_ARTIFACT, EXECUTE_TOOL], forbidden_ops: [<gap discovery>], artifact: <action log>}

HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] phase bound to exactly one of INVESTIGATE | ACTION (evidence: run_context.phase)
[check] allowed and forbidden op-sets are disjoint (evidence: run_context.allowed_ops, forbidden_ops)
[check] the artifact the phase emits is the one its kind emits (evidence: run_context.artifact)
result: pass -> NODE 2 | undetectable kind -> REPAIR (owner: NODE 1) | unknown -> BLOCKED
```

D1·b admissibility

```pag
# NODE 7 — CONSTRAIN   [conative · teleology · optimisation · yields: admissibility boolean]
@purpose: "Ask after the operations exist whether they stayed inside the bound op-set · a declaration is not evidence that it held"
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
input:        observations + run_context
transform:    for each observation -> did it mutate under INVESTIGATE, did it discover under ACTION
constraints:  a breach routes to the node that owns the fix, never a repair in place, because repairing in place is the same breach in the node that found it
output:       admissibility { ok, op_violations[] }
handoff:      GATE — op-sets honoured (yields: boolean)

FUNCTION assess_admissibility(observations, run_context):
DECLARE op_violations: array
SET op_violations = []
FOR EACH o IN observations:
IF run_context.phase == "INVESTIGATE" AND o CAUSED <mutation>: APPEND {claim: o.claim, violation: "mutation under INVESTIGATE"} TO op_violations
IF run_context.phase == "ACTION" AND o DISCOVERED <new scope>: APPEND {claim: o.claim, violation: "discovery under ACTION"} TO op_violations
RETURN {ok: op_violations.length == 0, op_violations: op_violations}

HANDOFF GATE (teleology admissibility gate):
rule_id: "CONSTRAIN"   yields: boolean
[check] admissibility.op_violations.length == 0 (evidence: INVESTIGATE no mutation / ACTION no discovery)
[check] every observation was classified against the phase (evidence: one verdict per observation) over: observations measured: <classified> / <observations>
[check] every breach names the node that owns the fix (evidence: op_violations[].owner)
result: pass -> NODE 8 | a breach -> REPAIR (owner: NODE 6) | unknown -> BLOCKED
```

D1·c the cycle

```pag
# the shape that follows is a cycle rather than a line · the edge back is where a missed repair is caught
INVESTIGATE  -> <a report of evidence · every claim verified, contradicted or unverified>
ACTION       -> <a log of bounded changes against that report · nothing discovered>
INVESTIGATE  -> <the same report, with what is settled removed>
STOP when    <every gap is resolved or carried forward with a reason>
```

D1·d two kinds

```mermaid
flowchart TB
phase["A run"]
kind{"Bound to which?"}
inv["INVESTIGATE · discovers, never fixes · emits a report"]
act["ACTION · fixes against known evidence, never discovers · emits a log"]
mixed["Both · mutated under a read-only contract, findings describe a tree that moved"]
phase --> kind
kind -- one --> inv
kind -- the other --> act
kind -. neither, or both .-> mixed
```

D1·e cycle, not line

```mermaid
flowchart LR
i1["Investigate"]
a1["Act"]
i2["Investigate · verify"]
stop["Stop · every gap resolved or carried with a reason"]
i1 --> a1 --> i2
i2 -- gaps remain --> a1
i2 -- none --> stop
```

## Handoff signals

A handoff is an item addressed to the parties that need it, with an allocated id, a declared kind and a closure the kind selects, as written in [E1·a an item](#handoff-signals-panel-a) and shown in [E1·d kind selects closure](#handoff-signals-panel-d). An artifact item asks for something that can exist, and it closes when a typed reference to that thing resolves. A judgement item asks for a reading, and it closes when its acknowledger marks it; [E1·c closing an item](#handoff-signals-panel-c) shows the closure in either case. A failure is a finding rather than a halt, and it follows the route shown in [E1·b failure routes](#handoff-signals-panel-b) and [E1·e failure to finding](#handoff-signals-panel-e). A report goes to the parties whose next work it creates, never to the developer as a closing summary.

### Typed items, falsifiable closures

A handoff closed by the party that wrote it closes whether or not the work exists. A party declares an item handled, nothing points at the thing it asked for, the item is removed, and the work it named was never done. A closure that a reference decides can be checked by any party, while a closure that a party declares can be checked only by that party.

For this reason a handoff is a typed item whose closure can be checked by a party other than its author. The kind decides the closure, either a reference that has to resolve or an acknowledger named on the item, rather than the author's word that the work is done. In practice, a handoff is posted as an item with an id the surface allocates, a kind, the parties it is addressed to, and a body carrying the finding's surface, location, and observed and expected values. An artifact item closes through a reference that has to resolve and stay true while the work is done, and a judgement item closes through its acknowledger. A failure is routed by what it binds: a decision goes to the party whose surface it binds, a question about the purpose of the work goes to the developer with a recommendation first, and everything else goes to the next open item.

To check this, name for each closed item the reference that closed it or the party that acknowledged it. An item that its own author closed with no reference was declared done, not shown to be done. The handoff protocol is for parties that share a surface; what a bounded reader does instead is described in [composing a collaboration](ORCHESTRATION.md#composing-a-workflow).

The kind is on the item, and it selects the closure. An artifact item names something that can exist, such as a file, a gate or a record, so it closes with a typed reference that has to resolve. The reference names a condition that can turn out wrong rather than a path, because a path resolves as soon as the file exists, and the item would read as closed while the defect is still open. The reference also moves with the work: it is true when the work is done and false when it is not, so a citation that points at the findings themselves is refused, since a broken tree would satisfy it. A judgement item closes when its declared acknowledger signs it off, with no reference, and why one kind requires an acknowledger and the other forbids one is explained in [the board and the venue](../COLLABORATE.md#the-board-and-the-venue).

A failure travels through the same channel as any other item and is routed along the same three paths, as derived in [a turn never ends to wait](../COLLABORATE.md#a-turn-never-ends-to-wait). A gate's result line is the same routing in miniature, with a third arm that the item channel also needs. An unknown, meaning a claim the run could not measure, is blocked rather than passed, and blocked is a state that names the party who owes the answer. The commit node carries the rule that a report goes to the parties whose next work it creates.

The handler removes the item by its id, after extraction, as the board and the venue requires. An item whose readers have all gone is re-addressed rather than left, because an item that no party can handle reads as live traffic forever.

E1·a an item

```pag
# an item is a typed span · its kind selects how it closes, and the closure is checked by a party other than its author
DECLARE item: object
SET item = {
id:    <allocated by the surface, never by hand>,
kind:  <artifact | judgement>,
from:  <this party>,
to:    [<the parties that need it>],
body:  {surface: <where>, locus: <what part>, observed: <what was seen>, expected: <what should hold>}
}

FUNCTION closes(item):
# an artifact item asks for something that can exist · it closes when a typed reference resolves
IF item.kind == artifact: RETURN resolves(item.satisfied_by) AND monotone_with_the_work(item.satisfied_by)
# a judgement item asks for a reading · it closes by its declared acknowledger, with nothing to point at
IF item.kind == judgement: RETURN acknowledged_by(item.acknowledger)

FUNCTION may_close(party, item):
RETURN party IN item.to   # a reader, never the author
```

E1·b failure routes

```pag
# a failure is a finding, not a halt · it flows through the same channel and routes by what it binds
FUNCTION route(failure):
SET finding = {surface: failure.surface, locus: failure.locus, observed: failure.observed, expected: failure.expected}
IF failure.blocks_a_decision:
RETURN SEND finding TO <the party whose surface the decision binds>
IF failure.asks_what_the_work_is_for:
RETURN SEND finding TO <the developer> AS <a question with a recommendation first>
RETURN <the next open item>

# NODE 9 — COMMIT   [evaluative · representation · information-theory · yields: one typed artifact]
CONTRACT:
input:        findings + run_context
transform:    emit exactly one artifact of the kind bound at orientation, deduplicated, naming every limitation
constraints:  a report goes to the parties whose next work it creates, never to the developer as a closing summary
output:       committed { artifact_type, output }
handoff:      one typed artifact emitted (yields: hash + boolean)

HANDOFF GATE (evidence-bearing):
rule_id: "COMMIT"   yields: hash + boolean
[check] exactly one artifact emitted, of the kind bound at orientation (evidence: committed.artifact_type)
[check] every finding addressed to a party that needs it (evidence: findings[].to) over: findings measured: <addressed> / <findings>
[check] no finding recorded twice (evidence: dedup)
refuse: the artifact's destination changed since it was read before PERSIST_ARTIFACT
result: pass -> NODE 10 | duplicate or unaddressed -> REPAIR (owner: NODE 9) | unknown -> BLOCKED
```

E1·c closing an item

```pag
# closing an item · the handler removes it, never the author, and extraction comes first
WHEN <party> handles <item>:
VALIDATE <party> IN <item>.<to>
VALIDATE closes(<item>)
EXTRACT_FACTS <item>.<durable half> INTO <the one home history has>
PERSIST_ARTIFACT <the extraction> TO <that home>
REMOVE <item> BY <item>.<id>       # the span, never a matched line
```

E1·d kind selects closure

```mermaid
flowchart TB
posted["An item is posted · id allocated, kind set, readers named"]
kind{"Which kind?"}
artifact["Artifact · closes when its reference resolves"]
judgement["Judgement · closes when its acknowledger marks it"]
handler["Removed by a party in its reader set · never its author"]
extract["Its durable half extracted first"]
posted --> kind
kind -- artifact --> artifact --> handler
kind -- judgement --> judgement --> handler
handler --> extract
```

E1·e failure to finding

```mermaid
flowchart LR
fails["A gate fails"]
finding["A finding · surface, locus, observed, expected"]
binds{"What does it bind?"}
owner["The party whose surface the decision binds"]
person["The developer · what the work is for, a recommendation first"]
next["The next open item"]
fails --> finding --> binds
binds -- a decision --> owner
binds -- the purpose --> person
binds -- nothing --> next
```

## Orchestration invariants

A collaboration relies on invariants, and what each invariant has to carry is described in [stating an invariant](../COLLABORATE.md#stating-an-invariant): the property in a form that could be false, the set it ranges over, the parties it binds, and the objector that would disagree if it stopped holding. [F1·a invariant records](#orchestration-invariants-panel-a) shows the records, [F1·b gate cites records](#orchestration-invariants-panel-b) shows a gate pointing at them, and [F1·c three homes](#orchestration-invariants-panel-c) shows where each record is read.

### Declared once, cited thrice

An invariant restated in every document that needs it becomes a set of copies that drift. A document's closing lines, a role and a check each carry their own wording of one rule, one of them is edited, and the other two keep binding the old rule. A restatement is a copy, and a copy carries no edge back to the statement it copied; a bullet is a restatement with even the statement's slots dropped.

For this reason an invariant has one statement, and every other mention of it is a pointer to that statement. Each invariant is declared once as a record with four slots and pointed at from every place that needs it, rather than restated wherever a party reads it. In practice, every invariant a collaboration relies on is declared as a record with four slots, and where nothing in any artifact would disagree, the objector is written as none, so the debt is declared rather than hidden. A gate check cites the record it holds, and a role names the invariants its party protects, as described in [a seat is a contract](../START.md#a-seat-is-a-contract). A block is never headed with a bare modifier and a list of bullets, because a bullet carries no set, no parties and no objector, which is why the scan refuses it.

To check this, name for each gate check and role entry the invariant record it points at. A line that points at nothing is a copy, and the record it should point at is the finding. A record whose objector is none is the debt described in [a tension has a mechanism](../architecture/PRINCIPLES.md#a-tension-has-a-mechanism), for a rule with no check. The number of invariants grows with the number of parties and [shared surfaces](ORCHESTRATION.md#shared-surfaces).

One statement has three homes that point at it. A document's invariant block holds the records, a role lists by name the invariants its party protects, and a gate check holds the half that an artifact can observe; where the objector is none, that check is the only watcher, and it says so. An invariant has to reach every party that needs it, and pointing is how it reaches them without a copy that can disagree, so the record is the unit that is derived again whenever the invariant changes.

F1·a invariant records

```pag
# CROSS-NODE INVARIANTS  (each a record with four slots · a property nothing would object to declares its objector as none)
INVARIANT one-writer-per-record: a record is written only by the party named on it over: every record on every shared surface binds: every party that writes a surface objector: [check] the anchored edit refuses a write outside the caller's span
INVARIANT no-written-state: no party writes a status marker over: every item on the coordination surface binds: every party objector: [check] a scan for markers on every run
INVARIANT handler-removes: an item is removed by a party in its reader set over: every closed item binds: every party objector: none

# the scan reads the four slots and refuses a record missing one
[check] every invariant names its set, its parties and its objector (evidence: the defect scan) over: <invariants> measured: <complete> / <invariants>
```

F1·b gate cites records

```pag
# a node's gate cites the invariant it holds rather than restating it
HANDOFF GATE:
[check] the write landed inside the caller's span (evidence: the anchored edit's report)     # <one-writer-per-record>
[check] no marker written (evidence: the marker scan)                                          # <no-written-state>
[check] the removed item named this party in its reader set (evidence: the item's fence)     # <handler-removes> · objector none, so this check is the only watcher
result: pass -> NODE 4 | span breached -> REPAIR (owner: NODE 3) | unknown -> BLOCKED
```

F1·c three homes

```mermaid
flowchart LR
stated["One record per invariant · property, set, parties, objector"]
closing["The document's invariant block · holds it"]
role["The role · the invariants this party protects, by name"]
check["A gate check · the half an artifact can observe"]
closing --> stated
role --> stated
check --> stated
```

---

Chapters: [Introduction](INTRODUCTION.md) · [Guide](GUIDE.md) · [Orchestration](ORCHESTRATION.md) · [Patterns](PATTERNS.md) · [Keywords](KEYWORDS.md) · [Grammar](GRAMMAR.md) · [Validation](VALIDATION.md) · [Templates](TEMPLATES.md)
