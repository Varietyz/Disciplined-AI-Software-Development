---
id: schema
title: Typed record schema
kind: meta
---

# schema

The contract for every record file under `.{provider}/intel/`. It is machine-first: a record file carries no
prose paragraphs, because a record is read by resolution rather than by reading.

## file_shape

```text
---
id: <kebab-slug>            # unique, matches the filename stem
title: <short>
domain: <knowledge-domain>  # the subject area this file holds records about
records: typed              # optional; a listing carries its own key set instead
tags: [<kebab>, ...]
confidence: high|mixed|low  # aggregate over the records in the file
sources: { S1: <reference>, S2: <reference>, ... }
---

# <id>

## <section-slug>

### <RECORD-ID>
key: value
key: value
```

## record_id

The format is `<PREFIX>-<NNN>`, with the prefix stable per file. A record id is stable and is never renumbered
while its fact holds. **When a fact stops being true, the record is deleted** rather than marked retired or kept
with an annotation.

## record_keys

Required on every record:

| key          | values                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| `type`       | `fact` `constraint` `limit` `pitfall` `fix` `procedure` `measurement` `tension` `unknown` |
| `statement`  | a single declarative sentence, present tense, no hedging                                  |
| `confidence` | `verified-local` `vendor-doc` `community` `inferred`                                      |
| `derivation` | optional and closed: how the record came to be, never how well-founded it is              |
| `source`     | a source ref, an in-tree path, or `measured`                                              |

Optional, used where applicable:

| key                        | meaning                                                                           |
| -------------------------- | --------------------------------------------------------------------------------- |
| `applies_to`               | the variants of the subject the record holds for                                  |
| `since`                    | the earliest version carrying the behavior, where earlier ones carry the opposite |
| `subject`                  | dotted topic path within the file's domain                                        |
| `symptom`                  | the observable failure text or behavior                                           |
| `cause`                    | the mechanism                                                                     |
| `fix`                      | the remediation, with exact operands                                              |
| `detect`                   | how to test for the condition                                                     |
| `severity`                 | `fatal` `degraded` `cosmetic` `advisory`                                          |
| `side`                     | which side of a boundary the fact holds on                                        |
| `default`                  | the default value of a setting                                                    |
| `range`                    | the valid range                                                                   |
| `replaces` / `replaced_by` | the interface this one stands in for                                              |
| `see`                      | `<FILE-ID>#<RECORD-ID>` cross-references, comma separated                         |
| `status`                   | `disputed`, meaning the sources conflict. No other value exists                   |

**`confidence` and `derivation` are two axes, and neither is spelled in the other's field.** Precedence ranks
strength alone, so a provenance word has no position on that scale, and pushing one into the tier vocabulary
leaves the whole set unrankable rather than misclassifying one record. Both vocabularies are closed, because an
open field reads as governed while resolving to nothing.

## tension_records

A `type: tension` record is a **typed relation between two other records**, never a paragraph about them. Prose
states that two things are in tension, while a relation lets a reader holding one record discover the other,
learn why they collide, and be told what to do about it.

Required in addition to the keys above:

| key            | content                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `kind`         | `apparent`, where both hold once their domains are separated · `real`, a genuine trade-off where one must be chosen |
| `conflicts`    | the record id of the first side, with its subject                                                                   |
| `with`         | the record id of the second side, with its subject                                                                  |
| `axis`         | the single thing both records claim authority over                                                                  |
| `cause`        | why they appear to collide, which for an apparent tension is the qualifier missing when each is read alone          |
| `resolution`   | the rule that separates them, stated so it decides a case                                                           |
| `remediate`    | what to do on encountering the collision                                                                            |
| `compatible`   | record ids that compose with both sides                                                                             |
| `incompatible` | record ids that genuinely cannot hold together, or `none` where the conflict is apparent                            |

`kind` carries the weight. An apparent tension is a reading error, and both principles survive intact. A real
tension is a decision the architecture has to make and record. **Calling one the other is how a trade-off gets
lost**, either by pretending a choice was avoidable, or by conceding a principle that never needed conceding.

`detect` here names the observable symptom that the two domains have been merged, which is almost always the
actual defect rather than either principle being wrong.

## rules

- One record, one claim. Nothing is bundled.
- Exact identifiers are preserved verbatim: symbol names, file names, error strings, numeric ids.
- A `statement` is assertable true or false. No _consider_, no _may want to_.
- `verified-local` is reserved for facts observed in this tree.
- Contradictions are both kept, both marked disputed, with a cross-reference between them.
- A secondary source is `community` however confident it reads.
- Absolute dates only, never _recently_, _currently_ or _the latest_.
- Present tense only, and no history of this project. Version-dependent third-party behavior is a current fact
  about the environment and is permitted.
