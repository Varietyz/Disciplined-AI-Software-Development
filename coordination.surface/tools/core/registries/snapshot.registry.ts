import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";

import { GENERATED_DIR } from "../constants/path.constants.ts";
import { safeKey } from "../formatters/text.formatter.ts";

const SNAPSHOT_ROOT = `${GENERATED_DIR}/board.snapshots`;

const FIELD_MARK_TAIL = ".field.generated.txt";

const SNAPSHOT_TAIL = ".snapshot.generated.txt";

const DELIVERED_TAIL = ".delivered.generated.txt";

const snapshotPath = function snapshotPath(repoRoot: string, agent: string, target: string): string {
    return resolve(repoRoot, SNAPSHOT_ROOT, `${agent}.${safeKey(target)}${SNAPSHOT_TAIL}`);
};

const entriesIn = function entriesIn(repoRoot: string): string[] {
    const root = resolve(repoRoot, SNAPSHOT_ROOT);
    return existsSync(root) ? readdirSync(root) : [];
};

const writeText = function writeText(path: string, content: string): void {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf8");
};

export const readSnapshot = function readSnapshot(repoRoot: string, agent: string, target: string): string | null {
    const path = snapshotPath(repoRoot, agent, target);
    return existsSync(path) ? readFileSync(path, "utf8") : null;
};

export const writeSnapshot = function writeSnapshot(
    repoRoot: string,
    agent: string,
    target: string,
    content: string,
): void {
    writeText(snapshotPath(repoRoot, agent, target), content);
};

const fieldMarkPath = function fieldMarkPath(repoRoot: string, agent: string): string {
    return resolve(repoRoot, SNAPSHOT_ROOT, `${agent}${FIELD_MARK_TAIL}`);
};

export const readFieldMark = function readFieldMark(repoRoot: string, agent: string): number {
    const path = fieldMarkPath(repoRoot, agent);
    const held = existsSync(path) ? Number(readFileSync(path, "utf8").trim()) : 0;
    return Number.isFinite(held) ? held : 0;
};

export const writeFieldMark = function writeFieldMark(repoRoot: string, agent: string, at: number): void {
    writeText(fieldMarkPath(repoRoot, agent), String(at));
};

export const unkeyedSnapshots = function unkeyedSnapshots(repoRoot: string): string[] {
    return entriesIn(repoRoot).filter(
        (entry) => entry.endsWith(SNAPSHOT_TAIL) && !entry.slice(0, entry.length - SNAPSHOT_TAIL.length).includes("."),
    );
};

export const pruneUnkeyedSnapshots = function pruneUnkeyedSnapshots(repoRoot: string): string[] {
    const stale = unkeyedSnapshots(repoRoot);
    for (const entry of stale) {
        rmSync(resolve(repoRoot, SNAPSHOT_ROOT, entry), { force: true });
    }
    return stale;
};

export const lastInteraction = function lastInteraction(repoRoot: string, agent: string): number {
    const lead = `${agent}.`;
    const stamps = entriesIn(repoRoot)
        .filter((entry) => entry.startsWith(lead))
        .map((entry) => statSync(resolve(repoRoot, SNAPSHOT_ROOT, entry)).mtimeMs);
    return Math.max(0, ...stamps);
};

const deliveredPath = function deliveredPath(repoRoot: string, agent: string): string {
    return resolve(repoRoot, SNAPSHOT_ROOT, `${agent}${DELIVERED_TAIL}`);
};

export const readDelivered = function readDelivered(repoRoot: string, agent: string): Set<string> {
    const path = deliveredPath(repoRoot, agent);
    if (!existsSync(path)) {
        return new Set();
    }
    return new Set(
        readFileSync(path, "utf8")
            .split("\n")
            .map((line) => line.trim())
            .filter((key) => key.length > 0),
    );
};

export const recordDelivered = function recordDelivered(
    repoRoot: string,
    agent: string,
    keys: readonly string[],
): void {
    const held = readDelivered(repoRoot, agent);
    const fresh = [...new Set(keys)].filter((key) => !held.has(key));
    if (fresh.length === 0) {
        return;
    }

    const path = deliveredPath(repoRoot, agent);
    mkdirSync(dirname(path), { recursive: true });
    appendFileSync(path, fresh.map((key) => `${key}\n`).join(""), "utf8");
};

export const wasDelivered = function wasDelivered(repoRoot: string, agent: string, key: string): boolean {
    return readDelivered(repoRoot, agent).has(key);
};
