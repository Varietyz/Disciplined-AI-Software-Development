© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Scale — Architecture — Bane's Lab

> This section covers how work is partitioned into concerns and how many parties it needs. The partition is derived rather than drawn, as shown in floor and…

Canonical: https://banes-lab.com/software-architecture/scale

# Software Architecture

A system as a graph, principles as typed records, and the predicate set that makes an architecture real when a model writes the code.

# Scale

## A concern is a component

This section covers how work is partitioned into concerns and how many parties it needs. The partition is derived rather than drawn, as shown in [A1·a floor and ceiling](#a-concern-is-a-component-panel-a), one body of work is walked in [A1·b three components](#a-concern-is-a-component-panel-b), and the records the derivation reads are typed in [A1·c the derivation's records](#a-concern-is-a-component-panel-c). The practice for a body of work is described in [scale follows from structure](../SHIP.md#scale-follows-from-structure) on the methodology page.

### Partition, floor, ceiling

Concerns are drawn as areas of a work list, so a seat owns a region rather than a component, and every coupled edit crosses two seats. Two seats each own half of one coupled pair of surfaces, every change one makes forces a change in the other's, and the surface between them fills with items about the same edit from both sides. A concern drawn as an area of a task list follows how the list was written, and a list is written by one developer on one day, so its areas cut across the couplings that actually force changes.

For this reason a concern is a connected component of the relation that joins two surfaces when a change to one forces a change to the other. The work is cut along what forces what rather than along what the work list happened to group. In practice, the surfaces a body of work touches are enumerated, and the pairs that force each other are recorded with evidence, where a change to one cannot land without a change to the other. The connected components of that relation are the concerns, each gets one owner, and the number of components is the floor. The fan-in on each [shared surface](../pag/ORCHESTRATION.md#shared-surfaces) is measured from the claims already recorded against it, and the worst fan-in sets the ceiling. A count is chosen inside that range, and the partition is written down beside the choice.

To check this, take any two concerns and find one change that forces edits in both. If one exists, the partition put a forcing edge across a boundary, and the two concerns are one component. The relation is chosen once, and that choice is the one place judgement enters. Two defensible readings of what forces what yield component counts far apart, so the claim is a derivation with a choice at the bottom. The choice is answerable to evidence, and where no mechanism yet computes the partition or the fan-in, that absence is written down as debt with its operands rather than left to read as a measurement.

### A concern is a bounded context for people

A concern is a [bounded context](../ontology/PRINCIPLES.md#arch-bounded-context) drawn for people rather than for models, and [context mapping](../ontology/PRINCIPLES.md#arch-context-mapping) is the activity that draws it. A concern is a component of the forcing relation for the same reason a bounded context is a region of one model, because inside it one party can be authoritative, and across its edge two parties have to be able to disagree. [Separation of concerns](../ontology/PRINCIPLES.md#arch-separation-of-concerns) at the scale of seats is the same principle as at the scale of files, and it is derived the same way, from what forces what.

Volume is the wrong operand for the floor. Quantity divides across parties and argues for a longer schedule, never a wider one. What forces a second party is indivisibility, a concern that has to be able to contradict another while both stay authoritative, and the floor counts those. [Partitioning](../ontology/PRINCIPLES.md#arch-partitioning) by volume is [horizontal scaling](../ontology/PRINCIPLES.md#arch-horizontal-scaling) of people, and it buys [throughput](../ontology/PRINCIPLES.md#arch-throughput) where the concerns are already separate and nothing where they are not.

### Fan-in, measured

The ceiling is set by fan-in rather than by the count, because a surface with one writer cannot have its volatility raised by adding a party, and staleness rises only where parties converge on one subject. Ownership bounds fan-in without defining it, since a formally owned surface that many parties reason about behaves like [shared mutable state](../ontology/PRINCIPLES.md#arch-shared-mutable-state), and the concentration is continuous.

For this reason the ceiling is measured and never declared. A count chosen because it felt right is a bound nothing can disagree with, and so it bounds nothing. Fan-in read from the claims already recorded against each surface is a number a second reader can recompute, and the ceiling follows from the worst of them.

A1·a floor and ceiling

```mermaid
flowchart TB
surfaces["The surfaces a body of work touches"]
relation["Join two surfaces when a change to one forces a change to the other"]
components["The connected components · one per concern"]
floor["Floor · the number of components"]
fanin["Fan-in · how many parties' claims rest on one surface, measured from traffic"]
ceiling["Ceiling · where claims on one surface stop surviving composition"]
count["A count inside the range · with the partition written down"]
surfaces --> relation --> components --> floor --> count
surfaces --> fanin --> ceiling --> count
choice["The one choice · which reading of forces"]
choice -. answerable to evidence, never taste .-> relation
```

A1·b three components

```mermaid
flowchart LR
subgraph one["concern · one seat"]
schema["schema"] --- loader["loader"]
loader --- validator["validator"]
end
subgraph two["concern · one seat"]
view["view"] --- renderer["renderer"]
renderer --- styles["styles"]
end
subgraph three["concern · one seat"]
pipeline["pipeline"] --- reporter["reporter"]
end
shared["shared surface · fan-in from every seat"]
validator -.-> shared
renderer -.-> shared
reporter -.-> shared
```

A1·c the derivation's records

```typescript
export interface Forces {
  readonly from: SurfaceId;
  readonly to: SurfaceId;
  readonly evidence: string;
}

export interface Concern {
  readonly id: ConcernId;
  readonly surfaces: readonly SurfaceId[];
  readonly owner: SeatId | null;
}

export interface Claim {
  readonly author: SeatId;
  readonly cites: readonly SurfaceId[];
  readonly observedAt: Ordinal;
}

export interface Bounds {
  readonly floor: number;
  readonly ceiling: number;
  readonly partition: readonly Concern[];
  readonly derivedBy: "mechanism" | "declared-unbuilt";
}
```

## The ceiling moves by cost

This section covers how the ceiling on parties moves. A reader who takes the bound as fixed reaches for the wrong lever, and the expensive one, because the rate at which a claim goes stale has one writer while its cost has every reader, as shown in [B1·a rate and cost](#the-ceiling-moves-by-cost-panel-a) and plotted in [B1·b the two terms](#the-ceiling-moves-by-cost-panel-b).

### The cost, not the rate

The bound on parties is read as fixed, so the only lever a team reaches for is fewer parties. A team that keeps tripping over stale claims removes a seat, the remaining seats trip at the same rate, and the work that seat owned now has no owner. Staleness looks like a rate problem because it is felt as a rate, but the rate has one writer, and what actually grows with the population is how many parties pay for each stale claim.

For this reason the ceiling on fan-in moves with the cost of a stale claim, not with the rate at which claims go stale. The ceiling is raised by cutting what a stale claim costs, never by cutting who reads it. In practice, the two terms are separated before the headcount is touched. The rate is left alone, because one writer and one composer set it and no number of readers changes it. The cost is attacked instead, by marking every claim with the state of the surface it rested on when it was written, so a claim whose surface has since moved costs its readers a glance where an unmarked one costs every party a read and a reply. The fan-in is measured again after the marker is in place, and the ceiling rises only by what the measurement shows.

To check this, take any stale claim and count who read it and who answered it. If the count is the population, the cost is the term to attack, and if the claim went stale faster than one writer could produce it, you have found a second writer. Two limits apply. Added parties never answer a claim that something is absent, because they produce agreement rather than coverage, and only a refusal that publishes its criterion turns an unanswerable absence into an ordinary read. The bound also does not move where the cost of a stale claim is dominated by the work already built on it, because no marker makes that work cheaper to redo.

### The marker

A mechanism that records when a claim's cited surface was observed reduces no staleness, only what staleness costs, so it raises the ceiling without touching the partition.

The marker is a [correlation id](../ontology/PRINCIPLES.md#arch-correlation-id) for reasoning, because it joins a claim to the state it was made against, the way a correlation id joins a log line to the request that produced it. [Causal consistency](../ontology/PRINCIPLES.md#arch-causal-consistency) is the property it buys, since a reader can tell whether a claim happened before or after the surface it rests on moved, without a clock and without asking.

### What the lever leaves alone

The lever changes one thing. The partition stays what the forcing relation derived, the seats stay what the floor demanded, and what changes is how expensive it is for the parties to be wrong about each other for a moment.

[Eventual consistency](../ontology/PRINCIPLES.md#arch-eventual-consistency) between parties is the state the marker makes affordable. Each party holds a view that may lag, and the lag is visible rather than argued. Consensus is the expensive alternative, every party agreeing before any proceeds, and it is the right mechanism only where a stale claim costs more than a halt.

B1·a rate and cost

```mermaid
flowchart LR
rate["The rate a claim goes stale · set by one writer and one composer"]
cost["The cost of a stale claim · multiplied by every reader"]
marker["A claim marked with the surface state it rested on"]
glance["A glance instead of an argument"]
ceiling["The ceiling rises"]
rate -. unchanged by headcount .-> ceiling
cost --> marker --> glance --> ceiling
```

B1·b the two terms

```mermaid
xychart-beta
title "A stale claim: the rate has one writer, the cost has every reader"
x-axis "parties" [1, 2, 3, 4, 5, 6, 7, 8]
y-axis "cost of one stale claim" 0 --> 16
line "unmarked claim · argued by every reader" [1, 2, 4, 6, 8, 10, 12, 14]
line "marked claim · a glance per reader" [1, 1, 2, 2, 3, 3, 4, 4]
line "rate of going stale · one writer" [1, 1, 1, 1, 1, 1, 1, 1]
```

## Above one tier, reduction

This section covers what happens above one tier, where a flat surface becomes the accumulation and the shape that survives is a tree, as shown in [C1·a reduction](#above-one-tier-reduction-panel-a).

### Fused results up, scope down

Flat fan-in grows without bound, and the growth is read as a discipline problem when it is the structure doing exactly what it was built to do. An orchestrator forwards its workers' raw records upward, the composer reads everything every worker wrote, and the surface that was supposed to bound reading has become the unbounded thing it replaced. Fan-in without reduction passes every record to every reader, so the volume a party has to read grows with the population, and that growth is the accumulation everyone then tries to drain by care.

For this reason, above one tier, scale is reduction, with fused results going up, scope coming down, and every record keeping one writer. The fused result is published rather than the raw records, at every tier. In practice, the surfaces are arranged as a tree once one tier is not enough. A parent hands scope down and publishes only the fused result of its children upward, and every record keeps its one writer at every depth, so identity and reduction hold unchanged whether the tree is two levels or ten. Each reduction is derivable and checkable, so a fusion that silently drops a live item fails exactly as a dropped record does. Where the reduction step is unbuilt, it is declared so, rather than letting a design read as if it had been measured at a headcount it never reached.

To check this, take any surface above the first tier and ask what it publishes upward. If it forwards raw records, it is accumulating by construction, and no drain rule will keep up with it. Reduction changes what is published upward and never who may write. A parent that rewrites a child's record has taken a second writer's seat, and a child that reads the global view has bypassed the bound that made its reading finite. The tree holds only while both stay on their side.

### Fan-in taken seriously

Reduction is [fan-out/fan-in](../ontology/PRINCIPLES.md#arch-fan-out-fan-in) with the fan-in half taken seriously. Fan-out is cheap, because scope handed down divides. Fan-in is where every distributed design pays, because results handed up add, and the only way to keep the sum bounded is to reduce at each tier. [Orchestration](../ontology/PRINCIPLES.md#arch-orchestration) is the shape of one tier, a coordinating owner that hands scope down and publishes one fused result up, and [choreography](../ontology/PRINCIPLES.md#arch-choreography) is the shape between peers who share no parent.

Branching is fractal, running from workers into an orchestrator, into another orchestrator and into a composer. Every record keeps its one writer, and a reduced tier is published by one writer, so identity and reduction hold unchanged at any depth. A [message chain](../ontology/PRINCIPLES.md#arch-message-chain), one party relaying another's raw record to a third, is the anti-pattern that appears the moment a tier forwards rather than reduces.

### Checkable, and honestly unmeasured

A reduction is derived and checkable, and a fusion that silently drops one live item beneath it fails exactly as a dropped record does. [Missing backpressure](../ontology/PRINCIPLES.md#arch-missing-backpressure) is the same defect at a queue, where a tier that accepts more than it reduces accumulates, and the accumulation is the design working as built.

The reduction step itself is declared unbuilt and unmeasured at any headcount, and saying so is what stops the design reading as though it had been measured. A design that claims [scalability](../ontology/PRINCIPLES.md#arch-scalability) it has not measured makes, in prose, the unevidenced claim the coverage tab refuses.

C1·a reduction

```mermaid
flowchart TB
w1["worker"] --> o1["orchestrator · publishes the fused result of its workers"]
w2["worker"] --> o1
w3["worker"] --> o2["orchestrator"]
w4["worker"] --> o2
o1 --> composer["composer · one writer, one reduction"]
o2 --> composer
raw["Raw records passed upward · fan-in without reduction, accumulation by construction"]
o1 -. never .-> raw
```

## The author is probabilistic

This section covers what architecture means when a model writes the code, as shown in [D1·a three authors](#the-author-is-probabilistic-panel-a), and the finding that reaches the model, typed in [D1·b a finding record](#the-author-is-probabilistic-panel-b). The same three parties are derived from the tooling's side in [who does what](../START.md#who-does-what) on the methodology page.

### Every principle becomes a gate

AI-driven development scales code production and leaves architecture where it was, held by intentions the model does not keep. An edit is judged clean by the model's own read of it, the check that would have disagreed never ran, and the design principle the edit violates is still the first paragraph of the document the model was given. A model's adherence to an instruction is a distribution rather than a commitment, so an architecture that rests on adherence is a bet placed on every change.

For this reason the architecture is the set of predicates the gate holds, and design is choosing them. Design is spent on choosing predicates rather than on explaining intentions to the model. In practice, the seven controls are installed as checks before the model writes anything, and every architectural intent is treated as unenforced until its predicate runs in the chain. The model's authority is bounded, so every model-produced artifact is validated at the boundary it crosses and raw model output never reaches a trusted sink. The model is directed with findings rather than principles, in [the loop](../START.md#the-loop) described in [detect, log, fix](../BUILD.md#detect-log-fix) on the methodology page.

To check this, delete the design document from the session and run the gate. Whatever the gate refuses is the architecture that exists. Whatever it accepts that the document forbade was never architecture, and the model has been writing it since the first session. The model is not the reviewer and the gate is not the designer. A gate decides whether a predicate holds and nothing about whether the predicate was worth stating. That decision stays with the developer, and a system whose predicates were chosen by the model has let the author grade its own work.

### Who does what

The division of labour follows from the author being a model. The tooling detects because detection is deterministic and a model's account of its own work is not. The model is asked to remediate because a finding is a task it is likely to perform consistently. The developer governs because choosing the predicates and deciding the tensions is not computed.

The arrangement is [policy enforcement](../ontology/PRINCIPLES.md#arch-policy-enforcement), with the policy held as code and the enforcement held by a gate, and it is the only arrangement in which an [agentic architecture](../ontology/PRINCIPLES.md#arch-agentic-architecture) keeps an architecture at all. [Prompt engineering](../ontology/PRINCIPLES.md#arch-prompt-engineering) can raise the odds that a model honours an intent. It cannot make the intent hold, because a probability is not a predicate.

### A finding is the contract

A finding is machine-actionable for exactly this reason, and its shape is described in detect, log, fix on the methodology page. [Auto-remediation](../ontology/PRINCIPLES.md#arch-auto-remediation) takes the findings with [one correct answer](../VERIFY.md#one-correct-answer), and the rest route to the model with their operands already resolved.

[Ungrounded content](../ontology/PRINCIPLES.md#arch-ungrounded-content) is the failure this shape prevents. A model told a principle is likely to produce a plausible reading of it. A model handed a finding is asked to make the one change the finding names, and the gate that produced the finding is the same gate that checks the change, so the loop closes on evidence rather than on the model's report of itself.

D1·a three authors

```mermaid
flowchart TB
intent["An architectural intent"]
author{"Who writes against it?"}
person["The developer · complies by attention · drifts slowly"]
model["A model · complies probabilistically · produces locally reasonable changes at speed"]
gate["A gate · the only party in the loop that refuses"]
holds["The intent holds by construction"]
decays["The intent decays at the author's speed"]
intent --> author
author -- developer --> person -. eventually .-> decays
author -- model --> model --> decays
model -- every intent as a predicate --> gate --> holds
```

D1·b a finding record

```typescript
export interface Finding<Shape> {
  readonly at: Location;
  readonly mismatch: { readonly expected: Shape; readonly found: Shape };
  readonly remediation: {
    readonly operation: Operation;
    readonly operands: readonly Operand[];
  };
}

export const route = (finding: Finding<unknown>): "heal" | "delegate" =>
  finding.remediation.operands.every((operand) => operand.resolved)
    ? "heal"
    : "delegate";
```

## Scale follows determinism

This section covers how scale relates to [determinism](../ontology/PRINCIPLES.md#arch-determinism), as shown in [E1·a check against care](#scale-follows-determinism-panel-a) and plotted in [E1·b cost per change](#scale-follows-determinism-panel-b), and why a model author is the case where the relation matters most. The same axis is stated for a mechanism in [one correct answer](../VERIFY.md#one-correct-answer) on the methodology page.

### The same verdict for any author

Enforcement that rests on care costs more for every author added, and a model is an author whose output rate makes the multiplication expensive. A review process that worked for two developers is applied to a model that produces a hundred changes a day, and the reviewers become the bottleneck the model was meant to remove. A verdict that depends on who is looking has to be produced once per author, while a verdict that depends only on the tree is produced once, so the cost of care scales with the population and the cost of a check does not.

For this reason a deterministic subject is checkable, healable, predictable and scalable at once, and scale follows from determinism rather than from headcount. Judgement moves out of the check and into the choice of which checks to hold. In practice, the subject that has one correct answer is found for every concern and made the thing a check decides. Authors can then be counted freely, because a deterministic verdict is the same for one author or ten, and the model's non-determinism is confined to the one place it belongs, the choice among admissible changes.

To check this, take any rule you enforce by review and ask whether two reviewers would return the same verdict on the same tree. If not, the subject is not yet deterministic, and every author you add costs another review. Determinism is claimed for the check, never for the author. A model stays a distribution however deterministic the gate around it is, and the gate's job is to make that fact cost nothing rather than to pretend it away.

### Determinism is the axis the others derive from

A deterministic subject has [testability](../ontology/PRINCIPLES.md#arch-testability), [auto-remediation](../ontology/PRINCIPLES.md#arch-auto-remediation) reaches it, and [predictability](../ontology/PRINCIPLES.md#arch-predictability) and [scalability](../ontology/PRINCIPLES.md#arch-scalability) follow without being pursued.

The rest of this page lists the subjects that can be made deterministic, namely what a file is, what a principle requires, which control is absent, which cell is watched and which concern a change forces.

### When a verdict moves

[Flaky test normalization](../ontology/PRINCIPLES.md#arch-flaky-test-normalization) is what a team does when it stops believing this. A check that returns a different verdict on the same tree is treated as noise, the noise is tolerated, and every author learns that red means run it again. The repair is never a [retry pattern](../ontology/PRINCIPLES.md#arch-retry-pattern) around the check. It is finding the non-deterministic subject the check depends on and making it deterministic, or declaring that it cannot be and holding the check.

[Formal verification](../ontology/PRINCIPLES.md#arch-formal-verification) is the far end of the same axis, a subject made deterministic enough that a proof replaces a run, and [static analysis](../ontology/PRINCIPLES.md#arch-static-analysis) is the near end, a shape decided without running anything. Most of an architecture's predicates live at the near end, and that is enough, because a verdict that is the same for any author is what lets the author be a model.

E1·a check against care

```mermaid
flowchart LR
subject["A subject with one correct answer"]
check["A deterministic check · same cost, same verdict, any author"]
authors["One author, ten, a model · enforcement cost stays flat"]
care["A protocol resting on care · cost multiplied by every author"]
subject --> check --> authors
subject -. left to attention .-> care
```

E1·b cost per change

```mermaid
xychart-beta
title "Enforcement cost against the number of authors"
x-axis "authors" [1, 2, 4, 8, 16, 32]
y-axis "cost per change" 0 --> 32
line "a protocol resting on care" [1, 2, 4, 8, 16, 32]
line "a deterministic check" [1, 1, 1, 1, 1, 1]
```

## Systems built around a model

This section covers systems built around a model, which the same canon governs with one extra category whose records sit on the [correctness layer](../ontology/SCHEMA.md#layer-correctness-core). Nothing about a model is special to the canon. The category applies the contracts, schema and security layers to an author whose output is a distribution, and the one thing it adds is the insistence that the distribution be measured before it is trusted, in the four obligations shown in [F1·a one category](#systems-built-around-a-model-panel-a).

### A dependency whose output is a distribution

A model is treated as a component that returns answers, so its output crosses every boundary a deterministic component's would and none of the contracts are applied. A completion is written straight into a trusted store, the store is read as fact by the rest of the system, and the fact was a fluent guess that was never validated because the model was treated as a component rather than as an author. A model's output is a distribution, so every contract that assumes a deterministic component is violated by default where a model stands, and the only repair is to apply the contracts explicitly at the boundary the model's output crosses.

For this reason a model is governed as a dependency whose output is a distribution, by the same canon applied at its boundary. The model is treated as an author rather than a component, so every boundary its output crosses is one the contracts already govern. In practice, a model is versioned, gated and evaluated like any dependency, and measured before it is trusted. What it generates is grounded in retrieved evidence that cites its source rather than in recollection, and the knowledge it reasons over is structured so the output can be explained. Its authority is bounded at every boundary, so its output is validated before it reaches a sink, a raw completion never lands in a trusted store, and every capability it may invoke is declared, so it is discovered rather than reachable by default.

To check this, follow one model output from generation to the first trusted sink and name the validation it crossed. If there is none, the model's authority is unbounded, and the canon has a category for exactly that failure. The category governs a model as a component of a system and says nothing about how a model should be built or trained. A model's internals are a dependency's internals, and the canon's claim stops at the boundary where its output crosses into the system.

### Governed, grounded, structured

[Model governance](../ontology/PRINCIPLES.md#arch-model-governance) and [model evaluation](../ontology/PRINCIPLES.md#arch-model-evaluation) are the canon's records for the first obligation. [Model drift monitoring](../ontology/PRINCIPLES.md#arch-model-drift-monitoring) keeps measuring after the model is trusted, because a distribution that was acceptable at one version is a claim about that version only, and [model version ambiguity](../ontology/PRINCIPLES.md#arch-model-version-ambiguity) is the anti-pattern of a system that cannot say which one answered.

[Retrieval-augmented generation](../ontology/PRINCIPLES.md#arch-retrieval-augmented-generation) is the grounding, with [vector search](../ontology/PRINCIPLES.md#arch-vector-search) as the retrieval and the citation as the ground. [Knowledge graphs](../ontology/PRINCIPLES.md#arch-knowledge-graphs) structure what the system reasons over so that [explainability](../ontology/PRINCIPLES.md#arch-explainability) is a property of the output rather than a hope.

### Bounded

AI safety is the canon's record for the bound. The validation is [input validation](../ontology/PRINCIPLES.md#arch-input-validation), and a capability the model may invoke is a [capability declaration](../ontology/PRINCIPLES.md#arch-capability-declaration). [Least privilege](../ontology/PRINCIPLES.md#arch-least-privilege) and [secure by default](../ontology/PRINCIPLES.md#arch-secure-by-default) are the same two principles they are for any actor, applied to one whose intentions are a distribution.

An [agentic architecture](../ontology/PRINCIPLES.md#arch-agentic-architecture) is [traded against determinism](../ontology/SCHEMA.md#tension-agentic-architecture-determinism), and the operating point is the set of gates described in [the loop](../START.md#the-loop), which is the same answer this whole page gives. AI [prompt sprawl](../ontology/PRINCIPLES.md#arch-prompt-sprawl) is what a system looks like when the gates were never built and the prompts took their place.

F1·a one category

```mermaid
flowchart TB
model["A model in the system"]
governed["versioned, gated, evaluated · like any dependency"]
grounded["generation grounded in retrieved evidence that cites its source"]
structured["knowledge structured so the output can be explained"]
bounded["authority bounded · output validated before any sink, capabilities declared"]
canon["The same canon · contracts, schema and security applied to an author whose output is a distribution"]
model --> governed --> canon
model --> grounded --> canon
model --> structured --> canon
model --> bounded --> canon
```

---

Chapters: [Model](MODEL.md) · [Principles](PRINCIPLES.md) · [Decay](DECAY.md) · [Coverage](COVERAGE.md) · [Scale](SCALE.md) · [Glossary](GLOSSARY.md)
