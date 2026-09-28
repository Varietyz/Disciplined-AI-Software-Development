import {
    changedSince,
    degradedHead,
    degradedInsideRecords,
    firstSnapshot,
    surfaceUnchanged,
} from "../strings/board.strings.ts";

import { existsSync, readFileSync } from "node:fs";
import {
    pruneUnkeyedSnapshots,
    readSnapshot,
    recordDelivered,
    writeSnapshot,
} from "../registries/snapshot.registry.ts";
import { READ_BUDGET_CHARS } from "../constants/board.constants.ts";
import { diffLines } from "../formatters/text.formatter.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";
import { itemSpans } from "../resolvers/sweep.resolver.ts";

const keysAddressing = function keysAddressing(source: string, agent: string): string[] {
    const out: string[] = [];
    for (const span of itemSpans(source)) {
        if (span.to.length > 0 && !span.to.includes(agent)) {
            continue;
        }
        out.push(span.key);
    }
    return out;
};

const OPEN_MARKER = "┌";

const fencedTexts = function fencedTexts(source: string): Set<string> {
    const lines = source.split("\n");
    const flags = fencedFlags(source);
    const out = new Set<string>();

    for (let index = 0; index < lines.length; index += 1) {
        if (flags[index] !== true) {
            continue;
        }
        const text = (lines[index] ?? "").trim();
        if (text.length > 0) {
            out.add(text);
        }
    }

    return out;
};

const degradedDelivery = function degradedDelivery(
    changes: readonly string[],
    agent: string,
    target: string,
    size: number,
    specimens: ReadonlySet<string>,
): string {
    const moved = changes.flatMap((line) => {
        const at = line.indexOf(OPEN_MARKER);
        const fence = at === -1 ? "" : line.slice(at).trim();
        return at === -1 || specimens.has(fence) ? [] : [`  ${line.slice(0, 1)} ${fence}\n`];
    });

    const head = degradedHead(agent, changes.length, size, target);

    if (moved.length === 0) {
        return `${head}${degradedInsideRecords(target)}`;
    }

    return `${head}${moved.join("")}`;
};

export const changesSince = function changesSince(
    repoRoot: string,
    absolute: string,
    agent: string,
    target: string,
): string {
    if (!existsSync(absolute)) {
        return "";
    }

    const now = readFileSync(absolute, "utf8");
    const seen = readSnapshot(repoRoot, agent, target);
    writeSnapshot(repoRoot, agent, target, now);
    pruneUnkeyedSnapshots(repoRoot);

    if (seen === null) {
        return firstSnapshot(agent);
    }

    const changes = diffLines(seen, now);
    recordDelivered(repoRoot, agent, keysAddressing(now, agent));
    if (changes.length === 0) {
        return surfaceUnchanged(target, agent);
    }

    const lines = [changedSince(agent, changes.length)];
    for (const line of changes) {
        lines.push(`  ${line}\n`);
    }

    const rendered = lines.join("");
    if (rendered.length <= READ_BUDGET_CHARS) {
        return rendered;
    }

    return degradedDelivery(changes, agent, target, rendered.length, fencedTexts(now));
};
