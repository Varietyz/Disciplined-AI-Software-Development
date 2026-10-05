import {
    PROBE_FAILED,
    PROBE_LOGGED,
    PROBE_NO_RECORD,
    PROBE_PASSED,
    PROBE_STALE,
} from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import type { ProbeFetcher, ProbeResponse } from "@banes-lab/deploy/types/deployment.types.ts";
import { describe, expect, it } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import { Buffer } from "node:buffer";
import { LOG_SIZE_COMMAND } from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import { digestOf } from "@govlab/content-fingerprint";
import { probeSite } from "@banes-lab/deploy/core/steps/probe.step.ts";

const SITE = "https://x.test";
const JSON_TYPE = "application/json";
const MARKDOWN_TYPE = "text/markdown; charset=utf-8";
const LEAF_BODY = '{"title":"Leaf"}';
const COLUMNS = ["ref", "kind", "title", "summary", "json", "markdown", "bytes", "fingerprint"];
const RECORD_REF = "architecture:big-ball";
const RECORD_TITLE = "Big Ball";

const json = function json(value: unknown): ProbeResponse {
    return { body: JSON.stringify(value), status: 200, type: JSON_TYPE };
};

const markdown: ProbeResponse = { body: "", status: 200, type: MARKDOWN_TYPE };

const leafEntry = {
    bytes: Buffer.byteLength(LEAF_BODY),
    fingerprint: digestOf(LEAF_BODY),
    json: `${SITE}/json/leaf`,
    markdown: `${SITE}/leaf.md`,
};

const queryAddress = function queryAddress(query: Record<string, string>): string {
    return `GET ${SITE}/q?${new URLSearchParams(query).toString()}`;
};

const QUERY_ANSWERS: readonly string[] = [
    queryAddress({ ref: RECORD_REF }),
    queryAddress({ name: RECORD_TITLE }),
    queryAddress({ q: "big" }),
    queryAddress({ id: "architecture:*" }),
    queryAddress({ walk: RECORD_REF }),
    queryAddress({ collection: "architecture" }),
];

const rowOf = function rowOf(ref: string, title: string): readonly unknown[] {
    return [ref, "index", title, null, leafEntry.json, leafEntry.markdown, leafEntry.bytes, leafEntry.fingerprint];
};

const healthy = function healthy(): Map<string, ProbeResponse> {
    return new Map([
        [`GET ${SITE}/json/api`, json({ pages: [leafEntry] })],
        [
            `GET ${SITE}/json/api/ids`,
            json({ shards: [{ json: `${SITE}/json/api/ids/api` }, { json: `${SITE}/json/api/ids/architecture` }] }),
        ],
        [`GET ${SITE}/json/api/ids/api`, json({ columns: COLUMNS, rows: [rowOf("api:leaf", "Leaf")] })],
        [`GET ${SITE}/json/api/ids/architecture`, json({ columns: COLUMNS, rows: [rowOf(RECORD_REF, RECORD_TITLE)] })],
        [`GET ${leafEntry.json}`, { body: LEAF_BODY, status: 200, type: JSON_TYPE }],
        [`HEAD ${leafEntry.markdown}`, markdown],
        [`GET ${SITE}/api`, markdown],
        [`GET ${SITE}/json/api/`, json({})],
        [`OPTIONS ${SITE}/json/api`, { body: "", status: 204, type: "" }],
        [`GET ${SITE}/json/api/no-such-address`, { body: "{}", status: 404, type: JSON_TYPE }],
        [`GET ${SITE}/no-such-address.md`, { body: "", status: 404, type: MARKDOWN_TYPE }],
        [`GET ${SITE}/no-such-address.txt`, { body: "", status: 404, type: "text/plain; charset=utf-8" }],
        [`GET ${SITE}/no-such-address.json`, { body: "{}", status: 404, type: JSON_TYPE }],
        [`GET ${SITE}/json/records`, json({})],
        [`GET ${SITE}/json/source`, json({})],
        [`GET ${SITE}/q?ref=api:route`, json({})],
        [`GET ${SITE}/q`, { body: "{}", status: 400, type: JSON_TYPE }],
        [`GET ${SITE}/json/api?probe=1`, { body: "{}", status: 400, type: JSON_TYPE }],
        ...QUERY_ANSWERS.map((address): [string, ProbeResponse] => [address, json({})]),
    ]);
};

