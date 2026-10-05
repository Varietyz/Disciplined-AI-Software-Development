import assert from "node:assert/strict";
import { runInstall } from "@govlab/quality/core/adapters/dependency.adapter.ts";
import { test } from "vitest";

const PLAN = {
    ecosystems: ["python"],
    emitters: [],
    eslintPlugins: [],
    npmDeps: ["some-package"],
    systemInstructions: [{ system: "pipx install ruff", tool: "ruff" }],
};

test("runInstall installs nothing on a dry run and still reports the system tools", () => {
    const report = runInstall(PLAN, { dryRun: true, root: "." });
    assert.deepEqual(report.installed, []);
    assert.deepEqual(report.systemInstructions, PLAN.systemInstructions);
});
