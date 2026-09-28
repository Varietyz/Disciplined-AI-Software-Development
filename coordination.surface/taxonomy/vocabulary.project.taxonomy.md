---
name: vocabulary
summary: The closed concern vocabulary this package draws from. Adding a word is a deliberate SSOT edit, never a convenience.
type: taxonomy
concern: governance
status: current
---

# Concern vocabulary

This file is the raw word list. The rules that turn it into a deterministic standard live in
`placement.project.taxonomy.md`, which is read first, and this file is the closed vocabulary it draws
from.

The machine-readable form is `taxonomy.config.ts`. That file is authoritative for the gate, and this
one is authoritative for a reader. The two are cross-checked, so **a tag in one and not the other is a
bug in whichever drifted.**

**The SSOT holds data, not reasoning.** It carries the declarations a rule reads. Every rule _about_
those declarations lives here, because a rule written into a config is a document disguised as a
schema, and no code ever reads it.

## Scope

The concern set covers the files this package authors: contracts, rules, models, processing stages,
reports, entry points and templates. A family that classifies nothing is left out, because unused
words make the real set harder to search. A host that authors a new kind of file adds its family by an
edit to `taxonomy.config.ts`, following the steps under _Adding a word is the last resort_.

## How a word is read: position, not membership

Resolution is **positional, not lexical**. The concern is the last dot-segment before the extension,
the subject is the first, and the variant sits between. A word is read by the slot it lands in, never
by which array declares it.

- **The concern slot** takes a declared concern tag, from a closed set.
- **The subject slot** takes any declared subject **or any concern tag**, because a file may be about
  a class of things: a registry of rules, a validator of schemas.
- **The variant slot** takes a word from `variants` ∪ `subjects`, declared like every other slot.
- **The subject must not equal the concern.** `config.config.ts` is degenerate, because its subject
  carries no information.

The legal subject set is `subjects` ∪ every concern tag, so `subjects` lists only domain nouns that
are **not already concerns**, and the config's type assertions fail on a redundant redeclaration.

A concern word in the subject slot is legal only when the file's target _is_ that class of thing.
`rule.registry.ts` is a registry of rules. It does not license `rule.cache.ts` to mean "a cache that
internally holds rules", which would be a variant disguised as a subject.

**A hyphen inside a slot is spelling, and the dot is the only separator.** Names are kebab-case
throughout. A folder carries one word and never a dot.

## Adding a word is the last resort

**An undeclared word is not a license to add it.** The steps are worked in order.

1. **Pick an existing word.** The vocabulary is small on purpose. Most undeclared words are a
   synonym, an abbreviation, or a process-name for something already declared.
2. **Reason the word.** Subject = a noun naming a thing the system has. Variant = a noun that
   narrows a subject. Concern = a role a file plays. Container = a grouping of modules. The reasoning
   states which and why from the word's own meaning, never from where the file currently sits.
3. **Apply the is-a test.** Does a file IS-A this word? Then it is a role → `concerns`. Does the
   system merely HAS-A it? Then it is a domain noun → `subjects`.
4. **If it fails the reasoning, the filename is wrong.** The file is renamed, and the vocabulary is
   not bent to fit a bad name.
5. **If the file has two roles, the file is wrong.** It is split, because the ambiguity is the finding.
6. **Only if it survives, propose it.** A word is approved after the reasoning is shown, never
   silently, never in bulk and never to make a check pass.

### Reject on sight

1. **Nominalized verbs and processes**, which name what the system does rather than what it has.
2. **Adjectives**, because no slot takes them.
3. **Plurals as subjects**, because a subject is singular.
4. **Abbreviations duplicating a real word.**
5. **Grouping labels** such as `misc`, `common`, `shared`, `core` and `util`, which name a bucket rather
   than a thing. This governs the subject slot, since a grouping is exactly what a container is for.
   `base` is exempt, as described below.
