import { AT_FIELD, TO_FIELD } from "../formatters/board.formatter.ts";
import { existsSync, readdirSync } from "node:fs";

import type { ItemSpan } from "../types/sweep.types.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";
import { resolve } from "node:path";
import { surfacePrefix } from "../../../config/surface.config.ts";

const SEPARATOR = "\\";

const CANONICAL_SEPARATOR = "/";

export const surfaceEntries = function surfaceEntries(repoRoot: string): string[] {
    const prefix = surfacePrefix();
    const root = resolve(repoRoot, prefix);
    if (!existsSync(root)) {
        return [];
    }

    return readdirSync(root, { encoding: "utf8", recursive: true }).map((entry) =>
        prefix.length === 0 ? entry : `${prefix}${CANONICAL_SEPARATOR}${entry}`,
    );
};

export const openVenues = function openVenues(
    entries: readonly string[],
    archiveRoot: string,
    suffix: string,
): string[] {
    return entries
        .map((entry) => entry.split(SEPARATOR).join(CANONICAL_SEPARATOR))
        .filter((entry) => entry.endsWith(suffix))
        .filter((entry) => !entry.startsWith(archiveRoot));
};

const OPEN = "┌─── AGENT ";

const CLOSE = "└─── END AGENT ";

const EVERYONE = "*";

const fieldOf = function fieldOf(line: string, field: string): string {
    const at = line.indexOf(field);
    if (at === -1) {
        return "";
    }

    const rest = line.slice(at + field.length);
    const end = rest.indexOf(" ");
    return end === -1 ? rest.trim() : rest.slice(0, end).trim();
};

const keyOf = function keyOf(line: string, marker: string): string {
    const at = line.indexOf(marker);
    if (at === -1) {
        return "";
    }

    const rest = line.slice(at + marker.length).trim();
    const end = rest.indexOf(" ");
    return end === -1 ? rest : rest.slice(0, end);
};

type OpenSpans = Map<string, { at: number; to: string[]; from: number }>;

const openSpan = function openSpan(open: OpenSpans, trimmed: string, index: number): void {
    const key = keyOf(trimmed, OPEN);
    if (!key.includes("-")) {
        return;
    }

    const stamp = Number(fieldOf(trimmed, AT_FIELD));
    const to = fieldOf(trimmed, TO_FIELD);
    open.set(key, {
        at: Number.isFinite(stamp) ? stamp : 0,
        from: index,
        to: to.length === 0 || to === EVERYONE ? [] : to.split(","),
    });
};

const closeSpan = function closeSpan(open: OpenSpans, trimmed: string, index: number): ItemSpan | null {
    const key = keyOf(trimmed, CLOSE);
    const held = open.get(key);
    if (held === undefined) {
        return null;
    }

    open.delete(key);
    return { agent: key.slice(0, key.indexOf("-")), at: held.at, from: held.from, key, through: index, to: held.to };
};

export const itemSpans = function itemSpans(source: string): ItemSpan[] {
    const out: ItemSpan[] = [];
    const fenced = fencedFlags(source);
    const open: OpenSpans = new Map();

    for (const [index, line] of source.split("\n").entries()) {
        const trimmed = fenced[index] === true ? "" : line.trim();
        if (trimmed.startsWith(OPEN)) {
            openSpan(open, trimmed, index);
        }

        const closed = trimmed.startsWith(CLOSE) ? closeSpan(open, trimmed, index) : null;
        if (closed !== null) {
            out.push(closed);
        }
    }

    return out;
};

export const seenItems = function seenItems(spans: readonly ItemSpan[]): ItemSpan[] {
    const latest = new Map<string, number>();
    for (const span of spans) {
        const held = latest.get(span.agent) ?? 0;
        if (span.at > held) {
            latest.set(span.agent, span.at);
        }
    }

    return spans.filter((span) => {
        if (span.at === 0 || span.to.length === 0) {
            return false;
        }
        return span.to.every((reader) => (latest.get(reader) ?? 0) > span.at);
    });
};

export const spanText = function spanText(source: string, span: ItemSpan): string {
    return source
        .split("\n")
        .slice(span.from, span.through + 1)
        .join("\n");
};

export const withoutSpans = function withoutSpans(source: string, spans: readonly ItemSpan[]): string {
    const dropped = new Set<number>();
    for (const span of spans) {
        for (let line = span.from; line <= span.through; line += 1) {
            dropped.add(line);
        }
    }

    return source
        .split("\n")
        .filter((_line, index) => !dropped.has(index))
        .join("\n");
};

const bodyOf = function bodyOf(lines: readonly string[], from: number, through: number): string {
    const out: string[] = [];
    for (let index = from; index <= through && index < lines.length; index += 1) {
        const line = (lines[index] ?? "").trim();
        if (line.startsWith(OPEN) || line.startsWith(CLOSE)) {
            continue;
        }
        if (line.length > 0) {
            out.push(line);
        }
    }
    return out.join("\n");
};

export const duplicateTwinOf = function duplicateTwinOf(source: string, key: string): string | null {
    const lines = source.split("\n");
    const spans = itemSpans(source);

    const target = spans.find((span) => span.key === key);
    if (target === undefined) {
        return null;
    }

    const body = bodyOf(lines, target.from, target.through);
    if (body.length === 0) {
        return null;
    }

    const twin = spans.find(
        (span) => span.key !== key && span.agent === target.agent && bodyOf(lines, span.from, span.through) === body,
    );
    return twin?.key ?? null;
};
