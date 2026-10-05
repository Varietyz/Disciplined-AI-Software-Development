© 2025 Jay Baleine - Disciplined Methodology · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Decay — Architecture — Bane's Lab

> This section covers how an anti-pattern forms.

Canonical: https://banes-lab.com/software-architecture/decay

# Software Architecture

A system as a graph, principles as typed records, and the predicate set that makes an architecture real when a model writes the code.

# Decay

## An anti-pattern is a decay path

This section covers how an anti-pattern forms. A decay starts as a local shortcut that nothing refused, and it becomes dangerous the moment the shortcut becomes infrastructure, as shown in [A1·a a decay path](#an-anti-pattern-is-a-decay-path-panel-a) and [A1·b the propagation](#an-anti-pattern-is-a-decay-path-panel-b). The canon carries the class as a [contract of its own](../ontology/ALGORITHMS.md#algorithms-architecture-anti-pattern), and every anti-pattern it names is a [kind](../ontology/SCHEMA.md#kind-anti-pattern) a principle may point at and nothing else may.

### An absent control, a reproducible path

Anti-patterns are usually catalogued by how they look, and how they look is the last stage of a process that started with something missing. A module gains a second writer, then a third, each with a good reason, and by the time two of them disagree about its state no reviewer can say which change was the wrong one, because none of them was. A shortcut is cheap where it is taken and expensive where it is depended on, so blaming the first change finds a small thing, and the control whose absence let it through is invisible because absent things do not appear in reviews.

For this reason an anti-pattern is a reproducible decay path caused by the absence of a specific control. The control is repaired rather than the change that revealed it, because the next change will reveal it again. In practice, an anti-pattern is named by the control whose absence causes it, and its decay path is recorded as the sequence of stages that produces it, so it can be reproduced rather than argued about. The record also holds how it presents, which principles it violates, which signals detect it, which repairs reverse it and which gate prevents its return.

To check this, take an anti-pattern you have met and name the control whose presence would have made the first step of its decay path fail. If you cannot name one, you have named the symptom rather than the pattern. A decay path is a class, never an incident. The catalog carries the shape, how it starts, how it presents and what was missing, and never which file or which developer, because a class transfers to a tree with nothing else in common and an incident makes the next project inherit another project's history as law.

### The path

A decay path is recorded as reproduction rather than description, and the [propagation](../ontology/ALGORITHMS.md#algorithms-anti-pattern-propagation-kernel) runs through the same stages every time. A local shortcut lands and nothing refuses it, which is where the missing control is named. The shortcut is repeated under delivery pressure until it is a convention, dependent code forms around it, and the repair is now expensive in proportion to what depends on it.

Recorded that way, the pattern becomes a test. Once the control is installed and the path replayed, the first stage should fail. [Lava flow](../ontology/PRINCIPLES.md#architecture-lava-flow) is what a path looks like once it can no longer be replayed, as code kept because no reader knows what depends on it, and [temporal coupling](../ontology/PRINCIPLES.md#architecture-temporal-coupling) is a path whose stages are hidden in the order things happen to be called.

### The repair

The [repair](../ontology/ALGORITHMS.md#algorithms-anti-pattern-remediation-algebra) follows the same algebra in reverse. The missing control is named, its inverse is introduced, the dependents are migrated off the shortcut, the old shape is verified absent, and its recurrence is gated.

A repair that removes one call site leaves the propagation path open and the pattern returns somewhere else. [Shotgun surgery](../ontology/PRINCIPLES.md#architecture-shotgun-surgery) is the shape of that failed repair, one change spread across many files because the control was never installed, and [divergent change](../ontology/PRINCIPLES.md#architecture-divergent-change) is its mirror, one file changed for many reasons because its concern was never split.

A1·a a decay path

```mermaid
flowchart TB
    control["A control is absent · boundary, contract, ownership, versioning, observability, state isolation, enforcement"]
    step1["A local shortcut lands · nothing refuses it"]
    step2["It is repeated under pressure and becomes convention"]
    step3["Dependent code forms around it · a boundary or contract erodes"]
    presents["Systemic fragility · the anti-pattern, reproducible, named, detectable"]
    repair["The repair · install the inverse control, migrate the dependents, check the absence, gate the recurrence"]
    control --> step1 --> step2 --> step3 --> presents --> repair
```

A1·b the propagation

```mermaid
stateDiagram-v2
    [*] --> Shortcut : a control is absent
    Shortcut --> Repetition : nothing refuses it
    Repetition --> Convention : delivery pressure
    Convention --> Dependency : code forms around it
    Dependency --> Fragility : the boundary erodes
    Fragility --> Repair : the pattern is named
    Repair --> [*] : inverse control installed · dependents migrated · recurrence gated
    Repair --> Shortcut : one call site removed · the path stays open
```

## Seven controls, seven classes

This section covers the seven controls, each of which owns a decay class, as shown in [B1·a seven controls](#seven-controls-seven-classes-panel-a) and typed in [B1·b an anti-pattern record](#seven-controls-seven-classes-panel-b). The seven are a boundary, a contract, an ownership, a [versioning](../ontology/PRINCIPLES.md#architecture-versioning), an [observability](../ontology/PRINCIPLES.md#architecture-observability), a [state isolation](../ontology/PRINCIPLES.md#architecture-state-isolation) and an enforcement, and the [anti-pattern record](../ontology/ALGORITHMS.md#algorithms-architecture-anti-pattern) holds as its invariant that every decay path is caused by the absence of one of them. The same idea generalizes past architecture, since a [taxonomy of smells](../ontology/ALGORITHMS.md#algorithms-smell-taxonomy) groups any bad practice by the control it lacks rather than by how it looks, and a catalog organized that way answers a question a gallery of symptoms cannot, which is what to install.

### Placed by what was missing

A catalog organized by appearance grows without bound and never says what to install. A team keeps a growing list of things that went wrong, each with its own fix, and the next failure fits none of the entries because it was filed by appearance and appears differently this time. A catalog of symptoms grows without bound and teaches recognition, while a catalog of absent controls stays small and teaches repair, because the number of ways to look wrong is unbounded and the number of things that can be missing is not.

For this reason decay is classified by what failed to refuse it, since each decay path starts where one control is absent. A catalog of absences is kept rather than a gallery of symptoms. In practice, every anti-pattern is placed under the one control whose absence lets it start, and the catalog is read as seven classes rather than as a list. When a new pattern appears, the first question is which of the seven was missing, and only then what it looks like, because the answer names the repair.

To check this, take any three anti-patterns you know and name the control each lacks. If two of them lack the same control, they are one class with two faces, and one check covers both. The seven controls classify absence and never presence. A tree that has all seven is not thereby well designed. It is a tree in which the decay classes have something to refuse them, and what it refuses is still decided by the principles the controls hold.

### The seven, each with its class

A missing boundary lets a foreign model leak into yours until the two are one tangled model, which shows as [boundary leakage](../ontology/PRINCIPLES.md#architecture-boundary-leakage), [framework leakage](../ontology/PRINCIPLES.md#architecture-framework-leakage) and the [anemic domain model](../ontology/PRINCIPLES.md#architecture-anemic-domain-model) that follows. A missing contract lets a consumer depend on a behavior that was never promised, an [implicit contract](../ontology/PRINCIPLES.md#architecture-implicit-contract), so the next change breaks it silently. A missing ownership lets two parties write [shared mutable state](../ontology/PRINCIPLES.md#architecture-shared-mutable-state), and the write that lands last wins with no report, which is the [lost update](../ontology/PRINCIPLES.md#architecture-lost-update).

A missing versioning lets an [unversioned breaking change](../ontology/PRINCIPLES.md#architecture-unversioned-breaking-change) ship as an ordinary one, and [schema drift](../ontology/PRINCIPLES.md#architecture-schema-drift) follows. A missing observability lets a system run with [opaque runtime behavior](../ontology/PRINCIPLES.md#architecture-opaque-runtime-behavior), so the first sign of an [unobservable failure](../ontology/PRINCIPLES.md#architecture-unobservable-failure) is a customer reporting it. A missing state isolation lets a [hidden side effect](../ontology/PRINCIPLES.md#architecture-hidden-side-effect) reach across a boundary it should not see, and [action at a distance](../ontology/PRINCIPLES.md#architecture-action-at-a-distance) is its name once the cause can no longer be found. A missing enforcement is [manual-only governance](../ontology/PRINCIPLES.md#architecture-manual-only-governance), a rule the whole team agreed to, decaying at the rate of attention.

### When an entry is real

Two questions decide whether a catalog entry is real. Can the path be replayed from its first stage, so that a reader with a different tree reproduces the decay rather than recognizing the picture? And does the entry name what it violates by identity, so that a finding on the [enforcement layer](../ontology/SCHEMA.md#layer-enforcement-core) resolves to the principle, its severity and the repair in one lookup?

An anti-pattern held as a [typed relationship record](../ontology/ALGORITHMS.md#algorithms-anti-pattern-relationship-record) answers both, and a smell [compiles into a rule](../ontology/ALGORITHMS.md#algorithms-anti-pattern-rule-compiler) only once it does. [Pattern cargo cult](../ontology/PRINCIPLES.md#architecture-pattern-cargo-cult) and the [golden hammer](../ontology/PRINCIPLES.md#architecture-golden-hammer) are what a catalog of appearances produces, which is a shape applied because it was recognized, never because its absent control was named.

### The same classes at a model's speed

For a model-authored codebase the decay classes are the same and the rate is different. A model tends to take a shortcut as readily as a developer under a deadline, and it rarely objects to its own, so a system with an absent control decays at the model's speed rather than a team's.

A control that exists only as a reviewer's habit is absent for every change the reviewer did not see. Installing the seven as checks before the model writes anything is what makes them present for every change rather than for the ones a reviewer happened to read.

B1·a seven controls

```mermaid
flowchart LR
    boundary["boundary absent · a foreign model leaks in"]
    contract["contract absent · a consumer depends on a promise that was never made"]
    ownership["ownership absent · two writers, the last one wins"]
    versioning["versioning absent · a breaking change ships as ordinary"]
    observability["observability absent · the first signal is a customer"]
    isolation["state isolation absent · a side effect crosses a boundary"]
    enforcement["enforcement absent · a rule decays at the rate of attention"]
    decay["One decay class per control · placed by what was missing, never by how it looked"]
    boundary --> decay
    contract --> decay
    ownership --> decay
    versioning --> decay
    observability --> decay
    isolation --> decay
    enforcement --> decay
```

B1·b an anti-pattern record

```typescript
export const CONTROLS = [
  "boundary",
  "contract",
  "ownership",
  "versioning",
  "observability",
  "state-isolation",
  "enforcement",
] as const;
export type Control = (typeof CONTROLS)[number];

export const PROPAGATION = [
  "shortcut",
  "repetition",
  "normalization",
  "dependency-formation",
  "institutionalization",
  "high-cost-repair",
] as const;
export type Stage = (typeof PROPAGATION)[number];

export const REMEDIATION = [
  "missing-control",
  "inverse-control",
  "migration",
  "absence-check",
  "prevention-gate",
] as const;
export type Repair = (typeof REMEDIATION)[number];

export interface AntiPattern {
  readonly id: AntiPatternId;
  readonly absentControl: Control;
  readonly path: readonly { readonly stage: Stage; readonly change: string }[];
  readonly presentsAs: string;
  readonly violates: readonly PrincipleId[];
  readonly detectedBy: readonly SignalId[];
  readonly repairs: readonly {
    readonly step: Repair;
    readonly action: string;
  }[];
}
```

## Never and always

This section covers why every avoidance rule is written as a pair, as shown in [C1·a one inversion](#never-and-always-panel-a). A rule that only says never leaves an empty action set the moment the forbidden thing is the obvious thing, and an empty action set is how the forbidden thing gets written anyway. The canon holds every inversion as a [contract with an invariant](../ontology/ALGORITHMS.md#algorithms-domain-architectural-rules), and the practice for the pairs that recur most is described in [fail at the boundary](../BUILD.md#fail-at-the-boundary) on the methodology page.

### Half a rule

Avoidance rules written as a list of don'ts are obeyed until the first moment the don't is convenient. A rule says no fallbacks, a value is missing at boot, the author has nowhere to go, and the fallback is written with a comment apologizing for it. A prohibition without its replacement names what to avoid and not what to do, so under pressure the avoided thing is the only thing the developer or the model knows how to write.

For this reason an avoidance rule is an inversion that pairs a refused construct and the debt it borrows against with a required construct and the leverage it buys. The replacement is written before the prohibition, so the rule is never a bare never. In practice, the consequences are kept as the rule's reason, so the rule carries its own justification and is never re-argued. A check reports the refused construct where it lands and names the required one as the remediation, and what the replacement supersedes is deleted in the same change, because a marker on the old path keeps two paths alive under one label.

To check this, cover the second half of any rule you hold and ask what you would write instead. If nothing comes, the rule was a prohibition and the debt is already in the tree somewhere. An inversion governs living code on one forward path, meaning anything something else depends on, where a shortcut taken today is read as a decision by the next developer or model to find it. It says nothing about how strict a rule is, and it is not a threshold. A bound lives where the check reads it, and the inversion only says that the bound exists.

### The derivation

The generalized form is a small derivation, and it can be run on any construct in any tree. It asks what the construct borrows against and from whom, names the construct that would stand in its place, and asks what that one buys.

If the second half comes, the pair is a rule and the consequences are its reason. If it does not, the construct is either not a debt or not yet understood, and either way it is not a rule.

### One forward path

Only living code on a single forward path survives that reading. A deprecation marker, a tombstone, a compatibility shim and [zombie code](../ontology/PRINCIPLES.md#architecture-zombie-code) are each a refused construct whose replacement is deletion in the same edit. [Backward compatibility](../ontology/PRINCIPLES.md#architecture-backward-compatibility) is a contract a boundary declares, never a second path kept alive inside one.

An export exists only while another file imports it now, unless it is staged behind a drift check that holds it to that promise. A [utility dump](../ontology/PRINCIPLES.md#architecture-utility-dump) and a [repository dump](../ontology/PRINCIPLES.md#architecture-repository-dump) are the same debt at the scale of a folder, a home for constructs whose replacement was never named, and so a place where every one of them is kept.

C1·a one inversion

```mermaid
flowchart TB
    refused["A construct is refused · with the debt it borrows against"]
    required["Its replacement is required · with the leverage it buys"]
    refused -- one inversion, two consequences --> required
    check["A check reports the refused construct where it lands"]
    refused -.-> check
    remedy["The finding names the required construct as its remediation"]
    check --> remedy
    required -.-> remedy
```

## Debt and leverage

This section covers the consequence on each side of an inversion, which lets the rule survive the moment it is inconvenient. The consequences are derived by the two questions shown in [D1·a lender and replacement](#debt-and-leverage-panel-a), and they turn the pair into a finding a check can print, in the record typed in [D1·b an inversion record](#debt-and-leverage-panel-b).

### A lender and a purchase

Rules are justified with adjectives, and an adjective is re-argued every time the rule is inconvenient. A rule is defended as good practice, the defense convinces no reviewer under deadline, and the construct it refused is written because no reviewer could say who would pay for it. A rule whose reason is an adjective is re-argued because an adjective cannot be pointed at, while a rule whose reason names a lender ends the argument by naming who pays.

For this reason a consequence is a named lender or a named purchase, and a pair with both is already a finding. Each rule carries its lender and its purchase rather than a verdict about quality. In practice, the refused consequence is derived by asking whom the construct borrows from, whether the next reader, the developer who meets the failure later, or every future change that has to keep two paths alive. The required consequence is derived by asking what holds without attention once the replacement is in place. Both are named, so the rule can be pointed at when it is questioned, and the same two names become the message a check prints and the remediation it proposes.

To check this, take any rule you hold and name who pays when it is broken and what is bought when it is kept. A rule where either answer is an adjective has no consequence yet, and it will lose the next argument it is in. A consequence names a lender or a purchase and never a severity. How strictly a rule binds is a separate fact held beside it, so two rules with the same consequence can bind differently, and a consequence never argues for its own rule's rank.

### The lender

The same question derives the refused consequence every time, which is whom the construct borrows from. A shortcut borrows from the next reader. A [fallback pattern](../ontology/ALGORITHMS.md#algorithms-no-fallback) borrows from the developer, because it converts a loud failure into a quiet wrong answer that surfaces later and elsewhere. A [deprecation](../ontology/ALGORITHMS.md#algorithms-no-deprecation) borrows from every future change, because it keeps two paths alive so the choice can be put off.

A [second path](../ontology/ALGORITHMS.md#algorithms-no-dual-path) borrows from every reader, who now has to decide which one is real. Deferring borrows from the developer who will not remember. [Shared mutable state](../ontology/ALGORITHMS.md#algorithms-no-shared-ownership) borrows from the developer who has to find out which writer won, and [silent data corruption](../ontology/PRINCIPLES.md#architecture-silent-data-corruption) from the developer who meets the failure it hid.

### The purchase

The required consequence names what the replacement buys, and the purchase is what makes the rule worth keeping. A [constraint](../ontology/ALGORITHMS.md#algorithms-no-shortcuts) is leverage because it holds without attention. [Fail fast](../ontology/PRINCIPLES.md#architecture-fail-fast) is clarity, because the failure lands where its cause is. Explicit removal is coherence, because a removed path cannot be taken.

A single path is [determinism](../ontology/PRINCIPLES.md#architecture-determinism). A single owner is [auditability](../ontology/PRINCIPLES.md#architecture-auditability). A bounded lifetime is deterministic release. [An emitted event](../ontology/ALGORITHMS.md#algorithms-no-callbacks) is [loose coupling](../ontology/PRINCIPLES.md#architecture-low-coupling), and [policy as code](../ontology/ALGORITHMS.md#algorithms-no-convention-enforcement) is an automated gate. Because each consequence is named this way, the same record serves the developer reading the rule and the check enforcing it, and the two never drift apart.

D1·a lender and replacement

```mermaid
flowchart TB
    construct["A construct under review"]
    lender{"Whom does it borrow from?"}
    reader["the next reader"]
    developer["the developer, later and elsewhere"]
    change["every future change"]
    nobody["no lender · it is not a debt"]
    replacement["What stands in its place, and what does that buy?"]
    rule["A rule · two constructs, two consequences"]
    construct --> lender
    lender --> reader --> replacement
    lender --> developer --> replacement
    lender --> change --> replacement
    lender --> nobody
    replacement --> rule
```

D1·b an inversion record

```typescript
export interface Inversion {
  readonly refused: {
    readonly construct: Construct;
    readonly borrowsAgainst: Consequence;
  };
  readonly required: {
    readonly construct: Construct;
    readonly buys: Consequence;
  };
}

export const inversionOf = (
  refused: Construct,
  required: Construct,
  debt: Consequence,
  leverage: Consequence,
): Inversion => ({
  refused: { borrowsAgainst: debt, construct: refused },
  required: { buys: leverage, construct: required },
});

export const asFinding = (rule: Inversion, at: Location): Finding => ({
  at,
  reported: rule.refused.construct,
  remediation: rule.required.construct,
  reason: rule.refused.borrowsAgainst,
});
```

---

Chapters: [Model](MODEL.md) · [Principles](PRINCIPLES.md) · [Decay](DECAY.md) · [Coverage](COVERAGE.md) · [Scale](SCALE.md) · [Glossary](GLOSSARY.md)
