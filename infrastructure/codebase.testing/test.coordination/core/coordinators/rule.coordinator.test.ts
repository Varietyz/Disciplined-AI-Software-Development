import { describe, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { selectedRules, walkRule } from "coordination-surface/tools/core/coordinators/rule.coordinator.ts";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import { ruleReportName } from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { tmpdir } from "node:os";

type Registered = Parameters<typeof walkRule>[0];
type Run = Parameters<typeof walkRule>[2];
type Options = Parameters<typeof selectedRules>[1];

const registered = function registered(
    id: string,
    stage: Registered["declaration"]["stage"],
    wholeScopeOnly = false,
): Registered {
    return {
        declaration: {
            check: (context) => ({ findings: [], healed: [...context.paths] }),
            extensions: [".md"],
            heals: false,
            invariant: `${id} holds`,
            jurisdiction: "all",
            kinds: [],
            stage,
            wholeScopeOnly,
        },
        id,
        path: `tools/rules/${id}.rule.ts`,
    };
};

const optionsFor = function optionsFor(repoRoot: string, bypass: readonly string[]): Options {
    return { bypass, fix: false, repoRoot, ruleId: null, scope: null, stage: null };
};

const runIn = function runIn(repoRoot: string, bypass: readonly string[], authoritative: boolean): Run {
    return {
        authoritative,
        byJurisdiction: { all: ["a.md", "b.ts"], artifact: [], taxonomy: [] },
        options: optionsFor(repoRoot, bypass),
        read: () => "",
        scope: "whole",
        taxonomy: loadTaxonomy(),
    };
};

const picked = function picked(rules: readonly Registered[], narrowed: Partial<Options>): string[] {
    return selectedRules(rules, { ...optionsFor("", []), ...narrowed }).map((entry) => entry.registered.id);
};

describe("selectedRules", () => {
    it("orders rules by stage and narrows to a requested stage or rule", () => {
        const rules = [registered("meta", "meta"), registered("board", "content"), registered("layout", "structure")];
        assert.deepEqual(picked(rules, {}), ["layout", "board", "meta"]);
        assert.deepEqual(picked(rules, { stage: "content" }), ["board"]);
        assert.deepEqual(picked(rules, { ruleId: "meta" }), ["meta"]);
    });
});

describe("walkRule", () => {
    it("checks a rule over the paths its extensions admit and writes its report, or records it bypassed or incomparable", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-walk-"));
        try {
            const walked = walkRule(registered("board", "content"), "content", runIn(root, [], true));
            assert.deepEqual([walked.bypassed, walked.written], [false, ["a.md"]]);
            const report = join(root, GENERATED_DIR, ruleReportName("board"));
            assert.equal(existsSync(report), true);
            assert.equal(
                walkRule(registered("board", "content"), "content", runIn(root, ["content"], true)).bypassed,
                true,
            );
            assert.equal(
                walkRule(registered("whole", "meta", true), "meta", runIn(root, [], false)).incomparable,
                true,
            );
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
