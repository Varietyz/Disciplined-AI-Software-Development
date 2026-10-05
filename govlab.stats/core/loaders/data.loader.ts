import { existsSync, readFileSync } from "node:fs";

export const readJson = function readJson(abs: string): unknown {
    return existsSync(abs) ? JSON.parse(readFileSync(abs, "utf8")) : null;
};
