---
name: file-placement
description: Name and place any file created, moved or renamed under a governed root - the concern grammar, the ordered-role depth rule, the determination protocol for choosing a concern, and the ladder for proposing a new vocabulary word. Use before writing any new file, before creating any folder, and whenever a file resists classification.
---

# file-placement

Every file created under a governed root is **born conformant**: named and placed correctly at creation, never
queued for a later conversion.

The digest is `.{provider}/rules/taxonomy.rule.md`. The closed vocabularies and the declared roots belong to the
package configuration, and the placement and naming checks read them from there rather than from a document, so a
word this skill spells and a word the configuration declares can never disagree.

## 0. Is it governed?

**A governed root is one the configuration declares. No declaration, no enforcement**: outside them the grammar
does not apply, and nothing is renamed to satisfy it.

Three classes sit outside, each for a stated reason:

1. a tree carrying another system's ownership markers, whose names are identifiers that system resolves at run
   time.
2. a tree holding material authored elsewhere, declared once as an upstream root so the naming, tense and
   reference checks exempt it together.
3. the vocabulary's own definition, which cannot be governed by the grammar it declares.

Exempt inside a governed root are ecosystem-fixed names resolved by exact string. A compound marker in a filename
is name-exempt and **never** placement-exempt.

## 1. Determine the concern: read, do not guess

```text
1. READ the file. what does it actually do?
2. NAME the concern — the narrowest accurate tag, not a saturated one
3. CHECK the vocabulary in order:
     in the configuration → use it
     in the rejections    → use the concern it points to
     none of the above    → UNRESOLVED. a finding, not a blocker —
                             it usually means the file does two things
4. VERIFY the name against the content, never against the old filename
5. one concern per file. two concerns = split, never a compromise tag
```

The narrowest tag wins, so a coordinator beats a service. Irreducible overlap breaks domain-ward:
`domain > application > processing > runtime > infrastructure > operations > product`.

Common redirects: a checker is a `validator` · a scanner is an `analyzer` or an `inspector` · a parser is a
`reader` · a fixer is a `transformer` · a walker is an `iterator` · an index is a `registry` · a document is a
`reference` · a checklist is a `specification`. `manager`, `handler`, `helper` and `util` are not concerns,
because they name stature or nothing, so they classify nothing.

## 2. Place it

```text
container(1) → subject(2, optional) → concern(3) → file       depth within the declared cap
```

Roles resolve `container < subject < concern`, with each depth consuming a role strictly later than the last.
They are skippable, never repeated and never revisited. **The file's parent is always a concern folder.**

A **subject folder** exists _if and only if_ the container holds two or more sets of one concern that must not
merge. One set gets a bare concern folder.

A **bucket** holds one collection concern, as files and never folders, and the depth cap does not apply inside
one.

## 3. Name it

```text
<subject>.<concern>.<ext>              standard
<subject>.<variant>.<concern>.<ext>    overflow
```

The concern tag equals the parent folder's label in the plurality form the configuration records: a collection
concern is plural in both, a single-unit concern has a plural folder and a singular tag, and a mass concern is
singular in both.

A **variant** appears only on a genuine collision within one folder, or to name a facet the subject alone does
not. Otherwise the file carries one compound kebab subject and no variant.

**The member never restates the set.** Inside a concern folder, the file names its own subject rather than
repeating the folder.

Resolution is positional, so a concern tag is a legal subject. The one bar is subject ≠ concern.

## 4. Overflow relieves sideways

A collision takes the **variant slot**, and breadth takes a **sibling subject folder**. Depth is never the relief,
because the cap is _why_ both slots exist, and removing it degenerates both into nesting.

## 5. Undeclared word? Work the ladder

1. **Pick an existing word.** Most undeclared words are a synonym or a process-name for something declared.
2. **Reason it.** A subject is a noun the system has, and a concern is a role a file plays.
3. **Apply the is-a test.** If a file IS-A this word, it is a concern. If the system HAS-A it, it is a subject.
4. **If it fails, the filename is wrong.** The file is renamed rather than the vocabulary bent.
5. **If the file has two roles, the file is wrong.** It is split.
6. **Only if it survives, propose it**, approved with the reasoning shown, never silently and never to make a
   check pass.

**An identity another surface allocates is derived into a slot and never declared into the array.** A vocabulary
that grows by one word per instance is not closed, and copying an allocator's output into a second list makes two
owners of one fact that disagree the moment one moves.

A word is never added so a check passes, and a finding is never answered with an ignore list, because that hides
the violation and every future one under the same name.

## 6. Before renaming anything existing

Every **pattern-referenced** surface is enumerated first, and each is verified afterwards to resolve the same set.
The reference-bearing fields across the governed documents form a reference graph encoded in text, and the segment
tool derives it. The count is read from its report rather than stated here, because a transcribed count is a
derived fact maintained by hand. A missed rename resolves to nothing, errors nowhere, and disconnects the graph
silently.

**A rename is a create at its destination**, so the destination is read before the write, and the two names are
never both live.

Structure is machine-decidable and safely repaired. **Classification is judgment and is never automated.**
