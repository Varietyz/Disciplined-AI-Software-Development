import type { PathTree } from "#types/location.types";

export const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isStringLeafTree = function isStringLeafTree(value: unknown): boolean {
    return typeof value === "string" || (isRecord(value) && Object.values(value).every(isStringLeafTree));
};

export const isPathTree = function isPathTree(value: unknown): value is PathTree {
    return isRecord(value) && Object.values(value).every(isStringLeafTree);
};
