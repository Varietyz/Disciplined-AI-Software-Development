import { execFileSync } from "node:child_process";
import { invocationFor } from "#core/resolvers/shell.resolver";
import process from "node:process";

export const runCommand = function runCommand(name: string, args: readonly string[], cwd: string): void {
    const invocation = invocationFor(process.platform, name, args);
    execFileSync(invocation.file, [...invocation.args], { cwd, stdio: "pipe" });
};
