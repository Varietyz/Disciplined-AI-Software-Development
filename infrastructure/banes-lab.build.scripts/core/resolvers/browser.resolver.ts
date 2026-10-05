import { BROWSER_CANDIDATES } from "#configuration/constants/browser.constants";
import { existsSync } from "node:fs";

export const browserCandidates = function browserCandidates(): readonly string[] {
    return BROWSER_CANDIDATES;
};

export const findBrowser = function findBrowser(configured: string | null): string | null {
    if (configured !== null && existsSync(configured)) {
        return configured;
    }
    return BROWSER_CANDIDATES.find((candidate) => existsSync(candidate)) ?? null;
};
