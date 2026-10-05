import { absolutePath } from "@ssot/paths";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";

export const importFolder = async function importFolder(key: string, suffix: string): Promise<void> {
    const dir = absolutePath(key);
    const files = readdirSync(dir)
        .filter((name) => name.endsWith(suffix))
        .toSorted((a, b) => a.localeCompare(b));
    await Promise.all(
        files.map(async (name): Promise<void> => {
            await import(pathToFileURL(path.join(dir, name)).href);
        }),
    );
};
