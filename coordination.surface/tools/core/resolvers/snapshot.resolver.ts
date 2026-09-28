import type { UnreadInterval } from "../types/snapshot.types.ts";
import { itemSpans } from "./sweep.resolver.ts";
import { unreadItems } from "../strings/snapshot.strings.ts";

export const unreadSince = function unreadSince(
    current: string,
    snapshot: string | null,
    agent: string,
): UnreadInterval | null {
    if (snapshot === null) {
        return null;
    }

    const held = new Set(itemSpans(snapshot).map((span) => span.key));
    const keys: string[] = [];
    const agents = new Set<string>();
    let earliest = 0;
    let latest = 0;

    for (const span of itemSpans(current)) {
        if (span.agent === agent || held.has(span.key)) {
            continue;
        }

        keys.push(span.key);
        agents.add(span.agent);
        if (span.at > 0 && (earliest === 0 || span.at < earliest)) {
            earliest = span.at;
        }
        if (span.at > latest) {
            latest = span.at;
        }
    }

    if (keys.length === 0) {
        return null;
    }

    return { agents: [...agents].toSorted((left, right) => left.localeCompare(right)), earliest, keys, latest };
};

const SECOND = 1000;

export const unreadEcho = function unreadEcho(interval: UnreadInterval | null, target: string): string {
    if (interval === null) {
        return "";
    }

    const span = interval.latest > interval.earliest ? Math.round((interval.latest - interval.earliest) / SECOND) : 0;

    return unreadItems(interval.agents, target, span, interval.keys);
};
