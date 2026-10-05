import {
    INDEX_PART_BUDGET,
    LEADING_ARTICLES,
    RESOLVE_FIRST,
    RESOLVE_LAST,
    RESOLVE_PREFIX,
    RESOLVE_REF,
    SLUG_CHARACTERS,
    SLUG_SEPARATOR,
} from "#configuration/constants/catalog.constants";
import type { Identity, Leaf, Linker } from "#types/catalog.types";
import { resolveLeaf, resolveMap, searchIndex, slugShard } from "#core/resolvers/catalog.resolver";
import { NAME_LOOKUP_TITLE } from "#configuration/strings/catalog.strings";
import type { NamedSource } from "#types/source.types";
import type { Phrase } from "#types/search.types";
import { nameKeyOf } from "@govlab/context";
import { nameShardTitle } from "@banes-lab/web/strings/catalog.strings";
import { prefixShards } from "#core/stores/catalog.store";

const RESOLVE_KIND = "resolve";
const SLUGS_PREFIX = "api:slugs/";
const PATH_SEPARATOR = "/";
const SPACE = " ";
const ACRONYM_OPEN = "(";
const ACRONYM_CLOSE = ")";

const baseName = function baseName(path: string): string {
    return path.slice(path.lastIndexOf(PATH_SEPARATOR) + 1);
};

const withoutArticle = function withoutArticle(title: string): string {
    const space = title.indexOf(SPACE);
    return space !== -1 && LEADING_ARTICLES.has(title.slice(0, space).toLowerCase()) ? title.slice(space + 1) : title;
};

const acronymOf = function acronymOf(title: string): string | null {
    const open = title.lastIndexOf(ACRONYM_OPEN);
    const close = title.lastIndexOf(ACRONYM_CLOSE);
    return open !== -1 && close > open + 1 ? title.slice(open + 1, close) : null;
};

export const identityPhrases = function identityPhrases(identities: readonly Identity[]): readonly Phrase[] {
    return identities.flatMap((identity) => {
        const id = identity.ref.slice(identity.ref.indexOf(":") + 1);
        const { title } = identity;
        const own = [title, id, baseName(title), withoutArticle(title), acronymOf(title)];
        return own.filter((phrase) => phrase !== null).map((phrase) => ({ phrase, ref: identity.ref }));
    });
};

export const definitionPhrases = function definitionPhrases(files: readonly NamedSource[]): readonly Phrase[] {
    return files.flatMap(({ file, identity }) =>
        file.definitions.map((definition) => ({ phrase: definition.name, ref: identity.ref })),
    );
};

const rankOf = function rankOf(ref: string): number {
    const collection = ref.slice(0, ref.indexOf(":"));
    const first = RESOLVE_FIRST.indexOf(collection);
    if (first !== -1) {
        return first;
    }
    return RESOLVE_LAST.includes(collection) ? RESOLVE_FIRST.length + 1 : RESOLVE_FIRST.length;
};

export const resolveTable = function resolveTable(phrases: readonly Phrase[]): ReadonlyMap<string, readonly string[]> {
    const table = new Map<string, string[]>();
    for (const { phrase, ref } of phrases) {
        const slug = nameKeyOf(phrase);
        if (slug.length === 0) {
            continue;
        }
        const held = table.get(slug) ?? [];
        if (!held.includes(ref)) {
            table.set(slug, [...held, ref]);
        }
    }
    return new Map(
        [...table.entries()].map(([slug, refs]) => [
            slug,
            refs.toSorted((left, right) => rankOf(left) - rankOf(right)),
        ]),
    );
};

export const resolveLeaves = function resolveLeaves(
    table: ReadonlyMap<string, readonly string[]>,
    linker: Linker,
): readonly Leaf[] {
    const answer = (ref: string): object => {
        const identity = linker.byRef(ref);
        return {
            kind: identity?.kind ?? null,
            summary: identity?.summary ?? null,
            ...linker.link(identity?.title ?? ref, ref),
        };
    };
    const leaves = [...table.entries()].map(([slug, refs]): Leaf => {
        const address = resolveLeaf(slug);
        return {
            data: { candidates: refs.map(answer), slug },
            identity: {
                address,
                href: null,
                kind: RESOLVE_KIND,
                ref: RESOLVE_PREFIX + slug,
                summary: null,
                title: slug,
            },
            markdown: null,
        };
    });
    const prefixes = prefixShards([...table.entries()], INDEX_PART_BUDGET);
    const shards = [...prefixes.entries()].map(([prefix, slugs]): Leaf => {
        const ref = SLUGS_PREFIX + prefix;
        const title = nameShardTitle(prefix);
        const map = Object.fromEntries(slugs);
        return {
            data: { prefix, ref, slugs: map, title },
            identity: { address: slugShard(prefix), href: null, kind: RESOLVE_KIND, ref, summary: null, title },
            markdown: null,
        };
    });
    const head: Leaf = {
        data: {
            count: table.size,
            order: [...RESOLVE_FIRST, ...RESOLVE_LAST],
            ref: RESOLVE_REF,
            shards: Object.fromEntries(
                [...prefixes.keys()].map((prefix) => [prefix, linker.site + slugShard(prefix).json]),
            ),
            slugRules: {
                characters: SLUG_CHARACTERS,
                separator: SLUG_SEPARATOR,
                words: linker.site + searchIndex().json,
            },
        },
        identity: {
            address: resolveMap(),
            href: null,
            kind: RESOLVE_KIND,
            ref: RESOLVE_REF,
            summary: null,
            title: NAME_LOOKUP_TITLE,
        },
        markdown: null,
    };
    return [...leaves, ...shards, head];
};
