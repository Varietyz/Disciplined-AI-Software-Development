import { printPlan, printReport } from "@govlab/quality/core/formatters/dependency.formatter.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const EMPTY_PLAN = { ecosystems: [], emitters: [], eslintPlugins: [], npmDeps: [], systemInstructions: [] };

test("printPlan renders an empty plan with its placeholders", () => {
    const text = printPlan(EMPTY_PLAN);
    assert.ok(text.includes("(none)"));
    assert.ok(text.endsWith("\n"));
});

test("printPlan lists the system tools and ESLint plugins a plan carries", () => {
    const text = printPlan({
        ...EMPTY_PLAN,
        eslintPlugins: ["sonarjs"],
        systemInstructions: [{ system: "pipx install ruff", tool: "ruff" }],
    });
    assert.ok(text.includes("pipx install ruff"));
    assert.ok(text.includes("sonarjs"));
});

test("printReport counts the installed packages and lists each system tool", () => {
    const text = printReport({ installed: ["a", "b"], systemInstructions: [{ system: "brew install x", tool: "x" }] });
    assert.ok(text.includes("2"));
    assert.ok(text.includes("brew install x"));
});
