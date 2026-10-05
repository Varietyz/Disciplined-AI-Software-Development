import { NOT_A_SCHEMA, missingSchema } from "@banes-lab/build-scripts/configuration/strings/catalog.strings.ts";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { schemaFindings } from "@banes-lab/build-scripts/core/validators/catalog.kind.validator.ts";
import { schemaShapeDefects } from "@banes-lab/build-scripts/core/validators/schema.validator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const LEAF = "json/records/architecture/a.json";
const RECORD_SCHEMA = "json/api/schema/record.json";
const MISSHAPEN = { properties: { ref: { type: "string" } }, type: "string" };
let root = "";

const put = function put(file: string, value: unknown): void {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeVerbatim(join(root, file), JSON.stringify(value));
};

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "schema-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("schemaFindings", () => {
    it("checks a schema file against the dialect's shape rules and asks no schema of the schema kind", () => {
        put(LEAF, { ref: "architecture:a" });
        put(RECORD_SCHEMA, { properties: { ref: { type: "string" } }, required: ["ref"], type: "object" });
        expect(schemaFindings(root, [LEAF, RECORD_SCHEMA], new Set([LEAF, RECORD_SCHEMA]))).toStrictEqual([]);
    });

    it("reports a misshapen schema once, on the schema file", () => {
        put(RECORD_SCHEMA, MISSHAPEN);
        const findings = schemaFindings(root, [RECORD_SCHEMA], new Set([RECORD_SCHEMA]));
        expect(findings).toStrictEqual(
            schemaShapeDefects(MISSHAPEN, "$").map((message) => ({ file: RECORD_SCHEMA, message })),
        );
        expect(findings).not.toHaveLength(0);
    });

    it("reports a schema file that holds no object, and a kind published with no schema", () => {
        put(RECORD_SCHEMA, ["not", "a", "schema"]);
        put(LEAF, { ref: "architecture:a" });
        expect(schemaFindings(root, [RECORD_SCHEMA, LEAF], new Set([RECORD_SCHEMA, LEAF]))).toStrictEqual([
            { file: RECORD_SCHEMA, message: NOT_A_SCHEMA },
            { file: RECORD_SCHEMA, message: missingSchema("record") },
        ]);
        expect(schemaFindings(root, [LEAF], new Set([LEAF]))).toStrictEqual([
            { file: RECORD_SCHEMA, message: missingSchema("record") },
        ]);
    });
});
