import {
    ALGO_FACE,
    ARCH_FACE,
    AXIS_RELATION,
    CATEGORY_RELATION,
    COMPOSED_BY_RELATION,
    COMPOSES_RELATION,
    CONFLICTS_WITH_RELATION,
    CONTRACTS_RELATION,
    CONTRACT_RELATION,
    DERIVED_BY_RELATION,
    DETECTS_RELATION,
    ENABLES_RELATION,
    GROUNDED_BY_RELATION,
    GROUNDS_RELATION,
    LAYER_FACE,
    LEX_FACE,
    PAG_FACE,
    PRINCIPLE_RELATION,
    REASON_FACE,
    REFERENCED_BY_RELATION,
    REINFORCES_RELATION,
    REQUIRES_RELATION,
    STAGE_FACE,
    STAGE_RELATION,
    TENSIONS_RELATION,
    TENSIONS_WITH_RELATION,
    TENSION_FACE,
    TERM_RELATION,
} from "@govlab/constants";
import type {
    ContractView,
    OntologySnapshot,
    PrincipleView,
    ResolutionView,
    TermView,
} from "@banes-lab/web/types/ontology.types.js";
import type { ReferenceIndex, ReferenceRecord } from "@banes-lab/web/types/reference.types.js";
import { idOf, refOf } from "#core/resolvers/ontology.resolver";
import { layerRecord, tensionRecord } from "#core/converters/layer.reference.converter";
import { reasonReferencesOf, stageReferencesOf } from "#core/converters/reason.reference.converter";
import { relationOf as relation, singleRelation as single } from "#core/factories/reference.factory";
import type { ReferenceFaces } from "#types/ontology.types";
import { groupReferencesOf } from "#core/converters/ontology.reference.converter";
import { groupTitleOf } from "@banes-lab/web/strings/catalog.strings";
import { pagReferencesOf } from "#core/converters/grammar.reference.converter";
import { recordCheckOf } from "@banes-lab/web/converters/check.converter";

const PAREN_OPEN = "(";
const PAREN_CLOSE = ")";
const ALGORITHM_KIND = "algorithm";
const DOMAIN_RELATION = "domain";
const SEVERITY_RELATION = "severity";
const TIER_RELATION = "tier";

const codeOf = function codeOf(name: string): string | null {
    const open = name.indexOf(PAREN_OPEN);
    const close = name.indexOf(PAREN_CLOSE, open);
    return open === -1 || close === -1 ? null : name.slice(open + 1, close).trim();
};

const plainOf = function plainOf(name: string): string {
    const open = name.indexOf(PAREN_OPEN);
    const close = name.indexOf(PAREN_CLOSE, open);
    return open === -1 || close === -1 ? name.trim() : (name.slice(0, open) + name.slice(close + 1)).trim();
};

const principleRecord = function principleRecord(view: PrincipleView): ReferenceRecord {
    return {
        code: codeOf(view.name),
        kind: view.kind.label,
        layer: view.layer,
        name: plainOf(view.name),
        relations: [
            ...relation(REQUIRES_RELATION, view.edges.requires),
            ...relation(REINFORCES_RELATION, view.edges.reinforces),
            ...relation(ENABLES_RELATION, view.edges.enables),
            ...relation(CONFLICTS_WITH_RELATION, view.edges.conflictsWith),
            ...relation(TENSIONS_WITH_RELATION, view.edges.tensionsWith),
            ...relation(TENSIONS_RELATION, view.tensions),
            ...relation(CONTRACTS_RELATION, view.contracts),
            ...single(TERM_RELATION, view.term),
            ...single(SEVERITY_RELATION, view.severity),
            ...relation(REFERENCED_BY_RELATION, view.referencedBy),
        ],
        summary: view.definition,
    };
};

const termRecord = function termRecord(view: TermView): ReferenceRecord {
    return {
        code: codeOf(view.name),
        kind: view.kind.label,
        layer: view.layer,
        name: plainOf(view.name),
        relations: [
            ...single(CATEGORY_RELATION, view.category),
            ...single(PRINCIPLE_RELATION, view.principle),
            ...single(CONTRACT_RELATION, view.contract),
            ...relation(REFERENCED_BY_RELATION, view.referencedBy),
        ],
        summary: view.definition,
    };
};

const contractRecord = function contractRecord(view: ContractView): ReferenceRecord {
    const domainId = idOf(view.domain.ref ?? "");
    return {
        code: null,
        kind: ALGORITHM_KIND,
        layer: view.layer,
        name: view.title,
        relations: [
            ...single(DOMAIN_RELATION, { ...view.domain, label: groupTitleOf(domainId, view.domain.label) }),
            ...single(STAGE_RELATION, view.stage),
            ...single(AXIS_RELATION, view.axis),
            ...single(TIER_RELATION, view.tier),
            ...single(PRINCIPLE_RELATION, view.principle),
            ...relation(COMPOSES_RELATION, view.composes),
            ...relation(COMPOSED_BY_RELATION, view.composedBy),
            ...relation(GROUNDS_RELATION, view.grounds),
            ...relation(GROUNDED_BY_RELATION, view.groundedBy),
            ...relation(DERIVED_BY_RELATION, view.derivedBy),
            ...relation(DETECTS_RELATION, view.detects),
        ],
        summary: view.intent,
    };
};

const withChecks = function withChecks(index: ReferenceIndex, resolution: ResolutionView): ReferenceIndex {
    return Object.fromEntries(
        Object.entries(index).map(([ref, record]) => {
            const check = recordCheckOf(resolution, ref);
            return [ref, check === null ? record : { ...record, check }];
        }),
    );
};

export const referencesOf = function referencesOf(snapshot: OntologySnapshot): ReferenceFaces {
    const lex: Record<string, ReferenceRecord> = {};
    const algo: Record<string, ReferenceRecord> = {};
    const arch: Record<string, ReferenceRecord> = {};
    const layer: Record<string, ReferenceRecord> = {};
    const tension: Record<string, ReferenceRecord> = {};
    const intents = new Map<string, string>();
    for (const group of snapshot.terms) {
        for (const term of group.terms) {
            lex[refOf(LEX_FACE, term.id)] = termRecord(term);
        }
    }
    for (const group of snapshot.contracts) {
        for (const contract of group.contracts) {
            intents.set(refOf(ALGO_FACE, contract.id), contract.intent);
            algo[refOf(ALGO_FACE, contract.id)] = contractRecord(contract);
        }
    }
    for (const group of snapshot.principles) {
        for (const principle of group.principles) {
            arch[refOf(ARCH_FACE, principle.id)] = principleRecord(principle);
        }
    }
    for (const node of snapshot.layers.nodes) {
        layer[refOf(LAYER_FACE, node.id)] = layerRecord(node, intents);
    }
    for (const resolution of snapshot.layers.resolutions) {
        tension[refOf(TENSION_FACE, resolution.id)] = tensionRecord(resolution);
    }
    const checks = snapshot.resolution;
    return new Map([
        [ALGO_FACE, withChecks(algo, checks)],
        [ARCH_FACE, withChecks(arch, checks)],
        [LAYER_FACE, layer],
        [LEX_FACE, withChecks(lex, checks)],
        [PAG_FACE, withChecks(pagReferencesOf(snapshot.grammar), checks)],
        [REASON_FACE, withChecks(reasonReferencesOf(snapshot.reason), checks)],
        [STAGE_FACE, stageReferencesOf(snapshot.reason)],
        [TENSION_FACE, tension],
        ...groupReferencesOf(snapshot),
    ]);
};