6. **Measurements and properties**, which are data rather than files.
7. **Generic catch-alls** such as `util`, `helper`, `handler`, `manager` and `thing`. They exclude
   nothing, so they classify nothing.
8. **Instance ids**, because registry entries are content rather than vocabulary.
9. **A word overlapping an existing entry.**
10. **A compound that swallowed a concern**, where the tail is the concern and the head is the subject.

> `util`, `helper` and `handler` are not declared as concerns, because each is a generic catch-all
> under the list above. A file reaching for `handler` takes `processor`, `coordinator` or
> `service` by what it actually does.

**`manager` is not a concern.** It names a stature, not a role, which is why it attaches to lifecycle
owners, caches, registries and coordinators alike. It resolves to `coordinator` (owns a lifecycle,
drives collaborators) or `service` (stateful capability). A file that cannot choose is doing both, and
it is split.

**`base` is the one sanctioned generic subject.** It means the file is generic over its subject and
would be byte-identical in any domain. Both tests must hold: the file is generic over its type
parameters, and it names no domain noun anywhere in its source. A file mentioning any domain noun
takes that noun instead. `base` is not a home for files that resist classification.

## The concerns

Each tag carries exactly one canonical layer. The spine is
`domain > application > processing > runtime > infrastructure > operations > product`, ordered
domain-ward, and used **only as a tie-break**. It is the classification axis, what kind of thing a
file is, and says nothing about who may depend on whom.

### Structure and contract: infrastructure and domain

| folder           | file tag          | layer          |
| ---------------- | ----------------- | -------------- |
| `contracts`      | `.contract.`      | infrastructure |
| `specifications` | `.specification.` | domain         |
| `schemas`        | `.schemas.`       | infrastructure |
| `types`          | `.types.`         | infrastructure |
| `constants`      | `.constants.`     | infrastructure |
| `strings`        | `.strings.`       | infrastructure |
| `predicates`     | `.predicate.`     | infrastructure |
| `guards`         | `.guard.`         | infrastructure |

### Dependency and extension: infrastructure

| folder       | file tag     |
| ------------ | ------------ |
| `registries` | `.registry.` |
| `resolvers`  | `.resolver.` |
| `loaders`    | `.loader.`   |
| `factories`  | `.factory.`  |
| `manifests`  | `.manifest.` |
| `bindings`   | `.binding.`  |
| `plugins`    | `.plugin.`   |
| `config`     | `.config.`   |
| `caches`     | `.cache.`    |

### Domain modeling: domain

| folder        | file tag       |
| ------------- | -------------- |
| `rules`       | `.rule.`       |
| `policies`    | `.policy.`     |
| `models`      | `.model.`      |
| `invariants`  | `.invariant.`  |
| `constraints` | `.constraint.` |
| `records`     | `.record.`     |
| `collections` | `.collection.` |
| `snapshots`   | `.snapshot.`   |

### Application services: application

| folder          | file tag         |
| --------------- | ---------------- |
| `coordinators`  | `.coordinator.`  |
| `orchestrators` | `.orchestrator.` |
| `services`      | `.service.`      |
| `stages`        | `.stage.`        |
| `steps`         | `.step.`         |

### Serialization and processing: processing

| folder         | file tag        |
| -------------- | --------------- |
| `readers`      | `.reader.`      |
| `writers`      | `.writer.`      |
| `transformers` | `.transformer.` |
| `normalizers`  | `.normalizer.`  |
| `formatters`   | `.formatter.`   |
| `pipelines`    | `.pipeline.`    |
| `processors`   | `.processor.`   |
| `filters`      | `.filter.`      |
| `validators`   | `.validator.`   |
| `matchers`     | `.matcher.`     |
| `comparators`  | `.comparator.`  |
| `iterators`    | `.iterator.`    |
| `generators`   | `.generator.`   |
| `analyzers`    | `.analyzer.`    |
| `inspectors`   | `.inspector.`   |

