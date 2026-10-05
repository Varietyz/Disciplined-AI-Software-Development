import type { PagDocument, PagNode } from "@govlab/context/types/grammar.document.types.ts";
import { nodeOf, parseHeader } from "@govlab/context/core/parsers/node.parser.ts";

export const LINE = 7;
export const NODE_HEADER = "NODE 3 — SEE   [epistemic · analysis · graph · yields: lens-set + analytic edges]";

export const NODE_ONE_HEADER = "# NODE 1 — READ THE SOURCE   [epistemic · analysis · set-theory · yields: set]";
export const NODE_ONE_POPULATION = " over: {project.source} measured: 1 / 1";
export const NODE_ONE_RESULT = "  result: pass → NODE 2 | empty → REPAIR (owner: NODE 1) | unknown → BLOCKED";
export const REFUSAL_LINE = "  refuse: {project.target} changed since it was read before PERSIST_ARTIFACT\n";
export const FRESHNESS_LINE = "  freshness: fingerprint(held) + fingerprint(this document)\n";
export const ONE_READ_INVARIANT =
    "INVARIANT one-read: a node reads only the prior node's output over: every node binds: the reader objector: [check] input names NODE n-1 or a slot";
export const NO_SPAWN_INVARIANT =
    "INVARIANT no-spawn: no autonomous party is spawned over: every node binds: the reader objector: none";

export const GOOD = `---
name: sample
type: TASK
---

THIS TASK EXECUTES a sample task

%% META %%:
objective: "read a source and persist a shaped copy"
jurisdiction: {project.source} | external: the host's build
recursion_limit: 2

${NODE_ONE_HEADER}
@purpose: "read before claiming"
@genesis: existence
CONTRACT:
  input:     {project.source}
  transform: READ_RESOURCE {project.source} INTO held
  output:    held
HANDOFF GATE (evidence-bearing):
  rule_id: "READ"   yields: set
  [check] held read (evidence: the read returned content)${NODE_ONE_POPULATION}
  [check] held is non-empty (evidence: a count above zero)
  [check] held conforms (evidence: the validator's report)
${NODE_ONE_RESULT}

# NODE 2 — SHAPE AND PERSIST   [evaluative · representation · information-theory · yields: artifact]
@genesis: structure
CONTRACT:
  input:     held from NODE 1
  transform: COMPOSE_ARTIFACT shaped FROM held USING {convention.shape}; PERSIST_ARTIFACT shaped TO {project.target}
  preserves: every entry of held
  output:    {project.target}
${FRESHNESS_LINE}HANDOFF GATE:
  [check] shaped has one entry per entry of held (evidence: the two counts) over: entries of held measured: 12 / 12
  [check] {project.target} persisted (evidence: a read returns it)
  [check] held unchanged (evidence: a witness read)
${REFUSAL_LINE}  standing: moved-set none
  result: pass → TERMINATE
          | mismatch → REPAIR (owner: NODE 2)
          | unknown → BLOCKED

# CROSS-NODE INVARIANTS
${ONE_READ_INVARIANT}
${NO_SPAWN_INVARIANT}

REPORT:
  subject: NODE 2
  verdict: pass
  domain: declared 12 measured 12
  completion: saturated true complete true verified true
`;

export const emptyDoc = (): PagDocument => ({
    declaration: null,
    frontmatter: null,
    invariants: [],
    meta: {},
    nodes: [],
    report: null,
    retired: [],
});

export const nodeWith = (partial: Partial<PagNode>): PagNode => ({
    ...nodeOf(parseHeader(NODE_HEADER), NODE_HEADER, LINE),
    ...partial,
});
