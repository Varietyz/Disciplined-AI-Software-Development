---
name: checklist.protocol
description: Executable template. Compiles a software-architecture task into a dependency-ordered, evidence-bearing implementation checklist by walking the ten-node derivation-loop across four reasoning layers — every decision typed to a math shape, phase decomposition grounded in the substrate genesis cycle, and the four mandatory-always gates (teleology, admissibility, verification, termination) enforced — emitting the checklist or a blocked report.
type: template
status: current
summary: Executable PAG template that composes an implementation checklist by walking the four-layer derivation-loop with math-typed decisions and substrate-grounded decomposition.
domain: [architecture, ai-governance, governance]
keywords:
    [
        checklist,
        generator,
        template,
        derivation-loop,
        substrate-genesis,
        teleology-gate,
        math-typed,
        yields-shape,
        evidence,
        ripple-chains,
        validator,
        semantic-policy,
        verification,
        termination,
        recovery,
    ]
version: 2
staleness-days: -1
depends-on:
supersedes:
---

# Checklist Creation Template

```py CODE: PAG checklist template
%% META %%:
priority: PRINCIPLES > ARCHITECTURE_ONTOLOGY > TEMPLATE > EXTERNAL_DOCS > TASK
trust: tool_output = TRUSTED, prior_knowledge = UNTRUSTED
objective: a dependency-ordered checklist whose framing, worth, seeing, derivation, projection,
           formalization, admissibility, verification, commitment, and termination are each produced
           and gated by the derivation-loop node that owns that decision
recursion_limit: 3

# --- SLOT ABSENCES THIS TEMPLATE IS BOUND BY (declared once; honoured wherever they appear) --
#   An abstract {slot} resolves against the adapter binding. A slot with NO analogue resolves
#   ABSENT, and the branch depending on it DOES NOT RUN — the absence is declared, never faked.
#   Reading an ABSENT slot as though it resolved manufactures a demand nothing can satisfy, and a
#   gate satisfiable only by fabricating its own evidence is worse than no gate at all.
#   ABSENT here: {project.design_guide} · {project.component_docs} — no design system, so no step
#     reads an inherited design decision and no prior visual choice is assumed.
#   {convention.base_class_prefix} · {convention.abstract_prefix} · {registry} — no class hierarchy
#     and no dependency-injection registry, so the naming and wiring branches do not run.
#   {limits.max_files} — no per-folder file cap; placement is governed by the taxonomy grammar
#     instead, so a count-based check has no threshold to read and is not performed.
#   {toolchain.build.execute} — THERE IS NO BUILD. Nothing compiles and the runtime interprets its
#     sources, so a verification step gating on a build output has no output to gate on. Verification
#     is the declared verify command over the artifact, and where a claim needs a running system it
#     is recorded as OWNER-OBSERVED rather than satisfied by a step that cannot run.

# --- THE FOUR LAYERS (each answers one question about the work) -----------------------------
#   substrate  — "How does anything come to be?"     grounds decomposition (LAYER 0)
#   epistemic  — "How is it known?"                   orient · see · derive · project · act
#   conative   — "What is worth doing?"               intent · constrain            (MANDATORY-ALWAYS)
#   evaluative — "Is it right, and are we done?"      verify · commit · terminate    (MANDATORY-ALWAYS)
#
# --- YIELDS-SHAPE LEGEND (every decision resolves to a typed shape) --------------------------
#   set-theory        → set | boolean        (membership · cardinality · emptiness)
#   logic             → boolean              (does it hold; what follows)
#   graph             → edge-list            (reachability · coverage · degree)
#   algebra           → ordered-structure    (composition · ordering invariant)
#   analysis          → operation            (operation applied to state)
#   optimization      → boolean | ranking    (validation · threshold · argmax)
#   topology          → boolean              (invariant / symmetry preserved)
#   probability       → number[0,1]          (confidence · distribution)
#   information-theory-> hash | novelty-score (novelty · dedup)
#   computation       → procedure            (algorithm / loop)
#   dynamical-systems → boolean | counter    (fixed-point · convergence)
#
# --- MANDATORY-ALWAYS GATES (never skipped, never "when-relevant") ---------------------------
#   TELEOLOGY  gate tel-priority  (NODE 2)  → argmax(utility - cost) over admissible branches
#   TELEOLOGY  gate constrain     (NODE 7)  → plan admissible within cost + hard limits
#   VERIFY     gate ver-stop      (NODE 8)  → supported by evidence, confidence >= threshold, refutation not outweighing
#   TERMINATE  gate ter-stop      (NODE 10) → saturation AND completion AND verification
# The selectable epistemic axes (ontology · analysis · reasoning · representation · formalization)
# run WHEN-RELEVANT; the four gates above run ALWAYS.

NOTE ON PARAMETERS: every {project.*} / {convention.*} / {toolchain.*} / {limits.*} token is
resolved from the host's governing docs, never hardcoded — the generator is portable across any
language and codebase that scales by structure.

Each node declares its layer, axis, mathType, yields-shape, input, transformation, constraint set,
output contract, and one evidence-bearing handoff gate. A node reads only the prior node's output
contract. The transitions between nodes (sequence, gate, refutes-back, terminal) are declared once
in THE LOOP SPINE and enforced by every node's handoff.


# ============================================================================
# LAYER 0 — SUBSTRATE  (genesis grammar; grounds decomposition in PROJECT + ACT)
# ============================================================================
@purpose: "Model how each artifact-to-be COMES TO BE, so phase order is a genesis, not an arbitrary verb-chain"
@question: "How does anything come to be?"

# The genesis cycle: an artifact is brought into being by passing through these stages in order,
# recursing on `difference` whenever `emergence` reveals a distinction the plan had not yet drawn.
DECLARE substrate_cycle: array
SET substrate_cycle = ["existence", "difference", "relation", "structure", "transformation", "constraint", "emergence"]
DECLARE substrate_recursion: object
SET substrate_recursion = {from: "emergence", to: "difference"}

# Each genesis stage carries its mathType and the construction question it answers about the artifact.
DECLARE genesis_grammar: array
SET genesis_grammar = [
  {stage: "existence",      mathType: "set-theory",        yields: "set|boolean", asks: "does the artifact exist / is it scaffolded?"},
  {stage: "difference",     mathType: "logic",             yields: "boolean",     asks: "what boundary makes it distinct from its context?"},
  {stage: "relation",       mathType: "graph",             yields: "edge-list",   asks: "what does it depend on / connect to?"},
  {stage: "structure",      mathType: "algebra",           yields: "ordered-structure", asks: "how are its internal parts arranged under its laws?"},
  {stage: "transformation", mathType: "analysis",          yields: "operation",   asks: "what operations / behavior does it perform?"},
  {stage: "constraint",     mathType: "optimization",      yields: "boolean|ranking", asks: "what invariants + gates bound it?"},
  {stage: "emergence",      mathType: "dynamical-systems", yields: "boolean|counter", asks: "does it integrate + stabilize; did a new distinction appear?"}
]

# The genesis stage a verb realizes — PROJECT orders phases by this, ACT realizes tasks against it.
DECLARE verb_to_genesis: object
SET verb_to_genesis = {
  "READ": "existence", "FIND": "existence", "ANALYZE": "difference", "FILTER": "difference",
  "EXTRACT": "relation", "CREATE": "structure", "WRITE": "structure",
  "EXECUTE": "transformation", "LINK": "relation", "ITERATE": "transformation", "VERIFY": "constraint"
}

FUNCTION genesis_rank(verb):
  DETERMINE stage FROM verb_to_genesis[verb]
  RETURN INDEX_OF(substrate_cycle, stage)   # a phase depending on a later-genesis output than it produces is a genesis inversion


# ============================================================================
# THE LOOP SPINE  (the ten nodes, their typing, and the transitions between them)
# ============================================================================
# node        layer       axis            mathType            yields                     transition out
# ----------- ----------- --------------- ------------------- -------------------------- ------------------------------------
# orient      epistemic   ontology        set-theory          entity-set + evidence      sequences → intent
# intent      conative    teleology       optimization        objective + branch-ranking GATE tel-priority → see | onFail redirect
# see         epistemic   analysis        graph               lens-set + analytic edges  sequences → derive
# derive      epistemic   reasoning       logic               principle/protocol truths  sequences → project
# project     epistemic   reasoning       logic               4D graph edge-list         sequences → act
# act         epistemic   formalization   computation         atomic task procedures     sequences → constrain
# constrain   conative    teleology       optimization        admissibility boolean      GATE → verify | onFail repair
# verify      evaluative  verification    logic + probability validation report          GATE ver-stop; onFail refutes-back → derive (bounded)
# commit      evaluative  representation  information-theory   rendered artifact          sequences → terminate
# terminate   evaluative  termination     set-theory          ter-stop boolean           GATE ter-stop → STOP | ter-block → ask the owner
#
# REFUTES-BACK EDGE: verify --(ver-evidence fails OR repair-required)--> earliest invalid node,
#   bounded by ter-diminishing-returns (recursion_limit). This is the ontology's verify->derive edge
#   generalized: repair re-enters at the EARLIEST responsible node, not always derive.


# ============================================================================
# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: entity-set + evidence]
# ============================================================================
@purpose: "Establish authority, trust, and current-system evidence by framing the task through the ontological dimensions"
@axis_question: "What is it?"
@cue: "OBSERVE_BEFORE_PLAN"

CONTRACT:
  input:        raw task text; host governing docs
  transform:    load authority → select relevant ontological dimensions → discover current system per dimension → record the ontology of the requested change
  constraints:  prior knowledge is UNTRUSTED; discover before assume; read authority before analysis; a dimension is walked only when relevant
  output:       context_bundle (below) — the sole artifact NODE 2 reads
  handoff:      authority loaded AND change-relation resolved AND evidence inventory non-empty (yields: boolean)

# Each entry names the slot it reads AND the state that slot resolves to. Where a slot resolves ABSENT
# the entry is NOT read, contributes no missing-source finding, and its category is recorded as having
# no authority — reading an ABSENT slot as though it resolved is the defect, and declaring the state
# HERE is what lets the loader below skip the branch rather than fail the run over a host that keeps no
# such document. Only a RESOLVED entry is ever opened.
DECLARE authoritative_sources: object
SET authoritative_sources = {
  "core": {always_read: true, files: ["{project.governance_policy}"], absent_unless_resolved: ["{project.principle_ontology}"], fallback_where_absent: {"{project.principle_ontology}": "{surface.principle_canon}"}},
  "architecture": {read_when: ["algorithm", "protocol", "pattern", "decomposition", "principle", "contract"], files: [], absent_unless_resolved: ["{project.architecture_rules}"]},
  "design": {read_when: ["style", "token", "layout", "surface", "ui", "presentation"], files: [], absent_unless_resolved: ["{project.design_guide}"]},
  "component": {read_when: ["component", "module", "element", "render", "boundary"], files: [], absent_unless_resolved: ["{project.component_docs}"]}
}

DECLARE priority_stack: array
SET priority_stack = ["PRINCIPLES", "ARCHITECTURE_ONTOLOGY", "CHECKLIST_TEMPLATE", "EXTERNAL_DOCUMENTATION", "TASK_DESCRIPTION"]
DECLARE trust_anchor: object
SET trust_anchor = {
  authoritative_docs: ["{project.governance_policy}", "{project.principle_ontology}", "{project.architecture_rules}"],
  trusted:   ["source files (any language)", "schema/config/data", "build/validator output", "tool output: discovery, search, read and execution operations", "structured logs/traces"],
  untrusted: ["narrative docs", "code comments", "prior codebase knowledge", "assumed file locations", "unverified claims"]
}

# The 15 ontological dimensions frame discovery. Each is walked WHEN-RELEVANT (mandatory: when-relevant),
# selected by semantic fit to the task, never all-fifteen-always. Each yields a typed observation.
DECLARE ontological_dimensions: array
SET ontological_dimensions = [
  {id: "identity",    asks: "what exists?",                       mathType: "set-theory",        relevant_when: "always"},
  {id: "composition", asks: "what is it made of?",                mathType: "set-theory",        relevant_when: "a unit is built or split"},
  {id: "structure",   asks: "how are parts arranged?",            mathType: "algebra",           relevant_when: "internal arrangement matters"},
  {id: "relation",    asks: "what connects it to other things?",  mathType: "graph",             relevant_when: "dependencies/consumers exist"},
  {id: "space",       asks: "where is it?",                       mathType: "topology",          relevant_when: "location/placement/boundary matters"},
  {id: "time",        asks: "when does it occur?",                mathType: "analysis",          relevant_when: "ordering/lifecycle/schedule matters"},
  {id: "state",       asks: "what condition is it in?",           mathType: "set-theory",        relevant_when: "current status is load-bearing"},
  {id: "change",      asks: "how does it transform?",             mathType: "analysis",          relevant_when: "always"},
  {id: "behavior",   asks: "what does it do?",                   mathType: "dynamical-systems", relevant_when: "runtime behavior is affected"},
  {id: "function",    asks: "what role does it fulfil?",          mathType: "analysis",          relevant_when: "purpose/responsibility is in scope"},
  {id: "cause",       asks: "why does it happen?",                mathType: "analysis",          relevant_when: "a defect/requirement has a cause to trace"},
  {id: "meaning",     asks: "what does it signify?",              mathType: "logic",             relevant_when: "semantics/intent must be preserved"},
  {id: "scale",       asks: "at what level does it exist?",       mathType: "topology",          relevant_when: "the change recurs across levels"},
  {id: "probability", asks: "how certain is it?",                 mathType: "probability",       relevant_when: "evidence is partial/uncertain"},
  {id: "novelty",     asks: "what deviates from expectation?",    mathType: "probability",       relevant_when: "an anomaly or new pattern appears"}
]

FUNCTION load_authoritative_sources(task_description):
  DECLARE files: array
  SET files = authoritative_sources.core.files
  FOR EACH category IN ["architecture", "design", "component"]:
    FOR EACH trigger IN authoritative_sources[category].read_when:
      FIND trigger IN task_description
      IF exists:
        APPEND authoritative_sources[category].files TO files
        FOR EACH slot IN authoritative_sources[category].absent_unless_resolved: IF RESOLVES slot: APPEND slot TO files
        BREAK
  FOR EACH slot IN authoritative_sources.core.absent_unless_resolved:
    IF RESOLVES slot: APPEND slot TO files
    ELSE IF authoritative_sources.core.fallback_where_absent[slot] RESOLVES: APPEND that fallback TO files   # the host's authority wins; a package-shipped one is read only in its absence
  FILTER files TO declared WHERE the slot naming it RESOLVES
  # A slot the configuration declares ABSENT names no document, so it is not read and its absence is
  # NOT a missing source: reporting a blocker for it would fail the run over a host that legitimately
  # keeps no such document, which is a demand nothing can satisfy.
  FOR EACH file IN declared:
    READ file INTO content
    IF NOT exists: REPORT "MISSING AUTHORITATIVE SOURCE: {file}" (severity: blocker, owner: orient)
  RECORD every filtered slot as ABSENT in the output contract, so a reader sees which authorities exist
  RETURN declared

FUNCTION select_dimensions(task_description):
  DECLARE active_dims: array
  SET active_dims = []
  FOR EACH d IN ontological_dimensions:
    IF d.relevant_when == "always": APPEND d TO active_dims
    ELSE:
      ANALYZE task_description AGAINST d.relevant_when INTO fit   # semantic, not keyword
      IF fit.status == "applies": APPEND d TO active_dims
  RETURN active_dims   # yields: a set of dimensions (membership)

# Ontology of the requested change: identity + directionality (introduce/retain/remove/analyze/mention)
# — the change_relation NODE 4 keys principles on and NODE 8 keys semantic policy on. This is ONTOLOGY
# (what the change IS), distinct from TELEOLOGY (what it is FOR), which NODE 2 owns.
FUNCTION describe_change(task_description, explicit_constraints):
  DECLARE change: object
  SET change = {requested_outcome: "", requested_actions: [], entities: [], constraints: explicit_constraints, non_goals: [], change_relation: "unknown", ambiguity: []}
  EXTRACT requested_outcome, requested_actions, entities FROM task_description INTO change
  ANALYZE task_description FOR negation_and_directionality INTO change.change_relation
  ANALYZE task_description FOR ambiguity INTO change.ambiguity
  IF change.change_relation == "unknown": APPEND "change direction unresolved" TO change.ambiguity
  RETURN change

# Discovery is framed by the selected dimensions and generated dynamically from task keywords.
FUNCTION discover_context(change, active_dims):
  DECLARE keywords: object
  SET keywords = {nouns: [], verbs: [], file_refs: [], folders: []}
  EXTRACT technical_nouns FROM change WHERE PascalCase OR camelCase INTO keywords.nouns
  EXTRACT action_verbs FROM change INTO keywords.verbs
  EXTRACT file_and_folder_refs FROM change INTO keywords.file_refs, keywords.folders
  DECLARE patterns: object
  SET patterns = {globs: [], greps: [], targets: []}
  # Every glob is built from the extensions the configuration declares, and a glob whose naming slot is
  # ABSENT is not built at all — an unresolved token in a glob matches nothing while reading as a search.
  FOR EACH ext IN {convention.code_extensions}:
    IF RESOLVES "{convention.base_class_prefix}": APPEND glob("**", "{convention.base_class_prefix}-*<ext>") TO patterns.globs
    IF RESOLVES "{convention.abstract_prefix}":   APPEND glob("**", "{convention.abstract_prefix}-*<ext>") TO patterns.globs
    APPEND glob("**", "*registry*<ext>"), glob("**", "index<ext>") TO patterns.globs
    # No migration surface is declared, so nothing globs for one; a slot invented to hold this search
    # would be a demand nothing can satisfy, and a schema change is caught by its ripple dimension instead.
  FOR EACH noun IN keywords.nouns:
    FOR EACH ext IN {convention.code_extensions}: APPEND glob("**", "*<noun>*<ext>") TO patterns.globs
    APPEND grep("class .*<noun>"), grep("interface .*<noun>") TO patterns.greps
  FOR EACH folder IN keywords.folders: FOR EACH ext IN {convention.code_extensions}: APPEND glob("<folder>", "**", "*<ext>") TO patterns.globs
  FOR EACH ref IN keywords.file_refs: APPEND ref TO patterns.targets
  DECLARE discovered: object
  SET discovered = {base_classes: [], implementations: [], registrations: [], migrations: [], signatures: [], by_dimension: {}, evidence: []}
  FOR EACH glob IN patterns.globs:
    GLOB glob INTO matches
    FOR EACH m IN matches:
      CLASSIFY m INTO discovered.base_classes | discovered.migrations | discovered.implementations
      APPEND {source: m, observation: "discovered artifact", freshness: "current", confidence: "high"} TO discovered.evidence
  FOR EACH grep IN patterns.greps:
    GREP grep (output_mode: "files_with_matches") INTO matches
    IF matches.length > 0: APPEND {pattern: grep, files: matches} TO discovered.registrations
  FOR EACH t IN patterns.targets:
    IF FILE_EXISTS(t): READ t (limit: 200) INTO c; EXTRACT public_members FROM c INTO discovered.signatures
  # attach each observation to the dimension it answers, so orientation is dimension-complete
  FOR EACH d IN active_dims:
    ANALYZE discovered AGAINST d.asks INTO obs
    SET discovered.by_dimension[d.id] = {mathType: d.mathType, observation: obs, evidence: obs.evidence}
  RETURN {keywords: keywords, discovered: discovered}

# OUTPUT CONTRACT
DECLARE context_bundle: object
SET loaded_sources = load_authoritative_sources(task_description)
SET active_dims = select_dimensions(task_description)
SET change = describe_change(task_description, explicit_constraints)
SET context = discover_context(change, active_dims)
SET context_bundle = {
  normalized_intent: change.requested_outcome,
  change_relation: change.change_relation,
  change_kinds: change.requested_actions,
  active_dimensions: active_dims,
  ontological_readout: context.discovered.by_dimension,
  authoritative_sources: loaded_sources,
  trust: trust_anchor,
  priority: priority_stack,
  discovered: context.discovered,
  evidence_inventory: context.discovered.evidence,
  unresolved_questions: change.ambiguity,
  assumptions: []
}

HANDOFF GATE (evidence-bearing):
  rule_id: "ORIENT"   yields: boolean
  [check] core authority loaded (evidence: context_bundle.authoritative_sources)
  [check] change_relation != "unknown" (evidence: change)
  [check] every "always" dimension has a readout AND evidence_inventory.length > 0 (evidence: ontological_readout, discovery searches run)
  result: pass → NODE 2 INTENT | fail → REPAIR (owner: orient)


# ============================================================================
# NODE 2 — INTENT      [conative · teleology · optimization · yields: objective + branch-ranking]
# ============================================================================
@purpose: "Resolve what the work is FOR, enumerate admissible branches, and gate on the highest-worth one BEFORE any seeing"
@axis_question: "What is it for?"   @mandatory: always   @selectable: false
@cue: "WORTH_BEFORE_WORK"

CONTRACT:
  input:        context_bundle
  transform:    state objective → enumerate admissible branches → score utility + cost → rank → select argmax
  constraints:  teleology is MANDATORY-ALWAYS; a branch is admissible only if it satisfies the change_relation + hard constraints; NEVER proceed on a branch that is not the highest-worth admissible one
  output:       teleology_bundle { objective, branches[], selected_branch, ranking }
  handoff:      GATE tel-priority — selected_branch == argmax(utility - cost) over admissible branches (yields: boolean over a ranking)

DECLARE teleology_nodes: array
SET teleology_nodes = [
  {id: "tel-objective", asks: "what is the objective?",                         yields: "set"},
  {id: "tel-utility",   asks: "how much does this branch advance the objective?", yields: "number"},
  {id: "tel-cost",      asks: "what does this branch cost?",                     yields: "number"},
  {id: "tel-priority",  asks: "is this the highest-worth admissible branch?",    yields: "boolean", role: "injection-gate",
     decision_test: "highest utility minus cost among admissible branches"}
]

FUNCTION enumerate_branches(context_bundle):
  DECLARE branches: array
  SET branches = []
  DERIVE candidate_approaches FROM context_bundle.normalized_intent, context_bundle.discovered INTO candidates
  FOR EACH c IN candidates:
    ANALYZE c AGAINST context_bundle.change_relation, context_bundle.constraints INTO adm
    APPEND {id: c.id, approach: c.summary, admissible: adm.ok, inadmissible_reason: adm.reason, utility: 0, cost: 0} TO branches
  RETURN branches

FUNCTION score_and_rank(branches, context_bundle):
  FOR EACH b IN branches WHERE b.admissible == true:
    ASSESS advance_toward(context_bundle.normalized_intent, b) INTO b.utility        # yields: number
    ASSESS effort + blast_radius + risk(b, context_bundle.discovered) INTO b.cost     # yields: number
  ORDER branches BY (utility - cost) DESC WHERE admissible == true INTO ranking       # yields: ranking
  RETURN ranking

# OUTPUT CONTRACT
DECLARE teleology_bundle: object
SET objective = context_bundle.normalized_intent
SET branches = enumerate_branches(context_bundle)
SET ranking = score_and_rank(branches, context_bundle)
DECLARE admissible: array
FILTER branches TO admissible WHERE admissible == true
SET teleology_bundle = {objective: objective, branches: branches, ranking: ranking, selected_branch: (ranking.length > 0 ? ranking[0] : "none")}

HANDOFF GATE (tel-priority injection-gate):
  rule_id: "INTENT"   yields: boolean over ranking
  [check] objective != "" (evidence: teleology_bundle.objective)
  [check] admissible.length > 0 (evidence: branches with admissible == true)
  [check] selected_branch == argmax(utility - cost) over admissible (evidence: ranking[0])
  result: pass → NODE 3 SEE
          | no admissible branch → REDIRECT: re-frame objective/constraints (owner: orient) OR emit BLOCKED (ter-block)
          | selected is not argmax → REPAIR (owner: intent)


# ============================================================================
# NODE 3 — SEE         [epistemic · analysis · graph · yields: lens-set + analytic edges]
# ============================================================================
@purpose: "Choose HOW the selected branch is to be seen — select the analytical lenses relevant to it and read the system through them"
@axis_question: "How is it to be seen?"
@cue: "SELECT_LENSES_BEFORE_DERIVING"

CONTRACT:
  input:        context_bundle + teleology_bundle
  transform:    select relevant analytical lenses → read the discovered system through each → emit analytical observations (esp. the relational edge-list)
  constraints:  a lens is applied only WHEN-RELEVANT to the selected branch; the relational lens produces the dependency edges PROJECT will build on
  output:       analysis_bundle { active_lenses[], observations{}, relational_edges[] }
  handoff:      every relevant lens has an observation AND relational_edges present when dependencies exist (yields: edge-list + boolean)

# The 15 analytical lenses (superset in the pattern ontology adds transformational/invariant/optimization/complexity;
# select from either — each carries a mathType and a question).
DECLARE analytical_lenses: array
SET analytical_lenses = [
  {id: "structure",   asks: "how are the parts organized?",            mathType: "algebra"},
  {id: "time",     asks: "how does it vary through time?",          mathType: "analysis"},
  {id: "space",      asks: "how is it distributed in space?",         mathType: "topology"},
  {id: "statistical",  asks: "what regularities emerge from many?",     mathType: "probability"},
  {id: "frequency",    asks: "what repeats, and how often?",            mathType: "information-theory"},
  {id: "sequential",   asks: "in what order do things occur?",          mathType: "logic"},
  {id: "relation",   asks: "what connects what?",                     mathType: "graph"},
  {id: "behavior",  asks: "how does an entity tend to act?",         mathType: "dynamical-systems"},
  {id: "function",   asks: "what role does something perform?",       mathType: "analysis"},
  {id: "meaning",     asks: "what meaning is conveyed?",               mathType: "logic"},
  {id: "cause",       asks: "what produces what?",                     mathType: "analysis"},
  {id: "prediction",   asks: "what usually follows?",                   mathType: "probability"},
  {id: "anomaly",      asks: "what breaks the normal pattern?",         mathType: "probability"},
  {id: "change", asks: "how does the pattern itself change?",     mathType: "dynamical-systems"},
  {id: "fractal",      asks: "does the same structure recur at scale?", mathType: "topology"}
]

FUNCTION select_lenses(teleology_bundle, context_bundle):
  DECLARE active: array
  SET active = []
  FOR EACH lens IN analytical_lenses:
    ANALYZE {branch: teleology_bundle.selected_branch, surfaces: context_bundle.discovered} AGAINST lens.asks INTO fit
    IF fit.relevant == true: APPEND lens TO active
  IF NOT contains(active, "relation") AND context_bundle.discovered.registrations.length > 0: APPEND lens("relation") TO active
  RETURN active

FUNCTION read_through_lenses(active, context_bundle):
  DECLARE observations: object
  DECLARE relational_edges: array
  SET observations = {}; SET relational_edges = []
  FOR EACH lens IN active:
    ANALYZE context_bundle.discovered THROUGH lens INTO obs   # yields the lens' typed shape
    SET observations[lens.id] = {mathType: lens.mathType, finding: obs}
    IF lens.id == "relation":
      FOR EACH e IN obs.edges: APPEND {from: e.from, to: e.to, kind: e.kind, evidence: e.evidence} TO relational_edges
  RETURN {observations: observations, relational_edges: relational_edges}

# OUTPUT CONTRACT
DECLARE analysis_bundle: object
SET active_lenses = select_lenses(teleology_bundle, context_bundle)
SET seen = read_through_lenses(active_lenses, context_bundle)
SET analysis_bundle = {active_lenses: active_lenses, observations: seen.observations, relational_edges: seen.relational_edges}

HANDOFF GATE (evidence-bearing):
  rule_id: "SEE"   yields: edge-list + boolean
  [check] active_lenses.length > 0 AND every active lens has an observation (evidence: observations)
  [check] relational_edges present when dependencies/consumers were discovered (evidence: relational_edges vs discovered.registrations)
  result: pass → NODE 4 DERIVE | gap → REPAIR (owner: see)


# ============================================================================
# NODE 4 — DERIVE      [epistemic · reasoning · logic · yields: principle/protocol truths]
# ============================================================================
@purpose: "Activate the principles that govern the seen decision surfaces and select protocols by semantic fit"
@axis_question: "Why, and what follows?"
@cue: "DERIVE_FROM_EVIDENCE"

CONTRACT:
  input:        context_bundle + teleology_bundle + analysis_bundle
  transform:    activate principles (bind decision_test + validator + severity) → select protocols by semantic fit
  constraints:  every active principle binds a decision_test + validator; NEVER select a protocol from a trigger word alone; principles activate against the SEEN surfaces, not assumptions
  output:       active_principles[] + selected_protocols[]
  handoff:      every active mandatory principle binds a validator AND every selected protocol has a semantic reason (yields: boolean)

# Principle catalog: each row binds a decision_test, a validator, and a severity (severity routes repair).
DECLARE principle_catalog: array
SET principle_catalog = [
  {id: "SRP",  severity: "mandatory",   activate_when: "a unit is created or modified",            decision_test: "one coherent responsibility, one change axis?", validator: "V-STRUCTURE"},
  {id: "SOC",  severity: "mandatory",   activate_when: "concerns cross a module/layer boundary",   decision_test: "policy/domain/infra/presentation/orchestration separated?", validator: "V-STRUCTURE"},
  {id: "DRY",  severity: "mandatory",   activate_when: "knowledge appears in multiple places",     decision_test: "one authoritative representation?", validator: "V-STRUCTURE"},
  {id: "DIP",  severity: "mandatory",   activate_when: "higher-level depends on lower-level impl",  decision_test: "boundary owns the abstraction, details behind it?", validator: "V-DEPENDENCY"},
  {id: "LSP",  severity: "mandatory",   activate_when: "subtypes/replaceable impls exist",         decision_test: "same behavioral contract, invariants intact?", validator: "V-CONTRACT"},
  {id: "ISP",  severity: "mandatory",   activate_when: "consumers depend on interfaces",           decision_test: "each consumer depends only on what it uses?", validator: "V-CONTRACT"},
  {id: "CONTRACT", severity: "mandatory", activate_when: "data/behavior crosses a boundary",       decision_test: "typed/schema contract validated at boundary?", validator: "V-CONTRACT"},
  {id: "LIFECYCLE", severity: "mandatory", activate_when: "resources acquired/registered/opened",  decision_test: "init/use/fail/release explicit + symmetric?", validator: "V-LIFECYCLE"},
  {id: "COMPLEXITY", severity: "mandatory", activate_when: "nontrivial logic or large artifacts",  decision_test: "size/branching/responsibility within {limits.*}?", validator: "V-STRUCTURE"},
  {id: "OCP",  severity: "recommended",  activate_when: "new variants/capabilities added",         decision_test: "extend without modifying stable selection logic?", validator: "V-EXTENSION"},
  {id: "DI",   severity: "recommended",  activate_when: "a unit collaborates with external deps",  decision_test: "collaborators injected, not newed inside core?", validator: "V-DEPENDENCY"},
  {id: "EVENTS", severity: "recommended", activate_when: "decoupled upward notification needed",   decision_test: "emit events vs parent callbacks?", validator: "V-EVENTS"},
  {id: "OBSERV", severity: "recommended", activate_when: "runtime can fail/transition/affect ops", decision_test: "structured, queryable context matched to the concern?", validator: "V-OBSERVABILITY"},
  {id: "DETERM", severity: "recommended", activate_when: "ordering/replay/retry/generation matters", decision_test: "stable results + explainable ordering?", validator: "V-DETERMINISM"},
  {id: "SECURE_DESIGN", severity: "mandatory", activate_when: "a trust boundary / sensitive op",   decision_test: "threats + controls considered at design time?", validator: "V-SECURITY"},
  {id: "LEAST_PRIV", severity: "mandatory", activate_when: "identities/permissions/tokens used",   decision_test: "minimum authority, deny by default?", validator: "V-SECURITY"},
  {id: "INPUT_VAL", severity: "mandatory", activate_when: "external/untrusted data enters",        decision_test: "validated + normalized at the boundary?", validator: "V-SECURITY"},
  {id: "SECRETS", severity: "mandatory", activate_when: "credentials/keys/sensitive config",       decision_test: "externalized, scoped, log-safe, rotatable?", validator: "V-SECURITY"},
  {id: "PERF_ENG", severity: "recommended", activate_when: "perf is a goal or a hot path changes", decision_test: "optimization has a measured baseline + budget?", validator: "V-PERFORMANCE"},
  {id: "CONFIG_EXT", severity: "mandatory", activate_when: "env-specific values or secrets used",  decision_test: "resolved via config layer, validated at boot?", validator: "V-INFRA"},
  {id: "FAIL_FAST", severity: "mandatory", activate_when: "invalid required state can occur",      decision_test: "surfaced at its boundary, not masked by a default?", validator: "V-FAILURE"},
  {id: "POLICY_CODE", severity: "mandatory", activate_when: "a new architectural invariant appears", decision_test: "encoded as an automated detector + activated in catalog?", validator: "V-ENFORCEMENT"},
  {id: "ZERO_LEGACY", severity: "mandatory", activate_when: "an existing path is replaced",        decision_test: "superseded path removed in the same completed change?", validator: "V-REPLACEMENT"},
  {id: "DELETE_DEAD", severity: "mandatory", activate_when: "symbols/registrations become unused", decision_test: "obsolete dependants + exports removed with the change?", validator: "V-REPLACEMENT"}
]
# (subset of {project.principle_ontology}; the ontology is authoritative — resolve the full set from it)

DECLARE severity_order: object
SET severity_order = {mandatory: 1, recommended: 2, contextual: 3, discouraged: 4}

FUNCTION activate_principles(context_bundle, analysis_bundle):
  DECLARE records: array
  SET records = []
  DETERMINE decision_surfaces FROM context_bundle, analysis_bundle.observations INTO surfaces
  FOR EACH p IN principle_catalog:
    ANALYZE surfaces AGAINST p.activate_when INTO fit
    IF fit.status == "applies":
      APPEND {id: p.id, applicability: "applies", reason: fit.reason, validator: p.validator, severity: p.severity, failure_behavior: "block_if_mandatory_else_disposition"} TO records
    ELSE IF fit.status == "uncertain":
      APPEND {id: p.id, applicability: "uncertain", reason: fit.reason, validator: p.validator, severity: p.severity, failure_behavior: "investigate"} TO records
    ELSE:
      APPEND {id: p.id, applicability: "not_applicable", reason: fit.reason, validator: "", severity: p.severity, failure_behavior: "none"} TO records
  RETURN records

# Protocol selection by SEMANTIC fit against the requested state transition — never a trigger-word match.
DECLARE protocol_library: object
SET protocol_library = {
  "module-separation":     {use_when: "a unit mixes concerns or exceeds bounded complexity", chain: ["ANALYZE","FIND","EXTRACT","CREATE","VERIFY"], principles: ["SRP","SOC","COMPLEXITY"]},
  "extension-no-modify":   {use_when: "a new variant extends a stable system",               chain: ["ANALYZE","FIND","CREATE","LINK","VERIFY"], principles: ["OCP"]},
  "dependency-inversion":  {use_when: "higher-level logic depends on concrete infra",         chain: ["FIND","ANALYZE","EXTRACT","CREATE","LINK","VERIFY"], principles: ["DIP","DI"]},
  "intention-emission":    {use_when: "communication should decouple through events",         chain: ["FIND","ANALYZE","CREATE","LINK","VERIFY"], principles: ["EVENTS"]},
  "invariant-inheritance": {use_when: "subtype/base-class behavior must preserve invariants", chain: ["FIND","ANALYZE","CREATE","VERIFY"], principles: ["LSP","CONTRACT"]},
  "registry-resolution":   {use_when: "dynamic discovery or keyed resolution is justified",   chain: ["ANALYZE","FIND","CREATE","LINK","VERIFY"], principles: ["OCP"]},
  "security-hardening":    {use_when: "trust boundary/secret/identity/untrusted data affected",chain: ["ANALYZE","FIND","FILTER","CREATE","VERIFY"], principles: ["SECURE_DESIGN","LEAST_PRIV","INPUT_VAL","SECRETS"]},
  "performance-eng":       {use_when: "a measured bottleneck or declared budget exists",      chain: ["EXECUTE measure_baseline","ANALYZE","CREATE","EXECUTE","VERIFY"], principles: ["PERF_ENG"]},
  "infra-provisioning":    {use_when: "config/env/deploy/migration changes",                  chain: ["READ","ANALYZE","CREATE","WRITE","VERIFY"], principles: ["CONFIG_EXT"]},
  "resilience-recovery":   {use_when: "failure/retry/replay/recovery behavior changes",       chain: ["ANALYZE","CREATE","EXECUTE","VERIFY"], principles: ["FAIL_FAST"]},
  "replacement-elim":      {use_when: "an existing production path is replaced",              chain: ["FIND","ANALYZE","CREATE","EXECUTE","VERIFY"], principles: ["ZERO_LEGACY","DELETE_DEAD"]},
  "enforcement-authoring": {use_when: "a new invariant needs automated protection",           chain: ["ANALYZE","CREATE","LINK","EXECUTE","VERIFY"], principles: ["POLICY_CODE"]},
  "verification-gate":     {use_when: "every plan requires final reasoning + checklist validation", chain: ["ANALYZE","VERIFY","REPORT"], principles: ["ALL"], mandatory: true}
}

FUNCTION select_protocols(context_bundle, teleology_bundle, active_principles):
  DECLARE selected: array
  SET selected = []
  DETERMINE requested_transition FROM teleology_bundle.selected_branch, context_bundle.change_relation
  DETERMINE architecture_surfaces FROM context_bundle.discovered
  FOR EACH key IN protocol_library:
    ANALYZE {transition: requested_transition, surfaces: architecture_surfaces, principles: active_principles} AGAINST protocol_library[key].use_when INTO fit
    IF fit.semantic_match == true: APPEND {id: key, reason: fit.reason, chain: protocol_library[key].chain, principles: protocol_library[key].principles} TO selected
  IF "verification-gate" NOT IN selected: APPEND {id: "verification-gate", reason: "mandatory generation validation", chain: protocol_library["verification-gate"].chain, principles: ["ALL"]} TO selected
  RETURN selected

# OUTPUT CONTRACT
SET active_principles = activate_principles(context_bundle, analysis_bundle)
SET selected_protocols = select_protocols(context_bundle, teleology_bundle, active_principles)

HANDOFF GATE (evidence-bearing):
  rule_id: "DERIVE"   yields: boolean
  [check] every active mandatory principle binds a validator (evidence: active_principles)
  [check] every selected protocol carries a semantic reason, not a trigger word (evidence: selected.reason)
  [check] verification-gate protocol present (evidence: selected)
  result: pass → NODE 5 PROJECT | gap → REPAIR (owner: derive)


# ============================================================================
# NODE 5 — PROJECT     [epistemic · reasoning · logic · yields: 4D graph edge-list]
# ============================================================================
@purpose: "Decompose into phases whose ORDER is the substrate genesis of the artifacts, and project the 4D dependency + ripple graph"
@axis_question: "What follows downstream?"
@cue: "DECOMPOSE_AS_GENESIS"

CONTRACT:
  input:        selected_protocols + active_principles + context_bundle + analysis_bundle
  transform:    map each protocol verb to its genesis stage → emit phases → build 4D graph (Z/X/Y/W) → validate genesis order → linearize
  constraints:  ORDER by dependency AND genesis (a phase never depends on a later-genesis output than it produces); severity is metadata, NEVER an ordering axis; the relational_edges from SEE seed Z
  output:       phase_records[] with per-phase 4D graph + genesis stage + severity metadata
  handoff:      Z-graph acyclic AND genesis-consistent AND every phase declares inputs/outputs AND all four axes present (yields: edge-list + boolean)

DECLARE loop_class_labels: object
SET loop_class_labels = {
  "Construction": {verbs: ["CREATE","WRITE"], pattern: "build artifact from specification"},
  "Perceptual":   {verbs: ["FIND","READ","ANALYZE"], pattern: "observe system state"},
  "Cognitive":    {verbs: ["EXTRACT","FILTER"], pattern: "transform understanding"},
  "Executive":    {verbs: ["EXECUTE","VERIFY"], pattern: "effect change with validation"},
  "Linking":      {verbs: ["LINK","ITERATE"], pattern: "establish relationships"}
}

FUNCTION decompose_and_graph(selected_protocols, active_principles, context_bundle, analysis_bundle):
  DECLARE phases: array
  SET phases = []
  FOR EACH proto IN selected_protocols:
    FOR EACH verb IN proto.chain WITH index:
      DETERMINE objective, preconditions, inputs, outputs, affected_artifacts FROM proto, verb, context_bundle, phases
      FILTER active_principles TO local WHERE applicability == "applies" AND decision_surface MATCHES affected_artifacts
      SET severity = worst_severity(local, severity_order)   # metadata; routes in REPAIR
      SET loop_class = classify_loop(verb, loop_class_labels)
      SET genesis_stage = verb_to_genesis[verb]              # the artifact-genesis stage this phase realizes
      APPEND {id: proto.id + "." + index, verb: verb, genesis_stage: genesis_stage, objective: objective, preconditions: preconditions, inputs: inputs, outputs: outputs, affected_artifacts: affected_artifacts, principles: local, severity: severity, loop_class: loop_class, graph_4d: {sequential_z: [], lateral_x: [], diagonal_y: [], propagation_w: []}} TO phases
  # seed Z from the relational edges SEE already discovered
  FOR EACH e IN analysis_bundle.relational_edges:
    FIND producer, consumer IN phases BY e INTO pc
    IF pc.found: APPEND {from: pc.producer.id, output: e.kind, evidence: e.evidence} TO pc.consumer.graph_4d.sequential_z
  # 4D graph: Z sequential (dependency), X lateral (independent peers), Y diagonal (shared data), W propagation (downstream ripple)
  FOR EACH a IN phases:
    FOR EACH b IN phases WHERE a.id != b.id:
      IF b.inputs CONSUME a.outputs: APPEND {from: a.id, output: shared} TO b.graph_4d.sequential_z
      IF a peer-independent-of b:    APPEND {peer: b.id} TO a.graph_4d.lateral_x
      IF a,b share_artifact_without_prereq: APPEND {node: b.id, artifact: shared} TO a.graph_4d.diagonal_y
      FOR EACH prop IN downstream_propagation(a.outputs, context_bundle.discovered, b):
        APPEND {target: prop.target, superseded: prop.superseded, contracts: prop.contracts, breaks_if_omitted: prop.consequence} TO a.graph_4d.propagation_w
    IF a.graph_4d.propagation_w.length == 0: APPEND {target: "none", evidence: "no downstream consumer found"} TO a.graph_4d.propagation_w
  RETURN phases

# Genesis consistency: for every Z edge a->b, the producer's genesis stage must not be LATER than the
# consumer's within one artifact — you cannot depend on structure before existence, or transformation
# before structure. A genesis inversion is a decomposition defect, not a tie to break.
FUNCTION check_genesis_order(phases):
  DECLARE inversions: array
  SET inversions = []
  FOR EACH b IN phases:
    FOR EACH z IN b.graph_4d.sequential_z:
      FIND a IN phases WHERE a.id == z.from INTO a
      IF a.found AND same_artifact(a, b) AND genesis_rank(a.verb) > genesis_rank(b.verb):
        APPEND {producer: a.id, consumer: b.id, reason: "genesis inversion: " + a.genesis_stage + " depends on later " + b.genesis_stage} TO inversions
  RETURN inversions

FUNCTION linearize(phases):
  ANALYZE phases.graph_4d.sequential_z FOR cycles INTO cycles
  IF cycles.length > 0: RETURN {status: "blocked", cycles: cycles, inversions: [], phases: phases}
  SET inversions = check_genesis_order(phases)
  IF inversions.length > 0: RETURN {status: "blocked", cycles: [], inversions: inversions, phases: phases}
  ORDER phases BY topological_z_order THEN genesis_rank THEN stable_tie_breaker
  RETURN {status: "pass", cycles: [], inversions: [], phases: phases}

# OUTPUT CONTRACT
SET phase_records = decompose_and_graph(selected_protocols, active_principles, context_bundle, analysis_bundle)
SET linearization = linearize(phase_records)
SET phase_records = linearization.phases

HANDOFF GATE (evidence-bearing):
  rule_id: "PROJECT"   yields: edge-list + boolean
  [check] linearization.status == "pass" (evidence: acyclic Z-graph, zero genesis inversions)
  [check] every phase has inputs, outputs, a genesis_stage, and all four graph axes (evidence: phase_records)
  [check] order is dependency-topological then genesis; severity is metadata only (evidence: no severity grouping)
  [check] every active mandatory principle binds a validator (evidence: active_principles)
  result: pass → NODE 6 ACT | cycle/inversion/gap → REPAIR (owner: project)


# ============================================================================
# NODE 6 — ACT         [epistemic · formalization · computation · yields: task procedures]
# ============================================================================
@purpose: "Formalize phases into atomic, target-specific task procedures under binding execution constraints, with full ripple chains"
@axis_question: "What does it resolve to?"
@cue: "FORMALISE_EXECUTABLE_TASKS"

CONTRACT:
  input:        phase_records
  transform:    apply task templates + architectural execution constraints → atomize → attach ripple chain
  constraints:  codebase_patterns are BINDING execution constraints; ripple chains carry NAMES not counts; each task realizes its phase's genesis stage
  output:       task_records[] (atomic, evidence contract, 9 ripple dimensions), hierarchical N.N.N ids
  handoff:      every task atomic + target-specific AND every ripple dimension present per task (yields: procedure + set-cardinality)

# Execution constraints bound to every emitted step.
DECLARE codebase_patterns: object
SET codebase_patterns = {
  "factory_creation":    {required: "construct via factory/builder, deps injected", forbidden: "scattered direct instantiation of cross-cutting types", principle: "Factory, DI"},
  "dependency_injection":{required: "inject collaborators via constructor/factory ({registry}.resolve)", forbidden: "newing external deps inside business logic", principle: "DIP, DI"},
  "registry_discovery":  {required: "self-register at load + resolve via {registry}", forbidden: "hardcoded lookup table or central variant switch", principle: "Registry, OCP"},
  "event_emission":      {required: "children emit events, parents subscribe", forbidden: "parent callbacks passed into children", principle: "Events, Low Coupling"},
  "ports_adapters":      {required: "domain depends on ports; infra behind adapters", forbidden: "vendor SDK/infra detail imported into domain", principle: "DIP, Ports & Adapters"},
  "contract_first":      {required: "typed schema at every boundary, validated", forbidden: "implicit/unvalidated cross-boundary payloads", principle: "Contract-First, ISP"},
  "encapsulation":       {required: "information hiding behind a stable interface", forbidden: "public mutable state, leaky getters", principle: "Encapsulation"},
  "structured_observability": {required: "{logger} with machine-queryable context matched to the concern", forbidden: "console/print or stringify-blob dumps", principle: "Observability"},
  "bounded_complexity":  {required: "one concern per unit; size within {limits.max_lines}/{limits.max_files}", forbidden: "god object, mixed-concern module, oversize file", principle: "SRP, Bounded Complexity"},
  "secrets_management":  {required: "secrets from env/secret-store, validated at boot", forbidden: "hardcoded secrets/credentials in code/config/logs", principle: "Secrets"},
  "input_validation":    {required: "validate + sanitize every external input at the boundary", forbidden: "raw untrusted data entering core logic", principle: "Input Validation, Fail-Fast"},
  "least_privilege":     {required: "minimal scope per component; deny by default", forbidden: "broad/ambient authority, default-open access", principle: "Least Privilege"},
  "config_externalization": {required: "env config via config layer, fail-fast if missing", forbidden: "hardcoded infra values; VAR-or-default fallback", principle: "Config Externalization"},
  "fail_fast":           {required: "detect invalid state and halt", forbidden: "fallback/default path that masks a failure", principle: "Fail-Fast"},
  "legacy_elimination":  {required: "delete dead/dual/deprecated in the SAME change; single forward path", forbidden: "dual-path, compat shim, deprecated marker, orphaned export", principle: "Zero Legacy, No Dual-Path, Delete-Dead"},
  "enforcement_rule":    {required: "encode a new invariant as an automated rule, register it, regenerate the catalog", forbidden: "convention-only enforcement with no automated gate", principle: "Policy as Code"}
}

# tools are SEMANTIC OPERATIONS; the adopted runtime maps each to its own tool through the map BOOTSTRAP.md holds.
DECLARE task_templates: object
SET task_templates = {
  "ANALYZE": {pattern: "Examine {target} for {criteria}", tools: ["SEARCH_CONTENT","READ_RESOURCE"], validation: "grep {observability_pattern} → structured observability present"},
  "FIND":    {pattern: "Locate {target} in {scope}", tools: ["DISCOVER_RESOURCES","SEARCH_CONTENT"], validation: "glob {centralized_config_dir}, index.{convention.source_ext} → single-source/barrel first"},
  "EXTRACT": {pattern: "Isolate {target} from {source}", tools: ["READ_RESOURCE","PERSIST_ARTIFACT"], validation: "where {convention.base_class_prefix} RESOLVES, glob its form → base class available; where ABSENT, the glob does not run and the extraction is validated by its declared home instead"},
  "CREATE":  {pattern: "Generate {target} using {method}", tools: ["PERSIST_ARTIFACT","EXECUTE_TOOL"], validation: "where {toolchain.build.execute} RESOLVES, run it (BLOCKING); where ABSENT, run {verify_cmd} (BLOCKING) — an absent slot cannot block, so the block falls to the validation that exists rather than being waived"},
  "VERIFY":  {pattern: "Validate {target} against {constraints}", tools: ["EXECUTE_TOOL","SEARCH_CONTENT"], validation: "where {toolchain.build.execute} RESOLVES, run it OR {verify_cmd} (BLOCKING); where ABSENT, {verify_cmd} alone (BLOCKING)"},
  "FILTER":  {pattern: "Select {target} where {condition}", tools: ["SEARCH_CONTENT","DISCOVER_RESOURCES"], validation: "grep invariant/contract patterns → maintained"},
  "EXECUTE": {pattern: "Perform {action} on {target}", tools: ["EXECUTE_TOOL","PERSIST_ARTIFACT"], validation: "grep {observability_pattern} → observability tracked"},
  "WRITE":   {pattern: "Persist {content} to {destination}", tools: ["PERSIST_ARTIFACT"], validation: "glob {migration_dir} → migration present if schema change"},
  "READ":    {pattern: "Load {target} from {source}", tools: ["READ_RESOURCE","DISCOVER_RESOURCES"], validation: "file exists before read"},
  "LINK":    {pattern: "Associate {source} with {target}", tools: ["PERSIST_ARTIFACT","SEARCH_CONTENT"], validation: "grep {registry_pattern} → registry/self-registration"},
  "ITERATE": {pattern: "Repeat {action} until {condition}", tools: ["EXECUTE_TOOL"], validation: "loop terminates with a validation gate"}
}

DECLARE ripple_dimensions: array
SET ripple_dimensions = ["registry", "contracts", "persistence", "security", "infrastructure", "performance", "observability", "enforcement", "consumers"]

FUNCTION analyze_ripple(task, phase, context_bundle):
  DECLARE chain: object
  SET chain = {registry: [], contracts: [], persistence: [], security: [], infrastructure: [], performance: [], observability: [], enforcement: [], consumers: []}
  FOR EACH dim IN ripple_dimensions:
    ANALYZE {task: task, phase: phase, deps: context_bundle.discovered} FOR dim INTO impacts
    FOR EACH i IN impacts: APPEND {entity: i.entity, action: task.verb, downstream: i.downstream, evidence: i.evidence, consequence_if_omitted: i.consequence} TO chain[dim]
    IF chain[dim].length == 0: APPEND {entity: "none", action: "verify", downstream: [], evidence: "applicability checked", consequence_if_omitted: "none"} TO chain[dim]
  RETURN chain

FUNCTION compile_tasks(phase_records, context_bundle):
  DECLARE records: array
  SET records = []
  FOR EACH phase IN phase_records:
    SET template = task_templates[phase.verb]
    DETERMINE task_groups FROM phase.affected_artifacts INTO groups
    FOR EACH group IN groups:
      EXTRACT atomic_actions FROM group USING template.pattern INTO actions
      FOR EACH action IN actions:
        FOR EACH pat_name IN codebase_patterns:
          IF action MATCHES codebase_patterns[pat_name].forbidden: REWRITE action TO codebase_patterns[pat_name].required
        FILTER phase.principles TO local WHERE decision_surface MATCHES action.target
        CREATE task FROM {phase_id: phase.id, genesis_stage: phase.genesis_stage, group: group.name, action: action, target: action.target, method: action.method, tools: template.tools, expected_evidence: derive_evidence(local, template.validation), local_principle_checks: local, validation: template.validation, done_condition: derive_done(action), ripple_chain: {}}
        SET task.ripple_chain = analyze_ripple(task, phase, context_bundle)
        APPEND task TO records
  # hierarchical numbering N.N.N
  SET pn = 0
  FOR EACH phase IN phase_records:
    SET pn = pn + 1; SET tn = 0
    FILTER records TO phase_tasks WHERE phase_id == phase.id
    FOR EACH t IN phase_tasks: SET tn = tn + 1; SET t.id = pn + "." + tn + ".1"
  RETURN records

# OUTPUT CONTRACT
SET task_records = compile_tasks(phase_records, context_bundle)

HANDOFF GATE (evidence-bearing):
  rule_id: "ACT"   yields: procedure + set-cardinality
  [check] task_records.length >= phase_records.length (evidence: task_records)
  [check] every task is atomic + target-specific with an evidence contract (evidence: expected_evidence per task)
  [check] every task carries all 9 ripple dimensions with NAMES (evidence: ripple_chain cardinality == 9)
  result: pass → NODE 7 CONSTRAIN | non-atomic/missing-ripple → REPAIR (owner: act)


# ============================================================================
# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: admissibility boolean]
# ============================================================================
@purpose: "Gate the formalized plan on teleological admissibility BEFORE verification — is this plan worth executing within budget and hard limits?"
@axis_question: "Is it still worth it, and is it allowed?"   @mandatory: always   @selectable: false
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
  input:        task_records + phase_records + teleology_bundle
  transform:    sum realized cost → compare to the selected branch budget → check every task traces to the branch → check hard limits
  constraints:  teleology is MANDATORY-ALWAYS; a plan whose realized cost exceeds the branch's assumed cost, or that drifts off the selected branch, is INADMISSIBLE and routes back — the cost is not silently accepted
  output:       admissibility { ok, realized_cost, budget, off_branch[], limit_breaches[] }
  handoff:      GATE — realized_cost <= budget AND off_branch empty AND limit_breaches empty (yields: boolean)

FUNCTION assess_admissibility(task_records, phase_records, teleology_bundle):
  DECLARE realized_cost: number
  SET realized_cost = 0
  FOR EACH t IN task_records: SET realized_cost = realized_cost + estimate_cost(t)   # effort + blast_radius + risk
  DECLARE off_branch: array
  SET off_branch = []
  FOR EACH t IN task_records:
    ANALYZE t AGAINST teleology_bundle.selected_branch INTO trace
    IF trace.on_branch == false: APPEND {task: t.id, reason: trace.reason} TO off_branch
  DECLARE limit_breaches: array
  SET limit_breaches = []
  FOR EACH p IN phase_records:
    FOR EACH pr IN p.principles WHERE pr.id == "COMPLEXITY":
      IF exceeds(p, EVERY limit slot that RESOLVES — {limits.max_lines} and {limits.max_files}, each only where it RESOLVES): APPEND {phase: p.id, breach: "over hard limit"} TO limit_breaches. An ABSENT limit contributes no comparison rather than a passing one, so the breach set is over the limits that exist and the absence is stated rather than silently satisfied.
  SET budget = teleology_bundle.selected_branch.cost
  RETURN {ok: (realized_cost <= budget AND off_branch.length == 0 AND limit_breaches.length == 0), realized_cost: realized_cost, budget: budget, off_branch: off_branch, limit_breaches: limit_breaches}

# OUTPUT CONTRACT
SET admissibility = assess_admissibility(task_records, phase_records, teleology_bundle)

HANDOFF GATE (teleology admissibility gate):
  rule_id: "CONSTRAIN"   yields: boolean
  [check] admissibility.realized_cost <= admissibility.budget (evidence: realized_cost vs budget)
  [check] admissibility.off_branch.length == 0 (evidence: every task traces to the selected branch)
  [check] admissibility.limit_breaches.length == 0 (evidence: hard {limits.*} respected)
  result: pass → NODE 8 VERIFY
          | cost over budget / off-branch → REPAIR (owner: intent — re-rank or re-scope the branch)
          | limit breach → REPAIR (owner: act — re-atomize under the limit)


# ============================================================================
# NODE 8 — VERIFY      [evaluative · verification · logic + probability · yields: validation report]
# ============================================================================
@purpose: "Judge the generated reasoning against evidence, falsification, confidence, and semantic policy before commitment"
@axis_question: "Is it real?"   @mandatory: always   @selectable: false
@cue: "VERIFY_REASONING_NOT_IMPLEMENTATION"

CONTRACT:
  input:        context_bundle + teleology_bundle + phase_records + task_records
  transform:    run validation suites → verify claims by evidence → apply the 5 verification nodes → apply the semantic-debt rubric
  constraints:  a claim is supported only WITH evidence (never "no contradiction found"); confidence is a number[0,1] tested against a threshold; policy is SEMANTIC, never a substring ban
  output:       validation_report { status: pass|repair_required|blocked, findings[] with owner, confidence }
  handoff:      GATE ver-stop — zero blocker/error findings AND ver-evidence non-empty AND confidence >= threshold AND refutation not outweighing support (yields: boolean)

# The five verification nodes (each typed). ver-evidence binds to the host's claims-are-lies concept.
DECLARE verification_nodes: array
SET verification_nodes = [
  {id: "ver-evidence",     asks: "what evidence supports this?",                       yields: "evidence-set", test: "evidence set is non-empty"},
  {id: "ver-ground-truth", asks: "is it true against reality, not merely coherent?",   yields: "boolean",      test: "checked against a trusted source, not inferred"},
  {id: "ver-falsification",asks: "what would refute it?",                              yields: "set",          test: "a concrete refuting observation is named"},
  {id: "ver-confidence",   asks: "how confident, and is it enough?",                   yields: "number[0,1]",  test: "confidence at or above threshold"},
  {id: "ver-refutation",   asks: "does refutation outweigh support?",                  yields: "boolean",      test: "support outweighs refutation"}
]
DECLARE confidence_threshold: number
SET confidence_threshold = 0.75   # resolve from {project.*} when the host declares one

# Semantic policy over controlled concepts. Keys on the RELATION to a concept, so a prohibited design
# cannot pass by renaming, and legitimately mentioning/analyzing/removing debt is NOT blocked.
DECLARE controlled_concepts: array
SET controlled_concepts = [
  {concept: "backward_compatibility_path", prohibited_relations: ["introduce", "retain"]},
  {concept: "fallback_masking_failure",    prohibited_relations: ["introduce", "retain"]},
  {concept: "deprecated_production_path",  prohibited_relations: ["introduce", "retain"]},
  {concept: "dual_production_path",        prohibited_relations: ["introduce", "retain"]},
  {concept: "deferred_required_work",      prohibited_relations: ["introduce", "retain"]},
  {concept: "shortcut_debt",               prohibited_relations: ["introduce", "retain"]},
  {concept: "unsupported_superlative_claim", prohibited_relations: ["assert"]}
]

FUNCTION classify_concept_relation(scope, content):
  DECLARE relations: array
  SET relations = []
  FOR EACH cc IN controlled_concepts:
    ANALYZE content FOR cc.concept INTO matches
    IF matches.length > 0:
      ANALYZE content FOR relation_to(cc.concept) INTO relation   # introduce | retain | remove | analyze | mention | assert
      IF relation IN ["mention", "analyze", "quote", "remove"]: SET decision = "allowed"
      ELSE IF relation IN cc.prohibited_relations:               SET decision = "violation"
      ELSE:                                                       SET decision = "investigate"
      APPEND {concept: cc.concept, relation: relation, scope: scope, decision: decision, evidence: matches} TO relations
  RETURN relations

DECLARE validation_suites: array
SET validation_suites = [
  {id: "GV-STATE",     checks: ["required records + fields exist", "ids unique", "references resolve"]},
  {id: "GV-AUTHORITY", checks: ["authority conflicts resolved", "task constraints do not override governance", "evidence not conflated with normative authority"]},
  {id: "GV-TELEOLOGY", checks: ["selected branch is argmax(utility-cost) over admissible", "every phase traces to the objective", "constrain admissibility held"]},
  {id: "GV-ACTIVATION",checks: ["active principles are applicable", "inactive principles have a disposition", "every active principle has a decision point + validator"]},
  {id: "GV-PLAN",      checks: ["phase inputs/outputs complete", "Z acyclic", "genesis order consistent", "X/Y/W explicit", "severity does not control order"]},
  {id: "GV-TASKS",     checks: ["tasks atomic + target-specific", "evidence + done observable", "validation method available", "failure correction defined"]},
  {id: "GV-RIPPLE",    checks: ["9 dimensions per task", "all identified impacts retained (not first-match)", "empty dims carry applicability evidence"]},
  {id: "GV-SEMANTIC",  checks: ["concept relations are semantic not lexical", "no prohibited target state introduced/retained", "analysis/removal language NOT falsely blocked"]},
  {id: "GV-EVIDENCE",  checks: ["material claims have evidence", "evidence scope matches the claim", "a refuting observation is named per material claim", "zero-result claims record searched scope", "confidence >= threshold", "stale/low-confidence not presented as certain"]},
  {id: "GV-OUTPUT",    checks: ["every required field serializable", "rendering needs no architecture inference", "phases/tasks numberable deterministically"]}
]

FUNCTION verify_claims(records, context_bundle):
  DECLARE results: array
  SET results = []
  EXTRACT material_claims FROM records INTO claims
  FOR EACH claim IN claims:
    FIND claim.support IN context_bundle.evidence_inventory INTO support        # ver-evidence
    FIND claim.contradiction IN context_bundle.evidence_inventory INTO against  # ver-refutation
    NAME what_would_refute(claim) INTO refuter                                   # ver-falsification
    ASSESS confidence(support, against, claim.freshness) INTO conf              # ver-confidence, number[0,1]
    IF against.length > support.length:      SET status = "contradicted"
    ELSE IF support.length == 0:             SET status = "unsupported"
    ELSE IF claim.applicability == "n/a":    SET status = "not_applicable"
    ELSE IF conf < confidence_threshold:     SET status = "under_confident"
    ELSE:                                     SET status = "supported"
    APPEND {claim: claim, status: status, evidence: support, refuter: refuter, confidence: conf} TO results
  RETURN results

FUNCTION run_suites(records):
  DECLARE findings: array
  SET findings = []
  FOR EACH suite IN validation_suites:
    FOR EACH check IN suite.checks:
      ANALYZE records AGAINST check INTO r
      IF r.pass == false: APPEND {rule_id: suite.id, owner: r.owner, affected: r.record, severity: r.severity, evidence: r.evidence, explanation: r.explanation, repair: r.repair} TO findings
  RETURN findings

# OUTPUT CONTRACT
DECLARE validation_report: object
SET semantic_findings = []
FOR EACH task IN task_records:
  SET rels = classify_concept_relation("task", task.action + " " + task.done_condition)
  FOR EACH rel IN rels:
    IF rel.decision == "violation": APPEND {rule_id: "GV-SEMANTIC", owner: "act", affected: task.id, severity: "blocker", evidence: rel.evidence, explanation: "task introduces/retains a prohibited target state", repair: "change the DESIGN, not the wording"} TO semantic_findings
    ELSE IF rel.decision == "investigate": APPEND {rule_id: "GV-SEMANTIC", owner: "act", affected: task.id, severity: "error", evidence: rel.evidence, explanation: "controlled-concept relation unresolved", repair: "classify the relation from context"} TO semantic_findings
SET claim_results = verify_claims({phases: phase_records, tasks: task_records}, context_bundle)
SET suite_findings = run_suites({context: context_bundle, teleology: teleology_bundle, phases: phase_records, tasks: task_records, claims: claim_results})
SET min_confidence = min(claim_results.confidence)
SET validation_report = {status: "repair_required", findings: [], confidence: min_confidence, evidence_examined: context_bundle.evidence_inventory, unresolved: context_bundle.unresolved_questions}
FOR EACH f IN suite_findings:    APPEND f TO validation_report.findings
FOR EACH f IN semantic_findings: APPEND f TO validation_report.findings
FOR EACH c IN claim_results:
  IF c.status IN ["contradicted", "unsupported"]: APPEND {rule_id: "GV-EVIDENCE", owner: "verify", affected: c.claim.id, severity: "error", evidence: c.evidence, explanation: c.status, repair: "obtain evidence, correct the claim, or record an explicit disposition"} TO validation_report.findings
  ELSE IF c.status == "under_confident": APPEND {rule_id: "GV-EVIDENCE", owner: "verify", affected: c.claim.id, severity: "error", evidence: {confidence: c.confidence, threshold: confidence_threshold}, explanation: "confidence below threshold", repair: "gather evidence until confidence >= threshold or record disposition"} TO validation_report.findings
FILTER validation_report.findings TO blocking WHERE severity IN ["blocker", "error"]
IF blocking.length == 0 AND min_confidence >= confidence_threshold: SET validation_report.status = "pass"
ELSE:                                                               SET validation_report.status = "repair_required"

HANDOFF GATE (ver-stop gate):
  rule_id: "VERIFY"   yields: boolean
  [check] every finding names what it examined (evidence: findings carry evidence + rule_id) — no ceremony
  [check] ver-evidence non-empty for every material claim; a refuter is named (evidence: claim_results)
  [check] validation_report.confidence >= confidence_threshold (evidence: min_confidence)
  [check] status == "pass" (evidence: zero blocker/error findings)
  result: pass → NODE 9 COMMIT | repair_required → REPAIR (refutes-back to the earliest owner)


# ----------------------------------------------------------------------------
# REPAIR EDGE  (verify --refutes-back--> earliest invalid node; bounded by ter-diminishing-returns)
# ----------------------------------------------------------------------------
@purpose: "Repair from the earliest responsible node, invalidate every dependent record, bound the attempts"
@cue: "REPAIR_CAUSE_NOT_WORDING"

CONTRACT:
  input:        validation_report.findings (or a failed CONSTRAIN admissibility)
  transform:    route each finding to its owner node → invalidate dependents → re-run from there
  constraints:  BOUNDED (max_cycles = recursion_limit = 3, the ter-diminishing-returns node); severity decides route; NEVER restore a downstream record after an upstream repair
  output:       repaired records with status "pass", OR status "blocked" + remaining findings
  handoff:      status == "pass" → NODE 9 | cycle > max_cycles → NODE 10 as BLOCKED (ter-diminishing-returns)

DECLARE repair_state: object
SET repair_state = {cycle: 0, max_cycles: 3, earliest_node: "", invalidated: [], applied: [], remaining: []}

# node order == the loop spine; repair re-enters at the earliest owning node and re-runs forward.
DECLARE node_order: array
SET node_order = ["orient", "intent", "see", "derive", "project", "act", "constrain", "verify", "commit"]

FUNCTION earliest_invalid_node(findings):
  FOR EACH node IN node_order:
    FIND node IN findings.owner INTO hits
    IF hits.length > 0: RETURN node
  RETURN "verify"

# Severity governs the FAILURE ROUTE.
FUNCTION route_by_severity(finding):
  IF finding.severity IN ["blocker"]:         RETURN "block_and_repair"
  IF finding.severity == "error":             RETURN "repair"
  IF finding.severity == "warning":           RETURN "disposition_required"
  RETURN "investigate"

FUNCTION invalidate_dependents(node):
  # marking cascades forward only — an upstream repair invalidates everything downstream of it
  SET idx = INDEX_OF(node_order, node)
  FOR EACH downstream IN node_order FROM idx:
    MARK record_of(downstream) AS invalid
    APPEND downstream TO repair_state.invalidated
  RETURN true

FUNCTION rerun_from(node):
  # re-execute the owning node and every node after it, threading fresh records forward
  IF node == "orient":                                          RERUN NODE 1 → context_bundle
  IF node IN ["orient","intent"]:                               RERUN NODE 2 → teleology_bundle
  IF node IN ["orient","intent","see"]:                         RERUN NODE 3 → analysis_bundle
  IF node IN ["orient","intent","see","derive"]:                RERUN NODE 4 → active_principles, selected_protocols
  IF node IN [...,"project"]:                                   RERUN NODE 5 → phase_records
  IF node IN [...,"act"]:                                       RERUN NODE 6 → task_records
  IF node IN [...,"constrain"]:                                 RERUN NODE 7 → admissibility
  IF node IN [...,"verify"]:                                    RERUN NODE 8 → validation_report
  RETURN {context: context_bundle, teleology: teleology_bundle, analysis: analysis_bundle, phases: phase_records, tasks: task_records, report: validation_report}

WHILE validation_report.status == "repair_required":
  SET repair_state.cycle = repair_state.cycle + 1
  IF repair_state.cycle > repair_state.max_cycles:              # ter-diminishing-returns: progress bounded
    SET validation_report.status = "blocked"
    SET repair_state.remaining = validation_report.findings
    REPORT "REPAIR_LIMIT_EXCEEDED (ter-diminishing-returns)"
    BREAK
  SET repair_state.earliest_node = earliest_invalid_node(validation_report.findings)
  FOR EACH f IN validation_report.findings WHERE f.owner == repair_state.earliest_node:
    SET route = route_by_severity(f)
    EXECUTE f.repair WITH evidence: f.evidence, route: route
    APPEND {finding: f.rule_id, repair: f.repair, route: route} TO repair_state.applied
  SET invalidated = invalidate_dependents(repair_state.earliest_node)
  SET rerun = rerun_from(repair_state.earliest_node)
  SET validation_report = rerun.report
  REPORT repair_state


# ============================================================================
# NODE 9 — COMMIT      [evaluative · representation · information-theory · yields: rendered artifact]
# ============================================================================
@purpose: "Serialize only validated records into the one canonical representation, deduplicated, adding no new decision"
@axis_question: "How is it encoded?"
@cue: "COMMIT_WITHOUT_NEW_DECISIONS"

CONTRACT:
  input:        validated records OR a blocked validation_report
  transform:    deterministic render → dedup (no phase/task encoded twice) → integrity check
  constraints:  rendering adds NO new architecture decision; identical content collapses to one representation (info-theory); future execution checkboxes stay UNCHECKED
  output:       rendered { markdown, novelty_ok }
  handoff:      every phase/task encoded exactly once AND no future checkbox pre-checked (yields: hash + boolean)

DECLARE rendering_rules: array
SET rendering_rules = ["number Phase N / Task N.M / Subtask N.M.K only after order is stable", "emit phases in Z-topological then genesis order", "preserve X/Y/W metadata", "severity is metadata only", "render only APPLIES principles as requirements", "preserve every ripple impact (names, not counts)", "empty dimension → none with applicability evidence", "introduce no unsupported claim", "leave future execution checkboxes unchecked"]

FUNCTION render_checklist(context_bundle, teleology_bundle, phase_records, task_records, validation_report):
  DECLARE out: array
  SET out = []
  APPEND heading("{task_description}") TO out
  # A DISTRIBUTION checklist declares the surface it absorbs and the row that performs the closure.
  # Both are read by the absorption edge: it joins on the DISTRIBUTES name and excludes the CLOSES row
  # by IDENTITY, because counting the row that performs the closure among the work the closure waits on
  # makes the edge unsatisfiable by construction. Omit both where the checklist distributes nothing.
  IF context_bundle.distributes IS PRESENT:
    APPEND "DISTRIBUTES: {context_bundle.distributes}" TO out
    APPEND "CLOSES: {context_bundle.closure_row_id}" TO out
  APPEND "Confidence: {validation_report.confidence} | Principle ontology: {project.principle_ontology}" TO out
  # NO generation date: a date a READER interprets is narrative, and only a date a MECHANISM consumes to
  # compute a verdict is an operand. Nothing reads this one.
  # PHASES ARE NAMED, NEVER COUNTED: a count is a fact the enumeration below already carries, so a summary
  # line over it is wrong from the first change nobody propagated while reading as current.
  APPEND "Phases: {phase_records.id} | Protocols: {selected_protocols.id}" TO out
  APPEND "## Governing Context" TO out
  APPEND "- Objective (teleology): {teleology_bundle.objective}" TO out
  APPEND "- Selected branch: {teleology_bundle.selected_branch.approach} (utility-cost argmax over {teleology_bundle.ranking.length} admissible)" TO out
  APPEND "- Change relation (ontology): {context_bundle.change_relation}" TO out
  APPEND "- Ontological readout: {context_bundle.active_dimensions.id}" TO out
  APPEND "- Analytical lenses (see): {analysis_bundle.active_lenses.id}" TO out
  APPEND "- Authoritative sources: {context_bundle.authoritative_sources}" TO out
  APPEND "### Principle Disposition (applies / uncertain / n/a — reason — validator)" TO out
  FOR EACH p IN active_principles: APPEND row(p.id, p.applicability, p.reason, p.validator) TO out
  SET pn = 0
  FOR EACH phase IN phase_records:
    SET pn = pn + 1
    APPEND "## PHASE {pn}: {phase.verb} <{phase.objective}>  [genesis: {phase.genesis_stage}]" TO out
    APPEND "Loop Class: {phase.loop_class} | Severity: {phase.severity}" TO out
    APPEND "Dependencies (4D) — Z: {phase.graph_4d.sequential_z} | X: {phase.graph_4d.lateral_x} | Y: {phase.graph_4d.diagonal_y} | W: {phase.graph_4d.propagation_w}" TO out
    APPEND "Ripple Chain (dimension | entity | downstream | consequence-if-omitted)" TO out
    FILTER task_records TO phase_tasks WHERE phase_id == phase.id
    FOR EACH dim IN ripple_dimensions:
      FOR EACH t IN phase_tasks: FOR EACH i IN t.ripple_chain[dim]: APPEND row(dim, i.entity, i.downstream, i.consequence_if_omitted) TO out
    SET tn = 0
    FOR EACH t IN phase_tasks:
      SET tn = tn + 1
      APPEND "### Task {pn}.{tn}: {t.group} (target: {t.target})" TO out
      APPEND "- [ ] {t.id} {t.action} — method: {t.method}; evidence: {t.expected_evidence}; validation: {t.validation}; done when: {t.done_condition}" TO out
    APPEND "### Phase Execution Gate — BLOCKS PHASE {pn+1} (future execution, left unchecked)" TO out
    APPEND "- [ ] Run every task validation + record evidence" TO out
    APPEND "- [ ] Run active mandatory principle validators; resolve recommended dispositions" TO out
    APPEND "- [ ] Complete + validate every W-axis propagation edge" TO out
    APPEND "- [ ] Run {verify_cmd}, and {toolchain.build.execute} where that slot RESOLVES" TO out
    APPEND "- [ ] the claim-verification agent reports clean, where the tree ships one (gaps addressed + re-verified) before the next phase" TO out
  APPEND "# APPENDIX A — File Organization: {project_structure_from_governance_policy}" TO out
  APPEND "# APPENDIX B — Evidence Inventory (id | source | observation | freshness | confidence)" TO out
  FOR EACH e IN context_bundle.evidence_inventory: APPEND row(e.id, e.source, e.observation, e.freshness, e.confidence) TO out
  APPEND "# APPENDIX C — Registry / Contract / Enforcement changes (from ripple_chain)" TO out
  APPEND "# FINAL EXECUTION GATE — BLOCKING (future execution; unchecked at generation)" TO out
  APPEND "- [ ] Every phase gate has an evidence-bearing pass report" TO out
  APPEND "- [ ] Every active mandatory principle satisfied; recommended exceptions have a disposition" TO out
  APPEND "- [ ] Every superseded path/registration/export/config/consumer marked for removal is absent from scope" TO out
  APPEND "- [ ] Build, tests, architecture/security/performance validators required by active principles pass" TO out
  APPEND "- [ ] the claim-verification agent, where the tree ships one, reports zero blocker/error findings with evidence listed" TO out
  REDUCE out TO markdown
  RETURN markdown

FUNCTION render_blocked(context_bundle, validation_report, repair_state):
  DECLARE out: array
  SET out = ["# CHECKLIST GENERATION BLOCKED", "## Objective", context_bundle.normalized_intent, "## Blocking Findings (rule | owner | evidence | required resolution)"]
  FOR EACH f IN validation_report.findings WHERE f.severity IN ["blocker", "error"]: APPEND row(f.rule_id, f.owner, f.evidence, f.repair) TO out
  APPEND "## Completed Evidence Acquisition" TO out
  FOR EACH e IN context_bundle.evidence_inventory: APPEND "- {e.source} — {e.observation}" TO out
  APPEND "## Invalidated Outputs: {repair_state.invalidated}" TO out
  REDUCE out TO markdown
  RETURN markdown

# OUTPUT CONTRACT
DECLARE rendered: object
IF validation_report.status == "pass":
  SET markdown = render_checklist(context_bundle, teleology_bundle, phase_records, task_records, validation_report)
  # info-theory: no phase/task encoded twice; identical rows collapse
  DEDUP markdown BY (phase.id, task.id) INTO markdown; ASSESS novelty(markdown) INTO novelty_ok
  SET rendered = {markdown: markdown, novelty_ok: novelty_ok, kind: "success"}
ELSE:
  SET markdown = render_blocked(context_bundle, validation_report, repair_state)
  SET rendered = {markdown: markdown, novelty_ok: true, kind: "blocked"}

HANDOFF GATE (evidence-bearing):
  rule_id: "COMMIT"   yields: hash + boolean
  [check] rendered.novelty_ok == true — no phase/task encoded twice (evidence: dedup pass)
  [check] no future execution checkbox pre-checked (evidence: render scan)
  [check] no architecture decision introduced at render (evidence: rendering_rules honored)
  result: pass → NODE 10 TERMINATE | integrity defect → REPAIR (owner: commit)


# ============================================================================
# NODE 10 — TERMINATE  [evaluative · termination · set-theory · yields: ter-stop boolean]
# ============================================================================
@purpose: "Stop only on saturation AND completion AND verification; otherwise block on external input — never a self-assessed stop"
@axis_question: "Are we done?"   @mandatory: always   @selectable: false
@cue: "TERMINATE_EXPLICITLY"

CONTRACT:
  input:        rendered + validation_report + repair_state + context_bundle
  transform:    evaluate the termination node-set → write exactly one terminal artifact
  constraints:  ter-stop == saturation AND completion AND verification (the only success stop); ter-block routes to the owner through the runtime's question tool; ter-diminishing-returns bounds repair; one terminal only
  output:       generation_result { status: success|blocked, output_file }
  handoff:      terminal — no premature stop while status is repairable, no loop beyond max_cycles (yields: boolean)

# The termination node-set (each typed). ter-stop is the conjunction the host AXIOM demands.
DECLARE termination_nodes: array
SET termination_nodes = [
  {id: "ter-completion",         asks: "is every task done (rendered) ?",              yields: "boolean", test: "every generation task produced its record"},
  {id: "ter-saturation",         asks: "is nothing left to resolve?",                  yields: "boolean", test: "no open unresolved_questions, no repair_required"},
  {id: "ter-diminishing-returns",asks: "has progress stopped increasing?",             yields: "counter", test: "repair cycles within recursion_limit", role: "injection-gate"},
  {id: "ter-block",              asks: "is it blocked on external input?",             yields: "boolean", test: "an unresolved question needs the user"},
  {id: "ter-stop",               asks: "complete and verified, saturated, or blocked?", yields: "boolean", test: "saturation AND completion AND verification", role: "completion-marker"}
]

FUNCTION evaluate_termination(rendered, validation_report, repair_state, context_bundle):
  SET completion  = (rendered.kind == "success")
  SET verification = (validation_report.status == "pass")
  SET saturation  = (context_bundle.unresolved_questions.length == 0 AND validation_report.status != "repair_required")
  SET diminished  = (repair_state.cycle > repair_state.max_cycles)
  SET blocked_on_user = (context_bundle.unresolved_questions.length > 0 AND NOT verification)
  SET ter_stop = (saturation AND completion AND verification)
  RETURN {completion: completion, verification: verification, saturation: saturation, diminished: diminished, blocked_on_user: blocked_on_user, ter_stop: ter_stop}

# TERMINAL — exactly one of success / blocked; bounded by max_cycles in the REPAIR edge.
SET term = evaluate_termination(rendered, validation_report, repair_state, context_bundle)
IF term.ter_stop == true:
  VERIFY rendered.markdown FOR {every_phase_and_task_once, contiguous_numbering, no_dropped_ripple_impact, no_inactive_principle_as_mandatory, no_precompleted_execution_checkbox} INTO render_check
  IF render_check.pass == true:
    # The checklist lands in a planning root the configuration DECLARES, because a planning surface in a
    # directory no gate reads is ungoverned wherever it sits — the binding is what governs it, never its
    # location. Writing to the working directory would place it outside every declared root by default.
    WRITE rendered.markdown TO "{surface.planning}/{task_name}.checklist.md"
    SET generation_result = {status: "success", output_file: "{surface.planning}/{task_name}.checklist.md", phases: phase_records.length, tasks: task_records.length, confidence: validation_report.confidence}
  ELSE:
    APPEND render_check.findings TO validation_report.findings   # serialization-only defect → REPAIR (owner: commit)
    SET generation_result = {status: "blocked", reason: "rendering integrity"}
ELSE IF term.blocked_on_user == true:
  # ter-block: the generator cannot resolve this alone — surface it to the owner through the runtime's question tool, do NOT guess
  SET generation_result = {status: "blocked", reason: "ter-block: external input required", questions: context_bundle.unresolved_questions}
  WRITE rendered.markdown TO "{surface.planning}/{task_name}.blocked.checklist.md"
ELSE:
  # ter-diminishing-returns exhausted, or verification unmet without a user question
  WRITE rendered.markdown TO "{surface.planning}/{task_name}.blocked.checklist.md"
  SET generation_result = {status: "blocked", output_file: "{task_name}-checklist-blocked.md", remaining: repair_state.remaining}

HANDOFF GATE (ter-stop gate):
  rule_id: "TERMINATE"   yields: boolean
  [check] generation_result.status IN ["success", "blocked"] AND output_file != "" (evidence: generation_result)
  [check] success ONLY when saturation AND completion AND verification all hold (evidence: term)
  [check] repair_state.cycle <= max_cycles (evidence: bounded loop)
  [check] no future execution checkbox pre-checked (evidence: render_check)
  result: TERMINATE

FINALIZE generation_result


# ============================================================================
# CROSS-NODE INVARIANTS  (bind every node)
# ============================================================================
ALWAYS:
  - resolve authority, trust, and the ONTOLOGY of the change (NODE 1) before resolving its TELEOLOGY (NODE 2), and both before any seeing/deriving
  - run the four mandatory-always gates every generation: tel-priority (NODE 2), constrain admissibility (NODE 7), ver-stop (NODE 8), ter-stop (NODE 10)
  - walk the selectable epistemic axes (ontology dimensions, analytical lenses) WHEN-RELEVANT, never all-always and never none
  - type every decision to its yields-shape; a gate that should yield a ranking (priority) is not satisfied by a boolean, and vice-versa
  - ground phase order in the substrate genesis (existence->...->emergence); a genesis inversion is a decomposition defect
  - discover current artifacts before architecture assumptions
  - activate a principle only with an applicability decision, and bind it to a validator
  - order phases by dependency then genesis; severity is metadata that ROUTES failure, never a grouping axis
  - express every node's inputs, outputs, transformation, and handoff explicitly; a node reads ONLY the prior node's output contract
  - represent Z sequential, X lateral, Y diagonal, W propagation, and preserve every ripple impact (names, not counts)
  - require evidence for every material claim, name what would refute it, and hold confidence at or above threshold
  - separate generation-time gates (this run) from future execution gates (left unchecked)
  - repair from the earliest invalid node and regenerate every dependent record; bound repair by ter-diminishing-returns
  - render deterministically and deduplicated, adding no new decision

NEVER:
  - proceed past NODE 2 on a branch that is not the highest-worth admissible one
  - conflate ontology (what the change IS) with teleology (what it is FOR)
  - treat prior model knowledge as current system evidence
  - treat a principle label as proof that local reasoning occurred
  - select a protocol from a trigger word alone
  - mark a claim supported only because no contradiction was found, or ship a claim below the confidence threshold
  - enforce semantic policy with a SUBSTRING BAN (removing the word while keeping the design)
  - group phases by severity/priority headers, or accept a genesis inversion as a tie-break
  - output count-only ripple, or filter ripple to the first match
  - restore a downstream record after an upstream repair invalidates it
  - stop on anything but saturation AND completion AND verification; a self-assessed "done" is not ter-stop
  - guess past a ter-block; unresolved external input is surfaced to the owner through the runtime's question tool
  - claim a future execution gate passed during generation, or let rendering infer an architecture decision
```
