import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";

export const importFolder = async function importFolder(key: string, suffix: string): Promise<void> {
    const folder = absolutePath(key);
    const files = readdirSync(folder)
        .filter((name) => name.endsWith(suffix))
        .toSorted((left, right) => left.localeCompare(right));
    await Promise.all(
        files.map(async (name) => {
            await import(pathToFileURL(join(folder, name)).href);
        }),
    );
};
