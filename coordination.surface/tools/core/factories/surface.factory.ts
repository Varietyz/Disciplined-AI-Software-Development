import type { Finding } from "../types/segment.types.ts";
import { RETRACTABLE } from "../registries/surface.registry.ts";
import type { ResolvedMandate } from "../types/surface.types.ts";
import { namedOf } from "../resolvers/surface.resolver.ts";
import { surfacePath } from "../../../config/surface.config.ts";

export const WRITE_ENTRYPOINT = `${surfacePath("entrypoints")}/board.entrypoint.ts`;

const FORM_REGISTRY = `${surfacePath("core")}/registries/surface.registry.ts`;

export const unassessedFinding = function unassessedFinding(flag: string): Finding {
    return {
        actual: `${flag} is a form this entry point offers and the mandated-write walk has not assessed`,
        expected:
            "an assessment stating whether the form performs a mandated write, and which operand and member it discharges",
        healed: false,
        line: 0,
        locus: flag,
        path: FORM_REGISTRY,
        remediation: {
            action: "declare",
            decide: "read the RUNNER this form calls and state what it writes, AND in the same read state whether its refusals require a write no form performs — the two answers come from one reading of one file, so they are one obligation and the second is the half that is otherwise remembered rather than mechanized. A help text states intent and a signature states what the form takes, so the assessment comes from the code rather than from the description. Then record it: a form that performs a mandated write is added to the form set at the operand and MEMBER it discharges, and one that does not is recorded with the reason it does not. THIS EXISTS BECAUSE THE FORM SET IS DATA THIS WALK CITES RATHER THAN A FACT IT DERIVES: a new form lands, the walk keeps comparing against a set that predates it, and the count stays stale with nothing reporting the lag — which is a mechanism whose own operand goes out of date silently. What IS derivable is the set of forms the entry point offers, so the walk derives that and refuses to be silent about a form nobody has classified. It cannot decide what a form DOES, which is why the assessment is a party's reading recorded as data rather than something this check infers",
            deterministic: false,
            from: flag,
            target: FORM_REGISTRY,
            to: null,
        },
        rule: "surface/unassessedWriteForm",
        stack: [
            { check: "entrypoint", resolved: WRITE_ENTRYPOINT },
            { check: "form", resolved: flag },
            { check: "assessment", resolved: "absent" },
        ],
    };
};

export const unretractableFinding = function unretractableFinding(region: string): Finding {
    return {
        actual: `a form writes the ${region} region, this region is classified as owing a retraction path, and no form removes a member of it`,
        expected: "a form removing one member of this region, taking the member as its operand",
        healed: false,
        line: 0,
        locus: region,
        path: FORM_REGISTRY,
        remediation: {
            action: "declare",
            decide: "give this region a form that removes ONE member, taking that member as its operand — a region a party can write and cannot unwrite makes every entry into it permanent at the moment of writing, so an author who withdraws a member has no path but prose, and prose is invisible to every derivation that reads the region. THE CLASSIFICATION IS DATA RATHER THAN A PROPERTY THIS WALK INFERS, because most irreversibility is DESIGN: a region whose members are evidence, a signature, or a mark of having read is correctly permanent, and a check firing there would report a defect where the permanence is the whole point. What puts a region in the registry is a verified reading of a mechanism that consumes its members WITHOUT taking a member argument — a collector, an edge, a carry — since that is what makes a withdrawal unenforceable rather than merely inconvenient. So the repair is a member-level removal and never a widening of the collector, which would let one party drop another's member",
            deterministic: false,
            from: region,
            target: WRITE_ENTRYPOINT,
            to: null,
        },
        rule: "surface/unretractableWriteRegion",
        stack: [
            { check: "region", resolved: region },
            { check: "writeForm", resolved: "present" },
            { check: "removeForm", resolved: "absent" },
            { check: "classified", resolved: RETRACTABLE[region] ?? "" },
        ],
    };
};

export const noWritePathFinding = function noWritePathFinding(mandated: ResolvedMandate): Finding {
    const named = namedOf(mandated);
    const { target } = mandated;
    return {
        actual: `${target} is required by a refusing mechanism to carry a written ${named}, and no tool write path reaches that operand`,
        expected: null,
        healed: false,
        line: 0,
        locus: `${mandated.from}:${named}`,
        path: target,
        remediation: {
            action: "declare",
            decide: "give this surface a tool write path carrying the protections every other write takes — the writing party's own span, an allocated id, a compare-and-swap against a concurrent write, and a refusal that carries the diff. A mechanism that REQUIRES a write to a surface it cannot write is a mandate discharged BY HAND, and a hand write has no fence, no addressable id, no drain and no gate, so the protocol's own requirement forces the bypass it elsewhere forbids. The mandate and the write path arrive in different changes and only the mandate feels like the work, which is why the question is asked when a surface becomes an operand rather than when a party first attempts the operation. Until the path exists, a hand write here is DECLARED as a bypass rather than performed as an ordinary write, so the party taking it knows what it is taking and the gap stays countable",
            deterministic: false,
            from: mandated.from,
            target,
            to: null,
        },
        rule: "surface/noWritePath",
        stack: [
            { check: "declared", resolved: mandated.from },
            { check: "operand", resolved: named },
            { check: "refusal", resolved: mandated.refusal },
            { check: "writePath", resolved: "absent" },
        ],
    };
};