### Failure and reporting: operations

| folder      | file tag     |
| ----------- | ------------ |
| `errors`    | `.error.`    |
| `results`   | `.result.`   |
| `reporters` | `.reporter.` |
| `reports`   | `.report.`   |
| `taxonomy`  | `.taxonomy.` |

### Runtime and product

| folder        | file tag       | layer   |
| ------------- | -------------- | ------- |
| `entrypoints` | `.entrypoint.` | runtime |
| `runners`     | `.runner.`     | product |
| `fixtures`    | `.fixture.`    | product |
| `references`  | `.reference.`  | product |
| `templates`   | `.template.`   | product |

### Plurality

| form                                            | folder   | file tag   | example                                  |
| ----------------------------------------------- | -------- | ---------- | ---------------------------------------- |
| collection, where one file defines many members | plural   | **plural** | `schemas/` ⇒ `record.schemas.ts`         |
| single-unit, with one instance per file         | plural   | singular   | `validators/` ⇒ `placement.validator.ts` |
| mass or uncountable                             | singular | singular   | `config/`, `taxonomy/`                   |

The collection concerns here are `schemas`, `types`, `constants` and `strings`, and the mass concerns
are `config` and `taxonomy`. Everything else is single-unit.

## Covered by a meta concern, and not added

The rejected list is the useful half of a closed vocabulary. Each entry reads like a deployment
concern and is already an agnostic one.

| tempting tag                   | classify as                             | why                                        |
| ------------------------------ | --------------------------------------- | ------------------------------------------ |
| `checker`, `linter`            | `validator`                             | it decides valid or invalid                |
| `scanner`                      | `analyzer` or `inspector`               | it reads and derives, it does not judge    |
| `parser`, `lexer`, `tokenizer` | `reader`                                | it turns a format into structure           |
| `fixer`, `healer`, `repairer`  | `transformer`                           | it maps input state to output state        |
| `walker`, `crawler`            | `iterator`                              | it yields members of a set                 |
| `gate`                         | `predicate` or `validator`              | a gate is a decision, not a thing          |
| `index`                        | `registry`                              | a lookup structure is a registry           |
| `helper`, `util`               | none, because the file has a real role  | find it and name it                        |
| `manager`                      | `coordinator` or `service`              | split by what it actually does             |
| `handler`                      | `processor` or `coordinator`            | it names stature, not role                 |
| `doc`, `guide`, `note`         | `reference`                             | authored knowledge is a reference          |
| `digest`, `summary`            | `reference` or `rule`                   | by whether it informs or obliges           |
| `checklist`, `plan`            | `specification`                         | it declares required end state             |
| `inventory`                    | `registry`                              | a named set of known members               |
| `changelog`                    | none, because it is structurally exempt | history has one home, outside the taxonomy |

`digest` can mean a cryptographic hash or a rule summary. Declaring it would collide two meanings on
one tag, so it is declared neither way: a rule expansion is a `rule`, and a knowledge summary is a
`reference`.

## The subjects

**The subject array is the one slot whose members are a project's own nouns**, so it is not listed
here. It lives in the configuration, where a host adds what it has and nothing else. A subject list
transcribed into prose is a second vocabulary that disagrees with the compiled one the first time
either moves, and the compiled one is the copy the assertions check.

One rule decides what the array holds, and it is the same in every host: **a noun the host actually
has, excluding every word already a concern tag.** A word that names stature rather than substance,
such as a manager, a handler, a helper or a util, classifies nothing and is refused whatever the host.

The array is closed. An undeclared word is an approved edit to the configuration, never a naming choice
made at authoring time, and the cross-slot assertions compiled beside it reject a subject that shadows a
concern tag before a single file is placed.

## The variants

`comms` · `project` · `protocol`

A variant is present only on a genuine collision within one folder, or to name a facet the subject
alone does not. No collision and no facet means one compound kebab subject and no variant.
