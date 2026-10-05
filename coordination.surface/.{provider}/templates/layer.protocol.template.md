---
name: layer.protocol
status: current
summary: Executable PAG meta-template that converts an executed document into a template embodying the four-layer ten-node derivation-loop.
description: Executable template. Converts an executed document or prompt into a template by restructuring it onto the four-layer derivation-loop (substrate · epistemic · conative · evaluative) — ten nodes, every decision typed to a math shape, the four mandatory-always gates (teleology, admissibility, verification, termination) enforced — by itself walking that loop: orient (read + diagnose form), intent (worth full-shaping?), see + derive + project (units to nodes, relocations, node set), act (fenced template with per-node contracts + gates), constrain (embody-not-narrate admissibility), verify (the tells + format), the refutes-back edge, commit (place beside original), terminate. A descriptive doc is NOT full-shaped. The four layers, the ten nodes, the tells, the relocations, and the mechanics are the process's knowledge base — the shared structure every template embodies.
type: template
domain: [ai-governance, process]
keywords: [layered-reasoning, derivation-loop, four-layers, ten-nodes, substrate-genesis, teleology-gate, math-typed, yields-shape, template-conversion, evidence-gate, relocation, fence, self-applying]
version: 2
staleness-days: -1
depends-on:
supersedes:
---

# Layered Reasoning Composition Template

