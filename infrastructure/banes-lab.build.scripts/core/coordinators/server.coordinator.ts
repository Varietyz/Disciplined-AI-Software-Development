import type { DevServer, Supervisor } from "#types/server.types";
import type { Readable, Writable } from "node:stream";
import type { ChildProcess } from "node:child_process";
import { prefixLines } from "#core/formatters/server.formatter";
import process from "node:process";
import { serverExitLine } from "#configuration/strings/server.strings";
import spawn from "cross-spawn";
import { terminateTree } from "#core/adapters/server.adapter";

const WINDOWS = "win32";

const relay = function relay(source: Readable | null, target: Writable, label: string): void {
    let carry = "";
    source?.on("data", (chunk: unknown) => {
        const prefixed = prefixLines(label, carry, String(chunk));
        ({ carry } = prefixed);
        for (const line of prefixed.lines) {
            target.write(line);
        }
    });
};

const pipeLabeled = function pipeLabeled(child: ChildProcess, label: string): void {
    relay(child.stdout, process.stdout, label);
    relay(child.stderr, process.stderr, label);
};

export const startServer = function startServer(server: DevServer): ChildProcess {
    const child = spawn("npx", ["vite", "--config", server.config, ...server.args], {
        detached: process.platform !== WINDOWS,
        stdio: ["ignore", "pipe", "pipe"],
    });
    pipeLabeled(child, server.label);
    return child;
};

export const stopAll = function stopAll(children: readonly ChildProcess[]): void {
    for (const child of children) {
        if (child.pid !== undefined && child.exitCode === null) {
            terminateTree(child.pid);
        }
    }
};

export const createSupervisor = function createSupervisor(
    children: readonly ChildProcess[],
    exitWith: (code: number) => void,
): Supervisor {
    const state = { stopped: false };
    return {
        stop: (code) => {
            if (state.stopped) {
                return;
            }
            state.stopped = true;
            stopAll(children);
            exitWith(code);
        },
        stopped: () => state.stopped,
    };
};

export const superviseServers = function superviseServers(servers: readonly DevServer[]): Supervisor {
    const started = servers.map((server) => ({ child: startServer(server), server }));
    const supervisor = createSupervisor(
        started.map(({ child }) => child),
        (code) => {
            process.exitCode = code;
        },
    );
    for (const { child, server } of started) {
        child.on("exit", (code) => {
            if (!supervisor.stopped()) {
                process.stderr.write(serverExitLine(server.label, code));
            }
            supervisor.stop(code ?? 1);
        });
    }
    return supervisor;
};
