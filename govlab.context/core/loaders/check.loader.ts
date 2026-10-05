import { existsSync, readFileSync } from "node:fs";
import type { DeclaredCheck } from "#types/check.types";

const isStrings = function isStrings(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const isDeclaredCheck = function isDeclaredCheck(value: unknown): value is DeclaredCheck {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const record: Record<string, unknown> = { ...value };
    return typeof record["check"] === "string" && isStrings(record["detects"]) && isStrings(record["enforces"]);
};

export const loadDeclaredChecks = function loadDeclaredChecks(file: string): readonly DeclaredCheck[] | null {
    if (!existsSync(file)) {
        return null;
    }
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isDeclaredCheck) : null;
};
