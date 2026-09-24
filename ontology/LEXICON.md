© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Lexicon — Ontology — Bane's Lab

> Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or…

Canonical: https://banes-lab.com/ontology/lexicon

# The Ontology

The ontology is a queryable canon of software architecture. It holds every principle with its relations and its repair, every term with its definition, every algorithm with its contract, the reasoning that derives them, the layers they live in and how every tension between them is resolved, and every reference from one record to another is a link.

# Lexicon

1357 of 1357 shown

## Sections

- [Architecture Review Evolution Governance](#lex-category-architecture-review-evolution-governance)
- [Behavioral Patterns](#lex-category-behavioral-patterns)
- [Causality / Ordering / Distributed Time](#lex-category-causality-ordering-distributed-time)
- [Codebase / System Architecture Styles](#lex-category-codebase-system-architecture-styles)
- [Contracts / Interfaces / Compatibility](#lex-category-contracts-interfaces-compatibility)
- [Control / Coordination / Centralization](#lex-category-control-coordination-centralization)
- [Core Modular Design](#lex-category-core-modular-design)
- [Core Vocabulary](#lex-category-core-vocabulary)
- [Correctness / Determinism / Verification](#lex-category-correctness-determinism-verification)
- [Creational Patterns](#lex-category-creational-patterns)
- [Domain Architecture](#lex-category-domain-architecture)
- [Error Handling / Resilience](#lex-category-error-handling-resilience)
- [Event Messaging Async](#lex-category-event-messaging-async)
- [Metadata / Self-Description / Declarative Systems](#lex-category-metadata-self-description-declarative-systems)
- [Metaprogramming / Language-Oriented Architecture](#lex-category-metaprogramming-language-oriented-architecture)
- [Model Architecture](#lex-category-model-architecture)
- [Observability / Auditability / Traceability](#lex-category-observability-auditability-traceability)
- [Plugin / Extensibility / IoC](#lex-category-plugin-extensibility-ioc)
- [Portability / Infrastructure / Deployment](#lex-category-portability-infrastructure-deployment)
- [Quality Attributes](#lex-category-quality-attributes)
- [Runtime Discovery / Dynamic Binding](#lex-category-runtime-discovery-dynamic-binding)
- [Scalability / Performance / Optimization](#lex-category-scalability-performance-optimization)
- [Schema / Canonical Data / Semantics](#lex-category-schema-canonical-data-semantics)
- [Security Privacy Compliance](#lex-category-security-privacy-compliance)
- [Self-Healing / Recovery / Deployment Safety](#lex-category-self-healing-recovery-deployment-safety)
- [SOLID / Object-Oriented Design](#lex-category-solid-object-oriented-design)
- [Streaming / Pipeline / Dataflow Processing](#lex-category-streaming-pipeline-dataflow-processing)
- [Structural Patterns](#lex-category-structural-patterns)
- [Taxonomy / Classification / Naming](#lex-category-taxonomy-classification-naming)
- [Transactions / State / Concurrency](#lex-category-transactions-state-concurrency)

## Architecture Review Evolution Governance

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ad-Hoc Design

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Designing by improvisation with no deliberate structure or review, so the architecture accretes inconsistently.

Referenced by
[Design Review](PRINCIPLES.md#arch-design-review)

### Ad-Hoc Pattern Mixing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Combining unrelated design patterns arbitrarily with no coherent rationale, producing an inconsistent structure.

Referenced by
[Pattern Consistency](PRINCIPLES.md#arch-pattern-consistency)

### Analysis Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which analyzing the impact of every change before making it adds effort and slows delivery.

Referenced by
[Impact Analysis](PRINCIPLES.md#arch-impact-analysis)

### Architecture Criteria

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that explicit criteria define what a review judges an architecture against.

Referenced by
[Architecture Review](PRINCIPLES.md#arch-architecture-review)

### Architecture Drift

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Gradual divergence of an implementation from its intended architecture as unreviewed changes accumulate.

Referenced by
[Architectural Consistency](PRINCIPLES.md#arch-architectural-consistency)

### Architecture Foundation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which a system rests on a sound, deliberately designed architectural base rather than accreted structure.

Referenced by
[Greenfield Development](PRINCIPLES.md#arch-greenfield-development)

### Architecture Rules

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that explicit, checkable rules govern how the architecture may be structured and evolved.

Referenced by
[Architectural Consistency](PRINCIPLES.md#arch-architectural-consistency)

### Assumption-Based Judgment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Judging an architecture from untested assumptions instead of measured evidence, yielding unreliable conclusions.

Referenced by
[Assessment](PRINCIPLES.md#arch-assessment)

### Attribute Scenarios

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A concrete scenario specifying how a quality attribute should hold under defined conditions and stimuli.

Referenced by
[Quality Attributes](PRINCIPLES.md#arch-quality-attributes)

### Automated Architecture Compliance

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to verify conformance to architectural rules automatically rather than by manual review.

Referenced by
[Fitness Functions](PRINCIPLES.md#arch-fitness-functions)

### Blind Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Changing a system without analyzing what the change affects, so unintended consequences go unseen.

Referenced by
[Impact Analysis](PRINCIPLES.md#arch-impact-analysis)

### Cargo-Cult Pattern Use

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Applying a design pattern by imitation without understanding the problem it solves, adding structure that fits nothing.

Referenced by
[First-Principles Design](PRINCIPLES.md#arch-first-principles-design)

### Change Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which a change can be made with confidence that its effects are understood and contained.

Referenced by
[Impact Analysis](PRINCIPLES.md#arch-impact-analysis)

### Clean Boundary Design

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to define clear component boundaries from the outset, free of legacy entanglement.

Referenced by
[Greenfield Development](PRINCIPLES.md#arch-greenfield-development)

### Competing Attributes

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which improving one quality attribute forces a trade-off against another.

Referenced by
[Quality Attributes](PRINCIPLES.md#arch-quality-attributes)

### Consequences

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A recorded account of the trade-offs and downstream effects that follow from an architectural decision.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records)

### Continuous Improvement

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Iteratively refining a system's design in small, ongoing steps rather than in large infrequent overhauls.

Referenced by
[Evolutionary Architecture](PRINCIPLES.md#arch-evolutionary-architecture)

### Controlled Architecture Evolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to let an architecture change over time within deliberate guardrails rather than drifting freely.

Referenced by
[Evolutionary Architecture](PRINCIPLES.md#arch-evolutionary-architecture)

### Criteria

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that explicit, agreed measures define how an assessment reaches its verdict.

Referenced by
[Assessment](PRINCIPLES.md#arch-assessment)

### Current State

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A conceptual representation of how a system is presently structured and behaves, used as the baseline for analysis.

Referenced by
[Gap Analysis](PRINCIPLES.md#arch-gap-analysis)

### Decision

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A recorded architectural choice capturing what was chosen and the context in which it was made.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records)

### Decision History

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to trace why past architectural choices were made by consulting their recorded rationale.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records)

### Defect Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to find defects in a change before it is merged or shipped.

Referenced by
[Code Review](PRINCIPLES.md#arch-code-review)

### Design Criteria

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that explicit criteria define what a design review evaluates a proposal against.

Referenced by
[Design Review](PRINCIPLES.md#arch-design-review)

### Direct-to-main Unreviewed Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Pushing changes straight to the main branch with no review, so unvetted code lands directly in production.

Referenced by
[Code Review](PRINCIPLES.md#arch-code-review)

### Documentation Maintenance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which keeping decision records current adds ongoing upkeep effort.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records)

### Early Defect Prevention

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to catch design flaws during review before they are built into the system.

Referenced by
[Design Review](PRINCIPLES.md#arch-design-review)

### Early Delivery with Guardrails

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to ship a minimal architecture quickly while keeping essential safeguards in place.

Referenced by
[Minimum Viable Architecture](PRINCIPLES.md#arch-minimum-viable-architecture)

### Easier Refactoring

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to restructure code more safely because consistent patterns make change predictable.

Referenced by
[Pattern Consistency](PRINCIPLES.md#arch-pattern-consistency)

### Essential Quality Attributes

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that the few quality attributes critical to viability be satisfied before any others.

Referenced by
[Minimum Viable Architecture](PRINCIPLES.md#arch-minimum-viable-architecture)

### Fit-for-Purpose Architecture

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to shape an architecture to the problem it solves rather than to convention.

Referenced by
[First-Principles Design](PRINCIPLES.md#arch-first-principles-design)

### Future Scalability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which a design can grow to meet higher future demand without rework.

Referenced by
[Minimum Viable Architecture](PRINCIPLES.md#arch-minimum-viable-architecture)

### Governance Discipline

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which evolving an architecture continuously demands sustained governance to prevent uncontrolled drift.

Referenced by
[Evolutionary Architecture](PRINCIPLES.md#arch-evolutionary-architecture)

### Incremental Change

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that a system evolve in small, reversible increments rather than large risky leaps.

Referenced by
[Evolutionary Architecture](PRINCIPLES.md#arch-evolutionary-architecture)

### Innovation/Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which enforcing standards constrains teams' freedom to innovate independently.

Referenced by
[Standardization](PRINCIPLES.md#arch-standardization)

### Legacy Constraints

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A binding limitation imposed by pre-existing legacy systems that a new design must accommodate.

Referenced by
[Greenfield Development](PRINCIPLES.md#arch-greenfield-development)

### Local Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which enforcing architectural consistency limits individual teams' freedom to make local choices.

Referenced by
[Architectural Consistency](PRINCIPLES.md#arch-architectural-consistency)

### Local Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which enforcing shared patterns sacrifices locally optimal one-off solutions.

Referenced by
[Pattern Consistency](PRINCIPLES.md#arch-pattern-consistency)

### Manual Architecture Review Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Relying solely on human review to police architecture, with no automated checks, so violations slip through.

Referenced by
[Fitness Functions](PRINCIPLES.md#arch-fitness-functions)

### Measurable Architecture Rule

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that an architectural rule be expressed as an objective, automatically checkable measure.

Referenced by
[Fitness Functions](PRINCIPLES.md#arch-fitness-functions)

### Naming/Structure Conventions

- Kind: [style](SCHEMA.md#kind-style)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A convention of naming and structuring code uniformly across a codebase so its shape is predictable.

Referenced by
[Pattern Consistency](PRINCIPLES.md#arch-pattern-consistency)

### Operability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which a system is easy to run, monitor, and keep healthy in production.

Referenced by
[Standardization](PRINCIPLES.md#arch-standardization)

### Over-Architecture

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Building more architectural structure than the problem needs, adding cost and rigidity with no payoff.

Referenced by
[Minimum Viable Architecture](PRINCIPLES.md#arch-minimum-viable-architecture)

### Predictable Evolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to change a system with confidence that consistent structure keeps outcomes foreseeable.

Referenced by
[Architectural Consistency](PRINCIPLES.md#arch-architectural-consistency)

### Prioritized Refactoring

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to rank refactoring work by assessed impact so effort targets the highest-value fixes.

Referenced by
[Assessment](PRINCIPLES.md#arch-assessment)

### Problem Decomposition

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Breaking a problem into fundamental sub-problems that can be reasoned about independently.

Referenced by
[First-Principles Design](PRINCIPLES.md#arch-first-principles-design)

### Quality

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which a system meets its functional and non-functional expectations.

Referenced by
[Code Review](PRINCIPLES.md#arch-code-review)

### Quality Goals

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that target levels for key quality attributes be defined for an architecture to meet.

Referenced by
[Reference Architecture](PRINCIPLES.md#arch-reference-architecture)

### Regression Scope Selection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to select exactly which tests a change requires by analyzing what it affects.

Referenced by
[Impact Analysis](PRINCIPLES.md#arch-impact-analysis)

### Remediation Planning

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to plan the steps that close the gap between a system's current and target states.

Referenced by
[Gap Analysis](PRINCIPLES.md#arch-gap-analysis)

### Reusable Architecture Guidance

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A body of proven architectural guidance packaged for reuse across projects.

Referenced by
[Reference Architecture](PRINCIPLES.md#arch-reference-architecture)

### Reuse of Established Patterns

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which designing from first principles forgoes the leverage of reusing proven patterns.

Referenced by
[First-Principles Design](PRINCIPLES.md#arch-first-principles-design)

### Review Standards

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The requirement that agreed standards define what a code review checks for.

Referenced by
[Code Review](PRINCIPLES.md#arch-code-review)

### Risk Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to surface architectural risks early by reviewing structure before it is built.

Referenced by
[Architecture Review](PRINCIPLES.md#arch-architecture-review)

### Rule Maintenance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which keeping fitness-function rules current adds ongoing upkeep effort.

Referenced by
[Fitness Functions](PRINCIPLES.md#arch-fitness-functions)

### Standard Patterns

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A canonical, widely agreed reusable solution that a reference architecture prescribes for a recurring problem.

Referenced by
[Reference Architecture](PRINCIPLES.md#arch-reference-architecture)

### Standards Definition

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A defined, authoritative set of standards that units are expected to conform to.

Referenced by
[Standardization](PRINCIPLES.md#arch-standardization)

### Target State

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
A conceptual representation of the desired future structure a system is being steered toward.

Referenced by
[Gap Analysis](PRINCIPLES.md#arch-gap-analysis)

### Trade-Off Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The ability to weigh competing quality attributes and choose a balanced compromise between them.

Referenced by
[Quality Attributes](PRINCIPLES.md#arch-quality-attributes)

### Tribal Knowledge

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Critical architectural knowledge held only in the developers' heads and never recorded, lost when they leave.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records)

### Unbounded Variation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Allowing unlimited variation in how the same problem is solved, so the system sprawls into inconsistent one-offs.

Referenced by
[Standardization](PRINCIPLES.md#arch-standardization)

### Uncoordinated Divergence

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Teams independently diverging from a shared reference architecture, fragmenting the system into incompatible variants.

Referenced by
[Reference Architecture](PRINCIPLES.md#arch-reference-architecture)

### Undefined Target

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Attempting to close a gap toward a goal that was never clearly defined, so progress cannot be judged.

Referenced by
[Gap Analysis](PRINCIPLES.md#arch-gap-analysis)

### Unknown Requirements

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
The degree to which starting on a clean slate forces early decisions while requirements are still unknown.

Referenced by
[Greenfield Development](PRINCIPLES.md#arch-greenfield-development)

### Unreviewed Structural Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Architecture Review Evolution Governance](LEXICON.md#lex-category-architecture-review-evolution-governance)
- Layer: [Evolution Principles](SCHEMA.md#layer-evolution-principles)

Details

Definition
Merging changes to architectural structure without review, letting unvetted design decisions into the system.

Referenced by
[Architecture Review](PRINCIPLES.md#arch-architecture-review)

## Behavioral Patterns

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Centralized Interaction Logic

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to concentrate how a set of objects interact within one mediating component.

Referenced by
[Mediator Pattern](PRINCIPLES.md#arch-mediator-pattern)

### Class Count

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which extracting each algorithm into its own class raises the total number of classes.

Referenced by
[Strategy Pattern](PRINCIPLES.md#arch-strategy-pattern)

### Class Proliferation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which modeling each state as its own class multiplies the number of classes.

Referenced by
[State Pattern](PRINCIPLES.md#arch-state-pattern)

### Controlled Variation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to let subclasses vary only the designated steps of a fixed algorithm.

Referenced by
[Template Method Pattern](PRINCIPLES.md#arch-template-method-pattern)

### Coordination Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of complexity in how objects must coordinate, which motivates a mediator.

Referenced by
[Mediator Pattern](PRINCIPLES.md#arch-mediator-pattern)

### Decoupled Notification

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to notify interested parties of a change without the source knowing who they are.

Referenced by
[Observer Pattern](PRINCIPLES.md#arch-observer-pattern)

### Deferred Execution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to capture a request as an object so it can be run later, queued, or logged.

Referenced by
[Command Pattern](PRINCIPLES.md#arch-command-pattern)

### Direct Callback Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Wiring a source to notify specific recipients by direct call, coupling it to each one.

Referenced by
[Observer Pattern](PRINCIPLES.md#arch-observer-pattern)

### Direct Method Invocation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Invoking an operation by direct method call, so it cannot be queued, logged, or undone.

Referenced by
[Command Pattern](PRINCIPLES.md#arch-command-pattern)

### Duplicated Workflow

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Repeating the same overall algorithm in many places, each copy re-implementing the shared steps.

Referenced by
[Template Method Pattern](PRINCIPLES.md#arch-template-method-pattern)

### Element Stability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which adding new operations stays easy only while the set of element types stays fixed.

Referenced by
[Visitor Pattern](PRINCIPLES.md#arch-visitor-pattern)

### Exhaustive State Reasoning

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to enumerate and reason about every state a system can occupy and every transition between them.

Referenced by
[Finite State Machine](PRINCIPLES.md#arch-finite-state-machine)

### Explicit State Model

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that an object's states and their transitions be modeled explicitly.

Referenced by
[State Pattern](PRINCIPLES.md#arch-state-pattern)

### Explicit State Set

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that the complete set of possible states be defined up front.

Referenced by
[Finite State Machine](PRINCIPLES.md#arch-finite-state-machine)

### Exposed Internal Representation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Forcing clients to traverse a collection through its internal structure, coupling them to that structure.

Referenced by
[Iterator Pattern](PRINCIPLES.md#arch-iterator-pattern)

### External State Reach-In

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Reading or writing an object's internal state from outside to snapshot it, breaking its encapsulation.

Referenced by
[Memento Pattern](PRINCIPLES.md#arch-memento-pattern)

### Fail-Safe Defaults

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Defaulting to safe, benign behavior when a value or handler is absent rather than failing or branching.

Referenced by
[Null Object Pattern](PRINCIPLES.md#arch-null-object-pattern)

### Flat State Explosion

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Enumerating every combination of conditions as a separate flat state, so the state count explodes.

Referenced by
[Statecharts](PRINCIPLES.md#arch-statecharts)

### Framework Reuse

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to reuse a fixed algorithm skeleton across many concrete implementations.

Referenced by
[Template Method Pattern](PRINCIPLES.md#arch-template-method-pattern)

### Guarded Transitions

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to permit a state transition only when a specified condition holds.

Referenced by
[Statecharts](PRINCIPLES.md#arch-statecharts)

### Hierarchical States

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to nest states so shared behavior is defined once on an enclosing state.

Referenced by
[Statecharts](PRINCIPLES.md#arch-statecharts)

### Inheritance Coupling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which basing a template method on subclassing binds subclasses tightly to the base class.

Referenced by
[Template Method Pattern](PRINCIPLES.md#arch-template-method-pattern)

### Interchangeable Algorithms

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that competing algorithms share one interface so they can be swapped freely.

Referenced by
[Strategy Pattern](PRINCIPLES.md#arch-strategy-pattern)

### Large Conditional Logic

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Selecting behavior with a large branching conditional instead of pluggable strategy objects.

Referenced by
[Strategy Pattern](PRINCIPLES.md#arch-strategy-pattern)

### Lazy Traversal

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to produce a collection's elements one at a time on demand rather than all at once.

Referenced by
[Iterator Pattern](PRINCIPLES.md#arch-iterator-pattern)

### Mediator God Object

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which concentrating interaction logic in a mediator risks growing it into an overloaded object.

Referenced by
[Mediator Pattern](PRINCIPLES.md#arch-mediator-pattern)

### Memory Footprint

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of memory consumed by retaining state snapshots for later restoration.

Referenced by
[Memento Pattern](PRINCIPLES.md#arch-memento-pattern)

### Mesh Dependencies

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Letting every object refer directly to every other, forming a dense mesh of point-to-point dependencies.

Referenced by
[Mediator Pattern](PRINCIPLES.md#arch-mediator-pattern)

### Monolithic Handler

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Handling every case in one large handler instead of a chain of focused, single-purpose handlers.

Referenced by
[Chain of Responsibility Pattern](PRINCIPLES.md#arch-chain-of-responsibility-pattern)

### Null-Check Elimination

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to remove scattered null checks by substituting a benign do-nothing object.

Referenced by
[Null Object Pattern](PRINCIPLES.md#arch-null-object-pattern)

### Operation Extension Without Element Change

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to add new operations over a structure without modifying its element classes.

Referenced by
[Visitor Pattern](PRINCIPLES.md#arch-visitor-pattern)

### Ordered Fallthrough

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to offer a request to handlers in sequence until one of them accepts it.

Referenced by
[Chain of Responsibility Pattern](PRINCIPLES.md#arch-chain-of-responsibility-pattern)

### Parallel Regions

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to model concurrently-active, independent regions of state within one machine.

Referenced by
[Statecharts](PRINCIPLES.md#arch-statecharts)

### Pluggable Handling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to add or reorder request handlers without changing the ones already in the chain.

Referenced by
[Chain of Responsibility Pattern](PRINCIPLES.md#arch-chain-of-responsibility-pattern)

### Request Queuing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to hold requests captured as objects in a queue for later execution.

Referenced by
[Command Pattern](PRINCIPLES.md#arch-command-pattern)

### Runtime Behavior Selection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to choose among interchangeable algorithms at runtime.

Referenced by
[Strategy Pattern](PRINCIPLES.md#arch-strategy-pattern)

### Shared Behavioral Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that the real object and its null stand-in implement one common interface.

Referenced by
[Null Object Pattern](PRINCIPLES.md#arch-null-object-pattern)

### Silent No-Op Risk

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which a do-nothing stand-in can hide an error.

Referenced by
[Null Object Pattern](PRINCIPLES.md#arch-null-object-pattern)

### Snapshot/Restore

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to capture an object's state and later restore it to that captured point.

Referenced by
[Memento Pattern](PRINCIPLES.md#arch-memento-pattern)

### Stable Algorithm Skeleton

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that the overall algorithm's structure stay fixed while specific steps vary.

Referenced by
[Template Method Pattern](PRINCIPLES.md#arch-template-method-pattern)

### Stable Element Hierarchy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that the set of element types stay fixed so new operations can be added over them.

Referenced by
[Visitor Pattern](PRINCIPLES.md#arch-visitor-pattern)

### State Explosion

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which the number of explicit states grows unmanageably as conditions multiply.

Referenced by
[Finite State Machine](PRINCIPLES.md#arch-finite-state-machine)

### State-Local Behavior

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to attach behavior to each state so an object acts according to its current state.

Referenced by
[State Pattern](PRINCIPLES.md#arch-state-pattern)

### Structure-Agnostic Iteration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to traverse a collection without depending on how it is internally organized.

Referenced by
[Iterator Pattern](PRINCIPLES.md#arch-iterator-pattern)

### Subject/Subscriber Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement of an agreed interface by which subjects notify and subscribers receive updates.

Referenced by
[Observer Pattern](PRINCIPLES.md#arch-observer-pattern)

### Type-Switch Dispatch

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Dispatching behavior with a switch on an object's type instead of double dispatch through a visitor.

Referenced by
[Visitor Pattern](PRINCIPLES.md#arch-visitor-pattern), [Dynamic Dispatch](PRINCIPLES.md#arch-dynamic-dispatch)

### Uniform Handler Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that every handler in a chain share one interface so requests pass along uniformly.

Referenced by
[Chain of Responsibility Pattern](PRINCIPLES.md#arch-chain-of-responsibility-pattern)

### Uniform Traversal Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Behavioral Patterns](LEXICON.md#lex-category-behavioral-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that collections expose one common interface for stepping through their elements.

Referenced by
[Iterator Pattern](PRINCIPLES.md#arch-iterator-pattern)

## Causality / Ordering / Distributed Time

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Arbitrary Reordering

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Reordering causally related operations freely, so effects can appear before their causes.

Referenced by
[Causal Consistency](PRINCIPLES.md#arch-causal-consistency)

### Assumed Total Consistency And Availability

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Assuming a distributed system can be fully consistent and available at once, ignoring partitions that force a choice.

Referenced by
[CAP Theorem](PRINCIPLES.md#arch-cap-theorem)

### Bidirectional Collaboration

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which forbidding cycles prevents two components from depending on each other bidirectionally.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph)

### Build Order

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to derive a correct build or execution order from a graph that contains no cycles.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph)

### Causal Ordering

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that operations be applied in an order consistent with their cause-and-effect relationships.

Referenced by
[Causal Consistency](PRINCIPLES.md#arch-causal-consistency)

### Causal Reasoning

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Reasoning about which events must precede others based on their causal relationships.

Referenced by
[Happens-Before Relationship](PRINCIPLES.md#arch-happens-before-relationship)

### Causation Tracking

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Recording which event caused which, so cause-and-effect chains can be reconstructed later.

Referenced by
[Causality](PRINCIPLES.md#arch-causality)

### Clock Skew

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which physical clocks on different nodes drift apart, distorting time-based ordering.

Referenced by
[Hybrid Logical Clocks](PRINCIPLES.md#arch-hybrid-logical-clocks)

### Commutative Merge

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that concurrent updates merge in any order to the same result.

Referenced by
[CRDTs](PRINCIPLES.md#arch-crdts)

### Concurrent Update Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to detect when two updates happened concurrently rather than one causally after the other.

Referenced by
[Vector Clocks](PRINCIPLES.md#arch-vector-clocks)

### Conflict-Free Replica Convergence

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability for replicas to converge to one state automatically without conflict resolution.

Referenced by
[CRDTs](PRINCIPLES.md#arch-crdts)

### Consistency Assumed Free When Healthy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Assuming consistency carries no cost while the network is healthy, ignoring the latency it still imposes.

Referenced by
[PACELC Theorem](PRINCIPLES.md#arch-pacelc-theorem)

### Correct Stateful Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to process a stream statefully with correct results by handling events in their proper order.

Referenced by
[Event Ordering](PRINCIPLES.md#arch-event-ordering)

### Correct Workflow Reasoning

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to reason correctly about a workflow's steps by knowing their causal relationships.

Referenced by
[Causality](PRINCIPLES.md#arch-causality)

### Cycle Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to detect cycles in a dependency graph before they cause deadlock or infinite resolution.

Referenced by
[Dependency Graph](PRINCIPLES.md#arch-dependency-graph)

### Dependency Declaration

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that each operation declare the operations it causally depends on.

Referenced by
[Causal Dependency](PRINCIPLES.md#arch-causal-dependency)

### Dependency Extraction

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that dependencies between units be discovered and represented explicitly as a graph.

Referenced by
[Dependency Graph](PRINCIPLES.md#arch-dependency-graph)

### Directed Dependencies

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that dependencies point in one direction only, forming no cycles.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph)

### Dynamic Loading

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which resolving dependencies dynamically at runtime undermines a statically analyzable dependency graph.

Referenced by
[Dependency Graph](PRINCIPLES.md#arch-dependency-graph)

### Eventual Consistency Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which replicas can converge over time without ever exposing a causally impossible state.

Referenced by
[Causal Consistency](PRINCIPLES.md#arch-causal-consistency)

### Explicit Consistency/Availability Choice Under Partition

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to choose deliberately between consistency and availability when a network partition occurs.

Referenced by
[CAP Theorem](PRINCIPLES.md#arch-cap-theorem)

### Graph Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which tracking fine-grained causal dependencies grows the dependency graph large and hard to reason about.

Referenced by
[Causal Dependency](PRINCIPLES.md#arch-causal-dependency)

### Happens-Before Reasoning

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Reasoning about event order using logical timestamps that respect the happens-before relation.

Referenced by
[Lamport Clocks](PRINCIPLES.md#arch-lamport-clocks)

### Hidden Dependency

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
An unstated dependency between operations, so order-sensitive code breaks when the hidden ordering is not preserved.

Referenced by
[Causal Dependency](PRINCIPLES.md#arch-causal-dependency)

### Identical Delivery Order Across Nodes

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to deliver messages to every node in the same total order.

Referenced by
[Total-Order Broadcast](PRINCIPLES.md#arch-total-order-broadcast)

### Last-Write-Wins Overwrite

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Resolving concurrent updates by keeping the most recent write, rather than merging all updates.

Referenced by
[CRDTs](PRINCIPLES.md#arch-crdts)

### Latency-Consistency Trade-off When Healthy

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to weigh the latency-versus-consistency trade-off that remains even when the network is healthy.

Referenced by
[PACELC Theorem](PRINCIPLES.md#arch-pacelc-theorem)

### Latency/Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which enforcing causal ordering across replicas costs added latency and reduced availability.

Referenced by
[Causal Consistency](PRINCIPLES.md#arch-causal-consistency)

### Layering

- Kind: [style](SCHEMA.md#kind-style)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
A convention of organizing components into ordered layers where each may depend only on the layers beneath it.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph)

### Logical Counter

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
A monotonically increasing counter each process maintains to stamp events for logical ordering.

Referenced by
[Lamport Clocks](PRINCIPLES.md#arch-lamport-clocks)

### Metadata Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which the bookkeeping a conflict-free type carries per value adds storage and transmission cost.

Referenced by
[CRDTs](PRINCIPLES.md#arch-crdts)

### Metadata Size

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which carrying a per-node counter for every node grows the ordering metadata with cluster size.

Referenced by
[Vector Clocks](PRINCIPLES.md#arch-vector-clocks)

### Network Partition Possibility

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that a distributed design account for the possibility of network partitions.

Referenced by
[CAP Theorem](PRINCIPLES.md#arch-cap-theorem)

### No Concurrent Causality Distinction

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which a single logical counter cannot tell concurrent events apart from causally ordered ones.

Referenced by
[Lamport Clocks](PRINCIPLES.md#arch-lamport-clocks)

### Node Identity

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that each participating node have a distinct identity to index its own counter.

Referenced by
[Vector Clocks](PRINCIPLES.md#arch-vector-clocks)

### Ordering Key or Sequence

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that each event carry a key or sequence number that fixes its position in order.

Referenced by
[Event Ordering](PRINCIPLES.md#arch-event-ordering)

### Ordering Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The requirement that a defined semantics specify when one event is considered to happen before another.

Referenced by
[Happens-Before Relationship](PRINCIPLES.md#arch-happens-before-relationship)

### Parallel Execution

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The degree to which enforcing a happens-before order constrains how much work can run in parallel.

Referenced by
[Happens-Before Relationship](PRINCIPLES.md#arch-happens-before-relationship)

### Partial Ordering

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to establish a consistent partial order over events without a shared physical clock.

Referenced by
[Lamport Clocks](PRINCIPLES.md#arch-lamport-clocks)

### Per-Node Independent Ordering

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Letting each node decide message order independently, so replicas diverge on sequence.

Referenced by
[Total-Order Broadcast](PRINCIPLES.md#arch-total-order-broadcast)

### Physical-Clock-Only Ordering

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Ordering events by physical clocks alone, which clock skew renders inconsistent across nodes.

Referenced by
[Hybrid Logical Clocks](PRINCIPLES.md#arch-hybrid-logical-clocks)

### Race Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to detect data races by finding accesses with no happens-before ordering between them.

Referenced by
[Happens-Before Relationship](PRINCIPLES.md#arch-happens-before-relationship)

### Single Global Clock Assumption

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Assuming a single global clock orders all events, which fails across distributed nodes with independent clocks.

Referenced by
[Vector Clocks](PRINCIPLES.md#arch-vector-clocks)

### Topological Ordering

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to linearize a directed acyclic graph into an order where every node follows its dependencies.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph)

### Unordered Parallel Consumption

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Consuming an ordered event stream in parallel without preserving order, so state is updated out of sequence.

Referenced by
[Event Ordering](PRINCIPLES.md#arch-event-ordering)

### Unordered Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Applying side effects in an order that ignores their causal dependencies, producing incorrect outcomes.

Referenced by
[Causality](PRINCIPLES.md#arch-causality)

### User-Visible Ordering Guarantees

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to guarantee that users never observe an effect before its cause.

Referenced by
[Causal Consistency](PRINCIPLES.md#arch-causal-consistency)

### Version Vector

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
A set of per-node counters that together capture the causal history of a replicated item.

Referenced by
[Vector Clocks](PRINCIPLES.md#arch-vector-clocks)

### Wall-Clock Ordering Assumption

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
Ordering distributed events by wall-clock timestamps, which clock skew makes unreliable.

Referenced by
[Lamport Clocks](PRINCIPLES.md#arch-lamport-clocks)

### Wall-Clock-Correlated Causal Order

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Causality / Ordering / Distributed Time](LEXICON.md#lex-category-causality-ordering-distributed-time)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The ability to order events causally while keeping timestamps close to wall-clock time.

Referenced by
[Hybrid Logical Clocks](PRINCIPLES.md#arch-hybrid-logical-clocks)

## Codebase / System Architecture Styles

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Adapters

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Components that translate between a core's ports and the specific external technologies behind them.

Referenced by
[Ports and Adapters Architecture](PRINCIPLES.md#arch-ports-and-adapters-architecture)

### Anemic Layers

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which strict layering produces thin pass-through layers that add indirection without logic.

Referenced by
[Layered Architecture](PRINCIPLES.md#arch-layered-architecture)

### Boundaries

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that clear boundaries separate the concentric layers of the system.

Referenced by
[Clean Architecture](PRINCIPLES.md#arch-clean-architecture)

### Central Database Bottleneck

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Funneling all state through one shared database that becomes the system's scaling bottleneck.

Referenced by
[Space-Based Architecture](PRINCIPLES.md#arch-space-based-architecture)

### Component Boundaries

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that each component expose a well-defined boundary and interface.

Referenced by
[Component-Based Architecture](PRINCIPLES.md#arch-component-based-architecture)

### Contract-Governed Service Reuse

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to reuse services across an enterprise through well-defined contracts.

Referenced by
[Service-Oriented Architecture](PRINCIPLES.md#arch-service-oriented-architecture)

### Database-Bottleneck Removal

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to eliminate the shared-database bottleneck by holding state in distributed memory.

Referenced by
[Space-Based Architecture](PRINCIPLES.md#arch-space-based-architecture)

### Decentralized Ownership

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability for separate teams to own, deploy and evolve their services independently.

Referenced by
[Microservices](PRINCIPLES.md#arch-microservices)

### Dependency Rule

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that source-code dependencies point only inward, toward higher-level policy.

Referenced by
[Clean Architecture](PRINCIPLES.md#arch-clean-architecture)

### Domain Core

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that pure domain logic occupy the core, isolated from external concerns.

Referenced by
[Hexagonal Architecture](PRINCIPLES.md#arch-hexagonal-architecture)

### End-to-End Traceability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which decomposing flow into independent filters makes tracing a request end to end harder.

Referenced by
[Pipes and Filters](PRINCIPLES.md#arch-pipes-and-filters)

### External System Isolation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to isolate the core from external systems behind adapter boundaries.

Referenced by
[Hexagonal Architecture](PRINCIPLES.md#arch-hexagonal-architecture)

### Feature Cohesion

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which all code serving one feature is grouped together rather than scattered by layer.

Referenced by
[Package by Feature](PRINCIPLES.md#arch-package-by-feature)

### Framework Independence

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to keep business rules independent of any particular framework.

Referenced by
[Clean Architecture](PRINCIPLES.md#arch-clean-architecture)

### Framework-Centric Core

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Building the core around a specific framework, so the framework's concerns permeate the domain.

Referenced by
[Hexagonal Architecture](PRINCIPLES.md#arch-hexagonal-architecture)

### Independent Scaling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a single deployable unit prevents scaling parts of the system independently.

Referenced by
[Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Independent Stage Testing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to test each filter stage in isolation from the rest of the pipeline.

Referenced by
[Pipes and Filters](PRINCIPLES.md#arch-pipes-and-filters)

### Infrastructure Independence

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to keep the core independent of the infrastructure it runs on.

Referenced by
[Ports and Adapters Architecture](PRINCIPLES.md#arch-ports-and-adapters-architecture)

### Infrastructure-Centric Design

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Designing the core around infrastructure details, so business logic depends on technical specifics.

Referenced by
[Ports and Adapters Architecture](PRINCIPLES.md#arch-ports-and-adapters-architecture)

### Initial Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree of upfront structural complexity introduced by defining ports and adapters.

Referenced by
[Hexagonal Architecture](PRINCIPLES.md#arch-hexagonal-architecture)

### Integration Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree of effort required to wire independently-developed components together.

Referenced by
[Component-Based Architecture](PRINCIPLES.md#arch-component-based-architecture)

### Layer Leakage

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Letting an inner layer depend on an outer one, violating the direction of the dependency rule.

Referenced by
[Clean Architecture](PRINCIPLES.md#arch-clean-architecture)

### Layer Separation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that responsibilities be divided into distinct, ordered layers.

Referenced by
[Layered Architecture](PRINCIPLES.md#arch-layered-architecture)

### Layer Skipping

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Bypassing intermediate layers to call a distant layer directly, undermining the layering.

Referenced by
[Layered Architecture](PRINCIPLES.md#arch-layered-architecture)

### Locality of Change

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to make a feature's changes in one place because its code is grouped together.

Referenced by
[Package by Feature](PRINCIPLES.md#arch-package-by-feature)

### Monolithic Transform Function

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Doing all processing in one large transform instead of a series of composable filter stages.

Referenced by
[Pipes and Filters](PRINCIPLES.md#arch-pipes-and-filters)

### Operational Simplicity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a single deployable unit keeps building, deploying, and operating simple.

Referenced by
[Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Package by Technical Layer Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Organizing code by technical layer alone, scattering each feature across many packages.

Referenced by
[Package by Feature](PRINCIPLES.md#arch-package-by-feature)

### Ports

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that the core define abstract interface points through which all external interaction passes.

Referenced by
[Ports and Adapters Architecture](PRINCIPLES.md#arch-ports-and-adapters-architecture)

### Reorderable Stages

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to reorder or recombine independent processing stages.

Referenced by
[Pipes and Filters](PRINCIPLES.md#arch-pipes-and-filters)

### Replicated In-Memory State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that application state be kept in replicated in-memory grids rather than a central store.

Referenced by
[Space-Based Architecture](PRINCIPLES.md#arch-space-based-architecture)

### Shared Monolithic Application

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Building one large shared application instead of composing independently-governed services.

Referenced by
[Service-Oriented Architecture](PRINCIPLES.md#arch-service-oriented-architecture)

### Shared Technical Concerns

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which grouping by feature complicates sharing cross-cutting technical code.

Referenced by
[Package by Feature](PRINCIPLES.md#arch-package-by-feature)

### Structured Code Organization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to organize code predictably by assigning each responsibility to a layer.

Referenced by
[Layered Architecture](PRINCIPLES.md#arch-layered-architecture)

### Transactional Simplicity

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to use straightforward local transactions when all state lives in one process.

Referenced by
[Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Unbounded Big Ball of Mud

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Letting a system grow without structure into a tangled mass with no clear boundaries.

Referenced by
[Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Unified Deployment Boundary

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that the whole application build and deploy as one unit.

Referenced by
[Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Uniform Stage Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that every stage share one interface so stages can be composed freely.

Referenced by
[Pipes and Filters](PRINCIPLES.md#arch-pipes-and-filters)

### Use Cases

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Codebase / System Architecture Styles](LEXICON.md#lex-category-codebase-system-architecture-styles)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that application operations be captured as explicit use cases in their own layer.

Referenced by
[Clean Architecture](PRINCIPLES.md#arch-clean-architecture)

## Contracts / Interfaces / Compatibility

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ad-Hoc Endpoints

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Exposing inconsistent, one-off endpoints instead of a uniform interface, forcing clients to special-case each.

Referenced by
[Uniform Interface](PRINCIPLES.md#arch-uniform-interface)

### Ad-Hoc Payloads

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Sending payloads with no agreed schema, so consumers must guess at structure and break on change.

Referenced by
[Schema Contract](PRINCIPLES.md#arch-schema-contract)

### API Usability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which an API is easy for developers to learn and use correctly.

Referenced by
[Uniform Interface](PRINCIPLES.md#arch-uniform-interface)

### Automated Validation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to check data automatically against a declared schema.

Referenced by
[Schema Contract](PRINCIPLES.md#arch-schema-contract)

### Breaking API Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Changing an API in a way that violates its published contract, breaking existing clients.

Referenced by
[API Contract](PRINCIPLES.md#arch-api-contract)

### Breaking Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
A change that violates a component's contract, forcing consumers to update to keep working.

Referenced by
[Backward Compatibility](PRINCIPLES.md#arch-backward-compatibility)

### Breaking Changes

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Changes that break existing consumers by altering behavior or shape they depend on.

Referenced by
[Stable Interfaces](PRINCIPLES.md#arch-stable-interfaces)

### Cleanup / Simplification

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The activity of removing obsolete code and structure, which backward compatibility can hold back.

Referenced by
[Backward Compatibility](PRINCIPLES.md#arch-backward-compatibility)

### Client Compatibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which existing clients continue to work as an API evolves.

Referenced by
[API Contract](PRINCIPLES.md#arch-api-contract)

### Compatibility Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The declared rules governing which changes are compatible and how versions are managed.

Referenced by
[Versioning](PRINCIPLES.md#arch-versioning)

### Consistent Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that the same operation mean the same thing across every resource and endpoint.

Referenced by
[Uniform Interface](PRINCIPLES.md#arch-uniform-interface)

### Consumer Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which consumers are protected from breakage when a provider changes.

Referenced by
[Backward Compatibility](PRINCIPLES.md#arch-backward-compatibility)

### Consumer-Driven Development

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to shape a provider's contract from the concrete needs of its consumers.

Referenced by
[Contract-First Design](PRINCIPLES.md#arch-contract-first-design)

### Consumer-Verified Compatibility

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to verify a provider still satisfies the contracts its consumers depend on.

Referenced by
[Consumer-Driven Contracts](PRINCIPLES.md#arch-consumer-driven-contracts)

### Contract Testing

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The activity of testing that an implementation honors the contract it declares.

Referenced by
[Design by Contract](PRINCIPLES.md#arch-design-by-contract)

### Cross-Domain Translation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The activity of mapping terms and structures between two domains that model the world differently.

Referenced by
[Semantic Contracts](PRINCIPLES.md#arch-semantic-contracts)

### Cross-System Communication

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability for independent systems to exchange and understand data with one another.

Referenced by
[Interoperability](PRINCIPLES.md#arch-interoperability)

### Data Quality

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which data is accurate, complete, and fit for its intended use.

Referenced by
[Data Contract](PRINCIPLES.md#arch-data-contract)

### Development Speed

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The rate at which new functionality is built, which upfront contract rigor can slow.

Referenced by
[Design by Contract](PRINCIPLES.md#arch-design-by-contract)

### Distributed Evolution

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which services can evolve independently, constrained by the contracts binding them.

Referenced by
[Service Contract](PRINCIPLES.md#arch-service-contract)

### Domain-Specific Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a system is tuned for one domain, traded against broad interoperability.

Referenced by
[Interoperability](PRINCIPLES.md#arch-interoperability)

### Evolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to change an interface over time, in tension with the stability its contract promises.

Referenced by
[API Contract](PRINCIPLES.md#arch-api-contract)

### Evolution Speed

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The rate at which an interface can change, which a commitment to stability deliberately limits.

Referenced by
[Stable Interfaces](PRINCIPLES.md#arch-stable-interfaces)

### Extensible Schema

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
A schema shaped so new fields can be added without breaking existing consumers.

Referenced by
[Forward Compatibility](PRINCIPLES.md#arch-forward-compatibility)

### External State Mutation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Mutating state outside an object's own boundary, breaking the invariants it is supposed to guarantee.

Referenced by
[Invariants](PRINCIPLES.md#arch-invariants)

### Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a component permits varied use, in tension with the invariants it must uphold.

Referenced by
[Invariants](PRINCIPLES.md#arch-invariants)

### Flexible Ingestion

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a system accepts loosely-structured input, in tension with a strict data contract.

Referenced by
[Data Contract](PRINCIPLES.md#arch-data-contract)

### Hidden Service Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
An undeclared dependency between services that surfaces only at runtime, undermining independent evolution.

Referenced by
[Service Contract](PRINCIPLES.md#arch-service-contract)

### Implementation-First Integration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Integrating against a concrete implementation before agreeing a contract, coupling consumers to internals.

Referenced by
[Contract-First Design](PRINCIPLES.md#arch-contract-first-design)

### Implicit Assumptions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Relying on unstated preconditions a caller must satisfy, which break silently when they are violated.

Referenced by
[Preconditions](PRINCIPLES.md#arch-preconditions)

### Implicit Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Behavior a component performs that is not stated in its contract, surprising callers who come to depend on it.

Referenced by
[Design by Contract](PRINCIPLES.md#arch-design-by-contract)

### Implicit Payloads

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Passing data whose shape and meaning are never declared, so consumers infer them and break on change.

Referenced by
[Explicit Contracts](PRINCIPLES.md#arch-explicit-contracts)

### Incremental Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to roll out changes gradually while old and new versions coexist.

Referenced by
[Backward Compatibility](PRINCIPLES.md#arch-backward-compatibility)

### Independent Consumers

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability for consumers to evolve on their own schedule because the interface stays stable.

Referenced by
[Stable Interfaces](PRINCIPLES.md#arch-stable-interfaces)

### Integration

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which separate systems are connected to operate as a unified whole.

Referenced by
[Interoperability](PRINCIPLES.md#arch-interoperability)

### Interface Overuse

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which excessive interface abstraction adds indirection without proportional benefit.

Referenced by
[Interface-Based Design](PRINCIPLES.md#arch-interface-based-design)

### Multi-Client Integration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to serve many different clients through one compatible protocol.

Referenced by
[Protocol Compatibility](PRINCIPLES.md#arch-protocol-compatibility)

### Permissive APIs

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which an API accepts loose or lenient input, in tension with strict preconditions.

Referenced by
[Preconditions](PRINCIPLES.md#arch-preconditions)

### Proprietary Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Binding to a vendor's proprietary interface, forfeiting interoperability and portability.

Referenced by
[Interoperability](PRINCIPLES.md#arch-interoperability)

### Proprietary Drift

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Extending a standard protocol with proprietary features until it no longer interoperates with others.

Referenced by
[Protocol Compatibility](PRINCIPLES.md#arch-protocol-compatibility)

### Protocol Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The agreed rules of a protocol, such as its messages, formats and sequences, that both ends must honor.

Referenced by
[Protocol Compatibility](PRINCIPLES.md#arch-protocol-compatibility)

### Protocol Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a protocol is tuned for performance, traded against broad compatibility.

Referenced by
[Protocol Compatibility](PRINCIPLES.md#arch-protocol-compatibility)

### Provider Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree of freedom a provider retains to change, constrained by consumer-driven contracts.

Referenced by
[Consumer-Driven Contracts](PRINCIPLES.md#arch-consumer-driven-contracts)

### Provider Change Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a provider can change without breaking its consumers, verified by their contracts.

Referenced by
[Consumer-Driven Contracts](PRINCIPLES.md#arch-consumer-driven-contracts)

### Rapid Prototyping

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The activity of building quick throwaway prototypes, which explicit contracts can slow.

Referenced by
[Explicit Contracts](PRINCIPLES.md#arch-explicit-contracts)

### Reliable Integration

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which systems integrate correctly because their shared meaning is agreed, not just their shape.

Referenced by
[Semantic Contracts](PRINCIPLES.md#arch-semantic-contracts)

### Result Validation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The activity of checking that an operation's result satisfies its promised postconditions.

Referenced by
[Postconditions](PRINCIPLES.md#arch-postconditions)

### Rolling Upgrades

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to upgrade instances one at a time while old and new versions interoperate.

Referenced by
[Forward Compatibility](PRINCIPLES.md#arch-forward-compatibility)

### Runtime Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree of runtime overhead incurred by checking conditions on every call.

Referenced by
[Postconditions](PRINCIPLES.md#arch-postconditions)

### Schema Evolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to change a data schema over time without breaking existing readers or writers.

Referenced by
[Data Contract](PRINCIPLES.md#arch-data-contract)

### Schema Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a schema tolerates variation, in tension with a strict contract.

Referenced by
[Schema Contract](PRINCIPLES.md#arch-schema-contract)

### Semantic Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
An agreement specifying not just the shape of an interface but the meaning and behavior it guarantees.

Referenced by
[Service Contract](PRINCIPLES.md#arch-service-contract)

### Silent Breaking Changes

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Shipping a breaking change with no version bump or notice, so consumers fail without warning.

Referenced by
[Versioning](PRINCIPLES.md#arch-versioning)

### Specialized Endpoints

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which purpose-built endpoints are offered, traded against a uniform interface.

Referenced by
[Uniform Interface](PRINCIPLES.md#arch-uniform-interface)

### Strict Fragile Parsers

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Parsers that reject any input deviating from an exact expectation, breaking on benign additions.

Referenced by
[Forward Compatibility](PRINCIPLES.md#arch-forward-compatibility)

### Strong Validation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which input is strictly validated, in tension with tolerating unknown future fields.

Referenced by
[Forward Compatibility](PRINCIPLES.md#arch-forward-compatibility)

### Undefined Results

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Returning results a contract never specifies for a given input, leaving callers with undefined behavior.

Referenced by
[Postconditions](PRINCIPLES.md#arch-postconditions)

### Unknown Field Handling

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that a consumer ignore fields it does not recognize rather than fail on them.

Referenced by
[Forward Compatibility](PRINCIPLES.md#arch-forward-compatibility)

### Version Sprawl

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Contracts / Interfaces / Compatibility](LEXICON.md#lex-category-contracts-interfaces-compatibility)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which many concurrent versions accumulate and must be maintained.

Referenced by
[Versioning](PRINCIPLES.md#arch-versioning)

## Control / Coordination / Centralization

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Agreed Single Value Across Nodes

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for distributed nodes to agree on a single value despite failures.

Referenced by
[Consensus](PRINCIPLES.md#arch-consensus)

### Automatic Failover of Leadership

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to automatically elect a new leader when the current one fails.

Referenced by
[Leader Election](PRINCIPLES.md#arch-leader-election)

### Central Dependency Risk

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which centralizing configuration makes the whole system depend on one config source.

Referenced by
[Centralized Configuration](PRINCIPLES.md#arch-centralized-configuration)

### Central Orchestrator Bottleneck

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Routing every interaction through one central orchestrator that becomes a bottleneck and single point of failure.

Referenced by
[Choreography](PRINCIPLES.md#arch-choreography)

### Central-Orchestrator-Free Coordination

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for services to coordinate through events without a central orchestrator.

Referenced by
[Choreography](PRINCIPLES.md#arch-choreography)

### Centralized Control

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Concentrating decision-making authority in one place so nodes cannot act independently.

Referenced by
[Decentralization](PRINCIPLES.md#arch-decentralization)

### Centralized Control of Distributed Runtime

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to manage a distributed runtime's behavior from one central control point.

Referenced by
[Control Plane](PRINCIPLES.md#arch-control-plane)

### Centralized Coordinator Coupling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which routing a workflow through a central coordinator couples participants to it.

Referenced by
[Orchestration](PRINCIPLES.md#arch-orchestration)

### Config Store

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A central store that holds configuration values for many services to read.

Referenced by
[Centralized Configuration](PRINCIPLES.md#arch-centralized-configuration)

### Coordinator

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A component that directs the steps of a multi-service workflow in order.

Referenced by
[Orchestration](PRINCIPLES.md#arch-orchestration)

### Cost/Personal Data Exposure

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which aggregating all logs centrally raises storage cost and personal-data exposure.

Referenced by
[Centralized Logging](PRINCIPLES.md#arch-centralized-logging)

### Cross-Service Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to analyze behavior across services by querying their aggregated logs.

Referenced by
[Centralized Logging](PRINCIPLES.md#arch-centralized-logging)

### Fully Decentralized Control

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Leaving control fully decentralized with no central plane, so global runtime policy cannot be coordinated.

Referenced by
[Control Plane](PRINCIPLES.md#arch-control-plane)

### Identity Provider

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A central service that authenticates identities and issues credentials for others to trust.

Referenced by
[Centralized Authentication](PRINCIPLES.md#arch-centralized-authentication)

### Identity Provider Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which every login depends on the central identity provider staying available.

Referenced by
[Centralized Authentication](PRINCIPLES.md#arch-centralized-authentication)

### Independent Node Decisions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Letting each node decide independently with no agreement, so they diverge on shared state.

Referenced by
[Consensus](PRINCIPLES.md#arch-consensus)

### Independent Ownership

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for each node or team to own and control its part without central approval.

Referenced by
[Decentralization](PRINCIPLES.md#arch-decentralization)

### Local-Only Logs

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Leaving logs scattered on each host with no aggregation, so cross-service analysis is impossible.

Referenced by
[Centralized Logging](PRINCIPLES.md#arch-centralized-logging)

### Log Aggregation

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A facility that collects logs from many sources into one central store.

Referenced by
[Centralized Logging](PRINCIPLES.md#arch-centralized-logging)

### Management API

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A programmatic interface through which operators manage a distributed runtime's state.

Referenced by
[Control Plane](PRINCIPLES.md#arch-control-plane)

### Ordered Multi-Step Execution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to execute the steps of a workflow in a defined order.

Referenced by
[Orchestration](PRINCIPLES.md#arch-orchestration)

### Pure Choreography

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Coordinating a multi-step workflow purely through choreography when central orchestration is needed, scattering its logic.

Referenced by
[Orchestration](PRINCIPLES.md#arch-orchestration)

### Quorum

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that a majority of nodes agree before a decision commits.

Referenced by
[Consensus](PRINCIPLES.md#arch-consensus)

### Scattered Auth Implementations

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Reimplementing authentication separately in each service instead of centralizing it.

Referenced by
[Centralized Authentication](PRINCIPLES.md#arch-centralized-authentication)

### Scattered Configuration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Spreading configuration across many services with no single source, so values drift out of sync.

Referenced by
[Centralized Configuration](PRINCIPLES.md#arch-centralized-configuration)

### Single-Writer Coordination

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to designate one elected node as the sole writer to coordinate updates.

Referenced by
[Leader Election](PRINCIPLES.md#arch-leader-election)

### Split-Brain Coordination

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Two nodes both believing they are leader and acting independently, corrupting shared state.

Referenced by
[Leader Election](PRINCIPLES.md#arch-leader-election)

### Unified Config Management

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to manage all services' configuration from one place.

Referenced by
[Centralized Configuration](PRINCIPLES.md#arch-centralized-configuration)

### Unified Identity

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Control / Coordination / Centralization](LEXICON.md#lex-category-control-coordination-centralization)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to give users one identity recognized across all services.

Referenced by
[Centralized Authentication](PRINCIPLES.md#arch-centralized-authentication)

## Core Modular Design

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Anemic Encapsulation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Wrapping data in a class that exposes it through trivial getters and setters, leaving its invariants unprotected.

Referenced by
[Encapsulation](PRINCIPLES.md#arch-encapsulation)

### Blob Class

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A single class that absorbs many unrelated responsibilities, growing large and hard to change safely.

Referenced by
[Single Responsibility Principle (SRP)](PRINCIPLES.md#arch-single-responsibility)

### Bounded Context Ownership

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability for a team or module to own and control one bounded part of the system.

Referenced by
[Autonomy](PRINCIPLES.md#arch-autonomy)

### Canonical Source

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that each piece of knowledge have one authoritative definition rather than copies.

Referenced by
[Do Not Repeat Yourself (DRY)](PRINCIPLES.md#arch-duplicate-code)

### Centralized Runtime Control

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Concentrating runtime control in one place so otherwise-independent modules cannot act without it.

Referenced by
[Autonomy](PRINCIPLES.md#arch-autonomy)

### Change Isolation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to confine the impact of a change behind a boundary so callers are unaffected.

Referenced by
[Encapsulation](PRINCIPLES.md#arch-encapsulation)

### Context-Specific Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Baking one caller's specific assumptions into a component, preventing its reuse elsewhere.

Referenced by
[Reusability](PRINCIPLES.md#arch-reusability)

### Contract Compatibility

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that alternative implementations honor the same interface contract.

Contract
[Contract Compatibility](ALGORITHMS.md#algo-contract-compatibility)

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability)

### Coordination Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree of extra coordination required when components are made fully independent.

Referenced by
[Independence](PRINCIPLES.md#arch-independence)

### Copy-Paste Programming

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Duplicating code by copying and pasting instead of extracting a shared abstraction.

Referenced by
[Do Not Repeat Yourself (DRY)](PRINCIPLES.md#arch-duplicate-code)

### Cross-Cutting Leakage

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Letting a concern such as logging or security bleed into unrelated modules throughout the code.

Referenced by
[Separation of Concerns](PRINCIPLES.md#arch-separation-of-concerns)

### Deep Inheritance Hierarchy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Stacking many layers of subclassing, so behavior is scattered and fragile to change.

Referenced by
[Composition Over Inheritance](PRINCIPLES.md#arch-composition-over-inheritance)

### Deep Optimization

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The practice of optimizing heavily against a specific implementation's traits, which ties code to it.

Referenced by
[Replaceability](PRINCIPLES.md#arch-replaceability)

### Delegation

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Forwarding work to a contained collaborator object rather than inheriting the behavior.

Referenced by
[Composition Over Inheritance](PRINCIPLES.md#arch-composition-over-inheritance)

### Excessive Fragmentation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which splitting responsibilities too finely scatters logic across many small units.

Referenced by
[Single Responsibility Principle (SRP)](PRINCIPLES.md#arch-single-responsibility)

### Explicit Interfaces

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that a module interact only through declared interfaces, not its hidden internals.

Referenced by
[Information Hiding](PRINCIPLES.md#arch-information-hiding)

### Exposed Internals

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Making a module's internal fields and workings public, so callers depend on details that should be hidden.

Referenced by
[Encapsulation](PRINCIPLES.md#arch-encapsulation)

### Implementation-Specific Contracts

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Defining an interface around one implementation's quirks, so no alternative can satisfy it.

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability)

### Independent Testing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to test a component in isolation without standing up its collaborators.

Referenced by
[Independence](PRINCIPLES.md#arch-independence)

### Interface Conformance

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that each implementation fully conform to the shared interface's contract.

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability)

### Interface Definition

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that an abstraction expose a defined interface separate from its implementation.

Referenced by
[Abstraction](PRINCIPLES.md#arch-abstraction)

### Internal Refactoring

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to rework a module's internals freely as long as its interface stays stable.

Referenced by
[Information Hiding](PRINCIPLES.md#arch-information-hiding)

### Invariant Protection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to guarantee an object's rules always hold by controlling all access to its state.

Referenced by
[Encapsulation](PRINCIPLES.md#arch-encapsulation)

### Leaky Abstraction

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
An abstraction that forces callers to understand its underlying implementation to use it correctly.

Referenced by
[Information Hiding](PRINCIPLES.md#arch-information-hiding)

### Locality of Behavior

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which keeping related behavior together can conflict with removing all duplication.

Referenced by
[Do Not Repeat Yourself (DRY)](PRINCIPLES.md#arch-duplicate-code)

### Mixed Layers

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Interleaving different architectural layers' logic in one place instead of keeping each concern separate.

Referenced by
[Separation of Concerns](PRINCIPLES.md#arch-separation-of-concerns)

### Monolithic Procedures

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Writing large all-in-one procedures that cannot be recombined from smaller, independent parts.

Referenced by
[Composability](PRINCIPLES.md#arch-composability)

### Over-Generalization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which making code reusable for every case adds abstraction that harms clarity.

Referenced by
[Reusability](PRINCIPLES.md#arch-reusability)

### Over-Layering

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which adding separating layers introduces indirection that outweighs the separation gained.

Referenced by
[Separation of Concerns](PRINCIPLES.md#arch-separation-of-concerns)

### Over-Specialization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which pursuing tight cohesion can narrow a unit's purpose too far to reuse.

Referenced by
[High Cohesion](PRINCIPLES.md#arch-high-cohesion)

### Performance Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree of runtime cost added by composing behavior from many small, indirected parts.

Referenced by
[Composability](PRINCIPLES.md#arch-composability)

### Product Lines

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to build a family of related products from shared, reusable components.

Referenced by
[Reusability](PRINCIPLES.md#arch-reusability)

### Shared Libraries

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to factor common functionality into libraries reused across projects.

Referenced by
[Reusability](PRINCIPLES.md#arch-reusability)

### Shared Runtime Dependency

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Coupling supposedly-independent modules through a shared runtime component they all depend on.

Referenced by
[Independence](PRINCIPLES.md#arch-independence)

### Simplicity for Trivial Reuse

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which composition adds wiring that inheritance would make simpler for trivial reuse.

Referenced by
[Composition Over Inheritance](PRINCIPLES.md#arch-composition-over-inheritance)

### Specialized Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which optimizing for one implementation undermines the ability to swap implementations.

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability)

### Stable Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that an abstraction's meaning stay consistent even as its implementations change.

Referenced by
[Abstraction](PRINCIPLES.md#arch-abstraction)

### Strategy Swap

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to replace one interchangeable algorithm or implementation with another.

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability)

### Test Isolation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to exercise a unit under test without its dependencies interfering.

Referenced by
[Low Coupling](PRINCIPLES.md#arch-low-coupling)

### Tight Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Binding components so closely that a change in one forces changes in the others.

Referenced by
[Low Coupling](PRINCIPLES.md#arch-low-coupling)

### Vendor Swap

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to replace one vendor's implementation with another behind a stable interface.

Referenced by
[Replaceability](PRINCIPLES.md#arch-replaceability)

### YAGNI

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Core Modular Design](LEXICON.md#lex-category-core-modular-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
You Aren't Gonna Need It: build only what current requirements demand and defer speculative generality.

Aliases
You Aren't Gonna Need It

Referenced by
[Reusability](PRINCIPLES.md#arch-reusability)

## Core Vocabulary

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Acceptance Criteria

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Predefined conditions a deliverable must satisfy to be accepted as complete and correct.

Referenced by
[Validation](PRINCIPLES.md#arch-validation), [Model Evaluation](PRINCIPLES.md#arch-model-evaluation)

### Ambiguous Naming

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Identifiers whose meaning is unclear or open to multiple interpretations, obscuring intent.

Referenced by
[Semantic Contracts](PRINCIPLES.md#arch-semantic-contracts), [Semantic Consistency](PRINCIPLES.md#arch-semantic-consistency)

### Automated Enforcement

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Machine-applied checking that rules and policies hold, catching violations without manual review.

Referenced by
[Static Analysis](PRINCIPLES.md#arch-static-analysis), [Policy as Code](PRINCIPLES.md#arch-policy-as-code)

### Automation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The execution of tasks by software or machinery without manual intervention.

Referenced by
[Self-Describing Architecture](PRINCIPLES.md#arch-self-describing-architecture), [Self-Healing Architecture](PRINCIPLES.md#arch-self-healing-architecture)

### Boilerplate

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Repetitive, mandatory scaffolding code that adds ceremony without domain value.

Referenced by
[Ports and Adapters Architecture](PRINCIPLES.md#arch-ports-and-adapters-architecture), [Clean Architecture](PRINCIPLES.md#arch-clean-architecture), [Abstract Factory Pattern](PRINCIPLES.md#arch-abstract-factory-pattern), [Builder Pattern](PRINCIPLES.md#arch-builder-pattern)

### Boolean Flag Soup

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Representing state through many interdependent boolean flags, producing tangled and invalid combinations.

Referenced by
[State Pattern](PRINCIPLES.md#arch-state-pattern), [Finite State Machine](PRINCIPLES.md#arch-finite-state-machine)

### Capacity Planning

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Forecasting resource demand and provisioning capacity to meet it without waste or shortfall.

Contract
[Capacity Planning](ALGORITHMS.md#algo-capacity-planning)

Referenced by
[Resource Utilization](PRINCIPLES.md#arch-resource-utilization), [Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Code Generation

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Producing source code automatically from a higher-level model, schema, or specification.

Referenced by
[Metadata-Driven Design](PRINCIPLES.md#arch-metadata-driven-design), [Code as Data](PRINCIPLES.md#arch-code-as-data)

### Compatibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a component interoperates with other versions or systems without modification.

Referenced by
[Service Contract](PRINCIPLES.md#arch-service-contract), [Schema Contract](PRINCIPLES.md#arch-schema-contract), [Interoperability](PRINCIPLES.md#arch-interoperability), [Robustness Principle](PRINCIPLES.md#arch-robustness-principle)

### Composition Root

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The single startup location where an application's object graph is assembled and its dependencies wired.

Referenced by
[Inversion of Control (IoC)](PRINCIPLES.md#arch-inversion-of-control), [Dependency Injection](PRINCIPLES.md#arch-dependency-injection)

### Context

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The surrounding information and circumstances captured to make a decision, event, or log entry interpretable.

Referenced by
[Architecture Decision Records (ADR)](PRINCIPLES.md#arch-architecture-decision-records), [Logging](PRINCIPLES.md#arch-logging)

### Continuous Processing

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Handling data incrementally as it arrives, rather than in discrete scheduled batches.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream), [Streaming Architecture](PRINCIPLES.md#arch-streaming-architecture)

### Contracts

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Explicit, enforceable agreements specifying the inputs, outputs, and guarantees between components.

Aliases
Contract

Referenced by
[Impact Analysis](PRINCIPLES.md#arch-impact-analysis), [Component-Based Architecture](PRINCIPLES.md#arch-component-based-architecture), [Interoperability](PRINCIPLES.md#arch-interoperability), [Decentralization](PRINCIPLES.md#arch-decentralization), [Specification-Based Testing](PRINCIPLES.md#arch-specification-based-testing), [Capability Declaration](PRINCIPLES.md#arch-capability-declaration), [Extension Points](PRINCIPLES.md#arch-extension-points), [Type Safety](PRINCIPLES.md#arch-type-safety)

### Controlled Access

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Mediated, restricted access to a resource so that only permitted operations reach it.

Referenced by
[Authorization](PRINCIPLES.md#arch-authorization), [Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Controlled Evolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The managed, deliberate change of a system over time without breaking existing consumers.

Referenced by
[Versioning](PRINCIPLES.md#arch-versioning), [Governance](PRINCIPLES.md#arch-governance)

### Controlled Inputs

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Inputs that are fixed, bounded, or fully specified so that a computation's behavior is reproducible.

Referenced by
[Determinism](PRINCIPLES.md#arch-determinism), [Repeatability](PRINCIPLES.md#arch-repeatability)

### Cost

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The resource or financial expenditure required to build, run, or change a system.

Referenced by
[Verification](PRINCIPLES.md#arch-verification), [Fault Tolerance](PRINCIPLES.md#arch-fault-tolerance), [Environment Parity](PRINCIPLES.md#arch-environment-parity), [Redundancy](PRINCIPLES.md#arch-redundancy)

### Cross-Cutting Concerns

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Concerns such as logging, security, or transactions whose implementation spans many modules rather than localizing to one.

Referenced by
[Modularity](PRINCIPLES.md#arch-modularity), [Explicit Boundaries](PRINCIPLES.md#arch-explicit-boundaries)

### Cyclic Dependencies

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Dependencies that form a cycle among components, preventing independent build, test, or reasoning.

Referenced by
[Directed Acyclic Graph (DAG)](PRINCIPLES.md#arch-directed-acyclic-graph), [Low Coupling](PRINCIPLES.md#arch-low-coupling)

### Damage Limitation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Containing the blast radius of a failure or breach so its impact stays bounded.

Referenced by
[Fail Safe](PRINCIPLES.md#arch-fail-safe), [Least Privilege](PRINCIPLES.md#arch-least-privilege)

### Debugging

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The activity of locating and diagnosing the cause of a defect.

Referenced by
[Reproducibility](PRINCIPLES.md#arch-reproducibility), [Logging](PRINCIPLES.md#arch-logging), [Runtime Binding](PRINCIPLES.md#arch-runtime-binding)

### Delivery Speed

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The rate at which changes are delivered to production.

Referenced by
[Architecture Review](PRINCIPLES.md#arch-architecture-review), [Correctness](PRINCIPLES.md#arch-correctness), [Threat Modeling](PRINCIPLES.md#arch-threat-modeling), [Compliance](PRINCIPLES.md#arch-compliance)

### Discovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to locate available components, services, or capabilities at runtime.

Referenced by
[Introspection](PRINCIPLES.md#arch-introspection), [Plugin Architecture](PRINCIPLES.md#arch-plugin-architecture), [Service Registry](PRINCIPLES.md#arch-service-registry), [Registry Pattern](PRINCIPLES.md#arch-registry-pattern)

### DSLs

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Domain-specific languages, small notations tailored to express solutions within one problem domain.

Referenced by
[Homoiconicity](PRINCIPLES.md#arch-homoiconicity), [Metaprogramming](PRINCIPLES.md#arch-metaprogramming), [Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Evaluation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The systematic assessment of a model or system's behavior and quality against defined criteria.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance), [Model Safety](PRINCIPLES.md#arch-model-safety)

### Evidence

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Recorded proof that substantiates a claim, decision, or compliance requirement.

Referenced by
[Assessment](PRINCIPLES.md#arch-assessment), [Compliance](PRINCIPLES.md#arch-compliance)

### Explicit Inputs

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
All data a computation needs supplied through its parameters rather than read from ambient or hidden state.

Referenced by
[Pure Functions](PRINCIPLES.md#arch-pure-functions), [Stateless Processing](PRINCIPLES.md#arch-stateless-processing)

### Fallback

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
An alternative path or default invoked automatically when the primary operation fails or is unavailable.

Referenced by
[Graceful Degradation](PRINCIPLES.md#arch-graceful-degradation), [Circuit Breaker Pattern](PRINCIPLES.md#arch-circuit-breaker-pattern)

### False Positives

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Incorrect positive results reported when the detected condition is not present.

Referenced by
[Static Analysis](PRINCIPLES.md#arch-static-analysis), [Policy Enforcement](PRINCIPLES.md#arch-policy-enforcement), [Health Checks](PRINCIPLES.md#arch-health-checks)

### Hidden Dependencies

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Dependencies a component relies on but does not declare in its interface, surfacing only at runtime.

Referenced by
[Dependency Graph](PRINCIPLES.md#arch-dependency-graph), [Testability](PRINCIPLES.md#arch-testability)

### Hidden Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
State changes a function performs that are not evident from its name or signature, surprising callers.

Referenced by
[Principle of Least Surprise](PRINCIPLES.md#arch-principle-of-least-surprise), [Controlled Side Effects](PRINCIPLES.md#arch-controlled-side-effects)

### Independent Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to release a component to production without coordinating the deployment of others.

Referenced by
[Microservices](PRINCIPLES.md#arch-microservices), [Service Contract](PRINCIPLES.md#arch-service-contract), [Low Coupling](PRINCIPLES.md#arch-low-coupling), [Independence](PRINCIPLES.md#arch-independence), [Service Autonomy](PRINCIPLES.md#arch-service-autonomy)

### Independent Work Units

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Work partitioned into discrete units that execute in isolation, without shared mutable state or ordering dependencies.

Referenced by
[Parallelism](PRINCIPLES.md#arch-parallelism), [Fan-out/Fan-in](PRINCIPLES.md#arch-fan-out-fan-in)

### Iteration Speed

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The rate at which cycles of change and feedback can be completed.

Referenced by
[Design Review](PRINCIPLES.md#arch-design-review), [Contract-First Design](PRINCIPLES.md#arch-contract-first-design), [Validation](PRINCIPLES.md#arch-validation)

### Large Input Handling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to process inputs too large to fit in memory, through streaming or chunking.

Referenced by
[Memory Efficiency](PRINCIPLES.md#arch-memory-efficiency), [Single-Pass Processing](PRINCIPLES.md#arch-single-pass-processing)

### Legal-Transition Enforcement

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Rejecting any state change that is not a permitted transition.

Referenced by
[State Pattern](PRINCIPLES.md#arch-state-pattern), [Finite State Machine](PRINCIPLES.md#arch-finite-state-machine)

### Message Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The agreed schema and semantics of messages exchanged between components.

Aliases
Message Contracts

Referenced by
[Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture), [Message Queue](PRINCIPLES.md#arch-message-queue), [Integration Events](PRINCIPLES.md#arch-integration-events), [Asynchronous Communication](PRINCIPLES.md#arch-asynchronous-communication)

### Metadata

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Descriptive data about a system's structure, capabilities, or content, consumed to drive behavior.

Referenced by
[Self-Describing Architecture](PRINCIPLES.md#arch-self-describing-architecture), [Self-Describing API](PRINCIPLES.md#arch-self-describing-api), [Runtime Discovery](PRINCIPLES.md#arch-runtime-discovery), [Auto-Discovery](PRINCIPLES.md#arch-auto-discovery)

### Metrics

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Quantitative measurements a system emits about its state and behavior for monitoring and analysis.

Referenced by
[Model Evaluation](PRINCIPLES.md#arch-model-evaluation), [Observability](PRINCIPLES.md#arch-observability), [Monitoring](PRINCIPLES.md#arch-monitoring), [Elasticity](PRINCIPLES.md#arch-elasticity), [Bottleneck Analysis](PRINCIPLES.md#arch-bottleneck-analysis), [Auto-Scaling](PRINCIPLES.md#arch-auto-scaling)

### Model Drift

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The gradual loss of a model's fidelity to the reality it represents, as data or conditions change over time.

Referenced by
[Model-Driven Architecture](PRINCIPLES.md#arch-model-driven-architecture)

### Operational Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The effort and intricacy required to deploy, run, and maintain a system in production.

Referenced by
[Microservices](PRINCIPLES.md#arch-microservices), [Service Discovery](PRINCIPLES.md#arch-service-discovery), [Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Ownership

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A clear assignment of responsibility for a component to a person or team.

Referenced by
[Explicit Boundaries](PRINCIPLES.md#arch-explicit-boundaries), [Single Source of Truth](PRINCIPLES.md#arch-single-source-of-truth), [State Isolation](PRINCIPLES.md#arch-state-isolation)

### Plugin Swap

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Replacing one plugin implementation with another at a defined seam without modifying the host.

Referenced by
[Interchangeability](PRINCIPLES.md#arch-interchangeability), [Dynamic Binding](PRINCIPLES.md#arch-dynamic-binding)

### Plugins

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Independently-developed components that attach to a host at defined extension points to add capabilities.

Referenced by
[Metadata-Driven Design](PRINCIPLES.md#arch-metadata-driven-design), [Inversion of Control (IoC)](PRINCIPLES.md#arch-inversion-of-control)

### Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A declared set of rules governing what actions are permitted or denied within a system.

Aliases
Policies

Referenced by
[Control Plane](PRINCIPLES.md#arch-control-plane), [Authorization](PRINCIPLES.md#arch-authorization), [Governance](PRINCIPLES.md#arch-governance)

### Ports and Adapters

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
An architecture isolating core logic behind ports, with adapters binding it to external technologies.

Referenced by
[Hexagonal Architecture](PRINCIPLES.md#arch-hexagonal-architecture), [Replaceability](PRINCIPLES.md#arch-replaceability), [Dependency Inversion Principle (DIP)](PRINCIPLES.md#arch-dependency-inversion)

### Pub/Sub

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A messaging pattern in which publishers emit messages to topics and subscribers receive them without direct coupling.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker), [Event Bus](PRINCIPLES.md#arch-event-bus)

### Race Conditions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A defect where the outcome depends on the uncontrolled interleaving of concurrent operations.

Referenced by
[Happens-Before Relationship](PRINCIPLES.md#arch-happens-before-relationship), [Concurrency](PRINCIPLES.md#arch-concurrency), [Concurrency Control](PRINCIPLES.md#arch-concurrency-control)

### Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Restoring a system to correct operation or a consistent state after a failure.

Referenced by
[Resilience](PRINCIPLES.md#arch-resilience), [Rollback](PRINCIPLES.md#arch-rollback)

### Replay

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to re-process a recorded sequence of events to reconstruct or recover state.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream), [Event Sourcing](PRINCIPLES.md#arch-event-sourcing), [Append-Only Log](PRINCIPLES.md#arch-append-only-log)

### Reuse

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Using an existing component, module, or solution in a new context rather than rebuilding it.

Referenced by
[Standardization](PRINCIPLES.md#arch-standardization), [Component-Based Architecture](PRINCIPLES.md#arch-component-based-architecture)

### Runtime Indirection

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Resolving a binding or call target at runtime through an intermediary layer rather than a direct, static reference.

Referenced by
[Low Coupling](PRINCIPLES.md#arch-low-coupling), [Dependency Inversion Principle (DIP)](PRINCIPLES.md#arch-dependency-inversion)

### Safe Defaults

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Choosing default configurations and behaviors that are safe when left unchanged.

Referenced by
[Fail Safe](PRINCIPLES.md#arch-fail-safe), [Secure by Default](PRINCIPLES.md#arch-secure-by-default)

### Safe Refactoring

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Changing a system's internal structure with confidence that its observable behavior is preserved.

Referenced by
[Invariants](PRINCIPLES.md#arch-invariants), [Predictability](PRINCIPLES.md#arch-predictability)

### Safe Substitution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Replacing a component or expression with an equivalent one without altering program correctness.

Referenced by
[Referential Transparency](PRINCIPLES.md#arch-referential-transparency), [Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution)

### Saga

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A pattern that manages a distributed transaction as a sequence of local transactions, each with a compensating action for rollback.

Referenced by
[Orchestration](PRINCIPLES.md#arch-orchestration), [Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture)

### Schema

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of the structure, types, and constraints of data.

Referenced by
[API Contract](PRINCIPLES.md#arch-api-contract), [Data Contract](PRINCIPLES.md#arch-data-contract), [Self-Describing Structures](PRINCIPLES.md#arch-self-describing-structures), [Input Validation](PRINCIPLES.md#arch-input-validation)

### Secure Defaults

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Making the default configuration the most secure option, requiring explicit action to reduce security.

Referenced by
[Fail Secure](PRINCIPLES.md#arch-fail-secure), [Security by Design](PRINCIPLES.md#arch-security-by-design)

### Self-Healing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability of a system to detect and recover from failures without human intervention.

Referenced by
[Resilience](PRINCIPLES.md#arch-resilience), [Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery), [Health Checks](PRINCIPLES.md#arch-health-checks), [Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Silent Failure

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A failure that occurs without surfacing any error, log, or signal, leaving it undetected.

Referenced by
[Fail Fast](PRINCIPLES.md#arch-fail-fast), [Logging](PRINCIPLES.md#arch-logging), [Alerting](PRINCIPLES.md#arch-alerting)

### Single Point of Failure

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A component whose failure alone halts the entire system because it has no redundancy.

Referenced by
[Fault Tolerance](PRINCIPLES.md#arch-fault-tolerance), [Redundancy](PRINCIPLES.md#arch-redundancy)

### Specification

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A precise, authoritative description of required behavior, structure, or interface.

Referenced by
[Correctness](PRINCIPLES.md#arch-correctness), [Specification-Based Testing](PRINCIPLES.md#arch-specification-based-testing), [Verification](PRINCIPLES.md#arch-verification)

### Stable Contracts

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Interfaces and agreements that remain unchanged over time so that consumers can depend on them safely.

Referenced by
[Uniform Interface](PRINCIPLES.md#arch-uniform-interface), [Reusability](PRINCIPLES.md#arch-reusability)

### Standards

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Agreed conventions and specifications that components conform to for interoperability and consistency.

Referenced by
[Interoperability](PRINCIPLES.md#arch-interoperability), [Portability](PRINCIPLES.md#arch-portability), [Governance](PRINCIPLES.md#arch-governance)

### Thresholds

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Configured boundary values that trigger an alert or action when a measured metric crosses them.

Referenced by
[Monitoring](PRINCIPLES.md#arch-monitoring), [Alerting](PRINCIPLES.md#arch-alerting)

### Time Budget

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A bounded maximum amount of time allotted for an operation to complete.

Referenced by
[Timeout Pattern](PRINCIPLES.md#arch-timeout-pattern), [Latency](PRINCIPLES.md#arch-latency)

### Time Cost

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The amount of time an activity requires, weighed as a cost against its benefit.

Referenced by
[Assessment](PRINCIPLES.md#arch-assessment), [Gap Analysis](PRINCIPLES.md#arch-gap-analysis)

### Type Metadata

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Descriptive data about the types of a structure's fields, available for inspection at runtime.

Referenced by
[Self-Describing Structures](PRINCIPLES.md#arch-self-describing-structures), [Introspection](PRINCIPLES.md#arch-introspection)

### Undo/Redo

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Core Vocabulary](LEXICON.md#lex-category-core-vocabulary)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to reverse a previously applied operation and to reapply it.

Referenced by
[Command Pattern](PRINCIPLES.md#arch-command-pattern), [Memento Pattern](PRINCIPLES.md#arch-memento-pattern)

## Correctness / Determinism / Verification

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Allocation Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree of extra memory allocation incurred by creating new immutable values instead of mutating in place.

Referenced by
[Immutability](PRINCIPLES.md#arch-immutability)

### Assumption-Driven Delivery

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Shipping on untested assumptions about behavior instead of validating that requirements are met.

Referenced by
[Validation](PRINCIPLES.md#arch-validation)

### Behavior Validation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to confirm a system behaves as its specification requires.

Referenced by
[Specification-Based Testing](PRINCIPLES.md#arch-specification-based-testing)

### Broad Input Exploration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to exercise a function across a wide, generated range of inputs.

Referenced by
[Property-Based Testing](PRINCIPLES.md#arch-property-based-testing)

### Continuous Updates

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which pinning everything for reproducibility conflicts with continuously updating dependencies.

Referenced by
[Reproducibility](PRINCIPLES.md#arch-reproducibility)

### Controlled State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that all inputs and state affecting a computation be controlled and known.

Referenced by
[Determinism](PRINCIPLES.md#arch-determinism)

### Cost/Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree of cost and complexity added by formally proving a system correct.

Referenced by
[Formal Verification](PRINCIPLES.md#arch-formal-verification)

### Deterministic Behavior

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that the code under test produce the same result for the same inputs.

Referenced by
[Testability](PRINCIPLES.md#arch-testability)

### Dynamic Runtime Behavior

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which runtime-adaptive behavior undermines a system's predictability.

Referenced by
[Predictability](PRINCIPLES.md#arch-predictability)

### Encapsulation Extremes

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which hiding internals too strictly makes a unit's behavior hard to observe in tests.

Referenced by
[Testability](PRINCIPLES.md#arch-testability)

### Environment-Sensitive Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Behavior that changes with the host environment, so the same run yields different results elsewhere.

Referenced by
[Repeatability](PRINCIPLES.md#arch-repeatability)

### Example-Only Testing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Testing only a few hand-picked examples instead of properties that must hold across all inputs.

Referenced by
[Property-Based Testing](PRINCIPLES.md#arch-property-based-testing)

### Fitness for Use

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which a product meets the needs of its users.

Referenced by
[Validation](PRINCIPLES.md#arch-validation)

### Floating Dependencies

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Depending on unpinned, floating dependency versions, so builds are not reproducible.

Referenced by
[Reproducibility](PRINCIPLES.md#arch-reproducibility)

### Formal Specification

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
A precise, mathematical statement of what a system must do, against which it is proven.

Referenced by
[Formal Verification](PRINCIPLES.md#arch-formal-verification)

### Hidden Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Behavior triggered by hidden state or side effects, so outcomes surprise callers.

Referenced by
[Predictability](PRINCIPLES.md#arch-predictability)

### Hidden IO

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Performing input/output inside a supposedly pure function, hiding side effects from callers.

Referenced by
[Pure Functions](PRINCIPLES.md#arch-pure-functions)

### Hidden Time/Randomness/Global State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Reading the clock, randomness, or global state inside a computation, making its output nondeterministic.

Referenced by
[Determinism](PRINCIPLES.md#arch-determinism)

### Implementation-Only Testing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Testing only against the current implementation's behavior rather than the specified contract.

Referenced by
[Specification-Based Testing](PRINCIPLES.md#arch-specification-based-testing)

### Informal Validation Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Relying only on informal checks and testing where a formal proof of correctness is warranted.

Referenced by
[Formal Verification](PRINCIPLES.md#arch-formal-verification)

### Mathematical Assurance

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to prove mathematically that a system meets its specification.

Referenced by
[Formal Verification](PRINCIPLES.md#arch-formal-verification)

### No Side Effects

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that a function compute its result without observable side effects.

Referenced by
[Pure Functions](PRINCIPLES.md#arch-pure-functions)

### Properties/Invariants

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that the general properties or invariants a function must satisfy be defined.

Referenced by
[Property-Based Testing](PRINCIPLES.md#arch-property-based-testing)

### Real-World Variability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which controlling conditions for repeatability diverges from real-world variability.

Referenced by
[Repeatability](PRINCIPLES.md#arch-repeatability)

### Regression Safety

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to catch regressions when code changes by re-running tests.

Referenced by
[Testability](PRINCIPLES.md#arch-testability)

### Reliable Automation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to automate a process reliably because it repeats identically each run.

Referenced by
[Repeatability](PRINCIPLES.md#arch-repeatability)

### Reliable Testing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to test dependably because the same inputs always produce the same outputs.

Referenced by
[Determinism](PRINCIPLES.md#arch-determinism)

### Ruleset

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The set of rules a static analyzer checks source code against.

Referenced by
[Static Analysis](PRINCIPLES.md#arch-static-analysis)

### Runtime Adaptivity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which making behavior deterministic limits adapting dynamically at runtime.

Referenced by
[Determinism](PRINCIPLES.md#arch-determinism)

### Safe Operation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to operate without producing incorrect or harmful results.

Referenced by
[Correctness](PRINCIPLES.md#arch-correctness)

### Safe Sharing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to share data freely across threads because it cannot be modified.

Referenced by
[Immutability](PRINCIPLES.md#arch-immutability)

### Shrinking/Debug Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which reducing a failing generated case to a minimal example adds debugging complexity.

Referenced by
[Property-Based Testing](PRINCIPLES.md#arch-property-based-testing)

### Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Producing observable side effects in an expression, so it cannot be replaced by its value.

Referenced by
[Referential Transparency](PRINCIPLES.md#arch-referential-transparency)

### Spec Maintenance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree of ongoing effort to keep a specification current as the system evolves.

Referenced by
[Specification-Based Testing](PRINCIPLES.md#arch-specification-based-testing)

### Specification Compliance

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The ability to confirm an implementation conforms to its specification.

Referenced by
[Verification](PRINCIPLES.md#arch-verification)

### Stateful IO

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which stateful input/output conflicts with expressions being replaceable by their values.

Referenced by
[Referential Transparency](PRINCIPLES.md#arch-referential-transparency)

### Stateful Operations

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which operations that depend on or mutate state conflict with purity.

Referenced by
[Pure Functions](PRINCIPLES.md#arch-pure-functions)

### Tests

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Executable checks that assert a system behaves as intended.

Referenced by
[Correctness](PRINCIPLES.md#arch-correctness)

### Thread Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The degree to which data can be accessed concurrently without corruption.

Referenced by
[Immutability](PRINCIPLES.md#arch-immutability)

### Unchecked Dynamic Code

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Running dynamically generated or evaluated code that static analysis cannot inspect for defects.

Referenced by
[Static Analysis](PRINCIPLES.md#arch-static-analysis)

### Undefined Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Relying on operations whose result is unspecified, so outcomes vary unpredictably across runs or platforms.

Referenced by
[Correctness](PRINCIPLES.md#arch-correctness)

### Untested Implementation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
Shipping code with no tests, so its conformance to the specification is unverified.

Referenced by
[Verification](PRINCIPLES.md#arch-verification)

### Value Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that values be compared and copied by content rather than by reference identity.

Referenced by
[Immutability](PRINCIPLES.md#arch-immutability)

### Versioned Inputs

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Correctness / Determinism / Verification](LEXICON.md#lex-category-correctness-determinism-verification)
- Layer: [Computation Core](SCHEMA.md#layer-computation-core)

Details

Definition
The requirement that all inputs to a build or computation be pinned to specific versions.

Referenced by
[Reproducibility](PRINCIPLES.md#arch-reproducibility)

## Creational Patterns

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Cloneable Template Object

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that a prototype object support being copied to produce new instances.

Referenced by
[Prototype Pattern](PRINCIPLES.md#arch-prototype-pattern)

### Complex Construction

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of complexity in assembling an object that motivates a step-by-step builder.

Referenced by
[Builder Pattern](PRINCIPLES.md#arch-builder-pattern)

### Complex Factory Hierarchies

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Building elaborate parallel factory class hierarchies where cloning an existing configured instance would suffice.

Referenced by
[Prototype Pattern](PRINCIPLES.md#arch-prototype-pattern)

### Concrete Constructor Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Instantiating concrete classes directly with constructors, coupling callers to specific implementations.

Referenced by
[Factory Method Pattern](PRINCIPLES.md#arch-factory-method-pattern)

### Controlled Instantiation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to govern how and when an object is created.

Referenced by
[Singleton Pattern](PRINCIPLES.md#arch-singleton-pattern)

### Copy Semantics

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of care required to define correct deep versus shallow copying when cloning objects.

Referenced by
[Prototype Pattern](PRINCIPLES.md#arch-prototype-pattern)

### Creation Variation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
A precondition that different variants of a product must be produced depending on runtime context.

Referenced by
[Factory Pattern](PRINCIPLES.md#arch-factory-pattern)

### Deferred Instantiation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to let subclasses decide which class to instantiate, deferring the choice from the base class.

Referenced by
[Factory Method Pattern](PRINCIPLES.md#arch-factory-method-pattern)

### Dynamic Object Creation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to create new objects at runtime by cloning existing configured instances.

Referenced by
[Prototype Pattern](PRINCIPLES.md#arch-prototype-pattern)

### Family-Level Replacement

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to swap an entire family of related products by changing a single factory.

Referenced by
[Abstract Factory Pattern](PRINCIPLES.md#arch-abstract-factory-pattern)

### Global Mutable State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Exposing global variables that any code can mutate, creating hidden coupling and nondeterminism.

Referenced by
[Singleton Pattern](PRINCIPLES.md#arch-singleton-pattern)

### Inheritance Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which relying on subclassing to vary creation adds to the inheritance hierarchy's complexity.

Referenced by
[Factory Method Pattern](PRINCIPLES.md#arch-factory-method-pattern)

### Mixed Product Families

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Combining products from different incompatible families, producing inconsistent sets of objects.

Referenced by
[Abstract Factory Pattern](PRINCIPLES.md#arch-abstract-factory-pattern)

### Polymorphic Construction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to create objects through a common interface without naming their concrete classes.

Referenced by
[Factory Pattern](PRINCIPLES.md#arch-factory-pattern)

### Related Product Variants

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that products form families of related variants meant to be used together.

Referenced by
[Abstract Factory Pattern](PRINCIPLES.md#arch-abstract-factory-pattern)

### Scattered Construction Logic

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Spreading object-creation logic across many call sites instead of centralizing it in a factory.

Referenced by
[Factory Pattern](PRINCIPLES.md#arch-factory-pattern)

### Shared Resource Access

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to give many callers coordinated access to one shared resource.

Referenced by
[Singleton Pattern](PRINCIPLES.md#arch-singleton-pattern)

### Single-Instance Need

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
A precondition that exactly one instance of a type must exist across the system.

Referenced by
[Singleton Pattern](PRINCIPLES.md#arch-singleton-pattern)

### Subclass-Controlled Creation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that subclasses determine which concrete product a creator instantiates.

Referenced by
[Factory Method Pattern](PRINCIPLES.md#arch-factory-method-pattern)

### Telescoping Constructor

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Overloading constructors with ever more parameters to cover optional fields, producing unreadable call sites.

Referenced by
[Builder Pattern](PRINCIPLES.md#arch-builder-pattern)

### Valid Object Creation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Creational Patterns](LEXICON.md#lex-category-creational-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to construct an object only once all its required parts are supplied and validated.

Referenced by
[Builder Pattern](PRINCIPLES.md#arch-builder-pattern)

## Domain Architecture

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Aggregate Size

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which enlarging an aggregate to enforce invariants increases contention and load on it.

Referenced by
[Aggregate](PRINCIPLES.md#arch-aggregate)

### Anemic Model

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
A domain model holding only data with no behavior, pushing all logic into separate procedures.

Referenced by
[Domain Model](PRINCIPLES.md#arch-domain-model)

### Anemic Transaction Script

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
Implementing business logic as procedural scripts over data-only objects, with no rich domain model.

Referenced by
[Domain-Driven Design (DDD)](PRINCIPLES.md#arch-domain-driven-design)

### Business Rule Encapsulation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to keep business rules inside the domain objects they govern.

Referenced by
[Domain Model](PRINCIPLES.md#arch-domain-model)

### Cross-Context Reuse

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which isolating each context's model limits reusing models across contexts.

Referenced by
[Bounded Context](PRINCIPLES.md#arch-bounded-context)

### Cross-Entity Domain Logic

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to place logic that spans several entities in a dedicated domain service.

Referenced by
[Domain Service](PRINCIPLES.md#arch-domain-service)

### Documentation Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree of ongoing effort to document and maintain the map of relationships between contexts.

Referenced by
[Context Mapping](PRINCIPLES.md#arch-context-mapping)

### Domain Alignment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to keep the software model closely aligned with the business domain it serves.

Referenced by
[Domain-Driven Design (DDD)](PRINCIPLES.md#arch-domain-driven-design)

### Domain Purity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which the domain model stays free of external and infrastructure concerns.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer)

### Explicit Boundary

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The requirement that a clear boundary separate the domain from external systems it integrates with.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer)

### Identity-Based Equality

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to treat two objects as the same when they share an identity, regardless of their attributes.

Referenced by
[Entity](PRINCIPLES.md#arch-entity)

### Implicit Integration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
Integrating contexts through undocumented, assumed connections instead of explicit, mapped relationships.

Referenced by
[Context Mapping](PRINCIPLES.md#arch-context-mapping)

### Integration Clarity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which relationships between contexts are made explicit and understandable.

Referenced by
[Context Mapping](PRINCIPLES.md#arch-context-mapping)

### Legacy/System Integration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to integrate a legacy or external system without letting its model corrupt the domain.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer)

### Lifecycle Tracking

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to track an entity as the same thing through changes over its lifetime.

Referenced by
[Entity](PRINCIPLES.md#arch-entity)

### Object Count

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which modeling many concepts as distinct value objects increases the number of objects.

Referenced by
[Value Object](PRINCIPLES.md#arch-value-object)

### Persistence Simplicity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which a rich domain model complicates straightforward mapping to storage.

Referenced by
[Domain Model](PRINCIPLES.md#arch-domain-model)

### Relationship Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The requirement that each relationship between bounded contexts carry a defined meaning.

Referenced by
[Context Mapping](PRINCIPLES.md#arch-context-mapping)

### Root-Guarded Invariants

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to enforce an aggregate's invariants by routing all changes through its root.

Referenced by
[Aggregate](PRINCIPLES.md#arch-aggregate)

### Self-Validating Values

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability for a value object to guarantee its own validity at construction.

Referenced by
[Value Object](PRINCIPLES.md#arch-value-object)

### Shared Global Model

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
Forcing one global model across the whole system, so unrelated parts are coupled through it.

Referenced by
[Bounded Context](PRINCIPLES.md#arch-bounded-context)

### Shared Model Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
Coupling a domain to an external system's model by sharing it directly, so their changes ripple across.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer)

### Side-Effect-Free Equality

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to compare value objects by their contents with no side effects.

Referenced by
[Value Object](PRINCIPLES.md#arch-value-object)

### Simple CRUD

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The degree to which a full domain model adds overhead where simple create-read-update-delete would suffice.

Referenced by
[Domain-Driven Design (DDD)](PRINCIPLES.md#arch-domain-driven-design)

### Stable Identity

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The requirement that an entity keep one stable identifier throughout its lifetime.

Referenced by
[Entity](PRINCIPLES.md#arch-entity)

### Transactional Consistency Boundary

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The ability to treat an aggregate as the unit within which invariants hold atomically.

Referenced by
[Aggregate](PRINCIPLES.md#arch-aggregate)

### Translation Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
A mapping between an external system's concepts and the domain's own, keeping the two vocabularies separate.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer)

### Value Equality

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Domain Architecture](LEXICON.md#lex-category-domain-architecture)
- Layer: [Domain Modeling](SCHEMA.md#layer-domain-modeling)

Details

Definition
The requirement that two value objects be treated as equal when all their attributes match.

Referenced by
[Value Object](PRINCIPLES.md#arch-value-object)

## Error Handling / Resilience

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### All-Or-Nothing Failure

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Failing the entire system when one part fails instead of degrading to reduced but working service.

Referenced by
[Graceful Degradation](PRINCIPLES.md#arch-graceful-degradation)

### Alternate Behavior

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a defined alternate behavior exist to use when the primary path fails.

Referenced by
[Fallback Pattern](PRINCIPLES.md#arch-fallback-pattern)

### Availability of Degraded Dependency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which tripping a breaker to protect the system also cuts off a still-partly-working dependency.

Referenced by
[Circuit Breaker Pattern](PRINCIPLES.md#arch-circuit-breaker-pattern)

### Backoff

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Progressively increasing the wait between retries to avoid overwhelming a recovering dependency.

Referenced by
[Retry Pattern](PRINCIPLES.md#arch-retry-pattern)

### Blast-Radius Reduction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to contain a failure so it affects only one isolated partition.

Referenced by
[Bulkhead Pattern](PRINCIPLES.md#arch-bulkhead-pattern)

### Bounded Waiting

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to guarantee an operation waits no longer than a set limit.

Referenced by
[Timeout Pattern](PRINCIPLES.md#arch-timeout-pattern)

### Brittle Architecture

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A fragile design that breaks entirely under any condition it was not explicitly built for.

Referenced by
[Resilience](PRINCIPLES.md#arch-resilience)

### Capacity Signaling

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that downstream capacity be signaled upstream so producers adjust their rate.

Referenced by
[Backpressure](PRINCIPLES.md#arch-backpressure)

### Cascading Failure Prevention

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to stop one component's failure from cascading through its callers.

Referenced by
[Circuit Breaker Pattern](PRINCIPLES.md#arch-circuit-breaker-pattern)

### Consistency / Feature Completeness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which serving reduced functionality during failure sacrifices full consistency or completeness.

Referenced by
[Graceful Degradation](PRINCIPLES.md#arch-graceful-degradation)

### Continued Operation Under Failure

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to keep operating correctly despite the failure of some components.

Referenced by
[Fault Tolerance](PRINCIPLES.md#arch-fault-tolerance)

### Controlled Failure

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to fail in a defined, handled way rather than crashing unpredictably.

Referenced by
[Error Handling](PRINCIPLES.md#arch-error-handling)

### Deny-by-Default Behavior

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to default to denying access when a security check cannot complete.

Referenced by
[Fail Secure](PRINCIPLES.md#arch-fail-secure)

### Early Defect Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to surface a defect immediately at its source rather than letting it propagate.

Referenced by
[Fail Fast](PRINCIPLES.md#arch-fail-fast)

### Error Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A structured representation of the kinds of errors a system can raise and how they are categorized.

Referenced by
[Error Handling](PRINCIPLES.md#arch-error-handling)

### Exception Swallowing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Catching an exception and silently discarding it, hiding the failure from callers and logs.

Referenced by
[Error Handling](PRINCIPLES.md#arch-error-handling)

### Fail Open

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Granting access or continuing when a security check fails, exposing the system on error.

Referenced by
[Fail Secure](PRINCIPLES.md#arch-fail-secure)

### Failure Isolation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a failure be contained within a boundary so it cannot spread.

Referenced by
[Error Boundaries](PRINCIPLES.md#arch-error-boundaries)

### Failure Propagation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Letting a failure spread unchecked across component boundaries instead of containing it.

Referenced by
[Error Boundaries](PRINCIPLES.md#arch-error-boundaries)

### Failure Threshold

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement of a defined failure count or rate at which a circuit breaker trips.

Referenced by
[Circuit Breaker Pattern](PRINCIPLES.md#arch-circuit-breaker-pattern)

### Feature Isolation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that individual features be isolated so one can be disabled without taking down others.

Referenced by
[Graceful Degradation](PRINCIPLES.md#arch-graceful-degradation)

### Fragile Parsing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Parsing input so rigidly that any minor deviation causes a failure.

Referenced by
[Robustness Principle](PRINCIPLES.md#arch-robustness-principle)

### Hidden Errors

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which catching failures at a boundary can obscure the underlying errors from view.

Referenced by
[Error Boundaries](PRINCIPLES.md#arch-error-boundaries)

### Infinite Wait

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Waiting indefinitely for an operation that may never complete, tying up resources.

Referenced by
[Timeout Pattern](PRINCIPLES.md#arch-timeout-pattern)

### Load Amplification

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which retrying failed operations multiplies load on an already-struggling dependency.

Referenced by
[Retry Pattern](PRINCIPLES.md#arch-retry-pattern)

### Localized Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to recover from a failure within its boundary without restarting the whole system.

Referenced by
[Error Boundaries](PRINCIPLES.md#arch-error-boundaries)

### Non-Idempotent Operation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
An operation whose repetition changes the result, making it unsafe to retry.

Referenced by
[Retry Pattern](PRINCIPLES.md#arch-retry-pattern)

### Overload Protection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to protect a system from being overwhelmed by shedding or slowing incoming load.

Referenced by
[Backpressure](PRINCIPLES.md#arch-backpressure)

### Resource Isolation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that resources be partitioned so exhaustion in one pool cannot starve others.

Referenced by
[Bulkhead Pattern](PRINCIPLES.md#arch-bulkhead-pattern)

### Safe Failure

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to fail without corrupting state or causing further damage.

Referenced by
[Defensive Programming](PRINCIPLES.md#arch-defensive-programming)

### Shared Resource Pool

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Serving all work from one shared resource pool, so one overloaded consumer starves the rest.

Referenced by
[Bulkhead Pattern](PRINCIPLES.md#arch-bulkhead-pattern)

### Single Behavior Path

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Providing only one execution path with no fallback, so any failure in it fails the whole request.

Referenced by
[Fallback Pattern](PRINCIPLES.md#arch-fallback-pattern)

### Slow Operation Tolerance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which enforcing timeouts sacrifices tolerance for legitimately slow operations.

Referenced by
[Timeout Pattern](PRINCIPLES.md#arch-timeout-pattern)

### Stability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a system keeps operating steadily without collapsing under load.

Referenced by
[Backpressure](PRINCIPLES.md#arch-backpressure)

### Stability Under Stress

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to keep functioning under load spikes and adverse conditions.

Referenced by
[Resilience](PRINCIPLES.md#arch-resilience)

### Stale/Reduced Results

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which serving a fallback yields stale or reduced-quality results.

Referenced by
[Fallback Pattern](PRINCIPLES.md#arch-fallback-pattern)

### Strict Output

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a component emit only strictly conformant, well-formed output.

Referenced by
[Robustness Principle](PRINCIPLES.md#arch-robustness-principle)

### Strict Validation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which rejecting deviant input conflicts with accepting it tolerantly.

Referenced by
[Robustness Principle](PRINCIPLES.md#arch-robustness-principle)

### Timeout

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that an operation be given a maximum time to complete before being abandoned.

Referenced by
[Retry Pattern](PRINCIPLES.md#arch-retry-pattern)

### Tolerant Input

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a component accept and cope with input that deviates from the ideal format.

Referenced by
[Robustness Principle](PRINCIPLES.md#arch-robustness-principle)

### Transient Failure Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to recover from short-lived failures by retrying the operation.

Referenced by
[Retry Pattern](PRINCIPLES.md#arch-retry-pattern)

### Trusting Invalid Inputs

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Assuming inputs are valid and using them without checking, so bad data flows through unguarded.

Referenced by
[Defensive Programming](PRINCIPLES.md#arch-defensive-programming)

### Unbounded Ingestion

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Accepting incoming work with no limit, so a fast producer overwhelms a slower consumer.

Referenced by
[Backpressure](PRINCIPLES.md#arch-backpressure)

### Unbounded Retry

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Retrying a failing operation endlessly with no limit, amplifying load and delaying recovery.

Referenced by
[Circuit Breaker Pattern](PRINCIPLES.md#arch-circuit-breaker-pattern)

### Unsafe Default Continuation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Continuing in an unsafe default state after a failure instead of stopping in a safe one.

Referenced by
[Fail Safe](PRINCIPLES.md#arch-fail-safe)

### Verbosity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Error Handling / Resilience](LEXICON.md#lex-category-error-handling-resilience)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which pervasive defensive checks add verbosity and clutter to the code.

Referenced by
[Defensive Programming](PRINCIPLES.md#arch-defensive-programming)

## Event Messaging Async

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Asynchronous Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to handle work without blocking the caller, decoupling request from completion.

Referenced by
[Message Queue](PRINCIPLES.md#arch-message-queue)

### At-Least-Once Delivery Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which a message is guaranteed to be delivered at least once, tolerating duplicates.

Referenced by
[Idempotent Consumer](PRINCIPLES.md#arch-idempotent-consumer)

### Atomic State Change + Message Publish

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to commit a state change and publish its corresponding message as one atomic unit.

Referenced by
[Outbox Pattern](PRINCIPLES.md#arch-outbox-pattern)

### Blocking Synchronous Chains

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Chaining services through blocking synchronous calls, so one slow link stalls the entire request.

Referenced by
[Asynchronous Communication](PRINCIPLES.md#arch-asynchronous-communication)

### Broker/Event Bus

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A runtime intermediary that routes messages between publishers and subscribers.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Business Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of domain intricacy that a coordination mechanism must accommodate.

Referenced by
[Compensating Transaction](PRINCIPLES.md#arch-compensating-transaction)

### Command/Query Separation

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Separating operations that change state from those that return data, so each method has a single purpose.

Referenced by
[CQRS](PRINCIPLES.md#arch-command-query-responsibility-segregation)

### Compensating Transactions

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Undoing a completed step's effects with an offsetting action when a later step in a distributed workflow fails.

Referenced by
[Saga Pattern](PRINCIPLES.md#arch-saga-pattern)

### Consumer

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A component that receives and processes messages from a queue or topic.

Referenced by
[Message Queue](PRINCIPLES.md#arch-message-queue)

### Consumer Elasticity

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to add or remove consumers dynamically to match message volume.

Referenced by
[Competing Consumers](PRINCIPLES.md#arch-competing-consumers)

### Cross-Service Communication

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for independent services to exchange information without direct coupling.

Referenced by
[Integration Events](PRINCIPLES.md#arch-integration-events)

### CRUD-Only State Persistence

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Persisting only current state via create-read-update-delete, discarding the history that event sourcing preserves.

Referenced by
[Event Sourcing](PRINCIPLES.md#arch-event-sourcing)

### Decoupled Domain Reactions

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for domain logic to react to events without the emitter knowing its consumers.

Referenced by
[Domain Events](PRINCIPLES.md#arch-domain-events)

### Decoupled Event Distribution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to distribute events to many consumers without the source depending on any of them.

Referenced by
[Event Bus](PRINCIPLES.md#arch-event-bus)

### Decoupling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which components depend on one another minimally, so each can change independently.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Deduplication Key

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A stable identifier attached to a message that lets a consumer detect and drop duplicates.

Referenced by
[Idempotent Consumer](PRINCIPLES.md#arch-idempotent-consumer)

### Delivery Ordering

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which messages are delivered in a defined order, which broad fan-out can weaken.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Direct Event Handler Calls

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Invoking event handlers by direct method call, coupling emitter to handler and defeating the event bus.

Referenced by
[Event Bus](PRINCIPLES.md#arch-event-bus)

### Direct Point-to-Point Calls

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Wiring services together with direct point-to-point calls, coupling each sender to specific receivers.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Distributed Autonomy

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for distributed nodes to operate and decide independently without central coordination.

Referenced by
[Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency)

### Duplicate Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Reprocessing a message so its side effects run more than once, corrupting state when not idempotent.

Referenced by
[Idempotent Consumer](PRINCIPLES.md#arch-idempotent-consumer)

### Duplication with Domain Events

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of overlap between integration events and domain events that must be kept in sync.

Referenced by
[Integration Events](PRINCIPLES.md#arch-integration-events)

### Event Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The agreed schema and semantics of an event that publishers and subscribers both honor.

Referenced by
[Event Bus](PRINCIPLES.md#arch-event-bus)

### Event Granularity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of coarseness or fineness at which events are defined, trading detail against volume.

Referenced by
[Domain Events](PRINCIPLES.md#arch-domain-events)

### Event Reliability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which events are guaranteed to be delivered despite failures.

Referenced by
[Outbox Pattern](PRINCIPLES.md#arch-outbox-pattern)

### Event Schema

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A formal definition of the structure and fields of an event's payload.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream)

### Event Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The agreed meaning of what an event represents and the conditions under which it is emitted.

Referenced by
[Domain Events](PRINCIPLES.md#arch-domain-events)

### Event Storm / Traceability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which a high volume of events makes end-to-end flows hard to trace.

Referenced by
[Event Bus](PRINCIPLES.md#arch-event-bus)

### Events

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Records of things that have happened in a system, emitted for other components to react to.

Referenced by
[Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture)

### Failure Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to restore correct operation after a failure through compensation or retry.

Referenced by
[Compensating Transaction](PRINCIPLES.md#arch-compensating-transaction)

### Fan-Out Notification

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to deliver one event to many interested subscribers at once.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Global ACID Transaction

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Attempting a single ACID transaction spanning multiple distributed services, creating tight coupling and availability loss.

Referenced by
[Saga Pattern](PRINCIPLES.md#arch-saga-pattern)

### Global Consistency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which all nodes reflect the same state at once, which service autonomy gives up.

Referenced by
[Service Autonomy](PRINCIPLES.md#arch-service-autonomy)

### Hidden Temporal Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
An undocumented ordering requirement between operations that must run in a specific sequence to work correctly.

Referenced by
[Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture)

### Historical Reconstruction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to rebuild past state by replaying the recorded sequence of events.

Referenced by
[Event Sourcing](PRINCIPLES.md#arch-event-sourcing)

### Immediate Consistency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which a read reflects the latest write instantly, which asynchronous processing defers.

Referenced by
[Asynchronous Communication](PRINCIPLES.md#arch-asynchronous-communication)

### Immutable Events

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that recorded events never change once written, only be appended to.

Referenced by
[Append-Only Log](PRINCIPLES.md#arch-append-only-log)

### In-Memory Direct Invocation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Calling a component directly in-process where a durable queue is needed, losing buffering and delivery guarantees.

Referenced by
[Message Queue](PRINCIPLES.md#arch-message-queue)

### In-Place Mutation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Overwriting existing records in place where an append-only log is required, destroying history.

Referenced by
[Append-Only Log](PRINCIPLES.md#arch-append-only-log)

### Infinite Redelivery Loop

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Endlessly redelivering a failing message with no dead-letter path, blocking the queue indefinitely.

Referenced by
[Dead-Letter Queue](PRINCIPLES.md#arch-dead-letter-queue)

### Infrastructure Events in Domain

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Leaking infrastructure or technical events into the domain model, polluting it with concerns it should not hold.

Referenced by
[Domain Events](PRINCIPLES.md#arch-domain-events)

### Internal Domain Event Leakage

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Exposing internal domain events to external consumers, coupling them to private model details.

Referenced by
[Integration Events](PRINCIPLES.md#arch-integration-events)

### Irreversible Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Performing side effects that cannot be undone within a workflow that may need to roll back.

Referenced by
[Compensating Transaction](PRINCIPLES.md#arch-compensating-transaction)

### Local Transaction

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A transaction confined to a single service's own datastore, the atomic unit a saga or outbox composes.

Referenced by
[Outbox Pattern](PRINCIPLES.md#arch-outbox-pattern)

### Long-Running Transactions

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to carry a business transaction across many steps and a long duration via compensation.

Referenced by
[Saga Pattern](PRINCIPLES.md#arch-saga-pattern)

### Message Queue/Topics

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The durable queues and topics through which a broker routes messages to consumers.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Message Relay

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A component that reads pending messages from an outbox and publishes them to the broker.

Referenced by
[Outbox Pattern](PRINCIPLES.md#arch-outbox-pattern)

### Mutable State Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Keeping only mutable current state with no event record, so past states and changes cannot be recovered.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream)

### Operational Dependency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which a system's operation depends on a message broker remaining available.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Ordered Log

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
An append-only sequence of records that preserves the order in which they were written.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream)

### Own Data

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that each service alone own and control its data store.

Referenced by
[Service Autonomy](PRINCIPLES.md#arch-service-autonomy)

### Parallel Message Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability for multiple consumers to process messages from the same source at once.

Referenced by
[Competing Consumers](PRINCIPLES.md#arch-competing-consumers)

### Point-to-Point Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Coupling a sender directly to a specific receiver, so adding a consumer requires changing the sender.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Poison-Message Quarantine

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to divert a repeatedly-failing message to a separate queue so it stops blocking others.

Referenced by
[Dead-Letter Queue](PRINCIPLES.md#arch-dead-letter-queue)

### Publisher

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A component that emits messages to a topic or bus for subscribers to receive.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Query Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of difficulty of answering queries when state is stored as an event history rather than current rows.

Referenced by
[Event Sourcing](PRINCIPLES.md#arch-event-sourcing)

### Read/Write Model Optimization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to shape read and write models independently for their differing access patterns.

Referenced by
[CQRS](PRINCIPLES.md#arch-command-query-responsibility-segregation)

### Reconciliation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The activity of detecting and resolving divergence between replicas so they converge to a consistent state.

Referenced by
[Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency)

### Relay Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of added complexity of running a relay process that forwards messages from an outbox.

Referenced by
[Outbox Pattern](PRINCIPLES.md#arch-outbox-pattern)

### Reprocessing After Fix

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to reprocess quarantined messages once the underlying defect is fixed.

Referenced by
[Dead-Letter Queue](PRINCIPLES.md#arch-dead-letter-queue)

### Retry

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Re-attempting a failed operation, typically after a delay, to overcome a transient fault.

Referenced by
[Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency)

### Reversible/Compensable Step

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that each step in a distributed workflow can be undone by a compensating action.

Referenced by
[Compensating Transaction](PRINCIPLES.md#arch-compensating-transaction)

### Routing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to direct each message to its correct destination based on topic, key, or rule.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Safe Message Redelivery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to redeliver a message without causing duplicate effects, given idempotent handling.

Referenced by
[Idempotent Consumer](PRINCIPLES.md#arch-idempotent-consumer)

### Shared Database

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Multiple services reading and writing one shared database, coupling them and destroying service autonomy.

Referenced by
[Service Autonomy](PRINCIPLES.md#arch-service-autonomy)

### Single Serial Consumer

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Processing a queue with one consumer in series, so throughput cannot scale with load.

Referenced by
[Competing Consumers](PRINCIPLES.md#arch-competing-consumers)

### State Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of extra state a consumer must retain to deduplicate or order messages.

Referenced by
[Idempotent Consumer](PRINCIPLES.md#arch-idempotent-consumer)

### Storage Growth

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which an append-only log's storage footprint grows unbounded over time.

Referenced by
[Append-Only Log](PRINCIPLES.md#arch-append-only-log)

### Storage Volume

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which retaining a full event stream consumes large amounts of storage.

Referenced by
[Event Stream](PRINCIPLES.md#arch-event-stream)

### Strong Consistency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which all reads see the latest write, which event-driven asynchrony relaxes.

Referenced by
[Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture)

### Strong Immediate Consistency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which every read reflects the most recent write without delay, which eventual consistency relaxes.

Referenced by
[Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency)

### Subscriber

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A component that registers interest in a topic and receives its messages.

Referenced by
[Publish/Subscribe Pattern](PRINCIPLES.md#arch-publish-subscribe-pattern)

### Subscriber Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A representation of which consumers subscribe to which topics and how they receive messages.

Referenced by
[Event Bus](PRINCIPLES.md#arch-event-bus)

### Temporal Modeling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to model how state evolved over time by preserving each change as an event.

Referenced by
[Event Sourcing](PRINCIPLES.md#arch-event-sourcing)

### Temporal Queries

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to ask what a system's state was at any past point in time.

Referenced by
[Append-Only Log](PRINCIPLES.md#arch-append-only-log)

### Unified CRUD Model

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Using one shared model for both reads and writes, preventing each from being optimized for its purpose.

Referenced by
[CQRS](PRINCIPLES.md#arch-command-query-responsibility-segregation)

### User Expectations

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The behavior users assume a system will exhibit, such as seeing their own writes immediately.

Referenced by
[Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency)

### Work Distribution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to spread units of work across many workers via a broker.

Referenced by
[Message Broker](PRINCIPLES.md#arch-message-broker)

### Workflow Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Event Messaging Async](LEXICON.md#lex-category-event-messaging-async)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree of intricacy of coordinating a multi-step distributed workflow.

Referenced by
[Saga Pattern](PRINCIPLES.md#arch-saga-pattern)

## Metadata / Self-Description / Declarative Systems

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Client Generation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to generate client code automatically from an API's self-description.

Referenced by
[Self-Describing API](PRINCIPLES.md#arch-self-describing-api)

### Declaration Drift

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which a declared capability set drifts out of sync with the actual behavior.

Referenced by
[Capability Declaration](PRINCIPLES.md#arch-capability-declaration)

### Dynamic Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which interpreting declarative configuration at runtime adds hidden dynamic complexity.

Referenced by
[Declarative Configuration](PRINCIPLES.md#arch-declarative-configuration)

### Dynamic Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to process data generically by reading its self-describing structure.

Referenced by
[Self-Describing Structures](PRINCIPLES.md#arch-self-describing-structures)

### Excessive Configuration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Requiring explicit configuration for everything instead of relying on sensible conventions.

Referenced by
[Convention over Configuration](PRINCIPLES.md#arch-convention-over-configuration)

### Explicit Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that declarative configuration carry an explicit, defined meaning.

Referenced by
[Declarative Configuration](PRINCIPLES.md#arch-declarative-configuration)

### Explicitness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which relying on conventions reduces the explicitness of how a system is configured.

Referenced by
[Convention over Configuration](PRINCIPLES.md#arch-convention-over-configuration)

### Hardcoded Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Hardcoding behavior in code instead of driving it from declarative metadata.

Referenced by
[Metadata-Driven Design](PRINCIPLES.md#arch-metadata-driven-design)

### Hardcoded Registration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Registering components with hardcoded wiring instead of declaring them in a manifest.

Referenced by
[Manifest-Based Design](PRINCIPLES.md#arch-manifest-based-design)

### HATEOAS-style Navigation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability for clients to navigate an API by following links it returns in its responses.

Referenced by
[Self-Describing API](PRINCIPLES.md#arch-self-describing-api)

### Hidden Runtime Behavior

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Behavior that is opaque at runtime because the system does not describe its own structure.

Referenced by
[Self-Describing Architecture](PRINCIPLES.md#arch-self-describing-architecture)

### Implicit Capability

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Leaving what a component can do implicit and undiscoverable instead of declaring it.

Referenced by
[Capability Declaration](PRINCIPLES.md#arch-capability-declaration)

### Manifest

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A declarative document listing a component's capabilities and metadata.

Referenced by
[Capability Declaration](PRINCIPLES.md#arch-capability-declaration)

### Manifest Drift

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which a manifest drifts out of sync with the components it declares.

Referenced by
[Manifest-Based Design](PRINCIPLES.md#arch-manifest-based-design)

### Manifest Schema

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A formal definition of the structure a manifest must follow.

Referenced by
[Manifest-Based Design](PRINCIPLES.md#arch-manifest-based-design)

### Metadata Drift

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which self-describing metadata drifts out of sync with the actual system.

Referenced by
[Self-Describing Architecture](PRINCIPLES.md#arch-self-describing-architecture)

### Metadata Schema

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A formal definition of the metadata fields that drive a system's behavior.

Referenced by
[Metadata-Driven Design](PRINCIPLES.md#arch-metadata-driven-design)

### Opaque API

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
An API that does not describe itself, so clients must rely on external, out-of-band documentation.

Referenced by
[Self-Describing API](PRINCIPLES.md#arch-self-describing-api)

### Opaque Binary/Untyped Structures

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Using opaque binary or untyped data that carries no description of its own structure.

Referenced by
[Self-Describing Structures](PRINCIPLES.md#arch-self-describing-structures)

### Payload Verbosity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which embedding self-description in responses enlarges their payloads.

Referenced by
[Self-Describing API](PRINCIPLES.md#arch-self-describing-api)

### Plugin Loading

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to discover and load plugins declared in manifests at runtime.

Referenced by
[Manifest-Based Design](PRINCIPLES.md#arch-manifest-based-design)

### Reduced Boilerplate

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to avoid repetitive boilerplate by relying on conventions.

Referenced by
[Convention over Configuration](PRINCIPLES.md#arch-convention-over-configuration)

### Runtime Configuration without Code Change

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to change a system's behavior by editing configuration rather than code.

Referenced by
[Declarative Configuration](PRINCIPLES.md#arch-declarative-configuration)

### Self-Description

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which a component exposes its own capabilities and structure for inspection.

Referenced by
[Capability Declaration](PRINCIPLES.md#arch-capability-declaration)

### Size Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which embedding structural descriptions in data increases its size.

Referenced by
[Self-Describing Structures](PRINCIPLES.md#arch-self-describing-structures)

### Stable Conventions

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metadata / Self-Description / Declarative Systems](LEXICON.md#lex-category-metadata-self-description-declarative-systems)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that the conventions a system relies on stay stable and well-known.

Referenced by
[Convention over Configuration](PRINCIPLES.md#arch-convention-over-configuration)

## Metaprogramming / Language-Oriented Architecture

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### AST or Data Representation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that code be represented as a structured syntax tree or data rather than as raw text.

Referenced by
[Code as Data](PRINCIPLES.md#arch-code-as-data)

### Boilerplate Elimination

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to remove repetitive boilerplate by generating it from a single declaration.

Referenced by
[Metaprogramming](PRINCIPLES.md#arch-metaprogramming)

### Build Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which moving work into the build to run at compile time makes the build harder to set up and reason about.

Referenced by
[Compile-Time Evaluation](PRINCIPLES.md#arch-compile-time-evaluation)

### Code Generation or Interpreters

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that a domain language be backed by a generator or interpreter that executes it.

Referenced by
[Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Code-as-Data Representation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that a program's code be representable in the same data structures the language manipulates.

Referenced by
[Homoiconicity](PRINCIPLES.md#arch-homoiconicity)

### Compile-Time Inputs

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that the inputs a computation needs be known at compile time so it can run then.

Referenced by
[Compile-Time Evaluation](PRINCIPLES.md#arch-compile-time-evaluation)

### Diagnostics

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to inspect a running system's own structure and state to diagnose it.

Referenced by
[Introspection](PRINCIPLES.md#arch-introspection)

### Domain Expressiveness

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to express domain rules directly in terms a domain expert recognizes.

Referenced by
[Domain-Specific Language (DSL)](PRINCIPLES.md#arch-domain-specific-language)

### Domain Modeling

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Expressing a problem domain as a first-class language of its own concepts and rules.

Contract
[Domain Modeling](ALGORITHMS.md#algo-domain-modeling)

Referenced by
[Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Dynamic Optimization/Adaptation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to generate specialized code at runtime to optimize or adapt to observed conditions.

Referenced by
[Runtime Code Generation](PRINCIPLES.md#arch-runtime-code-generation)

### Early Error Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to catch errors at compile time rather than letting them surface at runtime.

Referenced by
[Compile-Time Evaluation](PRINCIPLES.md#arch-compile-time-evaluation)

### Explicit Handwritten Code

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Writing code out by hand explicitly rather than generating it, favoring directness and debuggability over reuse.

Referenced by
[Metaprogramming](PRINCIPLES.md#arch-metaprogramming)

### Formal Grammar/Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that a domain language have a defined grammar and semantics rather than an ad-hoc syntax.

Referenced by
[Domain-Specific Language (DSL)](PRINCIPLES.md#arch-domain-specific-language)

### Formal Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A precise, machine-processable model of a system from which implementations are generated.

Referenced by
[Model-Driven Architecture](PRINCIPLES.md#arch-model-driven-architecture)

### General-Purpose Boilerplate

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Expressing domain logic through verbose general-purpose code and its boilerplate instead of a concise domain notation.

Referenced by
[Domain-Specific Language (DSL)](PRINCIPLES.md#arch-domain-specific-language)

### Generated Implementations

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Implementation code produced automatically from a model rather than written by hand.

Referenced by
[Model-Driven Architecture](PRINCIPLES.md#arch-model-driven-architecture)

### Handwritten Divergence

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Hand-editing generated code so it drifts from the model it came from, breaking regeneration.

Referenced by
[Model-Driven Architecture](PRINCIPLES.md#arch-model-driven-architecture)

### High-Level Domain Expression

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to express solutions in high-level domain terms rather than low-level general-purpose code.

Referenced by
[Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Macro Systems

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A facility that lets code transform other code at compile time by operating on its data representation.

Referenced by
[Homoiconicity](PRINCIPLES.md#arch-homoiconicity)

### One-Size General-Purpose Code

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Expressing every domain in a single general-purpose language, rather than in domain-specific notations.

Referenced by
[Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Opaque Runtime

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
A runtime that exposes nothing about its own structure, so its components and state cannot be inspected.

Referenced by
[Introspection](PRINCIPLES.md#arch-introspection)

### Opaque Syntax Trees

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Syntax trees a program cannot inspect or manipulate as data, so code cannot be transformed programmatically.

Referenced by
[Homoiconicity](PRINCIPLES.md#arch-homoiconicity)

### Performance/Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which inspecting and dispatching on types at runtime costs performance and bypasses static safety.

Referenced by
[Reflection](PRINCIPLES.md#arch-reflection)

### Program Transformation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The ability to analyze and rewrite a program by manipulating its structured representation.

Referenced by
[Code as Data](PRINCIPLES.md#arch-code-as-data)

### Reflection/AST/Code Generation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that a language expose reflection, syntax trees, or code generation for programs to manipulate themselves.

Referenced by
[Metaprogramming](PRINCIPLES.md#arch-metaprogramming)

### Runtime Dynamic Evaluation

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Evaluating code or expressions dynamically at runtime, trading compile-time checking for runtime flexibility.

Referenced by
[Compile-Time Evaluation](PRINCIPLES.md#arch-compile-time-evaluation)

### Runtime Type Metadata

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Type information retained at runtime so a program can inspect the shape of its own values.

Referenced by
[Reflection](PRINCIPLES.md#arch-reflection)

### Safe Generation Boundary

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that runtime code generation be confined to a safe, sandboxed boundary away from untrusted input.

Referenced by
[Runtime Code Generation](PRINCIPLES.md#arch-runtime-code-generation)

### Safety/Debuggability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which treating code as manipulable data can obscure what runs and make it harder to debug.

Referenced by
[Code as Data](PRINCIPLES.md#arch-code-as-data)

### Security/Debugging

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which generating and running code at runtime widens the attack surface and complicates debugging.

Referenced by
[Runtime Code Generation](PRINCIPLES.md#arch-runtime-code-generation)

### Self-Describing Systems

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which a system carries enough metadata to describe its own structure and capabilities at runtime.

Referenced by
[Introspection](PRINCIPLES.md#arch-introspection)

### String-Based Code Generation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
Building code by concatenating strings, so the result is unchecked, injection-prone, and hard to analyze.

Referenced by
[Code as Data](PRINCIPLES.md#arch-code-as-data)

### Toolchain Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which building custom languages adds compilers, parsers, and editors to a project's toolchain.

Referenced by
[Language-Oriented Programming](PRINCIPLES.md#arch-language-oriented-programming)

### Tooling/Maintenance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The degree to which owning a custom language burdens a team with building and maintaining its tooling.

Referenced by
[Domain-Specific Language (DSL)](PRINCIPLES.md#arch-domain-specific-language)

### Transformation Rules

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Metaprogramming / Language-Oriented Architecture](LEXICON.md#lex-category-metaprogramming-language-oriented-architecture)
- Layer: [Declarative Core](SCHEMA.md#layer-declarative-core)

Details

Definition
The requirement that explicit rules define how a model maps to generated implementation code.

Referenced by
[Model-Driven Architecture](PRINCIPLES.md#arch-model-driven-architecture)

## Model Architecture

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ad-Hoc Notebook-to-Production

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Promoting exploratory notebook code straight to production without engineering it into a reliable pipeline.

Referenced by
[Machine Learning Architecture](PRINCIPLES.md#arch-machine-learning-architecture)

### Approval Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The declared rules and gates a model must pass before it may be deployed.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance)

### Audit and Debugging

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to inspect and trace a model's decisions for auditing and debugging.

Referenced by
[Explainability](PRINCIPLES.md#arch-explainability)

### Bounded Tool-Using Agents

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to run agents that use external tools within defined, safe limits.

Referenced by
[Agentic Architecture](PRINCIPLES.md#arch-agentic-architecture)

### Capability/Utility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree of usefulness a model offers, which strict safety limits can constrain.

Referenced by
[Model Safety](PRINCIPLES.md#arch-model-safety)

### Contextual Generation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to generate output informed by retrieved, task-specific context.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Controlled Model Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to release models through a governed, approved process.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance)

### Curation Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of ongoing effort required to build and maintain a curated knowledge graph.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Data Pipeline

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The stages that ingest, clean, and transform data into a form suitable for training or inference.

Referenced by
[Machine Learning Architecture](PRINCIPLES.md#arch-machine-learning-architecture)

### Data/Model Boundaries

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The lines separating data preparation, model training, and serving so each concern stays isolated.

Referenced by
[Artificial Intelligence Architecture](PRINCIPLES.md#arch-artificial-intelligence-architecture)

### Dataset

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A curated collection of examples used to train or evaluate a model.

Referenced by
[Model Evaluation](PRINCIPLES.md#arch-model-evaluation)

### Degradation Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to detect when a model's accuracy declines as data shifts.

Referenced by
[Model Drift Monitoring](PRINCIPLES.md#arch-model-drift-monitoring)

### Deploy-and-Forget Models

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Deploying a model and never monitoring it, so degradation as the data drifts goes unnoticed.

Referenced by
[Model Drift Monitoring](PRINCIPLES.md#arch-model-drift-monitoring)

### Document Store

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The body of documents a retrieval system searches to ground a model's generation.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Embeddings

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Numeric vector representations of data that place semantically similar items near each other.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

### Entities

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The distinct things, such as people, places or concepts, that a knowledge graph represents as nodes.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Exact Keyword Search Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Relying solely on exact keyword matching for retrieval, missing semantically related results.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

### Experiment Velocity

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The rate at which model experiments can be run and iterated, which governance can slow.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance)

### Experimentation Speed

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The rate at which new modeling ideas can be tried and evaluated.

Referenced by
[Machine Learning Architecture](PRINCIPLES.md#arch-machine-learning-architecture)

### Explainability/Recall

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which retrieval stays explainable and complete, traded against pure similarity ranking.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

### Flat Document-Only Knowledge

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Representing knowledge as unlinked flat documents, losing the relationships a graph would capture.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Governed Autonomy

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to let an agent act autonomously within enforced governance limits.

Referenced by
[Agentic Architecture](PRINCIPLES.md#arch-agentic-architecture)

### Grounding Strategy

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A scheme for anchoring a model's output in retrieved, authoritative sources rather than its parameters alone.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Guardrails

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Constraints and filters that bound what a model is permitted to output or do at runtime.

Referenced by
[Model Safety](PRINCIPLES.md#arch-model-safety)

### Input/Output Contract

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The agreed schema of the inputs a model accepts and the outputs it returns.

Referenced by
[Model Inference](PRINCIPLES.md#arch-model-inference)

### Knowledge Freshness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a system's knowledge reflects current rather than stale information.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Latency/Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of latency and expense incurred to serve model predictions.

Referenced by
[Model Inference](PRINCIPLES.md#arch-model-inference)

### Metric Completeness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which evaluation metrics capture every dimension of a model's quality.

Referenced by
[Model Evaluation](PRINCIPLES.md#arch-model-evaluation)

### Model Artifact

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The trained model file, with its learned weights, that is loaded to serve predictions.

Referenced by
[Model Inference](PRINCIPLES.md#arch-model-inference)

### Model Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree of intricacy in a model, which raises accuracy but lowers explainability.

Referenced by
[Explainability](PRINCIPLES.md#arch-explainability)

### Model Registry

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A catalog that tracks model versions, their metadata, and their deployment status.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance)

### Model Selection/Regression Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to compare models and catch quality regressions before deployment.

Referenced by
[Model Evaluation](PRINCIPLES.md#arch-model-evaluation)

### Model-Integrated Systems

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability of a software system to incorporate models as integral parts of its behavior.

Referenced by
[Artificial Intelligence Architecture](PRINCIPLES.md#arch-artificial-intelligence-architecture)

### Monitoring Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of ongoing expense of continuously monitoring a deployed model.

Referenced by
[Model Drift Monitoring](PRINCIPLES.md#arch-model-drift-monitoring)

### Opaque Black-Box Decisions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Producing model decisions with no explanation, so their reasoning cannot be inspected or trusted.

Referenced by
[Explainability](PRINCIPLES.md#arch-explainability)

### Opaque Ungoverned Model Use

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Using models with no governance or oversight, leaving their behavior and risks unmanaged.

Referenced by
[Artificial Intelligence Architecture](PRINCIPLES.md#arch-artificial-intelligence-architecture)

### Rationale/Evidence

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The reasons and supporting evidence recorded for a model's decision.

Referenced by
[Explainability](PRINCIPLES.md#arch-explainability)

### Relations

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The typed connections between entities that a knowledge graph represents as edges.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Relationship-Aware Retrieval/Reasoning

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to retrieve and reason over the relationships between entities, not just isolated facts.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Reliable Model Lifecycle

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to manage a model's data, training, deployment and monitoring reliably and repeatably.

Referenced by
[Machine Learning Architecture](PRINCIPLES.md#arch-machine-learning-architecture)

### Retraining Triggers

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Signals that automatically initiate model retraining when measured drift crosses a threshold.

Referenced by
[Model Drift Monitoring](PRINCIPLES.md#arch-model-drift-monitoring)

### Retrieval Quality/Latency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which retrieval must trade result quality against speed.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Retriever

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A component that finds and returns the most relevant documents for a query.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Runtime Prediction/Generation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to produce predictions or generated output from a trained model at runtime.

Referenced by
[Model Inference](PRINCIPLES.md#arch-model-inference)

### Safe Model Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to deploy models with safeguards that bound their behavior.

Referenced by
[Model Safety](PRINCIPLES.md#arch-model-safety)

### Schema/Ontology

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A formal definition of the entity types and relationship types a knowledge graph may contain.

Referenced by
[Knowledge Graphs](PRINCIPLES.md#arch-knowledge-graphs)

### Semantic Search

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to find results by meaning and similarity rather than exact keyword match.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

### Similarity Retrieval

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to retrieve items nearest to a query in an embedding space.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

### Structured, Versioned Prompts

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Prompts authored as structured, version-controlled artifacts rather than ad-hoc strings.

Referenced by
[Prompt Engineering](PRINCIPLES.md#arch-prompt-engineering)

### Tool Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The defined contract through which an agent invokes external tools and receives their results.

Referenced by
[Agentic Architecture](PRINCIPLES.md#arch-agentic-architecture)

### Training-Time-Only Model Logic

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Building logic that exists only during training, with no counterpart to serve predictions at inference.

Referenced by
[Model Inference](PRINCIPLES.md#arch-model-inference)

### Training/Inference Separation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that model training and prediction serving be distinct, separately-managed phases.

Referenced by
[Machine Learning Architecture](PRINCIPLES.md#arch-machine-learning-architecture)

### Trust

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which users are willing to rely on a system's outputs.

Referenced by
[Explainability](PRINCIPLES.md#arch-explainability)

### Unapproved Model Deployment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Deploying a model to production without passing the required review and approval gates.

Referenced by
[Model Governance](PRINCIPLES.md#arch-model-governance)

### Ungrounded Generation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Generating output from a model alone without grounding it in retrieved facts, inviting hallucination.

Referenced by
[Retrieval-Augmented Generation (RAG)](PRINCIPLES.md#arch-retrieval-augmented-generation)

### Unguarded Model Autonomy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Letting a model act autonomously with no safety guardrails on what it can do.

Referenced by
[Model Safety](PRINCIPLES.md#arch-model-safety)

### Untested Model Deployment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Deploying a model without evaluating it, so its real-world quality is unknown until it fails.

Referenced by
[Model Evaluation](PRINCIPLES.md#arch-model-evaluation)

### Vector Index

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Model Architecture](LEXICON.md#lex-category-model-architecture)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A data structure that organizes embedding vectors for fast nearest-neighbor lookup.

Referenced by
[Vector Search](PRINCIPLES.md#arch-vector-search)

## Observability / Auditability / Traceability

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Accountability

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to attribute every consequential action to the actor responsible for it.

Referenced by
[Auditability](PRINCIPLES.md#arch-auditability)

### Action

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A field of an audit record identifying the operation that was performed.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Actor

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A field of an audit record identifying who or what performed an action.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Alert Fatigue

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which too many alerts desensitize responders, so the ones that matter are ignored.

Referenced by
[Alerting](PRINCIPLES.md#arch-alerting)

### Alert Noise

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which monitoring many signals generates alerts that drown out the meaningful ones.

Referenced by
[Monitoring](PRINCIPLES.md#arch-monitoring)

### Anonymous Flow

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Data or requests flowing through a system with no identifiers, so their path cannot be reconstructed.

Referenced by
[Traceability](PRINCIPLES.md#arch-traceability)

### At-a-Glance System Health

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to see a system's overall health at a glance from a consolidated visual display.

Referenced by
[Dashboards](PRINCIPLES.md#arch-dashboards)

### Audit Trail

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A chronological record linking each event to the one that caused it.

Referenced by
[Causation ID](PRINCIPLES.md#arch-causation-id)

### Blind Operation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Running a system in production with no monitoring, so problems are noticed only when users report them.

Referenced by
[Monitoring](PRINCIPLES.md#arch-monitoring)

### Cause-Effect Reconstruction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to reconstruct which event triggered which by following causation identifiers.

Referenced by
[Causation ID](PRINCIPLES.md#arch-causation-id)

### Context Propagation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The requirement that request context be carried across service boundaries so related calls can be correlated.

Referenced by
[Correlation ID](PRINCIPLES.md#arch-correlation-id)

### Cost/Noise

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which collecting more telemetry adds cost and noise that can obscure the signals that matter.

Referenced by
[Observability](PRINCIPLES.md#arch-observability)

### Dashboard Sprawl

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which unchecked creation of dashboards scatters attention across too many redundant views.

Referenced by
[Dashboards](PRINCIPLES.md#arch-dashboards)

### End-to-End Causality

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to follow a request's cause-and-effect chain across every component it touches.

Referenced by
[Traceability](PRINCIPLES.md#arch-traceability)

### Error-Budget Decisions

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to decide how much risk to take by spending against a defined reliability error budget.

Referenced by
[SLO/SLI](PRINCIPLES.md#arch-slo-sli)

### Event Metadata

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Descriptive fields attached to an event, such as its identifiers, timestamps, and causation links.

Referenced by
[Causation ID](PRINCIPLES.md#arch-causation-id)

### Failure Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to detect that a system has failed or degraded by watching its monitored signals.

Referenced by
[Monitoring](PRINCIPLES.md#arch-monitoring)

### Feature Velocity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which holding to strict reliability targets limits how fast new features can ship.

Referenced by
[SLO/SLI](PRINCIPLES.md#arch-slo-sli)

### Forensics

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to reconstruct after the fact what happened from an immutable audit record.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Header/Metadata Management

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which threading correlation identifiers through headers adds handling to every call.

Referenced by
[Correlation ID](PRINCIPLES.md#arch-correlation-id)

### Incident Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to reconstruct and analyze an incident from the events a system logged.

Referenced by
[Logging](PRINCIPLES.md#arch-logging)

### Incident Diagnosis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to diagnose the cause of an incident from a system's observable signals.

Referenced by
[Observability](PRINCIPLES.md#arch-observability)

### Incident Response

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Detecting, triaging, and resolving an operational incident once an alert fires.

Referenced by
[Alerting](PRINCIPLES.md#arch-alerting)

### Latency/Failure Root Cause Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to pinpoint which service caused a request's latency or failure by tracing it across hops.

Referenced by
[Distributed Tracing](PRINCIPLES.md#arch-distributed-tracing)

### Log-Grep-Only Diagnosis

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Diagnosing problems solely by grepping raw logs, with no aggregated view of system health.

Referenced by
[Dashboards](PRINCIPLES.md#arch-dashboards)

### Logs

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A record of discrete, timestamped events a system emits about what it did.

Referenced by
[Observability](PRINCIPLES.md#arch-observability)

### Logs/Traces

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The combined log and trace records that let a request be followed from end to end.

Referenced by
[Traceability](PRINCIPLES.md#arch-traceability)

### Metadata Propagation Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which carrying trace metadata through every call adds size and processing cost.

Referenced by
[Traceability](PRINCIPLES.md#arch-traceability)

### Metadata Verbosity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which stamping every event with causation metadata makes the event payload verbose.

Referenced by
[Causation ID](PRINCIPLES.md#arch-causation-id)

### Noise/Personal Data Leakage

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which verbose logging adds noise and risks leaking personal or sensitive data.

Referenced by
[Logging](PRINCIPLES.md#arch-logging)

### Objective Reliability Targets

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The requirement that reliability be expressed as objective, measurable targets rather than vague aspirations.

Referenced by
[SLO/SLI](PRINCIPLES.md#arch-slo-sli)

### Opaque Distributed Calls

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Calls crossing service boundaries with no tracing, so a request's path and bottlenecks are invisible.

Referenced by
[Distributed Tracing](PRINCIPLES.md#arch-distributed-tracing)

### Opaque Mutation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Changing state with no record of who changed what or when, so the change cannot be audited.

Referenced by
[Auditability](PRINCIPLES.md#arch-auditability)

### Opaque System

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A system that exposes no usable signals about its internal state, so failures cannot be understood from outside.

Referenced by
[Observability](PRINCIPLES.md#arch-observability)

### Overhead/Sampling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which tracing every request adds overhead, forcing sampling that can miss rare cases.

Referenced by
[Distributed Tracing](PRINCIPLES.md#arch-distributed-tracing)

### Privacy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which a system limits the collection and exposure of personal or sensitive information.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Request-Level Traceability

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to trace all work belonging to one request by a shared correlation identifier.

Referenced by
[Correlation ID](PRINCIPLES.md#arch-correlation-id)

### Storage/Privacy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The degree to which retaining a full audit history grows storage and raises privacy concerns.

Referenced by
[Auditability](PRINCIPLES.md#arch-auditability)

### Structured Events

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Log entries emitted as structured, machine-parsable records rather than free-form text.

Referenced by
[Logging](PRINCIPLES.md#arch-logging)

### Target

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A field of an audit record identifying the resource an action was performed on.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Timely Intervention

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to intervene on a problem quickly by being alerted the moment it arises.

Referenced by
[Alerting](PRINCIPLES.md#arch-alerting)

### Timestamp

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A field of an audit record marking when an action occurred.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Trace Context Propagation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The requirement that trace identifiers be propagated across every hop of a distributed request.

Referenced by
[Distributed Tracing](PRINCIPLES.md#arch-distributed-tracing)

### Traces

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
A record of the path and timing of a request as it moves through a system's components.

Referenced by
[Observability](PRINCIPLES.md#arch-observability)

### Trend Visibility

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ability to see how a metric is trending over time from a visualized history.

Referenced by
[Dashboards](PRINCIPLES.md#arch-dashboards)

### Uncorrelated Events

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Emitting events with no shared identifier, so those belonging to one request cannot be tied together.

Referenced by
[Correlation ID](PRINCIPLES.md#arch-correlation-id)

### Unlinked Events

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Recording events with no link to their cause, so cause-and-effect chains cannot be rebuilt.

Referenced by
[Causation ID](PRINCIPLES.md#arch-causation-id)

### Untracked Mutation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Mutating state without writing an audit entry, so the change leaves no trace.

Referenced by
[Audit Logging](PRINCIPLES.md#arch-audit-logging)

### Vague Reliability Goals

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Observability / Auditability / Traceability](LEXICON.md#lex-category-observability-auditability-traceability)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
Stating reliability aims in vague, unmeasurable terms, so no check can tell whether they are met.

Referenced by
[SLO/SLI](PRINCIPLES.md#arch-slo-sli)

## Plugin / Extensibility / IoC

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### API Surface Growth

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which adding extension points enlarges the public API that must be kept stable.

Referenced by
[Extension Points](PRINCIPLES.md#arch-extension-points)

### Closed Core

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
A core that cannot be extended without modifying its own source, so every addition edits the core.

Referenced by
[Extension Points](PRINCIPLES.md#arch-extension-points)

### Constructor Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which injecting many dependencies through constructors makes them long and unwieldy.

Referenced by
[Dependency Injection](PRINCIPLES.md#arch-dependency-injection)

### Continuous Delivery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to release changes to production continuously through an automated pipeline.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Decoupled Deploy and Release

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to deploy code and separately decide when to activate it for users.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Direct Control Ownership

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Application code driving the overall control flow itself instead of ceding it to a framework or container.

Referenced by
[Inversion of Control (IoC)](PRINCIPLES.md#arch-inversion-of-control)

### Direct Reference

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Referring to a specific implementation directly instead of looking it up through a registry.

Referenced by
[Registry Pattern](PRINCIPLES.md#arch-registry-pattern)

### Dynamic Lookup

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to find a registered component by key at runtime.

Referenced by
[Registry Pattern](PRINCIPLES.md#arch-registry-pattern)

### Dynamic Resolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to resolve a service's current location or instance at runtime.

Referenced by
[Service Registry](PRINCIPLES.md#arch-service-registry)

### Explicit Dependencies

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which a component's dependencies are visible in its signature rather than acquired through hidden lookups.

Referenced by
[Service Locator Pattern](PRINCIPLES.md#arch-service-locator-pattern)

### Externalized Flag State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement that feature-flag values live in external configuration, not hardcoded in the code.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Flag Debt

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which stale, unremoved feature flags accumulate and clutter the code over time.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Framework Control Flow

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to let a framework drive the overall control flow and call into application code.

Referenced by
[Inversion of Control (IoC)](PRINCIPLES.md#arch-inversion-of-control)

### Global State

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which a global registry behaves as shared global state that any code can reach.

Referenced by
[Registry Pattern](PRINCIPLES.md#arch-registry-pattern)

### Gradual Rollout

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to enable a feature for a growing subset of users over time.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Hardcoded Branch Constant

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Controlling a feature with a hardcoded constant in the code instead of an externally-managed flag.

Referenced by
[Feature Toggle](PRINCIPLES.md#arch-feature-toggle)

### Hardcoded Extensions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Wiring extensions directly into the core so adding one requires editing and rebuilding the core.

Referenced by
[Plugin Architecture](PRINCIPLES.md#arch-plugin-architecture)

### Hardcoded Instantiation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Creating dependencies with hardcoded constructors inside a class instead of injecting them.

Referenced by
[Dependency Injection](PRINCIPLES.md#arch-dependency-injection)

### Hardcoded Lookup

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Hardcoding a service's address or instance instead of resolving it through a registry.

Referenced by
[Service Registry](PRINCIPLES.md#arch-service-registry)

### Keyed Registration

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement that each component register under a unique key by which it can be retrieved.

Referenced by
[Registry Pattern](PRINCIPLES.md#arch-registry-pattern)

### Late Resolution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to defer resolving which implementation to use until the moment it is needed.

Referenced by
[Service Locator Pattern](PRINCIPLES.md#arch-service-locator-pattern)

### Mocking

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to substitute test doubles for real dependencies by injecting them.

Referenced by
[Dependency Injection](PRINCIPLES.md#arch-dependency-injection)

### Registration Protocol

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement of a defined protocol by which services register and deregister themselves.

Referenced by
[Service Registry](PRINCIPLES.md#arch-service-registry)

### Registry

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
A central store that maps keys to registered components for later lookup.

Referenced by
[Service Locator Pattern](PRINCIPLES.md#arch-service-locator-pattern)

### Registry Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which the whole system's operation depends on the service registry staying available.

Referenced by
[Service Registry](PRINCIPLES.md#arch-service-registry)

### Runtime Lookup

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to look up a needed service by name at runtime.

Referenced by
[Service Locator Pattern](PRINCIPLES.md#arch-service-locator-pattern)

### Third-Party Extension

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Plugin / Extensibility / IoC](LEXICON.md#lex-category-plugin-extensibility-ioc)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability for outside developers to extend the system through published extension points.

Referenced by
[Extension Points](PRINCIPLES.md#arch-extension-points)

## Portability / Infrastructure / Deployment

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Adapter/Port Abstraction

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
A boundary abstraction separating core logic from external protocols via port interfaces and pluggable adapters.

Referenced by
[Protocol Independence](PRINCIPLES.md#arch-protocol-independence)

### Applicable Standard

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The requirement that the relevant external standard a system must meet be identified and adhered to.

Referenced by
[Standards Compliance](PRINCIPLES.md#arch-standards-compliance)

### Automated Provisioning

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to create and configure infrastructure automatically from declarative definitions.

Referenced by
[Infrastructure as Code](PRINCIPLES.md#arch-infrastructure-as-code)

### Certification/Compatibility

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to certify a system and interoperate with others by conforming to a shared standard.

Referenced by
[Standards Compliance](PRINCIPLES.md#arch-standards-compliance)

### Config Schema

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
A schema defining the structure, types, and defaults of a system's externalized configuration.

Referenced by
[Configuration Externalization](PRINCIPLES.md#arch-configuration-externalization)

### Config Sprawl

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which externalizing configuration across many sources scatters it and makes it hard to track.

Referenced by
[Configuration Externalization](PRINCIPLES.md#arch-configuration-externalization)

### Cross-Platform Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to deploy the same software unchanged across different operating systems and platforms.

Referenced by
[Platform Independence](PRINCIPLES.md#arch-platform-independence)

### Deploy Time

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which replacing whole instances rather than patching them in place lengthens deployment time.

Referenced by
[Immutable Infrastructure](PRINCIPLES.md#arch-immutable-infrastructure)

### Deterministic Redeploys

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to redeploy identical infrastructure every time by replacing instances from a fixed definition.

Referenced by
[Immutable Infrastructure](PRINCIPLES.md#arch-immutable-infrastructure)

### Environment-Specific Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to deploy one build into different environments by supplying environment-specific configuration.

Referenced by
[Configuration Externalization](PRINCIPLES.md#arch-configuration-externalization)

### Externalized Config

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The requirement that configuration live outside the container image so one image runs in any environment.

Referenced by
[Containerization](PRINCIPLES.md#arch-containerization)

### Host-Coupled Deployment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Deploying software that depends on specifics of its host machine, so it cannot be moved or reproduced elsewhere.

Referenced by
[Containerization](PRINCIPLES.md#arch-containerization)

### Image Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which packaging everything into a container image grows the image and its maintenance burden.

Referenced by
[Containerization](PRINCIPLES.md#arch-containerization)

### Image Definition

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
A declarative file specifying how a container image is built from a base and its dependencies.

Referenced by
[Containerization](PRINCIPLES.md#arch-containerization)

### In-Place Server Mutation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Modifying running servers in place over time, so their state drifts and can no longer be reproduced.

Referenced by
[Immutable Infrastructure](PRINCIPLES.md#arch-immutable-infrastructure)

### Innovation/Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which conforming to an external standard limits the freedom to innovate beyond it.

Referenced by
[Standards Compliance](PRINCIPLES.md#arch-standards-compliance)

### Instance Replacement over Mutation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to update infrastructure by replacing instances wholesale rather than mutating them in place.

Referenced by
[Immutable Infrastructure](PRINCIPLES.md#arch-immutable-infrastructure)

### Manual Infrastructure Changes

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Changing infrastructure by hand instead of through code, so its state is undocumented and unreproducible.

Referenced by
[Infrastructure as Code](PRINCIPLES.md#arch-infrastructure-as-code)

### Native Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which staying platform-independent forgoes optimizations native to a specific platform.

Referenced by
[Platform Independence](PRINCIPLES.md#arch-platform-independence)

### OS/Vendor Lock-In

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Depending on one operating system or vendor's proprietary features, so switching away becomes costly or impossible.

Referenced by
[Platform Independence](PRINCIPLES.md#arch-platform-independence)

### Platform Abstraction

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The requirement that platform-specific details sit behind an abstraction the rest of the system depends on.

Referenced by
[Platform Independence](PRINCIPLES.md#arch-platform-independence)

### Platform Migration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to move a system to a different platform with little or no rework.

Referenced by
[Portability](PRINCIPLES.md#arch-portability)

### Platform Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which staying portable across platforms forgoes optimizations specific to any one of them.

Referenced by
[Portability](PRINCIPLES.md#arch-portability)

### Platform-Specific Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Binding code to one platform's APIs and assumptions, so it cannot run elsewhere without rewriting.

Referenced by
[Portability](PRINCIPLES.md#arch-portability)

### Proprietary Deviation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Deviating from a shared standard with proprietary extensions, breaking interoperability with conformant systems.

Referenced by
[Standards Compliance](PRINCIPLES.md#arch-standards-compliance)

### Protocol Swap

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to switch the transport or wire protocol without changing core domain logic.

Referenced by
[Protocol Independence](PRINCIPLES.md#arch-protocol-independence)

### Protocol-Coupled Domain Logic

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Domain logic written directly against a specific protocol, so changing the protocol means rewriting the core.

Referenced by
[Protocol Independence](PRINCIPLES.md#arch-protocol-independence)

### Protocol-Specific Features

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which staying protocol-independent forgoes features unique to any one protocol.

Referenced by
[Protocol Independence](PRINCIPLES.md#arch-protocol-independence)

### Reliable Deployment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to deploy with confidence because every environment behaves the same way.

Referenced by
[Environment Parity](PRINCIPLES.md#arch-environment-parity)

### Repeatable Runtime Packaging

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ability to package an application and its runtime into one reproducible, portable unit.

Referenced by
[Containerization](PRINCIPLES.md#arch-containerization)

### Secure Config Handling

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The requirement that secrets and sensitive configuration be stored and injected securely, never hardcoded.

Referenced by
[Configuration Externalization](PRINCIPLES.md#arch-configuration-externalization)

### Snowflake Environments

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
Environments each configured by hand into unique, unreproducible states, so what works in one fails in another.

Referenced by
[Environment Parity](PRINCIPLES.md#arch-environment-parity)

### Version Control

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Portability / Infrastructure / Deployment](LEXICON.md#lex-category-portability-infrastructure-deployment)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
A system that records changes to files over time so any version can be recovered, compared, or audited.

Referenced by
[Infrastructure as Code](PRINCIPLES.md#arch-infrastructure-as-code)

## Quality Attributes

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Architecture Compliance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Enforcement Core](SCHEMA.md#layer-enforcement-core)

Details

Definition
The degree to which an implementation conforms to its intended architectural rules, boundaries, and constraints.

Referenced by
[Dependency Graph](PRINCIPLES.md#arch-dependency-graph), [Static Analysis](PRINCIPLES.md#arch-static-analysis)

### Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The proportion of time a system is operational and able to serve requests.

Referenced by
[Control Plane](PRINCIPLES.md#arch-control-plane), [Leader Election](PRINCIPLES.md#arch-leader-election), [Consensus](PRINCIPLES.md#arch-consensus), [Fail Safe](PRINCIPLES.md#arch-fail-safe), [Fail Secure](PRINCIPLES.md#arch-fail-secure), [Eventual Consistency](PRINCIPLES.md#arch-eventual-consistency), [Horizontal Scaling](PRINCIPLES.md#arch-horizontal-scaling), [Load Balancing](PRINCIPLES.md#arch-load-balancing), [Single Source of Truth](PRINCIPLES.md#arch-single-source-of-truth), [Failover](PRINCIPLES.md#arch-failover), [Replication](PRINCIPLES.md#arch-replication), [Blue-Green Deployment](PRINCIPLES.md#arch-blue-green-deployment), [Consistency](PRINCIPLES.md#arch-consistency)

### Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The degree of interdependence and intricacy that makes a system harder to reason about and change.

Referenced by
[Resilience](PRINCIPLES.md#arch-resilience), [Concurrency](PRINCIPLES.md#arch-concurrency), [Defense in Depth](PRINCIPLES.md#arch-defense-in-depth), [Flyweight Pattern](PRINCIPLES.md#arch-flyweight-pattern)

### Coordination Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The additional cost incurred to synchronize and coordinate concurrent or distributed units of work.

Referenced by
[Parallelism](PRINCIPLES.md#arch-parallelism), [Fan-out/Fan-in](PRINCIPLES.md#arch-fan-out-fan-in)

### Data Integrity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The accuracy, consistency, and validity of data maintained over its entire lifecycle.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization), [Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Debuggability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Observability](SCHEMA.md#layer-observability)

Details

Definition
The ease with which a fault can be located and understood from a system's observable behavior.

Referenced by
[Observer Pattern](PRINCIPLES.md#arch-observer-pattern), [Encapsulation](PRINCIPLES.md#arch-encapsulation), [Event-Driven Architecture](PRINCIPLES.md#arch-event-driven-architecture), [Metadata-Driven Design](PRINCIPLES.md#arch-metadata-driven-design), [Metaprogramming](PRINCIPLES.md#arch-metaprogramming), [Observability](PRINCIPLES.md#arch-observability), [Traceability](PRINCIPLES.md#arch-traceability)

### Discoverability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ease with which a system's components, capabilities, or endpoints can be found and understood.

Referenced by
[Self-Describing Architecture](PRINCIPLES.md#arch-self-describing-architecture), [Self-Describing API](PRINCIPLES.md#arch-self-describing-api), [Glob-Resolvable Tree](PRINCIPLES.md#arch-glob-resolvable-tree), [Agnostic-First Vocabulary](PRINCIPLES.md#arch-agnostic-first-vocabulary), [Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Fault Isolation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a failure in one component is contained and prevented from cascading to others.

Referenced by
[Timeout Pattern](PRINCIPLES.md#arch-timeout-pattern), [Bulkhead Pattern](PRINCIPLES.md#arch-bulkhead-pattern), [Dead-Letter Queue](PRINCIPLES.md#arch-dead-letter-queue)

### Maintainability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The ease with which a system can be corrected, adapted, and extended over its lifetime.

Referenced by
[Design Review](PRINCIPLES.md#arch-design-review), [Pattern Consistency](PRINCIPLES.md#arch-pattern-consistency), [Separation of Concerns](PRINCIPLES.md#arch-separation-of-concerns), [Do Not Repeat Yourself (DRY)](PRINCIPLES.md#arch-duplicate-code), [Performance Engineering](PRINCIPLES.md#arch-performance-engineering), [Manual Identity Migration](PRINCIPLES.md#arch-manual-identity-migration)

### Mapping Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The additional cost of translating data or calls between two differing representations or models.

Referenced by
[Anti-Corruption Layer](PRINCIPLES.md#arch-anti-corruption-layer), [Adapter Pattern](PRINCIPLES.md#arch-adapter-pattern)

### Operational Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The ongoing effort and resource cost of deploying, running, and maintaining a system in production.

Referenced by
[Service-Oriented Architecture](PRINCIPLES.md#arch-service-oriented-architecture), [Dead-Letter Queue](PRINCIPLES.md#arch-dead-letter-queue)

### Ordering

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Causality Core](SCHEMA.md#layer-causality-core)

Details

Definition
The guarantee that events or messages are processed in a well-defined, consistent sequence.

Referenced by
[Observer Pattern](PRINCIPLES.md#arch-observer-pattern), [Competing Consumers](PRINCIPLES.md#arch-competing-consumers)

### Partial Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The condition in which a system continues serving a subset of its functions while some components are unavailable.

Referenced by
[Graceful Degradation](PRINCIPLES.md#arch-graceful-degradation), [Fallback Pattern](PRINCIPLES.md#arch-fallback-pattern)

### Performance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The speed, throughput, and resource efficiency with which a system performs its work.

Referenced by
[Parallelism](PRINCIPLES.md#arch-parallelism), [Concurrency Control](PRINCIPLES.md#arch-concurrency-control)

### Policy Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The difficulty of understanding, maintaining, and reasoning about a policy as its rules multiply.

Referenced by
[Authorization](PRINCIPLES.md#arch-authorization), [ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Readability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The ease with which source code can be read and understood by a developer.

Referenced by
[Homoiconicity](PRINCIPLES.md#arch-homoiconicity), [Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface)

### Reliability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a system performs its required functions correctly and consistently over time.

Referenced by
[Monitoring](PRINCIPLES.md#arch-monitoring), [Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Resource Efficiency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Resource Core](SCHEMA.md#layer-resource-core)

Details

Definition
The degree to which a system accomplishes its work using minimal computational resources.

Referenced by
[Performance Engineering](PRINCIPLES.md#arch-performance-engineering), [Optimization](PRINCIPLES.md#arch-optimization)

### Retry Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The property that an operation can be retried without producing duplicate or inconsistent effects.

Referenced by
[Asynchronous Communication](PRINCIPLES.md#arch-asynchronous-communication), [Idempotency](PRINCIPLES.md#arch-idempotency)

### Robustness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a system continues to operate correctly under invalid input, stress, or unexpected conditions.

Referenced by
[Property-Based Testing](PRINCIPLES.md#arch-property-based-testing), [Defensive Programming](PRINCIPLES.md#arch-defensive-programming), [Prompt Engineering](PRINCIPLES.md#arch-prompt-engineering)

### Security

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system protects its data and behavior from unauthorized access, misuse, or attack.

Referenced by
[Code Review](PRINCIPLES.md#arch-code-review), [Centralized Authentication](PRINCIPLES.md#arch-centralized-authentication), [Static Analysis](PRINCIPLES.md#arch-static-analysis), [Model Safety](PRINCIPLES.md#arch-model-safety), [Plugin Architecture](PRINCIPLES.md#arch-plugin-architecture), [Runtime Extensibility](PRINCIPLES.md#arch-runtime-extensibility), [Rate Limiting](PRINCIPLES.md#arch-rate-limiting), [Input Validation](PRINCIPLES.md#arch-input-validation), [Privacy by Design](PRINCIPLES.md#arch-privacy-by-design), [Policy Enforcement](PRINCIPLES.md#arch-policy-enforcement), [Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Simplicity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The absence of unnecessary structure, keeping a system easy to understand and change.

Referenced by
[Minimum Viable Architecture](PRINCIPLES.md#arch-minimum-viable-architecture), [First-Principles Design](PRINCIPLES.md#arch-first-principles-design), [Command Pattern](PRINCIPLES.md#arch-command-pattern), [Iterator Pattern](PRINCIPLES.md#arch-iterator-pattern), [Do Not Repeat Yourself (DRY)](PRINCIPLES.md#arch-duplicate-code), [Abstraction](PRINCIPLES.md#arch-abstraction), [Factory Pattern](PRINCIPLES.md#arch-factory-pattern), [Error Handling](PRINCIPLES.md#arch-error-handling), [Scalability](PRINCIPLES.md#arch-scalability), [Vertical Scaling](PRINCIPLES.md#arch-vertical-scaling), [Open/Closed Principle (OCP)](PRINCIPLES.md#arch-open-closed)

### Static Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The guarantee that whole classes of errors are caught at compile time, before code runs.

Referenced by
[Runtime Code Generation](PRINCIPLES.md#arch-runtime-code-generation), [Dynamic Binding](PRINCIPLES.md#arch-dynamic-binding)

### Substitutability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a component can be replaced by another honoring the same contract without breaking clients.

Contract
[Substitutability](ALGORITHMS.md#algo-substitutability)

Referenced by
[Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution), [Polymorphism](PRINCIPLES.md#arch-polymorphism)

### Team Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The degree to which a team can make and deliver decisions independently, without cross-team coordination.

Referenced by
[Reference Architecture](PRINCIPLES.md#arch-reference-architecture), [Monolith Architecture](PRINCIPLES.md#arch-monolith-architecture)

### Tooling Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The effort required to set up, learn, and maintain the tools a technique or approach depends on.

Referenced by
[Statecharts](PRINCIPLES.md#arch-statecharts), [Infrastructure as Code](PRINCIPLES.md#arch-infrastructure-as-code)

### User Experience

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Quality Attributes](LEXICON.md#lex-category-quality-attributes)
- Layer: [Human Factors](SCHEMA.md#layer-human-factors)

Details

Definition
The overall quality of a user's interaction with a system, including responsiveness, clarity, and ease of use.

Aliases
UX

Referenced by
[Latency](PRINCIPLES.md#arch-latency), [Rate Limiting](PRINCIPLES.md#arch-rate-limiting), [Authentication](PRINCIPLES.md#arch-authentication)

## Runtime Discovery / Dynamic Binding

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Capability Addition without Core Modification

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to add new capabilities at runtime without modifying the core.

Referenced by
[Runtime Extensibility](PRINCIPLES.md#arch-runtime-extensibility)

### Closed Static Core

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
A core fixed at build time that cannot accept new capabilities without being recompiled.

Referenced by
[Runtime Extensibility](PRINCIPLES.md#arch-runtime-extensibility)

### Compile-Time Binding

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Binding a call to a specific implementation at compile time, so the target cannot vary at runtime.

Referenced by
[Dynamic Binding](PRINCIPLES.md#arch-dynamic-binding)

### Conventions

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement that components follow shared naming or placement conventions so they can be found automatically.

Referenced by
[Auto-Discovery](PRINCIPLES.md#arch-auto-discovery)

### Deferred Implementation Choice

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to postpone choosing a concrete implementation until runtime.

Referenced by
[Late Binding](PRINCIPLES.md#arch-late-binding)

### Dynamic Routing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to route requests to service instances discovered at runtime.

Referenced by
[Service Discovery](PRINCIPLES.md#arch-service-discovery)

### Early Binding

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Fixing which implementation a call uses at compile time, preventing a runtime choice.

Referenced by
[Late Binding](PRINCIPLES.md#arch-late-binding)

### Environment-Specific Composition

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability to assemble different implementations per environment at runtime.

Referenced by
[Runtime Binding](PRINCIPLES.md#arch-runtime-binding)

### Extensibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which new behavior can be added with minimal change to existing code.

Referenced by
[Dynamic Binding](PRINCIPLES.md#arch-dynamic-binding)

### Hardcoded Endpoints

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Hardcoding service network addresses instead of discovering them dynamically.

Referenced by
[Service Discovery](PRINCIPLES.md#arch-service-discovery)

### Manual Registration

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Requiring each component to be registered by hand instead of being discovered automatically.

Referenced by
[Auto-Discovery](PRINCIPLES.md#arch-auto-discovery)

### Registry/Discovery Mechanism

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
A facility that lets components find and resolve one another at runtime.

Referenced by
[Runtime Discovery](PRINCIPLES.md#arch-runtime-discovery)

### Replace Conditional with Polymorphism

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Replacing a branching conditional on type with polymorphic dispatch through a shared interface.

Referenced by
[Dynamic Dispatch](PRINCIPLES.md#arch-dynamic-dispatch)

### Runtime Discovery or Configuration

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement that implementations be discoverable or configurable at runtime rather than fixed.

Referenced by
[Runtime Binding](PRINCIPLES.md#arch-runtime-binding)

### Runtime Resolution

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The requirement that a symbol's concrete binding be resolved during execution rather than at compile time.

Referenced by
[Dynamic Binding](PRINCIPLES.md#arch-dynamic-binding)

### Self-Registration

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The ability for a component to register itself on load without external wiring.

Referenced by
[Auto-Discovery](PRINCIPLES.md#arch-auto-discovery)

### Startup Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
The degree to which scanning for components at startup slows the system's initialization.

Referenced by
[Auto-Discovery](PRINCIPLES.md#arch-auto-discovery)

### Static Linking

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Binding all components at build time through static linking, so nothing can be discovered at runtime.

Referenced by
[Runtime Discovery](PRINCIPLES.md#arch-runtime-discovery)

### Static Wiring

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Runtime Discovery / Dynamic Binding](LEXICON.md#lex-category-runtime-discovery-dynamic-binding)
- Layer: [Extensibility Core](SCHEMA.md#layer-extensibility-core)

Details

Definition
Wiring components together at build time, so composition cannot vary at runtime.

Referenced by
[Runtime Binding](PRINCIPLES.md#arch-runtime-binding)

## Scalability / Performance / Optimization

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Abuse/Overload Protection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to shield a system from abusive or excessive request volume.

Referenced by
[Rate Limiting](PRINCIPLES.md#arch-rate-limiting)

### Always-Fresh Reads

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which every read returns the most recent write, which caching trades away for speed.

Referenced by
[Caching](PRINCIPLES.md#arch-caching)

### Anecdotal Performance Claims

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Asserting performance characteristics from anecdote or intuition rather than measured evidence.

Referenced by
[Big O Notation](PRINCIPLES.md#arch-big-o-notation)

### Anecdotal Timing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Judging how fast code runs from casual observation instead of controlled measurement.

Referenced by
[Benchmarking](PRINCIPLES.md#arch-benchmarking)

### Arrival and Service Rates

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The measured rates at which requests arrive and at which a server completes them, the inputs a queuing model needs.

Referenced by
[Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Bottleneck Awareness

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to recognize which component limits a system's overall throughput.

Referenced by
[Scalability](PRINCIPLES.md#arch-scalability)

### Bottleneck Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to locate the component that most constrains overall performance.

Referenced by
[Profiling](PRINCIPLES.md#arch-profiling)

### Bottleneck Evidence

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Measured data identifying which component constrains performance, justifying where to optimize.

Referenced by
[Optimization](PRINCIPLES.md#arch-optimization)

### Bottlenecks

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A single stage that constrains overall throughput because all work must pass through it.

Referenced by
[Throughput](PRINCIPLES.md#arch-throughput)

### Cache Invalidation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The activity of removing or refreshing cached entries so stale data is not served.

Referenced by
[CDN / Edge Caching](PRINCIPLES.md#arch-cdn-edge-caching)

### Cacheable Content

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The requirement that content be stable enough to serve from a cache without harmful staleness.

Referenced by
[CDN / Edge Caching](PRINCIPLES.md#arch-cdn-edge-caching)

### Capacity Increase without Distribution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to raise capacity by enlarging a single machine rather than adding more machines.

Referenced by
[Vertical Scaling](PRINCIPLES.md#arch-vertical-scaling)

### Capacity Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A representation of how a system's capacity responds to load, used to predict its limits.

Referenced by
[Throughput](PRINCIPLES.md#arch-throughput)

### Comparative Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to compare algorithms by how their cost grows, independent of hardware.

Referenced by
[Big O Notation](PRINCIPLES.md#arch-big-o-notation)

### Complexity Awareness

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to reason about how an algorithm's cost grows with input size.

Referenced by
[Algorithmic Efficiency](PRINCIPLES.md#arch-algorithmic-efficiency)

### Complexity Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A representation of how an algorithm's resource use scales with input size.

Referenced by
[Big O Notation](PRINCIPLES.md#arch-big-o-notation)

### Constant-Factor Practicality

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which constant factors, ignored by asymptotic analysis, affect measured performance.

Referenced by
[Big O Notation](PRINCIPLES.md#arch-big-o-notation)

### Cost Efficiency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which a system delivers its work at the lowest resource cost.

Referenced by
[Elasticity](PRINCIPLES.md#arch-elasticity)

### Cost/Limit

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which a bigger single machine costs disproportionately more and eventually hits a hard limit.

Referenced by
[Vertical Scaling](PRINCIPLES.md#arch-vertical-scaling)

### CPU Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of processor time a technique consumes, often traded against memory savings.

Referenced by
[Memory Efficiency](PRINCIPLES.md#arch-memory-efficiency)

### Cross-Shard Queries

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of difficulty and cost of a query that must gather data from multiple shards.

Referenced by
[Sharding](PRINCIPLES.md#arch-sharding)

### Distributed Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of intricacy introduced by spreading work across distributed nodes.

Referenced by
[Bottleneck Analysis](PRINCIPLES.md#arch-bottleneck-analysis)

### Distributed Coordination

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of coordination overhead required to keep distributed instances consistent.

Referenced by
[Horizontal Scaling](PRINCIPLES.md#arch-horizontal-scaling)

### Dynamic Capacity

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to add or remove capacity automatically as demand rises and falls.

Referenced by
[Elasticity](PRINCIPLES.md#arch-elasticity)

### Efficient Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to complete work using the fewest operations and least resource for the input.

Referenced by
[Algorithmic Efficiency](PRINCIPLES.md#arch-algorithmic-efficiency)

### Environment Drift

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which a test or runtime environment diverges from a reference over time, undermining comparability.

Referenced by
[Benchmarking](PRINCIPLES.md#arch-benchmarking)

### Evidence-Based Optimization

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The activity of improving performance guided by measurement rather than assumption.

Referenced by
[Performance Engineering](PRINCIPLES.md#arch-performance-engineering)

### Externalized State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The requirement that session or request state be held outside the serving instance, in a shared store.

Referenced by
[Statelessness](PRINCIPLES.md#arch-statelessness)

### Fixed Provisioning

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Allocating a static amount of capacity regardless of demand, so the system is either starved or wasteful.

Referenced by
[Elasticity](PRINCIPLES.md#arch-elasticity)

### Fixed-Capacity Design

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Building a system around a fixed capacity ceiling that cannot grow when load increases.

Referenced by
[Scalability](PRINCIPLES.md#arch-scalability)

### Full Materialization

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Loading an entire dataset into memory at once when streaming or chunking would suffice, risking exhaustion.

Referenced by
[Memory Efficiency](PRINCIPLES.md#arch-memory-efficiency)

### Geographically-Local Delivery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to serve content from a location near the user, cutting distance latency.

Referenced by
[CDN / Edge Caching](PRINCIPLES.md#arch-cdn-edge-caching)

### Global Shared State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A single mutable state shared across all workers, forcing coordination and preventing independent scaling.

Referenced by
[Partitioning](PRINCIPLES.md#arch-partitioning)

### Growth Handling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to absorb increasing load without redesign.

Referenced by
[Scalability](PRINCIPLES.md#arch-scalability)

### Guess-Based Capacity

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Sizing capacity from guesswork rather than a model of arrival and service rates.

Referenced by
[Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Guess-Based Optimization

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Optimizing based on assumptions about where time is spent rather than profiling evidence.

Referenced by
[Performance Engineering](PRINCIPLES.md#arch-performance-engineering)

### Guesswork

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Deciding where to optimize by intuition instead of measured profiling data.

Referenced by
[Profiling](PRINCIPLES.md#arch-profiling)

### Hard Resource Ceiling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A fixed upper bound on a single machine's resources that caps how far vertical scaling can go.

Referenced by
[Vertical Scaling](PRINCIPLES.md#arch-vertical-scaling)

### Implementation Simplicity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which code stays simple and clear, sometimes traded against maximal efficiency.

Referenced by
[Algorithmic Efficiency](PRINCIPLES.md#arch-algorithmic-efficiency)

### Inefficient Algorithm Choice

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Selecting an algorithm whose complexity scales poorly for the expected input size.

Referenced by
[Algorithmic Efficiency](PRINCIPLES.md#arch-algorithmic-efficiency)

### Input Size Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A representation of the input dimension against which an algorithm's running time is measured.

Referenced by
[Time Complexity](PRINCIPLES.md#arch-time-complexity)

### Instance Affinity

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Binding a client to a specific server instance for its state, preventing free rebalancing across instances.

Referenced by
[Statelessness](PRINCIPLES.md#arch-statelessness)

### Instance-Local State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Holding request-spanning state on one instance, so requests cannot be served by any other instance.

Referenced by
[Horizontal Scaling](PRINCIPLES.md#arch-horizontal-scaling)

### Invalidation Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The rules determining when cached entries are considered stale and must be refreshed or evicted.

Referenced by
[Caching](PRINCIPLES.md#arch-caching)

### Large Dataset Scaling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to grow storage and throughput by spreading a dataset across many shards.

Referenced by
[Sharding](PRINCIPLES.md#arch-sharding)

### Latency Reduction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to lower response time by serving results from a nearer or faster source.

Referenced by
[Caching](PRINCIPLES.md#arch-caching)

### Load Handling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to process a high volume of work without degrading.

Referenced by
[Throughput](PRINCIPLES.md#arch-throughput)

### Load Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A representation of the expected volume and pattern of demand a system must handle.

Referenced by
[Scalability](PRINCIPLES.md#arch-scalability)

### Local Micro-Optimization

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Tuning a non-bottleneck section for marginal gains while the constraint that limits performance goes unaddressed.

Referenced by
[Bottleneck Analysis](PRINCIPLES.md#arch-bottleneck-analysis)

### Long Blocking Work

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Performing lengthy synchronous work on a request path, blocking it and inflating latency.

Referenced by
[Latency](PRINCIPLES.md#arch-latency)

### Measurement Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of performance cost that the act of measuring imposes on the system being measured.

Referenced by
[Profiling](PRINCIPLES.md#arch-profiling)

### Memory Model

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A representation of how an algorithm's memory use grows with input size.

Referenced by
[Space Complexity](PRINCIPLES.md#arch-space-complexity)

### Memory Scalability

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to handle larger inputs without memory use growing prohibitively.

Referenced by
[Space Complexity](PRINCIPLES.md#arch-space-complexity)

### Model Assumptions

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The simplifying premises a performance model depends on, which limit how well it matches reality.

Referenced by
[Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Multi-Core Utilization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to use multiple processor cores simultaneously for a single workload.

Referenced by
[Parallelism](PRINCIPLES.md#arch-parallelism)

### Multiple Targets

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The precondition that more than one interchangeable backend exists across which traffic can be spread.

Referenced by
[Load Balancing](PRINCIPLES.md#arch-load-balancing)

### Origin Offload

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to relieve the origin server by serving cached copies from the edge.

Referenced by
[CDN / Edge Caching](PRINCIPLES.md#arch-cdn-edge-caching)

### Origin-Only Serving

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Serving all content directly from the origin with no edge caching, concentrating load and adding distance latency.

Referenced by
[CDN / Edge Caching](PRINCIPLES.md#arch-cdn-edge-caching)

### Over-Provisioning

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which allocated capacity exceeds demand, trading waste for safety margin.

Referenced by
[Resource Utilization](PRINCIPLES.md#arch-resource-utilization)

### Overlapping Work

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to make progress on multiple tasks over the same period by interleaving them.

Referenced by
[Concurrency](PRINCIPLES.md#arch-concurrency)

### Partition Key

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The field whose value determines which shard or partition a record belongs to.

Referenced by
[Sharding](PRINCIPLES.md#arch-sharding)

### Partition Strategy

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A scheme for dividing data or work across independent partitions to distribute load and enable parallelism.

Referenced by
[Partitioning](PRINCIPLES.md#arch-partitioning)

### Premature Optimization

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Optimizing code before evidence shows it matters, adding complexity for gains that may never be needed.

Referenced by
[Optimization](PRINCIPLES.md#arch-optimization)

### Quota Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The declared limits on how many requests a caller may make within a time window.

Referenced by
[Rate Limiting](PRINCIPLES.md#arch-rate-limiting)

### Read Traffic Offload

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to divert read queries to replicas, relieving the primary.

Referenced by
[Read Replica](PRINCIPLES.md#arch-read-replica)

### Read-Your-Writes Consistency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which a client is guaranteed to see its own prior writes, which replica lag can break.

Referenced by
[Read Replica](PRINCIPLES.md#arch-read-replica)

### Readability/Maintainability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which code stays readable and maintainable, sometimes sacrificed for performance.

Referenced by
[Optimization](PRINCIPLES.md#arch-optimization)

### Rebalancing Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of difficulty of redistributing data when partitions are added or removed.

Referenced by
[Partitioning](PRINCIPLES.md#arch-partitioning)

### Reduced Load

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to lessen work reaching a backend by serving repeat results from a cache.

Referenced by
[Caching](PRINCIPLES.md#arch-caching)

### Regression Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to catch a performance regression by comparing measurements against a baseline.

Referenced by
[Benchmarking](PRINCIPLES.md#arch-benchmarking)

### Repeatable Test Environment

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A controlled, reproducible environment in which measurements can be compared meaningfully across runs.

Referenced by
[Benchmarking](PRINCIPLES.md#arch-benchmarking)

### Representative Workload

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A workload that reflects production usage closely enough that measurements generalize.

Referenced by
[Profiling](PRINCIPLES.md#arch-profiling)

### Resource Headroom

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of spare capacity remaining on a machine before its resource ceiling is reached.

Referenced by
[Vertical Scaling](PRINCIPLES.md#arch-vertical-scaling)

### Resource Waste/Saturation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Running resources far below or far above healthy utilization, either wasting capacity or saturating it.

Referenced by
[Resource Utilization](PRINCIPLES.md#arch-resource-utilization)

### Responsiveness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which a system reacts quickly to user actions or requests.

Referenced by
[Latency](PRINCIPLES.md#arch-latency)

### Scalability Analysis

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The activity of assessing how a system's cost grows as load or input increases.

Referenced by
[Time Complexity](PRINCIPLES.md#arch-time-complexity)

### Scale-Out

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to add capacity by adding more machines that share the load.

Referenced by
[Horizontal Scaling](PRINCIPLES.md#arch-horizontal-scaling)

### Sequential Bottleneck

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A portion of work that must run serially, capping the speedup that parallelism can achieve.

Referenced by
[Parallelism](PRINCIPLES.md#arch-parallelism)

### Session Affinity

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Routing all of a client's requests to the same server instance so its session state stays local.

Referenced by
[Load Balancing](PRINCIPLES.md#arch-load-balancing)

### Single Monolithic Store

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Concentrating all data in one store that cannot be partitioned, capping write and storage scalability.

Referenced by
[Sharding](PRINCIPLES.md#arch-sharding)

### Single Target Routing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Directing all traffic to one target instead of distributing it, wasting capacity and creating a bottleneck.

Referenced by
[Load Balancing](PRINCIPLES.md#arch-load-balancing)

### Single-Primary Read Contention

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Serving all reads from the single primary, so read load contends with writes and limits throughput.

Referenced by
[Read Replica](PRINCIPLES.md#arch-read-replica)

### Space Complexity Awareness

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to reason about how an algorithm's memory use grows with input size.

Referenced by
[Memory Efficiency](PRINCIPLES.md#arch-memory-efficiency)

### State Access Latency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of added latency incurred when state is fetched from an external store rather than held locally.

Referenced by
[Statelessness](PRINCIPLES.md#arch-statelessness)

### Statelessness or Shared State Strategy

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
A decision to make instances stateless or externalize state to a shared store, so any instance can serve any request.

Referenced by
[Horizontal Scaling](PRINCIPLES.md#arch-horizontal-scaling)

### Targeted Improvement

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to direct optimization effort at the specific constraint that limits performance.

Referenced by
[Bottleneck Analysis](PRINCIPLES.md#arch-bottleneck-analysis)

### Throughput/Batching

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree to which batching work raises throughput at the cost of per-item latency.

Referenced by
[Latency](PRINCIPLES.md#arch-latency)

### Traffic Distribution

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to spread incoming requests across multiple backends evenly.

Referenced by
[Load Balancing](PRINCIPLES.md#arch-load-balancing)

### Unbounded Access

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Permitting callers to make unlimited requests with no rate limit, allowing overload and abuse.

Referenced by
[Rate Limiting](PRINCIPLES.md#arch-rate-limiting)

### Unbounded Memory Growth

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
Accumulating state without bound so memory usage grows until the process exhausts it.

Referenced by
[Space Complexity](PRINCIPLES.md#arch-space-complexity)

### Unbounded Runtime Growth

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
An algorithm whose running time grows without bound as input scales, becoming infeasible at size.

Referenced by
[Time Complexity](PRINCIPLES.md#arch-time-complexity)

### Utilization-Based Sizing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to size capacity from measured utilization and wait-time targets.

Referenced by
[Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Wait-Time Prediction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The ability to predict how long work will wait given arrival and service rates.

Referenced by
[Queuing Theory](PRINCIPLES.md#arch-queuing-theory)

### Warm-Up Latency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Scalability / Performance / Optimization](LEXICON.md#lex-category-scalability-performance-optimization)
- Layer: [Performance Core](SCHEMA.md#layer-performance-core)

Details

Definition
The degree of delay before newly-added capacity becomes ready to serve traffic.

Referenced by
[Elasticity](PRINCIPLES.md#arch-elasticity)

## Schema / Canonical Data / Semantics

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ambiguous API

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
An interface whose names and parameters hide what it does, so callers must guess or read the implementation.

Referenced by
[Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface)

### Ambiguous Encoding

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Representing the same value in multiple encodings without normalizing, so equal values compare as different.

Referenced by
[Canonicalization](PRINCIPLES.md#arch-canonicalization)

### Bounded Context Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which enforcing one canonical model limits each bounded context's freedom to model its own domain.

Referenced by
[Canonical Model](PRINCIPLES.md#arch-canonical-model)

### Bounded Context Purity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which sharing one enterprise data model erodes the conceptual purity of each bounded context.

Referenced by
[Canonical Data Model](PRINCIPLES.md#arch-canonical-data-model)

### Canonical Definition

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that each fact have one authoritative definition that all consumers reference.

Referenced by
[Single Source of Truth](PRINCIPLES.md#arch-single-source-of-truth)

### Canonical Format

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that a single normalized form be defined for values before they are compared or stored.

Referenced by
[Canonicalization](PRINCIPLES.md#arch-canonicalization)

### Clear Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that an interface's names convey what each operation does and expects.

Referenced by
[Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface)

### Clever Abstractions

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which clever, non-obvious abstractions trade familiarity for surprise to the reader.

Referenced by
[Principle of Least Surprise](PRINCIPLES.md#arch-principle-of-least-surprise)

### Concise Naming

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which naming an interface fully for clarity works against keeping names short.

Referenced by
[Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface), [Member Never Restates the Set](PRINCIPLES.md#arch-member-never-restates-the-set)

### Convention

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that a design follow established conventions so its behavior matches expectations.

Referenced by
[Principle of Least Surprise](PRINCIPLES.md#arch-principle-of-least-surprise)

### Correct Usage

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability of callers to use an interface correctly because its names reveal its intent.

Referenced by
[Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface)

### Cross-Context Terminology

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which agreeing on shared terms strains against the distinct vocabularies different contexts need.

Referenced by
[Ubiquitous Language](PRINCIPLES.md#arch-ubiquitous-language)

### Cross-System Mapping

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to map data between systems through a single shared canonical representation.

Referenced by
[Canonical Data Model](PRINCIPLES.md#arch-canonical-data-model)

### Data Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that the meaning and dependencies of data be understood before it is decomposed into relations.

Referenced by
[Normalization](PRINCIPLES.md#arch-normalization)

### Deduplication

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to recognize and collapse values that are equivalent once reduced to canonical form.

Referenced by
[Canonicalization](PRINCIPLES.md#arch-canonicalization)

### Denormalized Read Models

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
A read-optimized model that deliberately duplicates data to serve queries fast, trading storage and write cost for read speed.

Referenced by
[Normalization](PRINCIPLES.md#arch-normalization)

### Disambiguation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to give each concept one unambiguous name and meaning across a domain.

Referenced by
[Semantic Consistency](PRINCIPLES.md#arch-semantic-consistency)

### Domain Collaboration

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that domain experts and developers collaborate to agree on shared terminology.

Referenced by
[Ubiquitous Language](PRINCIPLES.md#arch-ubiquitous-language)

### Duplicated Authority

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Two or more places each claiming to own the same fact, so they drift and disagree over time.

Referenced by
[Single Source of Truth](PRINCIPLES.md#arch-single-source-of-truth)

### Duplicated Denormalized Columns

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The same fact copied into many columns and rows, so updates must touch every copy or leave them inconsistent.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization)

### Dynamic Untyped Boundaries

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Passing untyped values across module or service boundaries, so type errors surface only at runtime.

Referenced by
[Type Safety](PRINCIPLES.md#arch-type-safety)

### Explicit Types

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that values crossing a boundary carry explicit, declared types rather than open-ended ones.

Referenced by
[Type Safety](PRINCIPLES.md#arch-type-safety)

### Flexible Input

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which strictly validating every payload rejects the loosely-shaped input a caller might legitimately send.

Referenced by
[Schema Validation](PRINCIPLES.md#arch-schema-validation)

### Functional Dependencies

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that the dependencies determining which attributes fix others be identified before decomposing a schema.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization)

### Local Model Autonomy

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a bounded context is free to define and evolve its own data model independently of a shared canonical one.

Referenced by
[Canonical Data Model](PRINCIPLES.md#arch-canonical-data-model)

### Lossless Preservation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which reducing values to a canonical form can discard distinctions the original preserved.

Referenced by
[Canonicalization](PRINCIPLES.md#arch-canonicalization)

### Multiple Competing Models

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Several inconsistent models of the same concept coexisting, so translations between them drift and conflict.

Referenced by
[Canonical Model](PRINCIPLES.md#arch-canonical-model)

### Naming Consistency

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The requirement that names for the same concept be used consistently across an interface.

Referenced by
[Intent-Revealing Interface](PRINCIPLES.md#arch-intent-revealing-interface), [Member Never Restates the Set](PRINCIPLES.md#arch-member-never-restates-the-set)

### Non-Redundant Storage

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to store each fact once, so it cannot drift out of sync with copies.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization)

### Normalized Translation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to translate between systems through one shared canonical form rather than many pairwise mappings.

Referenced by
[Canonical Model](PRINCIPLES.md#arch-canonical-model)

### Polysemy Across Contexts

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which one term legitimately carries different meanings in different bounded contexts.

Referenced by
[Semantic Consistency](PRINCIPLES.md#arch-semantic-consistency)

### Query Performance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which splitting data across normalized relations forces costly joins on read.

Referenced by
[Normalization](PRINCIPLES.md#arch-normalization)

### Rapid Scripting

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which requiring explicit types slows the quick, exploratory coding that dynamic typing allows.

Referenced by
[Type Safety](PRINCIPLES.md#arch-type-safety)

### Read Performance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which normalizing a schema into many relations forces joins that slow reads.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization)

### Reduced Redundancy

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to eliminate duplicated facts by referencing a single stored copy.

Referenced by
[Normalization](PRINCIPLES.md#arch-normalization)

### Safe Use

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to use an interface safely because it behaves the way its name and shape suggest.

Referenced by
[Principle of Least Surprise](PRINCIPLES.md#arch-principle-of-least-surprise)

### Security Checks

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to apply security checks reliably by first reducing input to one unambiguous form.

Referenced by
[Canonicalization](PRINCIPLES.md#arch-canonicalization)

### Service-Specific Schemas

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The degree to which a shared canonical schema competes with each service's need for its own tailored schema.

Referenced by
[Canonical Schema](PRINCIPLES.md#arch-canonical-schema)

### Technical/Domain Mismatch

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Naming code in technical terms disconnected from the domain, so experts and developers talk past each other.

Referenced by
[Ubiquitous Language](PRINCIPLES.md#arch-ubiquitous-language)

### Untyped Payloads

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
Accepting data at a boundary with no schema, so malformed or unexpected shapes flow in unchecked.

Referenced by
[Schema Validation](PRINCIPLES.md#arch-schema-validation)

### Update-Anomaly Elimination

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Schema / Canonical Data / Semantics](LEXICON.md#lex-category-schema-canonical-data-semantics)
- Layer: [Contracts Core](SCHEMA.md#layer-contracts-core)

Details

Definition
The ability to eliminate update anomalies by storing each fact in exactly one place.

Referenced by
[Database Normalization](PRINCIPLES.md#arch-database-normalization)

## Security Privacy Compliance

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ad-Hoc Permission Checks

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Authorization logic scattered inline throughout the codebase instead of centralized, leaving checks inconsistent and easy to omit.

Referenced by
[RBAC](PRINCIPLES.md#arch-role-based-access-control)

### Ambient-Credential Trust

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Treating any request that carries ambient credentials, such as a session cookie, as legitimate without verifying its origin or intent.

Referenced by
[CSRF Protection](PRINCIPLES.md#arch-csrf-protection)

### Analytics/Personalization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to analyze collected data and tailor experiences to individuals, in tension with strict data minimization.

Referenced by
[Privacy by Design](PRINCIPLES.md#arch-privacy-by-design)

### Anonymous Sensitive Access

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Permitting access to sensitive resources without first establishing the caller's identity.

Referenced by
[Authentication](PRINCIPLES.md#arch-authentication)

### Assets

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The data, systems, and capabilities of value that a threat model enumerates as the things worth protecting.

Referenced by
[Threat Modeling](PRINCIPLES.md#arch-threat-modeling)

### Assumption-Driven Security

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Designing defenses around assumed threats rather than a deliberate analysis of realistic attack vectors.

Referenced by
[Threat Modeling](PRINCIPLES.md#arch-threat-modeling)

### Attribute Definitions

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Declared descriptions of the subject, resource, action, and environment attributes that an access policy evaluates.

Referenced by
[ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Authenticated Principal

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The verified identity of the user or service on whose behalf a request executes, against which permissions are checked.

Referenced by
[Authorization](PRINCIPLES.md#arch-authorization)

### Authenticated-Equals-Authorized

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Conflating authentication with authorization, so any authenticated caller is granted access without a permission check.

Referenced by
[Authorization](PRINCIPLES.md#arch-authorization)

### Authorization Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The declared set of rules determining which principals may perform which actions on which resources.

Referenced by
[Access Control](PRINCIPLES.md#arch-access-control)

### Automated Control

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to enforce rules automatically at runtime without manual intervention.

Referenced by
[Policy Enforcement](PRINCIPLES.md#arch-policy-enforcement)

### Bounded Session Lifetime

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a session's validity is time-limited so that access does not persist indefinitely.

Referenced by
[Session Management](PRINCIPLES.md#arch-session-management)

### Broad Admin Access

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Granting sweeping administrative privileges by default instead of the least access each role requires.

Referenced by
[Least Privilege](PRINCIPLES.md#arch-least-privilege)

### Certificate Management

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of issuing, deploying, renewing, and revoking the digital certificates that transport encryption depends on.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Client Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of additional effort a protective measure imposes on client implementations.

Referenced by
[CSRF Protection](PRINCIPLES.md#arch-csrf-protection)

### Coarse-Grained Permission Management

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to manage access by assigning broad, role-level permission sets rather than per-individual grants.

Referenced by
[RBAC](PRINCIPLES.md#arch-role-based-access-control)

### Compromise Containment

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to keep a breach confined to one layer or segment so it cannot spread system-wide.

Referenced by
[Defense in Depth](PRINCIPLES.md#arch-defense-in-depth)

### Confidentiality

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which data is kept secret from all but authorized parties.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Confidentiality of Stored Data

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which data held at rest remains unreadable to anyone without authorized access.

Referenced by
[Encryption at Rest](PRINCIPLES.md#arch-encryption-at-rest)

### Consent/Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The recorded permission and governing rules under which personal data may lawfully be collected and processed.

Referenced by
[Privacy by Design](PRINCIPLES.md#arch-privacy-by-design)

### Context-Aware Authorization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to base access decisions on the runtime context of a request, such as its attributes, its environment and the resource's state.

Referenced by
[ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Context-Aware Encoding

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Choosing an output encoding matched to the destination context, such as HTML, an attribute, a URL or a script, so data is neutralized wherever it lands.

Referenced by
[Output Encoding](PRINCIPLES.md#arch-output-encoding)

### Continuous Authorization

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The practice of re-verifying a caller's authorization on every request rather than trusting a single earlier check.

Referenced by
[Zero Trust Architecture](PRINCIPLES.md#arch-zero-trust-architecture)

### Control Selection

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of choosing which security controls to apply based on identified threats and their priority.

Referenced by
[Threat Modeling](PRINCIPLES.md#arch-threat-modeling)

### Controls

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The safeguards and countermeasures put in place to reduce security or compliance risk to an acceptable level.

Referenced by
[Compliance](PRINCIPLES.md#arch-compliance)

### Data Minimization

- Kind: [principle](SCHEMA.md#kind-principle)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Collecting and retaining only the personal data strictly necessary for a stated purpose.

Referenced by
[Privacy by Design](PRINCIPLES.md#arch-privacy-by-design)

### Data Protection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to safeguard data against unauthorized access, loss, or disclosure throughout its lifecycle.

Referenced by
[Encryption at Rest](PRINCIPLES.md#arch-encryption-at-rest)

### Defined Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
An explicit, declared set of rules specifying what is permitted or denied, against which enforcement acts.

Referenced by
[Policy Enforcement](PRINCIPLES.md#arch-policy-enforcement)

### Developer Ergonomics

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system is convenient and pleasant for developers to work with.

Referenced by
[Security by Design](PRINCIPLES.md#arch-security-by-design)

### Document-Only Policy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Expressing security policy only as prose documentation, so it cannot be enforced automatically and drifts from what the system does.

Referenced by
[Policy as Code](PRINCIPLES.md#arch-policy-as-code)

### Dynamic Query Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of freedom to vary a query's structure at runtime, constrained when inputs must be bound as parameters.

Referenced by
[Parameterized Queries](PRINCIPLES.md#arch-parameterized-queries)

### Ease of Initial Use

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system is easy to start using without upfront configuration.

Referenced by
[Secure by Default](PRINCIPLES.md#arch-secure-by-default)

### Evidence Automation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to generate and collect compliance evidence automatically from live systems rather than assembling it by hand.

Referenced by
[Continuous Compliance](PRINCIPLES.md#arch-continuous-compliance)

### Feature Exposure

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which functionality is made accessible, which broadens capability but enlarges the attack surface.

Referenced by
[Attack Surface Reduction](PRINCIPLES.md#arch-attack-surface-reduction)

### Fine-Grained Access Control

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to grant or deny access at a precise level using specific attributes rather than broad roles.

Referenced by
[ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Forged-Request Rejection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to detect and reject requests that a user did not intentionally initiate.

Referenced by
[CSRF Protection](PRINCIPLES.md#arch-csrf-protection)

### Formatting Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of latitude to present output in varied formats, constrained when encoding must be strict.

Referenced by
[Output Encoding](PRINCIPLES.md#arch-output-encoding)

### Hardcoded Rules

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Embedding access rules directly in code, so changing policy requires a code change and cannot respond to runtime attributes.

Referenced by
[ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Hardcoded Secrets

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Embedding credentials, keys, or tokens directly in source or configuration, exposing them to anyone who can read it.

Referenced by
[Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Identity Proof

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The evidence a principal presents to establish its identity, such as a password, token, or certificate.

Referenced by
[Authentication](PRINCIPLES.md#arch-authentication)

### Identity-Aware Authorization

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to make access decisions grounded in a verified caller identity.

Referenced by
[Authentication](PRINCIPLES.md#arch-authentication)

### Immortal Client-Trusted Session

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A session that never expires and is trusted from client-supplied state alone, so a captured token grants indefinite access.

Referenced by
[Session Management](PRINCIPLES.md#arch-session-management)

### Injection Prevention

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to stop untrusted input from being interpreted as executable code or commands.

Referenced by
[Output Encoding](PRINCIPLES.md#arch-output-encoding)

### Injection-Safe Data Access

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to query data such that input can never be interpreted as part of the query structure.

Referenced by
[Parameterized Queries](PRINCIPLES.md#arch-parameterized-queries)

### Input Flexibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system accepts varied or loosely-structured input, in tension with strict validation.

Referenced by
[Input Validation](PRINCIPLES.md#arch-input-validation)

### Insecure Defaults

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Shipping default settings that favor convenience over safety, leaving a system exposed unless it is explicitly hardened.

Referenced by
[Secure by Default](PRINCIPLES.md#arch-secure-by-default)

### Integrity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which data is protected from unauthorized or undetected alteration.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Key Management

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of generating, distributing, rotating, and revoking cryptographic keys across their lifecycle.

Referenced by
[Encryption at Rest](PRINCIPLES.md#arch-encryption-at-rest)

### Key Operations

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of operational burden imposed by generating, rotating, and safeguarding cryptographic keys.

Referenced by
[Encryption at Rest](PRINCIPLES.md#arch-encryption-at-rest)

### Latency/Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of added latency and complexity introduced by verifying every request rather than trusting a perimeter.

Referenced by
[Zero Trust Architecture](PRINCIPLES.md#arch-zero-trust-architecture)

### Layered Controls

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The requirement that multiple independent safeguards protect a resource, so no single failure exposes it.

Referenced by
[Defense in Depth](PRINCIPLES.md#arch-defense-in-depth)

### Machine-Readable Policies

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Security or compliance policies expressed in a structured, executable format that tools can evaluate directly.

Referenced by
[Policy as Code](PRINCIPLES.md#arch-policy-as-code)

### Manual-Only Review

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Relying solely on human review to catch policy violations, which neither scales nor reliably covers every case.

Referenced by
[Policy Enforcement](PRINCIPLES.md#arch-policy-enforcement)

### Minimal Exposure

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The condition of exposing only the endpoints, ports, and capabilities strictly required.

Referenced by
[Attack Surface Reduction](PRINCIPLES.md#arch-attack-surface-reduction)

### Minimal Permissions

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The requirement that each principal hold only the permissions its function needs.

Referenced by
[Least Privilege](PRINCIPLES.md#arch-least-privilege)

### Mitigation

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of reducing a risk's likelihood or impact through deliberate countermeasures.

Referenced by
[Risk Management](PRINCIPLES.md#arch-risk-management)

### Ongoing Assurance

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to demonstrate continuously that controls remain effective, rather than only at audit time.

Referenced by
[Continuous Compliance](PRINCIPLES.md#arch-continuous-compliance)

### Operational Convenience

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which broad access makes day-to-day operations easier, in tension with least privilege.

Referenced by
[Least Privilege](PRINCIPLES.md#arch-least-privilege)

### Perimeterless Security

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A security model that trusts no network location implicitly and verifies every request regardless of origin.

Referenced by
[Zero Trust Architecture](PRINCIPLES.md#arch-zero-trust-architecture)

### Pipeline Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree of intricacy added to a delivery pipeline by embedding continuous checks within it.

Referenced by
[Continuous Compliance](PRINCIPLES.md#arch-continuous-compliance)

### Plaintext Sensitive Storage

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Storing sensitive data unencrypted at rest, exposing it to anyone who reaches the underlying storage.

Referenced by
[Encryption at Rest](PRINCIPLES.md#arch-encryption-at-rest)

### Plaintext Transport

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Sending data over an unencrypted channel, exposing it to interception and tampering in transit.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Point-in-Time Audit Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Verifying compliance only at isolated audit moments, leaving the intervals between checks unmonitored for drift.

Referenced by
[Continuous Compliance](PRINCIPLES.md#arch-continuous-compliance)

### Policy Engine

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A runtime component that evaluates access requests against declared policies and returns permit or deny decisions.

Referenced by
[ABAC](PRINCIPLES.md#arch-attribute-based-access-control)

### Policy Maintenance

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of keeping codified policies correct and current as requirements evolve.

Referenced by
[Policy as Code](PRINCIPLES.md#arch-policy-as-code)

### Priority-Based Controls

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to apply controls in order of risk priority, addressing the greatest exposure first.

Referenced by
[Risk Management](PRINCIPLES.md#arch-risk-management)

### Privacy Compliance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system meets the privacy obligations imposed by law and policy.

Referenced by
[Privacy by Design](PRINCIPLES.md#arch-privacy-by-design)

### Proactive Risk Reduction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to reduce risk by designing safeguards in from the start rather than patching flaws later.

Referenced by
[Security by Design](PRINCIPLES.md#arch-security-by-design)

### Query Parameter Binding

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Passing query values as bound parameters separate from the query text, so input can never alter the query structure.

Referenced by
[Parameterized Queries](PRINCIPLES.md#arch-parameterized-queries)

### Raw Output Rendering

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Emitting untrusted data into output without encoding it for its context, enabling injection attacks such as cross-site scripting.

Referenced by
[Output Encoding](PRINCIPLES.md#arch-output-encoding)

### Reduced Blast Radius

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which the impact of a compromise is confined to a limited scope.

Referenced by
[Least Privilege](PRINCIPLES.md#arch-least-privilege)

### Reduced Exploitability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which fewer exposed features leave a system harder to exploit.

Referenced by
[Attack Surface Reduction](PRINCIPLES.md#arch-attack-surface-reduction)

### Reduced Misconfiguration Risk

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which safe defaults lower the chance of an insecure configuration.

Referenced by
[Secure by Default](PRINCIPLES.md#arch-secure-by-default)

### Regulatory Alignment

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system conforms to the laws and regulations that govern it.

Referenced by
[Compliance](PRINCIPLES.md#arch-compliance)

### Request Origin Verification

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Confirming that a state-changing request originates from a trusted client, typically via a token or origin check.

Referenced by
[CSRF Protection](PRINCIPLES.md#arch-csrf-protection)

### Resource Protection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to ensure that only permitted operations reach a protected resource.

Referenced by
[Access Control](PRINCIPLES.md#arch-access-control)

### Review

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of examining a change or artifact against standards before it is accepted.

Referenced by
[Governance](PRINCIPLES.md#arch-governance)

### Revocable Access

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to withdraw a principal's access immediately when a session or grant is terminated.

Referenced by
[Session Management](PRINCIPLES.md#arch-session-management)

### Risk Identification

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The activity of discovering and cataloguing the risks that could affect a system or objective.

Referenced by
[Risk Management](PRINCIPLES.md#arch-risk-management)

### Role Definitions

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Declared sets of permissions grouped into named roles that are assigned to principals.

Referenced by
[RBAC](PRINCIPLES.md#arch-role-based-access-control)

### Role Explosion

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which roles proliferate into many narrow definitions as access requirements grow.

Referenced by
[RBAC](PRINCIPLES.md#arch-role-based-access-control)

### Rotation Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The specified interval and procedure by which secrets or keys must be replaced to limit the value of any single compromise.

Referenced by
[Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Safe Credential Handling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to store, transmit, and use credentials without exposing them.

Referenced by
[Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Safe Rendering

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to display untrusted data without allowing it to execute as markup or script.

Referenced by
[Output Encoding](PRINCIPLES.md#arch-output-encoding)

### Secret Store

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A dedicated, access-controlled repository that holds credentials and keys outside of application code.

Referenced by
[Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Secure Communication

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ability to exchange data over a channel protected from interception and tampering.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Secure Configuration

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system's settings and secrets are arranged to minimize exposure.

Referenced by
[Secrets Management](PRINCIPLES.md#arch-secrets-management)

### Security as Afterthought

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Deferring security concerns until late in development, when vulnerabilities are costly and difficult to remediate.

Referenced by
[Security by Design](PRINCIPLES.md#arch-security-by-design)

### Single Control Reliance

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Depending on one security control with no layered defenses, so a single bypass compromises the whole system.

Referenced by
[Defense in Depth](PRINCIPLES.md#arch-defense-in-depth)

### Speed

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which delivery proceeds rapidly, in tension with the caution that managing risk requires.

Referenced by
[Risk Management](PRINCIPLES.md#arch-risk-management)

### String-Concatenated SQL

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Assembling SQL queries by concatenating untrusted input into strings, opening the system to SQL injection.

Referenced by
[Parameterized Queries](PRINCIPLES.md#arch-parameterized-queries)

### Strong Identity

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The requirement that every actor prove a strong, verified identity before any access is granted.

Referenced by
[Zero Trust Architecture](PRINCIPLES.md#arch-zero-trust-architecture)

### Team Velocity

- Kind: [metric](SCHEMA.md#kind-metric)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The rate at which a team delivers completed work, which governance overhead can slow.

Referenced by
[Governance](PRINCIPLES.md#arch-governance)

### Threat Scenarios

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Concrete descriptions of how an attacker might attempt to compromise a system, enumerated during threat modeling.

Referenced by
[Threat Modeling](PRINCIPLES.md#arch-threat-modeling)

### TLS/mTLS

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Transport-layer protocols that encrypt a connection and, with mutual TLS, mutually authenticate both endpoints.

Referenced by
[Encryption in Transit](PRINCIPLES.md#arch-encryption-in-transit)

### Trust Boundaries

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The demarcations in a system where the level of trust changes and data crossing them must be validated.

Referenced by
[Threat Modeling](PRINCIPLES.md#arch-threat-modeling)

### Trusted Internal Network Assumption

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Assuming that traffic originating inside the network perimeter is inherently trustworthy, ignoring insider and lateral-movement threats.

Referenced by
[Zero Trust Architecture](PRINCIPLES.md#arch-zero-trust-architecture)

### Trusting External Input

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Accepting external input as well-formed and safe without validating it, exposing the system to malformed or malicious data.

Referenced by
[Input Validation](PRINCIPLES.md#arch-input-validation)

### Unbounded Autonomy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Allowing an actor or component to act without governance limits, so unsafe or unauthorized actions go unchecked.

Referenced by
[Governance](PRINCIPLES.md#arch-governance)

### Unbounded Data Collection

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Gathering and retaining more personal data than a purpose requires, inflating privacy risk and regulatory exposure.

Referenced by
[Privacy by Design](PRINCIPLES.md#arch-privacy-by-design)

### Uncontrolled Change

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Permitting changes to a controlled system without review, approval, or record, undermining compliance and traceability.

Referenced by
[Compliance](PRINCIPLES.md#arch-compliance)

### Unknown/Unowned Risk

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A risk that has been neither identified nor assigned to an owner, so it goes unmanaged until it materializes.

Referenced by
[Risk Management](PRINCIPLES.md#arch-risk-management)

### Unnecessary Public Surface

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Exposing more endpoints, ports, or interfaces publicly than the function requires, enlarging the attack surface.

Referenced by
[Attack Surface Reduction](PRINCIPLES.md#arch-attack-surface-reduction)

### Unrestricted Access

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Permitting access to a resource with no controls, so any caller can invoke any operation.

Referenced by
[Access Control](PRINCIPLES.md#arch-access-control)

### Usability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The ease with which users can accomplish their goals with a system.

Referenced by
[Access Control](PRINCIPLES.md#arch-access-control)

### User Convenience

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
The degree to which a system minimizes friction and effort for its users.

Referenced by
[Session Management](PRINCIPLES.md#arch-session-management)

### Validation Rules

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
Declared constraints that input must satisfy, such as type, range, format and length, before it is accepted.

Referenced by
[Input Validation](PRINCIPLES.md#arch-input-validation)

### Zero Trust

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Security Privacy Compliance](LEXICON.md#lex-category-security-privacy-compliance)
- Layer: [Security Core](SCHEMA.md#layer-security-core)

Details

Definition
A security stance that grants no implicit trust and continuously verifies every access request regardless of its source.

Referenced by
[Least Privilege](PRINCIPLES.md#arch-least-privilege)

## Self-Healing / Recovery / Deployment Safety

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Automation Risk

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which automated self-healing may take incorrect corrective actions without human oversight.

Referenced by
[Self-Healing Architecture](PRINCIPLES.md#arch-self-healing-architecture)

### Big-Bang Deployment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Releasing a change to all users at once with no gradual exposure, so a defect reaches all of them.

Referenced by
[Canary Deployment](PRINCIPLES.md#arch-canary-deployment)

### Blind Routing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Routing traffic to instances without checking their health, so requests hit dead or degraded nodes.

Referenced by
[Health Checks](PRINCIPLES.md#arch-health-checks)

### Connection Cleanup

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to close open connections cleanly when a process shuts down.

Referenced by
[Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Consistency Lag

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which replicas trail the primary, so reads served from them may return stale data.

Referenced by
[Replication](PRINCIPLES.md#arch-replication)

### Consistency Policy

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a defined policy specify how and when replicas converge to a consistent state.

Referenced by
[Replication](PRINCIPLES.md#arch-replication)

### Continuity During Failure

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to keep serving requests by switching to a standby when the primary fails.

Referenced by
[Failover](PRINCIPLES.md#arch-failover)

### Controlled Exposure

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to expose a new version to a small, controlled fraction of traffic first.

Referenced by
[Canary Deployment](PRINCIPLES.md#arch-canary-deployment)

### Cost/Cold Start

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which scaling capacity up and down incurs added cost and cold-start latency.

Referenced by
[Auto-Scaling](PRINCIPLES.md#arch-auto-scaling)

### Data Migration Compatibility

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which reverting code is constrained by forward data migrations that cannot easily be undone.

Referenced by
[Rollback](PRINCIPLES.md#arch-rollback)

### Demand-Based Capacity

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to match provisioned capacity to current demand automatically.

Referenced by
[Auto-Scaling](PRINCIPLES.md#arch-auto-scaling)

### Detection Signal

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A machine-readable signal indicating that a fault or anomaly has been detected.

Referenced by
[Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Disk-Failure Survival

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to keep serving data after one or more disks fail, by reconstructing from redundancy.

Referenced by
[RAID Redundancy](PRINCIPLES.md#arch-raid-redundancy)

### Empirical Resilience Verification

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to verify a system's resilience empirically by injecting faults and observing recovery.

Referenced by
[Chaos Engineering](PRINCIPLES.md#arch-chaos-engineering)

### False Recovery Actions

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which acting on faulty signals leads automated recovery to take wrong or harmful corrective actions.

Referenced by
[Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery)

### Fast Failure Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to recover quickly from a bad release by reverting to the last good version.

Referenced by
[Rollback](PRINCIPLES.md#arch-rollback)

### Fixed Capacity

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Provisioning a fixed, preset amount of capacity, rather than adapting it to demand.

Referenced by
[Auto-Scaling](PRINCIPLES.md#arch-auto-scaling)

### Hard Process Kill

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Terminating a process abruptly without draining work, dropping in-flight requests and risking corrupt state.

Referenced by
[Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Health Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to detect that a component has failed so a switchover can be triggered.

Referenced by
[Failover](PRINCIPLES.md#arch-failover)

### Health Signal

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A machine-readable signal that reports whether a component is currently healthy.

Referenced by
[Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery)

### Horizontal Scalability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which a system can grow by adding more interchangeable instances rather than enlarging one.

Referenced by
[Auto-Scaling](PRINCIPLES.md#arch-auto-scaling)

### In-Flight Work Drain

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to finish or safely hand off in-progress work before a process exits.

Referenced by
[Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### In-Place Mutation Only

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Upgrading by mutating the running environment in place, with no parallel target to cut over to or fall back from.

Referenced by
[Blue-Green Deployment](PRINCIPLES.md#arch-blue-green-deployment)

### Incident Reduction

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to reduce the number of incidents that reach human responders by fixing them automatically.

Referenced by
[Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Infrastructure Cost

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which running two full parallel environments doubles infrastructure cost during a cutover.

Referenced by
[Blue-Green Deployment](PRINCIPLES.md#arch-blue-green-deployment)

### Irreversible Deployment

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Deploying in a way that cannot be undone, so a bad release cannot be rolled back.

Referenced by
[Rollback](PRINCIPLES.md#arch-rollback)

### Lifecycle Signals

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a process receive lifecycle signals telling it when to start draining and stop.

Referenced by
[Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Low-Risk Cutover

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to switch traffic to a new version with low risk by keeping the old one ready to fall back to.

Referenced by
[Blue-Green Deployment](PRINCIPLES.md#arch-blue-green-deployment)

### Manual Intervention Dependency

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Requiring a human to step in for recovery to proceed, so the system cannot heal on its own.

Referenced by
[Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery)

### Manual Remediation

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Recovering from incidents through human-operated fixes, rather than automated remediation.

Referenced by
[Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Manual-Only Recovery

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Depending entirely on human operators to detect and recover from every failure, so recovery is slow and unreliable.

Referenced by
[Self-Healing Architecture](PRINCIPLES.md#arch-self-healing-architecture)

### Multiple Physical Disks

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that data span several physical disks so redundancy can survive a single-disk loss.

Referenced by
[RAID Redundancy](PRINCIPLES.md#arch-raid-redundancy)

### Observable Health Criteria

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that explicit, observable criteria define when a component counts as healthy.

Referenced by
[Health Checks](PRINCIPLES.md#arch-health-checks)

### Parallel Environments

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that two full production-equivalent environments run side by side for cutover.

Referenced by
[Blue-Green Deployment](PRINCIPLES.md#arch-blue-green-deployment)

### Parity-Based Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to reconstruct lost data from parity information stored across the disk array.

Referenced by
[RAID Redundancy](PRINCIPLES.md#arch-raid-redundancy)

### Production Risk

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which deliberately injecting faults in production risks causing user-facing incidents.

Referenced by
[Chaos Engineering](PRINCIPLES.md#arch-chaos-engineering)

### Progressive Delivery

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A release strategy that rolls out changes gradually to widening audiences while monitoring for regressions.

Referenced by
[Canary Deployment](PRINCIPLES.md#arch-canary-deployment)

### Read Scaling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to serve more read traffic by distributing it across replicas.

Referenced by
[Replication](PRINCIPLES.md#arch-replication)

### Readiness/Liveness Routing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to route traffic only to instances that report themselves ready and alive.

Referenced by
[Health Checks](PRINCIPLES.md#arch-health-checks)

### Reduced Mean Time to Recovery

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The ability to shorten the mean time to recover from a failure by acting automatically.

Referenced by
[Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery)

### Remediation Action

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A corrective action executed to return a system to a healthy state after a fault is detected.

Referenced by
[Autonomous Recovery](PRINCIPLES.md#arch-autonomous-recovery)

### Remediation Workflow

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A defined sequence of steps carried out to remediate a detected incident.

Referenced by
[Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Replication or Alternate Capacity

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that duplicate copies or spare capacity exist to take over when a component fails.

Referenced by
[Redundancy](PRINCIPLES.md#arch-redundancy)

### Reversible Deployment

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The requirement that a deployment be structured so it can be safely reverted to a prior version.

Referenced by
[Rollback](PRINCIPLES.md#arch-rollback)

### Rollout Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which staging a release in gradual increments adds orchestration complexity.

Referenced by
[Canary Deployment](PRINCIPLES.md#arch-canary-deployment)

### Shutdown Latency

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which draining in-flight work before exit lengthens the time a shutdown takes.

Referenced by
[Graceful Shutdown](PRINCIPLES.md#arch-graceful-shutdown)

### Single Copy State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Keeping only one copy of state, so its loss or unavailability takes down the whole system.

Referenced by
[Replication](PRINCIPLES.md#arch-replication)

### Single Instance Dependency

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Depending on a single instance with no standby, so its failure takes down the whole service.

Referenced by
[Failover](PRINCIPLES.md#arch-failover)

### Single-Disk Point of Failure

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Storing data on a single disk with no redundancy, so that one disk's failure loses everything.

Referenced by
[RAID Redundancy](PRINCIPLES.md#arch-raid-redundancy)

### Traffic Splitting

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A facility that routes a configurable proportion of traffic to different versions of a service.

Referenced by
[Canary Deployment](PRINCIPLES.md#arch-canary-deployment)

### Unsafe Automation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which automating remediation risks taking harmful actions faster than a human can intervene.

Referenced by
[Auto-Remediation](PRINCIPLES.md#arch-auto-remediation)

### Untested Failure Assumptions

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
Assuming a system will survive failures without ever testing those assumptions against injected faults.

Referenced by
[Chaos Engineering](PRINCIPLES.md#arch-chaos-engineering)

### Versioned Artifact

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
A build artifact tagged with a distinct version so a prior one can be redeployed.

Referenced by
[Rollback](PRINCIPLES.md#arch-rollback)

### Write Amplification

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Self-Healing / Recovery / Deployment Safety](LEXICON.md#lex-category-self-healing-recovery-deployment-safety)
- Layer: [Correctness Core](SCHEMA.md#layer-correctness-core)

Details

Definition
The degree to which maintaining parity on writes multiplies the underlying disk writes for each logical write.

Referenced by
[RAID Redundancy](PRINCIPLES.md#arch-raid-redundancy)

## SOLID / Object-Oriented Design

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Broken Inheritance

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A subclass that violates its base type's contract, so substituting it breaks callers that rely on the base behavior.

Referenced by
[Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution)

### Concrete Dependency

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Depending directly on a concrete implementation instead of an abstraction, coupling high-level code to low-level detail.

Referenced by
[Dependency Inversion Principle (DIP)](PRINCIPLES.md#arch-dependency-inversion)

### Consumer-Specific Contracts

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to give each client an interface exposing only the operations it uses.

Referenced by
[Interface Segregation Principle (ISP)](PRINCIPLES.md#arch-interface-segregation)

### Contract Preservation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that a subtype honor every behavioral guarantee of the type it replaces.

Referenced by
[Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution)

### Fat Interface

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
An interface bundling many unrelated operations, forcing clients to depend on methods they never call.

Referenced by
[Interface Segregation Principle (ISP)](PRINCIPLES.md#arch-interface-segregation)

### Feature Extension without Modification

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The ability to add new behavior by writing new code rather than editing existing, tested code.

Referenced by
[Open/Closed Principle (OCP)](PRINCIPLES.md#arch-open-closed)

### Incompatible Override

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
An override that changes a method's expected inputs or outputs, breaking the substitutability of the subtype.

Referenced by
[Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution)

### Interface Proliferation

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which splitting interfaces finely multiplies the number of small interfaces to manage.

Referenced by
[Interface Segregation Principle (ISP)](PRINCIPLES.md#arch-interface-segregation)

### Narrow Specialized Behavior

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which honoring a base type's contract constrains a subtype from specializing its own behavior.

Referenced by
[Liskov Substitution Principle (LSP)](PRINCIPLES.md#arch-liskov-substitution)

### Role-Specific Interfaces

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The requirement that interfaces be defined per client role rather than as one general-purpose surface.

Referenced by
[Interface Segregation Principle (ISP)](PRINCIPLES.md#arch-interface-segregation)

### Switch-Based Extension

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Extending behavior by editing a growing switch or conditional on a type instead of adding a new polymorphic type.

Referenced by
[Open/Closed Principle (OCP)](PRINCIPLES.md#arch-open-closed)

### Type Switching

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [SOLID / Object-Oriented Design](LEXICON.md#lex-category-solid-object-oriented-design)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Branching on an object's concrete type instead of dispatching through a shared polymorphic interface.

Referenced by
[Polymorphism](PRINCIPLES.md#arch-polymorphism)

## Streaming / Pipeline / Dataflow Processing

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Avoiding Unneeded Work

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to skip computing results that are never used.

Referenced by
[Lazy Evaluation](PRINCIPLES.md#arch-lazy-evaluation)

### Backtracking Algorithm

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A method that explores options and reverts to an earlier point when one fails, requiring the ability to look back.

Referenced by
[Forward-Only Processing](PRINCIPLES.md#arch-forward-only-processing)

### Batch-Only Processing

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Processing data in scheduled batches rather than as a continuous low-latency stream.

Referenced by
[Streaming Architecture](PRINCIPLES.md#arch-streaming-architecture)

### Bounded Aggregation over Unbounded Streams

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to aggregate an endless stream by grouping its events into bounded windows.

Referenced by
[Windowing](PRINCIPLES.md#arch-windowing)

### Bounded State

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which processing keeps its working state within a fixed bound regardless of input size.

Referenced by
[Windowing](PRINCIPLES.md#arch-windowing)

### Complex Grammar/Global State

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which forbidding backtracking makes complex grammars or global-state logic hard to express.

Referenced by
[Forward-Only Processing](PRINCIPLES.md#arch-forward-only-processing)

### Control-Flow-Centric Monolith

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A monolith driven by imperative control flow rather than data dependencies, so stages cannot run or scale independently.

Referenced by
[Dataflow Architecture](PRINCIPLES.md#arch-dataflow-architecture)

### Data Dependencies

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that the data each stage needs from others be declared as explicit dependencies.

Referenced by
[Dataflow Architecture](PRINCIPLES.md#arch-dataflow-architecture)

### Debuggability/Resource Lifetime

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which deferring computation makes execution order harder to debug and resource lifetimes harder to reason about.

Referenced by
[Lazy Evaluation](PRINCIPLES.md#arch-lazy-evaluation)

### Deferred Execution Semantics

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that a computation's semantics defer its work until the result is demanded.

Referenced by
[Lazy Evaluation](PRINCIPLES.md#arch-lazy-evaluation)

### Eager Full Materialization

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Computing and materializing a complete result up front, rather than deferring computation until parts are needed.

Referenced by
[Lazy Evaluation](PRINCIPLES.md#arch-lazy-evaluation)

### Error Propagation/Debugging

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which splitting work into pipeline stages makes an error harder to trace back to its origin.

Referenced by
[Pipeline Architecture](PRINCIPLES.md#arch-pipeline-architecture)

### Event Time

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The time at which an event occurred, carried on the event and used to assign it to a window.

Referenced by
[Windowing](PRINCIPLES.md#arch-windowing)

### Fitness for Purpose

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which the chosen processing model matches the latency and volume the problem needs.

Referenced by
[Batch-vs-Stream](PRINCIPLES.md#arch-batch-vs-stream)

### Forward-Only State Model

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that processing keep only forward-moving state, never needing to revisit earlier input.

Referenced by
[Single-Pass Processing](PRINCIPLES.md#arch-single-pass-processing)

### Global Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which processing data in a single pass forgoes optimizations that need a full view of the data.

Referenced by
[Single-Pass Processing](PRINCIPLES.md#arch-single-pass-processing)

### Large Data Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to process datasets larger than memory by reading them in order, a piece at a time.

Referenced by
[Sequential Access](PRINCIPLES.md#arch-sequential-access)

### Late-Data Handling

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which windowing by event time must reckon with events that arrive after their window has closed.

Referenced by
[Windowing](PRINCIPLES.md#arch-windowing)

### Latency Requirement Clarity

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that a workload's latency and freshness needs be made explicit before a processing model is chosen.

Referenced by
[Batch-vs-Stream](PRINCIPLES.md#arch-batch-vs-stream)

### Latency-Appropriate Processing Model

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to choose batch or stream processing to match a workload's latency needs.

Referenced by
[Batch-vs-Stream](PRINCIPLES.md#arch-batch-vs-stream)

### Lookup Performance

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which reading strictly in sequence makes locating a specific item by key slow.

Referenced by
[Sequential Access](PRINCIPLES.md#arch-sequential-access)

### Monolithic Processing Function

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
One large function that performs every processing step at once, so stages cannot be tested or reused independently.

Referenced by
[Pipeline Architecture](PRINCIPLES.md#arch-pipeline-architecture)

### Multi-Pass Full Materialization

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Loading a full dataset into memory and traversing it in multiple passes, rather than in a single streaming pass.

Referenced by
[Single-Pass Processing](PRINCIPLES.md#arch-single-pass-processing)

### No Backtracking Requirement

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that processing never need to revisit earlier input to make a decision.

Referenced by
[Forward-Only Processing](PRINCIPLES.md#arch-forward-only-processing)

### No Hidden State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that a processor keep no state hidden between invocations, taking all inputs explicitly.

Referenced by
[Stateless Processing](PRINCIPLES.md#arch-stateless-processing)

### One-Size-Fits-All Processing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Forcing every workload through a single processing model regardless of its latency or volume needs.

Referenced by
[Batch-vs-Stream](PRINCIPLES.md#arch-batch-vs-stream)

### Operational Duplication

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which supporting both batch and streaming paths duplicates operational effort and code.

Referenced by
[Batch-vs-Stream](PRINCIPLES.md#arch-batch-vs-stream)

### Ordered Read Model

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that data be read in a fixed forward order rather than by arbitrary index.

Referenced by
[Sequential Access](PRINCIPLES.md#arch-sequential-access)

### Ordering/State

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which processing an unbounded stream complicates preserving event order and bounded state.

Referenced by
[Streaming Architecture](PRINCIPLES.md#arch-streaming-architecture)

### Parallel Branch Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to process independent branches of work simultaneously across workers.

Referenced by
[Fan-out/Fan-in](PRINCIPLES.md#arch-fan-out-fan-in)

### Parallel Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to process many records at once because each is handled independently of the others.

Referenced by
[Stateless Processing](PRINCIPLES.md#arch-stateless-processing)

### Parallel/Stream Processing

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to run independent stages in parallel or stream data between them as it is produced.

Referenced by
[Dataflow Architecture](PRINCIPLES.md#arch-dataflow-architecture)

### Random Access Requirement

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
A need to read arbitrary items by position or key on demand rather than strictly in sequence.

Referenced by
[Sequential Access](PRINCIPLES.md#arch-sequential-access)

### Result Aggregation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to combine the outputs of parallel branches back into a single result.

Referenced by
[Fan-out/Fan-in](PRINCIPLES.md#arch-fan-out-fan-in)

### Serial Item Processing

- Kind: [approach](SCHEMA.md#kind-approach)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Processing independent items one at a time in sequence, rather than in parallel.

Referenced by
[Fan-out/Fan-in](PRINCIPLES.md#arch-fan-out-fan-in)

### Stage Contracts

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that each pipeline stage declare a typed contract for what it consumes and produces.

Referenced by
[Pipeline Architecture](PRINCIPLES.md#arch-pipeline-architecture)

### Stages

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The requirement that processing be decomposed into discrete stages connected by data flow.

Referenced by
[Dataflow Architecture](PRINCIPLES.md#arch-dataflow-architecture)

### State Coordination

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which a data-driven design must still coordinate shared state across concurrent stages.

Referenced by
[Dataflow Architecture](PRINCIPLES.md#arch-dataflow-architecture)

### Stateful Business Rules

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The degree to which rules that inherently depend on accumulated state resist a purely stateless design.

Referenced by
[Stateless Processing](PRINCIPLES.md#arch-stateless-processing)

### Stateful Hidden Accumulation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Accumulating state inside a processor across records, so results depend on invisible history.

Referenced by
[Stateless Processing](PRINCIPLES.md#arch-stateless-processing)

### Stepwise Transformation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to transform data through a sequence of small, composable stages.

Referenced by
[Pipeline Architecture](PRINCIPLES.md#arch-pipeline-architecture)

### Streaming

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to process data continuously as it arrives rather than in complete batches.

Referenced by
[Pipeline Architecture](PRINCIPLES.md#arch-pipeline-architecture)

### Streaming Parsers

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
The ability to parse input incrementally as it streams in, without buffering the whole document.

Referenced by
[Forward-Only Processing](PRINCIPLES.md#arch-forward-only-processing)

### Unbounded Accumulation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Streaming / Pipeline / Dataflow Processing](LEXICON.md#lex-category-streaming-pipeline-dataflow-processing)
- Layer: [Execution Core](SCHEMA.md#layer-execution-core)

Details

Definition
Aggregating an endless stream into ever-growing state that eventually exhausts memory.

Referenced by
[Windowing](PRINCIPLES.md#arch-windowing)

## Structural Patterns

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Cartesian Inheritance Explosion

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Modeling every combination of two independent dimensions as its own subclass, so the class count grows multiplicatively.

Referenced by
[Bridge Pattern](PRINCIPLES.md#arch-bridge-pattern)

### Common Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that a wrapper and the object it wraps share one interface so they remain interchangeable.

Referenced by
[Decorator Pattern](PRINCIPLES.md#arch-decorator-pattern)

### Direct Access

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Reaching a resource directly with no intermediary, bypassing the access control, caching, or laziness a proxy would add.

Referenced by
[Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Direct External Coupling

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Coupling code directly to an incompatible external interface, spreading its idiosyncrasies through the codebase.

Referenced by
[Adapter Pattern](PRINCIPLES.md#arch-adapter-pattern)

### High-Cardinality Object Reuse

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to represent large numbers of similar objects economically by sharing their common intrinsic state.

Referenced by
[Flyweight Pattern](PRINCIPLES.md#arch-flyweight-pattern)

### Implementation Swap

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to change an abstraction's underlying implementation without altering the abstraction itself.

Referenced by
[Bridge Pattern](PRINCIPLES.md#arch-bridge-pattern)

### Incompatible Interfaces

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
A precondition of two interfaces that must cooperate yet expose mismatched signatures.

Referenced by
[Adapter Pattern](PRINCIPLES.md#arch-adapter-pattern)

### Independent Variation Axes

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that an abstraction and its implementation vary along separate axes so they can be decoupled.

Referenced by
[Bridge Pattern](PRINCIPLES.md#arch-bridge-pattern)

### Indirection

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of extra indirection introduced by separating an abstraction from its implementation.

Referenced by
[Bridge Pattern](PRINCIPLES.md#arch-bridge-pattern)

### Lazy Load

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to defer creating or loading a costly resource until it is first used.

Referenced by
[Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Leaf-vs-Container Special-Casing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Branching client code on whether an element is a leaf or a container instead of treating them through one interface.

Referenced by
[Composite Pattern](PRINCIPLES.md#arch-composite-pattern)

### Leaf/Composite Transparency

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to treat individual objects and compositions of objects through one uniform interface.

Referenced by
[Composite Pattern](PRINCIPLES.md#arch-composite-pattern)

### Leaky Subsystem API

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Exposing a subsystem's internal complexity directly to clients instead of hiding it behind a simplifying interface.

Referenced by
[Facade Pattern](PRINCIPLES.md#arch-facade-pattern)

### Over-Centralization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which routing all access through one facade concentrates responsibility and can bottleneck change.

Referenced by
[Facade Pattern](PRINCIPLES.md#arch-facade-pattern)

### Per-Instance Duplicate State

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Storing identical shared state separately in every object instance, wasting memory at high object counts.

Referenced by
[Flyweight Pattern](PRINCIPLES.md#arch-flyweight-pattern)

### Recursive Composition

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to build tree structures in which composites contain other composites to arbitrary depth.

Referenced by
[Composite Pattern](PRINCIPLES.md#arch-composite-pattern)

### Remote Stub

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
A local stand-in object that forwards calls to an object living in another process or machine.

Referenced by
[Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Runtime Behavior Extension

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to add responsibilities to an object dynamically at runtime by wrapping it.

Referenced by
[Decorator Pattern](PRINCIPLES.md#arch-decorator-pattern)

### Separable Intrinsic State

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that an object's shared, context-independent state be separable from its per-use state.

Referenced by
[Flyweight Pattern](PRINCIPLES.md#arch-flyweight-pattern)

### Shared Immutable State

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to safely share one immutable state object across many contexts at once.

Referenced by
[Flyweight Pattern](PRINCIPLES.md#arch-flyweight-pattern)

### Simplified Access

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The ability to use a complex subsystem through a small, convenient interface.

Referenced by
[Facade Pattern](PRINCIPLES.md#arch-facade-pattern)

### Stack Debugging

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which layers of wrapping deepen the call stack and complicate debugging.

Referenced by
[Decorator Pattern](PRINCIPLES.md#arch-decorator-pattern)

### Subclass Explosion

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
Creating a distinct subclass for every combination of optional features instead of composing them at runtime.

Referenced by
[Decorator Pattern](PRINCIPLES.md#arch-decorator-pattern)

### Subsystem Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree of internal complexity in a subsystem that motivates hiding it behind a facade.

Referenced by
[Facade Pattern](PRINCIPLES.md#arch-facade-pattern)

### Transparency / Debugging

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The degree to which interposing a proxy hides the real object and complicates tracing calls to it.

Referenced by
[Proxy Pattern](PRINCIPLES.md#arch-proxy-pattern)

### Uniform Component Interface

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Structural Patterns](LEXICON.md#lex-category-structural-patterns)
- Layer: [Design Patterns Core](SCHEMA.md#layer-design-patterns-core)

Details

Definition
The requirement that leaves and composites implement one shared interface so clients treat them alike.

Referenced by
[Composite Pattern](PRINCIPLES.md#arch-composite-pattern)

## Taxonomy / Classification / Naming

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Automated Reshape

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Renaming by tool across a tree holding shape-discovered surfaces, so the rewrite reports clean while an aggregator that collected by suffix now collects nothing.

Referenced by
[Manual Identity Migration](PRINCIPLES.md#arch-manual-identity-migration)

### Borrowed Synonymy

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Deciding whether two declared words overlap from a general-language corpus rather than from the roles they name, so distinct concerns collide on their everyday senses and domain overlaps go unseen.

Referenced by
[Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Classification Judgment

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The activity of reading a file and assigning its concern by its primary responsibility, which no pattern-match can perform on its behalf.

Referenced by
[One Concern Per File](PRINCIPLES.md#arch-one-concern-per-file), [Narrowest Concern](PRINCIPLES.md#arch-narrowest-concern)

### Collection Concern

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of a concern whose file defines many members at once, plural in both the folder label and the file tag.

### Concern Folder

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that holds every file of one concern and whose label the file's concern tag must equal.

Referenced by
[Concern-Folder Correspondence](PRINCIPLES.md#arch-concern-folder-correspondence)

### Concern Tag

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of the role a file plays, drawn from the closed concern vocabulary and carried as the last dot-segment before the extension.

Referenced by
[Positional Slot Resolution](PRINCIPLES.md#arch-positional-slot-resolution), [Concern-Folder Correspondence](PRINCIPLES.md#arch-concern-folder-correspondence)

### Concern-Swallowing Compound

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Fusing a subject and a concern into one word, so the tag that should terminate the name is buried inside it and no glob resolves the file.

Aliases
Compound That Swallowed a Concern

Referenced by
[Positional Slot Resolution](PRINCIPLES.md#arch-positional-slot-resolution), [Glob-Resolvable Tree](PRINCIPLES.md#arch-glob-resolvable-tree)

### Container Level

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that partitions a governed root by grouping axis, declared as a closed set and anchoring the depth count at level one.

Referenced by
[Declared Jurisdiction](PRINCIPLES.md#arch-declared-jurisdiction)

### Container-by-Container Reshape

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The practice of converting one container at a time to the taxonomy, updating every reference in the same pass and holding the gate green between each.

Referenced by
[Manual Identity Migration](PRINCIPLES.md#arch-manual-identity-migration)

### Covering Concern

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of the declared word that already fills a proposed word's role, resolved from the rejection table so a refusal carries its own replacement.

Referenced by
[Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Depth Cap

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A rule or precondition that every governed file resolve within a fixed number of folders from its governed root, the container included and the file excluded.

Referenced by
[Bounded Nesting Depth](PRINCIPLES.md#arch-bounded-nesting-depth)

### Depth-Relief Container

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Declaring a container to shorten a path or to house files that resist placement, turning the level that anchors the depth count into an escape from it.

Referenced by
[Declared Jurisdiction](PRINCIPLES.md#arch-declared-jurisdiction)

### Downward Nesting

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Relieving collision or breadth pressure by adding a folder level, breaking the depth cap that both overflow slots exist to protect.

Referenced by
[Bounded Nesting Depth](PRINCIPLES.md#arch-bounded-nesting-depth), [Sideways Overflow](PRINCIPLES.md#arch-sideways-overflow)

### Flat Bucket

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that holds one collection concern as files with no folders beneath it, declared rather than inferred from shape.

Referenced by
[Declared Jurisdiction](PRINCIPLES.md#arch-declared-jurisdiction)

### Free-Form Folder Level

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A folder level resolving to no declared word, so the path is conventional rather than checkable and classification has more than one right answer.

Referenced by
[Concern-Folder Correspondence](PRINCIPLES.md#arch-concern-folder-correspondence)

### Glob Resolvability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which one depth-unanchored pattern resolves every file or every folder of a concern across the whole tree.

Referenced by
[Positional Slot Resolution](PRINCIPLES.md#arch-positional-slot-resolution), [Concern-Folder Correspondence](PRINCIPLES.md#arch-concern-folder-correspondence), [Glob-Resolvable Tree](PRINCIPLES.md#arch-glob-resolvable-tree), [Sideways Overflow](PRINCIPLES.md#arch-sideways-overflow)

### Governed Root

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A rule or precondition that a path falls under the taxonomy only where its root is declared, so an undeclared tree is ungoverned and a declared one is governed in full.

Referenced by
[Declared Jurisdiction](PRINCIPLES.md#arch-declared-jurisdiction)

### Identity Migration

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The activity of renaming an artifact and updating every reference to it in the same pass, so no reference is left dangling.

Referenced by
[Manual Identity Migration](PRINCIPLES.md#arch-manual-identity-migration)

### Ignore Declaration

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Descriptive data about the names skipped wherever they appear under a governed root, covering build output, vendored sources, tool caches and ecosystem-fixed names.

### Ignore-List Silencing

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Answering a finding by adding the path to the ignore declaration, removing authored source from the taxonomy entirely and hiding every future violation under the same name.

Referenced by
[Declared Jurisdiction](PRINCIPLES.md#arch-declared-jurisdiction)

### Is-A Test

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A technique for deciding concern membership by asking whether a file is-a the proposed word, admitting it as a role when it is and as a domain noun when the system merely has-a it.

Referenced by
[Agnostic-First Vocabulary](PRINCIPLES.md#arch-agnostic-first-vocabulary)

### Layer Spine

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A conceptual representation of the system-decomposition spectrum that totally orders every concern from domain through product and supplies the tie-break direction.

Referenced by
[Layer Spine Precedence](PRINCIPLES.md#arch-layer-spine-precedence)

### Multi-Role File

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Keeping a file whose primary responsibility is two concerns, forcing an arbitrary tag instead of surfacing the split the ambiguity reports.

Referenced by
[One Concern Per File](PRINCIPLES.md#arch-one-concern-per-file), [Layer Spine Precedence](PRINCIPLES.md#arch-layer-spine-precedence)

### Naming Expressiveness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a closed vocabulary limits how precisely the developer can name a file that its declared words do not yet cover.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary)

### Nominalized Process Word

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Admitting a word naming what the system does rather than what it has, so the vocabulary accumulates verbs and adjectives that classify nothing.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary), [Agnostic-First Vocabulary](PRINCIPLES.md#arch-agnostic-first-vocabulary)

### Ordered Role Sequence

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A rule or precondition that each folder depth consume a role strictly later than the depth before it, so container, subject and concern may be skipped but never repeated and never revisited.

Referenced by
[Bounded Nesting Depth](PRINCIPLES.md#arch-bounded-nesting-depth)

### Placement Predictability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a file's correct location is derivable from its role alone, with exactly one legal answer.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary), [Bounded Nesting Depth](PRINCIPLES.md#arch-bounded-nesting-depth), [Narrowest Concern](PRINCIPLES.md#arch-narrowest-concern), [Layer Spine Precedence](PRINCIPLES.md#arch-layer-spine-precedence), [Derived Naming Registry](PRINCIPLES.md#arch-derived-naming-registry)

### Reasoning in the Registry

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Writing the rules about a declaration into the declaration file itself, producing a document in a schema's format that no code reads.

Referenced by
[Derived Naming Registry](PRINCIPLES.md#arch-derived-naming-registry)

### Rejection Table

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of each near-miss word already considered and refused, recording the meta concern that covers it so the same word is not proposed twice.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary), [Agnostic-First Vocabulary](PRINCIPLES.md#arch-agnostic-first-vocabulary), [Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Restated Set Member

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Naming a file with the subject its folder already declares, so the member repeats the set and the name carries no information.

Referenced by
[Member Never Restates the Set](PRINCIPLES.md#arch-member-never-restates-the-set)

### Reverse Coverage Resolution

- Kind: [technique](SCHEMA.md#kind-technique)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A technique for answering which declared words cover a candidate, by indexing the rejection table on its refused words rather than on the concerns they map to.

Referenced by
[Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Saturated Role Tag

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Classifying a file under a label naming a stature rather than a role, so it attaches to lifecycle owners, caches, registries and coordinators alike and excludes nothing.

Referenced by
[Narrowest Concern](PRINCIPLES.md#arch-narrowest-concern)

### Shape-Discovered Surface

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that collects its members by matching a pattern rather than by literal path, so a rename silently changes what it collects.

Referenced by
[Glob-Resolvable Tree](PRINCIPLES.md#arch-glob-resolvable-tree), [Manual Identity Migration](PRINCIPLES.md#arch-manual-identity-migration)

### Single-Unit Concern

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A formal definition of a concern with one instance per file, pairing a plural folder label with a singular file tag.

### Subject Folder

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that separates two sets of one concern under a container, present if and only if the sets must not merge.

Referenced by
[Sideways Overflow](PRINCIPLES.md#arch-sideways-overflow), [Member Never Restates the Set](PRINCIPLES.md#arch-member-never-restates-the-set)

### Subject Slot

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that names who or what a file serves, occupying the first dot-segment of the filename.

Referenced by
[Positional Slot Resolution](PRINCIPLES.md#arch-positional-slot-resolution)

### Tree Compactness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The degree to which a small module can stay in few files and folders rather than expanding into one concern folder per role.

Referenced by
[Bounded Nesting Depth](PRINCIPLES.md#arch-bounded-nesting-depth)

### Unguided Refusal

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Reporting an undeclared word without naming the declared word that covers it, so the developer's or the model's next attempt is another guess and the closed set reads as an obstacle rather than a map.

Referenced by
[Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Variant Slot

- Kind: [mechanism](SCHEMA.md#kind-mechanism)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
A facility that narrows a subject to one facet, occupying the segment between subject and concern and present only on collision or facet ambiguity.

Referenced by
[Positional Slot Resolution](PRINCIPLES.md#arch-positional-slot-resolution), [Sideways Overflow](PRINCIPLES.md#arch-sideways-overflow)

### Vocabulary Admission

- Kind: [activity](SCHEMA.md#kind-activity)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
The act of reasoning a proposed word against the declared categories and admitting it only by developer-approved registry edit.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary), [Guided Vocabulary Refusal](PRINCIPLES.md#arch-guided-vocabulary-refusal)

### Vocabulary Inflation

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Taxonomy / Classification / Naming](LEXICON.md#lex-category-taxonomy-classification-naming)
- Layer: [Structural Core](SCHEMA.md#layer-structural-core)

Details

Definition
Adding a word to the closed vocabulary so a check passes, admitting a synonym, an abbreviation, or a process-name for something already declared.

Referenced by
[Closed Vocabulary](PRINCIPLES.md#arch-closed-vocabulary), [Agnostic-First Vocabulary](PRINCIPLES.md#arch-agnostic-first-vocabulary)

## Transactions / State / Concurrency

Every term in this category is listed as one record, with its kind, its definition and its aliases, the principles whose relations name it, the principle or contract that carries the same name where one exists, and the layer its category belongs to.

### Ad-Hoc Lock Ordering

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Ordering lock acquisition by hand-reasoning rather than a proven scheme, inviting deadlock.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### All-or-Nothing State Change

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to apply a set of changes so that either all of them take effect or none do.

Referenced by
[Atomicity](PRINCIPLES.md#arch-atomicity)

### BASE/Eventual Consistency

- Kind: [model](SCHEMA.md#kind-model)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
A consistency model favoring availability and soft state, letting replicas converge over time rather than staying strongly consistent.

Referenced by
[ACID](PRINCIPLES.md#arch-acid)

### Blind Overwrite

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Writing over another actor's update without checking whether the data changed first, silently losing it.

Referenced by
[Optimistic Locking](PRINCIPLES.md#arch-optimistic-locking)

### Concurrency Correctness

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which concurrent flows produce correct results free of races and lost updates.

Contract
[Concurrency Correctness](ALGORITHMS.md#algo-concurrency-correctness)

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Concurrency Safety

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which isolating state per unit keeps concurrent execution free of races.

Referenced by
[State Isolation](PRINCIPLES.md#arch-state-isolation)

### Concurrent-Flow Modeling

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to model concurrent token flow explicitly so its behavior can be analyzed.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Conflict Detection

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to detect that data changed since it was read, so a conflicting write can be rejected.

Referenced by
[Optimistic Locking](PRINCIPLES.md#arch-optimistic-locking)

### Consistency Rules

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that the invariants a transaction must preserve be defined for its scope.

Referenced by
[Transaction Boundary](PRINCIPLES.md#arch-transaction-boundary)

### Coordinated Persistence

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to commit a set of related changes together as one atomic unit of work.

Referenced by
[Unit of Work Pattern](PRINCIPLES.md#arch-unit-of-work-pattern)

### Data Sharing

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which strictly isolating state limits components from directly sharing data.

Referenced by
[State Isolation](PRINCIPLES.md#arch-state-isolation)

### Deadlock Freedom

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which a concurrent design is provably free of states where progress halts permanently.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Deadlocks

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which acquiring multiple locks pessimistically risks two holders waiting on each other forever.

Referenced by
[Pessimistic Locking](PRINCIPLES.md#arch-pessimistic-locking)

### Dirty Reads/Writes

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Reading or overwriting another transaction's uncommitted changes, so a rollback leaves corrupt data.

Referenced by
[Isolation](PRINCIPLES.md#arch-isolation)

### Distributed Availability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which insisting on strong transactional consistency reduces availability across a distributed system.

Referenced by
[ACID](PRINCIPLES.md#arch-acid)

### Distributed Scalability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which enforcing atomic transactions across nodes limits how far a system can scale out.

Referenced by
[Atomicity](PRINCIPLES.md#arch-atomicity)

### Durability

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which committed data survives crashes and is never lost once acknowledged.

Referenced by
[ACID](PRINCIPLES.md#arch-acid)

### Effect Boundaries

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that side effects be confined to explicit boundaries rather than scattered through pure logic.

Referenced by
[Controlled Side Effects](PRINCIPLES.md#arch-controlled-side-effects)

### Hidden Distributed Transaction

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
A transaction that silently spans service boundaries, coupling systems that should commit independently.

Referenced by
[Transaction Boundary](PRINCIPLES.md#arch-transaction-boundary)

### Idempotency Key or Deterministic Operation

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that an operation carry a deduplication key or be deterministic so repeating it is safe.

Referenced by
[Idempotency](PRINCIPLES.md#arch-idempotency)

### Inconsistent Replicas/Models

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Replicas or models that disagree on the same data, so reads return conflicting answers.

Referenced by
[Consistency](PRINCIPLES.md#arch-consistency)

### Large Transaction Scope

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which widening a transaction to cover more work increases contention and failure surface.

Referenced by
[Transaction Boundary](PRINCIPLES.md#arch-transaction-boundary)

### Lock Ownership

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that a lock be exclusively held by one actor for the duration of a critical section.

Referenced by
[Pessimistic Locking](PRINCIPLES.md#arch-pessimistic-locking)

### Lock-Free Throughput

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which a design sustains high throughput by coordinating concurrent access without holding locks.

Referenced by
[Pessimistic Locking](PRINCIPLES.md#arch-pessimistic-locking)

### Modeling Overhead

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which formally modeling concurrency as a net adds effort over writing the code directly.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Non-Repeatable Side Effects

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Side effects whose repetition changes the outcome, so retrying an operation double-applies them.

Referenced by
[Idempotency](PRINCIPLES.md#arch-idempotency)

### Partial Commit

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Committing only some of a multi-step change after a failure, leaving state half-updated and inconsistent.

Referenced by
[Atomicity](PRINCIPLES.md#arch-atomicity)

### Performance Optimization

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which pushing side effects to the edges can forgo in-place optimizations that mutate for speed.

Referenced by
[Controlled Side Effects](PRINCIPLES.md#arch-controlled-side-effects)

### Places and Transitions

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that a modeled system be expressed as places holding tokens and transitions that move them.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Pure Core / Imperative Shell

- Kind: [pattern](SCHEMA.md#kind-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
An arrangement that keeps decision logic pure and pushes all side effects to a thin outer shell.

Referenced by
[Controlled Side Effects](PRINCIPLES.md#arch-controlled-side-effects)

### Reachability and Deadlock Analysis

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to analyze which states a concurrent model can reach and whether any of them deadlock.

Referenced by
[Petri Nets](PRINCIPLES.md#arch-petri-nets)

### Reliable State

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to trust that stored state always satisfies its invariants.

Referenced by
[Consistency](PRINCIPLES.md#arch-consistency)

### Repository Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which coordinating saves through a unit of work adds indirection to the persistence layer.

Referenced by
[Unit of Work Pattern](PRINCIPLES.md#arch-unit-of-work-pattern)

### Retry Complexity

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which rejecting conflicting writes pushes retry-and-merge logic onto callers.

Referenced by
[Optimistic Locking](PRINCIPLES.md#arch-optimistic-locking)

### Safe Concurrent Operations

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to run concurrent transactions without their intermediate states interfering.

Referenced by
[Isolation](PRINCIPLES.md#arch-isolation)

### Safe Parallel Mutation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to let multiple actors mutate shared state in parallel without corrupting it.

Referenced by
[Concurrency Control](PRINCIPLES.md#arch-concurrency-control)

### Safe Retries

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to retry an operation without fear of duplicating its effects.

Referenced by
[Idempotency](PRINCIPLES.md#arch-idempotency)

### Safe State Mutation

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to mutate state within a bounded transaction so partial failures cannot corrupt it.

Referenced by
[Transaction Boundary](PRINCIPLES.md#arch-transaction-boundary)

### Scattered Save Calls

- Kind: [anti-pattern](SCHEMA.md#kind-anti-pattern)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
Persisting related changes through many independent save calls, so a mid-sequence failure leaves partial state.

Referenced by
[Unit of Work Pattern](PRINCIPLES.md#arch-unit-of-work-pattern)

### Shared State Identification

- Kind: [constraint](SCHEMA.md#kind-constraint)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The requirement that all state shared between concurrent actors be identified before it is guarded.

Referenced by
[Concurrency Control](PRINCIPLES.md#arch-concurrency-control)

### State Tracking

- Kind: [quality-attribute](SCHEMA.md#kind-quality-attribute)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The degree to which making operations idempotent requires tracking processed keys or prior state.

Referenced by
[Idempotency](PRINCIPLES.md#arch-idempotency)

### Strong Conflict Prevention

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to prevent conflicting updates by locking data before it is modified.

Referenced by
[Pessimistic Locking](PRINCIPLES.md#arch-pessimistic-locking)

### Strong Transactional Guarantees

- Kind: [capability](SCHEMA.md#kind-capability)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
The ability to guarantee that a group of operations is atomic, consistent, isolated, and durable.

Referenced by
[ACID](PRINCIPLES.md#arch-acid)

### Version Field

- Kind: [artifact](SCHEMA.md#kind-artifact)
- Category: [Transactions / State / Concurrency](LEXICON.md#lex-category-transactions-state-concurrency)
- Layer: [Atomic Boundary](SCHEMA.md#layer-atomic-boundary)

Details

Definition
A field on a record whose value changes on each write, used to detect concurrent modification.

Referenced by
[Optimistic Locking](PRINCIPLES.md#arch-optimistic-locking)

---

Chapters: [Principles](PRINCIPLES.md) · [Lexicon](LEXICON.md) · [Algorithms](ALGORITHMS.md) · [Reasoning](REASONING.md) · [Schema](SCHEMA.md)
