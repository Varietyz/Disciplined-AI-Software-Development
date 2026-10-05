import type {
    CatalogRow,
    Journal,
    ProbeExpectation,
    ProbeFetcher,
    ProbeResponse,
    Shell,
} from "#types/deployment.types";
import { LINE_BREAK, PATH_SEPARATOR } from "#configuration/constants/deployment.constants";
import {
    PROBE_ANSWERED,
    PROBE_FAILED,
    PROBE_INSTEAD,
    PROBE_LOGGED,
    PROBE_NO_RECORD,
    PROBE_PASSED,
    PROBE_STALE,
    PROBING_SITE,
} from "#configuration/strings/deployment.strings";
import {
    QUERY_ENDPOINT,
    RECORDS_SEGMENT,
    SOURCE_SEGMENT,
} from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";
import { idsIndex, siteIndex } from "@banes-lab/build-scripts/core/resolvers/catalog.resolver.ts";
import { logSize, loggedSince } from "#core/adapters/server.adapter";
import { rootRows, shardAddresses, shardRow } from "#core/converters/catalog.converter";
import { Buffer } from "node:buffer";
import { COLLECTION_TITLES } from "@banes-lab/web/strings/catalog.strings";
import { JSON_ROUTE } from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";
import { absolutePath } from "@ssot/paths";
import { digestOf } from "@govlab/content-fingerprint";
import { errorLogOf } from "#core/converters/nginx.converter";
import { fetchProbe } from "#core/adapters/site.adapter";
import { readFileSync } from "node:fs";

const JSON_TYPE = "application/json";
const MARKDOWN_TYPE = "text/markdown";
const TEXT_TYPE = "text/plain";
const ANY_TYPE = "";
const GET = "GET";
const HEAD = "HEAD";
const OPTIONS = "OPTIONS";
const OK = 200;
const NO_CONTENT = 204;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const QUERY_PROBE = "?ref=api:route";
const STATIC_QUERY_PROBE = "?probe=1";
const MISSING_SEGMENT = "no-such-address";
const MARKDOWN_SUFFIX = ".md";
const TEXT_SUFFIX = ".txt";
const JSON_SUFFIX = ".json";
const SPACE = " ";
const STOP = ".";
const QUERY_MARK = "?";
const REF_SEPARATOR = ":";
const WILDCARD = "*";
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const ENCODING = "utf8";

const answer = function answer(status: number, type: string): string {
    return (String(status) + SPACE + type).trim();
};

const mismatch = function mismatch(expected: ProbeExpectation, response: ProbeResponse): string | null {
    if (response.status === expected.status && response.type.startsWith(expected.type)) {
        return null;
    }
    const found = answer(response.status, response.type);
    return expected.address + PROBE_ANSWERED + found + PROBE_INSTEAD + answer(expected.status, expected.type) + STOP;
};

const expectation = function expectation(
    address: string,
    method: string,
    status: number,
    type: string,
): ProbeExpectation {
    return { address, method, status, type };
};

const behaviors = function behaviors(site: string): readonly ProbeExpectation[] {
    const root = siteIndex();
    const route = (root.markdown ?? MARKDOWN_SUFFIX).slice(0, -MARKDOWN_SUFFIX.length);
    return [
        expectation(site + route, GET, OK, MARKDOWN_TYPE),
        expectation(site + root.json + PATH_SEPARATOR, GET, OK, JSON_TYPE),
        expectation(site + root.json, OPTIONS, NO_CONTENT, ANY_TYPE),
        expectation(site + root.json + PATH_SEPARATOR + MISSING_SEGMENT, GET, NOT_FOUND, JSON_TYPE),
        expectation(site + PATH_SEPARATOR + MISSING_SEGMENT + MARKDOWN_SUFFIX, GET, NOT_FOUND, MARKDOWN_TYPE),
        expectation(site + PATH_SEPARATOR + MISSING_SEGMENT + TEXT_SUFFIX, GET, NOT_FOUND, TEXT_TYPE),
        expectation(site + PATH_SEPARATOR + MISSING_SEGMENT + JSON_SUFFIX, GET, NOT_FOUND, JSON_TYPE),
        expectation(site + JSON_ROUTE + RECORDS_SEGMENT, GET, OK, JSON_TYPE),
        expectation(site + JSON_ROUTE + SOURCE_SEGMENT, GET, OK, JSON_TYPE),
        expectation(site + QUERY_ENDPOINT + QUERY_PROBE, GET, OK, JSON_TYPE),
        expectation(site + QUERY_ENDPOINT, GET, BAD_REQUEST, JSON_TYPE),
        expectation(site + root.json + STATIC_QUERY_PROBE, GET, BAD_REQUEST, JSON_TYPE),
    ];
};

