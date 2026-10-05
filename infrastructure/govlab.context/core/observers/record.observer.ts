import {
    ATTRIBUTION_KEY,
    INDEX_MARK,
    LABEL_KEYS,
    LIST_MARK,
    PATH_JOINER,
    SOURCE_JOINER,
    WHOLE_RECORD,
} from "#configuration/constants/record.constants";
import type { RecordOrigin, TrackedRecord, UnreadKey, UnreadReason } from "#types/record.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

const childrenOf = function childrenOf(value: unknown, path: string): [Record<string, unknown>, string][] {
    if (isPlainRecord(value)) {
        return [[value, `${path}${PATH_JOINER}`]];
    }
    const elements: unknown[] = Array.isArray(value) ? value : [];
    return elements.filter(isPlainRecord).map((element) => [element, `${path}${LIST_MARK}${PATH_JOINER}`]);
};

const pathsUnder = function pathsUnder(raw: Record<string, unknown>, prefix: string): string[] {
    return Object.entries(raw).flatMap(([key, value]) => {
        const path = `${prefix}${key}`;
        return [path, ...childrenOf(value, path).flatMap(([child, childPrefix]) => pathsUnder(child, childPrefix))];
    });
};

const presentPaths = function presentPaths(raw: Record<string, unknown>): string[] {
    return [...new Set(pathsUnder(raw, ""))];
};

const labelOf = function labelOf(raw: Record<string, unknown>, fallback: string): string {
    for (const key of LABEL_KEYS) {
        const value = raw[key];
        if (typeof value === "string" && value.length > 0) {
            return value;
        }
    }
    return fallback;
};

const isUnread = function isUnread(entry: TrackedRecord, path: string): boolean {
    return !entry.read.has(path) && ![...entry.delegated].some((prefix) => path.startsWith(prefix));
};

export class ReadAudit {
    readonly #collection: string;
    readonly #tracked: TrackedRecord[] = [];
    readonly #dropped: UnreadKey[] = [];
    readonly #origins = new WeakMap<object, RecordOrigin>();
    readonly #attributions = new Set<string>();

    public constructor(collection: string) {
        this.#collection = collection;
    }

    public attribution(tracked: Record<string, unknown>): void {
        const notice = tracked[ATTRIBUTION_KEY];
        if (typeof notice === "string" && notice.length > 0) {
            this.#attributions.add(notice);
        }
    }

    public attributions(): string[] {
        return [...this.#attributions];
    }

    public track(value: Record<string, unknown>, source: string): Record<string, unknown> {
        const raw = this.#release(value);
        const entry: TrackedRecord = {
            delegated: new Set<string>(),
            raw,
            read: new Set<string>(),
            record: `${source}${SOURCE_JOINER}${labelOf(raw, source)}`,
        };
        this.#tracked.push(entry);
        return this.#wrap(raw, "", entry);
    }

    public records(list: unknown, source: string): Record<string, unknown>[] {
        const items: unknown[] = Array.isArray(list) ? list : [];
        return items.flatMap((item, index) => {
            if (isPlainRecord(item)) {
                return [this.track(item, source)];
            }
            this.#drop(`${source}${INDEX_MARK}${String(index)}`, "not-a-record");
            return [];
        });
    }

    public reject(value: unknown, source: string): void {
        const raw = isPlainRecord(value) ? this.#release(value) : null;
        this.#drop(raw === null ? source : `${source}${SOURCE_JOINER}${labelOf(raw, source)}`, "rejected");
    }

    public unread(): UnreadKey[] {
        const unread = this.#tracked.flatMap((entry) =>
            presentPaths(entry.raw)
                .filter((path) => isUnread(entry, path))
                .map((key): UnreadKey => ({
                    collection: this.#collection,
                    key,
                    reason: "unread",
                    record: entry.record,
                })),
        );
        return [...this.#dropped, ...unread];
    }

    #release(value: Record<string, unknown>): Record<string, unknown> {
        const origin = this.#origins.get(value);
        if (origin === undefined) {
            return value;
        }
        origin.entry.delegated.add(origin.prefix);
        return origin.target;
    }

    #drop(record: string, reason: UnreadReason): void {
        this.#dropped.push({ collection: this.#collection, key: WHOLE_RECORD, reason, record });
    }

    #wrap(raw: Record<string, unknown>, prefix: string, entry: TrackedRecord): Record<string, unknown> {
        const proxy = new Proxy(raw, {
            get: (target, key, receiver): unknown => {
                if (typeof key !== "string") {
                    return Reflect.get(target, key, receiver);
                }
                const path = `${prefix}${key}`;
                entry.read.add(path);
                const value = target[key];
                if (isPlainRecord(value)) {
                    return this.#wrap(value, `${path}${PATH_JOINER}`, entry);
                }
                if (Array.isArray(value)) {
                    return value.map((element: unknown) =>
                        isPlainRecord(element)
                            ? this.#wrap(element, `${path}${LIST_MARK}${PATH_JOINER}`, entry)
                            : element,
                    );
                }
                return value;
            },
        });
        this.#origins.set(proxy, { entry, prefix, target: raw });
        return proxy;
    }
}
