import { describe, expect, it } from "vitest";
import {
    killTree,
    reapSupervised,
    superviseChild,
    supervisedCount,
} from "@govlab/quality/core/lifecycle/invocation.lifecycle.ts";
import process from "node:process";
import { spawn } from "node:child_process";

const IDLE_MS = 60_000;
const REAP_ATTEMPTS = 40;
const REAP_INTERVAL_MS = 50;
const ALIVE_PROBE = 0;

const idleChild = (): ReturnType<typeof spawn> =>
    spawn(process.execPath, ["-e", `setTimeout(() => {}, ${String(IDLE_MS)})`], { stdio: "ignore" });

const isAlive = (pid: number): boolean => {
    try {
        process.kill(pid, ALIVE_PROBE);
        return true;
    } catch {
        return false;
    }
};

const delay = async (ms: number): Promise<void> =>
    new Promise<void>((done) => {
        setTimeout(done, ms);
    });

const settle = async (pid: number, attempt = 0): Promise<boolean> => {
    if (!isAlive(pid)) {
        return false;
    }
    if (attempt >= REAP_ATTEMPTS) {
        return true;
    }
    await delay(REAP_INTERVAL_MS);
    return settle(pid, attempt + 1);
};

const closedChild = async (): Promise<ReturnType<typeof spawn>> => {
    const child = spawn(process.execPath, ["-e", ""], { stdio: "ignore" });
    superviseChild(child);
    await new Promise<void>((done) => {
        child.on("close", () => {
            done();
        });
    });
    return child;
};

describe("the invocation lifecycle terminates launched processes", () => {
    it("killTree terminates a running child", async () => {
        const child = idleChild();
        const pid = child.pid ?? 0;
        expect(pid).toBeGreaterThan(0);
        killTree(child);
        await expect(settle(pid)).resolves.toBe(false);
    });

    it("reapSupervised kills every child still running under supervision", async () => {
        const first = idleChild();
        const second = idleChild();
        superviseChild(first);
        superviseChild(second);
        const pids = [first.pid ?? 0, second.pid ?? 0];
        expect(reapSupervised()).toBe(2);
        await expect(Promise.all(pids.map(async (pid) => settle(pid)))).resolves.toEqual([false, false]);
    });

    it("releases a child that exited on its own, so the registry does not grow unbounded", async () => {
        expect(supervisedCount()).toBe(0);
        await closedChild();
        expect(supervisedCount()).toBe(0);
        expect(reapSupervised()).toBe(0);
    });
});
