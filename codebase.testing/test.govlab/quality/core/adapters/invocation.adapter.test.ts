import { commandOutput, commandVersion, spawnTool } from "@govlab/quality/core/adapters/invocation.adapter.ts";
import { expect, test } from "vitest";
import process from "node:process";
import { signalKilled } from "@govlab/quality/core/predicates/failure.predicate.ts";

test("spawnTool runs a binary synchronously and captures its output", () => {
    const result = spawnTool(process.execPath, ["-e", "process.stdout.write('ok')"], { encoding: "utf8" });
    expect(signalKilled(result.status)).toBe(false);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe("ok");
});

test("commandOutput returns a successful command's stdout and throws on a failed one", () => {
    expect(commandOutput(process.execPath, ["-e", "process.stdout.write('rules')"])).toBe("rules");
    expect(() => commandOutput(process.execPath, ["-e", "process.exit(2)"])).toThrow("failed");
});

test("commandVersion reads the first output line and answers unknown for a failed command", () => {
    expect(commandVersion(process.execPath, ["-e", String.raw`process.stdout.write('1.2.3\nmore')`])).toBe("1.2.3");
    expect(commandVersion(process.execPath, ["-e", "process.exit(1)"])).toBe("unknown");
});
