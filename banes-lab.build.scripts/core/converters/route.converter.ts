import type { DiscoveredRoute, Discovery } from "#types/site.types";
import type { RouteLedger, RouteStamp, RouteStamps } from "#types/route.types";
import { isoDate, renderRoutePayload } from "#core/formatters/site.formatter";
import { ledgerNotObject, malformedStamps } from "#configuration/strings/route.strings";
import { fingerprintOf } from "@govlab/content-fingerprint";

const SAMPLE_LENGTH = 80;

const hasText = function hasText(value: object, key: string): boolean {
    return key in value && typeof Reflect.get(value, key) === "string";
};

const isStamp = function isStamp(value: unknown): value is RouteStamp {
    return typeof value === "object" && value !== null && hasText(value, "fingerprint") && hasText(value, "lastmod");
};

export const parseLedger = function parseLedger(text: string): RouteLedger {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new TypeError(ledgerNotObject(text.slice(0, SAMPLE_LENGTH)));
    }
    const malformed = Object.entries(parsed).filter((entry) => !isStamp(entry[1]));
    if (malformed.length > 0) {
        throw new TypeError(malformedStamps(malformed.map(([path]) => path)));
    }
    return Object.fromEntries(
        Object.entries(parsed).filter((entry): entry is [string, RouteStamp] => isStamp(entry[1])),
    );
};

export const latestStamp = function latestStamp(ledger: RouteLedger): string | null {
    const dates = Object.values(ledger).flatMap((stamp) => (stamp === undefined ? [] : [stamp.lastmod]));
    return dates.toSorted((left, right) => left.localeCompare(right)).at(-1) ?? null;
};

export const routeFingerprint = function routeFingerprint(discovery: Discovery, route: DiscoveredRoute): string {
    return fingerprintOf([route.title, route.description, route.markdown, renderRoutePayload(discovery, route)]);
};

export const stampRoutes = function stampRoutes(
    ledger: RouteLedger,
    discovery: Discovery,
    moment: Date,
): { readonly ledger: RouteLedger; readonly stamps: RouteStamps } {
    const today = isoDate(moment);
    const next: Record<string, RouteStamp> = {};
    const stamps = new Map<string, string>();
    for (const route of discovery.routes) {
        const fingerprint = routeFingerprint(discovery, route);
        const held = ledger[route.path];
        const lastmod = held?.fingerprint === fingerprint ? held.lastmod : today;
        next[route.path] = { fingerprint, lastmod };
        stamps.set(route.path, lastmod);
    }
    return { ledger: next, stamps };
};
