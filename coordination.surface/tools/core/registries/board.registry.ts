import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fieldOf, tryParse } from "../readers/json.reader.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import type { Waiter } from "../types/board.types.ts";

import { resolve } from "node:path";

const WAITERS = `${GENERATED_DIR}/board.waiters.generated.json`;

const isWaiter = function isWaiter(value: unknown): value is Waiter {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const expiresAt = fieldOf(value, "expiresAt");
    return (
        typeof fieldOf(value, "id") === "string" &&
        typeof fieldOf(value, "agent") === "string" &&
        typeof expiresAt === "number"
    );
};

const readWaiters = function readWaiters(source: string): Waiter[] {
    const parsed = tryParse(source)?.value;
    return Array.isArray(parsed) ? parsed.filter(isWaiter) : [];
};

export const waitersPath = function waitersPath(root: string): string {
    return resolve(root, WAITERS);
};

export const currentWaiters = function currentWaiters(root: string, now: number): Waiter[] {
    const path = waitersPath(root);
    if (!existsSync(path)) {
        return [];
    }
    return readWaiters(readFileSync(path, "utf8")).filter((waiter) => waiter.expiresAt > now);
};

export const writeWaiters = function writeWaiters(root: string, waiters: readonly Waiter[]): void {
    mkdirSync(resolve(root, GENERATED_DIR), { recursive: true });
    writeFileSync(waitersPath(root), `${JSON.stringify(waiters, null, 4)}\n`, "utf8");
};

export const releaseWaiter = function releaseWaiter(root: string, id: string, now: number): void {
    writeWaiters(
        root,
        currentWaiters(root, now).filter((waiter) => waiter.id !== id),
    );
};

export const releaseAgent = function releaseAgent(root: string, agent: string, now: number): void {
    writeWaiters(
        root,
        currentWaiters(root, now).filter((waiter) => waiter.agent !== agent),
    );
};
