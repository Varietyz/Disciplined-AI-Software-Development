import {
    CATALOG_FILE_BUDGET,
    INDEX_PART_BUDGET,
    INDEX_PART_MARK,
    SEARCH_KIND,
} from "#configuration/constants/catalog.constants";
import type { Leaf, Linker } from "#types/catalog.types";
import {
    SEARCH_INDEX_TITLE,
    indexPartTitle,
    searchKindTitle,
    searchShardTitle,
} from "#configuration/strings/catalog.strings";
import type { SearchEntry, SearchKind, SearchRules } from "#types/search.types";
import { indexPart, searchIndex, searchKindIndex, searchShard } from "#core/resolvers/catalog.resolver";
import { packedParts, prefixShards, serialize } from "#core/stores/catalog.store";
import { Buffer } from "node:buffer";

const SEARCH_REF = "api:search";
const KIND_REF = "api:search/";
const REF_SEPARATOR = "/";
const COLUMNS = ["ref", "title", "position"] as const;
const POSTING = ["row", "count"] as const;

const postingsOf = function postingsOf(entries: readonly SearchEntry[]): ReadonlyMap<string, [number, number][]> {
    const postings = new Map<string, [number, number][]>();
    for (const [row, entry] of entries.entries()) {
        const counts = new Map<string, number>();
        for (const word of entry.words) {
            counts.set(word, (counts.get(word) ?? 0) + 1);
        }
        for (const [word, count] of counts) {
            postings.set(word, [...(postings.get(word) ?? []), [row, count]]);
        }
    }
    return postings;
};

const rowOf = function rowOf(entry: SearchEntry): readonly unknown[] {
    return [entry.identity.ref, entry.identity.title, entry.position];
};

const shardLeaf = function shardLeaf(
    kind: string,
    prefix: string,
    words: readonly (readonly [string, [number, number][]])[],
): Leaf {
    const ref = KIND_REF + kind + REF_SEPARATOR + prefix;
    const title = searchShardTitle(kind, prefix);
    const postings = Object.fromEntries(words.toSorted(([left], [right]) => left.localeCompare(right)));
    return {
        data: { kind, posting: POSTING, postings, prefix, ref, title },
        identity: { address: searchShard(kind, prefix), href: null, kind: SEARCH_KIND, ref, summary: null, title },
        markdown: null,
    };
};

const rowParts = function rowParts(kind: string, rows: readonly (readonly unknown[])[]): readonly Leaf[] {
    const parts = packedParts(rows, INDEX_PART_BUDGET);
    return parts.map((part, index): Leaf => {
        const number = index + 1;
        const ref = KIND_REF + kind + REF_SEPARATOR + INDEX_PART_MARK + String(number);
        const title = indexPartTitle(searchKindTitle(kind), number, parts.length);
        return {
            data: { columns: COLUMNS, kind, part: number, ref, rows: part, title, total: parts.length },
            identity: {
                address: indexPart(searchKindIndex(kind), String(number)),
                href: null,
                kind: SEARCH_KIND,
                ref,
                summary: null,
                title,
            },
            markdown: null,
        };
    });
};

const kindLeaves = function kindLeaves(search: SearchKind, linker: Linker): readonly Leaf[] {
    const { entries, kind } = search;
    const prefixes = prefixShards([...postingsOf(entries).entries()], INDEX_PART_BUDGET);
    const shards = [...prefixes.entries()].map(([prefix, words]) => shardLeaf(kind, prefix, words));
    const ref = KIND_REF + kind;
    const title = searchKindTitle(kind);
    const addresses = Object.fromEntries(
        [...prefixes.keys()].map((prefix) => [prefix, linker.site + searchShard(kind, prefix).json]),
    );
    const rows = entries.map(rowOf);
    const whole = { columns: COLUMNS, kind, ref, rows, shards: addresses, title };
    const parted = Buffer.byteLength(serialize(whole)) > CATALOG_FILE_BUDGET ? rowParts(kind, rows) : [];
    const parts = parted.map((part) => linker.site + part.identity.address.json);
    const data = parted.length === 0 ? whole : { ...whole, parts, rows: [] };
    const head: Leaf = {
        data,
        identity: { address: searchKindIndex(kind), href: null, kind: SEARCH_KIND, ref, summary: null, title },
        markdown: null,
    };
    return [head, ...parted, ...shards];
};

export const searchLeaves = function searchLeaves(
    kinds: readonly SearchKind[],
    rules: SearchRules,
    linker: Linker,
): readonly Leaf[] {
    const indexes = Object.fromEntries(
        kinds.map(({ entries, kind }) => [
            kind,
            { count: entries.length, json: linker.site + searchKindIndex(kind).json },
        ]),
    );
    const title = SEARCH_INDEX_TITLE;
    const head: Leaf = {
        data: { kinds: indexes, posting: POSTING, ref: SEARCH_REF, rules, title },
        identity: { address: searchIndex(), href: null, kind: SEARCH_KIND, ref: SEARCH_REF, summary: null, title },
        markdown: null,
    };
    return [head, ...kinds.flatMap((kind) => kindLeaves(kind, linker))];
};
