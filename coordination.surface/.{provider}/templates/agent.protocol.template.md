---
name: agent.protocol
description: Executable template. Generates a portable, evidence-grounded investigation agent by walking the ten-node derivation-loop across four reasoning layers — every decision typed to a math shape, the agent's phase structure grounded in the substrate genesis cycle, the four mandatory-always gates (teleology, admissibility, verification, termination) enforced, and a runtime-neutral core rendered through an adapter. Never from assumptions, never with hardcoded runtime literals.
type: template
status: current
summary: Executable PAG template that generates a task-specific investigation agent from discovered evidence by walking the four-layer derivation-loop with math-typed decisions and genesis-grounded phase structure.
domain: [ai-governance, architecture]
keywords:
    [
        agent-generation,
        meta-agent,
        derivation-loop,
        substrate-genesis,
        teleology-gate,
        math-typed,
        yields-shape,
        evidence-grounded,
        portable-contract,
        adapter,
        capability-profile,
        non-destructive,
        verification,
        termination,
        audit,
    ]
version: 2
staleness-days: -1
depends-on:
supersedes:
---

# Agent Creation Template

```py CODE: PAG agent template
%% META %%:
priority: EVIDENCE > PORTABLE_CONTRACT > ADAPTER_RENDERING > TASK
trust: inspected_domain_evidence = TRUSTED, prior_knowledge = UNTRUSTED, an_assumption = FORBIDDEN
objective: compose a task-specific agent from inspected domain evidence into a runtime-neutral
           portable contract, render it through an adapter, and prove the artifact is grounded and embodied
recursion_limit: 3

# --- SLOT ABSENCES THIS TEMPLATE IS BOUND BY (declared once; honoured wherever they appear) --
#   An abstract {slot} resolves against the adapter binding. A slot with NO analogue resolves
#   ABSENT, and the branch depending on it DOES NOT RUN — the absence is declared, never faked.
#   Reading an ABSENT slot as though it resolved manufactures a demand nothing can satisfy, and a
#   gate satisfiable only by fabricating its own evidence is worse than no gate at all.
#   ABSENT here: {model} — model selection belongs to the runtime and is NEVER named in an emitted
#     artifact, so a rendered spec declares none; a value written here would have no source and
#     every later reader would inherit it as though it had one.
#   {project.invocation_registry} — invocations are discovered by the runtime and no registry is
#     authored, so nothing reads or writes one.
#   {convention.cache_ttl_days} — no domain cache is kept between runs, so the cache branch does
#     not run and every invocation investigates from the tree; there is no cache decision to
#     evidence, and a gate demanding one could only be satisfied by fabricating it.
#   {convention.medium_risk_threshold} · {convention.relevance_threshold} · {convention.embodiment_threshold}
#     — this tree bands no risk by resource count, scores no document relevance, and sets no embodiment
#     floor. Risk is HIGH where an external dependency exists and otherwise UNBANDED; documents are
#     selected by whether they BEAR on the domain; embodiment is judged by which markers are PRESENT
#     and named, never by a fraction against a floor. A threshold invented to fill an absent slot is a
#     number with no source, and a gate comparing against one is satisfiable only by inventing it.
#   {project.agent_registry} · {project.knowledge_docs} · {project.runtime_adapter} — no registry of
#     agents, no curated knowledge corpus and no declared adapter module exist here; the roster is the
#     agent directory read directly, the documents are the ones the domain evidence points at, and the
#     rendering is performed by the runtime the seat already runs in.
#   {project.principle_ontology} — the HOST's own catalog, which a host may not keep. Where it resolves it
#     WINS; where it is ABSENT the branch reads `{surface.principle_canon}`, the published catalog
#     the package points at, and only where NEITHER resolves does the extraction draw on the domain evidence alone. The two
#     slots sit BESIDE each other rather than one defaulting the other, because defaulting would make an
#     absent host catalog indistinguishable from a chosen one.
#   HONOURING AN ABSENCE IS A PROPERTY OF THE BRANCH, NEVER OF THIS BLOCK. Every step below that names
#     one of these slots is guarded on it RESOLVING, and every gate reading one carries the same guard —
#     declaring the absence here and running the branch anyway is the defect the declaration prevents.
#   AND A SLOT NAMES ITS SECTION. The seat index, the roles and the board live in the SURFACE section
#     rather than the project one; a slot written under the wrong section resolves to nothing while
#     reading as governed.

# --- THE FOUR LAYERS (each answers one question about this generation) -----------------------
#   substrate  — "How does the agent-to-be come to be?"  grounds its phase structure (LAYER 0)
#   epistemic  — "How is the domain known?"               orient · see · derive · project · act
#   conative   — "What agent is worth building?"          intent · constrain            (MANDATORY-ALWAYS)
#   evaluative — "Is the artifact real, and are we done?" verify · commit · terminate    (MANDATORY-ALWAYS)
#
# --- YIELDS-SHAPE LEGEND (every decision resolves to a typed shape) --------------------------
#   set-theory → set|boolean · logic → boolean · graph → edge-list · algebra → ordered-structure
#   analysis → operation · optimization → boolean|ranking · topology → boolean
#   probability → number[0,1] · information-theory → hash|novelty-score · computation → procedure
#   dynamical-systems → boolean|counter
#
# --- MANDATORY-ALWAYS GATES ------------------------------------------------------------------
#   TELEOLOGY  tel-priority (NODE 2)  → argmax(utility - cost) over admissible agent shapes
#   TELEOLOGY  constrain    (NODE 7)  → composed agent admissible: runtime-neutral, single-path, archive-safe, within worth budget
#   VERIFY     ver-stop     (NODE 8)  → grounded (evidence non-empty, grounding-confidence >= threshold), embodied, zero leakage
#   TERMINATE  ter-stop     (NODE 10) → saturation AND completion AND verification
# The selectable epistemic axes run WHEN-RELEVANT; the four gates above run ALWAYS.

SEMANTIC OPERATION BOUNDARY: nodes state WHAT must happen as semantic operations — DECLARE_RESOURCE,
DISCOVER_RESOURCES, READ_RESOURCE, SEARCH_CONTENT, ANALYZE_CONTENT, EXTRACT_FACTS, CALCULATE_METRIC,
COMPOSE_ARTIFACT, VALIDATE_ARTIFACT, PERSIST_ARTIFACT, REQUEST_DECISION, REPORT_RESULT. A runtime
ADAPTER decides HOW, through the operation-to-tool map BOOTSTRAP.md holds for each runtime. The core
carries no runtime paths or commands; every
{project.*} / {convention.*} / {model} token is adapter-resolved from the host.

Each node declares its layer, axis, mathType, yields-shape, input, transformation, constraint set,
output contract, and one evidence-bearing handoff gate. A node reads only the prior node's output
contract. The transitions (sequence, gate, refutes-back, terminal) are declared once in THE LOOP SPINE.


# ============================================================================
# LAYER 0 — SUBSTRATE  (genesis grammar; grounds the agent's phase structure in PROJECT)
# ============================================================================
@purpose: "Model how the AGENT-to-be comes to be, so its phase structure is a genesis, not a risk-lookup"
@question: "How does the agent come to be?"

# The agent is brought into being by passing through the genesis stages in order, recursing on
# `difference` when integration (emergence) reveals a domain distinction the phase set had not drawn.
DECLARE substrate_cycle: array
SET substrate_cycle = ["existence", "difference", "relation", "structure", "transformation", "constraint", "emergence"]
DECLARE substrate_recursion: object
SET substrate_recursion = {from: "emergence", to: "difference"}

DECLARE genesis_grammar: array
SET genesis_grammar = [
  {stage: "existence",      mathType: "set-theory",        yields: "set|boolean",       asks: "does the agent identity exist / is the contract scaffolded?"},
  {stage: "difference",     mathType: "logic",             yields: "boolean",           asks: "what domain boundary makes this agent distinct (its investigation scope)?"},
  {stage: "relation",       mathType: "graph",             yields: "edge-list",         asks: "what capabilities + registry does it depend on?"},
  {stage: "structure",      mathType: "algebra",           yields: "ordered-structure", asks: "how are its phases arranged (3/5/7 boundaries)?"},
  {stage: "transformation", mathType: "analysis",          yields: "operation",         asks: "what semantic operations does each phase perform?"},
  {stage: "constraint",     mathType: "optimization",      yields: "boolean|ranking",   asks: "what validation strategy + safety bounds it?"},
  {stage: "emergence",      mathType: "dynamical-systems", yields: "boolean|counter",   asks: "does it integrate + embody the architecture; did a new domain distinction appear?"}
]

# The phase-boundary a semantic-operation cluster realizes — PROJECT orders phases by this.
DECLARE phase_to_genesis: object
SET phase_to_genesis = {
  "Discovery": "existence", "Analysis": "difference", "Planning": "relation",
  "Generation": "structure", "Verification": "constraint", "Validation": "constraint", "Finalization": "emergence"
}

FUNCTION genesis_rank(phase_boundary):
  RETURN INDEX_OF(substrate_cycle, phase_to_genesis[phase_boundary])


# ============================================================================
# THE LOOP SPINE  (the ten nodes, their typing, and the transitions)
# ============================================================================
# node       layer       axis           mathType             yields                      transition out
# ---------- ----------- -------------- -------------------- --------------------------- -------------------------------------
# orient     epistemic   ontology       set-theory           run-frame + evidence        sequences → intent
# intent     conative    teleology      optimization         objective + shape-ranking   GATE tel-priority → see | onFail redirect
# see        epistemic   analysis       graph                knowledge-base + lens edges sequences → derive
# derive     epistemic   reasoning      logic                principles + design truths  sequences → project
# project    epistemic   reasoning      logic                phase-structure graph       sequences → act
# act        epistemic   formalization  computation          portable contract + render  sequences → constrain
# constrain  conative    teleology      optimization         admissibility boolean       GATE → verify | onFail repair
# verify     evaluative  verification   logic + probability  adjudication report         GATE ver-stop; onFail refutes-back (bounded)
# commit     evaluative  representation information-theory    persisted artifacts + audit sequences → terminate
# terminate  evaluative  termination    set-theory           ter-stop boolean            GATE ter-stop → STOP | ter-block → halt/ask the owner


# ============================================================================
# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: run-frame + evidence]
# ============================================================================
@purpose: "Load context, profile runtime capabilities, resolve collision + cache, and frame the target domain by its ontological dimensions"
@axis_question: "What is this generation, and what is the domain?"
@cue: "PROFILE_BEFORE_ACT"

CONTRACT:
  input:        user_request; host registries + ontology + workspace
  transform:    load context → probe capabilities → resolve collision mode → resolve cache → select relevant ontological dimensions of the domain
  constraints:  probe by CAPABILITY not OS-string; no silent duplicate/overwrite; cache identity by normalized-path hash + TTL; a dimension is framed only when relevant
  output:       run_frame { registries, capability_profile, runtime_mode, operation_mode, cache_decision, domain_cache, active_dimensions }
  handoff:      capabilities classified AND operation_mode resolved AND cache decided AND every "always" dimension framed (yields: boolean)

IF RESOLVES "{project.agent_registry}": DISCOVER_RESOURCES it INTO agent_registry
ELSE: DISCOVER_RESOURCES the agent directory itself INTO agent_registry   # the roster is the tree
IF RESOLVES "{project.invocation_registry}": DISCOVER_RESOURCES it INTO invocation_registry ELSE SET invocation_registry = "ABSENT"
IF RESOLVES "{project.knowledge_docs}": DISCOVER_RESOURCES it INTO knowledge_docs ELSE SET knowledge_docs = "ABSENT"
IF RESOLVES "{project.principle_ontology}": DECLARE_RESOURCE it AS principle_ontology
ELSE IF RESOLVES "{surface.principle_canon}": DECLARE_RESOURCE it AS principle_ontology   # the host's wins; the published catalog is the fallback
ELSE SET principle_ontology = "ABSENT"
SET agent_workspace = "{convention.agent_workspace}"

# The 15 ontological dimensions frame the target domain, walked WHEN-RELEVANT (each yields a typed observation).
DECLARE ontological_dimensions: array
SET ontological_dimensions = [
  {id: "identity",    asks: "what is the domain / what exists?",        mathType: "set-theory",        relevant_when: "always"},
  {id: "composition", asks: "what resources is it made of?",            mathType: "set-theory",        relevant_when: "always"},
  {id: "structure",   asks: "how are its parts arranged?",              mathType: "algebra",           relevant_when: "architecture patterns present"},
  {id: "relation",    asks: "what connects it (dependencies)?",         mathType: "graph",             relevant_when: "dependencies exist"},
  {id: "space",       asks: "where does it live (boundaries)?",         mathType: "topology",          relevant_when: "module/repo boundaries matter"},
  {id: "time",        asks: "what lifecycle does it have?",             mathType: "analysis",          relevant_when: "lifecycle/init/teardown present"},
  {id: "state",       asks: "what condition is it in?",                 mathType: "set-theory",        relevant_when: "stateful"},
  {id: "change",      asks: "how does it transform inputs?",            mathType: "analysis",          relevant_when: "always"},
  {id: "behavior",   asks: "what does it do at runtime?",              mathType: "dynamical-systems", relevant_when: "runtime behavior is the investigation target"},
  {id: "function",    asks: "what role does it fulfil?",                mathType: "analysis",          relevant_when: "purpose/responsibility in scope"},
  {id: "cause",       asks: "why does it behave so?",                   mathType: "analysis",          relevant_when: "a defect/mechanism is being investigated"},
  {id: "meaning",     asks: "what semantics must be preserved?",        mathType: "logic",             relevant_when: "domain semantics load-bearing"},
  {id: "scale",       asks: "at what level(s) does it recur?",          mathType: "topology",          relevant_when: "the pattern recurs across levels"},
  {id: "probability", asks: "how certain is the evidence?",             mathType: "probability",       relevant_when: "evidence partial"},
  {id: "novelty",     asks: "what deviates from expectation?",          mathType: "probability",       relevant_when: "an anomaly appears"}
]

FUNCTION profile_capabilities():
  DECLARE profile: object
  FOR EACH capability IN ["filesystem", "search", "execution", "persistence", "validation", "user_interaction"]:
    PROBE capability INTO verdict
    IF verdict == "available": SET profile[capability] = "available"
    ELSE IF safe_substitute_exists(capability): SET profile[capability] = "substituted"
    ELSE: SET profile[capability] = "unavailable"
  IF any_required == "unavailable" AND non_substitutable: SET runtime_mode = "blocked"
  ELSE IF any == "substituted": SET runtime_mode = "degraded"
  ELSE: SET runtime_mode = "full"
  RETURN {profile: profile, runtime_mode: runtime_mode}

FUNCTION resolve_operation_mode(user_request, agent_registry):
  EXTRACT target_agent_name FROM user_request
  CALCULATE name_collision = agent_registry CONTAINS target_agent_name
  CALCULATE domain_collision = agent_registry ANY covers target_domain
  IF name_collision OR domain_collision: REQUEST_DECISION user WITH ["REFINE", "RENAME", "REPLACE", "CANCEL"] INTO mode
  ELSE: SET mode = "CREATE"
  READ_RESOURCE "{surface.agent_index}" INTO index
  ALLOCATE letter = shortest identity the index does not bind, by the declared tiers
  PERSIST_ARTIFACT the index row for letter BEFORE any artifact is written
  RETURN {target_agent_name: target_agent_name, operation_mode: mode, letter: letter}

FUNCTION resolve_cache(user_request):
  # The cache branch runs ONLY where a lifetime is declared. Where {convention.cache_ttl_days} is
  # ABSENT no cache is kept between runs, so every invocation investigates from the tree and there is
  # no cache decision to evidence — a gate demanding one could only be satisfied by fabricating it.
  IF NOT RESOLVES "{convention.cache_ttl_days}": RETURN {cache_decision: "no_cache_kept", domain_cache: "ABSENT"}
  EXTRACT domain_path FROM user_request
  CALCULATE domain_hash = hash(NORMALIZE(domain_path))
  DECLARE_RESOURCE agent_workspace + "/domain-" + domain_hash INTO domain_cache
  IF EXISTS(domain_cache) AND age_days(domain_cache) < {convention.cache_ttl_days}: RETURN {cache_decision: "use_cached_domain", domain_cache: domain_cache}
  IF EXISTS(domain_cache): RETURN {cache_decision: "reject_stale_cache", domain_cache: domain_cache}
  RETURN {cache_decision: "no_cache_investigate", domain_cache: domain_cache}

FUNCTION select_dimensions(user_request):
  DECLARE active: array
  SET active = []
  FOR EACH d IN ontological_dimensions:
    IF d.relevant_when == "always": APPEND d TO active
    ELSE: ANALYZE_CONTENT user_request AGAINST d.relevant_when INTO fit; IF fit.applies: APPEND d TO active
  RETURN active

# OUTPUT CONTRACT
SET cap = profile_capabilities()
SET op = resolve_operation_mode(user_request, agent_registry)
SET cache = resolve_cache(user_request)
SET active_dimensions = select_dimensions(user_request)
SET run_frame = {registries: {agent_registry, invocation_registry, knowledge_docs, principle_ontology}, capability_profile: cap.profile, runtime_mode: cap.runtime_mode, operation_mode: op.operation_mode, target_agent_name: op.target_agent_name, cache_decision: cache.cache_decision, domain_cache: cache.domain_cache, active_dimensions: active_dimensions}

HANDOFF GATE (evidence-bearing):
  rule_id: "ORIENT"   yields: boolean
  [check] capabilities probed and classified full | degraded | blocked (evidence: capability_profile)
  [check] operation_mode in {CREATE, REFINE, RENAME, REPLACE, CANCEL}; no silent duplicate (evidence: operation_mode)
  [check] cache decision made by normalized-path hash + lifetime WHERE that slot resolves, and recorded as no-cache-kept where it does not (evidence: cache_decision)
  [check] every "always" dimension framed for the domain (evidence: active_dimensions)
  result: mode != CANCEL AND runtime_mode != blocked → NODE 2 INTENT | blocked/CANCEL → REPAIR (owner: orient)


# ============================================================================
# NODE 2 — INTENT      [conative · teleology · optimization · yields: objective + shape-ranking]
# ============================================================================
@purpose: "Resolve what the agent is FOR, enumerate candidate agent shapes, and gate on the highest-worth one BEFORE any domain work"
@axis_question: "What agent is worth building?"   @mandatory: always   @selectable: false
@cue: "WORTH_BEFORE_WORK"

CONTRACT:
  input:        run_frame + user_request
  transform:    state the investigation objective → enumerate admissible agent shapes (depth x rigor x capability) → score utility + cost → rank → select argmax
  constraints:  teleology is MANDATORY-ALWAYS; a shape is admissible only if the runtime supports it (capability_profile) and it covers the objective; NEVER proceed on a shape that is not the highest-worth admissible one; the 3/5/7 rigor choice is a RANKED decision, not a bare risk-lookup
  output:       teleology_bundle { objective, shapes[], selected_shape, ranking }
  handoff:      GATE tel-priority — selected_shape == argmax(utility - cost) over admissible shapes (yields: boolean over ranking)

DECLARE teleology_nodes: array
SET teleology_nodes = [
  {id: "tel-objective", asks: "what investigation must the agent perform?",           yields: "set"},
  {id: "tel-utility",   asks: "how much of the objective does this shape cover?",      yields: "number"},
  {id: "tel-cost",      asks: "what does this shape cost (complexity/runtime-risk/maintenance)?", yields: "number"},
  {id: "tel-priority",  asks: "is this the highest-worth admissible agent shape?",     yields: "boolean", role: "injection-gate",
     decision_test: "highest utility minus cost among admissible shapes"}
]

FUNCTION enumerate_shapes(run_frame, user_request):
  DECLARE shapes: array
  SET shapes = []
  # a shape = investigation depth (resource|directory|module|repository) x phase rigor (3|5|7) x required capabilities
  FOR EACH depth IN ["resource", "directory", "module", "repository"]:
    FOR EACH rigor IN [3, 5, 7]:
      DETERMINE required_capabilities FROM depth, rigor
      ANALYZE_CONTENT {required_capabilities, run_frame.capability_profile, objective} INTO adm
      APPEND {id: depth + "-" + rigor, depth: depth, rigor: rigor, admissible: adm.ok, inadmissible_reason: adm.reason, utility: 0, cost: 0} TO shapes
  RETURN shapes

FUNCTION score_and_rank(shapes, user_request):
  FOR EACH s IN shapes WHERE s.admissible == true:
    ASSESS coverage_of(objective, s.depth, s.rigor) INTO s.utility          # yields: number
    ASSESS complexity + runtime_risk + maintenance_burden(s) INTO s.cost    # yields: number
  ORDER shapes BY (utility - cost) DESC WHERE admissible == true INTO ranking
  RETURN ranking

# OUTPUT CONTRACT
DECLARE teleology_bundle: object
SET objective = extract_investigation_objective(user_request)
SET shapes = enumerate_shapes(run_frame, user_request)
SET ranking = score_and_rank(shapes, user_request)
DECLARE admissible: array
FILTER shapes TO admissible WHERE admissible == true
SET teleology_bundle = {objective: objective, shapes: shapes, ranking: ranking, selected_shape: (ranking.length > 0 ? ranking[0] : "none")}

HANDOFF GATE (tel-priority injection-gate):
  rule_id: "INTENT"   yields: boolean over ranking
  [check] objective != "" (evidence: teleology_bundle.objective)
  [check] admissible.length > 0 (evidence: shapes with admissible == true)
  [check] selected_shape == argmax(utility - cost) over admissible (evidence: ranking[0])
  result: pass → NODE 3 SEE
          | no admissible shape (capabilities too limited) → REDIRECT: degrade objective OR emit BLOCKED (ter-block)
          | selected is not argmax → REPAIR (owner: intent)


# ============================================================================
# NODE 3 — SEE         [epistemic · analysis · graph · yields: knowledge-base + lens edges]
# ============================================================================
@purpose: "Read the target domain non-destructively through the analytical lenses relevant to the selected agent shape, and build an evidence-grounded knowledge base"
@axis_question: "How is the domain to be seen?"
@cue: "DISCOVER_NEVER_ASSUME"

CONTRACT:
  input:        run_frame + teleology_bundle
  transform:    scope to the selected shape's depth → select relevant lenses → investigate non-destructively (or reuse fresh cache) → build knowledge base
  constraints:  NON-DESTRUCTIVE — inspect and analyze only, never mutate the source; every fact traces to a discovered resource; a lens is applied WHEN-RELEVANT to the objective
  output:       knowledge_base { scope, structure, purposes, dependencies, interfaces, patterns, statistics, lens_readout, evidence_sources }
  handoff:      knowledge base grounded in real resources AND persisted AND relevant lenses read (yields: edge-list + boolean)

DECLARE analytical_lenses: array
SET analytical_lenses = [
  {id: "structure",  asks: "how is the domain organized?",           mathType: "algebra"},
  {id: "relation",  asks: "what depends on what?",                  mathType: "graph"},
  {id: "behavior", asks: "how does it act at runtime?",            mathType: "dynamical-systems"},
  {id: "function",  asks: "what role does each part perform?",      mathType: "analysis"},
  {id: "sequential",  asks: "in what order do operations occur?",     mathType: "logic"},
  {id: "cause",      asks: "what produces what?",                    mathType: "analysis"},
  {id: "anomaly",     asks: "what breaks the normal pattern?",        mathType: "probability"},
  {id: "fractal",     asks: "does structure recur at scales?",        mathType: "topology"}
]

FUNCTION extract_scope(teleology_bundle):
  SET depth = teleology_bundle.selected_shape.depth
  MATCH depth:
    CASE "resource":   READ_RESOURCE domain_path INTO c; EXTRACT_FACTS interfaces, declarations, line_count FROM c INTO scope
    CASE "directory":  DISCOVER_RESOURCES domain_path INTO r; EXTRACT_FACTS resource_count, subdomains, interfaces FROM r INTO scope
    CASE "module":     DISCOVER_RESOURCES domain_path INTO r; ANALYZE_CONTENT r FOR architecture_patterns, base_classes INTO scope
    CASE "repository": DISCOVER_RESOURCES domain_path INTO r; ANALYZE_CONTENT r FOR systems, boundaries INTO scope
  RETURN {scope: scope, depth: depth}

FUNCTION select_lenses(teleology_bundle):
  DECLARE active: array
  SET active = []
  FOR EACH lens IN analytical_lenses:
    ANALYZE_CONTENT {objective: teleology_bundle.objective, depth: teleology_bundle.selected_shape.depth} AGAINST lens.asks INTO fit
    IF fit.relevant: APPEND lens TO active
  RETURN active

FUNCTION investigate(run_frame, scope, active_lenses):
  IF run_frame.cache_decision == "use_cached_domain": READ_RESOURCE run_frame.domain_cache INTO domain_knowledge
  ELSE:
    DECLARE plan: object
    SET plan.static = analyze-without-mutation
    IF run_frame.capability_profile.execution == "available": SET plan.executable = safe-observable-analysis
    ANALYZE_CONTENT scope VIA plan THROUGH active_lenses INTO domain_knowledge
    PERSIST_ARTIFACT domain_knowledge TO run_frame.domain_cache
  RETURN domain_knowledge

# OUTPUT CONTRACT
SET s = extract_scope(teleology_bundle)
SET active_lenses = select_lenses(teleology_bundle)
SET domain_knowledge = investigate(run_frame, s.scope, active_lenses)
DECLARE knowledge_base: object
SET knowledge_base.scope = s.scope
EXTRACT_FACTS structure, purposes, dependencies, interfaces, patterns FROM domain_knowledge INTO knowledge_base
CALCULATE_METRIC knowledge_base.statistics = {resource_count, interface_count, dependency_count, resource_types, architectural_patterns}
SET knowledge_base.lens_readout = domain_knowledge.by_lens   # relational lens yields the dependency edge-list
SET knowledge_base.evidence_sources = discovered_resources
PERSIST_ARTIFACT knowledge_base TO agent_workspace + "/domain-knowledge"

HANDOFF GATE (evidence-bearing):
  rule_id: "SEE"   yields: edge-list + boolean
  [check] scope depth matches the selected shape (resource | directory | module | repository) (evidence: knowledge_base.scope)
  [check] investigation mutated no source; outputs observable (evidence: non-destructive analysis)
  [check] every fact traces to an evidence source; relevant lenses read (evidence: evidence_sources, lens_readout)
  result: pass → NODE 4 DERIVE (owner: see)


# ============================================================================
# NODE 4 — DERIVE      [epistemic · reasoning · logic · yields: principles + design truths]
# ============================================================================
@purpose: "Characterize the domain from evidence and derive the portable principles that will govern the agent"
@axis_question: "Why this design, and what follows?"
@cue: "DERIVE_PORTABLE_PRINCIPLES"

CONTRACT:
  input:        knowledge_base + registries + teleology_bundle
  transform:    assign characteristics → measure baseline grammar → select relevant docs → extract portable principles
  constraints:  characteristics assigned FROM evidence; portable principles only (exclude runtime-specific from the core)
  output:       agent_design_core { characteristics, baseline, principles }
  handoff:      characteristics evidence-backed AND principles portable (runtime-specific excluded) (yields: boolean)

FUNCTION assign_characteristics(kb):
  ANALYZE_CONTENT kb FOR risk_factors, side_effects, dependency_patterns, uncertainty_factors
  IF dependencies.external.count > 0: SET risk = "high"
  ELSE IF RESOLVES "{convention.medium_risk_threshold}" AND kb.structure.resource_count > {convention.medium_risk_threshold}: SET risk = "medium"
  ELSE IF RESOLVES "{convention.medium_risk_threshold}": SET risk = "low"
  ELSE: SET risk = "UNBANDED"   # no band is declared, so no band is invented
  CALCULATE_METRIC complexity = weighted(resource_count, interface_count, dependency_patterns)
  CALCULATE reversibility IN [reversible, partially-reversible, irreversible] FROM side_effects + external_dependencies
  CALCULATE uncertainty IN [low, medium, high] FROM missing_evidence
  RETURN {risk: risk, complexity: complexity, reversibility: reversibility, uncertainty: uncertainty}

FUNCTION measure_baseline(agent_registry):
  DECLARE patterns: array
  FOR EACH agent IN agent_registry:
    READ_RESOURCE agent INTO spec
    APPEND {phase_count: count(phase_markers IN spec), gate_count: count(validation_gates IN spec), operation_count: count(semantic_operations IN spec)} TO patterns
  CALCULATE_METRIC baseline = {mean_phase_count, mean_gate_count} FROM patterns
  RETURN baseline

FUNCTION extract_principles(characteristics, relevant_docs, principle_ontology):
  SET candidates = ["phase_gated_execution", "validation_boundaries", "declaration_before_use", "evidence_before_composition", "adapter_separation", "auditability"]
  DECLARE principles: array
  FOR EACH p IN candidates: ANALYZE_CONTENT p AGAINST characteristics; IF applicable: APPEND p TO principles
  FOR EACH doc IN relevant_docs: EXTRACT_FACTS domain_principles FROM doc INTO principles
  # exclude runtime-specific principles from the portable core
  RETURN principles

# OUTPUT CONTRACT
DECLARE agent_design_core: object
SET agent_design_core.characteristics = assign_characteristics(knowledge_base)
SET agent_design_core.baseline = measure_baseline(agent_registry)
SET relevant_docs = []
IF knowledge_docs != "ABSENT":
  FOR EACH doc IN knowledge_docs:
    READ_RESOURCE doc INTO d
    IF RESOLVES "{convention.relevance_threshold}": IF match(d, agent_design_core.characteristics) > {convention.relevance_threshold}: APPEND doc TO relevant_docs
    ELSE: IF d BEARS ON agent_design_core.characteristics: APPEND doc TO relevant_docs   # selected by bearing, not by an invented score
SET agent_design_core.principles = extract_principles(agent_design_core.characteristics, relevant_docs, principle_ontology)

HANDOFF GATE (evidence-bearing):
  rule_id: "DERIVE"   yields: boolean
  [check] risk/complexity/reversibility/uncertainty assigned from evidence (evidence: characteristics)
  [check] principles portable, runtime-specific excluded (evidence: agent_design_core.principles)
  result: pass → NODE 5 PROJECT (owner: derive)


# ============================================================================
# NODE 5 — PROJECT     [epistemic · reasoning · logic · yields: phase-structure graph]
# ============================================================================
@purpose: "Decompose the agent's phase structure grounded in the AGENT genesis, at the rigor the selected shape ranked highest, and derive per-phase validation"
@axis_question: "What phase structure follows?"
@cue: "STRUCTURE_AS_GENESIS"

CONTRACT:
  input:        agent_design_core + teleology_bundle
  transform:    fix phase count to the selected shape's rigor → assign each boundary its genesis stage → order by genesis → derive per-phase validation requirements
  constraints:  rigor is the RANKED value from NODE 2 (not re-derived from risk); a phase never precedes its genesis predecessor; every phase has verifiable exit conditions
  output:       agent_design { characteristics, baseline, principles, phase_structure, validation_requirements }
  handoff:      phase structure genesis-ordered AND every phase has verifiable exit conditions (yields: edge-list + boolean)

FUNCTION build_phase_structure(teleology_bundle, characteristics):
  SET rigor = teleology_bundle.selected_shape.rigor
  IF rigor == 7: SET boundaries = ["Discovery", "Analysis", "Planning", "Validation", "Generation", "Verification", "Finalization"]
  ELSE IF rigor == 5: SET boundaries = ["Discovery", "Analysis", "Generation", "Verification", "Finalization"]
  ELSE: SET boundaries = ["Discovery", "Generation", "Verification"]
  # ground order in the agent genesis; a boundary out of genesis order is a structure defect
  ORDER boundaries BY genesis_rank
  RETURN {boundaries: boundaries, validation_density: proportional_to(characteristics.risk, characteristics.complexity, characteristics.uncertainty)}

# OUTPUT CONTRACT
DECLARE agent_design: object
SET agent_design.characteristics = agent_design_core.characteristics
SET agent_design.baseline = agent_design_core.baseline
SET agent_design.principles = agent_design_core.principles
SET agent_design.phase_structure = build_phase_structure(teleology_bundle, agent_design.characteristics)
DECLARE validation_requirements: object
FOR EACH phase IN agent_design.phase_structure.boundaries: DERIVE validation_requirements[phase] FROM phase.purpose + adapter_separation_needs + evidence_grounding_needs + safety_constraints
SET agent_design.validation_requirements = validation_requirements

HANDOFF GATE (evidence-bearing):
  rule_id: "PROJECT"   yields: edge-list + boolean
  [check] phase count == the shape's ranked rigor (3 | 5 | 7); boundaries genesis-ordered (evidence: phase_structure)
  [check] validation density proportional to risk/complexity/uncertainty (evidence: phase_structure.validation_density)
  [check] every phase has verifiable exit conditions (evidence: validation_requirements)
  result: pass → NODE 6 ACT (owner: project)


# ============================================================================
# NODE 6 — ACT         [epistemic · formalization · computation · yields: portable contract + render]
# ============================================================================
@purpose: "Formalize the runtime-neutral portable contract as the canonical artifact, then render it through the adapter"
@axis_question: "What does the agent resolve to?"
@cue: "CONTRACT_FIRST_ADAPTER_RENDERS"

CONTRACT:
  input:        agent_design + knowledge_base + run_frame
  transform:    compose portable contract → compose validation strategy → render via adapter → persist artifacts
  constraints:  the portable contract is CANONICAL and runtime-neutral (no paths/commands/model in the core); adapter outputs are projections that add runtime metadata but never alter core intent; invocation is SINGLE-PATH (no fallback/dual path); a REPLACE persist requires a verified archive first (REPAIR)
  output:       artifact_set { portable_contract, agent_specification, invocation_contract, audit_inputs }
  handoff:      runtime-neutral contract composed AND artifacts rendered as projections AND persisted (yields: procedure)

FUNCTION compose_contract(agent_design, run_frame, knowledge_base):
  DECLARE contract: object
  SET contract.identity = {name: run_frame.target_agent_name, version, description}
  SET contract.purpose = agent_purpose
  SET contract.domain_model = {scope: knowledge_base.scope, characteristics: agent_design.characteristics}
  SET contract.capability_requirements = required_capabilities
  SET contract.phase_specifications = COMPOSE_ARTIFACT(agent_design.phase_structure, agent_design.validation_requirements, agent_design.principles)
  SET contract.validation_strategy = {pre: ["capabilities_detected", "history_checked", "domain_knowledge_available"], during: ["phase_gates_enforced", "evidence_grounded_content", "adapter_separated"], post: ["schema_valid", "audit_complete", "unsupported_assumptions_absent"]}
  SET contract.safety_constraints = {non_destructive, no_runtime_leakage, evidence_grounded}
  SET contract.output_contract = ["portable_agent_contract", "invocation_contract", "audit_report", "final_report"]
  RETURN contract

FUNCTION render_via_adapter(contract):
  IF RESOLVES "{project.runtime_adapter}": DECLARE_RESOURCE it AS adapter
  ELSE: SET adapter = the runtime this seat already runs in, whose operation mapping is declared in the SEMANTIC OPERATION BOUNDARY above
  RENDER contract VIA adapter INTO artifact_set   # {agent_specification, invocation_contract, audit_report}
  # model, filenames, destinations are adapter-resolved ({model}, {convention.*}), never hardcoded;
  # the invocation contract exposes ONE path — invoke the agent — with no manual fallback.
  VALIDATE_ARTIFACT artifact_set AGAINST adapter.schema
  RETURN artifact_set

# OUTPUT CONTRACT
SET portable_contract = compose_contract(agent_design, run_frame, knowledge_base)
SET artifact_set = render_via_adapter(portable_contract)
FOR EACH artifact IN artifact_set: STAGE artifact FOR persist   # actual persist gated by CONSTRAIN (archive-safe) then COMMIT

HANDOFF GATE (evidence-bearing):
  rule_id: "ACT"   yields: procedure
  [check] portable contract is runtime-neutral — no paths/commands/model in the core (evidence: portable_contract)
  [check] runtime artifacts are projections of the contract, model/paths adapter-resolved (evidence: artifact_set)
  [check] invocation contract is single-path, no fallback (evidence: invocation_contract)
  result: pass → NODE 7 CONSTRAIN (owner: act)


# ============================================================================
# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: admissibility boolean]
# ============================================================================
@purpose: "Gate the composed agent on admissibility BEFORE verification — is it runtime-neutral, single-path, archive-safe, and within its worth budget?"
@axis_question: "Is the agent still worth persisting, and is it allowed?"   @mandatory: always   @selectable: false
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
  input:        artifact_set + portable_contract + run_frame + teleology_bundle
  transform:    check runtime-neutrality → check single-path invocation → check REPLACE archive safety → check realized cost vs shape budget
  constraints:  teleology is MANDATORY-ALWAYS; a destructive REPLACE persist requires an archived+VERIFIED copy first; a contract carrying runtime leakage or a dual invocation path is INADMISSIBLE; realized complexity over the shape's budget routes back to re-rank the shape
  output:       admissibility { ok, leakage[], multipath, archive_verified, realized_cost, budget }
  handoff:      GATE — zero leakage AND single-path AND archive_verified (if REPLACE) AND realized_cost <= budget (yields: boolean)

FUNCTION replacement_safety(operation_mode):
  IF operation_mode == "REPLACE":
    REQUEST_DECISION user FOR approval
    ARCHIVE existing artifacts TO agent_workspace + "/archive"
    VALIDATE_ARTIFACT archive_persisted
    IF NOT archive_persisted: RETURN {archive_verified: false}
  RETURN {archive_verified: true}

FUNCTION assess_admissibility(portable_contract, artifact_set, run_frame, teleology_bundle):
  SEARCH_CONTENT portable_contract FOR runtime_specific_leakage INTO leakage
  DETERMINE multipath = artifact_set.invocation_contract HAS fallback_or_dual_path
  SET arch = replacement_safety(run_frame.operation_mode)
  CALCULATE realized_cost = complexity_of(artifact_set)
  SET budget = teleology_bundle.selected_shape.cost
  RETURN {ok: (leakage.count == 0 AND NOT multipath AND arch.archive_verified AND realized_cost <= budget), leakage: leakage, multipath: multipath, archive_verified: arch.archive_verified, realized_cost: realized_cost, budget: budget}

# OUTPUT CONTRACT
SET admissibility = assess_admissibility(portable_contract, artifact_set, run_frame, teleology_bundle)

HANDOFF GATE (teleology admissibility gate):
  rule_id: "CONSTRAIN"   yields: boolean
  [check] admissibility.leakage.count == 0 (evidence: no runtime path/command/model in the core)
  [check] admissibility.multipath == false (evidence: single-path invocation)
  [check] admissibility.archive_verified (evidence: REPLACE preceded by a verified archive)
  [check] admissibility.realized_cost <= admissibility.budget (evidence: within the shape's worth budget)
  result: pass → NODE 8 VERIFY
          | leakage / multipath → REPAIR (owner: act — re-compose the core)
          | archive unverified → REPAIR (owner: constrain — archive+verify before persist)
          | over budget → REPAIR (owner: intent — re-rank the shape)


# ============================================================================
# NODE 8 — VERIFY      [evaluative · verification · logic + probability · yields: adjudication report]
# ============================================================================
@purpose: "Prove the PERSISTED artifact is semantically compliant, evidence-grounded, and algorithmically embodied — typed against evidence, confidence, and falsification"
@axis_question: "Is the agent real?"   @mandatory: always   @selectable: false
@cue: "PROVE_ON_THE_PERSISTED_ARTIFACT"

CONTRACT:
  input:        persisted agent_specification + knowledge_base
  transform:    check semantic compliance → check grounding (typed) → check embodiment → falsification
  constraints:  judge the STORED artifact, not the in-memory plan; zero runtime-specific leakage; grounding is a number[0,1] tested against a threshold; the agent must EMBODY the architecture, not merely describe it
  output:       adjudication { semantic, grounding, embodiment, confidence, refuter, verdict }
  handoff:      GATE ver-stop — compliant AND grounding_confidence >= threshold AND embodied AND a refuter named (yields: boolean)

DECLARE verification_nodes: array
SET verification_nodes = [
  {id: "ver-evidence",     asks: "what domain evidence supports each claim?",      yields: "evidence-set", test: "grounded claim set non-empty"},
  {id: "ver-ground-truth", asks: "does the artifact match the persisted file, not the plan?", yields: "boolean", test: "read from disk, not memory"},
  {id: "ver-falsification",asks: "what would show it is ungrounded / not embodied?", yields: "set",          test: "a concrete refuting check is named"},
  {id: "ver-confidence",   asks: "how grounded, and is it enough?",                yields: "number[0,1]",  test: "grounding_score >= threshold"},
  {id: "ver-refutation",   asks: "do unsupported claims outweigh grounded ones?",  yields: "boolean",      test: "grounded outweighs unsupported"}
]

FUNCTION check_semantic(generated):
  SEARCH_CONTENT generated FOR semantic_operations, phase_markers, validation_gates INTO markers
  SEARCH_CONTENT generated FOR runtime_specific_leakage INTO leakage
  IF markers.counts pass required AND leakage.count == 0: RETURN "compliant"
  RETURN "non_compliant"

FUNCTION check_grounding(generated, knowledge_base):
  SEARCH_CONTENT generated FOR claims INTO claim_set
  ANALYZE_CONTENT claim_set AGAINST knowledge_base
  CALCULATE_METRIC grounding_score = grounded_claims / total_claims          # yields: number[0,1]
  NAME what_would_refute_grounding(claim_set, knowledge_base) INTO refuter    # ver-falsification
  IF grounding_score >= {convention.grounding_threshold} AND unsupported_claims == 0: RETURN {status: "grounded", score: grounding_score, refuter: refuter}
  RETURN {status: "unsupported_claims_present", score: grounding_score, refuter: refuter}

FUNCTION check_embodiment(generated):
  DECLARE present: array
  FOR EACH marker IN ["phase_gates", "declaration_before_use", "calculated_metrics", "thresholds", "iterative_discovery"]: SEARCH_CONTENT generated FOR marker INTO p; APPEND p TO present
  IF RESOLVES "{convention.embodiment_threshold}":
    CALCULATE_METRIC embodiment_score = fraction(present)
    IF embodiment_score >= {convention.embodiment_threshold}: RETURN "embodied"
    RETURN "insufficiently_embodied"
  # No floor is declared, so embodiment is judged by MEMBERSHIP rather than by a fraction against an
  # invented number: every marker present is embodied, and any marker missing is named as missing.
  IF present COVERS every marker: RETURN "embodied"
  RETURN "insufficiently_embodied: " + the missing markers

# OUTPUT CONTRACT
READ_RESOURCE persisted_agent_specification INTO generated
DECLARE adjudication: object
SET adjudication.semantic = check_semantic(generated)
SET g = check_grounding(generated, knowledge_base)
SET adjudication.grounding = g.status
SET adjudication.confidence = g.score
SET adjudication.refuter = g.refuter
SET adjudication.embodiment = check_embodiment(generated)
SET adjudication.verdict = (adjudication.semantic == "compliant" AND g.status == "grounded" AND adjudication.confidence >= {convention.grounding_threshold} AND adjudication.embodiment == "embodied") ? "pass" : "reject"

HANDOFF GATE (ver-stop gate):
  rule_id: "VERIFY"   yields: boolean
  [check] required semantic-operation/phase/gate counts present AND zero runtime leakage (evidence: adjudication.semantic)
  [check] the artifact's frontmatter carries only the keys `{convention.agent_keys}` lists, its body declares `THIS AGENT IS <letter>` and a `SKILLS:` line naming `collaboration-protocol`, its filename carries `.<letter>.`, its `name:` ends `-<letter>`, and the index BINDS that letter (evidence: identity). The letter is the primary identity and the filename carries it, so a citation written against it survives every rename; an unbound letter is unaddressable and uncloseable, so it scores zero rather than partial. **All four are presence in a file — none observes whether the agent coordinated, which is a turn and is out of contract.**
  [check] ver-evidence non-empty; grounding_confidence >= threshold; a refuter named (evidence: adjudication.confidence, refuter)
  [check] artifact embodies gates/declaration-before-use/metrics/thresholds/iterative discovery (evidence: adjudication.embodiment)
  result: verdict == pass → NODE 9 COMMIT | reject → REPAIR (refutes-back to the owning node)


# ----------------------------------------------------------------------------
# REPAIR EDGE  (verify/constrain --refutes-back--> earliest invalid node; bounded by ter-diminishing-returns)
# ----------------------------------------------------------------------------
@purpose: "Halt on blocked capability, guarantee recoverability before destructive persist, and reject/re-compose failing artifacts from the owning node"
@cue: "ARCHIVE_OR_HALT_NEVER_INFER"

CONTRACT:
  input:        blocked runtime_mode; failed CONSTRAIN admissibility; adjudication reject
  transform:    blocked → halt with report; failed adjudication → discard persisted artifact and re-run from the owning node
  constraints:  BOUNDED (max_cycles = recursion_limit = 3); destructive generation requires an archived, VERIFIED recoverable copy before any mutation; a failing artifact is NEVER persisted as final; never infer past a blocked capability
  output:       repaired artifact with verdict "pass", OR "blocked"
  handoff:      recoverability verified before destructive persist AND no failing artifact left as final

DECLARE repair_state: object
SET repair_state = {cycle: 0, max_cycles: 3, earliest_node: "", invalidated: [], applied: []}

DECLARE node_order: array
SET node_order = ["orient", "intent", "see", "derive", "project", "act", "constrain", "verify", "commit"]

FUNCTION earliest_invalid_node(findings):
  FOR EACH node IN node_order:
    IF findings.owner CONTAINS node: RETURN node
  RETURN "verify"

WHILE adjudication.verdict == "reject" OR admissibility.ok == false:
  SET repair_state.cycle = repair_state.cycle + 1
  IF run_frame.runtime_mode == "blocked": HALT WITH blocked_report; BREAK
  IF repair_state.cycle > repair_state.max_cycles:   # ter-diminishing-returns
    REPORT "REPAIR_LIMIT_EXCEEDED (ter-diminishing-returns)"; BREAK
  DISCARD persisted_agent_specification   # a failing artifact is never left as final
  SET repair_state.earliest_node = earliest_invalid_node(findings)   # DESIGN/PROJECT for structure, ACT for rendering, INTENT for over-budget
  MARK every node FROM repair_state.earliest_node AS invalid
  RE-RUN from repair_state.earliest_node forward; RE-ADJUDICATE
  REPORT repair_state


# ============================================================================
# NODE 9 — COMMIT      [evaluative · representation · information-theory · yields: persisted artifacts + audit]
# ============================================================================
@purpose: "Persist the validated artifacts and an inspectable, deduplicated provenance trail — adding no new decision"
@axis_question: "How is the agent encoded + recorded?"
@cue: "AUDIT_THEN_COMMIT"

CONTRACT:
  input:        run_frame + agent_design + validated artifact_set + adjudication
  transform:    persist artifacts to adapter destinations → compose audit trail → dedup provenance
  constraints:  only a passing artifact is persisted as final; provenance is inspectable; identical audit rows collapse (info-theory)
  output:       committed { artifacts_persisted, audit_report }
  handoff:      passing artifacts persisted AND provenance trail complete + deduplicated (yields: hash + boolean)

# OUTPUT CONTRACT
FOR EACH artifact IN artifact_set: PERSIST_ARTIFACT artifact TO adapter.destination
SET audit_report = {agent_identity, domain, operation_mode, selected_shape, runtime_environment, risk, complexity, reversibility, uncertainty, phase_count, validation_gates, grounding_confidence: adjudication.confidence, evidence_sources, capability_profile, adapter_identity, portability_status, timestamp: {convention.timestamp}}
DEDUP audit_report.evidence_sources BY source
PERSIST_ARTIFACT audit_report TO agent_workspace + "/generation-audit"

HANDOFF GATE (evidence-bearing):
  rule_id: "COMMIT"   yields: hash + boolean
  [check] only the passing artifact persisted as final (evidence: adjudication.verdict == pass)
  [check] provenance trail persisted (evidence sources, capability profile, adapter identity, grounding confidence) (evidence: audit_report)
  [check] provenance deduplicated — no source recorded twice (evidence: dedup)
  result: pass → NODE 10 TERMINATE (owner: commit)


# ============================================================================
# NODE 10 — TERMINATE  [evaluative · termination · set-theory · yields: ter-stop boolean]
# ============================================================================
@purpose: "Stop only on saturation AND completion AND verification; otherwise halt on blocked capability or CANCEL — never a self-assessed stop"
@axis_question: "Are we done?"   @mandatory: always   @selectable: false
@cue: "AUDIT_THEN_REPORT"

CONTRACT:
  input:        committed + adjudication + run_frame + repair_state
  transform:    evaluate the termination node-set → compose + report the final result OR a blocked report
  constraints:  ter-stop == saturation AND completion AND verification; ter-block routes to a halt report (blocked capability / CANCEL); the report names every limitation (degraded mode, unsupported capabilities)
  output:       generation_result { status: success|blocked, output_file, limitations }
  handoff:      terminal — provenance persisted AND final report distinguishes artifacts, validation status, and limitations (yields: boolean)

DECLARE termination_nodes: array
SET termination_nodes = [
  {id: "ter-completion",         asks: "are all artifacts persisted?",              yields: "boolean", test: "artifact_set persisted + audit written"},
  {id: "ter-saturation",         asks: "is nothing left to resolve?",               yields: "boolean", test: "no capability gap, no reject pending"},
  {id: "ter-diminishing-returns",asks: "has re-composition stopped improving?",     yields: "counter", test: "repair cycles within recursion_limit", role: "injection-gate"},
  {id: "ter-block",              asks: "is it blocked on capability or a CANCEL?",   yields: "boolean", test: "runtime blocked OR operation CANCEL"},
  {id: "ter-stop",               asks: "complete, verified, and saturated?",         yields: "boolean", test: "saturation AND completion AND verification", role: "completion-marker"}
]

FUNCTION evaluate_termination(committed, adjudication, run_frame, repair_state):
  SET completion  = committed.artifacts_persisted AND EXISTS(committed.audit_report)
  SET verification = (adjudication.verdict == "pass")
  SET saturation  = (run_frame.runtime_mode != "blocked" AND adjudication.verdict != "reject")
  SET blocked     = (run_frame.runtime_mode == "blocked" OR run_frame.operation_mode == "CANCEL")
  SET ter_stop = (saturation AND completion AND verification)
  RETURN {completion: completion, verification: verification, saturation: saturation, blocked: blocked, ter_stop: ter_stop}

# TERMINAL — exactly one of success / blocked; bounded by max_cycles in the REPAIR edge.
SET term = evaluate_termination(committed, adjudication, run_frame, repair_state)
IF term.ter_stop == true:
  COMPOSE_ARTIFACT final_report FROM {generation_summary, selected_shape, risk_summary, compliance_summary, grounding_confidence, artifact_references, limitations}
  REPORT_RESULT final_report
  SET generation_result = {status: "success", output_file: adapter.destination, limitations: named_limitations}
ELSE:
  # ter-block: blocked capability or CANCEL, or repair exhausted → halt, never infer past
  COMPOSE_ARTIFACT blocked_report FROM {reason, run_frame, adjudication, repair_state.applied, limitations}
  REPORT_RESULT blocked_report
  SET generation_result = {status: "blocked", output_file: agent_workspace + "/blocked-report", limitations: named_limitations}

HANDOFF GATE (ter-stop gate):
  rule_id: "TERMINATE"   yields: boolean
  [check] generation_result.status IN ["success", "blocked"] (evidence: generation_result)
  [check] success ONLY when saturation AND completion AND verification all hold (evidence: term)
  [check] provenance persisted; final report distinguishes artifacts, validation status, and limitations (evidence: final_report | blocked_report)
  [check] repair_state.cycle <= max_cycles (evidence: bounded loop)
  result: TERMINATE

FINALIZE generation_result


# ============================================================================
# CROSS-NODE INVARIANTS  (bind every node)
# ============================================================================
ALWAYS:
  - profile runtime capabilities (full/degraded/blocked) and frame the domain by its ontological dimensions before acting
  - resolve what the agent is FOR (NODE 2) and gate on the highest-worth admissible shape before any composition — the 3/5/7 rigor is a RANKED choice
  - run the four mandatory-always gates every generation: tel-priority (NODE 2), constrain admissibility (NODE 7), ver-stop (NODE 8), ter-stop (NODE 10)
  - type every decision to its yields-shape; grounding is a number[0,1] against a threshold, not a label
  - ground the agent's phase structure in the substrate genesis (existence->...->emergence); a boundary out of genesis order is a structure defect
  - investigate non-destructively and ground the knowledge base in real resources through the relevant lenses
  - extract portable core principles; compose the runtime-neutral contract first, then render through the adapter
  - a node reads ONLY the prior node's output contract, and hands off through exactly one evidence-bearing gate
  - validate semantic compliance, evidence grounding, and algorithmic embodiment on the PERSISTED artifact; name a refuter
  - repair from the earliest invalid node, bounded by ter-diminishing-returns; emit an inspectable audit trail and a report that names limitations

NEVER:
  - proceed past NODE 2 on an agent shape that is not the highest-worth admissible one
  - generate from assumptions — every claim traces to inspected domain evidence
  - emit runtime-specific paths or commands into the portable core (adapter-resolve them), or hardcode a model/filename/destination
  - detect the runtime by OS string — probe capabilities
  - emit a fallback or dual-path invocation — one path, fail-fast, single source of truth
  - overwrite or duplicate an agent without a collision decision and a verified archive
  - mutate the source domain during investigation
  - stop on anything but saturation AND completion AND verification; a self-assessed "done" is not ter-stop
  - infer past a blocked capability, or persist an artifact that fails semantic-compliance, grounding, or embodiment
```
