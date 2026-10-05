import { EDGE_KIND_VOCABULARY, MECHANISM_VOCABULARY } from "#configuration/constants/ontology.constants";
import type {
    ForceView,
    KindView,
    LayerEdgeView,
    LayerNodeView,
    LayerView,
    MembershipView,
    RelationRangeView,
    TensionView,
} from "@banes-lab/web/types/ontology.types.js";
import { type GovlabContext, KIND_TAXONOMY, RELATION_RANGES, slugify } from "@govlab/context";
import { idOf, refOf } from "#core/resolvers/ontology.resolver";
import { ALGO_FACE } from "@govlab/constants";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { Resolver } from "#types/ontology.types";

const ANTI_FORCE_MARK = "(";
const PAIR_SEPARATOR = "|";

const groupBy = function groupBy<T>(items: readonly T[], keyOf: (item: T) => string): readonly [string, T[]][] {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const key = keyOf(item);
        groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return [...groups.entries()];
};

const membershipOf = function membershipOf(context: GovlabContext, resolve: Resolver): readonly MembershipView[] {
    const layerRef = function layerRef(id: string): EdgeRef | null {
        const layer = context.layerOf(id);
        return layer === null ? null : resolve.layer(layer);
    };
    const fromArch = groupBy(context.arch.all(), (principle) => principle.category).map(([category, principles]) => {
        const first = principles.at(0);
        return { category: resolve.archCategory(category), layer: first === undefined ? null : layerRef(first.id) };
    });
    const archCategories = new Set(fromArch.map((entry) => slugify(entry.category.label)));
    const fromLex = groupBy(context.lex.all(), (term) => term.category)
        .filter(([category]) => !archCategories.has(category))
        .map(([category, terms]) => {
            const first = terms.at(0);
            return { category: resolve.lexCategory(category), layer: first === undefined ? null : layerRef(first.id) };
        });
    return [...fromArch, ...fromLex];
};

const pairKey = function pairKey(a: string, b: string): string {
    return [slugify(a), slugify(b)].sort((left, right) => left.localeCompare(right)).join(PAIR_SEPARATOR);
};

const resolutionsOf = function resolutionsOf(context: GovlabContext, resolve: Resolver): readonly TensionView[] {
    const explicit = new Set(context.resolutions().map((resolution) => pairKey(resolution.a, resolution.b)));
    const seen = new Set<string>();
    const out: TensionView[] = [];
    for (const principle of context.arch.all()) {
        for (const target of principle.tensions_with) {
            const key = pairKey(principle.id, target);
            const resolution = context.resolveTension(principle.id, target);
            if (resolution !== null && !seen.has(key)) {
                seen.add(key);
                const a = resolve.arch(resolution.a);
                const b = resolve.arch(resolution.b);
                out.push({
                    a,
                    b,
                    explicit: explicit.has(key),
                    id: idOf(resolve.tension(a, b).ref ?? key),
                    mechanism: resolve.vocabulary(MECHANISM_VOCABULARY, resolution.mechanism),
                    rule: resolution.rule,
                    scopeA: resolve.layer(resolution.scopeA),
                    scopeB: resolve.layer(resolution.scopeB),
                });
            }
        }
    }
    return out;
};

const nodesOf = function nodesOf(
    context: GovlabContext,
    resolve: Resolver,
    membership: readonly MembershipView[],
    topology: readonly LayerEdgeView[],
): readonly LayerNodeView[] {
    return context.layers().map((layer) => {
        const { ref } = resolve.layer(layer.id);
        return {
            contract: { label: layer.label, ref: refOf(ALGO_FACE, layer.id) },
            id: layer.id,
            incoming: topology.filter((edge) => edge.to.ref === ref),
            label: layer.label,
            members: membership.filter((entry) => entry.layer?.ref === ref).map((entry) => entry.category),
            outgoing: topology.filter((edge) => edge.from.ref === ref),
        };
    });
};

export const layersOf = function layersOf(context: GovlabContext, resolve: Resolver): LayerView {
    const membership = membershipOf(context, resolve);
    const topology = context
        .topology()
        .map((edge) => ({
            from: resolve.layer(edge.from),
            kind: resolve.vocabulary(EDGE_KIND_VOCABULARY, edge.kind),
            to: resolve.layer(edge.to),
        }));
    return {
        membership,
        nodes: nodesOf(context, resolve, membership, topology),
        resolutions: resolutionsOf(context, resolve),
        topology,
    };
};

export const kindsOf = function kindsOf(context: GovlabContext): readonly KindView[] {
    return KIND_TAXONOMY.map((kind) => ({
        definitionSignatures: kind.definitionSignatures,
        discriminator: kind.discriminator,
        distinguishesFrom: kind.distinguishesFrom,
        kind: kind.kind,
        principles: context.arch.all().filter((principle) => principle.type === kind.kind).length,
        terms: context.lex.all().filter((term) => term.kind === kind.kind).length,
    }));
};

export const rangesOf = function rangesOf(resolve: Resolver): readonly RelationRangeView[] {
    return Object.entries(RELATION_RANGES).map(([relation, kinds]) => ({
        kinds: [...kinds].map((kind) => resolve.kind(kind)),
        relation,
    }));
};

export const forceNames = function forceNames(context: GovlabContext): ReadonlySet<string> {
    return new Set(
        context
            .joinConcerns()
            .map((row) => row.force)
            .filter((force) => !force.includes(ANTI_FORCE_MARK)),
    );
};

export const forcesOf = function forcesOf(context: GovlabContext, resolve: Resolver): readonly ForceView[] {
    const known = forceNames(context);
    return context
        .joinConcerns()
        .filter((row) => known.has(row.force))
        .map((row) => ({
            concerns: row.concerns,
            contracts: row.contracts.map((contract) => resolve.algo(contract)),
            force: row.force,
            id: slugify(row.force),
            principles: row.principles.map((principle) => resolve.arch(principle)),
        }));
};