const fetcherOf = function fetcherOf(site: Map<string, ProbeResponse>): ProbeFetcher {
    return async (url, method) => {
        await Promise.resolve();
        return site.get(`${method} ${url}`) ?? { body: "", status: 404, type: "text/html" };
    };
};

const quietServer = function quietServer(): ReturnType<typeof fakeShell> {
    return fakeShell((command) => ok(command.startsWith(LOG_SIZE_COMMAND) ? "120" : ""));
};

describe("probeSite", () => {
    it("passes a site that answers every checked address as the catalog records it", async () => {
        const journal = fakeJournal();
        await probeSite(journal, SITE, quietServer(), fetcherOf(healthy()));
        expect(journal.lines).toContain(PROBE_PASSED);
    });

    it("runs every query operation against a record the catalog lists", async () => {
        const site = healthy();
        site.delete(queryAddress({ q: "big" }));
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            `${SITE}/q?q=big answered 404`,
        );
    });

    it("fails when the catalog lists no record to query", async () => {
        const site = healthy();
        site.set(`GET ${SITE}/json/api/ids/architecture`, json({ columns: COLUMNS, rows: [] }));
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(PROBE_NO_RECORD);
    });

    it("fails with the lines the server wrote to its error log during the check", async () => {
        const sizes = ["120", "180"];
        const server = fakeShell((command) => {
            if (command.startsWith(LOG_SIZE_COMMAND)) {
                return ok(sizes.shift() ?? "180");
            }
            return ok("2026/10/02 18:14:27 [error] js call exception: TypeError: not a function\n");
        });
        const fetcher = fetcherOf(healthy());
        await expect(probeSite(fakeJournal(), SITE, server, fetcher)).rejects.toThrow(
            `${PROBE_LOGGED}2026/10/02 18:14:27 [error] js call exception`,
        );
        expect(server.commands.at(-1)).toContain("tail -c +121 ");
    });

    it("names an address that answers the wrong status or type", async () => {
        const site = healthy();
        site.set(`GET ${SITE}/api`, { body: "", status: 301, type: "text/html" });
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(PROBE_FAILED);
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            `${SITE}/api answered 301 text/html instead of 200 text/markdown.`,
        );
    });

    it("names a missing text or JSON address that answers with a page instead of its own type", async () => {
        const site = healthy();
        site.set(`GET ${SITE}/no-such-address.txt`, { body: "", status: 404, type: "text/html" });
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            `${SITE}/no-such-address.txt answered 404 text/html instead of 404 text/plain.`,
        );
        site.delete(`GET ${SITE}/no-such-address.json`);
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            `${SITE}/no-such-address.json answered 404 text/html instead of 404 application/json.`,
        );
    });

    it("names a leaf whose served bytes differ from its catalog record", async () => {
        const site = healthy();
        site.set(`GET ${leafEntry.json}`, { body: '{"title":"Changed"}', status: 200, type: JSON_TYPE });
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            leafEntry.json + PROBE_STALE,
        );
    });

    it("names a catalog folder that does not answer with its index", async () => {
        const site = healthy();
        site.delete(`GET ${SITE}/json/records`);
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            `${SITE}/json/records answered 404 text/html instead of 200 application/json.`,
        );
    });

    it("names a Markdown leaf the server does not answer", async () => {
        const site = healthy();
        site.delete(`HEAD ${leafEntry.markdown}`);
        await expect(probeSite(fakeJournal(), SITE, quietServer(), fetcherOf(site))).rejects.toThrow(
            leafEntry.markdown,
        );
    });
});
