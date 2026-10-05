import type { ExactReference, ReferenceChannel, ReferenceSite } from "#types/anatomy.types";
import type { CodeTarget } from "@banes-lab/web/types/code.types.js";
import { isRecord } from "#core/selectors/base.selector";

const CHANNELS: readonly ReferenceChannel[] = ["spans", "strings", "words"];
const EXACT_KINDS: ReadonlySet<CodeTarget["kind"]> = new Set(["definition", "file", "folder", "record"]);
const STRINGS_CHANNEL: ReferenceChannel = "strings";
const QUOTES: readonly string[] = ['"', "'", "`"];

const isExact = function isExact(target: CodeTarget | undefined): boolean {
    return target !== undefined && EXACT_KINDS.has(target.kind);
};

const byEntry = function byEntry(left: ExactReference, right: ExactReference): number {
    return (
        left.path.localeCompare(right.path) ||
        left.channel.localeCompare(right.channel) ||
        left.text.localeCompare(right.text)
    );
};

export const exactReferencesOf = function exactReferencesOf(
    sites: ReadonlyMap<string, ReferenceSite>,
): readonly ExactReference[] {
    return [...sites]
        .flatMap(([path, site]) =>
            CHANNELS.flatMap((channel) =>
                Object.entries(site.references[channel])
                    .filter(([, target]) => isExact(target))
                    .map(([text]) => ({ channel, path, text })),
            ),
        )
        .toSorted(byEntry);
};

const stillWritten = function stillWritten(source: string, entry: ExactReference): boolean {
    if (entry.channel !== STRINGS_CHANNEL) {
        return source.includes(entry.text);
    }
    return QUOTES.some((quote) => source.includes(quote + entry.text + quote));
};

const targetOf = function targetOf(entry: ExactReference, site: ReferenceSite): CodeTarget | undefined {
    const targets = site.references[entry.channel];
    return Object.hasOwn(targets, entry.text) ? targets[entry.text] : undefined;
};

export const lostReferences = function lostReferences(
    baseline: readonly ExactReference[],
    sites: ReadonlyMap<string, ReferenceSite>,
): readonly ExactReference[] {
    return baseline.filter((entry) => {
        const site = sites.get(entry.path);
        if (site === undefined || !stillWritten(site.source, entry)) {
            return false;
        }
        return !isExact(targetOf(entry, site));
    });
};

export const currentCandidates = function currentCandidates(
    entry: ExactReference,
    sites: ReadonlyMap<string, ReferenceSite>,
): readonly string[] {
    const site = sites.get(entry.path);
    const target = site === undefined ? undefined : targetOf(entry, site);
    if (target?.kind !== "candidates") {
        return [];
    }
    return target.locations.map((location) =>
        location.line === null ? location.file : `${location.file}:${String(location.line)}`,
    );
};

const isChannel = function isChannel(value: unknown): value is ReferenceChannel {
    return CHANNELS.some((channel) => channel === value);
};

const isEntry = function isEntry(value: unknown): value is ExactReference {
    return (
        isRecord(value) &&
        isChannel(value["channel"]) &&
        typeof value["path"] === "string" &&
        typeof value["text"] === "string"
    );
};

export const parseBaseline = function parseBaseline(text: string): readonly ExactReference[] {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
};
