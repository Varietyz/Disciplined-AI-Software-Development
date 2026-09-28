import { identifiersIn, memberKey, memberValue, wordFrom } from "../analyzers/source.analyzer.ts";
import type { PresenceBackedGuard } from "../types/entrypoint.types.ts";

const DECLARE_CONST = "const ";

const FUNCTION_WORD = "function ";

const FUNCTION_LEADS = ["function ", "async function ", "export function ", "export async function "];

const BLOCK_CLOSE = "}";

const constEntry = function constEntry(trimmed: string): [string, string] | null {
    const name = wordFrom(trimmed, DECLARE_CONST.length);
    const equals = trimmed.indexOf("=");
    return name.length > 0 && equals !== -1 ? [name, trimmed.slice(equals + 1)] : null;
};

const functionBody = function functionBody(lines: readonly string[], index: number): string {
    const rest = lines.slice(index + 1);
    const end = rest.findIndex((line) => line.startsWith(BLOCK_CLOSE));
    return (end === -1 ? rest : rest.slice(0, end)).map((line) => `${line}\n`).join("");
};

const functionEntry = function functionEntry(
    lines: readonly string[],
    index: number,
    trimmed: string,
): [string, string] | null {
    if (!FUNCTION_LEADS.some((lead) => trimmed.startsWith(lead))) {
        return null;
    }
    const name = wordFrom(trimmed, trimmed.indexOf(FUNCTION_WORD) + FUNCTION_WORD.length);
    return name.length === 0 ? null : [name, functionBody(lines, index)];
};

const declarationBodies = function declarationBodies(lines: readonly string[]): Map<string, string> {
    const entries = lines.flatMap((line, index) => {
        const trimmed = line.trim();
        const entry = trimmed.startsWith(DECLARE_CONST) ? constEntry(trimmed) : functionEntry(lines, index, trimmed);
        return entry === null ? [] : [entry];
    });
    return new Map(entries.toReversed());
};

const mutationRoots = function mutationRoots(
    lines: readonly string[],
    fields: ReadonlySet<string>,
): Map<string, number> {
    const roots = lines.flatMap((line, index): [string, number][] => {
        const trimmed = line.trim();
        const value = fields.has(memberKey(trimmed)) ? memberValue(trimmed) : "";
        return value.length > 0 ? [[value, index + 1]] : [];
    });
    return new Map(roots.toReversed());
};

const searchGuard = function searchGuard(
    guard: string,
    line: number,
    bodies: ReadonlyMap<string, string>,
    presence: ReadonlySet<string>,
    depth: number,
): PresenceBackedGuard | null {
    const seen = new Set<string>([guard]);
    const chain: string[] = [guard];
    let frontier: readonly string[] = [guard];

    for (let level = 0; level < depth && frontier.length > 0; level += 1) {
        const identifiers = frontier.flatMap((name) => identifiersIn(bodies.get(name) ?? ""));
        const hit = identifiers.findIndex((identifier) => presence.has(identifier));
        const scanned = hit === -1 ? identifiers : identifiers.slice(0, hit);
        const unseen = [...new Set(scanned)].filter((identifier) => !seen.has(identifier));
        const expanding = unseen.filter((identifier) => bodies.has(identifier));

        for (const identifier of unseen) {
            seen.add(identifier);
        }
        chain.push(...expanding);

        const reader = identifiers[hit];
        if (reader !== undefined) {
            return { chain: [...chain, reader], guard, line, reader };
        }
        frontier = expanding;
    }

    return null;
};

export const presenceBackedMutationGuards = function presenceBackedMutationGuards(
    source: string,
    mutationFields: readonly string[],
    presenceReaders: readonly string[],
    depth: number,
): PresenceBackedGuard[] {
    const lines = source.split("\n");
    const bodies = declarationBodies(lines);
    const presence = new Set(presenceReaders);

    return [...mutationRoots(lines, new Set(mutationFields))]
        .toSorted((left, right) => left[1] - right[1])
        .flatMap(([guard, line]) => {
            const found = searchGuard(guard, line, bodies, presence, depth);
            return found === null ? [] : [found];
        });
};