const groupOf = function groupOf(ref: string): string {
    return ref.slice(0, ref.indexOf(REF_SEPARATOR));
};

const firstWord = function firstWord(title: string): string {
    let word = "";
    for (const character of title.toLowerCase()) {
        if (!LETTERS.includes(character)) {
            break;
        }
        word += character;
    }
    return word;
};

const queryProbes = function queryProbes(
    site: string,
    rows: readonly CatalogRow[],
): readonly ProbeExpectation[] | null {
    const record = rows.find((row) => row.ref !== null && COLLECTION_TITLES.has(groupOf(row.ref)));
    if (record?.ref === null || record?.ref === undefined || record.title === null) {
        return null;
    }
    const group = groupOf(record.ref);
    const queries = [
        { ref: record.ref },
        { name: record.title },
        { q: firstWord(record.title) },
        { id: group + REF_SEPARATOR + WILDCARD },
        { walk: record.ref },
        { collection: group },
    ];
    return queries.map((query) =>
        expectation(site + QUERY_ENDPOINT + QUERY_MARK + new URLSearchParams(query).toString(), GET, OK, JSON_TYPE),
    );
};

const parsed = function parsed(response: ProbeResponse): unknown {
    return response.status === OK ? JSON.parse(response.body) : null;
};

const isStale = function isStale(row: CatalogRow, response: ProbeResponse): boolean {
    if (response.status !== OK) {
        return false;
    }
    return Buffer.byteLength(response.body) !== row.bytes || digestOf(response.body) !== row.fingerprint;
};

const rowProblems = async function rowProblems(row: CatalogRow, fetcher: ProbeFetcher): Promise<readonly string[]> {
    const json = await fetcher(row.json, GET);
    const markdown = row.markdown === null ? null : await fetcher(row.markdown, HEAD);
    const found = [
        mismatch(expectation(row.json, GET, OK, JSON_TYPE), json),
        isStale(row, json) ? row.json + PROBE_STALE : null,
        markdown === null || row.markdown === null
            ? null
            : mismatch(expectation(row.markdown, HEAD, OK, MARKDOWN_TYPE), markdown),
    ];
    return found.filter((problem): problem is string => problem !== null);
};

const behaviorProblem = async function behaviorProblem(
    expected: ProbeExpectation,
    fetcher: ProbeFetcher,
): Promise<string | null> {
    return mismatch(expected, await fetcher(expected.address, expected.method));
};

export const probeSite = async function probeSite(
    journal: Journal,
    site: string,
    shell: Shell,
    fetcher: ProbeFetcher = fetchProbe,
): Promise<void> {
    journal.log(PROBING_SITE);
    const log = errorLogOf(readFileSync(absolutePath("app.nginxSite"), ENCODING));
    const offset = await logSize(shell, log);
    const rootAddress = site + siteIndex().json;
    const idsAddress = site + idsIndex().json;
    const [root, ids] = await Promise.all([fetcher(rootAddress, GET), fetcher(idsAddress, GET)]);
    const shards = await Promise.all(shardAddresses(parsed(ids)).map(async (address) => fetcher(address, GET)));
    const rows = [
        ...rootRows(parsed(root)),
        ...shards.flatMap((shard) => {
            const row = shardRow(parsed(shard));
            return row === null ? [] : [row];
        }),
    ];
    const queries = queryProbes(site, rows);
    const heads = [
        mismatch(expectation(rootAddress, GET, OK, JSON_TYPE), root),
        mismatch(expectation(idsAddress, GET, OK, JSON_TYPE), ids),
        queries === null ? PROBE_NO_RECORD : null,
        ...(await Promise.all(
            [...behaviors(site), ...(queries ?? [])].map(async (expected) => behaviorProblem(expected, fetcher)),
        )),
    ];
    const rowFindings = (await Promise.all(rows.map(async (row) => rowProblems(row, fetcher)))).flat();
    const logged = await loggedSince(shell, log, offset);
    const problems = [
        ...heads.filter((problem): problem is string => problem !== null),
        ...rowFindings,
        ...(logged.length === 0 ? [] : [PROBE_LOGGED + logged]),
    ];
    if (problems.length > 0) {
        throw new Error(PROBE_FAILED + LINE_BREAK + problems.join(LINE_BREAK));
    }
    journal.mark(PROBE_PASSED);
};
