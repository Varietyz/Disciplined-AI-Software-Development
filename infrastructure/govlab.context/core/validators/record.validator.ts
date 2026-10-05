import type { AdjacentPair, InvalidDistinct } from "#types/validation.types";
import {
    DISTINCT_SELF,
    DISTINCT_UNKNOWN,
    DISTINCT_UNREASONED,
    siblingsUnder,
} from "#configuration/strings/validation.strings";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { DistinctDeclaration } from "#types/field.types";
import type { Faces } from "#types/context.types";
import { PAG_KINDS } from "#configuration/schemas/grammar.schema";
import { slugify } from "#core/converters/identifier.converter";

const ARCH_PREFIX = "architecture:";
const LEX_PREFIX = "lexicon:";
const KEYWORD_PREFIX = `${COLLECTIONS.pag}:${PAG_KINDS.keyword}:`;
const SEE_ALSO = "seeAlso";
const PAIR_JOINER = " ";
const ARCH_RELATIONS = ["requires", "reinforces", "enables", "conflicts_with", "tensions_with"] as const;

interface RecordNode {
    ref: string;
    kind: string;
    declared: readonly DistinctDeclaration[];
}

interface RecordLink {
    from: string;
    relation: string;
    to: string;
}

type DistinctFaces = Pick<Faces, "arch" | "lex">;

const nodesOf = function nodesOf(faces: DistinctFaces): Map<string, RecordNode> {
    return new Map([
        ...faces.arch.all().map((principle): [string, RecordNode] => {
            const ref = `${ARCH_PREFIX}${principle.id}`;
            return [ref, { declared: principle.distinctFrom ?? [], kind: principle.type, ref }];
        }),
        ...faces.lex.all().map((term): [string, RecordNode] => {
            const ref = `${LEX_PREFIX}${term.id}`;
            return [ref, { declared: term.distinctFrom ?? [], kind: term.kind, ref }];
        }),
    ]);
};

const nameLookupOf = function nameLookupOf(faces: DistinctFaces): Map<string, string> {
    return new Map([
        ...faces.lex
            .all()
            .flatMap((term) =>
                [term.id, term.name, ...term.aliases].map((name): [string, string] => [
                    slugify(name),
                    `${LEX_PREFIX}${term.id}`,
                ]),
            ),
        ...faces.arch
            .all()
            .flatMap((principle) =>
                [principle.id, principle.name, ...(principle.aliases ?? [])].map((name): [string, string] => [
                    slugify(name),
                    `${ARCH_PREFIX}${principle.id}`,
                ]),
            ),
    ]);
};

const linksOf = function linksOf(faces: DistinctFaces): RecordLink[] {
    const byKey = nameLookupOf(faces);
    const linkTo = (from: string, relation: string, target: string): RecordLink[] => {
        const to = byKey.get(slugify(target));
        return to === undefined ? [] : [{ from, relation, to }];
    };
    return [
        ...faces.arch
            .all()
            .flatMap((principle) =>
                ARCH_RELATIONS.flatMap((relation) =>
                    principle[relation].flatMap((target) => linkTo(`${ARCH_PREFIX}${principle.id}`, relation, target)),
                ),
            ),
        ...faces.lex
            .all()
            .flatMap((term) => term.seeAlso.flatMap((target) => linkTo(`${LEX_PREFIX}${term.id}`, SEE_ALSO, target))),
    ];
};

const pairKey = function pairKey(a: string, b: string): string {
    return a.localeCompare(b) < 0 ? `${a}${PAIR_JOINER}${b}` : `${b}${PAIR_JOINER}${a}`;
};

const declares = function declares(node: RecordNode | undefined, other: string): boolean {
    return (node?.declared ?? []).some((entry) => entry.id === other && entry.reason.trim().length > 0);
};

const sameKind = function sameKind(nodes: Map<string, RecordNode>, a: string, b: string): string | null {
    const kind = nodes.get(a)?.kind;
    return a !== b && kind !== undefined && kind === nodes.get(b)?.kind ? kind : null;
};

const directPairs = function directPairs(nodes: Map<string, RecordNode>, links: readonly RecordLink[]): AdjacentPair[] {
    return links.flatMap((link) => {
        const kind = sameKind(nodes, link.from, link.to);
        return kind === null ? [] : [{ a: link.from, b: link.to, basis: link.relation, kind }];
    });
};

const pairsWithin = function pairsWithin(
    nodes: Map<string, RecordNode>,
    key: string,
    targets: readonly string[],
): AdjacentPair[] {
    return targets.flatMap((first, index) =>
        targets.slice(index + 1).flatMap((other) => {
            const kind = sameKind(nodes, first, other);
            return kind === null ? [] : [{ a: first, b: other, basis: siblingsUnder(key), kind }];
        }),
    );
};

const siblingPairs = function siblingPairs(
    nodes: Map<string, RecordNode>,
    links: readonly RecordLink[],
): AdjacentPair[] {
    const groups = new Map<string, string[]>();
    for (const link of links) {
        const key = `${link.from}${PAIR_JOINER}${link.relation}`;
        groups.set(key, [...(groups.get(key) ?? []), link.to]);
    }
    return [...groups].flatMap(([key, targets]) => pairsWithin(nodes, key, targets));
};

export const undeclaredAdjacentPairsOf = function undeclaredAdjacentPairsOf(faces: DistinctFaces): AdjacentPair[] {
    const nodes = nodesOf(faces);
    const links = linksOf(faces);
    const seen = new Set<string>();
    return [...directPairs(nodes, links), ...siblingPairs(nodes, links)]
        .filter((pair) => {
            const key = pairKey(pair.a, pair.b);
            const fresh = !seen.has(key);
            seen.add(key);
            return fresh && !declares(nodes.get(pair.a), pair.b) && !declares(nodes.get(pair.b), pair.a);
        })
        .toSorted((x, y) => x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
};

const invalidOf = function invalidOf(node: RecordNode, nodes: Map<string, RecordNode>): InvalidDistinct[] {
    return node.declared.flatMap((entry) => {
        if (entry.id === node.ref) {
            return [{ from: node.ref, reason: DISTINCT_SELF, target: entry.id }];
        }
        if (!nodes.has(entry.id)) {
            return [{ from: node.ref, reason: DISTINCT_UNKNOWN, target: entry.id }];
        }
        return entry.reason.trim().length === 0
            ? [{ from: node.ref, reason: DISTINCT_UNREASONED, target: entry.id }]
            : [];
    });
};

const keywordNodesOf = function keywordNodesOf(faces: Pick<Faces, "pag">): Map<string, RecordNode> {
    return new Map(
        faces.pag.keywords().map((record): [string, RecordNode] => {
            const ref = `${KEYWORD_PREFIX}${record.keyword}`;
            return [ref, { declared: record.distinctFrom ?? [], kind: PAG_KINDS.keyword, ref }];
        }),
    );
};

export const invalidRecordDistinctsOf = function invalidRecordDistinctsOf(
    faces: Pick<Faces, "arch" | "lex" | "pag">,
): InvalidDistinct[] {
    const nodes = new Map([...nodesOf(faces), ...keywordNodesOf(faces)]);
    return [...nodes.values()].flatMap((node) => invalidOf(node, nodes));
};
