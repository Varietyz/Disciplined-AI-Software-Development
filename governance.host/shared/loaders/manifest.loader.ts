import { existsSync, readFileSync, readdirSync } from "node:fs";
import { notJsonObject, notValidJson } from "../strings/manifest.strings.ts";
import { ROOT } from "@ssot/paths";
import path from "node:path";

const MANIFEST = "package.json";
const WILDCARD = "*";

export const WORKSPACE_POSIX = ROOT.split(path.sep).join(path.posix.sep);

export const isManifestRecord = function isManifestRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const parsedAt = function parsedAt(location: string): unknown {
    const text = readFileSync(location, "utf8");
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(notValidJson(location), { cause: error });
    }
};

export const jsonRecordAt = function jsonRecordAt(location: string): Record<string, unknown> {
    const parsed = parsedAt(location);
    if (!isManifestRecord(parsed)) {
        throw new TypeError(notJsonObject(location));
    }
    return parsed;
};

export const manifestAt = function manifestAt(dir: string): Record<string, unknown> {
    return jsonRecordAt(path.join(dir, MANIFEST));
};

const expand = function expand(pattern: string): string[] {
    const star = pattern.indexOf(WILDCARD);
    if (star === -1) {
        return [pattern];
    }
    const cut = pattern.lastIndexOf("/", star);
    const dir = pattern.slice(0, cut);
    const prefix = pattern.slice(cut + 1, star);
    return readdirSync(path.join(ROOT, dir), { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
        .map((entry) => `${dir}/${entry.name}`);
};

export const memberRels = function memberRels(): readonly string[] {
    const { workspaces } = manifestAt(ROOT);
    const patterns = Array.isArray(workspaces) ? workspaces.filter((value) => typeof value === "string") : [];
    return patterns.flatMap(expand).filter((member) => existsSync(path.join(ROOT, member, MANIFEST)));
};

export const memberDirs = function memberDirs(): readonly string[] {
    return memberRels().map((member) => `${WORKSPACE_POSIX}/${member}`);
};
