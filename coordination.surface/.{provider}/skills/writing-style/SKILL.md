---
name: writing-style
description: Mandatory present-tense-only rule for every file written in this package - no history, no change notes, no past-tense references to the tree, no retired or deprecated markers. Use before writing or editing ANY document, record or data file, and whenever recording something that changed.
---

# writing-style

**Every file describes what is true right now, and nothing else.**

The full rule is `.{provider}/rules/document.rule.md`, and this skill is the operational check.

## The one question

Before any file is saved, the question is: _would this sentence still be here if the tree had always been in its
current state?_

If not, it is history, and it is deleted.

## Banned outright

| pattern                           | instead                                       |
| --------------------------------- | --------------------------------------------- |
| a rename described as a rename    | describe the current name and nothing else    |
| a previous location               | state where it is                             |
| an unused marker                  | delete the record                             |
| a retired or deprecated status    | delete the record                             |
| a deletion date                   | say nothing, because the thing does not exist |
| an original form                  | describe what it is                           |
| a corrected assumption            | describe what it is                           |
| a move described as a move        | describe where it is                          |
| a superseded value in parentheses | state the current value                       |
| a change framed as this change    | describe the state                            |

## Caught means fixed

The moment a violation is seen, whether while reading a file, searching, or opening it for something unrelated,
**it is fixed in that same turn.** It is never reported and left, never put as a question, never deferred and
never called out of scope. This covers every kind of staleness: wrong paths, dead references, stale counts and
contradictions between documents.

Deferring creates debt that gets forgotten and leaves documents contradicting each other.

## Where history goes

There are two destinations only: the history accumulator the configuration resolves, and a message to the owner.
History never goes into a document, a record, a configuration or a data file.

## When something changes

The affected text is rewritten so it describes the new state. Nothing is appended, annotated, struck through or
marked. Where a record's subject stops existing, the record is removed rather than retired.

## Third-party platform facts are not history

A fact about a platform, a runtime or an external tool this package runs beside is current-state operational
knowledge even when it references versions, and it is written in present tense.

- Write: a named setting **does not exist** in that runtime.
- Not: it _was removed_.
- Write: a named interface **returns** its result from a stated version onward.
- Not: it _was fixed_ in a later release.

The distinction: **our** files, folders and records carry no history. **Their** behavior across versions is a
fact about the environment, and the tense scan exempts it.

## A rule may carry the measurement that produced it

It may do so inside the rule it justifies, and nowhere else. The permitted half is the shape that failed and how
it presents, and the refused half is who did it, when, and in what order. A measurement stated as a shape usually
needs no past tense at all, so rephrasing comes first, and the permission is reached for last.

## Restructuring or relocating a document

A structural change to an existing document, whether reshaping it, reformatting it **or moving it**, is never done
in one step. Moving a document to another path, folder or governance layer is a rewrite of it and takes the same
approval as rewriting its contents.

The sequence, in order:

1. **Classify.** The document is read whole, and the narrowest accurate concern is named.
2. **Raise any placement conflict as a question.** Where the requested location is illegal under the grammar,
   the legal endings are enumerated with what each costs. It is never resolved by picking one and moving the file.
3. **Write the draft beside the live file.** The original stays readable throughout.
4. **Publish the migration map** of every block and its destination, with any deletion listed explicitly with its
   reason.
5. **Wait.** This is the checkpoint rather than a courtesy.
6. **On approval**, replace, delete the draft, update every pointer, and run the verify command.
7. **Extract the durable half** to the history accumulator.

**The source is never deleted in the step that creates its replacement.** Where the host resolves no checkpoint,
the original is the only thing the replacement can be compared against.

## Self-check before save

The file is scanned for a past-form verb attached to anything in this tree, and for any date attached to one of
our own actions. Every hit is a violation unless it describes third-party platform state, or unless it is the
measurement a rule states inside its own justification.
