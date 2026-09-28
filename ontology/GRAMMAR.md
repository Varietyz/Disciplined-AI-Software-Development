© 2025 Jay Baleine - Disciplined Methodology · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Grammar — Ontology — Bane's Lab

> Every PAG keyword record, with what grounds it and how it is checked.

Canonical: https://banes-lab.com/ontology/grammar

# The Ontology

The ontology is a queryable canon of software architecture. It holds every principle with its relations and its repair, every term with its definition, every algorithm with its contract, the reasoning that derives them, the layers they live in and how every tension between them is resolved, and every reference from one record to another is a link.

# Grammar

332 of 332 shown

## Sections

- [action](#pag-keywords-action)
- [control_flow](#pag-keywords-control-flow)
- [declaration](#pag-keywords-declaration)
- [modifier](#pag-keywords-modifier)
- [coordination](#pag-keywords-coordination)
- [state_machine](#pag-keywords-state-machine)
- [dag](#pag-keywords-dag)
- [priority_queue](#pag-keywords-priority-queue)
- [flowchart](#pag-keywords-flowchart)
- [document_type](#pag-keywords-document-type)
- [document_verb](#pag-keywords-document-verb)
- [meta](#pag-keywords-meta)
- [validation](#pag-keywords-validation)
- [report](#pag-keywords-report)
- [invariant](#pag-keywords-invariant)
- [node](#pag-keywords-node)
- [semantic_operation](#pag-keywords-semantic-operation)
- [contextual](#pag-keywords-contextual)
- [planning](#pag-productions-planning)
- [coordination](#pag-productions-coordination)
- [statement](#pag-productions-statement)
- [Document types](#the-document-types)
- [Templates](#the-templates)

## action

Every PAG keyword record, with what grounds it and how it is checked.

### READ

Details

Meaning
Input acquisition · lowers to READ_RESOURCE

Example
READ file INTO data

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WRITE

Details

Meaning
Output generation · lowers to PERSIST_ARTIFACT

Example
WRITE content TO file

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXECUTE

Details

Meaning
Action invocation · lowers to EXECUTE_TOOL

Example
EXECUTE command WITH params

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CREATE

Details

Meaning
Construction · lowers to COMPOSE_ARTIFACT

Example
CREATE artifact FROM template

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DELETE

Details

Meaning
Removal · an irreversible write, refused before it lands

Example
DELETE file_path

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FIND

Details

Meaning
Discovery · lowers to DISCOVER_RESOURCES

Example
FIND pattern IN scope

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ANALYZE

Details

Meaning
Inspection · lowers to ANALYZE_CONTENT

Example
ANALYZE target FOR condition

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VALIDATE

Details

Meaning
Verification · lowers to VALIDATE_ARTIFACT

Example
VALIDATE state AGAINST schema

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VERIFY

Details

Meaning
Confirmation against evidence

Example
VERIFY condition

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXTRACT

Details

Meaning
Isolation · lowers to EXTRACT_FACTS

Example
EXTRACT data FROM source

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COLLECT

Details

Meaning
Aggregation

Example
COLLECT items INTO container

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FILTER

Details

Meaning
Selection

Example
FILTER items WHERE condition

Grounds
[mode:classification](REASONING.md#reasoning-mode-classification)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPARE

Details

Meaning
Comparison

Example
COMPARE a AGAINST b

Grounds
[mode:comparison](REASONING.md#reasoning-mode-comparison)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CONVERT

Details

Meaning
Transformation · a lowering that names what it preserves

Example
CONVERT data TO format

Grounds
[invariant:epi-preserved-distinction](REASONING.md#reasoning-invariant-epi-preserved-distinction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MERGE

Details

Meaning
Combination

Example
MERGE sources INTO target

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SPLIT

Details

Meaning
Division

Example
SPLIT data BY delimiter

Grounds
[substrate-node:difference](REASONING.md#reasoning-substrate-node-difference)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SORT

Details

Meaning
Ordering

Example
SORT items BY criteria

Grounds
[lens:sequential](REASONING.md#reasoning-lens-sequential)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RANK

Details

Meaning
Prioritization · the ranking a worth gate reads

Example
RANK items BY score

Grounds
[node:tel-priority](REASONING.md#reasoning-node-tel-priority)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LINK

Details

Meaning
Association · a declared edge, never a name match

Example
LINK source TO target

Grounds
[lens:relation](REASONING.md#reasoning-lens-relation), [invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REPORT

Details

Meaning
Output · lowers to REPORT_RESULT

Example
REPORT findings

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ADD

Details

Meaning
Add to collection

Example
ADD item TO list

Grounds
[substrate-node:existence](REASONING.md#reasoning-substrate-node-existence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### APPEND

Details

Meaning
Append to end

Example
APPEND value TO array

Grounds
[substrate-node:existence](REASONING.md#reasoning-substrate-node-existence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### INSERT

Details

Meaning
Insert at position

Example
INSERT item AT index

Grounds
[substrate-node:structure](REASONING.md#reasoning-substrate-node-structure)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REMOVE

Details

Meaning
Remove from collection

Example
REMOVE item FROM list

Grounds
[substrate-node:difference](REASONING.md#reasoning-substrate-node-difference)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MOVE

Details

Meaning
Relocation · a create at the destination, read before it lands

Example
MOVE file TO destination

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COPY

Details

Meaning
Duplication · a second derivation of one fact, declared as such

Example
COPY file TO backup

Grounds
[invariant:epi-one-derivation](REASONING.md#reasoning-invariant-epi-one-derivation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BACKUP

Details

Meaning
Preservation of the last accepted state before a mutation

Example
BACKUP file TO location

Grounds
[node:ter-promotion](REASONING.md#reasoning-node-ter-promotion)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RESTORE

Details

Meaning
Recovery of the last accepted state

Example
RESTORE FROM backup

Grounds
[node:ter-promotion](REASONING.md#reasoning-node-ter-promotion)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LOAD

Details

Meaning
Resource acquisition · lowers to READ_RESOURCE

Example
LOAD config FROM file

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SEND

Details

Meaning
Communication · lowers to REPORT_RESULT

Example
SEND message TO recipient

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WAIT

Details

Meaning
Timing control · waiting has a command

Example
WAIT FOR condition

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ATTEMPT

Details

Meaning
Trial operation

Example
ATTEMPT operation

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FAIL

Details

Meaning
Error termination · loud at the boundary

Example
FAIL WITH message

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXIT

Details

Meaning
Exit execution

Example
EXIT 1

Grounds
[node:ter-stop](REASONING.md#reasoning-node-ter-stop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RETURN

Details

Meaning
Return value · how a bounded reader ends

Example
RETURN result

Grounds
[node:ter-completion](REASONING.md#reasoning-node-ter-completion)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ITERATE

Details

Meaning
Repetition

Example
ITERATE operation

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### INVESTIGATE

Details

Meaning
Deep analysis

Example
INVESTIGATE issue

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DETERMINE

Details

Meaning
Decision making

Example
DETERMINE outcome

Grounds
[mode:classification](REASONING.md#reasoning-mode-classification)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ENFORCE

Details

Meaning
Constraint application

Example
ENFORCE rule

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EVIDENCE

Details

Meaning
Proof provision

Example
EVIDENCE claim

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROPAGATE

Details

Meaning
Change distribution · the ripple through declared dependencies

Example
PROPAGATE updates

Grounds
[invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FINALIZE

Details

Meaning
Completion

Example
FINALIZE operation

Grounds
[node:ter-completion](REASONING.md#reasoning-node-ter-completion)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REDUCE

Details

Meaning
Aggregation · a fusion that drops nothing live

Example
REDUCE items TO value

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RENAME

Details

Meaning
Name modification · every referencing surface enumerated first

Example
RENAME file TO newname

Grounds
[invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ORDER

Details

Meaning
Arrangement

Example
ORDER items BY key

Grounds
[lens:sequential](REASONING.md#reasoning-lens-sequential)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MARK

Details

Meaning
Annotation

Example
MARK item AS complete

Grounds
[axis:representation](REASONING.md#reasoning-axis-representation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PREDICT

Details

Meaning
Infer a future state

Example
PREDICT outcome FROM model

Grounds
[mode:prediction](REASONING.md#reasoning-mode-prediction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CLASSIFY

Details

Meaning
Group by kind

Example
CLASSIFY item BY type

Grounds
[mode:classification](REASONING.md#reasoning-mode-classification)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXPLAIN

Details

Meaning
Identify the mechanism

Example
EXPLAIN behavior

Grounds
[mode:explanation](REASONING.md#reasoning-mode-explanation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REFLECT

Details

Meaning
Discover the principle behind the examples

Example
REFLECT ON outcome

Grounds
[mode:reflection](REASONING.md#reasoning-mode-reflection)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ABSTRACT

Details

Meaning
Remove irrelevant detail

Example
ABSTRACT pattern FROM cases

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GENERALIZE

Details

Meaning
Extend examples into a principle

Example
GENERALIZE FROM examples

Grounds
[mode:generalization](REASONING.md#reasoning-mode-generalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DESCRIBE

Details

Meaning
Characterize an object

Example
DESCRIBE structure

Grounds
[mode:description](REASONING.md#reasoning-mode-description)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FORMALIZE

Details

Meaning
Express symbolically

Example
FORMALIZE rule AS predicate

Grounds
[mode:formalization](REASONING.md#reasoning-mode-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## control_flow

Every PAG keyword record, with what grounds it and how it is checked.

### IF

Details

Meaning
Conditional execution

Example
IF condition: action

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ELSE

Details

Meaning
Alternative branch

Example
ELSE: alternative

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FOR

Details

Meaning
Iteration start

Example
FOR EACH item IN list:

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EACH

Details

Meaning
Iterator marker

Example
FOR EACH x IN items:

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WHILE

Details

Meaning
Conditional loop

Example
WHILE condition: action

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TRY

Details

Meaning
Exception handling start

Example
TRY: risky_op

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CATCH

Details

Meaning
Exception handler

Example
CATCH: handle_error

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXCEPT

Details

Meaning
Exception alternative

Example
EXCEPT: recovery

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FINALLY

Details

Meaning
Cleanup block

Example
FINALLY: cleanup

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MATCH

Details

Meaning
Pattern matching

Example
MATCH value:

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CASE

Details

Meaning
Match branch

Example
CASE pattern: action

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEFAULT

Details

Meaning
Fallback case · a declared default, never a masked failure

Example
DEFAULT: fallback

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WHEN

Details

Meaning
Event trigger

Example
WHEN event: action

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### UNLESS

Details

Meaning
Negated conditional

Example
UNLESS condition: action

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### UNTIL

Details

Meaning
Loop terminator

Example
UNTIL done

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GUARD

Details

Meaning
Early exit check

Example
GUARD cond ELSE: exit

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BREAK

Details

Meaning
Exit loop

Example
BREAK

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CONTINUE

Details

Meaning
Skip iteration

Example
CONTINUE

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GOTO

Details

Meaning
Jump to label

Example
GOTO label

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### START

Details

Meaning
Flow start marker

Example
START process

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### END

Details

Meaning
Flow end marker

Example
END

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### STOP

Details

Meaning
Termination

Example
STOP

Grounds
[node:ter-stop](REASONING.md#reasoning-node-ter-stop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LOOP

Details

Meaning
Loop marker

Example
LOOP BACKTO step

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### STEP

Details

Meaning
Step marker

Example
STEP 1: action

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RULE

Details

Meaning
Rule definition

Example
RULE name: body

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### IN

Details

Meaning
Containment test

Example
item IN collection

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MATCHES

Details

Meaning
Pattern test

Example
value MATCHES pattern

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## declaration

Every PAG keyword record, with what grounds it and how it is checked.

### SET

Details

Meaning
Variable assignment

Example
SET name = value

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DECLARE

Details

Meaning
Typed declaration

Example
DECLARE x: string

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEFINE

Details

Meaning
Constant definition

Example
DEFINE PI = 3.14

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LET

Details

Meaning
Local binding

Example
LET temp = expr

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CONST

Details

Meaning
Immutable value

Example
CONST MAX = 100

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## modifier

Every PAG keyword record, with what grounds it and how it is checked.

### MUST

Details

Meaning
Mandatory requirement · a modifier inside a property

Example
MUST validate first

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### NEVER

Details

Meaning
Prohibition · a modifier inside a property

Example
NEVER delete without backup

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ALWAYS

Details

Meaning
Invariance · a modifier inside a property

Example
ALWAYS log changes

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REQUIRED

Details

Meaning
Necessity marker

Example
REQUIRED field

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MANDATORY

Details

Meaning
Obligation marker

Example
MANDATORY check

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CRITICAL

Details

Meaning
Repair ordering among failures, never a softer verdict

Example
CRITICAL validation

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ABSOLUTE

Details

Meaning
No exceptions

Example
ABSOLUTE rule

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FORBIDDEN

Details

Meaning
Absolute prohibition

Example
FORBIDDEN: direct DB

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## coordination

Every PAG keyword record, with what grounds it and how it is checked.

### AWAIT

Details

Meaning
Async wait · waiting has a command, a turn never ends to wait

Example
AWAIT op INTO result

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PARALLEL

Details

Meaning
Concurrent execution

Example
PARALLEL: tasks END

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DELEGATE

Details

Meaning
Task handoff · a bounded reader receives a task and returns

Example
DELEGATE task TO reader

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### QUEUE

Details

Meaning
Task queuing

Example
QUEUE operation

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RETRY

Details

Meaning
Retry on failure · bounded by a declared limit

Example
RETRY operation

Grounds
[node:ter-diminishing-returns](REASONING.md#reasoning-node-ter-diminishing-returns)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LOCK

Details

Meaning
Resource lock · the barrier around an exclusive write

Example
LOCK resource

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### UNLOCK

Details

Meaning
Release lock

Example
UNLOCK resource

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SURFACE

Details

Meaning
A file parties read and write · its key declared in the header, never derived from the path

Example
SURFACE <key>:

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RECORD

Details

Meaning
One addressable claim inside a surface · exactly one writer

Example
RECORD <id> subject: <key>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ITEM

Details

Meaning
An addressed span inside a record · its id allocated by the tool

Example
ITEM <id> TO <reader>: <claim>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PARENT

Details

Meaning
Edge · the target reduces this surface upward

Example
PARENT <surface>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SATISFIED_BY

Details

Meaning
Edge · the record resolves when the artifact exists

Example
SATISFIED_BY <artifact>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BLOCKS

Details

Meaning
Edge · the target cannot close first

Example
BLOCKS <record>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ANSWERS

Details

Meaning
Edge · this record acts on the target

Example
ANSWERS <record>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REFUTES

Details

Meaning
Edge · this record contradicts the target with evidence

Example
REFUTES <record>

Grounds
[node:ver-refutation](REASONING.md#reasoning-node-ver-refutation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SUPERSEDES

Details

Meaning
Edge · this record replaces the target

Example
SUPERSEDES <record>

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OPEN

Details

Meaning
Derived state · an unresolved outbound edge, never written

Example
state: OPEN

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ABSORBED

Details

Meaning
Derived state · the satisfying artifact exists; extract, then delete

Example
state: ABSORBED

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### READER

Details

Meaning
A party's class, derived from what it received · participant or bounded

Example
READER <party> AS participant | bounded

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WAIT

Details

Meaning
Post and wait as one operation · reports the diff since this reader last looked

Example
WAIT ON <surface> AS <reader> INTO <diff>

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BARRIER

Details

Meaning
Proceed with an exclusive write only once every peer is parked

Example
BARRIER ON <surface>

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SWAP

Details

Meaning
Compare-and-swap on the writer's own span · refuses an overlap with its diff

Example
SWAP ** AGAINST ** **<read>**

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## state_machine

Every PAG keyword record, with what grounds it and how it is checked.

### STATE_MACHINE

Details

Meaning
Machine declaration · makes a lifetime or a derived-state set explicit

Example
STATE_MACHINE workflow:

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### STATE

Details

Meaning
State definition · a state is derived from the graph, never written

Example
STATE pending:

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TRANSITION

Details

Meaning
State change rule

Example
TRANSITION FROM a TO b

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ON

Details

Meaning
Event trigger

Example
ON approval

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FROM

Details

Meaning
Source state

Example
FROM pending

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TO

Details

Meaning
Target state

Example
TO approved

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ENTRY

Details

Meaning
Entry action

Example
ENTRY: notify

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXIT

Details

Meaning
Exit action

Example
EXIT: cleanup

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## dag

Every PAG keyword record, with what grounds it and how it is checked.

### DAG

Details

Meaning
Graph declaration · makes a dependency graph explicit; the loop spine is one

Example
DAG pipeline:

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph), [invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### NODE

Details

Meaning
Node definition

Example
NODE build:

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEPENDS_ON

Details

Meaning
Dependencies · declared by the referent, never inferred from a name

Example
DEPENDS_ON [a, b]

Grounds
[invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AFTER

Details

Meaning
Sequencing

Example
AFTER compile

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BEFORE

Details

Meaning
Reverse sequencing

Example
BEFORE deploy

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PARALLEL_GROUP

Details

Meaning
Parallel nodes · peers with no edge between them

Example
PARALLEL_GROUP: a, b

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## priority_queue

Every PAG keyword record, with what grounds it and how it is checked.

### PRIORITY_QUEUE

Details

Meaning
Queue declaration · makes a ranking explicit; the branch ranking a worth gate emits is one

Example
PRIORITY_QUEUE branches:

Grounds
[node:tel-priority](REASONING.md#reasoning-node-tel-priority)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PRIORITY

Details

Meaning
Priority value · utility minus cost

Example
PRIORITY = 10

Grounds
[node:tel-utility](REASONING.md#reasoning-node-tel-utility), [node:tel-cost](REASONING.md#reasoning-node-tel-cost)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ENQUEUE

Details

Meaning
Add to queue

Example
ENQUEUE task TO q

Grounds
[pattern-type:combinatorics](REASONING.md#reasoning-pattern-type-combinatorics)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEQUEUE

Details

Meaning
Remove from queue

Example
DEQUEUE FROM q

Grounds
[pattern-type:combinatorics](REASONING.md#reasoning-pattern-type-combinatorics)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PEEK

Details

Meaning
View top item · the selected branch

Example
PEEK queue

Grounds
[node:tel-priority](REASONING.md#reasoning-node-tel-priority)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### HEAPIFY

Details

Meaning
Reorder queue

Example
HEAPIFY queue

Grounds
[pattern-type:combinatorics](REASONING.md#reasoning-pattern-type-combinatorics)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPARE_BY

Details

Meaning
Comparison function

Example
COMPARE_BY priority

Grounds
[pattern-type:combinatorics](REASONING.md#reasoning-pattern-type-combinatorics)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## flowchart

Every PAG keyword record, with what grounds it and how it is checked.

### FLOWCHART

Details

Meaning
Flow declaration · the rendered projection of a declared structure

Example
FLOWCHART process:

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph), [axis:representation](REASONING.md#reasoning-axis-representation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MERMAID

Details

Meaning
Diagram syntax · a rendering, never the structure itself

Example
MERMAID flowchart:

Grounds
[axis:representation](REASONING.md#reasoning-axis-representation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LAYOUT

Details

Meaning
Flow direction

Example
LAYOUT vertical

Grounds
[representation:geometry](REASONING.md#reasoning-representation-geometry)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SUBGRAPH

Details

Meaning
Nested group

Example
SUBGRAPH auth:

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## document_type

Every PAG keyword record, with what grounds it and how it is checked.

### AGENT

Details

Meaning
Agent definition

Example
THIS AGENT PERFORMS...

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WORKFLOW

Details

Meaning
Multi-node process

Example
THIS WORKFLOW EXECUTES...

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROTOCOL

Details

Meaning
Standard procedures

Example
THIS PROTOCOL DEFINES...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### POLICY

Details

Meaning
Constraint system

Example
THIS POLICY ENFORCES...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CHECKLIST

Details

Meaning
Task tracking

Example
THIS CHECKLIST PROVIDES...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TEMPLATE

Details

Meaning
Reusable pattern

Example
THIS TEMPLATE IMPLEMENTS...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TASK

Details

Meaning
Single objective

Example
THIS TASK EXECUTES...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### INSTRUCTION

Details

Meaning
General guidance

Example
THIS INSTRUCTION IS...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROMPT

Details

Meaning
Model interaction

Example
THIS PROMPT IS...

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMMAND

Details

Meaning
Executable command

Example
THIS COMMAND EXECUTES...

Grounds
[model:cognition](REASONING.md#reasoning-model-cognition)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TEST

Details

Meaning
Test specification

Example
THIS TEST PERFORMS...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEBUG

Details

Meaning
Debugging session

Example
THIS DEBUG RESOLVES...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VERIFICATION

Details

Meaning
Compliance verification

Example
THIS VERIFICATION PERFORMS...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DISTILLATION

Details

Meaning
Pattern distillation

Example
THIS DISTILLATION DISTILLS...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AUDIT

Details

Meaning
Forensic audit

Example
THIS AUDIT AUDITS...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TRANSLATION

Details

Meaning
Translation audit

Example
THIS TRANSLATION AUDITS...

Grounds
[model:epistemology](REASONING.md#reasoning-model-epistemology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPOSITION

Details

Meaning
Document composition

Example
THIS COMPOSITION RENDERS...

Grounds
[model:pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## document_verb

Every PAG keyword record, with what grounds it and how it is checked.

### IS

Details

Meaning
Identity

Example
THIS INSTRUCTION IS...

Grounds
[mode:description](REASONING.md#reasoning-mode-description)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ENFORCES

Details

Meaning
Constraint

Example
THIS POLICY ENFORCES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXECUTES

Details

Meaning
Action

Example
THIS WORKFLOW EXECUTES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### HAS

Details

Meaning
Possession

Example
THIS AGENT HAS...

Grounds
[mode:description](REASONING.md#reasoning-mode-description)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PERFORMS

Details

Meaning
Behavior

Example
THIS AGENT PERFORMS...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROVIDES

Details

Meaning
Offering

Example
THIS CHECKLIST PROVIDES...

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### IMPLEMENTS

Details

Meaning
Realization

Example
THIS TEMPLATE IMPLEMENTS...

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DEFINES

Details

Meaning
Specification

Example
THIS PROTOCOL DEFINES...

Grounds
[mode:description](REASONING.md#reasoning-mode-description)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MANAGES

Details

Meaning
Control

Example
THIS AGENT MANAGES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COORDINATES

Details

Meaning
Orchestration

Example
THIS WORKFLOW COORDINATES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GENERATES

Details

Meaning
Creation

Example
THIS TEMPLATE GENERATES...

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RESOLVES

Details

Meaning
Resolution

Example
THIS DEBUG RESOLVES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FINDS

Details

Meaning
Discovery

Example
THIS DEBUG FINDS...

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FIXES

Details

Meaning
Correction

Example
THIS DEBUG FIXES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VERIFIES

Details

Meaning
Verification

Example
THIS VERIFICATION VERIFIES...

Grounds
[mode:proof](REASONING.md#reasoning-mode-proof)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CLASSIFIES

Details

Meaning
Classification

Example
THIS VERIFICATION CLASSIFIES...

Grounds
[mode:classification](REASONING.md#reasoning-mode-classification)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DISTILLS

Details

Meaning
Distillation

Example
THIS DISTILLATION DISTILLS...

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ABSTRACTS

Details

Meaning
Abstraction

Example
THIS DISTILLATION ABSTRACTS...

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ELIMINATES

Details

Meaning
Elimination

Example
THIS DISTILLATION ELIMINATES...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AUDITS

Details

Meaning
Audit

Example
THIS AUDIT AUDITS...

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### MEASURES

Details

Meaning
Measurement

Example
THIS AUDIT MEASURES...

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SCORES

Details

Meaning
Scoring

Example
THIS AUDIT SCORES...

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CORRECTS

Details

Meaning
Correction

Example
THIS TRANSLATION CORRECTS...

Grounds
[mode:intervention](REASONING.md#reasoning-mode-intervention)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RENDERS

Details

Meaning
Rendering

Example
THIS COMPOSITION RENDERS...

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPOSES

Details

Meaning
Composition

Example
THIS COMPOSITION COMPOSES...

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FOLDS

Details

Meaning
Folding

Example
THIS COMPOSITION FOLDS...

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## meta

Every PAG keyword record, with what grounds it and how it is checked.

### META

Details

Meaning
Metadata block

Example
%% META %%:

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### USE

Details

Meaning
Template usage

Example
USE TEMPLATE name

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TEMPLATE

Details

Meaning
Template reference

Example
USE TEMPLATE validation

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CUE

Details

Meaning
The one-line reminder a reader executes at a node

Example
@cue: "<reminder>"

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RECURSION_LIMIT

Details

Meaning
A bound on repair, declared in the meta block

Example
recursion_limit: <bound>

Grounds
[node:ter-diminishing-returns](REASONING.md#reasoning-node-ter-diminishing-returns)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PURPOSE

Details

Meaning
What a node decides, in one sentence

Example
@purpose: "<what this node decides>"

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AXIS_QUESTION

Details

Meaning
The question a node's axis asks

Example
@axis_question: "<the question>"

Grounds
[axis:ontology](REASONING.md#reasoning-axis-ontology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PRIORITY

Details

Meaning
The authority tiers · which source grounds which, highest first

Example
priority: <governing document> > <ontology> > <template> > <task>

Grounds
[invariant:epi-weakest-link](REASONING.md#reasoning-invariant-epi-weakest-link)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TRUST

Details

Meaning
What is trusted as evidence and what stays a claim

Example
trust: tool_output = TRUSTED, prior_knowledge = UNTRUSTED

Grounds
[node:ver-ground-truth](REASONING.md#reasoning-node-ver-ground-truth)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### JURISDICTION

Details

Meaning
What the document may touch, and what is declared outside it

Example
jurisdiction: <in scope> | external: <declared outside>

Grounds
[axis:ontology](REASONING.md#reasoning-axis-ontology), [invariant:epi-reachable-check](REASONING.md#reasoning-invariant-epi-reachable-check)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## validation

Every PAG keyword record, with what grounds it and how it is checked.

### ASSERT

Details

Meaning
Hard assertion

Example
ASSERT condition

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REQUIRE

Details

Meaning
Prerequisite check

Example
REQUIRE dependency

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### HANDOFF

Details

Meaning
Gate marker · the evidence-bearing gate that closes a node

Example
HANDOFF GATE (evidence-bearing):

Grounds
[node:ter-stop](REASONING.md#reasoning-node-ter-stop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GATE

Details

Meaning
Checkpoint marker

Example
HANDOFF GATE:

Grounds
[node:ter-stop](REASONING.md#reasoning-node-ter-stop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CHECK

Details

Meaning
A check in a gate · a claim about the output with the evidence that settles it

Example
[check] <claim> (evidence: <what settles it>)

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### POPULATION

Details

Meaning
The set a check ranges over, measured · zero of zero is not evidence

Example
over: <set> measured: <n> / <N>

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population), [invariant:epi-declared-domain](REASONING.md#reasoning-invariant-epi-declared-domain)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REFUSE

Details

Meaning
Where a node refuses to continue · named before the irreversible write

Example
refuse: <condition> before <write>

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FRESHNESS

Details

Meaning
The fingerprints an artifact was derived from · a semantic property, never a timestamp

Example
freshness: <inputs fingerprint> +

Grounds
[node:ver-freshness](REASONING.md#reasoning-node-ver-freshness), [invariant:epi-fresh-read](REASONING.md#reasoning-invariant-epi-fresh-read)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### STANDING

Details

Meaning
Whether the read set moved beneath the verdict · a non-empty moved set withdraws the standing, never the verdict

Example
standing: moved-set <set>

Grounds
[node:ver-standing](REASONING.md#reasoning-node-ver-standing)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### UNKNOWN

Details

Meaning
The third verdict · an unmeasured or unevidenced claim, never a pass

Example
unknown → BLOCKED

Grounds
[node:ver-confidence](REASONING.md#reasoning-node-ver-confidence), [node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BLOCKED

Details

Meaning
The closure of an unknown or an unanswered decision · external input is owed

Example
result: ... | unknown → BLOCKED

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROMOTE

Details

Meaning
Move a candidate into accepted state · only on a clean verdict, never on production

Example
promote: <candidate> ON clean verdict

Grounds
[node:ter-promotion](REASONING.md#reasoning-node-ter-promotion)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PUBLISH

Details

Meaning
Cross the boundary to the external system · the party that crosses it is named

Example
publish: <artifact> BY <party>

Grounds
[node:ter-publication](REASONING.md#reasoning-node-ter-publication)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RESULT

Details

Meaning
The result line · the next node on pass, the repair owner on failure, blocked on unknown

Example
result: pass → NODE <n+1> | <failure> → REPAIR (owner: <node>) | unknown → BLOCKED

Grounds
[node:ver-refutation](REASONING.md#reasoning-node-ver-refutation), [node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REPAIR

Details

Meaning
The repair edge · re-enters at the earliest node that can supply the missing evidence

Example
REPAIR (owner: NODE <n>)

Grounds
[node:ver-refutation](REASONING.md#reasoning-node-ver-refutation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### RULE_ID

Details

Meaning
The gate's identity, the node it closes

Example
rule_id: "<NODE NAME>"

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## report

Every PAG keyword record, with what grounds it and how it is checked.

### SUBJECT

Details

Meaning
The node or stage the report is about

Example
subject: <node>

Grounds
[axis:ontology](REASONING.md#reasoning-axis-ontology)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VERDICT

Details

Meaning
The value returned · pass, fail or unknown

Example
verdict: pass | fail | unknown

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence), [invariant:epi-verdict-is-representation](REASONING.md#reasoning-invariant-epi-verdict-is-representation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### DOMAIN

Details

Meaning
The population declared and the population measured

Example
domain: declared <N> measured <n>

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### POPULATIONS

Details

Meaning
The partitions, each measured · their sum is the whole

Example
populations: <part> <n>, <part> <n>

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### INPUTS

Details

Meaning
The inputs read, by identity and fingerprint

Example
inputs: <identity> <fingerprint>

Grounds
[node:ver-freshness](REASONING.md#reasoning-node-ver-freshness)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CODE

Details

Meaning
The fingerprint of the code that produced the verdict

Example
code: <fingerprint>

Grounds
[node:ver-freshness](REASONING.md#reasoning-node-ver-freshness)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OUTPUT

Details

Meaning
The artifact written, by identity and fingerprint

Example
output: <identity> <fingerprint>

Grounds
[node:ver-freshness](REASONING.md#reasoning-node-ver-freshness)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REFUSALS

Details

Meaning
How many times the stage refused, and why

Example
refusals: <n> [<reason>]

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OBSERVED

Details

Meaning
What runtime observation located, kept apart from the verdict

Example
observed: <n> [<location>]

Grounds
[node:ver-observation](REASONING.md#reasoning-node-ver-observation), [invariant:epi-observation-locates](REASONING.md#reasoning-invariant-epi-observation-locates)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### UNRESOLVED

Details

Meaning
What stays open, and why

Example
unresolved: <n> [<reason>]

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPLETION

Details

Meaning
Saturated, complete and verified · the three that must coincide

Example
completion: saturated <bool> complete <bool> verified <bool>

Grounds
[node:ter-stop](REASONING.md#reasoning-node-ter-stop), [node:ter-saturation](REASONING.md#reasoning-node-ter-saturation), [node:ter-completion](REASONING.md#reasoning-node-ter-completion), [invariant:epi-terminate-on-three](REASONING.md#reasoning-invariant-epi-terminate-on-three)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## invariant

Every PAG keyword record, with what grounds it and how it is checked.

### INVARIANT

Details

Meaning
The record head · a property the topology relies on, with its set, its parties and its objector

Example
INVARIANT <name>: <property> over: <set> binds: <parties> objector: <check | none>

Grounds
[substrate-node:invariant](REASONING.md#reasoning-substrate-node-invariant), [invariant:epi-reachable-check](REASONING.md#reasoning-invariant-epi-reachable-check)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PROPERTY

Details

Meaning
The property, in a form that could be false

Example
INVARIANT one-writer: a record has exactly one writer ...

Grounds
[substrate-node:invariant](REASONING.md#reasoning-substrate-node-invariant)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OVER

Details

Meaning
The set the property quantifies over

Example
over: every record on the surface

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BINDS

Details

Meaning
The parties the property constrains · who must receive it

Example
binds: every party writing there

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OBJECTOR

Details

Meaning
What would disagree if the property stopped holding · a check, or none as declared debt

Example
objector: [check] one open fence per record | none

Grounds
[node:ver-falsification](REASONING.md#reasoning-node-ver-falsification)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## node

Every PAG keyword record, with what grounds it and how it is checked.

### NODE

Details

Meaning
A node header · the unit of a document, one decision, one gate

Example

# NODE <n> — <NAME> [<layer> · <axis> · <math type> · yields: <shape>]

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CONTRACT

Details

Meaning
A node's contract · input, transform, constraints, output, handoff

Example
CONTRACT:

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### YIELDS

Details

Meaning
The shape a node's decision resolves to

Example
yields: <set | boolean | edge-list | ranking | procedure | artifact>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### GENESIS

Details

Meaning
The substrate stage the node's artifact comes to be at · phase order follows it

Example
@genesis: <existence | difference | relation | structure | transformation | constraint | emergence>

Grounds
[substrate-node:existence](REASONING.md#reasoning-substrate-node-existence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PRESERVES

Details

Meaning
The distinctions a transform keeps · a lowering names what a later check needs

Example
preserves: <distinction>, <distinction>

Grounds
[invariant:epi-preserved-distinction](REASONING.md#reasoning-invariant-epi-preserved-distinction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### OUTPUT_CONTRACT

Details

Meaning
The one record the next node reads, as an assignment

Example

# OUTPUT CONTRACT

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### LIMIT

Details

Meaning
A declared limit · stated where a reader would otherwise assume the opposite

Example
LIMIT <name>: "<what the document cannot do>"

Grounds
[substrate-node:constraint](REASONING.md#reasoning-substrate-node-constraint)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SLOT

Details

Meaning
A slot's state · resolved, absent or deferred, declared by the adapter

Example
SLOT {<namespace>.<name>}: RESOLVED | ABSENT | DEFERRED

Grounds
[node:for-absence](REASONING.md#reasoning-node-for-absence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## semantic_operation

Every PAG keyword record, with what grounds it and how it is checked.

### DISCOVER_RESOURCES

Details

Meaning
Find resources by pattern · the adapter maps GLOB to it

Example
DISCOVER_RESOURCES "<pattern>" INTO <resources>

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### READ_RESOURCE

Details

Meaning
Read one resource · the adapter maps READ to it

Example
READ_RESOURCE <resource> INTO <content>

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### SEARCH_CONTENT

Details

Meaning
Search content for a term · the adapter maps GREP to it

Example
SEARCH_CONTENT <content> FOR <term> INTO <matches>

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### ANALYZE_CONTENT

Details

Meaning
Analyze content against criteria

Example
ANALYZE_CONTENT <content> AGAINST <criteria> INTO <findings>

Grounds
[mode:observation](REASONING.md#reasoning-mode-observation)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXTRACT_FACTS

Details

Meaning
Isolate fields from content, preserving its meaning

Example
EXTRACT_FACTS <fields> FROM <content> INTO <facts>

Grounds
[mode:abstraction](REASONING.md#reasoning-mode-abstraction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CALCULATE_METRIC

Details

Meaning
Derive a measure from facts

Example
CALCULATE_METRIC <measure> FROM <facts> INTO <value>

Grounds
[mode:comparison](REASONING.md#reasoning-mode-comparison)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### COMPOSE_ARTIFACT

Details

Meaning
Compose an artifact from facts using a shape

Example
COMPOSE_ARTIFACT <artifact> FROM <facts> USING <shape>

Grounds
[mode:construction](REASONING.md#reasoning-mode-construction)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### VALIDATE_ARTIFACT

Details

Meaning
Validate an artifact against a schema

Example
VALIDATE_ARTIFACT <artifact> AGAINST <schema>

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### PERSIST_ARTIFACT

Details

Meaning
Persist an artifact to a destination · the adapter maps WRITE and EDIT to it; a refusal is named before it

Example
PERSIST_ARTIFACT <artifact> TO <destination>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization), [node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### EXECUTE_TOOL

Details

Meaning
Execute a command with a bound · the adapter maps BASH to it

Example
EXECUTE_TOOL <command> WITH timeout: <bound> INTO <result>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REQUEST_DECISION

Details

Meaning
Ask a party to decide · the adapter maps ASK_USER to it, and resolves it absent for a bounded reader

Example
REQUEST_DECISION <party> WITH options: [, **] INTO ** **<choice>**

Grounds
[node:tel-priority](REASONING.md#reasoning-node-tel-priority), [node:ter-publication](REASONING.md#reasoning-node-ter-publication)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### REPORT_RESULT

Details

Meaning
Report an artifact to the parties whose next work it creates

Example
REPORT_RESULT <artifact> TO <parties>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## contextual

Every PAG keyword record, with what grounds it and how it is checked.

### INTO

Details

Meaning
Destination

Example
READ file INTO data

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FROM

Details

Meaning
Source

Example
EXTRACT FROM response

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WITH

Details

Meaning
Association

Example
EXECUTE WITH params

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### USING

Details

Meaning
Instrument

Example
VALIDATE USING schema

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### FOR

Details

Meaning
Purpose/Iteration

Example
SEARCH FOR pattern

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### IN

Details

Meaning
Containment

Example
FIND key IN object

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### TO

Details

Meaning
Target

Example
WRITE TO file

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AS

Details

Meaning
Alias/Role

Example
BIND result AS alias

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BETWEEN

Details

Meaning
Range

Example
value BETWEEN 1 AND 10

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### AGAINST

Details

Meaning
Comparison target

Example
VALIDATE AGAINST schema

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### BASED_ON

Details

Meaning
Foundation

Example
CREATE BASED_ON template

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WITHOUT

Details

Meaning
Exclusion

Example
EXECUTE WITHOUT logging

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### WHERE

Details

Meaning
Filter condition

Example
FIND WHERE x > 0

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### CONTENT

Details

Meaning
Data marker

Example
WRITE CONTENT data

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### NOT

Details

Meaning
Negation

Example
NOT condition

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

### STYLE

Details

Meaning
Formatting

Example
STYLE output

How it is checked

Checked by
a structured-document validator that parses each document against the grammar and reports every defect by its shape

Population
Every agent and template document the validator walks, and every occurrence of the keyword in them

Freshness
A verdict stands until the grammar data or a document that uses the keyword changes

Refusal
The validation stage fails the gate on any defect code, so a document with a malformed keyword does not ship

Observation
None, because a keyword is static text in a document, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: a suite plants a retired head in a real template and validates every agent and template on disk clean

Authoritative side
The grammar data, which every keyword in a document conforms to

Depends on
Not answered

Shape it refuses
Not answered

## planning

Every PAG production record, with what grounds it and how it is checked.

### instruction

Details

Rule
<frontmatter> <optional_meta_block> <optional_document_declaration> <body>

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### frontmatter

Details

Rule
"---" <yaml_content> "---"

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### document_declaration

Details

Rule
"THIS" <document_type> <document_verb> <description>

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### meta_block

Details

Rule
"%%" "META" "%%" ":" <meta_field>+

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### meta_field

Details

Rule
"objective:" <string> | "priority:" <authority_chain> | "trust:" <trust_clause> | "jurisdiction:" <scope> "|" "external:" <scope> | "recursion_limit:" <bound>

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective), [invariant:epi-reachable-check](REASONING.md#reasoning-invariant-epi-reachable-check)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### body

Details

Rule
<node>+ <repair_edge>* <optional_invariant_block> <optional_report_block>

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### node

Details

Rule
<node_header> <node_meta_tag>* <contract> <optional_output_contract> <handoff_gate>

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### node_header

Details

Rule
"#" "NODE" <node_number> "—" <node_title> "[" <layer> "·" <axis> "·" <math_type> "·" "yields:" <shape> "]"

Grounds
[axis:ontology](REASONING.md#reasoning-axis-ontology)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### node_meta_tag

Details

Rule
"@purpose:" <string> | "@axis_question:" <string> | "@cue:" <string> | "@genesis:" <substrate_stage> | "@mandatory"

Grounds
[node:tel-objective](REASONING.md#reasoning-node-tel-objective), [substrate-node:existence](REASONING.md#reasoning-substrate-node-existence)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### contract

Details

Rule
"CONTRACT:" "input:" <contract_input> "transform:" <directive>+ <optional_preserves> <optional_constraints> "output:" <contract_output> <optional_freshness> <optional_handoff_summary>

Grounds
[loop:derivation-loop](REASONING.md#reasoning-loop-derivation-loop)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### preserves_clause

Details

Rule
"preserves:" <distinction_set>

Grounds
[invariant:epi-preserved-distinction](REASONING.md#reasoning-invariant-epi-preserved-distinction)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### freshness_clause

Details

Rule
"freshness:" <fingerprint> "+" <fingerprint>

Grounds
[node:ver-freshness](REASONING.md#reasoning-node-ver-freshness)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### handoff_gate

Details

Rule
"HANDOFF" "GATE" <optional_gate_qualifier> ":" <optional_rule_id> <check_line>+ <optional_refusal_line> <optional_standing_line> <result_line>

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### check_line

Details

Rule
<check_marker> <check_condition> "(evidence:" <check_evidence> ")" <optional_population_clause>

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### check_marker

Details

Rule
"[check]" | "ASSERT" | "REQUIRE"

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### population_clause

Details

Rule
"over:" <set> "measured:" <count> "/" <count>

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### refusal_line

Details

Rule
"refuse:" <condition> "before" <write>

Grounds
[node:ver-refusal](REASONING.md#reasoning-node-ver-refusal)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### standing_line

Details

Rule
"standing:" "moved-set" <set>

Grounds
[node:ver-standing](REASONING.md#reasoning-node-ver-standing)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### result_line

Details

Rule
"result:" "pass" <arrow> <next_node> ("|" <failure_name> <arrow> "REPAIR" "(owner:" <owner_node> ")")+ "|" "unknown" <arrow> "BLOCKED"

Grounds
[node:ver-refutation](REASONING.md#reasoning-node-ver-refutation), [node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### arrow

Details

Rule
"→" | "->"

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### repair_edge

Details

Rule
"#" "REPAIR" "EDGE" <description>

Grounds
[node:ver-refutation](REASONING.md#reasoning-node-ver-refutation)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### invariant_block

Details

Rule
"#" "CROSS-NODE" "INVARIANTS" <invariant_record>+

Grounds
[substrate-node:invariant](REASONING.md#reasoning-substrate-node-invariant)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### invariant_record

Details

Rule
"INVARIANT" <name> ":" <property> "over:" <set> "binds:" <parties> "objector:" (<check_ref> | "none")

Grounds
[substrate-node:invariant](REASONING.md#reasoning-substrate-node-invariant), [node:ver-falsification](REASONING.md#reasoning-node-ver-falsification)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### report_block

Details

Rule
"REPORT" ":" <report_field>+

Grounds
[node:ver-evidence](REASONING.md#reasoning-node-ver-evidence), [invariant:epi-verdict-is-representation](REASONING.md#reasoning-invariant-epi-verdict-is-representation)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### report_field

Details

Rule
"subject:" <node_ref> | "verdict:" <verdict> | "domain:" "declared" <count> "measured" <count> | "populations:" <partition_list> | "inputs:" <fingerprint_list> | "code:" <fingerprint> | "output:" <fingerprint> | "refusals:" <count> <reason_list> | "observed:" <count> <location_list> | "unresolved:" <count> <reason_list> | "completion:" "saturated" <boolean> "complete" <boolean> "verified" <boolean>

Grounds
[node:ver-population](REASONING.md#reasoning-node-ver-population), [node:ver-freshness](REASONING.md#reasoning-node-ver-freshness), [node:ver-observation](REASONING.md#reasoning-node-ver-observation), [node:ter-stop](REASONING.md#reasoning-node-ter-stop)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### verdict

Details

Rule
"pass" | "fail" | "unknown"

Grounds
[node:ver-confidence](REASONING.md#reasoning-node-ver-confidence)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

## coordination

Every PAG production record, with what grounds it and how it is checked.

### semantic_operation

Details

Rule
"DISCOVER_RESOURCES" | "READ_RESOURCE" | "SEARCH_CONTENT" | "ANALYZE_CONTENT" | "EXTRACT_FACTS" | "CALCULATE_METRIC" | "COMPOSE_ARTIFACT" | "VALIDATE_ARTIFACT" | "PERSIST_ARTIFACT" | "EXECUTE_TOOL" | "REQUEST_DECISION" | "REPORT_RESULT"

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### tool_invocation

Details

Rule
<semantic_operation> <tool_target> <optional_tool_param_clause> <optional_tool_result_clause>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### tool_result_clause

Details

Rule
<arrow> <tool_result_binding> | "INTO" <tool_result_binding> | "AS" <tool_result_binding>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### state_machine_declaration

Details

Rule
"STATE_MACHINE" <machine_name> ":" <state_definition>+ <transition_definition>+

Grounds
[representation:dynamical-systems](REASONING.md#reasoning-representation-dynamical-systems)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### dag_declaration

Details

Rule
"DAG" <dag_name> ":" <dag_item>+

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph), [invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### priority_queue_declaration

Details

Rule
"PRIORITY_QUEUE" <queue_name> <optional_comparison> ":"

Grounds
[node:tel-priority](REASONING.md#reasoning-node-tel-priority)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### flowchart_declaration

Details

Rule
"FLOWCHART" <flow_name> ":" <optional_layout> <flow_item>+

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph), [axis:representation](REASONING.md#reasoning-axis-representation)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### surface_declaration

Details

Rule
"SURFACE" <surface_key> ":" <record_declaration>+

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### record_declaration

Details

Rule
"RECORD" <record_id> "subject:" <subject_key> <edge_clause>*

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### edge_clause

Details

Rule
<edge_kind> <target_id>

Grounds
[invariant:epi-declared-dependency](REASONING.md#reasoning-invariant-epi-declared-dependency)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### edge_kind

Details

Rule
"PARENT" | "SATISFIED_BY" | "BLOCKS" | "ANSWERS" | "REFUTES" | "SUPERSEDES"

Grounds
[representation:graph](REASONING.md#reasoning-representation-graph)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### wait_statement

Details

Rule
"WAIT" "ON" <surface_key> "AS" <reader> "INTO" <diff_binding>

Grounds
[node:ter-block](REASONING.md#reasoning-node-ter-block)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

## statement

Every PAG production record, with what grounds it and how it is checked.

### directive

Details

Rule
<optional_task_marker> <optional_meta_tag> <optional_context_cue> <directive_body>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### action_expr

Details

Rule
<action_verb> <modifier>* <action_target> <optional_action_args>

Grounds
[axis:formalization](REASONING.md#reasoning-axis-formalization)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### if_statement

Details

Rule
"IF" <condition> ":" <directive>+ ("ELSE" "IF" <condition> ":" <directive>+)* <optional_else_clause>

Grounds
[representation:logic](REASONING.md#reasoning-representation-logic)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### for_loop

Details

Rule
"FOR" "EACH" <iterator> "IN" <collection> ":" <directive>+

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### try_catch

Details

Rule
"TRY" ":" <directive>+ "CATCH" <optional_exception_var> ":" <directive>+

Grounds
[representation:computation](REASONING.md#reasoning-representation-computation)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

### declaration_statement

Details

Rule
"SET" <variable_name> "=" <expression> | "DECLARE" <variable_name> ":" <type_annotation>

Grounds
[representation:symbolic](REASONING.md#reasoning-representation-symbolic)

How it is checked

Checked by
the grammar integrity check, which resolves every nonterminal a production references and every declared terminal

Population
Every production and every terminal the grammar declares

Freshness
A verdict stands until a production or the terminal list changes

Refusal
The ontology resolution gate fails on a dangling nonterminal or an unused terminal

Observation
None, because the productions describe document shape and are never executed

Evidence
Watched to fire and to accept: a suite plants a dangling nonterminal and an unused terminal, and passes a grammar whose every reference resolves

Authoritative side
The production and terminal lists, which every reference in a right-hand side resolves to

Depends on
Not answered

Shape it refuses
Not answered

## Document types

Every PAG document type record, with what grounds it and how it is checked.

### AGENT

- Default verb: PERFORMS
- Model: [cognition](REASONING.md#reasoning-model-cognition)
- Axis: [reasoning](REASONING.md#reasoning-axis-reasoning)

Details

Purpose
Agent behavior definition

Verbs
PERFORMS, HAS, MANAGES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### WORKFLOW

- Default verb: EXECUTES
- Model: [cognition](REASONING.md#reasoning-model-cognition)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Multi-phase process orchestration

Verbs
EXECUTES, COORDINATES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### PROTOCOL

- Default verb: DEFINES
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Standard operating procedures

Verbs
DEFINES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### POLICY

- Default verb: ENFORCES
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [teleology](REASONING.md#reasoning-axis-teleology)

Details

Purpose
Constraint and rule system

Verbs
ENFORCES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### CHECKLIST

- Default verb: PROVIDES
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Task tracking with validation

Verbs
PROVIDES, GENERATES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### TEMPLATE

- Default verb: IMPLEMENTS
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [representation](REASONING.md#reasoning-axis-representation)

Details

Purpose
Reusable document pattern

Verbs
IMPLEMENTS, GENERATES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### TASK

- Default verb: EXECUTES
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Single-objective operation

Verbs
EXECUTES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### INSTRUCTION

- Default verb: IS
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
General guidance document

Verbs
IS

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### PROMPT

- Default verb: IS
- Model: [cognition](REASONING.md#reasoning-model-cognition)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Model interaction template

Verbs
IS

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### COMMAND

- Default verb: EXECUTES
- Model: [cognition](REASONING.md#reasoning-model-cognition)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Executable command

Verbs
EXECUTES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### TEST

- Default verb: PERFORMS
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [verification](REASONING.md#reasoning-axis-verification)

Details

Purpose
Test specification

Verbs
PERFORMS

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### DEBUG

- Default verb: RESOLVES
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [analysis](REASONING.md#reasoning-axis-analysis)

Details

Purpose
Evidence-gated root-cause debugging process

Verbs
RESOLVES, FINDS, FIXES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### VERIFICATION

- Default verb: PERFORMS
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [verification](REASONING.md#reasoning-axis-verification)

Details

Purpose
Forensic claim-versus-evidence adjudication process

Verbs
PERFORMS, VERIFIES, CLASSIFIES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### DISTILLATION

- Default verb: DISTILLS
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [reasoning](REASONING.md#reasoning-axis-reasoning)

Details

Purpose
Base abstraction drawn from behavioral evidence, with the duplicates proven gone

Verbs
DISTILLS, ABSTRACTS, ELIMINATES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### AUDIT

- Default verb: AUDITS
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [verification](REASONING.md#reasoning-axis-verification)

Details

Purpose
Universal-contract agent audit with non-destructive correction

Verbs
AUDITS, MEASURES, SCORES

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### TRANSLATION

- Default verb: AUDITS
- Model: [epistemology](REASONING.md#reasoning-model-epistemology)
- Axis: [representation](REASONING.md#reasoning-axis-representation)

Details

Purpose
Line-by-line translation audit with four adversarial gates

Verbs
AUDITS, VERIFIES, CORRECTS

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

### COMPOSITION

- Default verb: RENDERS
- Model: [pattern-cycle](REASONING.md#reasoning-model-pattern-cycle)
- Axis: [formalization](REASONING.md#reasoning-axis-formalization)

Details

Purpose
Writing-structure generator built from anchors, modifiers and transforms

Verbs
RENDERS, COMPOSES, FOLDS

How it is checked

Checked by
the document-type recognition check, which matches each type and its verbs to the keyword vocabulary and resolves its model and axis

Population
Every document type the grammar declares, and every document that declares one

Freshness
A verdict stands until the type list, the keyword vocabulary or the reasoning models change

Refusal
The ontology resolution gate fails on an unrecognized type or verb, or a type with no resolvable model or axis

Observation
None, because a document type is declared text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a type and a verb absent from the keyword vocabulary, another plants a type with no model or axis, and both pass a covered type

Authoritative side
The keyword vocabulary and the reasoning models, which a document type cites

Depends on
Not answered

Shape it refuses
Not answered

## Templates

Every PAG template record, with what grounds it and how it is checked.

### Agent Meta-Template

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, no_autonomous_spawn

Slots

AGENT_NAME
kebab-case agent name (string, required)

PRIMARY_PURPOSE
one-line statement of what the agent does (string, required)

AGENT_DESCRIPTION
the agent's intent (string, required)

OBJECTIVE
measurable success criteria (string, required)

DOMAIN_SCOPE
the target the agent reads/investigates (string, required)

PRIMARY_ACTION
the per-item action verb phrase (string, required)

SUCCESS_CRITERIA
what the result is validated against (string, required)

Template body

```pag
---
name: {AGENT_NAME}
type: AGENT
version: 1.0.0
---

THIS AGENT PERFORMS {PRIMARY_PURPOSE}

%% META %%:
intent: "{AGENT_DESCRIPTION}"
objective: "{OBJECTIVE}"
jurisdiction: {DOMAIN_SCOPE} | external: everything the scope does not name
recursion_limit: 2

# NODE 1 — DISCOVERY   [epistemic · ontology · set-theory · yields: set]
@purpose: "read the scope before claiming anything about it"
@genesis: existence
CONTRACT:
input:     {DOMAIN_SCOPE}
transform: READ_RESOURCE {DOMAIN_SCOPE} INTO context; ANALYZE_CONTENT context FOR patterns INTO findings
output:    findings
HANDOFF GATE (evidence-bearing):
[check] context read from {DOMAIN_SCOPE} (evidence: the read returned content) over: {DOMAIN_SCOPE} measured: <read> / <declared>
[check] findings populated (evidence: a count above zero)
[check] every finding names its source in context (evidence: no finding with an empty source)
result: pass → NODE 2 | empty → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — EXECUTION   [epistemic · formalization · computation · yields: procedure]
@purpose: "act on every finding, once, with the evidence of each act recorded"
@genesis: transformation
CONTRACT:
input:     findings from NODE 1
transform: FOR EACH item IN findings: EXECUTE_TOOL {PRIMARY_ACTION} WITH item INTO outcome; APPEND outcome TO outcomes
output:    outcomes
HANDOFF GATE:
[check] one outcome per finding (evidence: the two counts match) over: findings measured: <acted> / <findings>
[check] no outcome rests on an assumption (evidence: every outcome cites the finding it acted on)
[check] findings unchanged (evidence: a witness read)
refuse: a finding whose source cannot be re-read before EXECUTE_TOOL
result: pass → NODE 3 | mismatch → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 3 — VERIFICATION   [evaluative · verification · logic · yields: artifact]
@purpose: "validate the outcomes against the criteria and report to the parties whose next work they create"
@genesis: constraint
CONTRACT:
input:     outcomes from NODE 2
transform: VALIDATE_ARTIFACT outcomes AGAINST {SUCCESS_CRITERIA} INTO verdict; REPORT_RESULT verdict TO <the parties whose next work it creates>
output:    verdict
freshness: fingerprint(outcomes) + fingerprint(this document)
HANDOFF GATE:
[check] outcomes validated against {SUCCESS_CRITERIA} (evidence: the validator's report) over: outcomes measured: <validated> / <outcomes>
[check] verdict reported (evidence: the report)
[check] no residual failure (evidence: zero failing outcomes in the report)
standing: moved-set none
result: pass → TERMINATE | residual → REPAIR (owner: NODE 2) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT read-before-write: a node reads its input before it writes anything over: every node binds: the agent objector: [check] context read at NODE 1
INVARIANT one-gate-per-node: a node hands off through exactly one evidence-bearing gate over: every node binds: the agent objector: [check] result line present
INVARIANT no-spawn: no autonomous party is spawned over: every node binds: the agent objector: none

REPORT:
subject: NODE 3
verdict: pass | fail | unknown
domain: declared <outcomes> measured <validated>
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Agent Audit Meta-Template (universal-contract scoring + non-destructive correction generator)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, probe_by_capability_not_os_string, dimensions_weighted_by_worth_correction_scope_by_utility_minus_cost, deprecation_flagged_only_after_oracle_or_evidence, every_dimension_counted_and_thresholded_no_subjective_pass, external_correction_archived_and_verified_first, corrections_single_path_no_replacement_stub, corrected_artifact_re_audited_not_assumed_fixed, score_is_number_against_threshold, unknown_is_not_pass

Slots

project.agent_registry
the host agent registry discovered at orientation (string, required)

project.governance_sources
the host governance sources the contract is measured against (string, required)

project.reasoning_oracle
the reasoning oracle consulted to confirm a suspected deprecation (string, optional)

self.definition
this agent's own definition, the default target in self-audit mode (string, required)

target_agent
the agent under audit (a specified target, or self.definition) (string, required)

convention.dsl_min
the minimum count of PAG DSL and semantic-operation markers (string, required)

convention.embodiment_threshold
the minimum embodiment-marker fraction (string, required)

convention.audit_pass_threshold
the overall score at or above which the agent is compliant (string, required)

convention.audit_workspace
the workspace the persisted audit record is written to (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: AUDIT
version: 1.0.0
---

THIS AUDIT AUDITS a target agent against the universal agent contract, counting every dimension against a threshold and applying bounded non-destructive corrections toward the contract.

%% META %%:
priority: EVIDENCE > UNIVERSAL_CONTRACT > TASK
trust: searched_evidence = TRUSTED, oracle_confirmation = TRUSTED, prior_knowledge = UNTRUSTED
objective: {target_agent}
jurisdiction: {target_agent} and {convention.audit_workspace} | external: every other agent in {project.agent_registry}
recursion_limit: 3

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: set]
@purpose: "load registries and governance, probe capabilities, and identify the target as self or specified before measuring"
@genesis: existence
CONTRACT:
input:     {target_agent}
transform: READ_RESOURCE {project.agent_registry} INTO registry; READ_RESOURCE {project.governance_sources} INTO governance; EXECUTE_TOOL <capability probes> WITH timeout: <bound> INTO capability; DETERMINE <the target: {target_agent} when specified, else {self.definition} in self-audit mode> INTO target; READ_RESOURCE target INTO content
constraints: probing is by capability, never by an operating-system string; registries resolve through the adapter
output:    frame
DECLARE frame: object
SET frame = {registry: registry, governance: governance, capability: capability, target: target, content: content, self_audit: <true when the target is this agent>}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] the registry and governance sources are loaded (evidence: frame.registry and governance) over: the governance sources measured: <read> / <declared>
[check] capabilities are probed and classified (evidence: frame.capability)
[check] the target is identified and its content read (evidence: frame.target and content)
refuse: a probe that would mutate the target before EXECUTE_TOOL
result: pass → NODE 2 | capability blocked → BLOCKED | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: ranking]
@purpose: "weight the contract dimensions by worth and choose the correction scope by utility minus cost before measuring"
@genesis: difference
@mandatory
CONTRACT:
input:     frame from NODE 1
transform: FOR EACH dimension IN <prohibitions, dsl, embodiment, portability, capability, grounding>: CALCULATE_METRIC impact on compliance FROM dimension INTO dimension.weight; FOR EACH scope IN <report-only, correct-critical, correct-all>: CALCULATE_METRIC compliance gain minus mutation risk FROM scope INTO scope.worth; RANK scopes BY worth
constraints: an external target is higher-risk than self; correct-all is never selected when only a critical dimension is worth the blast radius
output:    plan
DECLARE plan: object
SET plan = {weights: <one per dimension>, scope: <the argmax admissible scope, or report-only when capabilities are too limited>}
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] every dimension is weighted by worth (evidence: plan.weights) over: the contract dimensions measured: <weighted> / <dimensions>
[check] the scope is the argmax of compliance gain minus correction cost (evidence: the scope ranking)
[check] correct-all is not selected on a single critical dimension (evidence: the scope against the failing set)
result: pass → NODE 3 | no admissible scope → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 3 — CONTRACT   [epistemic · reasoning · logic · yields: set]
@purpose: "confirm domain currency by evidence and oracle for an external target, and activate each contract dimension with a counted, thresholded decision test"
@genesis: relation
CONTRACT:
input:     plan from NODE 2
transform: SEARCH_CONTENT <the target's domain best practice> FOR <suspected deprecations> INTO suspicions; FOR EACH suspicion IN suspicions: REQUEST_DECISION {project.reasoning_oracle} WITH options: [confirmed, refuted] INTO suspicion.verdict; FOR EACH dimension IN <the contract dimensions>: <bind its counted test and threshold: prohibitions at zero, dsl at {convention.dsl_min}, embodiment at {convention.embodiment_threshold}, portability at zero leaks, capability with graceful degradation, grounding with a verdict per claim>
constraints: a deprecation is flagged only after oracle or evidence confirmation; an unavailable oracle is disclosed as degraded, never assumed
output:    dimensions
DECLARE dimensions: array
SET dimensions = <each with a counted decision test, a threshold and its weight from NODE 2>
HANDOFF GATE (evidence-bearing):
rule_id: "CONTRACT"   yields: boolean
[check] every flagged deprecation carries an oracle or evidence confirmation (evidence: suspicions) over: suspicions measured: <confirmed or refuted> / <suspicions>
[check] every dimension binds a counted test and a threshold (evidence: dimensions)
[check] an unavailable oracle is disclosed as degraded (evidence: frame.capability)
result: pass → NODE 4 | unconfirmed flag → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 4 — MEASURE   [epistemic · formalization · computation · yields: number]
@purpose: "count every dimension against the agent content, never judge, and compute the weighted score and recommendation"
@genesis: transformation
CONTRACT:
input:     dimensions from NODE 3
transform: ORDER dimensions BY <verdict genesis then dependency>; FOR EACH dimension IN dimensions: CALCULATE_METRIC <its count> FROM frame.content INTO dimension.result; CALCULATE_METRIC weighted score FROM dimensions INTO score; DETERMINE <compliant at or above {convention.audit_pass_threshold}, else requires-correction> INTO recommendation
constraints: content matching is procedural; no dimension passes subjectively
output:    audit
DECLARE audit: object
SET audit = {results: <one counted, thresholded result per dimension>, score: score, recommendation: recommendation}
HANDOFF GATE (evidence-bearing):
rule_id: "MEASURE"   yields: boolean
[check] every dimension is measured with a count against its threshold (evidence: audit.results) over: dimensions measured: <counted> / <dimensions>
[check] the score is computed from the NODE 2 weights (evidence: the weighted sum)
[check] the recommendation is compliant or requires-correction (evidence: audit.recommendation)
result: pass → NODE 5 | subjective result → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 5 — CORRECT AND VERIFY   [evaluative · verification · logic + probability · yields: number]
@purpose: "gate any correction on admissibility, apply single-path corrections, re-measure, and judge the counted results"
@genesis: constraint
@mandatory
CONTRACT:
input:     audit from NODE 4
transform: COMPOSE_ARTIFACT corrections FROM <the failed dimensions within plan.scope> USING <remove a prohibited hit with no stub, replace a runtime leak with a semantic operation, strengthen a missing embodiment marker, replace a silent fallback with bounded recovery then fail-fast>; PERSIST_ARTIFACT <an archived copy of an external target> TO {convention.audit_workspace}; PERSIST_ARTIFACT corrections TO frame.target; CALCULATE_METRIC <the re-measured score> FROM frame.target INTO recheck
constraints: an external correction requires an archived and verified copy first; a correction that adds a fallback or a dual path is inadmissible; the corrected artifact is re-audited, never assumed fixed
output:    adjudication
DECLARE adjudication: object
SET adjudication = {corrections: corrections, recheck: recheck, refuter: <the count that would flip the verdict>, verdict: <pass when grounded and recheck meets the threshold>}
HANDOFF GATE (ver-stop gate):
rule_id: "VERIFY"   yields: boolean
[check] every dimension is counted and thresholded with no subjective pass (evidence: audit.results) over: dimensions measured: <counted> / <dimensions>
[check] every correction is single-path with no replacement stub and an external target was archived first (evidence: adjudication.corrections and the archive read back)
[check] a refuter is named and the recheck score meets {convention.audit_pass_threshold} (evidence: adjudication.refuter and recheck)
refuse: an external target with no verified archive, or a correction adding a fallback, before PERSIST_ARTIFACT
standing: moved-set <the target re-read since NODE 4>
result: pass → NODE 6 | recheck below threshold → REPAIR (owner: NODE 5) | unknown → BLOCKED

# NODE 6 — TERMINATE   [evaluative · termination · set-theory · yields: artifact]
@purpose: "persist the scored report deduplicated, name every limitation, and stop only on saturation and completion and verification"
@genesis: emergence
@mandatory
CONTRACT:
input:     adjudication from NODE 5
transform: COMPOSE_ARTIFACT report FROM {audit, adjudication} USING <the score, every dimension, the corrections, the limitations and the oracle consultations>; REDUCE report.entries TO <one per finding>; PERSIST_ARTIFACT report TO {convention.audit_workspace}; REPORT_RESULT report TO <the parties whose next work it creates>
constraints: exactly one terminal; a self-assessed done is not ter-stop
output:    report
freshness: fingerprint(adjudication) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] the report names the score, every dimension, the corrections and every limitation, deduplicated (evidence: report) over: dimensions measured: <reported> / <dimensions>
[check] success only when saturation and completion and verification all hold (evidence: the termination set)
[check] exactly one terminal and repair cycles within recursion_limit (evidence: report and the repair count)
refuse: a workspace destination that changed since it was read before PERSIST_ARTIFACT
result: pass → TERMINATE | integrity defect → REPAIR (owner: NODE 6) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT probe-by-capability: capability is probed, never inferred from an operating-system string over: every run binds: the auditor objector: [check] capabilities are probed at NODE 1
INVARIANT count-never-judge: every dimension passes by a count against a threshold, never subjectively over: dimensions binds: the auditor objector: [check] every dimension is measured with a count at NODE 4
INVARIANT confirm-before-flag: a deprecation is flagged only after oracle or evidence confirmation over: every flag binds: the auditor objector: [check] every flagged deprecation carries a confirmation at NODE 3
INVARIANT archive-before-mutate: an external target is archived and verified before any correction over: external targets binds: the auditor objector: [check] an external target was archived first at NODE 5
INVARIANT single-path: a correction deletes the offending path with no stub and no fallback over: corrections binds: the auditor objector: [check] every correction is single-path at NODE 5
INVARIANT re-audit-not-assume: a corrected artifact is re-measured, never assumed fixed over: corrections binds: the auditor objector: [check] the recheck score meets the threshold at NODE 5

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <dimensions> measured <counted>
populations: dimensions passing <n>, corrections applied <n>, oracle consultations <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Checklist Meta-Template (ten-node evidence-bearing generator)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, observe_before_plan, prior_knowledge_untrusted, worth_before_work, principle_activation_bound_to_validator, semantic_protocol_selection, genesis_orders_phases, four_d_graph_z_x_y_w, ripple_chains_named, unknown_is_not_pass, bounded_repair_from_earliest_node, deterministic_render, generation_vs_execution_gates_separate

Slots

project.governance_policy
host governance policy doc (always read) (string, required)

project.principle_ontology
host principle ontology — the authoritative principle catalog to resolve the full set from (string, required)

project.architecture_rules
host architecture rules doc (read for algorithm/protocol/pattern/decomposition/principle/contract tasks) (string, required)

project.design_guide
host design guide (read for style/token/layout/surface/ui tasks) (string, optional)

project.component_docs
host component docs (read for component/module/element/render/boundary tasks) (string, optional)

registry
the codebase's discovery/resolution registry (string, optional)

logger
the codebase's structured logger (string, optional)

limits.max_lines
per-unit line budget (string, optional)

limits.max_files
per-concern file budget (string, optional)

toolchain.build.execute
the blocking build command (string, required)

verify_cmd
the blocking verify command (string, required)

task_description
the raw task text (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: CHECKLIST
version: 1.0.0
---

THIS CHECKLIST GENERATES a dependency-ordered, evidence-bearing implementation checklist whose framing, worth, seeing, derivation, projection, formalization, admissibility, verification, commitment and termination are each produced and gated by the node that owns that decision.

%% META %%:
priority: {project.governance_policy} > {project.principle_ontology} > this template > {project.architecture_rules} > {task_description}
trust: tool_output = TRUSTED, prior_knowledge = UNTRUSTED
objective: {task_description}
jurisdiction: {task_description} and the tree the governing documents declare | external: every surface the governing documents do not name
recursion_limit: 3

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: entity-set + evidence]
@purpose: "establish authority, trust and current-system evidence by framing the task through the ontological dimensions"
@axis_question: "What is it?"
@genesis: existence
@cue: "OBSERVE_BEFORE_PLAN"
CONTRACT:
input:     {task_description}
transform: READ_RESOURCE {project.governance_policy} INTO policy; READ_RESOURCE {project.principle_ontology} INTO ontology; DISCOVER_RESOURCES <the artifacts the task names> INTO discovered; EXTRACT_FACTS change_relation FROM {task_description} INTO change
constraints: {project.architecture_rules} is read on an algorithm, protocol, pattern, decomposition, principle or contract task; {project.design_guide} on a style, token, layout, surface or ui task; {project.component_docs} on a component, module, element, render or boundary task; a dimension is walked only when relevant
output:    context_bundle
DECLARE context_bundle: object
SET context_bundle = {intent: change.requested_outcome, change_relation: change.change_relation, dimensions: <the relevant ontological dimensions>, sources: [policy, ontology], discovered: discovered, evidence: <every discovery with its source>, unresolved: change.ambiguity}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] core authority loaded (evidence: context_bundle.sources) over: the governing documents measured: <read> / <declared>
[check] change_relation resolved (evidence: change.change_relation is not unknown)
[check] every always-relevant dimension has a readout and the evidence inventory is non-empty (evidence: context_bundle.evidence)
result: pass → NODE 2 | missing authority → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: objective + branch-ranking]
@purpose: "resolve what the work is for, enumerate admissible branches, and gate on the highest-worth one before any seeing"
@axis_question: "What is it for?"   @mandatory
@genesis: difference
@cue: "WORTH_BEFORE_WORK"
CONTRACT:
input:     context_bundle from NODE 1
transform: ANALYZE_CONTENT context_bundle FOR candidate branches INTO branches; FOR EACH branch IN branches: CALCULATE_METRIC utility minus cost FROM branch INTO branch.worth; RANK branches BY worth
constraints: a branch is admissible only when it satisfies the change_relation and the hard constraints; the selected branch is the highest-worth admissible one
output:    teleology_bundle
DECLARE teleology_bundle: object
SET teleology_bundle = {objective: context_bundle.intent, branches: branches, selected: <the argmax admissible branch>}
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] objective stated (evidence: teleology_bundle.objective)
[check] an admissible branch exists (evidence: branches with admissible true) over: branches measured: <admissible> / <branches>
[check] selected is the argmax of utility minus cost (evidence: the ranking's first entry)
result: pass → NODE 3 | no admissible branch → REPAIR (owner: NODE 1) | selected is not argmax → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 3 — SEE   [epistemic · analysis · graph · yields: lens-set + analytic edges]
@purpose: "select the analytical lenses relevant to the selected branch and read the system through them"
@axis_question: "How is it to be seen?"
@genesis: relation
@cue: "SELECT_LENSES_BEFORE_DERIVING"
CONTRACT:
input:     teleology_bundle from NODE 2
transform: ANALYZE_CONTENT context_bundle.discovered AGAINST <each relevant lens> INTO observations; EXTRACT_FACTS relational edges FROM observations INTO relational_edges
output:    analysis_bundle
DECLARE analysis_bundle: object
SET analysis_bundle = {lenses: <the relevant lenses>, observations: observations, relational_edges: relational_edges}
HANDOFF GATE (evidence-bearing):
rule_id: "SEE"   yields: edge-list + boolean
[check] every active lens has an observation (evidence: observations) over: analysis_bundle.lenses measured: <observed> / <lenses>
[check] relational edges present where dependencies were discovered (evidence: relational_edges against discovered registrations)
[check] no observation is inferred from a name alone (evidence: every observation cites a read)
result: pass → NODE 4 | gap → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 4 — DERIVE   [epistemic · reasoning · logic · yields: principle and protocol truths]
@purpose: "activate the principles that govern the seen decision surfaces and select protocols by semantic fit"
@axis_question: "Why, and what follows?"
@genesis: relation
@cue: "DERIVE_FROM_EVIDENCE"
CONTRACT:
input:     analysis_bundle from NODE 3
transform: FOR EACH principle IN {project.principle_ontology}: ANALYZE_CONTENT analysis_bundle.observations AGAINST principle.activate_when INTO fit; APPEND {principle, fit, validator} TO active_principles; ANALYZE_CONTENT teleology_bundle.selected AGAINST <each protocol's use-when> INTO selected_protocols
constraints: every active principle binds a decision test and a validator; a protocol is selected by semantic fit, never by a trigger word; the verification protocol is always present
output:    derivation_bundle
DECLARE derivation_bundle: object
SET derivation_bundle = {active_principles: active_principles, selected_protocols: selected_protocols}
HANDOFF GATE (evidence-bearing):
rule_id: "DERIVE"   yields: boolean
[check] every active mandatory principle binds a validator (evidence: active_principles) over: active_principles measured: <bound> / <active>
[check] every selected protocol carries a semantic reason (evidence: selected_protocols.reason)
[check] the verification protocol is present (evidence: selected_protocols)
result: pass → NODE 5 | gap → REPAIR (owner: NODE 4) | unknown → BLOCKED

# NODE 5 — PROJECT   [epistemic · reasoning · logic · yields: 4D graph edge-list]
@purpose: "decompose into phases whose order is the substrate genesis of the artifacts, and project the dependency and ripple graph"
@axis_question: "What follows downstream?"
@genesis: structure
@cue: "DECOMPOSE_AS_GENESIS"
CONTRACT:
input:     derivation_bundle from NODE 4
transform: FOR EACH protocol IN derivation_bundle.selected_protocols: COMPOSE_ARTIFACT phase FROM protocol USING <its genesis stage>; APPEND phase TO phases; COMPOSE_ARTIFACT graph FROM phases USING <Z sequential, X lateral, Y diagonal, W propagation>; ORDER phases BY topological Z then genesis rank
constraints: a phase never depends on a later-genesis output than it produces; severity is metadata that routes failure, never an ordering axis; an empty W carries the evidence it was assessed
preserves: every relational edge from NODE 3
output:    phase_records
DECLARE phase_records: array
SET phase_records = <the ordered phases, each with its four axes and its genesis stage>
HANDOFF GATE (evidence-bearing):
rule_id: "PROJECT"   yields: edge-list + boolean
[check] the Z graph is acyclic and genesis-consistent (evidence: zero cycles, zero inversions) over: phase_records measured: <ordered> / <phases>
[check] every phase declares inputs, outputs, a genesis stage and all four axes (evidence: phase_records)
[check] order is dependency-topological then genesis with severity as metadata only (evidence: no severity grouping)
result: pass → NODE 6 | cycle or inversion → REPAIR (owner: NODE 5) | unknown → BLOCKED

# NODE 6 — ACT   [epistemic · formalization · computation · yields: task procedures]
@purpose: "formalize phases into atomic, target-specific tasks under binding execution constraints, with full ripple chains"
@axis_question: "What does it resolve to?"
@genesis: transformation
@cue: "FORMALISE_EXECUTABLE_TASKS"
CONTRACT:
input:     phase_records from NODE 5
transform: FOR EACH phase IN phase_records: COMPOSE_ARTIFACT tasks FROM phase USING <the task template of its verb>; FOR EACH task IN tasks: ANALYZE_CONTENT task FOR <the ripple dimensions> INTO task.ripple; APPEND task TO task_records
constraints: the host's patterns bind every step, dependency through {registry}, observability through {logger}, size within {limits.max_lines} and {limits.max_files}; a build or verify task runs {toolchain.build.execute} or {verify_cmd} as a blocking step; a ripple names entities, never counts
output:    task_records
DECLARE task_records: array
SET task_records = <atomic, target-specific tasks with an evidence contract and named ripple, numbered N.M.K>
HANDOFF GATE (evidence-bearing):
rule_id: "ACT"   yields: procedure + set-cardinality
[check] at least one task per phase (evidence: task_records against phase_records) over: phase_records measured: <with tasks> / <phases>
[check] every task is atomic and target-specific with an evidence contract (evidence: expected evidence per task)
[check] every task carries every ripple dimension with names (evidence: task.ripple)
result: pass → NODE 7 | non-atomic or missing ripple → REPAIR (owner: NODE 6) | unknown → BLOCKED

# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: admissibility boolean]
@purpose: "gate the formalized plan on admissibility before verification: still worth executing, still on the selected branch, within the hard limits"
@axis_question: "Is it still worth it, and is it allowed?"   @mandatory
@genesis: constraint
@cue: "ADMISSIBLE_BEFORE_VERIFY"
CONTRACT:
input:     task_records from NODE 6
transform: CALCULATE_METRIC realized cost FROM task_records INTO realised_cost; FOR EACH task IN task_records: ANALYZE_CONTENT task AGAINST teleology_bundle.selected INTO trace; COMPARE realised_cost AGAINST teleology_bundle.selected.cost
output:    admissibility
DECLARE admissibility: object
SET admissibility = {ok: <cost within budget and nothing off branch and no limit breached>, realised_cost: realised_cost, off_branch: <tasks that do not trace>, limit_breaches: <phases over a hard limit>}
HANDOFF GATE (teleology admissibility gate):
rule_id: "CONSTRAIN"   yields: boolean
[check] realized cost within the branch budget (evidence: realised_cost against the budget)
[check] every task traces to the selected branch (evidence: admissibility.off_branch empty) over: task_records measured: <on branch> / <tasks>
[check] no hard limit breached (evidence: admissibility.limit_breaches empty)
result: pass → NODE 8 | cost over budget or off branch → REPAIR (owner: NODE 2) | limit breach → REPAIR (owner: NODE 6) | unknown → BLOCKED

# NODE 8 — VERIFY   [evaluative · verification · logic + probability · yields: validation report]
@purpose: "judge the generated reasoning against evidence, falsification, confidence and semantic policy before commitment"
@axis_question: "Is it real?"   @mandatory
@genesis: constraint
@cue: "VERIFY_REASONING_NOT_IMPLEMENTATION"
CONTRACT:
input:     admissibility from NODE 7
transform: EXTRACT_FACTS material claims FROM {phase_records, task_records} INTO claims; FOR EACH claim IN claims: SEARCH_CONTENT context_bundle.evidence FOR claim.support INTO support; VALIDATE_ARTIFACT {phase_records, task_records} AGAINST <the validation suites> INTO findings
constraints: a claim is supported only with evidence, never by the absence of a contradiction; confidence is a number tested against a threshold; policy is semantic, never a substring ban; an unmeasured claim is unknown, and unknown is not pass
output:    validation_report
DECLARE validation_report: object
SET validation_report = {status: <pass, repair_required or blocked>, findings: findings, confidence: <the minimum claim confidence>, examined: context_bundle.evidence, unresolved: context_bundle.unresolved}
HANDOFF GATE (ver-stop gate):
rule_id: "VERIFY"   yields: boolean
[check] every finding names what it examined (evidence: findings carry evidence and a rule id)
[check] every material claim has non-empty evidence and a named refuter (evidence: claims) over: claims measured: <supported> / <claims>
[check] confidence is at or above the threshold (evidence: validation_report.confidence)
[check] status is pass with zero blocking findings (evidence: validation_report.findings)
standing: moved-set <the surfaces re-read since NODE 1>
result: pass → NODE 9 | repair_required → REPAIR (owner: <the earliest node named by a finding>) | unknown → BLOCKED

# REPAIR EDGE  (verify refutes back to the earliest invalid node, bounded by the recursion limit)
CONTRACT:
input:     validation_report.findings, or a failed admissibility
transform: FOR EACH finding IN findings: ORDER finding BY <the node order>; <re-run from the earliest owning node forward, invalidating every dependent record>
constraints: bounded by recursion_limit; severity orders the repairs among failures and never softens a verdict; a downstream record is never restored after an upstream repair
output:    repaired records at pass, or a blocked terminal with the remaining findings

# NODE 9 — COMMIT   [evaluative · representation · information-theory · yields: rendered artifact]
@purpose: "serialize only validated records into the one canonical representation, deduplicated, adding no new decision"
@axis_question: "How is it encoded?"
@genesis: emergence
@cue: "COMMIT_WITHOUT_NEW_DECISIONS"
CONTRACT:
input:     validation_report from NODE 8
transform: COMPOSE_ARTIFACT rendered FROM {context_bundle, teleology_bundle, phase_records, task_records, validation_report} USING <the checklist shape>; REDUCE rendered TO <one entry per phase and task>
constraints: rendering adds no architecture decision; identical content collapses to one representation; a future execution checkbox stays unchecked; every phase carries its genesis stage and its four axes
preserves: every ripple impact by name
output:    rendered
freshness: fingerprint(validation_report) + fingerprint(this document)
HANDOFF GATE (evidence-bearing):
rule_id: "COMMIT"   yields: hash + boolean
[check] no phase or task encoded twice (evidence: the deduplication pass) over: phase_records and task_records measured: <encoded once> / <records>
[check] no future execution checkbox pre-checked (evidence: a render scan)
[check] no architecture decision introduced at render (evidence: the rendering rules)
result: pass → NODE 10 | integrity defect → REPAIR (owner: NODE 9) | unknown → BLOCKED

# NODE 10 — TERMINATE   [evaluative · termination · set-theory · yields: artifact]
@purpose: "stop only on saturation and completion and verification; otherwise block on external input, never a self-assessed stop"
@axis_question: "Is it done?"   @mandatory
@genesis: emergence
@cue: "TERMINATE_EXPLICITLY"
CONTRACT:
input:     rendered from NODE 9
transform: VALIDATE_ARTIFACT rendered AGAINST <every phase and task once, contiguous numbering, no pre-checked execution box> INTO render_check; PERSIST_ARTIFACT rendered TO <{task_name} checklist>; REPORT_RESULT generation_result TO <the parties whose next work it creates>
constraints: exactly one terminal, success or blocked; ter-block routes to REQUEST_DECISION; a self-assessed done is not ter-stop
output:    generation_result
freshness: fingerprint(rendered) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] status is success or blocked and an output file is named (evidence: generation_result)
[check] success only when saturation and completion and verification all hold (evidence: the termination set) over: the termination set measured: <holding> / <three>
[check] repair cycles within recursion_limit (evidence: the repair count)
[check] no future execution checkbox pre-checked (evidence: render_check)
refuse: the destination changed since it was read before PERSIST_ARTIFACT
standing: moved-set <the surfaces re-read since NODE 8>
result: pass → TERMINATE | integrity defect → REPAIR (owner: NODE 9) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT ontology-before-teleology: authority, trust and the ontology of the change are resolved before its teleology, and both before any seeing over: every generation binds: the generator objector: [check] core authority loaded at NODE 1
INVARIANT four-gates-always: the worth, admissibility, evidence and termination gates run on every generation over: every generation binds: the generator objector: [check] status is success or blocked at NODE 10
INVARIANT typed-decisions: every decision resolves to its declared shape, a ranking never satisfied by a boolean over: every node binds: the generator objector: [check] selected is the argmax at NODE 2
INVARIANT genesis-order: a phase never depends on a later-genesis output than it produces over: phase_records binds: the generator objector: [check] the Z graph is acyclic and genesis-consistent at NODE 5
INVARIANT prior-output-only: a node reads only the prior node's output contract over: every node binds: the generator objector: [check] input names NODE n-1 or a declared variable
INVARIANT evidence-not-absence: a claim is supported only with evidence, never by the absence of a contradiction, and unknown is not pass over: every claim binds: the generator objector: [check] every material claim has non-empty evidence at NODE 8
INVARIANT repair-from-earliest: a failed gate repairs from the earliest owning node and never restores a downstream record over: every repair binds: the generator objector: [check] repair cycles within recursion_limit at NODE 10
INVARIANT generation-not-execution: a gate resolved while generating is separate from a gate that runs when the checklist is executed, and the latter ships unchecked over: every rendered gate binds: the generator objector: [check] no future execution checkbox pre-checked at NODE 10

REPORT:
subject: NODE 10
verdict: pass | fail | unknown
domain: declared <phase and task records> measured <encoded once>
populations: phases <n>, tasks <n>, claims supported <n>, claims unknown <n>
inputs: {task_description} <fingerprint>, {project.governance_policy} <fingerprint>, {project.principle_ontology} <fingerprint>
code: this document <fingerprint>
output: {task_name} checklist <fingerprint>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Writing Composition Meta-Template (anchor-modifier transform-algebra structure generator)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, space_injected_never_hardcoded, coordinate_resolves_in_space_one_anchor, coordinate_realizable_no_axis_conflict, ops_apply_in_precedence_order_do_not_commute, anchor_alone_owns_clause_order, closure_over_primitive_alphabet, every_facet_leaves_a_named_signature, at_most_one_repair_then_reject, unknown_is_not_pass

Slots

convention.space_schema
the injected SPACE: the facets, their values, each anchor value's skeleton, and each modifier value's op-list and signature (string, required)

style_request
the raw style request (a bundle-label, a partial coordinate, or a free description) (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: COMPOSITION
version: 1.0.0
---

THIS COMPOSITION RENDERS a writing style's token-sequence structure from a faceted coordinate, folding one anchor skeleton with ordered modifier transforms over a primitive grammatical alphabet.

%% META %%:
priority: the requested coordinate for intent, the SPACE for legal values, nothing else
trust: the_coordinate = SOLE_AUTHORITY_FOR_INTENT, the_space = SOLE_AUTHORITY_FOR_VALUES, prior_knowledge = UNTRUSTED
objective: {style_request}
jurisdiction: {style_request} against the SPACE in {convention.space_schema} | external: every style the SPACE does not name
recursion_limit: 1

# NODE 1 — RESOLVE   [epistemic · ontology · set-theory · yields: set]
@purpose: "parse the style request into a validated coordinate and fix what is authoritative"
@genesis: existence
CONTRACT:
input:     {style_request}
transform: READ_RESOURCE {convention.space_schema} INTO space; EXTRACT_FACTS <one value per facet, a bundle-label expanded through the SPACE label map> FROM {style_request} INTO coordinate; FOR EACH facet IN <unstated modifier facets>: SET facet = identity
constraints: every named value resolves in the SPACE; exactly one anchor facet is assigned; an unstated modifier is identity, never guessed
output:    coordinate
DECLARE coordinate: object
SET coordinate = {anchor: <the one anchor value>, modifiers: <one value per modifier facet>, space: space}
HANDOFF GATE (evidence-bearing):
rule_id: "RESOLVE"   yields: boolean
[check] every assigned value is a member of its facet's values (evidence: the SPACE lookup) over: facets measured: <resolved> / <facets>
[check] exactly one facet carries the anchor role (evidence: coordinate.anchor)
[check] unstated modifiers are identity, not guessed (evidence: coordinate.modifiers)
result: pass → NODE 2 | value outside the SPACE → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — REALIZABILITY   [conative · teleology · optimization · yields: boolean]
@purpose: "judge the coordinate realizable, with no conflicting facet values, before sequencing"
@genesis: difference
@mandatory
CONTRACT:
input:     coordinate from NODE 1
transform: FOR EACH axis IN <the facet axes>: COMPARE coordinate.modifiers AGAINST <the axis's incompatible pairs> INTO conflicts; DETERMINE <composition correctness over coverage> INTO objective
constraints: two conflicting values on one axis make the coordinate unrealizable and it is rejected, never merged; a faithful partial render beats a conflicted full one
output:    teleology
DECLARE teleology: object
SET teleology = {realizable: <conflicts empty>, conflicts: conflicts, objective: objective}
HANDOFF GATE (tel-priority injection-gate):
rule_id: "REALIZABILITY"   yields: boolean
[check] no axis carries two conflicting values (evidence: teleology.conflicts) over: axes measured: <conflict-free> / <axes>
[check] composition correctness is the objective over coverage (evidence: teleology.objective)
[check] an unrealizable coordinate is routed to rejection, never merged (evidence: the result arm taken)
result: pass → NODE 3 | unrealizable → BLOCKED | unknown → BLOCKED

# NODE 3 — PLAN   [epistemic · reasoning · algebra · yields: ordered-structure]
@purpose: "order the modifier transforms by the non-commuting precedence, seed the skeleton from the anchor, and assemble the render plan"
@genesis: structure
CONTRACT:
input:     teleology from NODE 2
transform: SORT <the modifier op-lists> BY <lexicon, world, valence, density, register, wrap>; EXTRACT_FACTS <the anchor skeleton over the primitive alphabet> FROM coordinate.space INTO seed; COMPOSE_ARTIFACT plan FROM {seed, <the ordered steps>} USING <seed before steps>
constraints: request order is irrelevant because ops do not commute; an identity facet contributes nothing; the anchor alone owns clause order
preserves: the anchor's clause order
output:    plan
DECLARE plan: object
SET plan = {seed: seed, steps: <the totally ordered ops>}
HANDOFF GATE (evidence-bearing):
rule_id: "PLAN"   yields: boolean
[check] the steps are totally ordered by precedence with no cross-facet tie (evidence: plan.steps) over: modifier facets measured: <ordered> / <modifiers>
[check] the seed skeleton is non-empty (evidence: plan.seed)
[check] the plan orders the seed before the steps (evidence: plan)
result: pass → NODE 4 | tie → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 4 — RENDER   [epistemic · formalization · computation · yields: procedure]
@purpose: "instantiate the skeleton, fold each op in order, and gate the folded structure on admissibility before the signature check"
@genesis: transformation
CONTRACT:
input:     plan from NODE 3
transform: FOR EACH step IN plan.steps: CONVERT structure TO <the op applied> INTO structure; VALIDATE_ARTIFACT structure AGAINST <closure over the primitive alphabet, non-emptiness, the anchor predicate> INTO admissibility
constraints: substitute-lexicon changes fillers only, never primitive tags; a primitive escaping the alphabet, an emptied sequence or a voided anchor predicate without an explicit reorder is refused at the step
preserves: every primitive tag
output:    structure
DECLARE structure: object
SET structure = {tokens: <a sequence over the alphabet>, applied: <every applied op>, admissible: admissibility}
HANDOFF GATE (evidence-bearing):
rule_id: "RENDER"   yields: boolean
[check] the applied ops equal the planned steps (evidence: structure.applied against plan.steps) over: plan.steps measured: <applied> / <steps>
[check] every token's primitive is in the alphabet (evidence: the closure check)
[check] the sequence is non-empty and the anchor predicate is not voided (evidence: structure.admissible)
result: pass → NODE 5 | escape or void → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 5 — VERIFY   [evaluative · verification · logic + probability · yields: number]
@purpose: "prove the rendered structure realizes the coordinate by checking that each facet left its named signature, repairing at most once"
@genesis: constraint
@mandatory
CONTRACT:
input:     structure from NODE 4
transform: FOR EACH modifier IN coordinate.modifiers: SEARCH_CONTENT structure.tokens FOR modifier.signature INTO evidence; VALIDATE_ARTIFACT structure AGAINST <the anchor's clause order, unless an explicit reorder was applied> INTO order; ANALYZE_CONTENT evidence FOR <the missing signature that would refute conformance> INTO refuter
constraints: a checkmark with no named token is void; a single bad op is reverted or reordered and re-rendered once; a repair that fails escalates to rejection, never a loop
output:    verdict
DECLARE verdict: object
SET verdict = {conforms: <every signature present and order intact>, evidence: evidence, refuter: refuter, repairs: <zero or one>}
HANDOFF GATE (ver-stop gate):
rule_id: "VERIFY"   yields: boolean
[check] every modifier's signature is present with its token or position named (evidence: verdict.evidence) over: coordinate.modifiers measured: <signed> / <modifiers>
[check] the anchor order is intact or an explicit reorder is in the applied ops, and a refuter is named (evidence: order and verdict.refuter)
[check] at most one repair re-render occurred (evidence: verdict.repairs)
standing: moved-set none
result: pass → NODE 6 | missing signature → REPAIR (owner: NODE 4) | unknown → BLOCKED

# NODE 6 — EMIT   [evaluative · termination · set-theory · yields: artifact]
@purpose: "emit the validated structure with its facet evidence, and declare the render complete or the coordinate unrealizable"
@genesis: emergence
@mandatory
CONTRACT:
input:     verdict from NODE 5
transform: COMPOSE_ARTIFACT emission FROM {structure, verdict} USING <every facet's evidence token named>; REDUCE emission.tokens TO <collapsed only where an op declared collapse>; PERSIST_ARTIFACT emission TO <{task_name} emission>; REPORT_RESULT emission TO <the parties whose next work it creates>
constraints: render adds no new transform; a rejection is a valid terminal, never a retry; a self-assessed done is not ter-stop
output:    emission
freshness: fingerprint(verdict) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] the structure is emitted with per-facet evidence tokens (evidence: emission) over: facets measured: <evidenced> / <facets>
[check] the verdict conforms for a stop, or the coordinate was rejected as unrealizable (evidence: the termination set)
[check] exactly one validated render per coordinate (evidence: verdict.repairs and the emission count)
refuse: an emission destination that changed since it was read before PERSIST_ARTIFACT
result: pass → TERMINATE | integrity defect → REPAIR (owner: NODE 6) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT space-is-data: the SPACE is injected data and the core knows no style by name over: every render binds: the composer objector: [check] every assigned value is a member of its facet's values at NODE 1
INVARIANT realizable-first: no conflicted coordinate is rendered over: every coordinate binds: the composer objector: [check] no axis carries two conflicting values at NODE 2
INVARIANT anchor-owns-order: the anchor alone owns clause order and a modifier is a transform on its output over: every render binds: the composer objector: [check] the anchor order is intact at NODE 5
INVARIANT precedence-not-request: ops apply in precedence order because they do not commute over: plan.steps binds: the composer objector: [check] the steps are totally ordered by precedence at NODE 3
INVARIANT closure: every rendered token stays within the primitive alphabet over: structure.tokens binds: the composer objector: [check] every token's primitive is in the alphabet at NODE 4
INVARIANT signature-not-checkmark: a gate names the token that is its evidence, because a bare checkmark is void over: every facet binds: the composer objector: [check] every modifier's signature is present with its token named at NODE 5
INVARIANT one-repair: at most one repair re-render precedes rejection over: every coordinate binds: the composer objector: [check] at most one repair re-render occurred at NODE 5

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <facets> measured <evidenced>
populations: modifiers signed <n>, ops applied <n>, repairs <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Debugging Meta-Template (evidence-gated root-cause + surgical-fix generator)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, reversible_baseline_before_change, differential_extracted_first, candidate_lines_worth_ranked, trace_confidence_and_info_debt_gated, hypothesis_scored_against_risk_x_complexity_bar, fix_minimal_and_root_cause, symptom_treatment_refused, broken_fixed_and_no_regression_from_real_test, reflect_not_iterate_at_loop_breaker, procedural_matching_never_regex, unknown_is_not_pass

Slots

project.debug_protocols
host debug protocol docs discovered at orientation (string, required)

convention.clue_taxonomy
the host's clue-class taxonomy used to classify candidate bug-lines (string, required)

convention.known_unknowables
platform-intrinsic calls to filter out of the trace (string, optional)

convention.symptom_patterns
patterns that mark a symptom treatment (refused, not applied) (string, required)

limits.max_fix_attempts
the fix-attempt budget — the loop-breaker bound (reflect, not iterate) (string, required)

limits.max_fix_lines
the maximum fix size (string, required)

limits.info_debt
the information-debt threshold that gates tracing before hypotheses (string, required)

limits.min_tci
the minimum trace-confidence index before hypotheses (string, required)

limits.min_success
the minimum success score for a fix to be accepted (string, required)

toolchain.test.execute
the blocking test command that proves broken-fixed and no-regression (string, required)

bug_report
the raw bug report / failure description (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: DEBUG
version: 1.0.0
---

THIS DEBUG RESOLVES a bug to an evidence-scored root cause and one surgical fix by walking the derivation loop, where every decision is typed to a math shape, the fix is grounded in the substrate genesis cycle, and the mandatory gates are enforced.

%% META %%:
priority: EVIDENCE > ROOT_CAUSE > SPEED
trust: procedural_trace = TRUSTED, test_result = TRUSTED, prior_knowledge = UNTRUSTED, a_hypothesis = UNTRUSTED_UNTIL_SCORED
objective: {bug_report}
jurisdiction: {bug_report} and the code the trace reaches | external: the platform intrinsics in {convention.known_unknowables}
recursion_limit: {limits.max_fix_attempts}

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: set + evidence]
@purpose: "load the protocols, probe capabilities, take a reversible baseline and frame the bug by ontological dimension before touching anything"
@genesis: existence
CONTRACT:
input:     {bug_report}
transform: READ_RESOURCE {project.debug_protocols} INTO protocols; EXECUTE_TOOL <capability probes> WITH timeout: <bound> INTO capability; PERSIST_ARTIFACT <a reversible baseline checkpoint> TO <the checkpoint store>; ANALYZE_CONTENT {bug_report} AGAINST <identity, behavior, change, cause, and when relevant time, space, state> INTO readout
constraints: a hypothesis is untrusted until scored; nothing is changed before the baseline exists
output:    session
DECLARE session: object
SET session = {protocols: protocols, capability: capability, baseline: <the checkpoint>, readout: readout, attempts: 0}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] protocols discovered and capabilities probed (evidence: session.capability is full, degraded or blocked)
[check] a reversible baseline exists before any change (evidence: session.baseline)
[check] the bug is framed by dimension (evidence: session.readout) over: the always-relevant dimensions measured: <framed> / <dimensions>
refuse: a checkpoint store that cannot be read back before PERSIST_ARTIFACT
result: pass → NODE 2 | capability blocked → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: ranking]
@purpose: "extract the differential, rank candidate bug-lines by worth and set the risk bar before tracing"
@genesis: difference
@mandatory
CONTRACT:
input:     session from NODE 1
transform: EXTRACT_FACTS <the works-versus-breaks differential> FROM session.readout INTO differential; ANALYZE_CONTENT differential AGAINST {convention.clue_taxonomy} INTO clues; FOR EACH line IN <candidate bug-lines>: CALCULATE_METRIC probability times severity minus tracing cost FROM line INTO line.worth; RANK <candidate bug-lines> BY worth
constraints: a data-loss or crash risk raises the confidence bar and a cosmetic risk lowers it; an absent differential or an all-unknown line set is a decision the developer owns
output:    ranked_lines
DECLARE ranked_lines: array
SET ranked_lines = <the candidate lines ordered by worth, with the risk bar>
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] the differential is stated (evidence: differential)
[check] every candidate line carries a worth (evidence: ranked_lines) over: <candidate bug-lines> measured: <scored> / <candidates>
[check] the selected line is the argmax of worth (evidence: the ranking's first entry)
result: pass → NODE 3 | no differential → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 3 — TRACE AND HYPOTHESISE   [epistemic · analysis · graph · yields: edge-list + number]
@purpose: "trace the highest-worth line until confident, then score a hypothesis against the risk-times-complexity bar"
@genesis: relation
CONTRACT:
input:     ranked_lines from NODE 2
transform: SEARCH_CONTENT <the code> FOR <the selected line's entry points> INTO trace; FILTER trace WHERE <not in {convention.known_unknowables}>; CALCULATE_METRIC trace-confidence index FROM trace INTO tci; CALCULATE_METRIC information debt FROM trace INTO debt; FOR EACH hypothesis IN <candidates at the failure location>: CALCULATE_METRIC evidence score FROM hypothesis INTO hypothesis.confidence
constraints: no hypothesis before tci clears {limits.min_tci} and debt clears {limits.info_debt}; the required confidence is the risk bar times the complexity tier
output:    hypothesis
DECLARE hypothesis: object
SET hypothesis = {statement: <one sentence with a concrete failure location>, confidence: <a number in zero to one>, trace: trace}
HANDOFF GATE (evidence-bearing):
rule_id: "TRACE"   yields: boolean
[check] tci and information debt cleared their thresholds before any hypothesis (evidence: tci and debt against the limits) over: trace paths measured: <fully traced> / <paths>
[check] the hypothesis clears the risk-times-complexity bar (evidence: hypothesis.confidence against the bar)
[check] the hypothesis names a concrete failure location in one sentence (evidence: hypothesis.statement)
result: pass → NODE 4 | trace stagnated → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 4 — FIX   [epistemic · formalization · analysis · yields: operation]
@purpose: "design the minimal root-cause fix at the failure location, project its ripple, and apply it while refusing symptom treatments"
@genesis: transformation
CONTRACT:
input:     hypothesis from NODE 3
transform: COMPOSE_ARTIFACT fix FROM hypothesis USING <the minimal edit at the failure location>; ANALYZE_CONTENT fix FOR <call sites, tests, invariants> INTO ripple; VALIDATE_ARTIFACT fix AGAINST {convention.symptom_patterns} INTO symptom_check; PERSIST_ARTIFACT fix TO <the failure location>
constraints: a design over {limits.max_fix_lines} signals a wrong or architectural hypothesis and returns to NODE 3; a symptom-pattern match is refused, never applied; the attempt count increments on apply
preserves: the baseline checkpoint
output:    applied_fix
DECLARE applied_fix: object
SET applied_fix = {edit: fix, location: <the failure location>, ripple: ripple, attempts: session.attempts + 1}
HANDOFF GATE (evidence-bearing):
rule_id: "FIX"   yields: boolean
[check] the fix is minimal and at the failure location (evidence: the change and its location) over: changed files measured: <at the location> / <changed>
[check] the fix is within {limits.max_fix_lines} (evidence: the line count)
[check] no symptom-pattern treatment applied (evidence: symptom_check)
refuse: a symptom-pattern match, or a design over {limits.max_fix_lines}, before PERSIST_ARTIFACT
result: pass → NODE 5 | oversized → REPAIR (owner: NODE 3) | symptom → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 5 — VERIFY   [evaluative · verification · logic + probability · yields: number]
@purpose: "gate the applied fix on admissibility, then prove broken-fixed and no-regression from real test execution, reverting on failure"
@genesis: constraint
@mandatory
CONTRACT:
input:     applied_fix from NODE 4
transform: EXECUTE_TOOL {toolchain.test.execute} WITH timeout: <bound> INTO results; CALCULATE_METRIC success score FROM results INTO score; ANALYZE_CONTENT results FOR <a regression in the working scenario> INTO refuter
constraints: admissible only when root-cause not symptom, within {limits.max_fix_lines}, and attempts within {limits.max_fix_attempts}; a score below {limits.min_success} restores the checkpoint and never leaves the fix in place
output:    validation
DECLARE validation: object
SET validation = {status: <fixed or reverted>, score: score, refuter: refuter, results: results}
HANDOFF GATE (ver-stop gate):
rule_id: "VERIFY"   yields: boolean
[check] the broken scenario now passes and the working scenario did not regress (evidence: results from the real run) over: scenarios measured: <passing> / <scenarios>
[check] the success score meets {limits.min_success} (evidence: score against the limit)
[check] a regression refuter is named (evidence: validation.refuter)
[check] a failing fix restored the checkpoint (evidence: the restore, or no failure)
refuse: a test command that cannot run before EXECUTE_TOOL
standing: moved-set <the files changed since NODE 1>
result: pass → NODE 6 | reverted → REPAIR (owner: NODE 3) | attempts exhausted → BLOCKED | unknown → BLOCKED

# REPAIR EDGE  (verify refutes back to the earliest node that can supply the missing evidence; at the attempt limit reflect, never iterate)
CONTRACT:
input:     a reverted validation or a failed admissibility
transform: <restore the checkpoint; pivot to the next hypothesis at NODE 3 when one clears the bar, else to fresh evidence at NODE 2>; <at {limits.max_fix_attempts} record which assumption failed and REQUEST_DECISION the developer for reproduction context>
constraints: bounded by recursion_limit; every changed file reverts through the checkpoint
output:    a viable pivot, or a recorded reflection and a request for reproduction context

# NODE 6 — TERMINATE   [evaluative · termination · set-theory · yields: artifact]
@purpose: "persist the outcome deduplicated and emit exactly one terminal, fixed or blocked, stopping only on saturation and completion and verification"
@genesis: emergence
@mandatory
CONTRACT:
input:     validation from NODE 5
transform: COMPOSE_ARTIFACT report FROM {hypothesis, applied_fix, validation} USING <the fixed or blocked shape>; REDUCE <history entries> TO <one per bug, class, root cause and fix>; PERSIST_ARTIFACT report TO <{task_name} report>; REPORT_RESULT report TO <the parties whose next work it creates>
constraints: exactly one terminal; a self-assessed done is not ter-stop
output:    report
freshness: fingerprint(validation) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] the outcome is persisted and history is deduplicated (evidence: the history read back) over: history entries measured: <distinct> / <entries>
[check] fixed holds only when saturation and completion and verification all hold (evidence: the termination set)
[check] exactly one terminal names the root cause or the blocking reason and reflection (evidence: report)
refuse: a report destination that changed since it was read before PERSIST_ARTIFACT
result: pass → TERMINATE | integrity defect → REPAIR (owner: NODE 6) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT baseline-first: a reversible checkpoint exists before any change over: every debug binds: the debugger objector: [check] a reversible baseline exists at NODE 1
INVARIANT worth-before-trace: no lower-worth line is traced while a higher-worth line is untraced over: candidate lines binds: the debugger objector: [check] the selected line is the argmax at NODE 2
INVARIANT confidence-before-hypothesis: no hypothesis forms below the trace-confidence and information-debt thresholds over: every hypothesis binds: the debugger objector: [check] tci and information debt cleared at NODE 3
INVARIANT root-cause-only: a symptom treatment is refused, never applied over: every fix binds: the debugger objector: [check] no symptom-pattern treatment applied at NODE 4
INVARIANT real-test-only: broken-fixed and no-regression are proven from a real run, never a plan over: every fix binds: the debugger objector: [check] the broken scenario now passes at NODE 5
INVARIANT reflect-not-iterate: at the attempt limit the debugger reflects and blocks on the developer over: every repair binds: the debugger objector: [check] attempts within {limits.max_fix_attempts} at NODE 5
INVARIANT no-regex-no-hardcode: matching is procedural and every taxonomy, threshold and command resolves from a slot over: every node binds: the debugger objector: none

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <scenarios> measured <passing>
populations: fix attempts <n>, hypotheses scored <n>, files changed <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Pattern Distillation Meta-Template (behavioral-evidence base + proven-elimination generator)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, measure_baseline_before_propose, candidate_worth_ranked_impact_minus_effort, base_requires_behavioral_evidence_not_naming, boundary_principles_justify_the_base, migration_reversible_per_target, prove_on_simple_targets_first, base_within_size_limit, elimination_proven_over_whole_scope_from_source, registry_regenerated_to_new_truth, roi_measured_not_asserted, unknown_is_not_pass

Slots

project.architecture_registry
the host architecture registry of existing bases and implementations (string, required)

project.rule_sources
the host architecture rule sources read at orientation (string, required)

project.registry_regenerate
the command that regenerates the architecture registry to the new truth (string, required)

convention.role_taxonomy
the host's role-class taxonomy (manager/repository/handler/service/...) (string, required)

limits.max_lines
the maximum size of a composed base before it must be split (string, required)

toolchain.verify.execute
the blocking verifier that proves an anti-pattern is removed per target (string, required)

task_description
the distillation intent / scope (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: DISTILLATION
version: 1.0.0
---

THIS DISTILLATION DISTILLS repeated behavioral evidence into one justified shared abstraction, and is incomplete until the old pattern is proven gone.

%% META %%:
priority: BEHAVIORAL_EVIDENCE > BOUNDARY_PRINCIPLES > TASK
trust: procedural_scan = TRUSTED, naming_similarity = UNTRUSTED, prior_knowledge = UNTRUSTED
objective: {task_description}
jurisdiction: {task_description} across the role families {convention.role_taxonomy} names | external: every family the scope does not name
recursion_limit: 3

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: set]
@purpose: "load the registry and rule sources, probe capabilities, and measure the existing baseline before proposing any base"
@genesis: existence
CONTRACT:
input:     {task_description}
transform: READ_RESOURCE {project.architecture_registry} INTO registry; READ_RESOURCE {project.rule_sources} INTO rules; EXECUTE_TOOL <capability probes> WITH timeout: <bound> INTO capability; EXTRACT_FACTS <existing bases, implementation counts, hierarchy depth> FROM registry INTO baseline; FOR EACH role IN {convention.role_taxonomy}: ANALYZE_CONTENT <its classes> AGAINST <the expected base> INTO gap
constraints: compare against existing bases before proposing a new one; a missing adoption is not a missing abstraction
output:    baseline_bundle
DECLARE baseline_bundle: object
SET baseline_bundle = {registry: registry, rules: rules, capability: capability, baseline: baseline, gap: <adoption versus abstraction per role>}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] the registry and rule sources are loaded with provenance (evidence: baseline_bundle.registry and rules)
[check] the existing architecture is measured (evidence: baseline_bundle.baseline) over: existing bases measured: <measured> / <bases>
[check] the compliance gap distinguishes adoption from abstraction (evidence: baseline_bundle.gap)
refuse: a probe that would mutate the tree before EXECUTE_TOOL
result: pass → NODE 2 | context unavailable → BLOCKED | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: ranking]
@purpose: "score every candidate anti-pattern by worth and gate on the highest-worth one and its highest-worth remediation before any composition"
@genesis: difference
@mandatory
CONTRACT:
input:     baseline_bundle from NODE 1
transform: EXTRACT_FACTS candidate anti-patterns FROM baseline_bundle.gap INTO candidates; FOR EACH candidate IN candidates: CALCULATE_METRIC impact minus effort FROM candidate INTO candidate.worth; FILTER candidates WHERE <not already covered by an existing base>; RANK candidates BY worth
constraints: the verdict create-base, prefer-composition, prefer-utility or reject-abstraction is a worth decision, never a reflex
output:    selected
DECLARE selected: object
SET selected = <the argmax admissible candidate with its remediation verdict, or a redirect to adopting an existing base>
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] every candidate carries impact, effort and an admissibility verdict (evidence: candidates) over: candidates measured: <scored> / <candidates>
[check] the selected candidate is the argmax of impact minus effort among admissible ones (evidence: the ranking's first entry)
[check] no candidate already covered by an existing base is selected (evidence: the coverage filter)
result: pass → NODE 3 | none admissible → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 3 — SIGN   [epistemic · analysis · graph · yields: edge-list + boolean]
@purpose: "sign each class's behavior from evidence, surface repeated structure and inconsistency, and reason to the boundary verdict"
@genesis: relation
CONTRACT:
input:     selected from NODE 2
transform: FOR EACH class IN <the selected role family>: EXTRACT_FACTS <initialization, lifecycle, error handling, state, dependencies, orchestration> FROM class INTO signature; ANALYZE_CONTENT signatures FOR <repeated structure with occurrence counts and competing implementations> INTO patterns; ANALYZE_CONTENT patterns AGAINST <universal, invariant, foundational, enforcing, load-reducing, and domain coverage> INTO verdict
constraints: a base needs behavioral evidence, never naming similarity; without sufficient boundary principles the verdict is composition, utility or a local refactor
output:    boundary_verdict
DECLARE boundary_verdict: object
SET boundary_verdict = {signatures: signatures, patterns: patterns, verdict: verdict}
HANDOFF GATE (evidence-bearing):
rule_id: "SIGN"   yields: boolean
[check] every class in the family is signed from evidence, not names (evidence: signatures) over: the family measured: <signed> / <classes>
[check] repeated structure and inconsistency are surfaced with counts (evidence: patterns)
[check] a base verdict rests on sufficient boundary principles and coverage (evidence: boundary_verdict.verdict)
result: pass → NODE 4 | insufficient boundary → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 4 — COMPOSE AND MIGRATE   [epistemic · formalization · computation · yields: procedure]
@purpose: "split concrete from abstract, design the template-method lifecycle, compose the base within limits, and migrate targets simple-first and reversibly"
@genesis: structure
CONTRACT:
input:     boundary_verdict from NODE 3
transform: COMPOSE_ARTIFACT base FROM boundary_verdict USING <concrete constructor, initialize, destroy, handle-error and dependency setup; abstract on-initialize, on-destroy, on-error, configure and execute-core; guard then shared then hook then error policy>; ORDER targets BY ascending complexity then dependency; FOR EACH target IN targets: PERSIST_ARTIFACT <a checkpoint> TO <the checkpoint store>; PERSIST_ARTIFACT <the migrated target> TO target; EXECUTE_TOOL {toolchain.verify.execute} WITH timeout: <bound> INTO removal
constraints: a base over {limits.max_lines} is split; a failed migration restores its checkpoint; a base whose boundary collapsed or that blew the effort budget is inadmissible
preserves: every behavior signed at NODE 3
output:    migration
DECLARE migration: object
SET migration = {base: base, targets: <each with checkpoint, outcome and removal verdict>, admissible: <boundary still sufficient, size within limit, effort within budget, every target reversible>}
HANDOFF GATE (evidence-bearing):
rule_id: "COMPOSE"   yields: boolean
[check] concrete and abstract responsibilities are split and the lifecycle is defined (evidence: base)
[check] the base is within {limits.max_lines} with a compliant name and location (evidence: the base's size and path)
[check] every target migrated or restored from its checkpoint (evidence: migration.targets) over: targets measured: <migrated> / <targets>
[check] the base is admissible (evidence: migration.admissible)
refuse: a target whose checkpoint cannot be read back before PERSIST_ARTIFACT
result: pass → NODE 5 | inadmissible → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 5 — ELIMINATE   [evaluative · verification · logic + probability · yields: number]
@purpose: "prove the old pattern is eliminated across the whole scope from real source, and migrate any straggler reversibly"
@genesis: constraint
@mandatory
CONTRACT:
input:     migration from NODE 4
transform: SEARCH_CONTENT <the whole scope> FOR <the old pattern> INTO occurrences; FILTER occurrences WHERE <outside the approved base locations>; CALCULATE_METRIC completeness FROM occurrences INTO completeness; ANALYZE_CONTENT occurrences FOR <a stray occurrence that would refute elimination> INTO refuter
constraints: the scan reads real source, never the migration log; a stray occurrence refutes back to NODE 4, bounded by recursion_limit
output:    elimination
DECLARE elimination: object
SET elimination = {occurrences: occurrences, completeness: completeness, refuter: refuter}
HANDOFF GATE (ver-stop gate):
rule_id: "ELIMINATE"   yields: boolean
[check] the scan ran over the whole scope from real source (evidence: the scanned file set) over: the scope measured: <scanned> / <files>
[check] only approved base-location occurrences remain (evidence: elimination.occurrences)
[check] a refuter is named and completeness meets its threshold (evidence: elimination.refuter and completeness)
standing: moved-set <the files changed since NODE 4>
result: pass → NODE 6 | stray occurrence → REPAIR (owner: NODE 4) | unknown → BLOCKED

# NODE 6 — TERMINATE   [evaluative · termination · set-theory · yields: artifact]
@purpose: "regenerate the registry to the new truth, persist measured ROI deduplicated, and stop only on saturation and completion and verification"
@genesis: emergence
@mandatory
CONTRACT:
input:     elimination from NODE 5
transform: EXECUTE_TOOL {project.registry_regenerate} WITH timeout: <bound> INTO regenerated; READ_RESOURCE {project.architecture_registry} INTO registry_after; CALCULATE_METRIC <duplication, code, adoption, lines saved, load> FROM {baseline_bundle, migration, registry_after} INTO roi; COMPOSE_ARTIFACT report FROM {migration, elimination, roi} USING <the success or blocked shape>; PERSIST_ARTIFACT report TO <{task_name} report>; REPORT_RESULT report TO <the parties whose next work it creates>
constraints: ROI is measured, never asserted; the registry reflects the new base and the migrated implementations; a self-assessed done is not ter-stop
output:    report
freshness: fingerprint(registry_after) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] the registry is regenerated and reflects the new truth (evidence: registry_after names the base and the migrated implementations) over: migrated implementations measured: <represented> / <migrated>
[check] ROI is computed from measurements and history is persisted deduplicated (evidence: roi and the history read back)
[check] success only when saturation and completion and verification all hold (evidence: the termination set)
refuse: a report destination that changed since it was read before PERSIST_ARTIFACT
result: pass → TERMINATE | registry stale → REPAIR (owner: NODE 6) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT measure-before-propose: the existing baseline is measured before any base is proposed over: every distillation binds: the distiller objector: [check] the existing architecture is measured at NODE 1
INVARIANT worth-before-base: the selected candidate is the highest-worth admissible one over: candidates binds: the distiller objector: [check] the selected candidate is the argmax at NODE 2
INVARIANT evidence-not-names: a base rests on behavioral evidence, never on naming similarity over: every base binds: the distiller objector: [check] every class is signed from evidence at NODE 3
INVARIANT reversible-migration: every target migrates through a checkpoint and restores on failure over: targets binds: the distiller objector: [check] every target migrated or restored at NODE 4
INVARIANT gone-means-scanned: elimination is proven over the whole scope from real source over: the scope binds: the distiller objector: [check] the scan ran over the whole scope at NODE 5
INVARIANT roi-measured: ROI is a measurement over the regenerated registry, never an assertion over: every report binds: the distiller objector: [check] ROI is computed from measurements at NODE 6

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <files in scope> measured <scanned>
populations: targets migrated <n>, targets restored <n>, occurrences remaining <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Translation Audit Meta-Template (four-gate adversarial per-line i18n auditor)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, adversarial_translation_flawed_until_proven, source_key_and_catalog_fixed, every_entry_translated_and_untranslated_in_scope, method_research_or_first_principles_by_worth, four_gates_structural_adequacy_fluency_consistency, placeholders_and_protected_terms_verbatim, grammar_claim_referenced_or_first_principles_never_guessed, corrections_re_verified_against_their_own_gates, sign_off_only_at_zero_flawed, unknown_is_not_pass

Slots

project.dictionaries
the per-locale dictionary directory (source-key to target-value) (string, required)

project.i18n_config
the i18n config supplying protected terms, RTL locales, and native names (string, required)

project.audit_manifest
the audit manifest holding each locale's rev and audited hash (string, required)

project.i18n_audit_command
the command that reports which locales are blocked or clean (string, required)

project.i18n_audit_ok_command
the command that signs off a locale (updates hash, increments rev) (string, required)

convention.protected_terms
brand and technical tokens preserved verbatim in the original script (string, required)

convention.rtl_locales
the locales for which the RTL/bidi lens is active (string, required)

locale
the locale code under audit (or every locale flagged blocked) (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: TRANSLATION
version: 1.0.0
---

THIS TRANSLATION AUDITS each translated string in a locale dictionary against its fixed source through four gates, authoring corrections in place; a translation is presumed flawed until verification proves it sound.

%% META %%:
priority: SOURCE_STRING > TARGET_VALUE > TASK
trust: source_string = FIXED, referenced_grammar = TRUSTED, fluent_appearance = UNTRUSTED, a_translation = FLAWED_UNTIL_PROVEN
objective: {locale}
jurisdiction: the {locale} dictionary under {project.dictionaries} | external: the source catalog, which is never altered
recursion_limit: 3

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: set]
@purpose: "load the dictionary, config and manifest, probe research, hold the linguistic reference, and kind every entry"
@genesis: existence
CONTRACT:
input:     the {locale} dictionary
transform: READ_RESOURCE {project.dictionaries} INTO dictionary; READ_RESOURCE {project.i18n_config} INTO config; READ_RESOURCE {project.audit_manifest} INTO manifest; EXECUTE_TOOL <a research probe> WITH timeout: <bound> INTO research; FOR EACH entry IN dictionary: CLASSIFY entry BY <translated when the value differs from the source key, untranslated when it equals it>
constraints: the source key is fixed; the file is audited and authored in place; research availability is disclosed
output:    scope
DECLARE scope: object
SET scope = {dictionary: dictionary, protected: {convention.protected_terms}, rtl: <true when {locale} is in {convention.rtl_locales}>, manifest: manifest, research: research, reference: <the target language's morphology, syntax, register and terminology>, entries: <every entry with its kind>}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] the dictionary, config and manifest are loaded (evidence: scope.dictionary, protected and manifest)
[check] research availability is probed and disclosed (evidence: scope.research)
[check] every entry is kinded (evidence: scope.entries) over: dictionary entries measured: <kinded> / <entries>
refuse: a probe that would write the dictionary before EXECUTE_TOOL
result: pass → NODE 2 | dictionary unreadable → BLOCKED | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: ranking]
@purpose: "choose per entry the audit method, research or first principles, by worth, and order flawed and untranslated entries first"
@genesis: difference
@mandatory
CONTRACT:
input:     scope from NODE 1
transform: FOR EACH entry IN scope.entries: CALCULATE_METRIC uncertainty times visibility FROM entry INTO entry.worth; FOR EACH entry IN scope.entries: DETERMINE <research when worth is high and research is available, else first principles> INTO entry.method; ORDER scope.entries BY <flawed and untranslated first, then worth>
constraints: every entry is in scope, untranslated entries are gaps to fill; a high-visibility uncertain entry is never left to a cheap guess
output:    ordered
DECLARE ordered: array
SET ordered = <every entry with its worth, method and position>
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] every entry carries a chosen method (evidence: ordered) over: scope.entries measured: <with method> / <entries>
[check] each method is the argmax of assurance times visibility minus research cost (evidence: the per-entry choice)
[check] no high-visibility uncertain entry is left to a cheap guess (evidence: the worth order against the methods)
result: pass → NODE 3 | guess on a high-worth entry → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 3 — GATES   [epistemic · reasoning · logic · yields: set]
@purpose: "select the target language's linguistic lenses and derive the four gate requirements every entry must satisfy"
@genesis: relation
CONTRACT:
input:     ordered from NODE 2
transform: DETERMINE <the lenses the target language exhibits: structural, semantic, relational, sequential, spatial only for an RTL locale, anomaly> INTO lenses; COMPOSE_ARTIFACT gates FROM lenses USING <A structural integrity, B adequacy, C fluency, D consistency>
constraints: the RTL lens is active if and only if {locale} is in {convention.rtl_locales}; a single failed gate means flawed
output:    gates
DECLARE gates: object
SET gates = {lenses: lenses, A: <placeholders verbatim once, protected terms verbatim, no leftover fragment or artifact>, B: <the same proposition, no dropped or added meaning>, C: <agreement, order, definiteness, particles, verb forms, script, RTL>, D: <one rendering per source term, conventional affordances, uniform tone>}
HANDOFF GATE (evidence-bearing):
rule_id: "GATES"   yields: boolean
[check] the applicable lenses are selected (evidence: gates.lenses) over: the language's lenses measured: <selected> / <lenses>
[check] the RTL lens is active if and only if the locale is RTL (evidence: gates.lenses against scope.rtl)
[check] the four gates are bound to the lenses (evidence: gates.A through gates.D)
result: pass → NODE 4 | lens mismatch → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 4 — AUDIT   [epistemic · formalization · analysis · yields: operation]
@purpose: "process every entry through the four gates in genesis order and author corrections and translations in place"
@genesis: transformation
CONTRACT:
input:     gates from NODE 3
transform: ORDER ordered BY <genesis rank, consistency after the entries it depends on>; FOR EACH entry IN ordered: VALIDATE_ARTIFACT entry AGAINST gates INTO entry.finding; FOR EACH entry IN <flawed or untranslated>: COMPOSE_ARTIFACT value FROM entry USING <its method, protected terms and placeholders verbatim>; PERSIST_ARTIFACT value TO dictionary
constraints: the source key and the source catalog are never altered; a grammar claim carries a reference or a first-principles justification
preserves: every placeholder and every protected term, verbatim
output:    findings
DECLARE findings: array
SET findings = <one per entry: verdict, failing gates, justification with a reference when researched, correction>
HANDOFF GATE (evidence-bearing):
rule_id: "AUDIT"   yields: boolean
[check] every entry ran all four gates (evidence: findings) over: ordered measured: <audited> / <entries>
[check] no grammar claim lacks a reference or a first-principles justification (evidence: findings.justification)
[check] flawed and untranslated values are authored in place with the source key untouched (evidence: the dictionary read back against the source catalog)
refuse: a value that would alter a source key, a placeholder or a protected term before PERSIST_ARTIFACT
result: pass → NODE 5 | source touched → REPAIR (owner: NODE 4) | unknown → BLOCKED

# NODE 5 — RE-VERIFY   [evaluative · verification · logic + probability · yields: number]
@purpose: "gate the corrections on integrity, then re-verify every correction against its own four gates until zero flawed remain"
@genesis: constraint
@mandatory
CONTRACT:
input:     findings from NODE 4
transform: FOR EACH correction IN <corrected or authored entries>: VALIDATE_ARTIFACT correction AGAINST <placeholders and protected terms exactly, source untouched> INTO integrity; FOR EACH correction IN <corrected or authored entries>: VALIDATE_ARTIFACT correction AGAINST gates INTO recheck; ANALYZE_CONTENT recheck FOR <the native error that would refute soundness> INTO refuter
constraints: a correction is flawed until proven by its own gates; fluency is not adequacy, so B and C both run; a claim that cannot be researched or first-principled leaves the entry flagged; repair is bounded by recursion_limit
output:    adjudication
DECLARE adjudication: object
SET adjudication = {integrity: integrity, recheck: recheck, remaining_flawed: <entries still flawed>, refuter: refuter}
HANDOFF GATE (ver-stop gate):
rule_id: "VERIFY"   yields: boolean
[check] every correction preserves its placeholders and protected terms and the source is untouched (evidence: adjudication.integrity) over: corrections measured: <intact> / <corrections>
[check] gates B and C both ran on every correction and a refuter is named (evidence: adjudication.recheck and refuter)
[check] zero flawed remain (evidence: adjudication.remaining_flawed)
standing: moved-set <the dictionary re-read since NODE 4>
result: pass → NODE 6 | still flawed → REPAIR (owner: NODE 4) | unverifiable claim → BLOCKED | unknown → BLOCKED

# NODE 6 — SIGN OFF   [evaluative · termination · set-theory · yields: artifact]
@purpose: "compose the report deduplicated, and sign off only on saturation and completion and verification, otherwise leave the locale blocked"
@genesis: emergence
@mandatory
CONTRACT:
input:     adjudication from NODE 5
transform: COMPOSE_ARTIFACT report FROM {findings, adjudication} USING <the counts and the full flawed table with justifications>; REDUCE report.rows TO <one per entry>; EXECUTE_TOOL {project.i18n_audit_ok_command} WITH timeout: <bound> INTO signed; EXECUTE_TOOL {project.i18n_audit_command} WITH timeout: <bound> INTO status; PERSIST_ARTIFACT report TO <{task_name} report>
constraints: sign-off runs only at zero flawed with every correction re-verified; the source is fixed and the translation bends; a self-assessed done is not ter-stop
output:    report
freshness: fingerprint(dictionary) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] the report names the counts and the full flawed table, deduplicated (evidence: report) over: dictionary entries measured: <reported> / <entries>
[check] sign-off ran only at zero flawed and the audit command reports the locale clean (evidence: signed and status)
[check] exactly one terminal, signed off or blocked, within recursion_limit (evidence: report and the repair count)
refuse: a non-zero flawed count before EXECUTE_TOOL of the sign-off command
result: pass → TERMINATE | locale still blocked → BLOCKED | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT source-fixed: the source key and the source catalog are never altered over: every entry binds: the auditor objector: [check] the source key untouched at NODE 4
INVARIANT flawed-until-proven: a translation and a correction are flawed until their own gates prove them sound over: every entry binds: the auditor objector: [check] zero flawed remain at NODE 5
INVARIANT every-entry-in-scope: translated and untranslated entries are both audited over: dictionary entries binds: the auditor objector: [check] every entry ran all four gates at NODE 4
INVARIANT verbatim-tokens: placeholders and protected terms survive every correction verbatim over: corrections binds: the auditor objector: [check] every correction preserves its placeholders at NODE 5
INVARIANT referenced-grammar: a grammar claim carries a reference or a first-principles justification, never a guess over: every claim binds: the auditor objector: [check] no grammar claim lacks a justification at NODE 4
INVARIANT sign-off-at-zero: a locale is signed off only at zero flawed over: every locale binds: the auditor objector: [check] sign-off ran only at zero flawed at NODE 6

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <entries> measured <audited>
populations: sound <n>, flawed <n>, corrected <n>, untranslated filled <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Forensic Context Verification Meta-Template (calibrated, adversarially-tested claim adjudication)

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, evidence_grounded, trust_anchor_disclosed_not_verified, op_sets_mutually_exclusive_investigate_action, claims_kinded_by_ontological_dimension, claims_worth_ranked_before_probe, detectors_calibrated_false_positive_and_false_negative, observations_gathered_never_inferred, matches_adversarially_tested, recursive_self_audit_run, escalation_builds_a_tool_or_marks_unverified_never_infers, exactly_one_typed_artifact, unknown_is_not_pass

Slots

convention.max_recursion_depth
the recursion bound governing escalation and repair cycles (string, required)

self.definition
this agent's own definition, read for the recursive self-audit (string, required)

target
the system or artifact whose context claims are being verified (string, required)

context_claims
the set of context claims to classify against implementation evidence (string, required)

task_name
kebab-case name for the output file (string, required)

Template body

```pag
---
name: {task_name}
type: VERIFICATION
version: 1.0.0
---

THIS VERIFICATION PERFORMS a forensic adjudication that classifies every context claim verified, contradicted or unverified against observable implementation evidence, with detectors calibrated and adversarially tested before any claim is trusted.

%% META %%:
priority: EVIDENCE > TRUST_ANCHOR > TASK
trust: implementation_observation = TRUSTED, prior_knowledge = UNTRUSTED, a_claim = UNTRUSTED_UNTIL_MAPPED
objective: {context_claims}
jurisdiction: {context_claims} about {target} | external: the runtime, filesystem, command execution and tool io the trust anchor discloses
recursion_limit: {convention.max_recursion_depth}

# NODE 1 — ORIENT   [epistemic · ontology · set-theory · yields: set]
@purpose: "disclose the trust anchor, bind one op-set, and kind every claim by its ontological dimension before touching any claim"
@genesis: existence
CONTRACT:
input:     {context_claims} about {target}
transform: EXTRACT_FACTS <the minimal assumptions and the cannot-verify-the-verifier boundary> FROM <this document> INTO anchor; DETERMINE <INVESTIGATE or ACTION> INTO op_set; FOR EACH claim IN {context_claims}: CLASSIFY claim BY <its ontological dimension and evidence shape>
constraints: the anchor is disclosed, never verified; INVESTIGATE allows gap discovery, testing and documentation and forbids mutation; ACTION allows a bounded fix and forbids discovery; the two are disjoint
output:    run_context
DECLARE run_context: object
SET run_context = {anchor: anchor, op_set: op_set, claims: <every claim with its kind, evidence shape and math type>}
HANDOFF GATE (evidence-bearing):
rule_id: "ORIENT"   yields: boolean
[check] the trust anchor is disclosed with its assumptions and boundary (evidence: run_context.anchor)
[check] exactly one op-set is bound and its allowed and forbidden operations are disjoint (evidence: run_context.op_set)
[check] every claim carries a kind and an evidence shape (evidence: run_context.claims) over: {context_claims} measured: <kinded> / <claims>
result: pass → NODE 2 | unkinded claim → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — INTENT   [conative · teleology · optimization · yields: ranking]
@purpose: "rank claims by verification worth and choose the method per claim by utility minus cost before probing anything"
@genesis: difference
@mandatory
CONTRACT:
input:     run_context from NODE 1
transform: FOR EACH claim IN run_context.claims: CALCULATE_METRIC risk times uncertainty FROM claim INTO claim.worth; FOR EACH claim IN run_context.claims: RANK <its admissible methods> BY risk-weighted coverage minus cost
constraints: a method is admissible only when its capability is available; a high-worth claim with no admissible method is marked will-be-unverified, never inverted below a low-worth escalation
output:    methods
DECLARE methods: array
SET methods = <one chosen method per claim, the argmax admissible one>
HANDOFF GATE (tel-priority injection-gate):
rule_id: "INTENT"   yields: boolean over ranking
[check] every claim carries a worth and a chosen method (evidence: methods) over: run_context.claims measured: <with method> / <claims>
[check] each chosen method is the argmax of risk-weighted coverage minus cost (evidence: the per-claim ranking)
[check] no high-worth claim is left unmapped while a low-worth claim escalates (evidence: the worth order against the escalations)
result: pass → NODE 3 | priority inversion → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 3 — CALIBRATE   [epistemic · analysis · graph · yields: set + boolean]
@purpose: "probe the runtime, calibrate every detector the chosen methods use against both controls, and arm the defenses before trusting any tool"
@genesis: relation
CONTRACT:
input:     methods from NODE 2
transform: EXECUTE_TOOL <capability probes> WITH timeout: <bound> INTO capability; FOR EACH detector IN <the detectors the methods need>: EXECUTE_TOOL detector WITH <a known-good and a known-bad fixture> INTO detector.reliability; <arm sanitize, safe arithmetic and recursion control to {convention.max_recursion_depth}>
constraints: a detector is untrusted until it passes both controls; probing is by capability, never by an operating-system string
output:    capability_plan
DECLARE capability_plan: object
SET capability_plan = {mode: <full, degraded or blocked>, detectors: <each with its reliability>, defenses: <armed>}
HANDOFF GATE (evidence-bearing):
rule_id: "CALIBRATE"   yields: boolean
[check] capabilities probed and classified (evidence: capability_plan.mode)
[check] every needed detector ran both the false-positive and the false-negative control (evidence: detector.reliability) over: needed detectors measured: <calibrated> / <detectors>
[check] the defenses are armed (evidence: capability_plan.defenses)
refuse: a probe that would mutate the target before EXECUTE_TOOL
result: pass → NODE 4 | unreliable detector → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 4 — GATHER   [epistemic · formalization · computation · yields: set]
@purpose: "resolve each claim to an observable evidence requirement, order by verdict genesis, gather observations from the implementation, and hold the op-set"
@genesis: transformation
CONTRACT:
input:     capability_plan from NODE 3
transform: FOR EACH claim IN run_context.claims: EXTRACT_FACTS <the observation that would settle it> FROM claim INTO requirement; ORDER requirements BY genesis rank then dependency; FOR EACH requirement IN requirements: READ_RESOURCE <the implementation it names> INTO observation
constraints: a requirement names the settling observation, never a presumed verdict; an observation is gathered, never inferred; a string crosses a boundary only after sanitize; a mutation under INVESTIGATE or a discovery under ACTION is inadmissible
preserves: the distinction between observed, pending escalation and absent
output:    observations
DECLARE observations: array
SET observations = <one per direct requirement, each bound to real implementation, escalations flagged pending>
HANDOFF GATE (evidence-bearing):
rule_id: "GATHER"   yields: boolean
[check] every claim resolves to an observable requirement naming the settling observation (evidence: requirements) over: run_context.claims measured: <mapped> / <claims>
[check] every direct requirement produced an observation from the implementation and none was inferred (evidence: observations)
[check] the op-set was honored, every boundary cross was sanitized and recursion stayed bounded (evidence: the admissibility record)
result: pass → NODE 5 | inadmissible act → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 5 — ADJUDICATE   [evaluative · verification · logic + probability · yields: set + number]
@purpose: "judge each observation against evidence, behavioral contract and hostile inputs, judge this agent's own claims, and resolve escalations without inference"
@genesis: constraint
@mandatory
CONTRACT:
input:     observations from NODE 4
transform: FOR EACH observation IN observations: CLASSIFY observation BY <verified, contradicted or unverified>; EXECUTE_TOOL <the detectors> WITH <traversal, null-byte, homoglyph, comment and spoof inputs> INTO adversarial; ANALYZE_CONTENT {self.definition} AGAINST <its own must and always claims> INTO self_audit; FOR EACH escalation IN <pending escalations>: <build a bounded tool or mark the claim unverified>
constraints: a match is not evidence until the calibration and adversarial verdicts hold; an overclaim downgrades confidence below threshold; an escalation is never resolved by inference; a stale write is rewritten as complete state
output:    adjudication
DECLARE adjudication: object
SET adjudication = {verdicts: <one per claim>, adversarial: adversarial, self_audit: self_audit, confidence: <a number in zero to one>, refuter: <what would flip a verdict>}
HANDOFF GATE (ver-stop gate):
rule_id: "ADJUDICATE"   yields: boolean
[check] every claim is classified with its evidence and a refuter is named (evidence: adjudication.verdicts) over: run_context.claims measured: <classified> / <claims>
[check] every detector survived the adversarial inputs with the expected outcome (evidence: adjudication.adversarial)
[check] the recursive self-audit ran and an overclaim downgraded confidence (evidence: adjudication.self_audit)
[check] no pending escalation remains unresolved by tool or by an unverified mark (evidence: the escalation record)
refuse: an adversarial input that would escape the intended root before EXECUTE_TOOL
standing: moved-set <the implementation files re-read since NODE 4>
result: pass → NODE 6 | untested match → REPAIR (owner: NODE 3) | unknown → BLOCKED

# NODE 6 — TERMINATE   [evaluative · termination · set-theory · yields: artifact]
@purpose: "emit exactly one typed artifact, deduplicated, naming every limitation, and stop only on saturation and completion and verification"
@genesis: emergence
@mandatory
CONTRACT:
input:     adjudication from NODE 5
transform: COMPOSE_ARTIFACT artifact FROM {run_context, adjudication} USING <the investigation report, the action log, or the blocked report>; REDUCE artifact.findings TO <one per claim and verdict>; PERSIST_ARTIFACT artifact TO <{task_name} report>; REPORT_RESULT artifact TO <the parties whose next work it creates>
constraints: exactly one artifact, bound at orientation; a self-assessed done is not ter-stop
output:    artifact
freshness: fingerprint(adjudication) + fingerprint(this document)
HANDOFF GATE (ter-stop gate):
rule_id: "TERMINATE"   yields: boolean
[check] exactly one typed artifact names every limitation, warning and vulnerability (evidence: artifact)
[check] success only when saturation and completion and verification all hold (evidence: the termination set) over: the termination set measured: <holding> / <three>
[check] findings are deduplicated by claim and verdict (evidence: the reduction pass)
refuse: a report destination that changed since it was read before PERSIST_ARTIFACT
result: pass → TERMINATE | integrity defect → REPAIR (owner: NODE 6) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT anchor-disclosed: the trust anchor is disclosed, never verified, and everything above it is verified over: every run binds: the verifier objector: [check] the trust anchor is disclosed at NODE 1
INVARIANT op-sets-disjoint: INVESTIGATE never mutates and ACTION never discovers new scope over: every operation binds: the verifier objector: [check] the op-set was honored at NODE 4
INVARIANT calibrate-before-trust: no detector output is trusted before both controls pass over: every detector binds: the verifier objector: [check] every needed detector ran both controls at NODE 3
INVARIANT gathered-never-inferred: an observation comes from the implementation, never from inference over: every observation binds: the verifier objector: [check] none was inferred at NODE 4
INVARIANT match-is-not-evidence: a match counts only after calibration and adversarial survival over: every verdict binds: the verifier objector: [check] every detector survived the adversarial inputs at NODE 5
INVARIANT self-not-exempt: this agent's own claims are audited by the same rules over: every run binds: the verifier objector: [check] the recursive self-audit ran at NODE 5
INVARIANT escalate-never-infer: a missing capability builds a tool or marks the claim unverified over: every escalation binds: the verifier objector: [check] no pending escalation remains at NODE 5

REPORT:
subject: NODE 6
verdict: pass | fail | unknown
domain: declared <claims> measured <classified>
populations: verified <n>, contradicted <n>, unverified <n>
refusals: <n> [<reason>]
unresolved: <n> [<reason>]
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

### Workflow Meta-Template

Details

Constraints
declaration_required, gate_per_node, contract_reads_prior_output, population_declared, refusal_before_write, invariant_has_objector, no_autonomous_spawn, single_source_of_truth

Slots

WORKFLOW_NAME
kebab-case workflow name (string, required)

WORKFLOW_PURPOSE
one-line statement of what the workflow orchestrates (string, required)

WORKFLOW_INTENT
the workflow's intent (string, required)

OBJECTIVE
measurable success criteria (string, required)

NODE_ONE_TITLE
title of the discovery/input node (string, required)

INPUT_SOURCE
where the workflow reads its input (string, required)

ANALYSIS_TARGET
what the input is analyzed for (string, required)

NODE_TWO_TITLE
title of the transform node (string, required)

TRANSFORM_RULE
the rule each item is transformed by (string, required)

OUTPUT_TARGET
where results are written (string, required)

Template body

```pag
---
name: {WORKFLOW_NAME}
type: WORKFLOW
version: 1.0.0
---

THIS WORKFLOW EXECUTES {WORKFLOW_PURPOSE}

%% META %%:
intent: "{WORKFLOW_INTENT}"
objective: "{OBJECTIVE}"
jurisdiction: {INPUT_SOURCE} and {OUTPUT_TARGET} | external: every other surface
recursion_limit: 2

# NODE 1 — {NODE_ONE_TITLE}   [epistemic · analysis · set-theory · yields: set]
@purpose: "read the input and see it through the analysis the workflow is for"
@genesis: existence
CONTRACT:
input:     {INPUT_SOURCE}
transform: READ_RESOURCE {INPUT_SOURCE} INTO input; ANALYZE_CONTENT input AGAINST {ANALYSIS_TARGET} INTO analysis
output:    analysis
HANDOFF GATE (evidence-bearing):
[check] input read from {INPUT_SOURCE} (evidence: the read returned content) over: {INPUT_SOURCE} measured: <read> / <declared>
[check] analysis produced (evidence: a count above zero)
[check] every entry of analysis names its source in input (evidence: no entry with an empty source)
result: pass → NODE 2 | empty → REPAIR (owner: NODE 1) | unknown → BLOCKED

# NODE 2 — {NODE_TWO_TITLE}   [epistemic · formalization · computation · yields: procedure]
@purpose: "transform every item by one rule, preserving what the next node needs"
@genesis: transformation
CONTRACT:
input:     analysis from NODE 1
transform: FOR EACH item IN analysis: COMPOSE_ARTIFACT result FROM item USING {TRANSFORM_RULE}; APPEND result TO results
preserves: the source of every item
output:    results
HANDOFF GATE:
[check] one result per item (evidence: the two counts match) over: analysis measured: <transformed> / <items>
[check] every result conforms to {TRANSFORM_RULE} (evidence: VALIDATE_ARTIFACT passed on each)
[check] analysis unchanged (evidence: a witness read)
result: pass → NODE 3 | mismatch → REPAIR (owner: NODE 2) | unknown → BLOCKED

# NODE 3 — FINALIZATION   [evaluative · representation · information-theory · yields: artifact]
@purpose: "persist the results once, refuse a stale destination, and report to the parties whose next work they create"
@genesis: constraint
CONTRACT:
input:     results from NODE 2
transform: PERSIST_ARTIFACT results TO {OUTPUT_TARGET}; REPORT_RESULT completion TO <the parties whose next work it creates>
output:    {OUTPUT_TARGET}
freshness: fingerprint(results) + fingerprint(this document)
HANDOFF GATE:
[check] {OUTPUT_TARGET} persisted (evidence: a read returns it) over: results measured: <persisted> / <results>
[check] completion reported (evidence: the report)
[check] entry count of {OUTPUT_TARGET} matches results (evidence: the two numbers)
refuse: {OUTPUT_TARGET} changed since it was read before PERSIST_ARTIFACT
standing: moved-set none
result: pass → TERMINATE | loss → REPAIR (owner: NODE 3) | unknown → BLOCKED

# CROSS-NODE INVARIANTS
INVARIANT prior-output-only: a node reads only the prior node's output over: every node binds: the workflow objector: [check] input names NODE n-1 or a slot
INVARIANT one-truth: one fact has one home across the nodes over: every artifact binds: the workflow objector: [check] entry count of the output matches results
INVARIANT no-spawn: no autonomous party is spawned over: every node binds: the workflow objector: none

REPORT:
subject: NODE 3
verdict: pass | fail | unknown
domain: declared <results> measured <persisted>
completion: saturated <bool> complete <bool> verified <bool>

```

How it is checked

Checked by
the template round-trip check, which fills the template and validates the result against the grammar, the slot check, which requires every declared slot to appear in the body and every slot in the body to be declared

Population
This template's body and slots, and every document created from it

Freshness
A verdict stands until the template, its document type or the grammar changes

Refusal
The gate fails on a dangling slot, an unregistered type, or a filled template that does not validate

Observation
None, because a template is static text, and nothing observes it while a run executes

Evidence
Watched to fire and to accept: one suite plants a slot the body never carries and a template of an unregistered type, another plants a retired head in a real template, and every filled template validates clean

Authoritative side
The template's document type and the grammar, which every document created from the template conforms to

Depends on
Not answered

Shape it refuses
Not answered

---

Chapters: [Principles](PRINCIPLES.md) · [Lexicon](LEXICON.md) · [Algorithms](ALGORITHMS.md) · [Reasoning](REASONING.md) · [Grammar](GRAMMAR.md) · [Schema](SCHEMA.md)
