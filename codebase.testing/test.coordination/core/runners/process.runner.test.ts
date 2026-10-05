import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { runTool } from "coordination-surface/tools/core/runners/process.runner.ts";
import { tmpdir } from "node:os";

const CWD = tmpdir();

describe("runTool", () => {
    it("runs npm through the CLI beside the running node, with no shell, and passes on exit 0", () => {
        const result = runTool(CWD, "version", "npm", "npm answers", ["--version"]);
        assert.equal(result.exitCode, 0, result.output);
        assert.equal(result.verdict, "pass");
        assert.equal(result.step, "version");
        assert.equal(result.checks, "npm answers");
    });

    it("fails with the tool's own exit code and output", () => {
        const result = runTool(CWD, "exit", process.execPath, "a failing command", [
            "--input-type=module",
            "--eval",
            "console.error('refused'); process.exitCode = 3;",
        ]);
        assert.equal(result.exitCode, 3);
        assert.equal(result.verdict, "fail");
        assert.ok(result.output.includes("refused"));
    });

    it("fails with the launch error when the tool does not exist", () => {
        const result = runTool(CWD, "missing", "no-such-tool-for-this-probe", "nothing", []);
        assert.equal(result.exitCode, -1);
        assert.equal(result.verdict, "fail");
        assert.ok(result.output.length > 0);
    });
});
