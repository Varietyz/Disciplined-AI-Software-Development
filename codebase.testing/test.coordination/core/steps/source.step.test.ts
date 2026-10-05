import { cleanSources, cleanStage, codeFiles, isVendored } from "coordination-surface/tools/core/steps/source.step.ts";
import { describe, it } from "vitest";
import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

type Spans = Parameters<typeof isVendored>[0];
type Options = Parameters<typeof cleanStage>[0];

const SOURCE = `${surfacePrefix()}/tools/core/runners/probe.runner.ts`;

const COMMENTED = "// explains the constant\nconst held = 1;\n";

const spansOf = function spansOf(text: string): Spans {
    return [{ end: text.length, start: 0, text }];
};

const withSource = function withSource(check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-clean-"));
    try {
        mkdirSync(dirname(join(root, SOURCE)), { recursive: true });
        writeVerbatim(join(root, SOURCE), COMMENTED);
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("isVendored", () => {
    it("holds a file whose leading comment is an attribution", () => {
        assert.equal(isVendored(spansOf("MIT License")), true);
        assert.equal(isVendored(spansOf("a note")), false);
        assert.equal(isVendored([]), false);
    });
});

describe("codeFiles and cleanSources", () => {
    it("list the code files under the governed roots, and report the comments a clean would strip without writing", () => {
        withSource((root) => {
            assert.ok(codeFiles(root).includes(SOURCE));
            const cleaned = cleanSources(root, false);
            assert.deepEqual(
                cleaned.files.map((file) => [file.path, file.removed]),
                [[SOURCE, 1]],
            );
            assert.equal(readFileSync(join(root, SOURCE), "utf8"), COMMENTED);
            cleanSources(root, true);
            assert.ok(!readFileSync(join(root, SOURCE), "utf8").includes("explains"));
        });
    });
});

describe("cleanStage", () => {
    it("records a bypassed stage, and otherwise counts the files it cleaned", () => {
        withSource((root) => {
            const options: Options = {
                authoritative: false,
                bypass: [],
                fix: false,
                repoRoot: root,
                scanned: 0,
                scope: "whole",
            };
            assert.equal(cleanStage({ ...options, bypass: ["clean"] }).stage.bypassed, true);
            assert.equal(cleanStage(options).stage.healed, 1);
        });
    });
});
