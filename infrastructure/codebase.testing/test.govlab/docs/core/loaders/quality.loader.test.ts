import { afterAll, describe, expect, it } from "vitest";
import { loadConceptIds, loadConceptMap, loadGovernanceDeriver } from "@govlab/docs/core/loaders/quality.loader.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-quality-"));
const RULES = join(root, "rules.json");
const CONCEPTS = join(root, "concepts.json");
writeVerbatim(
    RULES,
    JSON.stringify([
        { canonical: ["dom", "csp"], tool: "govlab-eslint" },
        { canonical: "a11y", tool: "govlab-eslint" },
        { canonical: "ignored", tool: "eslint" },
    ]),
);
writeVerbatim(CONCEPTS, JSON.stringify({ concepts: [{ dimension: "security", id: "csp" }, { id: "no-dimension" }] }));

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("loadGovernanceDeriver", () => {
    it("derives the sorted concepts a lint package's own rules enforce", () => {
        const derive = loadGovernanceDeriver(RULES);
        expect(derive("eslint-plugin")).toStrictEqual(["a11y", "csp", "dom"]);
        expect(derive("stylelint-plugin")).toBeNull();
        expect(derive("unknown-slug")).toBeNull();
    });
});

describe("loadConceptMap and loadConceptIds", () => {
    it("keep only concepts that carry both an id and a dimension", () => {
        expect(loadConceptMap(CONCEPTS)).toStrictEqual(new Map([["csp", { dimension: "security", id: "csp" }]]));
        expect(loadConceptIds(CONCEPTS)).toStrictEqual(new Set(["csp"]));
        expect(loadConceptMap(join(root, "absent.json")).size).toBe(0);
    });
});
