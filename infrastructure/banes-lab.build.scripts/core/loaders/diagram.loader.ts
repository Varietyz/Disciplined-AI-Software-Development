import { absolutePath, relativePath } from "@ssot/paths";
import { Buffer } from "node:buffer";
import { concernFolders } from "@ssot/govlab/shared/resolvers/container.resolver.ts";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { projectDirs } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { readdirSync } from "node:fs";

const STRINGS_CONCERN = "strings";
const STRINGS_SUFFIX = ".strings.ts";
const DIAGRAM_KIND = "mermaid";
const KIND_SLOT = "kind";
const TEXT_SLOT = "text";
const MEMBER = relativePath("app.member");
const MEMBER_BELOW_ROOT = `${MEMBER.slice(MEMBER.indexOf("/") + 1)}/`;

const collectSources = function collectSources(value: unknown, into: Set<string>, seen: Set<object>): void {
    if (!isRecord(value) || seen.has(value)) {
        return;
    }
    seen.add(value);
    const text = value[TEXT_SLOT];
    if (value[KIND_SLOT] === DIAGRAM_KIND && typeof text === "string") {
        into.add(text);
    }
    for (const nested of Object.values(value)) {
        collectSources(nested, into, seen);
    }
};

const stringsFiles = function stringsFiles(): string[] {
    return concernFolders(STRINGS_CONCERN, projectDirs())
        .filter((folder) => folder.startsWith(MEMBER_BELOW_ROOT))
        .map((folder) => absolutePath("app.root", folder))
        .flatMap((folder) =>
            readdirSync(folder)
                .filter((name) => name.endsWith(STRINGS_SUFFIX))
                .sort((a, b) => a.localeCompare(b))
                .map((name) => join(folder, name)),
        );
};

const byCodePoint = function byCodePoint(a: string, b: string): number {
    return Buffer.compare(Buffer.from(a), Buffer.from(b));
};

const loadModule = async function loadModule(file: string): Promise<unknown> {
    const loaded: unknown = await import(pathToFileURL(file).href);
    return loaded;
};

export const discoverSources = async function discoverSources(): Promise<readonly string[]> {
    const sources = new Set<string>();
    const seen = new Set<object>();
    const loaded = await Promise.all(stringsFiles().map(loadModule));
    for (const module of loaded) {
        collectSources(module, sources, seen);
    }
    return [...sources].sort(byCodePoint);
};
