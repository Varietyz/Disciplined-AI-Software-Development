import {
    ALIAS_EMPTY,
    ALIAS_FOLDED,
    ALIAS_REPEATS_NAME,
    aliasCollides,
} from "#configuration/strings/validation.strings";
import type { AliasDefect, AliasHolder } from "#types/validation.types";
import { nameKeyOf, slugify } from "#core/converters/identifier.converter";
import type { DistinctDeclaration } from "#types/field.types";
import type { Faces } from "#types/context.types";

const KIND_SEPARATOR = ":";

const holder = function holder(
    collection: string,
    ref: string,
    names: readonly (string | undefined)[],
    aliases: readonly string[] | undefined,
    distinct: readonly DistinctDeclaration[] | undefined,
): AliasHolder {
    return {
        aliases: aliases ?? [],
        collection,
        distinct: new Set((distinct ?? []).map((entry) => entry.id)),
        names: names.filter((name): name is string => name !== undefined && name.length > 0),
        ref,
    };
};

const reasonHolders = function reasonHolders(faces: Pick<Faces, "reason">): AliasHolder[] {
    const { reason } = faces;
    const kinded = <T extends { id: string; aliases?: string[] }>(
        kind: string,
        records: readonly T[],
        nameOf: (record: T) => string | undefined,
    ): AliasHolder[] =>
        records.map((record) =>
            holder(
                kind,
                `reasoning${KIND_SEPARATOR}${kind}${KIND_SEPARATOR}${record.id}`,
                [record.id, nameOf(record)],
                record.aliases,
                [],
            ),
        );
    return [
        ...kinded("node", reason.nodes(), (record) => record.name),
        ...kinded("invariant", reason.invariants(), (record) => record.name),
        ...kinded("failure-shape", reason.failureShapes(), (record) => record.name),
        ...kinded("layer", reason.layers(), (record) => record.label),
        ...kinded("lens", reason.lenses(), (record) => record.label),
        ...kinded("representation", reason.representations(), (record) => record.label),
        ...kinded("pattern-type", reason.patternTypes(), (record) => record.label),
        ...kinded("axis", reason.axes(), () => {}),
        ...kinded("dimension", reason.dimensions(), () => {}),
        ...kinded("math-type", reason.mathTypes(), () => {}),
        ...kinded("math-domain", reason.mathDomains(), () => {}),
        ...kinded("mode", reason.modes(), () => {}),
        ...kinded("model", reason.models(), () => {}),
        ...kinded("universal-axis", reason.universalAxes(), () => {}),
        ...kinded("technique", reason.techniques(), () => {}),
        ...kinded("test-surface", reason.testSurfaces(), () => {}),
        ...kinded("substrate-node", reason.substrate().nodes, (record) => record.name),
    ];
};

const pagHolders = function pagHolders(faces: Pick<Faces, "pag">): AliasHolder[] {
    const { pag } = faces;
    const at = (kind: string, key: string): string => `pag${KIND_SEPARATOR}${kind}${KIND_SEPARATOR}${key}`;
    return [
        ...pag
            .keywords()
            .map((record) =>
                holder("keyword", at("keyword", record.keyword), [record.keyword], record.aliases, record.distinctFrom),
            ),
        ...pag
            .documentTypes()
            .map((record) =>
                holder("document-type", at("document-type", record.type), [record.type], record.aliases, []),
            ),
        ...pag
            .productions()
            .map((record) => holder("production", at("production", record.lhs), [record.lhs], record.aliases, [])),
        ...pag
            .templates()
            .map((record) =>
                holder("template", at("template", record.type), [record.type, record.title], record.aliases, []),
            ),
    ];
};

export const aliasHoldersOf = function aliasHoldersOf(
    faces: Pick<Faces, "algo" | "arch" | "lex" | "pag" | "reason">,
): AliasHolder[] {
    return [
        ...faces.arch
            .all()
            .map((record) =>
                holder(
                    "architecture",
                    `architecture:${record.id}`,
                    [record.id, record.name],
                    record.aliases,
                    record.distinctFrom,
                ),
            ),
        ...faces.lex
            .all()
            .map((record) =>
                holder(
                    "lexicon",
                    `lexicon:${record.id}`,
                    [record.id, record.name],
                    record.aliases,
                    record.distinctFrom,
                ),
            ),
        ...faces.algo
            .all()
            .map((record) =>
                holder(
                    "algorithms",
                    `algorithms:${record.id}`,
                    [record.id, record.title],
                    record.aliases,
                    record.distinctFrom,
                ),
            ),
        ...pagHolders(faces),
        ...reasonHolders(faces),
    ];
};

const scopedKey = function scopedKey(entry: AliasHolder, phrase: string): string {
    return `${entry.collection}${KIND_SEPARATOR}${nameKeyOf(phrase)}`;
};

const keyedHolders = function keyedHolders(holders: readonly AliasHolder[]): Map<string, AliasHolder[]> {
    const keyed = new Map<string, AliasHolder[]>();
    for (const entry of holders) {
        for (const scoped of new Set([...entry.names, ...entry.aliases].map((phrase) => scopedKey(entry, phrase)))) {
            keyed.set(scoped, [...(keyed.get(scoped) ?? []), entry]);
        }
    }
    return keyed;
};

const collisionOf = function collisionOf(
    entry: AliasHolder,
    phrase: string,
    keyed: Map<string, AliasHolder[]>,
): string | null {
    const others = (keyed.get(scopedKey(entry, phrase)) ?? []).filter(
        (other) => other.ref !== entry.ref && !(entry.distinct.has(other.ref) && other.distinct.has(entry.ref)),
    );
    return others.length === 0 ? null : aliasCollides(others.map((other) => other.ref));
};

const defectOf = function defectOf(
    entry: AliasHolder,
    alias: string,
    keyed: Map<string, AliasHolder[]>,
): string | null {
    const slug = slugify(alias);
    if (slug.length === 0) {
        return ALIAS_EMPTY;
    }
    if (entry.names.some((name) => slugify(name) === slug)) {
        return ALIAS_REPEATS_NAME;
    }
    if (entry.names.some((name) => nameKeyOf(name) === nameKeyOf(alias))) {
        return ALIAS_FOLDED;
    }
    return collisionOf(entry, alias, keyed);
};

const nameDefectsOf = function nameDefectsOf(entry: AliasHolder, keyed: Map<string, AliasHolder[]>): AliasDefect[] {
    const byKey = new Map(entry.names.map((name) => [nameKeyOf(name), name]));
    return [...byKey.values()].flatMap((name) => {
        const reason = collisionOf(entry, name, keyed);
        return reason === null ? [] : [{ alias: name, reason, ref: entry.ref }];
    });
};

export const aliasDefectsOf = function aliasDefectsOf(holders: readonly AliasHolder[]): AliasDefect[] {
    const keyed = keyedHolders(holders);
    return holders.flatMap((entry) => [
        ...nameDefectsOf(entry, keyed),
        ...entry.aliases.flatMap((alias) => {
            const reason = defectOf(entry, alias, keyed);
            return reason === null ? [] : [{ alias, reason, ref: entry.ref }];
        }),
    ]);
};
