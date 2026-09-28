---
name: claim.protocol
description: Executable template. Verifies context claims against actual implementation evidence by walking the ten-node derivation-loop across four reasoning layers — every decision typed to a math shape, the verdict grounded in the substrate genesis cycle, the four mandatory-always gates (teleology, admissibility, verification, termination) enforced, and detectors calibrated + adversarially tested before any claim is trusted. A claim is UNTRUSTED until mapped to observable evidence.
type: template
status: current
summary: Executable PAG template that verifies context claims against actual implementation evidence by walking the four-layer derivation-loop with math-typed decisions and calibrated, adversarially-tested detectors.
domain: [ai-governance, quality]
keywords:
    [
        verification,
        forensic,
        derivation-loop,
        substrate-genesis,
        teleology-gate,
        math-typed,
        yields-shape,
        evidence,
        calibration,
        adversarial,
        self-audit,
        confidence,
        termination,
        typed-output,
        runtime-agnostic,
    ]
version: 3
staleness-days: -1
depends-on:
supersedes:
---

# Forensic Context Verification Template

```py CODE: PAG claim template
%% META %%:
priority: EVIDENCE > TRUST_ANCHOR > TASK
trust: implementation_observation = TRUSTED, prior_knowledge = UNTRUSTED, a_claim = UNTRUSTED_UNTIL_MAPPED
objective: classify every context claim verified | contradicted | unverified against observable
           implementation evidence, and emit one typed artifact naming every limitation
recursion_limit: {convention.max_recursion_depth}

# --- THE FOUR LAYERS (each answers one question about this verification) ---------------------
#   substrate  — "How does a verdict come to be?"         grounds per-claim processing (LAYER 0)
#   epistemic  — "How are the claims known?"              orient · see · derive · project · act
#   conative   — "Which claims are worth verifying, how?" intent · constrain            (MANDATORY-ALWAYS)
#   evaluative — "Is it real, and are we done?"           verify · commit · terminate    (MANDATORY-ALWAYS)
#
# --- YIELDS-SHAPE LEGEND ---------------------------------------------------------------------
#   set-theory → set|boolean · logic → boolean · graph → edge-list · algebra → ordered-structure
#   analysis → operation · optimization → boolean|ranking · topology → boolean
#   probability → number[0,1] · information-theory → hash|novelty-score · computation → procedure
#   dynamical-systems → boolean|counter
#
# --- MANDATORY-ALWAYS GATES ------------------------------------------------------------------
#   TELEOLOGY  tel-priority (NODE 2)  → argmax(risk-weighted coverage - cost) over admissible verification methods; phase admissible
#   TELEOLOGY  constrain    (NODE 7)  → op-set honored (INVESTIGATE no mutate / ACTION no discover), strings sanitized, recursion bounded
#   VERIFY     ver-stop     (NODE 8)  → classified with evidence, calibrated + adversarially survived, self-audit confidence >= threshold
#   TERMINATE  ter-stop     (NODE 10) → saturation AND completion AND verification
# The selectable epistemic axes run WHEN-RELEVANT; the four gates above run ALWAYS.

SEMANTIC OPERATION BOUNDARY: nodes state WHAT to do as semantic operations — DISCOVER_RESOURCES,
READ_RESOURCE, SEARCH_CONTENT, ANALYZE_CONTENT, EXECUTE_TOOL, CALCULATE_METRIC, VALIDATE,
PERSIST_ARTIFACT, REPORT_RESULT. A runtime ADAPTER decides HOW, through the operation-to-tool map
BOOTSTRAP.md holds for each runtime. The core carries no runtime paths or commands; {convention.*} / {self.definition} / detection patterns
are adapter-resolved.

Each node declares its layer, axis, mathType, yields-shape, input, transformation, constraint set,
output contract, and one evidence-bearing handoff gate. A node reads only the prior node's output
contract. The transitions are declared once in THE LOOP SPINE.


# ============================================================================
# LAYER 0 — SUBSTRATE  (genesis grammar; grounds per-claim processing in DERIVE/PROJECT/ACT)
# ============================================================================
@purpose: "Model how a VERDICT comes to be, so per-claim processing is a genesis, not an unordered sweep"
@question: "How does a verdict come to be?"

# A verdict is brought into being per claim by passing through the genesis stages, recursing on
# `difference` when adjudication (emergence) surfaces a NEW claim implied by the evidence.
DECLARE substrate_cycle: array
SET substrate_cycle = ["existence", "difference", "relation", "structure", "transformation", "constraint", "emergence"]
DECLARE substrate_recursion: object
SET substrate_recursion = {from: "emergence", to: "difference"}

DECLARE genesis_grammar: array
SET genesis_grammar = [
  {stage: "existence",      mathType: "set-theory",        yields: "set|boolean",       asks: "does the claim set exist / is each claim enumerated?"},
  {stage: "difference",     mathType: "logic",             yields: "boolean",           asks: "what evidence requirement makes this claim checkable + distinct?"},
  {stage: "relation",       mathType: "graph",             yields: "edge-list",         asks: "which evidence source / detector does the claim map to?"},
  {stage: "structure",      mathType: "algebra",           yields: "ordered-structure", asks: "how are the observations for the claim organized?"},
  {stage: "transformation", mathType: "analysis",          yields: "operation",         asks: "classify verified | contradicted | unverified?"},
  {stage: "constraint",     mathType: "optimization",      yields: "boolean|ranking",   asks: "does it survive calibration + adversarial + self-audit gates?"},
  {stage: "emergence",      mathType: "dynamical-systems", yields: "boolean|counter",   asks: "does the typed report stabilize; did a new claim surface?"}
]

FUNCTION genesis_rank(stage):
  RETURN INDEX_OF(substrate_cycle, stage)


# ============================================================================
# THE LOOP SPINE  (the ten nodes, their typing, and the transitions)
# ============================================================================
# node       layer       axis           mathType             yields                      transition out
# ---------- ----------- -------------- -------------------- --------------------------- -------------------------------------
# orient     epistemic   ontology       set-theory           run-context + trust anchor  sequences → intent
# intent     conative    teleology      optimization         claim-ranking + method      GATE tel-priority → see | onFail redirect
# see        epistemic   analysis       graph                calibrated detectors        sequences → derive
# derive     epistemic   reasoning      logic                evidence requirements       sequences → project
# project    epistemic   reasoning      logic                gather-plan + escalations   sequences → act
# act        epistemic   formalization  computation          observations[]              sequences → constrain
# constrain  conative    teleology      optimization         op-set admissibility        GATE → verify | onFail repair
# verify     evaluative  verification   logic + probability  adjudication (calibrated+adversarial) GATE ver-stop; onFail refutes-back (bounded)
# commit     evaluative  representation information-theory    one typed artifact          sequences → terminate
# terminate  evaluative  termination    set-theory           ter-stop boolean            GATE ter-stop → STOP | ter-block → blocked report


# ============================================================================
# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: run-context + trust anchor]
# ============================================================================
@purpose: "Disclose the trust anchor, bind the phase contract, and frame the claim set by its ontological kinds before touching any claim"
@axis_question: "What is this run, and what kinds of claim are these?"
@cue: "DISCLOSE_THEN_BIND"

CONTRACT:
  input:        invocation, target, context_claims
  transform:    disclose trust anchor → detect phase → bind allowed/forbidden op-sets → classify each claim by ontological kind
  constraints:  the trust anchor is DISCLOSED not verified (cannot verify the verifier); INVESTIGATE and ACTION op-sets are mutually exclusive
  output:       run_context { trust_anchor, phase, mode, allowed_ops, forbidden_ops, context_claims, claim_kinds }
  handoff:      trust anchor disclosed AND phase bound AND op-sets exclusive AND every claim kinded (yields: boolean)

DECLARE trust_anchor: object
SET trust_anchor = {
  minimal_assumptions: ["RuntimeWorks", "FilesystemWorks", "CommandExecutionWorks", "ToolIOWorks"],
  rationale: "verification requires trusting minimal capabilities — these are the foundational assumptions",
  boundary: "CannotVerifyVerifierWithoutExternalReference — the anchor IS the boundary; above it is verified, the anchor itself is disclosed"
}

# The ontological kind of a claim decides which evidence its verification will require.
DECLARE ontological_dimensions: array
SET ontological_dimensions = [
  {id: "identity",   asks: "does X exist?",                     mathType: "set-theory",        evidence: "presence search"},
  {id: "structure",  asks: "is X arranged so?",                 mathType: "algebra",           evidence: "structural read"},
  {id: "relation",   asks: "does X connect to Y?",              mathType: "graph",             evidence: "reference/import scan"},
  {id: "behavior",  asks: "does X do Z at runtime?",           mathType: "dynamical-systems", evidence: "execution/trace"},
  {id: "change",     asks: "does X transform inputs so?",       mathType: "analysis",          evidence: "data-flow read"},
  {id: "state",      asks: "is X in condition C?",              mathType: "set-theory",        evidence: "state inspection"},
  {id: "meaning",    asks: "does X signify M?",                 mathType: "logic",             evidence: "semantic read"},
  {id: "probability",asks: "how certain is the claim?",         mathType: "probability",       evidence: "confidence assessment"}
]

FUNCTION bind_phase(context):
  DETECT phase_type FROM context   # INVESTIGATE | ACTION
  IF phase_type == "INVESTIGATE":
    RETURN {phase: "INVESTIGATE", mode: "analysis_only", allowed_ops: ["gap_discovery","testing","documentation"], forbidden_ops: ["mutation","gap_fixing"], artifact: "investigation_report"}
  IF phase_type == "ACTION":
    RETURN {phase: "ACTION", mode: "fix_only", allowed_ops: ["bounded_fix","versioning","mutation"], forbidden_ops: ["gap_discovery"], artifact: "action_log"}

FUNCTION kind_claims(context_claims):
  DECLARE kinded: array
  SET kinded = []
  FOR EACH claim IN context_claims:
    ANALYZE_CONTENT claim AGAINST ontological_dimensions INTO dim
    APPEND {claim: claim, kind: dim.id, evidence_shape: dim.evidence, mathType: dim.mathType} TO kinded
  RETURN kinded

# OUTPUT CONTRACT
DISCLOSE trust_anchor
SET run_context = bind_phase(invocation.context)
SET run_context.trust_anchor = trust_anchor
SET run_context.context_claims = invocation.context_claims
SET run_context.claim_kinds = kind_claims(invocation.context_claims)

HANDOFF GATE (evidence-bearing):
  rule_id: "ORIENT"   yields: boolean
  [check] trust anchor disclosed with assumptions + boundary (evidence: run_context.trust_anchor)
  [check] phase bound to exactly one of INVESTIGATE | ACTION (evidence: run_context.phase)
  [check] allowed and forbidden op-sets are disjoint (evidence: run_context.allowed_ops, forbidden_ops)
  [check] every claim assigned an ontological kind + evidence shape (evidence: run_context.claim_kinds)
  result: pass → NODE 2 INTENT | undetectable phase → REPAIR as blocked (owner: orient)


# ============================================================================
# NODE 2 — INTENT      [conative · teleology · optimization · yields: claim-ranking + method]
# ============================================================================
@purpose: "Rank claims by verification worth and choose the verification METHOD per claim by utility - cost, before probing anything"
@axis_question: "Which claims are worth verifying, and how deeply?"   @mandatory: always   @selectable: false
@cue: "WORTH_BEFORE_WORK"

CONTRACT:
  input:        run_context
  transform:    state the objective → score each claim's worth (risk x uncertainty) → enumerate admissible methods (direct search vs generated-tool escalation) → rank → select per-claim method
  constraints:  teleology is MANDATORY-ALWAYS; a method is admissible only if its capability is available; a load-bearing/high-risk claim ranks above a cosmetic one; verifying a low-worth claim with an expensive escalation while a high-worth claim is unmapped is a priority inversion
  output:       teleology_bundle { objective, ranked_claims[], method_by_claim{} }
  handoff:      GATE tel-priority — each claim's method == argmax(risk_weighted_coverage - cost) among admissible; phase admissible (yields: boolean over ranking)

DECLARE teleology_nodes: array
SET teleology_nodes = [
  {id: "tel-objective", asks: "classify every claim against evidence?",              yields: "set"},
  {id: "tel-utility",   asks: "how load-bearing is this claim (risk x uncertainty)?", yields: "number"},
  {id: "tel-cost",      asks: "what does this verification method cost?",             yields: "number"},
  {id: "tel-priority",  asks: "is this the highest-worth admissible method+order?",   yields: "boolean", role: "injection-gate",
     decision_test: "highest risk-weighted coverage minus cost among admissible methods"}
]

FUNCTION rank_and_method(run_context):
  DECLARE ranked: array
  SET ranked = []
  FOR EACH ck IN run_context.claim_kinds:
    ASSESS risk_of(ck.claim) * uncertainty_of(ck.claim) INTO ck.worth        # yields: number
    # candidate methods for the claim's evidence shape: direct (search/read/execute) vs escalation (generated tool)
    FOR EACH method IN ["direct", "escalation"]:
      DETERMINE required_capability FROM ck.evidence_shape, method
      ANALYZE {required_capability} INTO adm
      ASSESS coverage(ck, method) INTO util; ASSESS effort(method) INTO cost
      APPEND {claim: ck.claim, method: method, admissible: adm.ok, utility: (ck.worth * util), cost: cost} TO ranked
  ORDER ranked BY (utility - cost) DESC WHERE admissible == true
  DECLARE method_by_claim: object
  FOR EACH ck IN run_context.claim_kinds: SET method_by_claim[ck.claim] = argmax_admissible(ranked, ck.claim)
  RETURN {ranked: ranked, method_by_claim: method_by_claim}

# OUTPUT CONTRACT
DECLARE teleology_bundle: object
SET r = rank_and_method(run_context)
SET teleology_bundle = {objective: "classify every claim verified|contradicted|unverified", ranked_claims: r.ranked, method_by_claim: r.method_by_claim}

HANDOFF GATE (tel-priority injection-gate):
  rule_id: "INTENT"   yields: boolean over ranking
  [check] every claim carries a worth score and a chosen method (evidence: method_by_claim)
  [check] each chosen method == argmax(risk_weighted_coverage - cost) among admissible (evidence: ranked_claims)
  [check] no high-worth claim left with method "none" while a low-worth claim escalates (evidence: no priority inversion)
  result: pass → NODE 3 SEE
          | no admissible method for a high-worth claim → REDIRECT: mark it will-be-unverified OR emit BLOCKED (ter-block)
          | priority inversion → REPAIR (owner: intent)


# ============================================================================
# NODE 3 — SEE         [epistemic · analysis · graph · yields: calibrated detectors]
# ============================================================================
@purpose: "Probe the runtime, calibrate every detector the ranked methods will use, and arm defensive protocols before trusting any tool"
@axis_question: "How are the claims to be seen — and is the lens reliable?"
@cue: "CALIBRATE_BEFORE_TRUST"

CONTRACT:
  input:        run_context + teleology_bundle
  transform:    probe environment → calibrate the detectors the chosen methods require (false-pos + false-neg controls) → arm defensive protocols
  constraints:  probe by CAPABILITY not OS-string; a detector is UNTRUSTED until it passes BOTH controls; only sanitized strings cross a boundary
  output:       capability_plan { capability_mode, calibrated_detectors, reliability, defenses }
  handoff:      capabilities classified AND every required detector calibrated (or its unreliability warned) (yields: edge-list + boolean)

FUNCTION probe_environment():
  DECLARE checks: array
  SET checks = []
  FOR EACH requirement IN ["runtime", "packageManager", "writePermission", "filesystem"]:
    PROBE requirement INTO status
    IF status == "failed": APPEND {check: requirement, status: "failed", severity: severity_of(requirement)} TO checks; LOG "capability unavailable: " + requirement
    ELSE: APPEND {check: requirement, status: "passed"} TO checks
  CALCULATE capability_mode IN [full, degraded, blocked] FROM checks
  RETURN {checks: checks, capability_mode: capability_mode}

FUNCTION calibrate(detector, detection_pattern):
  CREATE known_good fixture that MUST match detection_pattern
  CREATE known_bad fixture that MUST NOT match detection_pattern
  EXECUTE_TOOL detector ON known_good INTO good
  EXECUTE_TOOL detector ON known_bad INTO bad
  DECLARE result: object
  SET result = {false_negative: good != "match", false_positive: bad != "no_match"}
  IF result.false_negative: LOG "TOOL FAILURE: false negative on known-good fixture"
  IF result.false_positive: LOG "TOOL FAILURE: false positive on known-bad fixture"
  CALCULATE result.reliability IN [reliable, false_positive_risk, false_negative_risk, unreliable] FROM result
  RETURN result

FUNCTION arm_defenses():
  # sanitize: null-guard, strip parent-dir traversal + null byte, normalize unicode to NFC before any boundary cross
  # safe_divide: reject denominator 0 and non-finite results as typed/nullable failure, never unsafe numeric state
  # recursion: govern depth to {convention.max_recursion_depth}, reject on exceed
  RETURN {sanitize: enabled, safe_arithmetic: enabled, recursion_control: {max_depth: {convention.max_recursion_depth}}}

# OUTPUT CONTRACT
SET env = probe_environment()
SET calibrated_detectors = []
FOR EACH detector IN detectors_for(teleology_bundle.method_by_claim): APPEND {detector: detector, calibration: calibrate(detector, detector.pattern)} TO calibrated_detectors
SET capability_plan = {capability_mode: env.capability_mode, calibrated_detectors: calibrated_detectors, defenses: arm_defenses()}

HANDOFF GATE (evidence-bearing):
  rule_id: "SEE"   yields: edge-list + boolean
  [check] required capabilities probed and classified full | degraded | blocked (evidence: env.checks)
  [check] every detector a chosen method needs ran both false-positive and false-negative controls (evidence: calibrated_detectors)
  [check] defensive protocols armed (evidence: capability_plan.defenses)
  [check] every detector whose reliability != reliable is RECORDED UNTRUSTED, and every claim depending on it is routed to unverified rather than classified from its output (evidence: calibrated_detectors.reliability, the routed claims)
  [check] capability_mode == blocked routes to ter-block rather than to a softened verdict (evidence: env.capability_mode, the routing)
  result: pass → NODE 4 DERIVE | critical capability blocked → REPAIR as blocked (owner: see)
  # A GATE IS 0 OR 1 HERE TOO. An unreliable detector and a blocked capability are both real conditions
  # with real routing — recorded as untrusted and routed to unverified or to ter-block — never as an
  # advisory line beside a passing gate, because a middle tier lets a run terminate successful while a
  # failure is still open, which is the outcome this whole template exists to prevent.


# ============================================================================
# NODE 4 — DERIVE      [epistemic · reasoning · logic · yields: evidence requirements]
# ============================================================================
@purpose: "Reason from each claim to the exact evidence requirement that would confirm or refute it"
@axis_question: "What evidence follows from the claim?"
@cue: "MAP_CLAIM_TO_EVIDENCE"

CONTRACT:
  input:        run_context.context_claims + teleology_bundle + capability_plan
  transform:    for each claim → resolve to a concrete, observable evidence requirement bound to the chosen method
  constraints:  the evidence requirement names WHAT observation would settle the claim, not a guess at the answer; a requirement whose capability is unavailable is flagged for escalation
  output:       evidence_requirements[] { claim, requirement, method, capability }
  handoff:      every claim resolved to an observable evidence requirement (no claim left unmapped) (yields: boolean)

FUNCTION resolve_requirements(context_claims, teleology_bundle, capability_plan):
  DECLARE reqs: array
  SET reqs = []
  FOR EACH claim IN context_claims:
    SET method = teleology_bundle.method_by_claim[claim]
    RESOLVE claim INTO evidence_requirement   # the observable that settles it
    DETERMINE capability = evidence_requirement.capability
    APPEND {claim: claim, requirement: evidence_requirement, method: method, capability: capability, escalate: (capability NOT IN direct_capabilities)} TO reqs
  RETURN reqs

# OUTPUT CONTRACT
SET evidence_requirements = resolve_requirements(run_context.context_claims, teleology_bundle, capability_plan)

HANDOFF GATE (evidence-bearing):
  rule_id: "DERIVE"   yields: boolean
  [check] every claim resolved to an observable evidence requirement (evidence: evidence_requirements)
  [check] each requirement names the settling observation, not a presumed verdict (evidence: requirement)
  result: pass → NODE 5 PROJECT (owner: derive)


# ============================================================================
# NODE 5 — PROJECT     [epistemic · reasoning · logic · yields: gather-plan + escalations]
# ============================================================================
@purpose: "Order claim processing by the verdict genesis and project which requirements will escalate to a generated tool"
@axis_question: "In what order, and what escalates downstream?"
@cue: "ORDER_AS_GENESIS"

CONTRACT:
  input:        evidence_requirements + capability_plan
  transform:    order requirements by genesis (existence before relation before transformation) → mark escalations (W-propagation: requires_generated_tool)
  constraints:  a claim whose requirement depends on another claim's observation is ordered after it; escalation is projected, not yet executed
  output:       gather_plan { ordered_requirements[], escalations[] }
  handoff:      requirements genesis-ordered AND escalations projected (yields: edge-list + boolean)

FUNCTION build_gather_plan(evidence_requirements):
  ORDER evidence_requirements BY genesis_rank(requirement.stage) THEN dependency
  DECLARE escalations: array
  FILTER evidence_requirements TO escalations WHERE escalate == true
  RETURN {ordered_requirements: evidence_requirements, escalations: escalations}

# OUTPUT CONTRACT
SET gather_plan = build_gather_plan(evidence_requirements)

HANDOFF GATE (evidence-bearing):
  rule_id: "PROJECT"   yields: edge-list + boolean
  [check] requirements ordered by verdict genesis + inter-claim dependency (evidence: ordered_requirements)
  [check] escalations projected with their reason (evidence: gather_plan.escalations)
  result: pass → NODE 6 ACT (owner: project)


# ============================================================================
# NODE 6 — ACT         [epistemic · formalization · computation · yields: observations[]]
# ============================================================================
@purpose: "Gather the observation for each requirement from actual implementation using the calibrated detectors — never inferred"
@axis_question: "What does the implementation actually show?"
@cue: "GATHER_NEVER_INFER"

CONTRACT:
  input:        gather_plan + capability_plan
  transform:    for each ordered requirement → run the calibrated detector / search / execute → record the observation
  constraints:  never infer an observation; a string crosses a boundary only after sanitize; recursion governed; a requirement flagged for escalation records PENDING_ESCALATION (resolved in REPAIR)
  output:       observations[] { claim, evidence_requirement, observation, capability_used }
  handoff:      every direct requirement observed; every escalation flagged PENDING_ESCALATION (yields: procedure)

FUNCTION gather_observations(gather_plan, capability_plan):
  DECLARE observations: array
  SET observations = []
  FOR EACH req IN gather_plan.ordered_requirements:
    IF req.escalate == false AND req.capability IN direct_capabilities:
      SANITIZE inputs; SEARCH_CONTENT + ANALYZE_CONTENT implementation FOR req.requirement INTO observation
      APPEND {claim: req.claim, evidence_requirement: req.requirement, observation: observation, capability_used: "direct"} TO observations
    ELSE:
      APPEND {claim: req.claim, evidence_requirement: req.requirement, observation: "PENDING_ESCALATION", capability_used: "requires_generated_tool"} TO observations
  RETURN observations

# OUTPUT CONTRACT
SET observations = gather_observations(gather_plan, capability_plan)

HANDOFF GATE (evidence-bearing):
  rule_id: "ACT"   yields: procedure
  [check] every direct requirement produced an observation from implementation (evidence: observations)
  [check] no observation inferred; capability gaps flagged PENDING_ESCALATION (evidence: capability_used)
  result: pass → NODE 7 CONSTRAIN (owner: act)


# ============================================================================
# NODE 7 — CONSTRAIN   [conative · teleology · optimization · yields: op-set admissibility]
# ============================================================================
@purpose: "Gate that gathering stayed inside the disclosed op-set and defensive bounds BEFORE adjudication"
@axis_question: "Was the gathering allowed and safe?"   @mandatory: always   @selectable: false
@cue: "ADMISSIBLE_BEFORE_VERIFY"

CONTRACT:
  input:        observations + run_context + capability_plan
  transform:    check INVESTIGATE performed no mutation / ACTION discovered no new scope → check every boundary-crossing string was sanitized → check recursion stayed bounded
  constraints:  teleology is MANDATORY-ALWAYS; a mutation under INVESTIGATE, a discovery under ACTION, an unsanitized boundary cross, or a recursion overflow is INADMISSIBLE
  output:       admissibility { ok, op_violations[], unsanitized[], recursion_ok }
  handoff:      GATE — op-sets honored AND strings sanitized AND recursion bounded (yields: boolean)

FUNCTION assess_admissibility(observations, run_context, capability_plan):
  DECLARE op_violations: array
  SET op_violations = []
  FOR EACH o IN observations:
    IF run_context.phase == "INVESTIGATE" AND o CAUSED mutation: APPEND {claim: o.claim, violation: "mutation under INVESTIGATE"} TO op_violations
    IF run_context.phase == "ACTION" AND o DISCOVERED new_scope: APPEND {claim: o.claim, violation: "discovery under ACTION"} TO op_violations
  DETERMINE unsanitized = observations WHERE boundary_crossed AND NOT sanitized
  DETERMINE recursion_ok = recursion_depth <= {convention.max_recursion_depth}
  RETURN {ok: (op_violations.length == 0 AND unsanitized.length == 0 AND recursion_ok), op_violations: op_violations, unsanitized: unsanitized, recursion_ok: recursion_ok}

# OUTPUT CONTRACT
SET admissibility = assess_admissibility(observations, run_context, capability_plan)

HANDOFF GATE (teleology admissibility gate):
  rule_id: "CONSTRAIN"   yields: boolean
  [check] admissibility.op_violations.length == 0 (evidence: INVESTIGATE no mutation / ACTION no discovery)
  [check] admissibility.unsanitized.length == 0 (evidence: every boundary cross sanitized)
  [check] admissibility.recursion_ok (evidence: depth <= max)
  result: pass → NODE 8 VERIFY | op violation / unsanitized / overflow → REPAIR (owner: act)


# ============================================================================
# NODE 8 — VERIFY      [evaluative · verification · logic + probability · yields: adjudication]
# ============================================================================
@purpose: "Judge each observation against evidence, behavioral contract, and hostile inputs — and judge this agent's own claims — typed against the five verification nodes"
@axis_question: "Is it real?"   @mandatory: always   @selectable: false
@cue: "A_MATCH_IS_NOT_EVIDENCE"

CONTRACT:
  input:        observations + capability_plan + {self.definition}
  transform:    classify vs evidence → behavioral self-test → adversarial test → recursive self-audit → gate protocol
  constraints:  a match is NOT evidence until the detector survives calibration + adversarial testing; verdict is never "assumed true"; this agent is NOT exempt from its own rules; confidence is a typed level
  output:       adjudication { discrepancies[], vulnerabilities[], self_confidence, refuter, gate_result }
  handoff:      GATE ver-stop — every claim classified with evidence AND no match trusted without adversarial survival AND self-audit confidence >= threshold (yields: boolean)

DECLARE verification_nodes: array
SET verification_nodes = [
  {id: "ver-evidence",     asks: "what observation supports the verdict?",             yields: "evidence-set", test: "observation non-empty + on-point"},
  {id: "ver-ground-truth", asks: "is it true against the implementation, not merely coherent?", yields: "boolean", test: "read from real code, not narrative"},
  {id: "ver-falsification",asks: "what would fool this detector?",                     yields: "set",          test: "survives traversal/nullByte/homoglyph/comment/spoof attacks"},
  {id: "ver-confidence",   asks: "how confident is this agent in its own claims?",     yields: "number[0,1]",  test: "self_confidence at/above threshold"},
  {id: "ver-refutation",   asks: "does contradiction outweigh support?",               yields: "boolean",      test: "support outweighs contradiction"}
]

FUNCTION classify_claims(observations):
  DECLARE discrepancies: array
  SET discrepancies = []
  FOR EACH o IN observations:
    CLASSIFY o.claim IN [verified, contradicted, unverified] FROM o.observation
    IF o.verdict IN ["contradicted", "unverified"]: APPEND {claim: o.claim, verdict: o.verdict, evidence: o.observation} TO discrepancies
  RETURN discrepancies

FUNCTION behavioral_self_test(capability_plan):
  DECLARE results: array
  SET results = []
  FOR EACH behavior IN self.claimed_capabilities:
    EXECUTE_TOOL behavior ON positive_case INTO pos
    EXECUTE_TOOL behavior ON negative_case INTO neg
    IF pos == expected_positive AND neg == expected_negative: APPEND {behavior: behavior, status: "matches_contract"} TO results
    ELSE: APPEND {behavior: behavior, status: classify(false_positive | false_negative | failed)} TO results; LOG "BEHAVIORAL FAILURE: " + behavior
  RETURN results

FUNCTION adversarial_test(detector):
  DECLARE results: array
  SET results = []
  FOR EACH attack IN ["pathTraversal", "nullByte", "unicodeHomoglyph", "commentFalsePositive", "patternSpoof"]:
    CONSTRUCT malicious_input FOR attack
    EXECUTE_TOOL detector ON malicious_input INTO r
    # pathTraversal: escape intended root → expect reject. nullByte: truncation/deception → expect ignore.
    # unicodeHomoglyph: look-alike from another script → MUST NOT match legitimate token.
    # commentFalsePositive: pattern inside comment/string, not real code → expect no_match.
    # patternSpoof: text satisfying a shallow pattern without real structure → expect structural_reject.
    DETERMINE verdict IN [blocked, ignored, VULNERABLE, "FALSE POSITIVE DETECTED"] FROM attack, r
    APPEND {attack: attack, verdict: verdict} TO results
    IF verdict IN ["VULNERABLE", "FALSE POSITIVE DETECTED"]: LOG "VULNERABILITY: verification logic fooled by " + attack
  RETURN results

FUNCTION self_audit():
  DECLARE self_discrepancies: array
  SET self_discrepancies = []
  READ_RESOURCE {self.definition} INTO self_definition
  SEARCH_CONTENT self_definition FOR self_claims (MUST/ALWAYS/verify/behavioral/adversarial) INTO self_claims
  FOR EACH sc IN self_claims:
    SEARCH_CONTENT self_definition FOR implementation_evidence OF sc
    IF implementation_evidence == none: APPEND {claim: sc, status: "NOT IMPLEMENTED", violation: "claim_without_implementation"} TO self_discrepancies
  CALCULATE self_confidence IN [confirmed, partially_confirmed, overclaimed, invalid] FROM self_discrepancies   # maps to number[0,1]
  RETURN {self_discrepancies: self_discrepancies, self_confidence: self_confidence}

FUNCTION run_gate_protocol(findings):
  # A gate is binary. Severity {critical, high, medium, low} orders REPAIR; it does not
  # soften the verdict. A middle tier terminates a run as successful while a failure is
  # still open, which is the failure mode the whole template exists to prevent.
  IF any criterion fails: RETURN {verdict: "BLOCK", repair_order: SORT(failures BY severity DESC)}
  ELSE:                   RETURN {verdict: "PASS", repair_order: []}

# OUTPUT CONTRACT
SET discrepancies = classify_claims(observations)
SET behavioral = behavioral_self_test(capability_plan)
SET vulnerabilities = adversarial_test(capability_plan.calibrated_detectors)   # ver-falsification
SET self = self_audit()                                                        # ver-confidence
NAME what_would_refute(discrepancies, observations) INTO refuter
SET gate_result = run_gate_protocol({discrepancies: discrepancies, behavioral: behavioral, vulnerabilities: vulnerabilities, self: self})
SET adjudication = {discrepancies: discrepancies, behavioral: behavioral, vulnerabilities: vulnerabilities, self_confidence: self.self_confidence, refuter: refuter, gate_result: gate_result}

HANDOFF GATE (ver-stop gate):
  rule_id: "VERIFY"   yields: boolean
  [check] every claim classified verified | contradicted | unverified with its evidence (evidence: discrepancies + observations)
  [check] no match trusted without calibration + adversarial verdict; a refuter named (evidence: vulnerabilities, refuter)
  [check] behavior mismatch treated as implementation-evidence failure (evidence: behavioral)
  [check] recursive self-audit run; overclaim downgrades confidence below threshold → not ver-stop (evidence: self_confidence)
  [check] no VULNERABLE verdict stands — a spoofed detector invalidates every claim it verified (evidence: vulnerabilities)
  result: gate_result.verdict == PASS → NODE 9 COMMIT | BLOCK → REPAIR (refutes-back / blocked), highest severity first


# ----------------------------------------------------------------------------
# REPAIR EDGE  (verify --refutes-back--> resolve escalations; bounded by ter-diminishing-returns)
# ----------------------------------------------------------------------------
@purpose: "Resolve capability gaps and write failures without inference, and route confidence downgrades"
@cue: "BUILD_OR_MARK_NEVER_INFER"

CONTRACT:
  input:        observations flagged PENDING_ESCALATION; modification errors; overclaim signals
  transform:    escalate (build a tool) OR mark unverified; stale-write → read-merge-rewrite full state; downgrade confidence
  constraints:  BOUNDED (max_cycles = {convention.max_recursion_depth}); NEVER infer a missing result; NEVER let INVESTIGATE mutate or ACTION discover; a stale write is a state-sync failure, rewritten as complete state not a patch
  output:       resolved observations OR claims marked unverified; verified writes; adjusted confidence
  handoff:      every escalation resolved to evidence OR explicitly marked unverified

FUNCTION escalate_capability(observation, capability_mode):
  IF capability_mode == "blocked":
    RETURN {observation: "capability unavailable", verdict: "unverified"}   # marked, never inferred
  # direct: search, glob, read, execute, write. beyond: AST/CFG, dependency tree, symbol table, type inference.
  CONSTRUCT tool: write_script → execute_script → parse_results
  EXECUTE_TOOL tool ON observation.target INTO analysis
  RETURN {observation: analysis, verdict: classify(analysis)}   # generated-tool output integrated as evidence

FUNCTION recover_write(target, required_change):
  READ_RESOURCE target INTO current_content
  MERGE required_change WITH current_content INTO new_content
  PERSIST_ARTIFACT target WITH new_content   # complete state, not a patch
  VALIDATE write: Exists AND ContentMatches
  RETURN write_verified

# refutes-back loop
FOR EACH o IN observations WHERE o.observation == "PENDING_ESCALATION": SET o = escalate_capability(o, capability_plan.capability_mode)
IF modification_error: SET write_verified = recover_write(target, required_change)
IF adjudication.self_confidence IN ["overclaimed", "invalid"]: DOWNGRADE reported_confidence
IF any newly-resolved observation: RE-RUN NODE 8 for the changed claims (bounded)


# ============================================================================
# NODE 9 — COMMIT      [evaluative · representation · information-theory · yields: one typed artifact]
# ============================================================================
@purpose: "Emit exactly one typed artifact, deduplicated, naming every limitation, warning, and vulnerability"
@axis_question: "How is the verdict encoded?"
@cue: "TYPED_TERMINAL"

CONTRACT:
  input:        run_context + adjudication + recovery outcomes
  transform:    select the artifact type bound in NODE 1 → serialize findings → dedup → name every limitation
  constraints:  exactly one artifact; INVESTIGATE emits evidence and never fixes; ACTION operates only on known evidence and discovers nothing; identical findings collapse (info-theory)
  output:       committed { artifact_type, output }
  handoff:      one typed artifact emitted with confidence level and every limitation named (yields: hash + boolean)

EMIT ONE of:
  - investigation_report  # verified findings, failed checks, warnings, discrepancies, environmental limits, adversarial results, confidence (INVESTIGATE — produces evidence, never fixes)
  - action_log            # documented gaps only, bounded fixes, versioned artifact, write verification (ACTION — operates on known evidence, discovers nothing)
  - blocked_execution_report  # trust-anchor or critical-capability failure prevented safe verification

# OUTPUT CONTRACT
IF run_context.trust_anchor.unmet OR capability_plan.capability_mode == "blocked":
  SET committed = {artifact_type: "blocked_execution_report", output: render_blocked(run_context, adjudication)}
ELSE:
  SET committed = {artifact_type: run_context.artifact, output: render_report(run_context, adjudication)}
DEDUP committed.output BY (claim, verdict)

HANDOFF GATE (evidence-bearing):
  rule_id: "COMMIT"   yields: hash + boolean
  [check] exactly one typed artifact emitted (evidence: committed.artifact_type)
  [check] every limitation, warning, and vulnerability named (evidence: committed.output)
  [check] findings deduplicated — no claim/verdict recorded twice (evidence: dedup)
  result: pass → NODE 10 TERMINATE (owner: commit)


# ============================================================================
# NODE 10 — TERMINATE  [evaluative · termination · set-theory · yields: ter-stop boolean]
# ============================================================================
@purpose: "Stop only on saturation AND completion AND verification; otherwise emit a blocked report — never a self-assessed stop"
@axis_question: "Are we done?"   @mandatory: always   @selectable: false
@cue: "TYPED_TERMINAL"

CONTRACT:
  input:        committed + adjudication + run_context + capability_plan
  transform:    evaluate the termination node-set → finalize the one typed artifact
  constraints:  ter-stop == saturation AND completion AND verification; ter-block routes to the blocked_execution_report (trust-anchor / critical-capability failure); confidence reflects the self-audit downgrade
  output:       generation_result { artifact_type, output }
  handoff:      terminal — one typed artifact, confidence honest, every limitation named (yields: boolean)

DECLARE termination_nodes: array
SET termination_nodes = [
  {id: "ter-completion",         asks: "is every claim classified + the artifact emitted?", yields: "boolean", test: "no claim unmapped; artifact present"},
  {id: "ter-saturation",         asks: "is nothing left to resolve?",                       yields: "boolean", test: "no PENDING_ESCALATION remains"},
  {id: "ter-diminishing-returns",asks: "has escalation stopped resolving claims?",          yields: "counter", test: "repair cycles within recursion_limit", role: "injection-gate"},
  {id: "ter-block",              asks: "did the trust anchor or a critical capability fail?", yields: "boolean", test: "anchor unmet OR capability_mode blocked"},
  {id: "ter-stop",               asks: "complete, verified, and saturated?",                yields: "boolean", test: "saturation AND completion AND verification", role: "completion-marker"}
]

FUNCTION evaluate_termination(committed, adjudication, run_context, capability_plan):
  SET completion  = EXISTS(committed.output) AND no_claim_unmapped(adjudication)
  SET verification = (adjudication.gate_result.verdict == "PASS")
  SET saturation  = (no observation == "PENDING_ESCALATION")
  SET blocked     = (run_context.trust_anchor.unmet OR capability_plan.capability_mode == "blocked")
  SET ter_stop = (saturation AND completion AND verification AND NOT blocked)
  RETURN {completion: completion, verification: verification, saturation: saturation, blocked: blocked, ter_stop: ter_stop}

# TERMINAL — exactly one typed artifact; bounded by max_cycles in the REPAIR edge.
SET term = evaluate_termination(committed, adjudication, run_context, capability_plan)
IF term.blocked == true:
  SET generation_result = {artifact_type: "blocked_execution_report", output: committed.output}
ELSE:
  SET generation_result = {artifact_type: committed.artifact_type, output: committed.output}

HANDOFF GATE (ter-stop gate):
  rule_id: "TERMINATE"   yields: boolean
  [check] exactly one typed artifact emitted (evidence: generation_result.artifact_type)
  [check] success ONLY when saturation AND completion AND verification hold; else blocked (evidence: term)
  [check] confidence reflects self-audit downgrade (evidence: adjudication.self_confidence)
  result: TERMINATE

FINALIZE generation_result


# ============================================================================
# CROSS-NODE INVARIANTS  (bind every node)
# ============================================================================
ALWAYS:
  - disclose the trust anchor (minimal assumptions + cannot-verify-the-verifier boundary) and kind every claim by ontological dimension
  - rank claims by verification worth and choose each method by utility - cost before probing (NODE 2)
  - run the four mandatory-always gates every run: tel-priority (NODE 2), constrain op-set admissibility (NODE 7), ver-stop (NODE 8), ter-stop (NODE 10)
  - type every decision to its yields-shape; confidence is a level, adversarial survival is a set, classification is a verdict
  - process claims in verdict-genesis order (existence->difference->relation->...); a claim depending on another's observation follows it
  - probe runtime capabilities (full/degraded/blocked) and calibrate detectors (false-positive AND false-negative) before trusting output
  - gather observations from actual implementation; never infer; sanitize strings, guard arithmetic, govern recursion
  - behaviorally self-test claimed capabilities, adversarially test detection logic, and recursively self-verify — downgrade confidence on overclaim
  - a node reads ONLY the prior node's output contract, and hands off through exactly one evidence-bearing gate
  - repair escalations bounded by ter-diminishing-returns; emit one typed artifact and name every limitation, warning, and vulnerability

NEVER:
  - proceed past NODE 2 verifying a low-worth claim expensively while a high-worth claim is unmapped
  - trust a claim not mapped to observable implementation evidence
  - let INVESTIGATE mutate, or let ACTION discover new scope
  - report a match without calibrating the detector against known-good AND known-bad controls
  - accept ordinary examples as proof — test the detector adversarially (traversal, null byte, homoglyph, comment/spoof)
  - match a pattern inside a comment/string as if it were real code, or match a homoglyph as the legitimate token
  - emit runtime-specific paths or commands into the core (adapter-resolve them), or hardcode a model
  - infer a result when a capability is missing — build a tool or mark the claim unverified
  - stop on anything but saturation AND completion AND verification; exempt this agent from its own verification
  - soften a gate verdict into a middle tier — a gate is 0 or 1, and severity orders the repair rather than excusing it
```
