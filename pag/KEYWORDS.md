© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Keywords — PAG — Bane's Lab

> The keywords fall into categories by the job they do in a line, and every keyword is uppercase because that is the form the model has seen most in code. Every…

Canonical: https://banes-lab.com/pag/keywords

# Pattern Abstract Grammar

Structured instructions for LLMs

## Keywords

The keywords fall into categories by the job they do in a line, and every keyword is uppercase because that is the form the model has seen most in code. Every keyword outside the prepositions grounds to a record in the ontology's reasoning face, so the vocabulary is derived rather than invented, and the lists below are read from the grammar's own records.

### Semantic operations

A document names one of the [semantic operations](GUIDE.md#tool-invocation) for every external effect. One adapter per harness maps each operation to a tool, and the short tool forms an adapter accepts are its aliases, never the grammar's vocabulary.

`DISCOVER_RESOURCES`
Find resources by pattern · the adapter maps GLOB to it `DISCOVER_RESOURCES "<pattern>" INTO <resources>`

`READ_RESOURCE`
Read one resource · the adapter maps READ to it `READ_RESOURCE <resource> INTO <content>`

`SEARCH_CONTENT`
Search content for a term · the adapter maps GREP to it `SEARCH_CONTENT <content> FOR <term> INTO <matches>`

`ANALYZE_CONTENT`
Analyze content against criteria `ANALYZE_CONTENT <content> AGAINST <criteria> INTO <findings>`

`EXTRACT_FACTS`
Isolate fields from content, preserving its meaning `EXTRACT_FACTS <fields> FROM <content> INTO <facts>`

`CALCULATE_METRIC`
Derive a measure from facts `CALCULATE_METRIC <measure> FROM <facts> INTO <value>`

`COMPOSE_ARTIFACT`
Compose an artifact from facts using a shape `COMPOSE_ARTIFACT <artifact> FROM <facts> USING <shape>`

`VALIDATE_ARTIFACT`
Validate an artifact against a schema `VALIDATE_ARTIFACT <artifact> AGAINST <schema>`

`PERSIST_ARTIFACT`
Persist an artifact to a destination · the adapter maps WRITE and EDIT to it; a refusal is named before it `PERSIST_ARTIFACT <artifact> TO <destination>`

`EXECUTE_TOOL`
Execute a command with a bound · the adapter maps BASH to it `EXECUTE_TOOL <command> WITH timeout: <bound> INTO <result>`

`REQUEST_DECISION`
Ask a party to decide · the adapter maps ASK_USER to it, and resolves it absent for a bounded reader `REQUEST_DECISION <party> WITH options: [<a>, <b>] INTO <choice>`

`REPORT_RESULT`
Report an artifact to the parties whose next work it creates `REPORT_RESULT <artifact> TO <parties>`

### Node keywords

These tokens make up the node form, which is the unit of a document. They cover the header with its four-slot tag, the contract, the substrate stage at which the node's artifact comes to be, and the slots and limits a document declares.

`NODE`
A node header · the unit of a document, one decision, one gate `# NODE <n> — <NAME>   [<layer> · <axis> · <math type> · yields: <shape>]`

`CONTRACT`
A node's contract · input, transform, constraints, output, handoff `CONTRACT:`

`YIELDS`
The shape a node's decision resolves to `yields: <set | boolean | edge-list | ranking | procedure | artifact>`

`GENESIS`
The substrate stage the node's artifact comes to be at · phase order follows it `@genesis: <existence | difference | relation | structure | transformation | constraint | emergence>`

`PRESERVES`
The distinctions a transform keeps · a lowering names what a later check needs `preserves: <distinction>, <distinction>`

`OUTPUT_CONTRACT`
The one record the next node reads, as an assignment `# OUTPUT CONTRACT`

`LIMIT`
A declared limit · stated where a reader would otherwise assume the opposite `LIMIT <name>: "<what the document cannot do>"`

`SLOT`
A slot's state · resolved, absent or deferred, declared by the adapter `SLOT {<namespace>.<name>}: RESOLVED | ABSENT | DEFERRED`

### Validation keywords

These tokens make up the handoff gate. They cover a check with its evidence and the population it was measured over, the refusal before a write, the standing of the read set, and the three verdicts, with unknown routed to blocked.

`ASSERT`
Hard assertion `ASSERT condition`

`REQUIRE`
Prerequisite check `REQUIRE dependency`

`HANDOFF`
Gate marker · the evidence-bearing gate that closes a node `HANDOFF GATE (evidence-bearing):`

`GATE`
Checkpoint marker `HANDOFF GATE:`

`CHECK`
A check in a gate · a claim about the output with the evidence that settles it `[check] <claim> (evidence: <what settles it>)`

`POPULATION`
The set a check ranges over, measured · zero of zero is not evidence `over: <set> measured: <n> / <N>`

`REFUSE`
Where a node refuses to continue · named before the irreversible write `refuse: <condition> before <write>`

`FRESHNESS`
The fingerprints an artifact was derived from · a semantic property, never a timestamp `freshness: <inputs fingerprint> + <code fingerprint>`

`STANDING`
Whether the read set moved beneath the verdict · a non-empty moved set withdraws the standing, never the verdict `standing: moved-set <set>`

`UNKNOWN`
The third verdict · an unmeasured or unevidenced claim, never a pass `unknown -> BLOCKED`

`BLOCKED`
The closure of an unknown or an unanswered decision · external input is owed `result: ... | unknown -> BLOCKED`

`PROMOTE`
Move a candidate into accepted state · only on a clean verdict, never on production `promote: <candidate> ON clean verdict`

`PUBLISH`
Cross the boundary to the external system · the party that crosses it is named `publish: <artifact> BY <party>`

`RESULT`
The result line · the next node on pass, the repair owner on failure, blocked on unknown `result: pass -> NODE <n+1> | <failure> -> REPAIR (owner: <node>) | unknown -> BLOCKED`

`REPAIR`
The repair edge · re-enters at the earliest node that can supply the missing evidence `REPAIR (owner: NODE <n>)`

`RULE_ID`
The gate's identity, the node it closes `rule_id: "<NODE NAME>"`

### Report keywords

A verdict is written as a report so that a later checker can challenge it. The report's fields record what was measured, over what, from which inputs, and whether the three termination conditions coincide.

`SUBJECT`
The node or stage the report is about `subject: <node>`

`VERDICT`
The value returned · pass, fail or unknown `verdict: pass | fail | unknown`

`DOMAIN`
The population declared and the population measured `domain: declared <N> measured <n>`

`POPULATIONS`
The partitions, each measured · their sum is the whole `populations: <part> <n>, <part> <n>`

`INPUTS`
The inputs read, by identity and fingerprint `inputs: <identity> <fingerprint>`

`CODE`
The fingerprint of the code that produced the verdict `code: <fingerprint>`

`OUTPUT`
The artifact written, by identity and fingerprint `output: <identity> <fingerprint>`

`REFUSALS`
How many times the stage refused, and why `refusals: <n> [<reason>]`

`UNRESOLVED`
What stays open, and why `unresolved: <n> [<reason>]`

`COMPLETION`
Saturated, complete and verified · the three that must coincide `completion: saturated <bool> complete <bool> verified <bool>`

### Invariant keywords

An invariant record states a property in a form that could be false, the set it quantifies over, the parties it binds, and the objector that would disagree if it stopped holding. A record with no objector declares none, and the missing check stands as declared debt.

`INVARIANT`
The record head · a property the topology relies on, with its set, its parties and its objector `INVARIANT <name>: <property> over: <set> binds: <parties> objector: <check | none>`

`PROPERTY`
The property, in a form that could be false `INVARIANT one-writer: a record has exactly one writer ...`

`OVER`
The set the property quantifies over `over: every record on the surface`

`BINDS`
The parties the property constrains · who must receive it `binds: every party writing there`

`OBJECTOR`
What would disagree if the property stopped holding · a check, or none as declared debt `objector: [check] one open fence per record | none`

### Meta keywords

The meta block and the node tags state what the document is for, which source grounds which, what it trusts, what it may touch and what it declares outside itself, and how far repair may recurse.

`META`
Metadata block `%% META %%:`

`USE`
Template usage `USE TEMPLATE name`

`TEMPLATE`
Template reference `USE TEMPLATE validation`

`CUE`
The one-line reminder a reader executes at a node `@cue: "<reminder>"`

`RECURSION_LIMIT`
A bound on repair, declared in the meta block `recursion_limit: <bound>`

`PURPOSE`
What a node decides, in one sentence `@purpose: "<what this node decides>"`

`AXIS_QUESTION`
The question a node's axis asks `@axis_question: "<the question>"`

`PRIORITY`
The authority tiers · which source grounds which, highest first `priority: <governing document> > <ontology> > <template> > <task>`

`TRUST`
What is trusted as evidence and what stays a claim `trust: tool_output = TRUSTED, prior_knowledge = UNTRUSTED`

`JURISDICTION`
What the document may touch, and what is declared outside it `jurisdiction: <in scope> | external: <declared outside>`

### Action keywords

A directive inside a node's transform opens with one of these verbs. Each grounds to a reasoning mode or a loop node, and the ones that name an effect lower to a semantic operation.

`READ`
Input acquisition · lowers to READ_RESOURCE `READ file INTO data`

`WRITE`
Output generation · lowers to PERSIST_ARTIFACT `WRITE content TO file`

`EXECUTE`
Action invocation · lowers to EXECUTE_TOOL `EXECUTE command WITH params`

`CREATE`
Construction · lowers to COMPOSE_ARTIFACT `CREATE artifact FROM template`

`DELETE`
Removal · an irreversible write, refused before it lands `DELETE file_path`

`FIND`
Discovery · lowers to DISCOVER_RESOURCES `FIND pattern IN scope`

`ANALYZE`
Inspection · lowers to ANALYZE_CONTENT `ANALYZE target FOR condition`

`VALIDATE`
Verification · lowers to VALIDATE_ARTIFACT `VALIDATE state AGAINST schema`

`VERIFY`
Confirmation against evidence `VERIFY condition`

`EXTRACT`
Isolation · lowers to EXTRACT_FACTS `EXTRACT data FROM source`

`COLLECT`
Aggregation `COLLECT items INTO container`

`FILTER`
Selection `FILTER items WHERE condition`

`COMPARE`
Comparison `COMPARE a AGAINST b`

`CONVERT`
Transformation · a lowering that names what it preserves `CONVERT data TO format`

`MERGE`
Combination `MERGE sources INTO target`

`SPLIT`
Division `SPLIT data BY delimiter`

`SORT`
Ordering `SORT items BY criteria`

`RANK`
Prioritization · the ranking a worth gate reads `RANK items BY score`

`LINK`
Association · a declared edge, never a name match `LINK source TO target`

`REPORT`
Output · lowers to REPORT_RESULT `REPORT findings`

`ADD`
Add to collection `ADD item TO list`

`APPEND`
Append to end `APPEND value TO array`

`INSERT`
Insert at position `INSERT item AT index`

`REMOVE`
Remove from collection `REMOVE item FROM list`

`MOVE`
Relocation · a create at the destination, read before it lands `MOVE file TO destination`

`COPY`
Duplication · a second derivation of one fact, declared as such `COPY file TO backup`

`BACKUP`
Preservation of the last accepted state before a mutation `BACKUP file TO location`

`RESTORE`
Recovery of the last accepted state `RESTORE FROM backup`

`LOAD`
Resource acquisition · lowers to READ_RESOURCE `LOAD config FROM file`

`SEND`
Communication · lowers to REPORT_RESULT `SEND message TO recipient`

`WAIT`
Timing control · waiting has a command `WAIT FOR condition`

`ATTEMPT`
Trial operation `ATTEMPT operation`

`FAIL`
Error termination · loud at the boundary `FAIL WITH message`

`EXIT`
Exit execution `EXIT 1`

`RETURN`
Return value · how a bounded reader ends `RETURN result`

`ITERATE`
Repetition `ITERATE operation`

`INVESTIGATE`
Deep analysis `INVESTIGATE issue`

`DETERMINE`
Decision making `DETERMINE outcome`

`ENFORCE`
Constraint application `ENFORCE rule`

`EVIDENCE`
Proof provision `EVIDENCE claim`

`PROPAGATE`
Change distribution · the ripple through declared dependencies `PROPAGATE updates`

`FINALIZE`
Completion `FINALIZE operation`

`REDUCE`
Aggregation · a fusion that drops nothing live `REDUCE items TO value`

`RENAME`
Name modification · every referencing surface enumerated first `RENAME file TO newname`

`ORDER`
Arrangement `ORDER items BY key`

`MARK`
Annotation `MARK item AS complete`

`PREDICT`
Infer a future state `PREDICT outcome FROM model`

`CLASSIFY`
Group by kind `CLASSIFY item BY type`

`EXPLAIN`
Identify the mechanism `EXPLAIN behavior`

`REFLECT`
Discover the principle behind the examples `REFLECT ON outcome`

`ABSTRACT`
Remove irrelevant detail `ABSTRACT pattern FROM cases`

`GENERALISE`
Extend examples into a principle `GENERALISE FROM examples`

`DESCRIBE`
Characterise an object `DESCRIBE structure`

`FORMALISE`
Express symbolically `FORMALISE rule AS predicate`

### Control flow keywords

These keywords mirror the flow control constructs of programming languages.

`IF`
Conditional execution `IF condition: action`

`ELSE`
Alternative branch `ELSE: alternative`

`FOR`
Iteration start `FOR EACH item IN list:`

`EACH`
Iterator marker `FOR EACH x IN items:`

`WHILE`
Conditional loop `WHILE condition: action`

`TRY`
Exception handling start `TRY: risky_op`

`CATCH`
Exception handler `CATCH: handle_error`

`EXCEPT`
Exception alternative `EXCEPT: recovery`

`FINALLY`
Cleanup block `FINALLY: cleanup`

`MATCH`
Pattern matching `MATCH value:`

`CASE`
Match branch `CASE pattern: action`

`DEFAULT`
Fallback case · a declared default, never a masked failure `DEFAULT: fallback`

`WHEN`
Event trigger `WHEN event: action`

`UNLESS`
Negated conditional `UNLESS condition: action`

`UNTIL`
Loop terminator `UNTIL done`

`GUARD`
Early exit check `GUARD cond ELSE: exit`

`BREAK`
Exit loop `BREAK`

`CONTINUE`
Skip iteration `CONTINUE`

`GOTO`
Jump to label `GOTO label`

`START`
Flow start marker `START process`

`END`
Flow end marker `END`

`STOP`
Termination `STOP`

`LOOP`
Loop marker `LOOP BACKTO step`

`STEP`
Step marker `STEP 1: action`

`RULE`
Rule definition `RULE name: body`

`IN`
Containment test `item IN collection`

`MATCHES`
Pattern test `value MATCHES pattern`

### Declaration keywords

These keywords declare the variables and types that hold a document's state.

`SET`
Variable assignment `SET name = value`

`DECLARE`
Typed declaration `DECLARE x: string`

`DEFINE`
Constant definition `DEFINE PI = 3.14`

`LET`
Local binding `LET temp = expr`

`CONST`
Immutable value `CONST MAX = 100`

### Modifier keywords

A modifier qualifies and strengthens a line inside a property. It never heads a block, because a block head states no set, no parties and no objector, and the invariant record carries all three.

`MUST`
Mandatory requirement · a modifier inside a property `MUST validate first`

`NEVER`
Prohibition · a modifier inside a property `NEVER delete without backup`

`ALWAYS`
Invariance · a modifier inside a property `ALWAYS log changes`

`REQUIRED`
Necessity marker `REQUIRED field`

`MANDATORY`
Obligation marker `MANDATORY check`

`CRITICAL`
Repair ordering among failures, never a softer verdict `CRITICAL validation`

`ABSOLUTE`
No exceptions `ABSOLUTE rule`

`FORBIDDEN`
Absolute prohibition `FORBIDDEN: direct DB`

### Coordination keywords

A [shared surface](ORCHESTRATION.md#shared-surfaces) makes this structure explicit. It consists of the surface, its records, each with exactly one writer, the addressed items inside them, the typed edges between records, the states derived from those edges, the reader classes, and the one operation that posts and waits. The waiting, locking and retry tokens describe the same model from one party's turn.

`AWAIT`
Async wait · waiting has a command, a turn never ends to wait `AWAIT op INTO result`

`PARALLEL`
Concurrent execution `PARALLEL: tasks END`

`DELEGATE`
Task handoff · a bounded reader receives a task and returns `DELEGATE task TO reader`

`QUEUE`
Task queuing `QUEUE operation`

`RETRY`
Retry on failure · bounded by a declared limit `RETRY operation`

`LOCK`
Resource lock · the barrier around an exclusive write `LOCK resource`

`UNLOCK`
Release lock `UNLOCK resource`

`SURFACE`
A file parties read and write · its key declared in the header, never derived from the path `SURFACE <key>:`

`RECORD`
One addressable claim inside a surface · exactly one writer `RECORD <id> subject: <key>`

`ITEM`
An addressed span inside a record · its id allocated by the tool `ITEM <id> TO <reader>: <claim>`

`PARENT`
Edge · the target reduces this surface upward `PARENT <surface>`

`SATISFIED_BY`
Edge · the record resolves when the artifact exists `SATISFIED_BY <artifact>`

`BLOCKS`
Edge · the target cannot close first `BLOCKS <record>`

`ANSWERS`
Edge · this record acts on the target `ANSWERS <record>`

`REFUTES`
Edge · this record contradicts the target with evidence `REFUTES <record>`

`SUPERSEDES`
Edge · this record replaces the target `SUPERSEDES <record>`

`OPEN`
Derived state · an unresolved outbound edge, never written `state: OPEN`

`ABSORBED`
Derived state · the satisfying artifact exists; extract, then delete `state: ABSORBED`

`READER`
A party's class, derived from what it received · participant or bounded `READER <party> AS participant | bounded`

`WAIT`
Post and wait as one operation · reports the diff since this reader last looked `WAIT ON <surface> AS <reader> INTO <diff>`

`BARRIER`
Proceed with an exclusive write only once every peer is parked `BARRIER ON <surface>`

`SWAP`
Compare-and-swap on the writer's own span · refuses an overlap with its diff `SWAP <span> AGAINST <read>`

### State machine keywords

A state machine makes a lifetime explicit, meaning the states a thing can be in and the transitions that are legal between them. In a coordinated document a state is derived from the graph and never written, so the machine declares what may happen, not what has.

`STATE_MACHINE`
Machine declaration · makes a lifetime or a derived-state set explicit `STATE_MACHINE workflow:`

`STATE`
State definition · a state is derived from the graph, never written `STATE pending:`

`TRANSITION`
State change rule `TRANSITION FROM a TO b`

`ON`
Event trigger `ON approval`

`FROM`
Source state `FROM pending`

`TO`
Target state `TO approved`

`ENTRY`
Entry action `ENTRY: notify`

`EXIT`
Exit action `EXIT: cleanup`

### DAG keywords

A [dependency graph](../ontology/PRINCIPLES.md#arch-dependency-graph) makes explicit what depends on what, as declared by the referent and never inferred from a name. [The loop](../START.md#the-loop) spine of a document is one such graph, and a repair edge is a back-edge on it.

`DAG`
Graph declaration · makes a dependency graph explicit; the loop spine is one `DAG pipeline:`

`NODE`
Node definition `NODE build:`

`DEPENDS_ON`
Dependencies · declared by the referent, never inferred from a name `DEPENDS_ON [a, b]`

`AFTER`
Sequencing `AFTER compile`

`BEFORE`
Reverse sequencing `BEFORE deploy`

`PARALLEL_GROUP`
Parallel nodes · peers with no edge between them `PARALLEL_GROUP: a, b`

### Priority queue keywords

A priority queue makes a ranking explicit, with the candidates ordered by a declared worth. The branch ranking a worth gate emits is one, and a peek returns the selected branch.

`PRIORITY_QUEUE`
Queue declaration · makes a ranking explicit; the branch ranking a worth gate emits is one `PRIORITY_QUEUE branches:`

`PRIORITY`
Priority value · utility minus cost `PRIORITY = 10`

`ENQUEUE`
Add to queue `ENQUEUE task TO q`

`DEQUEUE`
Remove from queue `DEQUEUE FROM q`

`PEEK`
View top item · the selected branch `PEEK queue`

`HEAPIFY`
Reorder queue `HEAPIFY queue`

`COMPARE_BY`
Comparison function `COMPARE_BY priority`

### Flowchart keywords

A flowchart is the rendered projection of a declared structure. It shows a graph, a lifetime or a ranking to a reader, and it never carries a structure the document did not declare elsewhere.

`FLOWCHART`
Flow declaration · the rendered projection of a declared structure `FLOWCHART process:`

`MERMAID`
Diagram syntax · a rendering, never the structure itself `MERMAID flowchart:`

`LAYOUT`
Flow direction `LAYOUT vertical`

`SUBGRAPH`
Nested group `SUBGRAPH auth:`

### Document type keywords

These keywords name the document type in a declaration of the form THIS {TYPE} {VERB} description.

`AGENT`
Agent definition `THIS AGENT PERFORMS...`

`WORKFLOW`
Multi-node process `THIS WORKFLOW EXECUTES...`

`PROTOCOL`
Standard procedures `THIS PROTOCOL DEFINES...`

`POLICY`
Constraint system `THIS POLICY ENFORCES...`

`CHECKLIST`
Task tracking `THIS CHECKLIST PROVIDES...`

`TEMPLATE`
Reusable pattern `THIS TEMPLATE IMPLEMENTS...`

`TASK`
Single objective `THIS TASK EXECUTES...`

`INSTRUCTION`
General guidance `THIS INSTRUCTION IS...`

`PROMPT`
Model interaction `THIS PROMPT IS...`

`COMMAND`
Executable command `THIS COMMAND EXECUTES...`

`TEST`
Test specification `THIS TEST PERFORMS...`

`DEBUG`
Debugging session `THIS DEBUG RESOLVES...`

`VERIFICATION`
Compliance verification `THIS VERIFICATION PERFORMS...`

`DISTILLATION`
Pattern distillation `THIS DISTILLATION DISTILLS...`

`AUDIT`
Forensic audit `THIS AUDIT AUDITS...`

`TRANSLATION`
Translation audit `THIS TRANSLATION AUDITS...`

`COMPOSITION`
Document composition `THIS COMPOSITION RENDERS...`

### Document verbs

These verbs follow the type in a document declaration.

`IS`
Identity `THIS INSTRUCTION IS...`

`ENFORCES`
Constraint `THIS POLICY ENFORCES...`

`EXECUTES`
Action `THIS WORKFLOW EXECUTES...`

`HAS`
Possession `THIS AGENT HAS...`

`PERFORMS`
Behavior `THIS AGENT PERFORMS...`

`PROVIDES`
Offering `THIS CHECKLIST PROVIDES...`

`IMPLEMENTS`
Realization `THIS TEMPLATE IMPLEMENTS...`

`DEFINES`
Specification `THIS PROTOCOL DEFINES...`

`MANAGES`
Control `THIS AGENT MANAGES...`

`COORDINATES`
Orchestration `THIS WORKFLOW COORDINATES...`

`GENERATES`
Creation `THIS TEMPLATE GENERATES...`

`RESOLVES`
Resolution `THIS DEBUG RESOLVES...`

`FINDS`
Discovery `THIS DEBUG FINDS...`

`FIXES`
Correction `THIS DEBUG FIXES...`

`VERIFIES`
Verification `THIS VERIFICATION VERIFIES...`

`CLASSIFIES`
Classification `THIS VERIFICATION CLASSIFIES...`

`DISTILLS`
Distillation `THIS DISTILLATION DISTILLS...`

`ABSTRACTS`
Abstraction `THIS DISTILLATION ABSTRACTS...`

`ELIMINATES`
Elimination `THIS DISTILLATION ELIMINATES...`

`AUDITS`
Audit `THIS AUDIT AUDITS...`

`MEASURES`
Measurement `THIS AUDIT MEASURES...`

`SCORES`
Scoring `THIS AUDIT SCORES...`

`CORRECTS`
Correction `THIS TRANSLATION CORRECTS...`

`RENDERS`
Rendering `THIS COMPOSITION RENDERS...`

`COMPOSES`
Composition `THIS COMPOSITION COMPOSES...`

`FOLDS`
Folding `THIS COMPOSITION FOLDS...`

### Contextual keywords

These prepositions and connectors state the relation between the operands of a line.

`INTO`
Destination `READ file INTO data`

`FROM`
Source `EXTRACT FROM response`

`WITH`
Association `EXECUTE WITH params`

`USING`
Instrument `VALIDATE USING schema`

`FOR`
Purpose/Iteration `SEARCH FOR pattern`

`IN`
Containment `FIND key IN object`

`TO`
Target `WRITE TO file`

`AS`
Alias/Role `BIND result AS alias`

`BETWEEN`
Range `value BETWEEN 1 AND 10`

`AGAINST`
Comparison target `VALIDATE AGAINST schema`

`BASED_ON`
Foundation `CREATE BASED_ON template`

`WITHOUT`
Exclusion `EXECUTE WITHOUT logging`

`WHERE`
Filter condition `FIND WHERE x > 0`

`CONTENT`
Data marker `WRITE CONTENT data`

`NOT`
Negation `NOT condition`

`STYLE`
Formatting `STYLE output`

### An adapter's aliases

The aliases below belong to one adapter, and they are shown as an instance of a binding rather than as grammar. The grammar carries no tool name, so a document names the operation, and the binding for a harness maps its short forms to the operation and the operation to whichever tool performs it there. Another harness ships another table, and the document does not change.

`READ`
An alias for READ_RESOURCE `READ "<file>" INTO <content>`

`WRITE`
An alias for PERSIST_ARTIFACT `WRITE <content> TO <file>`

`EDIT`
An alias for PERSIST_ARTIFACT over a span `EDIT <file> WITH before: "<span>", after: "<span>"`

`GLOB`
An alias for DISCOVER_RESOURCES `GLOB "<pattern>" INTO <files>`

`GREP`
An alias for SEARCH_CONTENT `GREP "<term>" IN <scope> INTO <matches>`

`BASH`
An alias for EXECUTE_TOOL `BASH "<command>" WITH timeout: <bound>`

`WEB_FETCH`
An alias for READ_RESOURCE over a remote address `WEB_FETCH "<address>" INTO <content>`

`WEB_SEARCH`
An alias for DISCOVER_RESOURCES over the web `WEB_SEARCH "<query>" INTO <hits>`

`TASK`
An alias for DELEGATE to a bounded reader `TASK "<objective>" WITH agent: <role> -> <result>`

`ASK_USER`
An alias for REQUEST_DECISION `ASK_USER "<question>" WITH options: [<a>, <b>]`

---

Chapters: [Introduction](INTRODUCTION.md) · [Guide](GUIDE.md) · [Orchestration](ORCHESTRATION.md) · [Patterns](PATTERNS.md) · [Keywords](KEYWORDS.md) · [Grammar](GRAMMAR.md) · [Validation](VALIDATION.md) · [Templates](TEMPLATES.md)
