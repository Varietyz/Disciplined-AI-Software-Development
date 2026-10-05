---
name: pattern.protocol
description: Executable template. Distills repeated behavioral evidence into justified shared abstraction by walking the ten-node derivation-loop across four reasoning layers — every decision typed to a math shape, the base grounded in the substrate genesis cycle, the four mandatory-always gates (teleology, admissibility, verification, termination) enforced. A base is created only on the highest-worth boundary-principle evidence; distillation is incomplete until the old pattern is proven gone.
type: template
status: current
summary: Executable PAG template that distills repeated behavioral evidence into predictable architecture by walking the four-layer derivation-loop with math-typed decisions and a genesis-grounded base.
domain: [architecture, quality]
keywords:
    [
        distillation,
        abstraction,
        base-class,
        derivation-loop,
        substrate-genesis,
        teleology-gate,
        math-typed,
        yields-shape,
        anti-pattern,
        boundary-principles,
        checkpoint,
        migration,
        elimination,
        verification,
        termination,
        roi,
    ]
version: 2
staleness-days: -1
depends-on:
supersedes:
---

# Pattern Distillation Template

```py CODE: PAG pattern template
%% META %%:
priority: BEHAVIORAL_EVIDENCE > BOUNDARY_PRINCIPLES > TASK
trust: procedural_scan = TRUSTED, naming_similarity = UNTRUSTED, prior_knowledge = UNTRUSTED
objective: create shared abstractions only on the highest-worth boundary-principle evidence, migrate
           reversibly per target, and prove the old pattern is eliminated
recursion_limit: 3

# --- SLOT ABSENCES THIS TEMPLATE IS BOUND BY (declared once, honored wherever they appear) ---
#   An abstract {slot} resolves against the adapter binding. A slot with NO analogue resolves
#   ABSENT, and the branch depending on it DOES NOT RUN — the absence is declared, never faked.
#   ABSENT here: {project.architecture_registry} — nothing in this tree carries a class hierarchy
#     or a registry of base abstractions, so the step that files a derived base into one does not
#     run, and an abstraction's home is decided by the taxonomy grammar instead.
#   {project.registry_regenerate} — nothing is generated from a registry, so there is no
#     regeneration step to invoke and no regenerated output to verify. A verification gate reading
#     one would demand evidence this tree cannot produce, which is satisfiable only by faking it.
#   {limits.max_lines} — no size cap is declared, so the size branch and its admissibility check do
#     not run; a base is bounded by the ONE reason it has to change instead of by a line count.
#   HONORING AN ABSENCE IS A PROPERTY OF THE BRANCH, NEVER OF THIS BLOCK. Declaring the absence
#     here and running the branch anyway is the defect this declaration exists to prevent: every
#     step below that names one of these slots is guarded on it RESOLVING, and every gate reading
#     one carries the same guard — a check that demands evidence from an absent slot is satisfiable
#     only by fabricating it, which reads exactly like a real pass.

# --- THE FOUR LAYERS (each answers one question about this distillation) ---------------------
#   substrate  — "How does a base come to be?"           grounds the abstraction (LAYER 0)
#   epistemic  — "How is the duplication known?"         orient · see · derive · project · act
#   conative   — "Which base is worth creating?"         intent · constrain            (MANDATORY-ALWAYS)
#   evaluative — "Is it gone, and are we done?"           verify · commit · terminate    (MANDATORY-ALWAYS)
#
# --- YIELDS-SHAPE LEGEND ---------------------------------------------------------------------
#   set-theory → set|boolean · logic → boolean · graph → edge-list · algebra → ordered-structure
#   analysis → operation · optimization → boolean|ranking · topology → boolean
#   probability → number[0,1] · information-theory → hash|novelty-score · computation → procedure
#   dynamical-systems → boolean|counter
#
# --- MANDATORY-ALWAYS GATES ------------------------------------------------------------------
#   TELEOLOGY  tel-priority (NODE 2)  → argmax(impact - effort) over admissible anti-patterns; verdict = highest-worth remediation
#   TELEOLOGY  constrain    (NODE 7)  → base admissible: boundary principles sufficient, size <= limit, migration reversible, within effort budget
#   VERIFY     ver-stop     (NODE 8)  → old pattern proven gone (only approved base-location occurrences), registry reflects truth
#   TERMINATE  ter-stop     (NODE 10) → saturation AND completion AND verification
# The selectable epistemic axes run WHEN-RELEVANT; the four gates above run ALWAYS.

SEMANTIC OPERATION BOUNDARY: steps are semantic operations — DISCOVER_RESOURCES, READ_RESOURCE,
SEARCH_CONTENT, ANALYZE_CONTENT, CALCULATE_METRIC, COMPOSE_ARTIFACT, PERSIST_ARTIFACT, CHECKPOINT,
RESTORE, EXECUTE_VERIFIER, REPORT_RESULT. A runtime ADAPTER maps them through the operation-to-tool map
BOOTSTRAP.md holds for each runtime. Content matching is
procedural, NEVER regex. Role classes, base expectations, thresholds, and the registry-regenerate
command are discovered / adapter-resolved ({project.*} / {convention.*} / {limits.*}); no runtime
path or model literal lives in the core.

Each node declares its layer, axis, mathType, yields-shape, input, transformation, constraint set,
output contract, and one evidence-bearing handoff gate. A node reads only the prior node's output
contract. The transitions are declared once in THE LOOP SPINE.


# ============================================================================
# LAYER 0 — SUBSTRATE  (genesis grammar; grounds the base in PROJECT + ACT)
# ============================================================================
@purpose: "Model how a BASE abstraction comes to be, so the migration order is a genesis, not an arbitrary sweep"
@question: "How does a base come to be?"

# A base is brought into being by passing through the genesis stages, recursing on `difference` when
# registry regeneration (emergence) surfaces a NEW duplication family the distillation had not drawn.
DECLARE substrate_cycle: array
SET substrate_cycle = ["existence", "difference", "relation", "structure", "transformation", "constraint", "emergence"]
DECLARE substrate_recursion: object
SET substrate_recursion = {from: "emergence", to: "difference"}

DECLARE genesis_grammar: array
SET genesis_grammar = [
  {stage: "existence",      mathType: "set-theory",        yields: "set|boolean",       asks: "does a base candidate exist / is it scaffolded?"},
  {stage: "difference",     mathType: "logic",             yields: "boolean",           asks: "what behavioral signature makes the shared behavior distinct?"},
  {stage: "relation",       mathType: "graph",             yields: "edge-list",         asks: "which role family relates to it?"},
  {stage: "structure",      mathType: "algebra",           yields: "ordered-structure", asks: "how are concrete vs abstract responsibilities + the template-method lifecycle arranged?"},
  {stage: "transformation", mathType: "analysis",          yields: "operation",         asks: "how does each target migrate to extend/use it?"},
  {stage: "constraint",     mathType: "optimization",      yields: "boolean|ranking",   asks: "do boundary principles + size limits + elimination bound it?"},
  {stage: "emergence",      mathType: "dynamical-systems", yields: "boolean|counter",   asks: "does the registry regenerate + ROI stabilize; did a new duplication surface?"}
]

FUNCTION genesis_rank(stage):
  RETURN INDEX_OF(substrate_cycle, stage)


# ============================================================================
# THE LOOP SPINE  (the ten nodes, their typing, and the transitions)
# ============================================================================
# node       layer       axis           mathType             yields                      transition out
# ---------- ----------- -------------- -------------------- --------------------------- -------------------------------------
# orient     epistemic   ontology       set-theory           baseline + compliance       sequences → intent
# intent     conative    teleology      optimization         ranked anti-patterns+verdict GATE tel-priority → see | onFail redirect
# see        epistemic   analysis       graph                signatures + inconsistency   sequences → derive
# derive     epistemic   reasoning      logic                boundary verdict             sequences → project
# project    epistemic   reasoning      logic                base design + migration graph sequences → act
# act        epistemic   formalization  computation          base + migrated targets      sequences → constrain
# constrain  conative    teleology      optimization         base admissibility           GATE → verify | onFail repair
# verify     evaluative  verification   logic + probability  elimination proof            GATE ver-stop; onFail refutes-back (bounded)
# commit     evaluative  representation information-theory    registry regen + ROI/history sequences → terminate
# terminate  evaluative  termination    set-theory           ter-stop boolean             GATE ter-stop → STOP | ter-block → blocked report


# ============================================================================
# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: baseline + compliance]
# ============================================================================
@purpose: "Load workspace + registry, probe capabilities, and measure the existing baseline and compliance gap through the architecture's ontological dimensions"
@axis_question: "What is the architecture landscape?"
@cue: "MEASURE_BEFORE_PROPOSE"

CONTRACT:
  input:        host architecture registry + rule sources
  transform:    probe capabilities → init auditable workspace with provenance → measure existing bases + role-class compliance → frame the landscape by ontological dimension
  constraints:  compare against existing bases before proposing new; distinguish missing ADOPTION from missing ABSTRACTION; HALT if required context unavailable
  output:       baseline { registry, capability_verdict, existing_bases, role_compliance, landscape_readout }
  handoff:      capabilities probed AND baseline measured AND compliance gap classified (yields: boolean)

# The ontological dimensions that frame a duplication landscape (walked WHEN-RELEVANT).
DECLARE ontological_dimensions: array
SET ontological_dimensions = [
  {id: "identity",    asks: "what classes exist per role?",              mathType: "set-theory",        relevant_when: "always"},
  {id: "composition", asks: "what behaviors are they made of?",          mathType: "set-theory",        relevant_when: "always"},
  {id: "structure",   asks: "how are their responsibilities arranged?",  mathType: "algebra",           relevant_when: "always"},
  {id: "relation",    asks: "what base/registry do they connect to?",    mathType: "graph",             relevant_when: "existing bases present"},
  {id: "behavior",   asks: "what do they do at runtime?",               mathType: "dynamical-systems", relevant_when: "always"},
  {id: "function",    asks: "what role does each fulfil?",               mathType: "analysis",          relevant_when: "always"},
  {id: "scale",       asks: "does the duplication recur across levels?", mathType: "topology",          relevant_when: "cross-family duplication"},
  {id: "novelty",     asks: "what deviates (inconsistency)?",            mathType: "probability",       relevant_when: "competing implementations exist"}
]

# OUTPUT CONTRACT
IF RESOLVES "{project.architecture_registry}": DISCOVER_RESOURCES it INTO registry ELSE SET registry = "ABSENT"
IF RESOLVES "{project.rule_sources}": DISCOVER_RESOURCES it INTO rule_context ELSE SET rule_context = "ABSENT"
FOR EACH capability IN ["filesystem", "search", "execution", "checkpoint"]: PROBE INTO status
CALCULATE capability_verdict IN [full, degraded, blocked] FROM status
INIT auditable workspace + manifest with input provenance; HALT if required context unavailable
IF registry != "ABSENT": EXTRACT existing base abstractions, implementation counts, hierarchy depth INTO existing_bases
ELSE: DERIVE existing_bases from the tree itself — the abstractions a reader can reach, measured rather than listed
DISCOVER role families from the tree; where "{convention.role_taxonomy}" RESOLVES, classify against it
FOR EACH role: SCAN conformance to its expected base; CALCULATE compliance rate (missing adoption vs missing abstraction) INTO role_compliance
FOR EACH d IN ontological_dimensions WHERE relevant: ANALYZE_CONTENT registry AGAINST d.asks INTO landscape_readout[d.id]
SET baseline = {registry: registry, capability_verdict: capability_verdict, existing_bases: existing_bases, role_compliance: role_compliance, landscape_readout: landscape_readout}

HANDOFF GATE (evidence-bearing):
  rule_id: "ORIENT"   yields: boolean
  [check] capabilities probed; manifest records provenance; the registry loaded WHERE its slot resolves and recorded ABSENT where it does not (evidence: baseline)
  [check] existing architecture measured; compliance gap distinguishes adoption from abstraction (evidence: role_compliance)
  result: pass → NODE 2 INTENT (owner: orient)


# ============================================================================
# NODE 2 — INTENT      [conative · teleology · optimization · yields: ranked anti-patterns + verdict]
# ============================================================================
@purpose: "Score every candidate anti-pattern by worth and gate on the highest-worth one AND its highest-worth remediation before any signing"
@axis_question: "Which base is worth creating?"   @mandatory: always   @selectable: false
@cue: "WORTH_BEFORE_WORK"

CONTRACT:
  input:        baseline
  transform:    surface candidate anti-patterns → score impact - effort → rank → choose remediation verdict per candidate by worth
  constraints:  teleology is MANDATORY-ALWAYS; impact*effort is the utility - cost score; the verdict (create_base | prefer_composition | prefer_utility | reject_abstraction) is a WORTH decision, not a reflex — a base is the highest-worth remediation only when its boundary evidence beats composition/utility
  output:       teleology_bundle { objective, ranked_anti_patterns[], verdict_by_candidate{} }
  handoff:      GATE tel-priority — selected candidate == argmax(impact - effort) among admissible; each verdict is its highest-worth remediation (yields: boolean over ranking)

DECLARE teleology_nodes: array
SET teleology_nodes = [
  {id: "tel-objective", asks: "eliminate the highest-worth duplication?",              yields: "set"},
  {id: "tel-utility",   asks: "how much does removing this anti-pattern reduce (impact)?", yields: "number"},
  {id: "tel-cost",      asks: "what effort + migration blast-radius does it cost?",     yields: "number"},
  {id: "tel-priority",  asks: "is this the highest-worth admissible anti-pattern + remediation?", yields: "boolean", role: "injection-gate",
     decision_test: "highest impact minus effort among admissible candidates"}
]

FUNCTION rank_candidates(baseline):
  # candidate anti-patterns are surfaced from the compliance gap + landscape readout; behavioral confirmation happens in SEE
  DECLARE candidates: array
  SET candidates = []
  FOR EACH gap IN baseline.role_compliance WHERE gap.kind == "missing_abstraction":
    ASSESS impact_of(gap) INTO impact; ASSESS effort_of(gap) INTO effort
    ANALYZE gap AGAINST existing_bases INTO adm   # admissible only if not already covered by an existing base
    APPEND {candidate: gap, admissible: adm.ok, utility: impact, cost: effort, score: (impact - effort)} TO candidates
  ORDER candidates BY score DESC WHERE admissible == true
  RETURN candidates

# OUTPUT CONTRACT
DECLARE teleology_bundle: object
SET ranked = rank_candidates(baseline)
DECLARE admissible: array
FILTER ranked TO admissible WHERE admissible == true
SET teleology_bundle = {objective: "eliminate the highest-worth duplication", ranked_anti_patterns: ranked, selected: (admissible.length > 0 ? admissible[0] : "none")}

HANDOFF GATE (tel-priority injection-gate):
  rule_id: "INTENT"   yields: boolean over ranking
  [check] every candidate carries impact, effort, and an admissibility verdict (evidence: ranked_anti_patterns)
  [check] selected == argmax(impact - effort) among admissible (evidence: teleology_bundle.selected)
  [check] no candidate already covered by an existing base is selected for a new base (evidence: admissible filter)
  result: pass → NODE 3 SEE
          | no admissible candidate → REDIRECT: prefer adoption of an existing base OR emit BLOCKED (ter-block)
          | selected is not argmax → REPAIR (owner: intent)


# ============================================================================
# NODE 3 — SEE         [epistemic · analysis · graph · yields: signatures + inconsistency]
# ============================================================================
@purpose: "See the selected candidate through behavioral lenses — partition by role, sign each class's behavior, surface repeated structure and inconsistency"
@axis_question: "How is the duplication to be seen — from behavior, not names?"
@cue: "SIGN_FROM_BEHAVIOR"

CONTRACT:
  input:        baseline + teleology_bundle
  transform:    partition by role → extract behavioral signatures → detect cross-class patterns + inconsistency
  constraints:  base candidates require BEHAVIORAL evidence, not naming similarity; scan procedurally (NEVER regex)
  output:       evidence { signatures, cross_class_patterns, inconsistency }
  handoff:      domains partitioned AND each class's behavior signed from evidence (yields: edge-list + boolean)

DECLARE analytical_lenses: array
SET analytical_lenses = [
  {id: "structure",  asks: "how are responsibilities organized across the family?", mathType: "algebra"},
  {id: "behavior", asks: "how does each class act (init/lifecycle/error/state)?", mathType: "dynamical-systems"},
  {id: "relation",  asks: "what repeats across the role family?",                 mathType: "graph"},
  {id: "frequency",   asks: "how often does each repeated structure occur?",        mathType: "information-theory"},
  {id: "anomaly",     asks: "what competing implementation breaks consistency?",     mathType: "probability"}
]

# OUTPUT CONTRACT
PARTITION resources by discovered semantic role WHERE role IN teleology_bundle.selected.role_family
FOR EACH class IN the family: EXTRACT behavioral signature {initialization, lifecycle hooks, error handling, state management, dependency acquisition, public orchestration} via procedural scan INTO signatures
DETECT repeated imports/init/lifecycle/error/state/dependency across the family INTO cross_class_patterns   # with occurrence counts (frequency lens)
DETECT competing implementations of one behavior INTO inconsistency   # consistency = dominant / total → {consistent, weakly_consistent, inconsistent}
SET evidence = {signatures: signatures, cross_class_patterns: cross_class_patterns, inconsistency: inconsistency}

HANDOFF GATE (evidence-bearing):
  rule_id: "SEE"   yields: edge-list + boolean
  [check] domains partitioned by role; each class's behavior signed from evidence (evidence: signatures)
  [check] repeated structure and behavioral inconsistency surfaced across the family (evidence: cross_class_patterns, inconsistency)
  result: pass → NODE 4 DERIVE (owner: see)


# ============================================================================
# NODE 4 — DERIVE      [epistemic · reasoning · logic · yields: boundary verdict]
# ============================================================================
@purpose: "Reason from behavioral evidence to the boundary verdict — is a base justified, or is composition/utility the right form?"
@axis_question: "Why a base, and what boundary follows?"
@cue: "JUSTIFY_THE_BOUNDARY"

CONTRACT:
  input:        evidence + teleology_bundle
  transform:    normalize findings into anti-patterns → evaluate boundary principles + domain coverage → render the verdict
  constraints:  create a base ONLY on sufficient boundary principles (universal, invariant, foundational, enforcing, load-reducing) + domain coverage; otherwise prefer composition / utility / local refactor
  output:       plan_core { anti_patterns[], verdict, boundary_justification }
  handoff:      the verdict justified on boundary principles + coverage (yields: boolean)

# OUTPUT CONTRACT
NORMALIZE findings INTO anti-patterns {type IN (copy_paste_duplication, behavioral_inconsistency, architectural_violation, conceptual_duplication, structural_duplication), occurrence, impact, effort, affected resources}
EVALUATE boundary principles {universal, invariant, foundational, enforcing, reducing_load} + domain coverage FOR the selected anti-pattern INTO boundary_justification
VERDICT IN [create_base_class, prefer_composition, prefer_utility, reject_abstraction] FROM boundary_justification
SET plan_core = {anti_patterns: anti_patterns, verdict: verdict, boundary_justification: boundary_justification}

HANDOFF GATE (evidence-bearing):
  rule_id: "DERIVE"   yields: boolean
  [check] base verdict rendered ONLY on sufficient boundary principles + coverage; else composition/utility/local refactor (evidence: boundary_justification)
  result: pass → NODE 5 PROJECT (owner: derive)


# ============================================================================
# NODE 5 — PROJECT     [epistemic · reasoning · logic · yields: base design + migration graph]
# ============================================================================
@purpose: "Split concrete vs abstract responsibilities grounded in the base genesis, design the lifecycle, and order the migration graph"
@axis_question: "What base structure + migration order follows?"
@cue: "STRUCTURE_AS_GENESIS"

CONTRACT:
  input:        plan_core
  transform:    split concrete-vs-abstract responsibilities → design the template-method lifecycle → order targets by ascending complexity → build the migration graph
  constraints:  the split follows the base genesis (existence/difference before structure before transformation); prove the pattern on simple targets first; the migration graph orders each target after its dependencies
  output:       plan { base_design, migration_graph[] }
  handoff:      concrete-vs-abstract split AND lifecycle defined AND migration ordered low-complexity-first (yields: edge-list + boolean)

# OUTPUT CONTRACT
IF plan_core.verdict == "create_base_class":
  SPLIT responsibilities → concrete (constructor/initialize/destroy/handleError/dependency_setup) vs abstract hooks (onInitialize/onDestroy/onError/configure/executeCore)
  DESIGN the template-method lifecycle (guard → shared → hook → error policy) INTO base_design
  ORDER migration targets BY ascending complexity THEN dependency INTO migration_graph   # simple cases first
SET plan = {base_design: base_design, migration_graph: migration_graph}

HANDOFF GATE (evidence-bearing):
  rule_id: "PROJECT"   yields: edge-list + boolean
  [check] concrete-vs-abstract responsibilities split; template-method lifecycle defined (evidence: base_design)
  [check] migration ordered low-complexity-first, each target after its dependencies (evidence: migration_graph)
  result: pass → NODE 6 ACT (owner: project)


# ============================================================================
# NODE 6 — ACT         [epistemic · formalization · computation · yields: base + migrated targets]
# ============================================================================
@purpose: "Compose the base within limits and migrate targets in genesis order, each reversible via checkpoint"
@axis_question: "What does the base resolve to?"
@cue: "PROVE_ON_SIMPLE_FIRST"

CONTRACT:
  input:        plan
  transform:    compose base (size/name/location) → per target: checkpoint → refactor → verify removal → commit | restore
  constraints:  migration is REVERSIBLE per target (checkpoint/restore); NO destructive VCS commands; where {limits.max_lines} RESOLVES, enforce base size <= it and split when oversized — where it is ABSENT, the base is bounded by its ONE reason to change and the size branch does not run
  output:       migration { base_artifact, migrated_targets[], restored_targets[] }
  handoff:      base size/name/location compliant AND each target migrated or cleanly restored (yields: procedure)

# OUTPUT CONTRACT
COMPOSE_ARTIFACT the base; ENFORCE name convention and architectural location, and size <= {limits.max_lines} ONLY where that slot resolves, INTO base_artifact
DECLARE migrated_targets: array; DECLARE restored_targets: array
FOR EACH target IN plan.migration_graph:
  CHECKPOINT
  REFACTOR to extend/use the base
  EXECUTE_VERIFIER the removed anti-pattern is gone for this target
  IF verified: COMMIT; APPEND target TO migrated_targets
  ELSE: RESTORE from checkpoint; APPEND target TO restored_targets   # reversible per target, no bad state left behind
SET migration = {base_artifact: base_artifact, migrated_targets: migrated_targets, restored_targets: restored_targets}

HANDOFF GATE (evidence-bearing):
  rule_id: "ACT"   yields: procedure
  [check] base size/name/location compliant (evidence: base_artifact)
  [check] targets migrated low-complexity-first; each failure restored from checkpoint (evidence: migrated_targets, restored_targets)
  result: pass → NODE 7 CONSTRAIN (owner: act)


# ============================================================================
# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: base admissibility]
# ============================================================================
@purpose: "Gate the composed base on admissibility BEFORE elimination proof — boundary-sufficient, within size + effort budget, reversibly migrated"
@axis_question: "Is the base still worth keeping, and is it within limits?"   @mandatory: always   @selectable: false
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
  input:        migration + plan_core + teleology_bundle
  transform:    check boundary principles still sufficient post-composition → check base size <= limit → check realized effort vs budget → check every migration reversible
  constraints:  teleology is MANDATORY-ALWAYS; a base whose boundary justification collapsed during composition, that exceeds the size limit, or whose realized effort blew the budget is INADMISSIBLE
  output:       admissibility { ok, boundary_ok, size_ok, realized_effort, budget, irreversible[] }
  handoff:      GATE — boundary sufficient AND size <= limit AND realized_effort <= budget AND zero irreversible migrations (yields: boolean)

FUNCTION assess_admissibility(migration, plan_core, teleology_bundle):
  DETERMINE boundary_ok = plan_core.boundary_justification STILL sufficient post-composition
  DETERMINE size_ok = RESOLVES "{limits.max_lines}" ? (migration.base_artifact.size <= {limits.max_lines}) : "NOT_APPLICABLE"
  CALCULATE realized_effort = effort_of(migration.migrated_targets)
  SET budget = teleology_bundle.selected.cost
  DETERMINE irreversible = migration.restored_targets WHERE restore_failed
  RETURN {ok: (boundary_ok AND (size_ok != false) AND realized_effort <= budget AND irreversible.length == 0), boundary_ok: boundary_ok, size_ok: size_ok, realized_effort: realized_effort, budget: budget, irreversible: irreversible}

# OUTPUT CONTRACT
SET admissibility = assess_admissibility(migration, plan_core, teleology_bundle)

HANDOFF GATE (teleology admissibility gate):
  rule_id: "CONSTRAIN"   yields: boolean
  [check] admissibility.boundary_ok (evidence: boundary principles still sufficient)
  [check] admissibility.size_ok is true, or NOT_APPLICABLE where {limits.max_lines} is ABSENT (evidence: the resolved cap, or its declared absence)
  [check] admissibility.realized_effort <= admissibility.budget (evidence: within the candidate's effort budget)
  [check] admissibility.irreversible.length == 0 (evidence: every migration reversible)
  result: pass → NODE 8 VERIFY
          | boundary collapsed → REPAIR (owner: derive — re-verdict, maybe composition)
          | oversize → REPAIR (owner: act — split the base)
          | over budget → REPAIR (owner: intent — re-rank the candidate)


# ============================================================================
# NODE 8 — VERIFY      [evaluative · verification · logic + probability · yields: elimination proof]
# ============================================================================
@purpose: "Prove the old pattern is eliminated across the whole scope, typed against evidence, falsification, and confidence"
@axis_question: "Is the old pattern gone?"   @mandatory: always   @selectable: false
@cue: "INCOMPLETE_UNTIL_GONE"

CONTRACT:
  input:        migration + admissibility
  transform:    scan the whole scope for the old pattern → classify each occurrence → compute elimination completeness
  constraints:  allow ONLY approved base-location occurrences; a stray occurrence is evidence of incomplete distillation; completeness is a number[0,1]
  output:       elimination { unapproved_occurrences[], completeness, refuter, proven }
  handoff:      GATE ver-stop — old pattern proven gone (zero unapproved occurrences, completeness >= threshold) (yields: boolean)

DECLARE verification_nodes: array
SET verification_nodes = [
  {id: "ver-evidence",     asks: "where does the pattern still occur?",               yields: "evidence-set", test: "occurrence scan run over whole scope"},
  {id: "ver-ground-truth", asks: "is it gone in the real source, not just the plan?",  yields: "boolean",      test: "scan actual files, not migration log"},
  {id: "ver-falsification",asks: "what stray occurrence would refute elimination?",     yields: "set",          test: "a concrete unapproved-location match is searched for"},
  {id: "ver-confidence",   asks: "how complete is the elimination?",                   yields: "number[0,1]",  test: "completeness >= threshold"},
  {id: "ver-refutation",   asks: "do unapproved occurrences remain?",                  yields: "boolean",      test: "only approved base-location occurrences remain"}
]

# OUTPUT CONTRACT
SEARCH the whole scope for the old pattern INTO occurrences   # ver-evidence over real source
FILTER occurrences TO unapproved WHERE location NOT IN approved_base_locations   # ver-falsification / ver-refutation
CALCULATE_METRIC completeness = (occurrences.count - unapproved.count) / occurrences.count   # ver-confidence, number[0,1]
NAME what_stray_occurrence_would_refute() INTO refuter
SET elimination = {unapproved_occurrences: unapproved, completeness: completeness, refuter: refuter, proven: (unapproved.count == 0)}

HANDOFF GATE (ver-stop gate):
  rule_id: "VERIFY"   yields: boolean
  [check] occurrence scan run over the whole scope from real source (evidence: ver-evidence)
  [check] only approved base-location occurrences remain; a refuter named (evidence: elimination.unapproved_occurrences, refuter)
  [check] completeness >= threshold (evidence: elimination.completeness)
  result: proven → NODE 9 COMMIT | unapproved duplicates remain → REPAIR (refutes-back to act — migrate the stragglers)


# ----------------------------------------------------------------------------
# REPAIR EDGE  (verify/constrain --refutes-back--> migrate stragglers; bounded by ter-diminishing-returns)
# ----------------------------------------------------------------------------
@purpose: "Migrate remaining occurrences reversibly, or re-verdict when the boundary collapsed — bounded"
@cue: "REVERSIBLE_UNTIL_GONE"

CONTRACT:
  input:        elimination.unapproved_occurrences; failed CONSTRAIN admissibility
  transform:    unapproved occurrences → back to ACT (checkpoint/refactor/verify/commit-or-restore) per straggler; boundary collapse → back to DERIVE
  constraints:  BOUNDED (max_cycles = recursion_limit = 3); migration stays reversible per target; NO destructive VCS commands
  output:       stragglers migrated OR marked; re-verdict if boundary collapsed
  handoff:      zero unapproved occurrences OR bounded-exhausted → blocked

DECLARE repair_state: object
SET repair_state = {cycle: 0, max_cycles: 3}
WHILE elimination.proven == false OR admissibility.ok == false:
  SET repair_state.cycle = repair_state.cycle + 1
  IF repair_state.cycle > repair_state.max_cycles: REPORT "REPAIR_LIMIT_EXCEEDED (ter-diminishing-returns)"; BREAK
  IF admissibility.boundary_ok == false: RE-RUN from NODE 4 DERIVE   # re-verdict
  ELSE: FOR EACH occ IN elimination.unapproved_occurrences: RE-RUN NODE 6 ACT for occ (checkpoint/refactor/verify/commit-or-restore)
  RE-RUN NODE 8 VERIFY


# ============================================================================
# NODE 9 — COMMIT      [evaluative · representation · information-theory · yields: registry regen + ROI/history]
# ============================================================================
@purpose: "Regenerate the architecture registry to the new truth and persist measured ROI + lessons as reusable, deduplicated evidence"
@axis_question: "How is the new truth encoded + recorded?"
@cue: "REGEN_THEN_MEASURE"

CONTRACT:
  input:        baseline + migration + elimination
  transform:    regenerate + reread the registry → compute reduction metrics → append summary + lessons to durable history
  constraints:  ROI is measured, not asserted; the registry must reflect the new base + migrated implementations; identical history entries collapse (info-theory)
  output:       committed { registry_state, roi, history_entry }
  handoff:      registry reflects new truth AND measurable ROI computed AND persisted deduplicated (yields: hash + boolean)

# OUTPUT CONTRACT
IF RESOLVES "{project.registry_regenerate}": REGENERATE the architecture registry; REREAD INTO registry_state; CONFIRM the new base + migrated implementations are represented
ELSE: SET registry_state = "ABSENT" — no registry is generated here, so there is nothing to regenerate and nothing to reread; the new truth is the tree itself
CALCULATE_METRIC roi = {duplication_reduction, code_reduction, base_adoption, lines_saved, maintenance_burden_reduction, cognitive_load_reduction}
COMPOSE_ARTIFACT history_entry FROM {summary, lessons_learned, roi}
DEDUP history_entry AGAINST durable_history
APPEND history_entry TO durable history
SET committed = {registry_state: registry_state, roi: roi, history_entry: history_entry}

HANDOFF GATE (evidence-bearing):
  rule_id: "COMMIT"   yields: hash + boolean
  [check] the registry reflects the new truth WHERE its regenerate slot resolves, and is recorded ABSENT where it does not (evidence: registry_state)
  [check] measurable ROI computed, not asserted (evidence: roi)
  [check] history entry persisted + deduplicated (evidence: history_entry)
  result: pass → NODE 10 TERMINATE (owner: commit)


# ============================================================================
# NODE 10 — TERMINATE  [evaluative · termination · set-theory · yields: ter-stop boolean]
# ============================================================================
@purpose: "Stop only on saturation AND completion AND verification; otherwise emit a blocked report — never a self-assessed stop"
@axis_question: "Are we done?"   @mandatory: always   @selectable: false
@cue: "MEASURE_THE_ROI"

CONTRACT:
  input:        committed + elimination + migration + repair_state
  transform:    evaluate the termination node-set → report ROI OR the blocked report
  constraints:  ter-stop == saturation (zero unapproved occurrences) AND completion (base + migrations + ROI) AND verification (elimination proven); ter-block routes to a blocked report
  output:       report { status: success|blocked, roi, remaining }
  handoff:      terminal — ROI reported OR blocking occurrences named (yields: boolean)

DECLARE termination_nodes: array
SET termination_nodes = [
  {id: "ter-completion",         asks: "is the base composed, targets migrated, ROI computed?", yields: "boolean", test: "base_artifact + migrated_targets + roi present"},
  {id: "ter-saturation",         asks: "is nothing left to resolve?",                          yields: "boolean", test: "zero unapproved occurrences remain"},
  {id: "ter-diminishing-returns",asks: "has migration stopped removing occurrences?",           yields: "counter", test: "repair cycles within recursion_limit", role: "injection-gate"},
  {id: "ter-block",              asks: "did required context / reversibility fail?",            yields: "boolean", test: "context unavailable OR irreversible migration"},
  {id: "ter-stop",               asks: "gone, complete, and verified?",                        yields: "boolean", test: "saturation AND completion AND verification", role: "completion-marker"}
]

FUNCTION evaluate_termination(committed, elimination, migration, repair_state):
  SET completion  = EXISTS(migration.base_artifact) AND migration.migrated_targets.length > 0 AND EXISTS(committed.roi)
  SET verification = (elimination.proven == true)
  SET saturation  = (elimination.unapproved_occurrences.length == 0)
  SET blocked     = (required_context_unavailable OR any_irreversible_migration)
  SET ter_stop = (saturation AND completion AND verification AND NOT blocked)
  RETURN {completion: completion, verification: verification, saturation: saturation, blocked: blocked, ter_stop: ter_stop}

# TERMINAL — exactly one of success / blocked; bounded by max_cycles in the REPAIR edge.
SET term = evaluate_termination(committed, elimination, migration, repair_state)
IF term.ter_stop == true:
  REPORT_RESULT {status: "success", roi: committed.roi, history_entry: committed.history_entry}
  SET report = {status: "success", roi: committed.roi}
ELSE:
  REPORT_RESULT {status: "blocked", reason: (term.blocked ? "ter-block" : "ter-diminishing-returns"), remaining: elimination.unapproved_occurrences}
  SET report = {status: "blocked", remaining: elimination.unapproved_occurrences}

HANDOFF GATE (ter-stop gate):
  rule_id: "TERMINATE"   yields: boolean
  [check] report.status IN ["success", "blocked"] (evidence: report)
  [check] success ONLY when saturation AND completion AND verification hold (evidence: term)
  [check] repair_state.cycle <= max_cycles (evidence: bounded loop)
  result: TERMINATE

FINALIZE report


# ============================================================================
# CROSS-NODE INVARIANTS  (bind every node)
# ============================================================================
ALWAYS:
  - probe capabilities, measure the existing baseline, and frame the landscape by ontological dimension before proposing
  - score every candidate anti-pattern by impact - effort and gate on the highest-worth one + its highest-worth remediation (NODE 2)
  - run the four mandatory-always gates every distillation: tel-priority (NODE 2), constrain admissibility (NODE 7), ver-stop (NODE 8), ter-stop (NODE 10)
  - type every decision to its yields-shape; elimination completeness is a number[0,1], the verdict a boundary judgment
  - ground the base + migration order in the substrate genesis (existence->...->emergence); prove on simple targets first
  - require behavioral evidence for candidates; prefer composition/utility when the boundary isn't justified
  - split concrete vs abstract responsibilities; enforce base size limits; migrate low-complexity-first with checkpoint/restore
  - a node reads ONLY the prior node's output contract, and hands off through exactly one evidence-bearing gate
  - prove elimination over the whole scope from real source, name a refuter, regenerate the registry where that slot resolves, and compute measurable ROI
  - repair stragglers reversibly, bounded by ter-diminishing-returns; persist deduplicated history

NEVER:
  - distill an anti-pattern that is not the highest-worth admissible one, or create a base already covered by an existing one
  - create a base abstraction on naming similarity or without sufficient boundary principles + coverage
  - use regex; hardcode role taxonomies, base names, thresholds, the registry command, or a model — discover / adapter-resolve
  - migrate irreversibly — checkpoint each target, restore on failure (no destructive VCS commands)
  - declare complete while any unapproved old-pattern occurrence remains
  - stop on anything but saturation AND completion AND verification; a self-assessed "done" is not ter-stop
```
