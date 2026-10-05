import type { ChildProcess } from "node:child_process";
import { execFileSync } from "node:child_process";
import process from "node:process";

const WINDOWS = "win32";
const SIGNAL_EXIT_BASE = 128;
const TERMINAL_SIGNALS: Readonly<Record<string, number>> = { SIGHUP: 1, SIGINT: 2, SIGTERM: 15 };

const live = new Set<ChildProcess>();
const hook = { installed: false };

const stillRunning = function stillRunning(child: ChildProcess): boolean {
    return child.pid !== undefined && child.exitCode === null && child.signalCode === null;
};

export const killTree = function killTree(child: ChildProcess): void {
    if (!stillRunning(child)) {
        return;
    }
    if (process.platform !== WINDOWS) {
        child.kill("SIGKILL");
        return;
    }
    try {
        execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } catch (error) {
        if (!child.kill("SIGKILL") && stillRunning(child)) {
            throw error;
        }
    }
};

export const supervisedCount = function supervisedCount(): number {
    return live.size;
};

export const reapSupervised = function reapSupervised(): number {
    const reaped = [...live].filter(stillRunning).length;
    for (const child of live) {
        killTree(child);
    }
    live.clear();
    return reaped;
};

const hookParentExit = function hookParentExit(): void {
    if (hook.installed) {
        return;
    }
    hook.installed = true;
    process.on("exit", () => {
        reapSupervised();
    });
    for (const [signal, number] of Object.entries(TERMINAL_SIGNALS)) {
        process.once(signal, () => {
            reapSupervised();
            process.exit(SIGNAL_EXIT_BASE + number);
        });
    }
};

export const superviseChild = function superviseChild(child: ChildProcess): void {
    hookParentExit();
    live.add(child);
    const release = (): void => {
        live.delete(child);
    };
    child.on("close", release);
    child.on("error", release);
};
