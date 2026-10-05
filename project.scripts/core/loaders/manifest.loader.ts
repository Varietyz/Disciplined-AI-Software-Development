import { MANIFEST_NAME } from "#configuration/constants/closure.constants";
import { join } from "node:path";
import { readFileSync } from "node:fs";

export const manifestOf = function manifestOf(root: string): unknown {
    return JSON.parse(readFileSync(join(root, MANIFEST_NAME), "utf8"));
};
