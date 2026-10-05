import type { Entry, Leaf } from "#types/catalog.types";
import {
    JOURNAL_SHAPE,
    MOVED_TITLE,
    journalFieldNotObject,
    malformedJournal,
} from "#configuration/strings/catalog.strings";
import type { Journal, JournalRef, Tombstone } from "#types/journal.types";
import { localAddress, movedIndex, retabbedAddress } from "#core/resolvers/catalog.resolver";
import { INDEX_KIND } from "#configuration/constants/catalog.constants";
import { RETIRED_TABS } from "#configuration/constants/tree.constants";
import { isRecord } from "#core/selectors/base.selector";

const MOVED_REF = "api:moved";
const MOVED_COLUMNS = ["ref", "json", "to"] as const;
const TITLE_SEPARATOR = "\u0000";

export const EMPTY_JOURNAL: Journal = { moved: {}, refs: {} };

const isText = function isText(value: unknown): value is string {
    return typeof value === "string";
};

const isJournalRef = function isJournalRef(value: unknown): value is JournalRef {
    return isRecord(value) && [value["fingerprint"], value["json"], value["kind"], value["title"]].every(isText);
};

const isTombstone = function isTombstone(value: unknown): value is Tombstone {
    return isRecord(value) && isText(value["json"]) && (value["to"] === null || isText(value["to"]));
};

const recordOf = function recordOf<T>(
    value: unknown,
    guard: (item: unknown) => item is T,
    key: string,
): Record<string, T> {
    if (!isRecord(value)) {
        throw new TypeError(journalFieldNotObject(key));
    }
    const bad = Object.entries(value).filter(([, item]) => !guard(item));
    if (bad.length > 0) {
        throw new TypeError(
            malformedJournal(
                key,
                bad.map(([ref]) => ref),
            ),
        );
    }
    return Object.fromEntries(Object.entries(value).filter((pair): pair is [string, T] => guard(pair[1])));
};

export const parseJournal = function parseJournal(text: string): Journal {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed)) {
        throw new TypeError(JOURNAL_SHAPE);
    }
    return {
        moved: recordOf(parsed["moved"], isTombstone, "moved"),
        refs: recordOf(parsed["refs"], isJournalRef, "refs"),
    };
};

interface CurrentRefs {
    readonly byJson: ReadonlyMap<string, string>;
    readonly byTitle: ReadonlyMap<string, readonly string[]>;
}

const retabbedOf = function retabbedOf(address: string, current: CurrentRefs): string | null {
    for (const [from, to] of Object.entries(RETIRED_TABS)) {
        const json = retabbedAddress(address, from, to);
        const ref = json === null ? undefined : current.byJson.get(json);
        if (ref !== undefined) {
            return ref;
        }
    }
    return null;
};

const replacementOf = function replacementOf(gone: JournalRef, current: CurrentRefs): string | null {
    const retabbed = retabbedOf(gone.json, current);
    if (retabbed !== null) {
        return retabbed;
    }
    const candidates = current.byTitle.get(gone.kind + TITLE_SEPARATOR + gone.title) ?? [];
    return candidates.length === 1 ? (candidates[0] ?? null) : null;
};

const settledOf = function settledOf(tombstone: Tombstone, current: CurrentRefs): Tombstone {
    return tombstone.to === null ? { json: tombstone.json, to: retabbedOf(tombstone.json, current) } : tombstone;
};

export const updateJournal = function updateJournal(
    previous: Journal,
    entries: readonly Entry[],
    site: string,
): Journal {
    const refs: Record<string, JournalRef> = Object.fromEntries(
        entries.map((entry) => [
            entry.ref,
            {
                fingerprint: entry.fingerprint,
                json: localAddress(site, entry.json),
                kind: entry.kind,
                title: entry.title,
            },
        ]),
    );
    const byTitle = new Map<string, string[]>();
    const byJson = new Map<string, string>();
    for (const [ref, held] of Object.entries(refs)) {
        const key = held.kind + TITLE_SEPARATOR + held.title;
        byTitle.set(key, [...(byTitle.get(key) ?? []), ref]);
        byJson.set(held.json, ref);
    }
    const current: CurrentRefs = { byJson, byTitle };
    const kept = Object.entries(previous.moved)
        .filter(([ref]) => !(ref in refs))
        .map(([ref, tombstone]): [string, Tombstone] => [ref, settledOf(tombstone, current)]);
    const vanished = Object.entries(previous.refs)
        .filter(([ref]) => !(ref in refs))
        .map(([ref, gone]): [string, Tombstone] => [ref, { json: gone.json, to: replacementOf(gone, current) }]);
    return { moved: Object.fromEntries([...kept, ...vanished]), refs };
};

export const movedLeaf = function movedLeaf(journal: Journal, site: string): Leaf {
    const current = new Map(Object.entries(journal.refs));
    const rows = Object.entries(journal.moved)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([ref, tombstone]) => {
            const to = tombstone.to === null ? undefined : current.get(tombstone.to);
            return [ref, site + tombstone.json, to === undefined ? null : site + to.json];
        });
    return {
        data: { columns: MOVED_COLUMNS, count: rows.length, ref: MOVED_REF, rows, title: MOVED_TITLE },
        identity: {
            address: movedIndex(),
            href: null,
            kind: INDEX_KIND,
            ref: MOVED_REF,
            summary: null,
            title: MOVED_TITLE,
        },
        markdown: null,
    };
};
