import { readFileSync, readdirSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const UTF8 = "utf8";

const RECORDING_SUFFIX = ".json";

export const loadRecordings = function loadRecordings(): readonly unknown[] {
    const folder = absolutePath("app.surfaces");
    return readdirSync(folder)
        .filter((name) => name.endsWith(RECORDING_SUFFIX))
        .map((name): unknown => JSON.parse(readFileSync(join(folder, name), UTF8)));
};
