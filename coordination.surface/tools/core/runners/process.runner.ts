import type { Launch, ProcessResult } from "../types/process.types.ts";
import { NODE_CLIS, NPM_CLI_FOLDERS } from "../constants/process.constants.ts";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const nodeCliOf = function nodeCliOf(tool: string): string | undefined {
    const cli = NODE_CLIS[tool];
    if (cli === undefined) {
        return undefined;
    }
    const binDir = dirname(process.execPath);
    const bases = [binDir, dirname(binDir)];
    return bases
        .flatMap((base) => NPM_CLI_FOLDERS.map((folders) => join(base, ...folders, cli)))
        .find((candidate) => existsSync(candidate));
};

const launchOf = function launchOf(tool: string, args: readonly string[]): Launch {
    const cli = nodeCliOf(tool);
    return cli === undefined ? { args, command: tool } : { args: [cli, ...args], command: process.execPath };
};

export const runTool = function runTool(
    cwd: string,
    step: string,
    tool: string,
    checks: string,
    args: readonly string[],
): ProcessResult {
    const launch = launchOf(tool, args);
    const result = spawnSync(launch.command, launch.args, { cwd, encoding: "utf8" });

    const launched = result.error === undefined;
    const output = launched ? `${result.stdout}${result.stderr}`.trim() : String(result.error);
    const exitCode = launched ? (result.status ?? -1) : -1;

    return { checks, exitCode, output, step, tool, verdict: exitCode === 0 ? "pass" : "fail" };
};
