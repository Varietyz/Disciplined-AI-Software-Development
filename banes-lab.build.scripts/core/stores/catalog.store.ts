import type { CatalogStore, DataRenderer, Entry, Leaf } from "#types/catalog.types";
import { duplicateAddress, duplicateRef } from "#configuration/strings/catalog.strings";
import { Buffer } from "node:buffer";
import { digestOf } from "@govlab/content-fingerprint";

const JSON_INDENT = 2;
const LINE_END = "\n";

export const serialize = function serialize(data: object): string {
    return JSON.stringify(data, null, JSON_INDENT) + LINE_END;
};

export const packedParts = function packedParts<T extends object>(
    entries: readonly T[],
    budget: number,
): readonly (readonly T[])[] {
    const parts: T[][] = [];
    let current: T[] = [];
    let bytes = 0;
    for (const entry of entries) {
        const size = Buffer.byteLength(serialize(entry));
        if (current.length > 0 && bytes + size > budget) {
            parts.push(current);
            current = [];
            bytes = 0;
        }
        current.push(entry);
        bytes += size;
    }
    return current.length === 0 ? parts : [...parts, current];
};

const groupBy = function groupBy<T>(
    entries: readonly (readonly [string, T])[],
    length: number,
): Map<string, (readonly [string, T])[]> {
    const groups = new Map<string, (readonly [string, T])[]>();
    for (const entry of entries) {
        const prefix = entry[0].slice(0, length);
        groups.set(prefix, [...(groups.get(prefix) ?? []), entry]);
    }
    return groups;
};

const splitGroup = function splitGroup<T>(
    prefix: string,
    entries: readonly (readonly [string, T])[],
    budget: number,
): readonly (readonly [string, readonly (readonly [string, T])[]])[] {
    const fits = Buffer.byteLength(serialize(Object.fromEntries(entries))) <= budget;
    const longer = entries.filter(([key]) => key.length > prefix.length);
    if (fits || longer.length === 0) {
        return [[prefix, entries]];
    }
    const own = entries.filter(([key]) => key.length <= prefix.length);
    const deeper = [...groupBy(longer, prefix.length + 1).entries()].flatMap(([next, members]) =>
        splitGroup(next, members, budget),
    );
    return own.length === 0 ? deeper : [[prefix, own], ...deeper];
};

export const prefixShards = function prefixShards<T>(
    entries: readonly (readonly [string, T])[],
    budget: number,
): ReadonlyMap<string, readonly (readonly [string, T])[]> {
    const nonEmpty = entries.filter(([key]) => key.length > 0);
    return new Map(
        [...groupBy(nonEmpty, 1).entries()]
            .flatMap(([prefix, members]) => splitGroup(prefix, members, budget))
            .toSorted(([left], [right]) => left.localeCompare(right)),
    );
};

export const createStore = function createStore(site: string, render: DataRenderer): CatalogStore {
    const files = new Map<string, string>();
    const entries = new Map<string, Entry>();
    const put = function put(address: string, body: string): void {
        if (files.has(address)) {
            throw new Error(duplicateAddress(address));
        }
        files.set(address, body);
    };
    const addOne = function addOne(leaf: Leaf): Entry {
        const { identity } = leaf;
        if (entries.has(identity.ref)) {
            throw new Error(duplicateRef(identity.ref));
        }
        const json = serialize(leaf.data);
        put(identity.address.json, json);
        const { markdown } = identity.address;
        if (markdown !== null) {
            put(markdown, leaf.markdown ?? render(identity, leaf.data, site));
        }
        if (leaf.text !== undefined) {
            put(leaf.text.address, leaf.text.body);
        }
        const entry: Entry = {
            bytes: Buffer.byteLength(json),
            fingerprint: digestOf(json),
            href: identity.href === null ? null : site + identity.href,
            json: site + identity.address.json,
            kind: identity.kind,
            markdown: markdown === null ? null : site + markdown,
            ref: identity.ref,
            summary: identity.summary,
            title: identity.title,
        };
        entries.set(identity.ref, entry);
        return entry;
    };
    return { add: (leaves) => leaves.map(addOne), entries, files };
};
