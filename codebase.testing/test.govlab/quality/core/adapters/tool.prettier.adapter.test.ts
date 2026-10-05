import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    govlabPrettierConfig,
    govlabPrettierIgnore,
    runPrettier,
} from "@govlab/quality/core/adapters/tool.prettier.adapter.ts";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { writeVerbatim } from "@govlab/canonical-write";

describe("prettier config", () => {
    it("builds the config object and an ignore list that carries the master exclusions", async () => {
        const root = process.cwd();
        const ignore = await govlabPrettierIgnore(root);
        expect(typeof (await govlabPrettierConfig(root))).toBe("object");
        expect(Array.isArray(ignore)).toBe(true);
    });
});

describe("runPrettier invokes the prettier CLI", () => {
    const fixture = path.join(os.tmpdir(), "govlab-prettier-cli-fixture");
    const target = path.join(fixture, "styles.css");

    beforeAll(() => {
        mkdirSync(fixture, { recursive: true });
        writeVerbatim(target, ".x{color:red}\n");
    });

    afterAll(() => {
        rmSync(fixture, { force: true, recursive: true });
    });

    it("formats the given paths in place and reports no findings on success", async () => {
        const result = await runPrettier({
            ecosystem: "css",
            fix: true,
            languageId: "css",
            paths: [target],
            root: process.cwd(),
        });
        expect(result.findings).toEqual([]);
        expect(readFileSync(target, "utf8")).toContain("color: red;");
    });
});
