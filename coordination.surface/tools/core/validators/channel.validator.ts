import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { fieldOf, tryParse } from "../readers/json.reader.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";

import { channelScopeOf } from "../reporters/rule.reporter.ts";
import { resolve } from "node:path";

interface Channel {
    readonly name: string;
    readonly scope: string;
    readonly declared: string | null;
}

interface StaleChannel extends Channel {
    readonly removable: boolean;
}

const isChannelBody = function isChannelBody(parsed: unknown): boolean {
    if (typeof parsed !== "object" || parsed === null) {
        return false;
    }
    return fieldOf(parsed, "tool") === "govern" && fieldOf(parsed, "authoritative") === false;
};

const declaredScope = function declaredScope(parsed: unknown): string | null {
    const value = typeof parsed === "object" && parsed !== null ? fieldOf(parsed, "scope") : null;
    return typeof value === "string" && value.length > 0 ? value : null;
};

const channelOf = function channelOf(dir: string, entry: string): Channel[] {
    const scope = channelScopeOf(entry);
    const parsed = scope === null ? null : tryParse(readFileSync(resolve(dir, entry), "utf8"))?.value;
    return scope !== null && isChannelBody(parsed) ? [{ declared: declaredScope(parsed), name: entry, scope }] : [];
};

export const channelsIn = function channelsIn(repoRoot: string): Channel[] {
    const dir = resolve(repoRoot, GENERATED_DIR);
    return existsSync(dir) ? readdirSync(dir).flatMap((entry) => channelOf(dir, entry)) : [];
};

export const staleChannels = function staleChannels(
    repoRoot: string,
    resolves: (scope: string) => boolean,
): StaleChannel[] {
    return channelsIn(repoRoot)
        .filter((channel) => !resolves(channel.scope))
        .map((channel) => ({ ...channel, removable: true }));
};

interface NamingBreach {
    readonly name: string;
    readonly named: string;
    readonly declared: string;
}

interface ScopeCollision {
    readonly scope: string;
    readonly names: readonly string[];
}

export const misnamedChannels = function misnamedChannels(repoRoot: string): NamingBreach[] {
    const out: NamingBreach[] = [];

    for (const channel of channelsIn(repoRoot)) {
        if (channel.declared === null || channel.declared === channel.scope) {
            continue;
        }
        out.push({ declared: channel.declared, name: channel.name, named: channel.scope });
    }

    return out;
};

export const collidingScopes = function collidingScopes(repoRoot: string): ScopeCollision[] {
    const byScope = new Map<string, string[]>();

    for (const channel of channelsIn(repoRoot)) {
        if (channel.declared === null) {
            continue;
        }

        const held = byScope.get(channel.declared) ?? [];
        held.push(channel.name);
        byScope.set(channel.declared, held);
    }

    const out: ScopeCollision[] = [];
    for (const [scope, names] of byScope) {
        if (names.length < 2) {
            continue;
        }
        out.push({ names: names.toSorted((left, right) => left.localeCompare(right, "en")), scope });
    }

    return out;
};

export const removeChannel = function removeChannel(repoRoot: string, name: string): void {
    rmSync(resolve(repoRoot, GENERATED_DIR, name), { force: true });
};
