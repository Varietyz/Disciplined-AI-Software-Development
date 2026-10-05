import type { JobResult, JobSpec } from "#types/index.types";
import { jobFailed, jobTimedOut } from "#configuration/strings/invocation.strings";
import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

const TIMEOUT_CODE = 124;
const FAILURE_CODE = 1;
const KILL_SIGNAL = "SIGKILL";

export const runInherited = function runInherited(script: string, args: readonly string[]): number {
    const outcome = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" });
    return outcome.status ?? FAILURE_CODE;
};

export const superviseJob = async function superviseJob(spec: JobSpec): Promise<JobResult> {
    return new Promise((resolve) => {
        const child = spawn(spec.command, spec.args, { cwd: spec.cwd, stdio: ["ignore", "pipe", "pipe"] });
        const chunks: string[] = [];
        const state = { settled: false, timedOut: false };
        const collect = (buffer: Buffer): void => {
            chunks.push(buffer.toString("utf8"));
        };
        const settle = (code: number): void => {
            if (state.settled) {
                return;
            }
            state.settled = true;
            clearTimeout(timer);
            resolve({ code, label: spec.label, out: chunks.join(""), timedOut: state.timedOut });
        };
        const timer = setTimeout(() => {
            state.timedOut = true;
            chunks.push(jobTimedOut(spec.label, spec.timeoutMs));
            child.kill(KILL_SIGNAL);
            settle(TIMEOUT_CODE);
        }, spec.timeoutMs);
        child.stdout.on("data", collect);
        child.stderr.on("data", collect);
        child.on("error", (error: Error) => {
            chunks.push(jobFailed(spec.label, error.message));
            settle(FAILURE_CODE);
        });
        child.on("close", (code: number | null) => {
            settle(code ?? FAILURE_CODE);
        });
    });
};