```py CODE: PAG layer template
%% META %%:
priority: NOTE-CANON > this process > the exemplar templates > memory
trust: source_read_fresh = TRUSTED, prior_knowledge = UNTRUSTED, a_gate_without_evidence = CEREMONY
objective: convert an executed document/prompt into a template that EMBODIES the four-layer ten-node
           derivation-loop, with every rule relocated to the node that owns its decision
recursion_limit: 3

# --- SLOT ABSENCES THIS TEMPLATE IS BOUND BY (declared once, honored wherever they appear) ---
#   An abstract {slot} resolves against the adapter binding. A slot with NO analogue resolves
#   ABSENT, and the branch depending on it DOES NOT RUN — the absence is declared, never faked.
#   ABSENT here: {model} — model selection belongs to the runtime and is NEVER named in an emitted
#     artifact, so a template derived by this loop declares none. A value written into an absent
#     slot has no source, and every artifact rendered from that template inherits it as though it
#     had one — which is why the absence is stated rather than defaulted.
principle: a rule is only as strong as the node it is attached to — place each rule where its decision
           is made, and express it as that node's start-to-end control procedure, typed to a math shape

# --- THE FOUR LAYERS (each answers one question about the conversion) -------------------------
#   substrate  — "How does the template come to be?"      grounds node decomposition (LAYER 0)
#   epistemic  — "How is the source known?"               orient · see · derive · project · act
#   conative   — "Is it worth full-shaping, and how?"     intent · constrain            (MANDATORY-ALWAYS)
#   evaluative — "Does it embody the shape, and done?"    verify · commit · terminate    (MANDATORY-ALWAYS)
#
# --- YIELDS-SHAPE LEGEND (every decision resolves to a typed shape) --------------------------
#   set-theory → set|boolean · logic → boolean · graph → edge-list · algebra → ordered-structure
#   analysis → operation · optimization → boolean|ranking · topology → boolean
#   probability → number[0,1] · information-theory → hash|novelty-score · computation → procedure
#   dynamical-systems → boolean|counter
#
# --- MANDATORY-ALWAYS GATES ------------------------------------------------------------------
#   TELEOLOGY  tel-priority (NODE 2)  → the source is worth full-shaping (executed, not descriptive); node set chosen by worth
#   TELEOLOGY  constrain    (NODE 7)  → admissible: embody-not-narrate, no history, fenced, parameterized
#   VERIFY     ver-stop     (NODE 8)  → the tells present in order, every relocation landed, format clean
#   TERMINATE  ter-stop     (NODE 10) → saturation AND completion AND verification; a descriptive source terminates as reference
# The selectable epistemic axes run WHEN-RELEVANT; the four gates above run ALWAYS.

OPERATIONS: this process READs and SEARCHes the source and WRITEs the template through the adopted
runtime's tools, mapped per runtime in BOOTSTRAP.md. The surfaces it names (the intel tree under
{surface.behavior_tree}, a host's on-write formatter where one runs) are the runtime's real surface, not
project bindings to abstract; keep them concrete.

Each node declares its layer, axis, mathType, yields-shape, input, transformation, constraint set, and
one evidence-bearing handoff gate. A node reads only the prior node's output contract. The refutes-back
edge fails backward to the earliest node that can supply the missing evidence.


# ============================================================================
# LAYER 0 — SUBSTRATE  (genesis grammar; grounds node decomposition in DERIVE/PROJECT)
# ============================================================================
@purpose: "Model how the TEMPLATE comes to be, so the node set is a genesis of the source's control flow, not padding"
@question: "How does the template come to be?"

DECLARE substrate_cycle: array
SET substrate_cycle = ["existence", "difference", "relation", "structure", "transformation", "constraint", "emergence"]
DECLARE substrate_recursion: object
SET substrate_recursion = {from: "emergence", to: "difference"}

DECLARE genesis_grammar: array
SET genesis_grammar = [
  {stage: "existence",      mathType: "set-theory",        yields: "set|boolean",       asks: "does the source exist / are its units enumerated?"},
  {stage: "difference",     mathType: "logic",             yields: "boolean",           asks: "executed vs descriptive; which unit governs which decision?"},
  {stage: "relation",       mathType: "graph",             yields: "edge-list",         asks: "which node owns each unit's decision?"},
  {stage: "structure",      mathType: "algebra",           yields: "ordered-structure", asks: "what node set + relocations organize the control flow?"},
  {stage: "transformation", mathType: "analysis",          yields: "operation",         asks: "how is the fenced template composed?"},
  {stage: "constraint",     mathType: "optimization",      yields: "boolean|ranking",   asks: "embody-not-narrate, no history, fenced, typed?"},
  {stage: "emergence",      mathType: "dynamical-systems", yields: "boolean|counter",   asks: "does the template embody the shape; did a tell fail?"}
]

FUNCTION genesis_rank(stage):
  RETURN INDEX_OF(substrate_cycle, stage)


# ============================================================================
# THE LOOP SPINE  (the ten nodes — the shared structure every template embodies)
# ============================================================================
# node       layer       axis           mathType             yields                      transition out
# ---------- ----------- -------------- -------------------- --------------------------- -------------------------------------
# orient     epistemic   ontology       set-theory           units + form                sequences → intent
# intent     conative    teleology      optimization         worth full-shaping + node set GATE tel-priority → see | descriptive → reference
# see        epistemic   analysis       graph                unit->node assignments      sequences → derive
# derive     epistemic   reasoning      logic                node set + relocations      sequences → project
# project    epistemic   reasoning      logic                conversion plan             sequences → act
# act        epistemic   formalization  computation          fenced template             sequences → constrain
# constrain  conative    teleology      optimization         embodiment admissibility    GATE → verify | onFail repair
# verify     evaluative  verification   logic + probability  the tells + format          GATE ver-stop; onFail refutes-back (bounded)
# commit     evaluative  representation information-theory    placed template + report    sequences → terminate
# terminate  evaluative  termination    set-theory           ter-stop boolean            GATE ter-stop → STOP | descriptive → reference terminal


# ============================================================================
# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: units + form]
# ============================================================================
@purpose: "Read the source fresh, enumerate its units, and diagnose its form — executed converts, descriptive does not"
@axis_question: "What is the doc, and does it convert?"
@cue: "DIAGNOSE_BEFORE_CONVERT"

CONTRACT:
  input:        the source doc/prompt; the note canon; the KNOWLEDGE BASE
  transform:    read source fresh (verify load-bearing claims) → enumerate content units → diagnose form
  constraints:  never restructure on assumption (read the live file); form is diagnosed here, worth-judged at NODE 2
  output:       frame { units[], form: executed|descriptive, claims_verified }
  handoff:      source read fresh AND every unit enumerated AND form diagnosed (yields: boolean)

READ the source in full; VERIFY its load-bearing claims against the live file (claims_need_evidence)
ENUMERATE its content units: phases, rules, data tables, gates, the ALWAYS/NEVER tail
DIAGNOSE form: does the AI or a human RUN this (prompt/agent/generator/checklist/protocol/runbook) → executed; or READ it to understand (reference/spec/contract/note) → descriptive

HANDOFF GATE (evidence-bearing):
  rule_id: "ORIENT"   yields: boolean
  [check] source read from the live file this pass (evidence: frame.units)
  [check] form diagnosed executed | descriptive (evidence: frame.form)
  result: pass → NODE 2 INTENT (owner: orient)


# ============================================================================
# NODE 2 — INTENT      [conative · teleology · optimization · yields: worth full-shaping + node set]
# ============================================================================
@purpose: "Decide whether the source is WORTH full-shaping (executed) vs kept as reference (descriptive), and choose the node set by its real control flow"
@axis_question: "Is it worth full-shaping, and to what shape?"   @mandatory: always   @selectable: false
@cue: "WORTH_BEFORE_SHAPE"

CONTRACT:
  input:        frame
  transform:    judge full-shaping worth (executed vs descriptive) → size the node set to the real control flow
  constraints:  teleology is MANDATORY-ALWAYS; a DESCRIPTIVE doc (reference/spec/contract/note) is NOT worth full-shaping — it gets only tell #1 (frame-first) + tell #4 (constrain-in-place); forcing the ten-node loop onto a doc with no control flow is the Procrustean failure; the ten nodes are the shared structure, but a role may fold when the source has no distinct decision there (never pad)
  output:       teleology_bundle { full_shape, node_set[], reason }
  handoff:      GATE tel-priority — executed → full-shape with a node set sized to control flow; descriptive → reference (yields: boolean)

DECLARE teleology_nodes: array
SET teleology_nodes = [
  {id: "tel-objective", asks: "a template that embodies the derivation-loop?",   yields: "set"},
  {id: "tel-utility",   asks: "how much does full-shaping this source gain?",     yields: "number"},
  {id: "tel-cost",      asks: "what Procrustean-force risk does it carry?",        yields: "number"},
  {id: "tel-priority",  asks: "is this source worth full-shaping to the loop?",    yields: "boolean", role: "injection-gate",
     decision_test: "executed form AND the ten-node loop fits its real control flow"}
]

# OUTPUT CONTRACT
SET full_shape = (frame.form == "executed")
IF full_shape: SIZE node_set to the source's real control flow (the ten nodes; fold a role with no distinct decision, never pad)
ELSE: SET node_set = ["frame-first", "constrain-in-place"]   # descriptive: partial shape only
SET teleology_bundle = {full_shape: full_shape, node_set: node_set, reason: frame.form}

HANDOFF GATE (tel-priority injection-gate):
  rule_id: "INTENT"   yields: boolean
  [check] full-shape worth judged from form (evidence: teleology_bundle.full_shape)
  [check] node set sized to control flow, not padded to ten (evidence: teleology_bundle.node_set)
  result: full_shape → NODE 3 SEE | descriptive → REPAIR (abort to reference; apply only frame-first + constrain-in-place)


# ============================================================================
# NODE 3 — SEE         [epistemic · analysis · graph · yields: unit->node assignments]
# ============================================================================
@purpose: "Assign each unit to the node that owns its decision"
@axis_question: "How is the source to be seen — which node owns each unit?"
@cue: "PLACE_EACH_RULE_AT_ITS_NODE"

CONTRACT:
  input:        frame (executed) + teleology_bundle
  transform:    for each unit → ask which decision it governs → assign to its owning node (see THE TEN NODES)
  constraints:  a rule lives where its decision is made (relocate, don't centralize); a worth/utility-cost rule → the conative intent/constrain node; an untyped decision gets a yields-shape
  output:       assignments { unit_assignments }
  handoff:      every unit assigned to an owning node (yields: edge-list + boolean)

FOR EACH unit IN frame.units: ASK "which decision does this govern?" → assign to orient|intent|see|derive|project|act|constrain|verify|commit|terminate (see THE TEN NODES)

HANDOFF GATE (evidence-bearing):
  rule_id: "SEE"   yields: edge-list + boolean
  [check] every unit assigned to an owning node (evidence: assignments.unit_assignments)
  result: pass → NODE 4 DERIVE (owner: see)


# ============================================================================
# NODE 4 — DERIVE      [epistemic · reasoning · logic · yields: node set + relocations]
# ============================================================================
@purpose: "Choose the node set from the assignments and plan the relocations"
@axis_question: "Why this node set, and what relocates?"
@cue: "PLAN_THE_RELOCATIONS"

CONTRACT:
  input:        assignments
  transform:    choose the node set (fold roles with no distinct decision) → plan relocations from THE RELOCATIONS → name nodes
  constraints:  count follows control flow (fold, never pad); name nodes from THE NODE-NAME VOCABULARY; keep owner: tokens consistent with node names
  output:       plan_core { node_set[], relocations[], node_names }
  handoff:      node set justified by control flow AND a relocation planned for every anti-pattern found (yields: boolean)

CHOOSE node_set: one role may fold (measure + score) where the source has no distinct decision; the ten nodes are the ceiling, not a quota
PLAN relocations from THE RELOCATIONS
NAME nodes from THE NODE-NAME VOCABULARY

HANDOFF GATE (evidence-bearing):
  rule_id: "DERIVE"   yields: boolean
  [check] node count follows control flow, not padded to ten (evidence: plan_core.node_set)
  [check] a relocation planned for every lexical-ban / scattered-failure / severity-grouping / priming / boolean-gate / missing-completion / missing-worth-gate / untyped-decision found (evidence: plan_core.relocations)
  result: pass → NODE 5 PROJECT (owner: derive)


# ============================================================================
# NODE 5 — PROJECT     [epistemic · reasoning · logic · yields: conversion plan]
# ============================================================================
@purpose: "Order the node set by the loop spine and the substrate genesis, and assemble the conversion plan"
@axis_question: "What conversion plan follows?"
@cue: "ORDER_AS_THE_LOOP"

CONTRACT:
  input:        plan_core
  transform:    order the node set by the loop spine (orient → ... → terminate) grounded in genesis → assemble the plan
  constraints:  the order is the loop spine; the four mandatory-always gates (intent, constrain, verify/ver-stop, ter-stop) are always present even when other nodes fold
  output:       plan { ordered_nodes[], relocations[], node_names, mandatory_gates }
  handoff:      nodes ordered by the loop spine AND the mandatory-always gates present (yields: edge-list + boolean)

ORDER plan_core.node_set BY the loop spine THEN genesis_rank INTO ordered_nodes
CONFIRM the mandatory-always gates present: tel-priority (intent), constrain admissibility, ver-stop, ter-stop
SET plan = {ordered_nodes: ordered_nodes, relocations: plan_core.relocations, node_names: plan_core.node_names, mandatory_gates: [tel-priority, constrain, ver-stop, ter-stop]}

HANDOFF GATE (evidence-bearing):
  rule_id: "PROJECT"   yields: edge-list + boolean
  [check] nodes ordered by the loop spine, grounded in genesis (evidence: plan.ordered_nodes)
  [check] the four mandatory-always gates present (evidence: plan.mandatory_gates)
  result: pass → NODE 6 ACT (owner: project)


# ============================================================================
# NODE 6 — ACT         [epistemic · formalization · computation · yields: fenced template]
# ============================================================================
@purpose: "Write the template_* artifact — LAYER 0 + loop-spine + per-node contracts + evidence gates, fenced, stripped, parameterized, typed"
@axis_question: "What does the conversion resolve to?"
@cue: "EMBODY_DONT_NARRATE"

CONTRACT:
  input:        plan
  transform:    write frontmatter → strip → keep → write META (four-layers + yields legend + mandatory gates) → LAYER 0 substrate → LOOP SPINE table → each node (contract + one evidence gate, layer/axis/mathType/yields header) → CROSS-NODE INVARIANTS → fence the body
  constraints:  EMBODY the shape, never narrate it (no model-block); no history/archeology (overwrite_dont_annotate); a node reads only the prior node's output; every decision typed to a yields-shape; FENCE the body; write globs as call-forms; comment-banner node headers
  output:       artifact { template_md }
  handoff:      template written AND every node has a contract + one evidence gate + a typed header AND the body is fenced AND no meta-narration / no history (yields: procedure)

APPLY THE MECHANICS (below): frontmatter → strip → keep → META → LAYER 0 → LOOP SPINE → nodes → CROSS-NODE INVARIANTS → fence

HANDOFF GATE (evidence-bearing):
  rule_id: "ACT"   yields: procedure
  [check] every node carries layer/axis/mathType/yields + input/transform/constraints/output/handoff + one evidence-bearing gate (evidence: artifact.template_md)
  [check] LAYER 0 substrate + LOOP SPINE + the four mandatory-always gates present (evidence: artifact.template_md)
  [check] no meta-narration, no history; body fenced; host literals parameterized (evidence: artifact.template_md)
  result: pass → NODE 7 CONSTRAIN (owner: act)


# ============================================================================
# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: embodiment admissibility]
# ============================================================================
@purpose: "Gate the written template on admissibility BEFORE the tells — embody-not-narrate, no history, fenced, parameterized"
@axis_question: "Is the template admissible?"   @mandatory: always   @selectable: false
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
  input:        artifact
  transform:    check no meta-narration → check no history/archeology → check body fenced → check host literals parameterized
  constraints:  teleology is MANDATORY-ALWAYS; meta-narration ("this follows the model"), history residue, an unfenced body, or an unparameterized host binding is INADMISSIBLE
  output:       admissibility { ok, narration[], history[], unfenced, unparameterized[] }
  handoff:      GATE — no narration AND no history AND fenced AND parameterized (yields: boolean)

FUNCTION assess_admissibility(artifact):
  DETERMINE narration = artifact CONTAINS a model-block or "this follows the ... model"
  DETERMINE history = artifact CONTAINS "was X now Y" / WHAT-CHANGED / changelog residue
  DETERMINE unfenced = the body is NOT wrapped in a fenced code block
  DETERMINE unparameterized = host literals that are project bindings not lifted to {project.*}/{convention.*}/{limits.*}/{model}
  RETURN {ok: (narration.length == 0 AND history.length == 0 AND NOT unfenced AND unparameterized.length == 0), narration: narration, history: history, unfenced: unfenced, unparameterized: unparameterized}

# OUTPUT CONTRACT
SET admissibility = assess_admissibility(artifact)

HANDOFF GATE (teleology admissibility gate):
  rule_id: "CONSTRAIN"   yields: boolean
  [check] admissibility.narration.length == 0 AND admissibility.history.length == 0 (evidence: embody not narrate, no archeology)
  [check] admissibility.unfenced == false AND admissibility.unparameterized.length == 0 (evidence: fenced, parameterized)
  result: pass → NODE 8 VERIFY | narration/history/unfenced/unparameterized → REPAIR (owner: act — re-compose)


# ============================================================================
# NODE 8 — VERIFY      [evaluative · verification · logic + probability · yields: the tells + format]
# ============================================================================
@purpose: "Judge the artifact against THE TELLS (in order) and the format checks — typed against the verification nodes"
@axis_question: "Does it embody the shape?"   @mandatory: always   @selectable: false
@cue: "THE_TELLS_IN_ORDER"

CONTRACT:
  input:        artifact + admissibility
  transform:    check THE TELLS in order → check every relocation landed → check format
  constraints:  a gate that names no evidence is ceremony (fail it); the tells must appear IN ORDER; confidence is the fraction of tells present
  output:       validation { tells_present, relocations_applied, format_ok, refuter, findings[] }
  handoff:      GATE ver-stop — all tells present in order AND every gate evidence-bearing AND fence held AND zero narration/history findings (yields: boolean)

DECLARE verification_nodes: array
SET verification_nodes = [
  {id: "ver-evidence",     asks: "does each tell appear with evidence?",           yields: "evidence-set", test: "each tell located in the artifact"},
  {id: "ver-ground-truth", asks: "checked against the written template, not the plan?", yields: "boolean", test: "read the artifact, grep the body"},
  {id: "ver-falsification",asks: "what would show it does not embody the shape?",   yields: "set",          test: "a missing tell / mangled fence / narration is searched for"},
  {id: "ver-confidence",   asks: "how many tells are present in order?",           yields: "number[0,1]",  test: "tells present / total tells"},
  {id: "ver-refutation",   asks: "do narration/history/ceremony findings remain?",  yields: "boolean",      test: "zero such findings"}
]

# OUTPUT CONTRACT
CHECK THE TELLS in order (frame-first, worth-before-work, order-by-dependency, constrain-at-step, gate-with-evidence, typed-decision, name-the-failure-path, declare-done-by-saturation)
CHECK every planned relocation landed
CHECK format: read the fence marker line; grep the body for star-mangle signatures; scan for meta-narration and history phrases
NAME what_missing_tell_would_refute() INTO refuter

HANDOFF GATE (ver-stop gate):
  rule_id: "VERIFY"   yields: boolean
  [check] the tells present in order; a refuter named (evidence: validation.tells_present, refuter)
  [check] every gate names its evidence; every relocation landed (evidence: validation.relocations_applied)
  [check] fence held, no star-mangling, no narration/history (evidence: validation.format_ok)
  result: all pass → NODE 9 COMMIT | any fail → REPAIR (refutes-back to the owning node, bounded)


# ----------------------------------------------------------------------------
# REPAIR EDGE  (verify/constrain --refutes-back--> owning node; or abort a descriptive source to reference)
# ----------------------------------------------------------------------------
@purpose: "Route a validation failure to its owning node, or — for a descriptive source — abort full-shaping and keep it a reference"
@cue: "FIX_AT_THE_OWNER_OR_ABORT"

CONTRACT:
  input:        an INTENT descriptive verdict, OR VERIFY findings; failed CONSTRAIN admissibility
  transform:    descriptive source → abort full-shaping (apply only frame-first + constrain-in-place, keep it a reference); else route each finding to its owning node and re-run
  constraints:  BOUNDED (max_cycles = recursion_limit = 3); NEVER Procrustean-force a descriptive doc; a mangled fence → re-fence; narration/history present → strip; a missing gate/relocation/worth-gate → back to DERIVE/ACT; surface an unresolved finding rather than loop
  output:       recovery { outcome: aborted_to_reference | fixes[] }
  handoff:      descriptive → reported as reference (not converted); else every finding fixed and re-validated OR bounded-exhausted

IF teleology_bundle.full_shape == false: REPORT "keep as reference — apply only frame-first + constrain-in-place; do not full-shape"; STOP
DECLARE repair_state: object
SET repair_state = {cycle: 0, max_cycles: 3}
WHILE validation NOT all-pass OR admissibility.ok == false:
  SET repair_state.cycle = repair_state.cycle + 1
  IF repair_state.cycle > repair_state.max_cycles: REPORT "REPAIR_LIMIT_EXCEEDED (ter-diminishing-returns)"; BREAK
  FOR EACH finding IN validation.findings:
    MATCH finding: missing_gate|missing_relocation|missing_worth_gate → RE-RUN NODE 4 DERIVE / NODE 6 ACT ; mangled_fence → re-fence in NODE 6 ; narration|history → strip in NODE 6
  RE-RUN NODE 8 VERIFY


# ============================================================================
# NODE 9 — COMMIT      [evaluative · representation · information-theory · yields: placed template + report]
# ============================================================================
@purpose: "Place the template beside its original, report honestly, and flag duplicates — as current truth, no conversion history"
@axis_question: "How is the template recorded?"
@cue: "KEEP_ORIGINAL_REPORT_TRUTH"

CONTRACT:
  input:        the validated artifact
  transform:    keep the original in place → write the template beside it → repoint references only when instructed → report scope → flag duplicates
  constraints:  keep the original beside the template unless told to replace; repoint a reference only on instruction (then grep the whole repo, update every live reference); identical copies collapse (info-theory — dedup before converting)
  output:       committed { template_path, original_kept, notes }
  handoff:      original kept AND scope reported (runtime-neutral core, not a drop-in; the layer mapping was shown first) AND duplicates flagged (yields: hash + boolean)

# OUTPUT CONTRACT
WRITE the template into the template tree the configuration resolves; where the host declares a governed documentation tree, that tree governs the placement instead; KEEP the original beside it
REPORT: runtime-specific frontmatter dropped => the template is the runtime-neutral core, not a drop-in replacement; the layer mapping was shown before the template
FLAG a second copy of the same source anywhere in the tree — convert ONE, dedup first, because two copies of one template drift and the one nobody maintains is the one a reader takes
SET committed = {template_path, original_kept: true, notes}

HANDOFF GATE (evidence-bearing):
  rule_id: "COMMIT"   yields: hash + boolean
  [check] original kept; template placed beside it (evidence: committed.original_kept)
  [check] scope + dedup reported honestly (evidence: committed.notes)
  result: pass → NODE 10 TERMINATE (owner: commit)


# ============================================================================
# NODE 10 — TERMINATE  [evaluative · termination · set-theory · yields: ter-stop boolean]
# ============================================================================
@purpose: "Stop only on saturation AND completion AND verification; a descriptive source terminates as reference — never a self-assessed stop"
@axis_question: "Are we done?"   @mandatory: always   @selectable: false
@cue: "DECLARE_DONE"

CONTRACT:
  input:        committed + validation + teleology_bundle + repair_state
  transform:    evaluate the termination node-set → terminate as template OR as reference
  constraints:  ter-stop == saturation (all tells present, relocations landed) AND completion (template placed) AND verification (format clean); a descriptive source is a valid terminal as reference
  output:       finalized { template_path, status }
  handoff:      terminal — template placed + tells embodied OR reported as reference (yields: boolean)

DECLARE termination_nodes: array
SET termination_nodes = [
  {id: "ter-completion",         asks: "is the template placed beside the original?",   yields: "boolean", test: "committed.template_path present"},
  {id: "ter-saturation",         asks: "all tells present + relocations landed?",        yields: "boolean", test: "no verify finding pending"},
  {id: "ter-diminishing-returns",asks: "have re-composes stopped clearing findings?",     yields: "counter", test: "repair cycles within recursion_limit", role: "injection-gate"},
  {id: "ter-block",              asks: "is the source descriptive (reference terminal)?", yields: "boolean", test: "teleology_bundle.full_shape == false"},
  {id: "ter-stop",               asks: "embodied, placed, and verified?",                yields: "boolean", test: "saturation AND completion AND verification", role: "completion-marker"}
]

FUNCTION evaluate_termination(committed, validation, teleology_bundle):
  SET completion  = EXISTS(committed.template_path)
  SET verification = validation.format_ok AND validation.tells_present
  SET saturation  = validation.relocations_applied AND validation.tells_present
  SET reference   = (teleology_bundle.full_shape == false)
  SET ter_stop = (saturation AND completion AND verification)
  RETURN {completion: completion, verification: verification, saturation: saturation, reference: reference, ter_stop: ter_stop}

# TERMINAL — template or reference; bounded by max_cycles in the REPAIR edge.
SET term = evaluate_termination(committed, validation, teleology_bundle)
IF term.reference == true: SET finalized = {template_path: "none", status: "kept_as_reference"}
ELSE IF term.ter_stop == true: SET finalized = {template_path: committed.template_path, status: "template"}
ELSE: SET finalized = {template_path: committed.template_path, status: "blocked"}

HANDOFF GATE (ter-stop gate):
  rule_id: "TERMINATE"   yields: boolean
  [check] finalized.status IN ["template", "kept_as_reference", "blocked"] (evidence: finalized)
  [check] template ONLY when saturation AND completion AND verification hold (evidence: term)
  [check] repair_state.cycle <= max_cycles (evidence: bounded loop)
  result: TERMINATE

FINALIZE finalized

# ============================================================================
# KNOWLEDGE BASE — the model the process consumes (the shared structure every template embodies)
# ============================================================================

## COHESION, NOT DUPLICATION (the meta principle)
The template corpus is COHESIVE by shared embodiment: every template embodies the SAME structure (the
four-layer ten-node derivation-loop) under a DIFFERENT domain orientation. The shared structure IS the
meta — inlining the full embodiment in each template is the point, never a DRY violation. There is no
"shared spine" the templates import to avoid repeating it; this meta-template DESCRIBES the shared
structure, it is not a dependency the others reference. Never refactor templates toward a referenced
spine to eliminate the shared structure.

## THE FOUR LAYERS (each answers one question)
- substrate — "how does the artifact come to be?" — the genesis grammar (existence → difference → relation → structure → transformation → constraint → emergence, recursing on difference) that grounds phase/node decomposition. LAYER 0.
- epistemic — "how is it known?" — the five selectable axes: orient (ontology) · see (analysis) · derive (reasoning) · project (reasoning) · act (formalization). Walked when-relevant.
- conative — "what is worth doing?" — teleology: intent (utility - cost priority) + constrain (admissibility). MANDATORY-ALWAYS. This is the layer the six execution-roles LACK — it is what the four-layer loop ADDS.
- evaluative — "is it right, and are we done?" — verify (verification) · commit (representation) · terminate (termination). MANDATORY-ALWAYS.

## THE TEN NODES (the loop spine — the shared structure; the six execution-roles fold in)
orient · intent · see · derive · project · act · constrain · verify · commit · terminate.
The SIX EXECUTION-ROLES (note-canon: interpretive/planning/procedural/evaluation/recovery/termination) are
the epistemic + evaluative SUBSET of this loop — interpretive=orient, planning=see+derive+project,
procedural=act, evaluation=verify, recovery=the refutes-back edge, termination=terminate. The four-layer
loop COMPLETES the six roles with the conative layer (intent + constrain — worth), the substrate genesis
(grounds decomposition), and math-typing (every decision typed to a yields-shape). A role/node folds where
the source has no distinct decision there; the ten nodes are the ceiling, never a quota.

## THE PER-NODE CONTRACT + GATE
- header: [layer · axis · mathType · yields: <shape>]. input (only the prior node's output) · transformation · constraint set (stated at the step) · output contract (the only thing downstream reads) · handoff (one evidence-bearing gate).
- gate = rule_id + yields:<shape> + [check ... (evidence: ...)] lines + result: pass → next | <fail> → owning node. Gates fail backward. A gate that names no evidence is ceremony.

## THE TELLS (the VERIFY rubric — implicit embodiment, IN ORDER)
1. frame before it acts; 2. worth before work (gate on the highest-worth admissible branch — teleology); 3. order by dependency + genesis (never grouped by priority/severity); 4. constrain at the step; 5. gate with evidence; 6. type every decision to a yields-shape; 7. name the failure path; 8. declare done by saturation AND completion AND verification (with a bound if it loops).
Plus: each unit input → transform → constraints → output → handoff; every rule where its decision is made; NEVER narrate the structure itself.

## THE RELOCATIONS (plan these at DERIVE — the real fixes)
- lexical/substring ban → semantic rubric at Verify (key on the relation to a controlled concept)
- scattered/bolted-on failure handling → the refutes-back edge (a bounded repair)
- severity/priority used as section grouping → failure-routing (block/disposition/investigate), never the ordering axis
- ambient priming prose (priority stacks, trust anchors) → an orient output contract downstream reads
- boolean checkmark gates → evidence-bearing gates
- missing worth-gate → the conative intent node (utility - cost priority) + the constrain admissibility gate
- untyped decision → a mathType + yields-shape on the node
- ungrounded decomposition → substrate genesis order (a phase never precedes its genesis predecessor)
- missing/implicit completion or a self-assessed stop → explicit ter-stop (saturation AND completion AND verification) with a bound

## THE NODE-NAME VOCABULARY (name nodes by what they DO; the loop names are canonical)
ORIENT · INTENT · SEE · DERIVE · PROJECT · ACT · CONSTRAIN · VERIFY · COMMIT · TERMINATE. Domain synonyms are fine in the @cue and @purpose, but the loop node names are the spine.

## THE MECHANICS (ACT reference)
- location/name: `<subject>.<owner>.template.md` in the template tree the configuration resolves; where a host declares its own governed documentation tree, that tree's grammar decides the name instead.
- frontmatter: type: template; domain, keywords (include derivation-loop/substrate-genesis/teleology-gate/math-typed/yields-shape), owner, created/last-verified, version, depends-on (operational only); operational description, no model-narration.
- strip: runtime-specific frontmatter (every key outside {convention.agent_keys}), meta-narration, all history/archeology.
- keep: the adapter/boundary note; parameterize host literals to {project.*}/{convention.*}/{limits.*}/{model}.
- fence: wrap the body in a fenced code block tagged text (a host's on-write formatter may rewrite the tag to py; both are safe). Unfenced pseudocode has its indent flattened and its star-globs turned into emphasis. Frontmatter + PAG line stay outside the fence.
- inside the fence: META (priority/trust/objective/recursion_limit/[stance] + the four-layers legend + the yields-shape legend + the mandatory-always gates) → the operations/adapter note → LAYER 0 SUBSTRATE (genesis grammar) → THE LOOP SPINE table → the ten nodes (each with a layer/axis/mathType/yields header) → CROSS-NODE INVARIANTS (ALWAYS/NEVER distilled from the source's rules).
- format: write globs/greps as call-forms — glob("**", "*name*.ext") / grep("class .*<name>") — not raw star-globs; use comment-banner node headers (# ==== / # NODE N — NAME [layer · axis · mathType · yields: ...]), not markdown headings.

## EXEMPLARS (all embody the ten-node loop under a different domain orientation)
The templates this package ships, each inlining the full four-layer loop under its own genesis: `checklist`
(how does anything come to be), `claim` (how does a verdict come to be), `pattern` (how does a base
abstraction come to be), `agent` (how does the agent come to be), and this one (how does the template come
to be). When unsure of an orientation, read the nearest-analogous — and the SET is read from the template
tree rather than listed here, because a list of exemplars is a roster that goes stale the first time one
lands or leaves.

# ============================================================================
# CROSS-NODE INVARIANTS  (bind every node)
# ============================================================================
ALWAYS:
  - read the source fresh and diagnose its form before converting; show the layer/node mapping before the template
  - judge full-shaping worth at NODE 2 (executed → full-shape; descriptive → reference); the ten nodes are the shared structure every template embodies
  - run the four mandatory-always gates: tel-priority (NODE 2), constrain admissibility (NODE 7), ver-stop (NODE 8), ter-stop (NODE 10)
  - type every decision to its yields-shape; ground node decomposition in the substrate genesis
  - assign each unit to the node that owns its decision; relocate rules, never centralize them
  - give every node a contract + a layer/axis/mathType/yields header + exactly one evidence-bearing gate; a node reads only the prior node's output
  - fence the body; embody the shape, never narrate it; keep the original in place; report the template as the runtime-neutral core
  - inline the full embodiment in each template (cohesion, not duplication) — never a referenced spine

NEVER:
  - skip the loop restructure (the mandatory middle step) — file straight to template just re-skins a flat doc
  - full-shape a descriptive doc (reference/spec/contract/note) — give it only frame-first + constrain-in-place
  - narrate the structure (a model-block, "this follows the model") or leave history/archeology in the artifact
  - pad the node count to ten, or group nodes by priority/severity
  - drop the conative layer (teleology worth-gates), the substrate genesis, or the yields-typing — they are what completes the six roles
  - leave a gate without named evidence, or ship unfenced pseudocode
  - refactor templates toward a shared referenced spine to eliminate the shared structure — the shared structure IS the meta
```
