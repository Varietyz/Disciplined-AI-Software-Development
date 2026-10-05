import { DISCOVERY, HOME, TERMS } from "./site.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    latestStamp,
    parseLedger,
    routeFingerprint,
    stampRoutes,
} from "@banes-lab/build-scripts/core/converters/route.converter.ts";

const FIRST = new Date("2026-09-19T14:00:00Z");
const FIRST_DAY = "2026-09-19";
const LATER = new Date("2026-09-22T09:00:00Z");
const PAGES = { ...DISCOVERY, routes: [HOME, TERMS] };

describe("stampRoutes and routeFingerprint", () => {
    it("dates every route on first sight, keeps the date while the content is unchanged, and moves it when the content changes", () => {
        const first = stampRoutes({}, PAGES, FIRST);
        expect(first.stamps.get("/")).toBe(FIRST_DAY);
        expect(first.stamps.get("/terms")).toBe(FIRST_DAY);
        const same = stampRoutes(first.ledger, PAGES, LATER);
        expect(same.stamps.get("/terms")).toBe(FIRST_DAY);
        const edited = { ...PAGES, routes: [HOME, { ...TERMS, markdown: "The terms, revised." }] };
        const changed = stampRoutes(first.ledger, edited, LATER);
        expect(changed.stamps.get("/")).toBe(FIRST_DAY);
        expect(changed.stamps.get("/terms")).toBe("2026-09-22");
        expect(changed.ledger["/terms"]?.fingerprint).toBe(routeFingerprint(edited, edited.routes[1] ?? TERMS));
    });

    it("drops a route that no longer exists from the ledger", () => {
        const first = stampRoutes({}, PAGES, FIRST);
        const fewer = stampRoutes(first.ledger, { ...PAGES, routes: [HOME] }, LATER);
        expect(Object.keys(fewer.ledger)).toStrictEqual(["/"]);
    });
});

describe("parseLedger", () => {
    it("reads well-formed stamps and refuses a ledger with a malformed stamp or of the wrong shape", () => {
        expect(parseLedger('{"/": {"fingerprint": "a", "lastmod": "2026-01-01"}}')).toStrictEqual({
            "/": { fingerprint: "a", lastmod: "2026-01-01" },
        });
        expect(() => parseLedger('{"/": {"fingerprint": "a", "lastmod": "2026-01-01"}, "/x": {"lastmod": 3}}')).toThrow(
            "/x",
        );
        expect(() => parseLedger("[]")).toThrow("route ledger");
    });
});

describe("latestStamp", () => {
    it("gives the newest date the ledger holds, and nothing for an empty ledger", () => {
        const ledger = {
            "/": { fingerprint: "a", lastmod: FIRST_DAY },
            "/terms": { fingerprint: "b", lastmod: "2026-09-22" },
        };
        expect(latestStamp(ledger)).toBe("2026-09-22");
        expect(latestStamp({})).toBeNull();
    });
});
