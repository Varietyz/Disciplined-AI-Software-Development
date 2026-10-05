import {
    AMERICAN_WORDS,
    IZE_STEMS,
    IZE_SUFFIXES,
    PLURAL_IES,
    PLURAL_KEPT_AFTER,
    PLURAL_MINIMUM_LENGTH,
    PLURAL_SUFFIX,
    SPELLING_PREFIXES,
    normalizeWord,
} from "@govlab/constants";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { basename, dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { scriptNameOf, scriptTextOf } from "@banes-lab/deploy/core/converters/nginx.converter.ts";
import { writeCanonicalJson, writeVerbatim } from "@govlab/canonical-write";
import { QUERY_FUZZY } from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";
import { absolutePath } from "@ssot/paths";
import { nameKeyOf } from "@govlab/context";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const SITE = "https://example.test";
const DUAL = "architecture:dual-write";
const DUAL_TITLE = "Dual Write";
const OUTBOX = "architecture:outbox-pattern";
const DUAL_JSON = `${SITE}/json/records/architecture/dual-write`;
const OUTBOX_JSON = `${SITE}/json/records/architecture/outbox-pattern`;
const CHAPTER = "chapter:/method/start#the-loop";
const CHAPTER_JSON = `${SITE}/json/method/start/the-loop`;
const FILE = "anatomy:file-core-loop-ts";
const FILE_JSON = `${SITE}/json/source/build/core/loop.ts`;

interface Reply {
    readonly body: Record<string, unknown>;
    readonly headers: Record<string, string>;
    readonly status: number;
}

interface QueryModule {
    readonly markdownCanonical?: (request: object) => string;
    readonly missing?: (request: object) => void;
    readonly nameKeyOf?: (text: string, slugRules: object, wordRules: object) => string;
    readonly normalizeWord?: (word: string, rules: object) => string;
    readonly q: (request: object) => void;
}

let root = "";
let query: QueryModule | null = null;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const fieldOf = function fieldOf(value: unknown, key: string): unknown {
    return isRecord(value) ? value[key] : undefined;
};

const isQueryModule = function isQueryModule(value: unknown): value is QueryModule {
    return typeof fieldOf(value, "q") === "function";
};

const recordOf = function recordOf(text: string): Record<string, unknown> {
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : {};
};

const pending: Promise<void>[] = [];

const put = function put(path: string, value: object): void {
    const file = join(root, `${path}.json`);
    mkdirSync(dirname(file), { recursive: true });
    pending.push(writeCanonicalJson(file, value));
};

const DUAL_ROW = {
    bytes: 1,
    fingerprint: "a",
    json: DUAL_JSON,
    kind: "anti-pattern",
    markdown: null,
    ref: DUAL,
    summary: "Two stores written without a shared transaction",
    title: DUAL_TITLE,
};

const OUTBOX_ROW = {
    bytes: 1,
    fingerprint: "b",
    json: OUTBOX_JSON,
    kind: "pattern",
    markdown: null,
    ref: OUTBOX,
    summary: null,
    title: "Outbox Pattern",
};

const CHAPTER_ROW = {
    bytes: 1,
    fingerprint: "c",
    json: CHAPTER_JSON,
    kind: "section",
    markdown: null,
    ref: CHAPTER,
    summary: null,
    title: "The loop",
};

const FILE_ROW = {
    bytes: 1,
    fingerprint: "d",
    json: FILE_JSON,
    kind: "file",
    markdown: null,
    ref: FILE,
    summary: null,
    title: "core/loop.ts",
};

const ROW_COLUMNS = ["ref", "kind", "title", "summary", "json", "markdown", "bytes", "fingerprint"] as const;

const WORD_RULES = {
    americanWords: AMERICAN_WORDS,
    fuzzyMinimum: 4,
    izeStems: IZE_STEMS,
    izeSuffixes: IZE_SUFFIXES,
    pluralIes: PLURAL_IES,
    pluralKeptAfter: [...PLURAL_KEPT_AFTER],
    pluralMinimum: PLURAL_MINIMUM_LENGTH,
    pluralSuffix: PLURAL_SUFFIX,
    spellingPrefixes: SPELLING_PREFIXES,
};

const cellsOf = function cellsOf(row: typeof CHAPTER_ROW | typeof DUAL_ROW): readonly unknown[] {
    return ROW_COLUMNS.map((column) => row[column]);
};

const plant = function plant(): void {
    put("/json/api/query", {
        fuzzy: QUERY_FUZZY,
        index: `${SITE}/json/api/query`,
        limits: { defaultLimit: 50, depth: 3, limit: 200 },
        messages: {
            badDepth: "The parameter depth takes a whole number from 1 to {max}.",
            badNumber: "The parameter {name} takes a whole number, and limit is at most {max}.",
            emptyValue: "The parameter {name} is empty.",
            gone: "The entry was removed.",
            manyOperations: "One request runs one operation.",
            missing: "Nothing is served at this address.",
            noOperation: "Name one operation. The parameters are listed at {index}.",
            notFound: "Nothing in the catalog matches this request.",
            unknownKind: "The catalog holds no entries of the kind {name}. The kinds are listed at {ids}.",
            unknownParameter: "This endpoint does not read the parameter {name}.",
            unknownRelation: "Walk does not follow a relation named {name}.",
        },
        relations: ["negated-by", "requires"],
        site: SITE,
    });
    put("/json/api/ids", {
        kinds: ["anti-pattern", "file", "pattern", "section"],
        shards: [
            { group: "architecture", json: `${SITE}/json/api/ids/architecture` },
            { group: "chapter", json: `${SITE}/json/api/ids/chapter` },
            { group: "anatomy", json: `${SITE}/json/api/ids/anatomy` },
        ],
    });
    put("/json/api/ids/architecture", { columns: ROW_COLUMNS, rows: [cellsOf(DUAL_ROW), cellsOf(OUTBOX_ROW)] });
    put("/json/api/ids/chapter", { columns: ROW_COLUMNS, rows: [cellsOf(CHAPTER_ROW)] });
    put("/json/api/ids/anatomy", { columns: ROW_COLUMNS, rows: [cellsOf(FILE_ROW)] });
    put("/json/method/start/the-loop", {
        relations: [{ links: [{ json: DUAL_JSON, label: DUAL_TITLE, ref: DUAL }], relation: "links-to" }],
    });
    put("/json/source/build/core/loop.ts", {
        relations: [{ links: [{ json: CHAPTER_JSON, label: "The loop", ref: CHAPTER }], relation: "evidence-for" }],
    });
    put("/json/api/resolve", {
        shards: { du: `${SITE}/json/api/slugs/du`, i: `${SITE}/json/api/slugs/i` },
        slugRules: { characters: "abcdefghijklmnopqrstuvwxyz0123456789", separator: "-" },
    });
    put("/json/api/slugs/du", { slugs: { "dual-write": [DUAL] } });
    put("/json/api/slugs/i", { slugs: { idempotency: [OUTBOX] } });
    put("/json/api/search", {
        kinds: { records: { count: 2, json: `${SITE}/json/api/search/records` } },
        rules: { ...WORD_RULES, wordCharacters: "abcdefghijklmnopqrstuvwxyz0123456789-" },
    });
    put("/json/api/search/records", {
        columns: ["ref", "title", "position"],
        parts: [`${SITE}/json/api/search/records/_1`, `${SITE}/json/api/search/records/_2`],
        rows: [],
        shards: {
            o: `${SITE}/json/api/search/records/o`,
            pa: `${SITE}/json/api/search/records/pa`,
            w: `${SITE}/json/api/search/records/w`,
        },
    });
    put("/json/api/search/records/_1", { columns: ["ref", "title", "position"], rows: [[DUAL, DUAL_TITLE, null]] });
    put("/json/api/search/records/_2", {
        columns: ["ref", "title", "position"],
        rows: [[OUTBOX, "Outbox Pattern", null]],
    });
    put("/json/api/search/records/w", { postings: { write: [[0, 2]] } });
    put("/json/api/search/records/o", { postings: { outbox: [[1, 1]] } });
    put("/json/api/search/records/pa", {
        postings: {
            pattern: [
                [1, 1],
                [0, 1],
            ],
        },
    });
    put("/json/records/architecture/dual-write", {
        relations: [{ links: [{ json: OUTBOX_JSON, label: "Outbox Pattern", ref: OUTBOX }], relation: "negated-by" }],
    });
    put("/json/api/facets/architecture/kind/anti-pattern", { entries: [{ ref: DUAL }] });
    put("/json/api/records/architecture", { entries: [{ ref: DUAL }, { ref: OUTBOX }] });
    put("/json/api/moved", {
        columns: ["ref", "json", "to"],
        rows: [["architecture:old", `${SITE}/json/records/architecture/old`, DUAL_JSON]],
    });
    mkdirSync(join(root, "pag"), { recursive: true });
    writeVerbatim(join(root, "index.html"), "<html></html>");
    writeVerbatim(join(root, "pag.html"), "<html></html>");
    writeVerbatim(join(root, "pag", "guide.html"), "<html></html>");
};

const ask = function ask(args: Record<string, string>): Reply {
    const headers: Record<string, string> = {};
    let status = 0;
    let body = "";
    const request = {
        args,
        headersOut: headers,
        return: (code: number, text: string): void => {
            status = code;
            body = text;
        },
        variables: { document_root: root },
    };
    query?.q(request);
    return { body: recordOf(body), headers, status };
};

const firstOf = function firstOf(reply: Reply): unknown {
    const { results } = reply.body;
    return Array.isArray(results) ? results.at(0) : undefined;
};

const matchOf = function matchOf(name: string): unknown {
    const reply = ask({ name });
    return fieldOf(firstOf(reply), "match");
};

const refsOf = function refsOf(reply: Reply): readonly unknown[] {
    const { results } = reply.body;
    return Array.isArray(results) ? results.map((result: unknown) => fieldOf(result, "ref")) : [];
};

beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "query-"));
    plant();
    await Promise.all(pending);
    const source = join(absolutePath("app.nginxScripts"), "catalog.entrypoint.ts");
    const deployed = join(root, scriptNameOf(basename(source)));
    writeVerbatim(deployed, scriptTextOf(basename(source), readFileSync(source, "utf8")));
    const loaded: unknown = await import(pathToFileURL(deployed).href);
    const exported = fieldOf(loaded, "default");
    query = isQueryModule(exported) ? exported : null;
});

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("the query endpoint", () => {
    it("answers a ref, a name, an id pattern and a facet filter with the rows the catalog lists", () => {
        expect(refsOf(ask({ ref: DUAL }))).toStrictEqual([DUAL]);
        expect(refsOf(ask({ name: DUAL_TITLE }))).toStrictEqual([DUAL]);
        expect(refsOf(ask({ name: "dual writes" }))).toStrictEqual([DUAL]);
        expect(refsOf(ask({ id: "architecture:*" }))).toStrictEqual([DUAL, OUTBOX]);
        expect(refsOf(ask({ collection: "architecture", kind: "anti-pattern" }))).toStrictEqual([DUAL]);
        expect(refsOf(ask({ collection: "architecture" }))).toStrictEqual([DUAL, OUTBOX]);
        expect(ask({ ref: DUAL }).headers["Content-Type"]).toBe("application/json");
    });

    it("marks a name found as typed exact, and one found only after folding plural or spelling normalized", () => {
        expect(matchOf(DUAL_TITLE)).toBe("exact");
        expect(matchOf("dual writes")).toBe("normalized");
    });

    it("finds a name one edit away, then a name that shares a stem, and marks both fuzzy", () => {
        expect(refsOf(ask({ name: "dual wirte" }))).toStrictEqual([DUAL]);
        expect(matchOf("dual wirte")).toBe("fuzzy");
        expect(refsOf(ask({ name: "idempotent" }))).toStrictEqual([OUTBOX]);
        expect(refsOf(ask({ name: "idem" }))).toStrictEqual([]);
    });

    it("answers a missed name with the nearest keys of its first letter as suggestions", () => {
        const reply = ask({ name: "dxyz" });
        expect(reply.status).toBe(404);
        expect(reply.body["suggestions"]).toStrictEqual(["dual-write"]);
        expect(ask({ q: "zzzz" }).body["suggestions"]).toBeUndefined();
    });

    it("searches whole words, prefixes and words one edit away, ranked by how often they occur", () => {
        expect(refsOf(ask({ q: "writes" }))).toStrictEqual([DUAL]);
        const results: unknown = ask({ q: "writes" }).body["results"];
        expect(Array.isArray(results) ? results.at(0) : undefined).toStrictEqual({ ...DUAL_ROW, score: 2 });
        expect(refsOf(ask({ q: "out" }))).toStrictEqual([OUTBOX]);
        expect(refsOf(ask({ q: "outbax" }))).toStrictEqual([OUTBOX]);
        expect(ask({ q: "write outbox" }).status).toBe(404);
    });

    it("folds every word exactly as the shared normalizer does, from the rules the catalog publishes", () => {
        const stemmed = IZE_STEMS.flatMap((stem) => Object.keys(IZE_SUFFIXES).map((suffix) => stem + suffix));
        const corpus = [
            ...Object.keys(AMERICAN_WORDS),
            ...stemmed,
            "registries",
            "classes",
            "status",
            "buses",
            "rise",
            "wise",
            "four",
            "constructor",
            "Normalisations",
            "decentralisation",
            "denormalised",
            "precise",
            "compromise",
            "mislabelled",
            "unhonoured",
        ];
        const local = query?.normalizeWord;
        expect(local).toBeTypeOf("function");
        const mismatched = corpus.filter((word) => local?.(word, WORD_RULES) !== normalizeWord(word));
        expect(mismatched).toStrictEqual([]);
    });

    it("keys every name exactly as the build keys it, from the rules the catalog publishes", () => {
        const corpus = [
            "Single Responsibility Principle (SRP)",
            "questionCoverageView",
            "createLinker",
            "OAuth2Client",
            "package.json",
            "Bounded Contexts",
            "Normalisation Rules",
            "  ",
        ];
        const slugRules = { characters: "abcdefghijklmnopqrstuvwxyz0123456789", separator: "-" };
        const local = query?.nameKeyOf;
        expect(local).toBeTypeOf("function");
        expect(corpus.filter((phrase) => local?.(phrase, slugRules, WORD_RULES) !== nameKeyOf(phrase))).toStrictEqual(
            [],
        );
    });

    it("counts two neighboring letters swapped as one edit", () => {
        expect(refsOf(ask({ q: "otubox" }))).toStrictEqual([OUTBOX]);
    });

    it("orders results that tie on score and position by title", () => {
        expect(refsOf(ask({ q: "pattern" }))).toStrictEqual([DUAL, OUTBOX]);
    });

    it("keeps only the kind a request names", () => {
        expect(refsOf(ask({ id: "architecture:*", kind: "pattern" }))).toStrictEqual([OUTBOX]);
        expect(refsOf(ask({ kind: "anti-pattern", q: "pattern" }))).toStrictEqual([DUAL]);
    });

    it("walks relation links from a record, giving each edge the row of its target and its hop", () => {
        const reply = ask({ depth: "2", walk: DUAL });
        expect(reply.body["results"]).toStrictEqual([{ ...OUTBOX_ROW, from: DUAL, hop: 1, relation: "negated-by" }]);
    });

    it("walks from a chapter and from a source file, since every leaf kind publishes its relations", () => {
        expect(refsOf(ask({ walk: CHAPTER }))).toStrictEqual([DUAL]);
        const reply = ask({ depth: "2", walk: FILE });
        expect(reply.body["results"]).toStrictEqual([
            { ...CHAPTER_ROW, from: FILE, hop: 1, relation: "evidence-for" },
            { ...DUAL_ROW, from: CHAPTER, hop: 2, relation: "links-to" },
        ]);
    });

    it("redirects a moved address to its replacement, and answers 404 for an address never published", () => {
        const reply = function reply(uri: string): { readonly body: string; readonly status: number } {
            let status = 0;
            let body = "";
            query?.missing?.({
                headersOut: {},
                return: (code: number, text: string): void => {
                    status = code;
                    body = text;
                },
                uri,
                variables: { document_root: root },
            });
            return { body, status };
        };
        expect(reply("/json/records/architecture/old")).toStrictEqual({ body: DUAL_JSON, status: 308 });
        expect(reply("/json/records/architecture/never").status).toBe(404);
    });

    it("names the page a Markdown twin stands for as its canonical, and nothing for a catalog-only leaf", () => {
        const canonical = function canonical(uri: string): string | undefined {
            return query?.markdownCanonical?.({ uri, variables: { document_root: root, host: "banes-lab.com" } });
        };
        expect(canonical("/pag.md")).toBe('<https://banes-lab.com/pag>; rel="canonical"');
        expect(canonical("/pag/guide.md")).toBe('<https://banes-lab.com/pag/guide>; rel="canonical"');
        expect(canonical("/index.md")).toBe('<https://banes-lab.com/>; rel="canonical"');
        expect(canonical("/anatomy/build/folder-build-core.md")).toBe("");
        expect(canonical("/pag")).toBe("");
    });

    it("refuses a malformed request with a 400 that names its reason as a code", () => {
        const codeOf = function codeOf(args: Record<string, string>): unknown {
            const reply = ask(args);
            return reply.status === 400 ? reply.body["code"] : reply.status;
        };
        expect(codeOf({})).toBe("noOperation");
        expect(codeOf({ q: "write", ref: DUAL })).toBe("manyOperations");
        expect(codeOf({ ref: DUAL, sort: "title" })).toBe("unknownParameter");
        expect(ask({ ref: DUAL, sort: "title" }).body["error"]).toBe("This endpoint does not read the parameter sort.");
        expect(codeOf({ limit: "500", ref: DUAL })).toBe("badNumber");
        expect(codeOf({ name: "" })).toBe("emptyValue");
        expect(codeOf({ depth: "0", walk: DUAL })).toBe("badDepth");
        expect(codeOf({ depth: "4", walk: DUAL })).toBe("badDepth");
        expect(codeOf({ relation: "follows", walk: DUAL })).toBe("unknownRelation");
        expect(codeOf({ ref: DUAL, relation: "requires" })).toBe("unknownParameter");
        expect(codeOf({ kind: "galaxy", q: "write" })).toBe("unknownKind");
        expect(ask({ kind: "galaxy", q: "write" }).body["error"]).toContain(`${SITE}/json/api/ids`);
        expect(ask({ ref: "architecture:nothing" }).body["code"]).toBe("notFound");
    });
});
