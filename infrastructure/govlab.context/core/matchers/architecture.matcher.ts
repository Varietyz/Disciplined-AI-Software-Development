import type { Principle, PrincipleFilter } from "#types/architecture.types";

const isWanted = function isWanted(value: string | undefined): value is string {
    return typeof value === "string" && value.length > 0;
};

const matchesScalars = function matchesScalars(principle: Principle, filter: PrincipleFilter): boolean {
    const checks: [string | undefined, string][] = [
        [filter.type, principle.type],
        [filter.category, principle.category],
        [filter.severity, principle.severity],
    ];
    return checks.every(([value, actual]) => !isWanted(value) || actual === value);
};

const matchesLists = function matchesLists(principle: Principle, filter: PrincipleFilter): boolean {
    const checks: [string | undefined, string[]][] = [
        [filter.scope, principle.scope],
        [filter.enables, principle.enables],
        [filter.requires, principle.requires],
        [filter.reinforces, principle.reinforces],
        [filter.conflictsWith, principle.conflicts_with],
        [filter.tensionsWith, principle.tensions_with],
    ];
    return checks.every(([value, list]) => !isWanted(value) || list.includes(value));
};

export const matchesPrinciple = function matchesPrinciple(principle: Principle, filter: PrincipleFilter): boolean {
    return matchesScalars(principle, filter) && matchesLists(principle, filter);
};
