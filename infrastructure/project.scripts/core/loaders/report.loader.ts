import { existsSync, readFileSync } from "node:fs";

export const reportAt = function reportAt(path: string): unknown {
    return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
};
