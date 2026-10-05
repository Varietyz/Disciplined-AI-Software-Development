import { MANIFESTS_CLEAN, manifestsFailed } from "#configuration/strings/validation.strings";
import { ROOT as WORKSPACE_ROOT, absolutePath, relativePath } from "@ssot/paths";
import { existsSync, readFileSync } from "node:fs";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

defineCheck({ detects: [], enforces: ["architecture:manifest-based-design"] });

interface Drift {
    manifest: string;
    entry: string;
    reason: string;
}

const GOVERNED_MEMBER = join(WORKSPACE_ROOT, relativePath("app.root"));
const EXPORT_FORMS = [
    "export const ",
    "export function ",
    "export class ",
    "export type ",
    "export interface ",
    "export { ",
];

const drift: Drift[] = [];

const record = function record(manifest: string, entry: string, reason: string): void {
    drift.push({ entry, manifest, reason });
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const importManifest = async function importManifest(absolute: string): Promise<Record<string, unknown>> {
    const loaded: unknown = await import(pathToFileURL(absolute).href);
    return isRecord(loaded) ? loaded : {};
};

const stringField = function stringField(value: unknown, key: string): string {
    return isRecord(value) && typeof value[key] === "string" ? value[key] : "";
};

const stringArrayField = function stringArrayField(value: unknown, key: string): string[] {
    const declared = isRecord(value) ? value[key] : undefined;
    return Array.isArray(declared) ? declared.filter((item): item is string => typeof item === "string") : [];
};

const recordField = function recordField(value: unknown, key: string): Record<string, unknown> {
    const declared = isRecord(value) ? value[key] : undefined;
    return isRecord(declared) ? declared : {};
};

const allowlistModule = await importManifest(
    join(absolutePath("govlabHost.shared"), "allowlists", "export.allowlist.ts"),
);
const stagedEntries = Array.isArray(allowlistModule["STAGED_FUTURE_ALLOWLIST"])
    ? allowlistModule["STAGED_FUTURE_ALLOWLIST"]
    : [];

const taxonomyModule = await importManifest(absolutePath("govlabHost.taxonomy"));
const taxonomy = recordField(taxonomyModule, "taxonomy");
const declaredContainers = recordField(taxonomy, "containers");
const declaredSpecial = recordField(taxonomy, "specialContainers");

const allowlistDrift = function allowlistDrift(entry: string): string | null {
    const sep = entry.indexOf("::");
    const path = sep === -1 ? entry : entry.slice(0, sep);
    if (!existsSync(join(GOVERNED_MEMBER, path))) {
        return "file does not exist";
    }
    if (sep === -1) {
        return null;
    }
    const name = entry.slice(sep + 2);
    const text = readFileSync(join(GOVERNED_MEMBER, path), "utf8");
    const exported = EXPORT_FORMS.some((form) => text.includes(`${form}${name}`)) || text.includes(`, ${name}`);
    return exported ? null : `no export named '${name}' in the file`;
};

for (const staged of stagedEntries) {
    const entry = stringField(staged, "file");
    const reason = entry.length === 0 ? null : allowlistDrift(entry);
    if (reason !== null) {
        record("dead-exports-allowlist", entry, reason);
    }
}

for (const root of Object.keys(declaredContainers)) {
    const containers = stringArrayField(declaredContainers, root);
    if (!existsSync(join(WORKSPACE_ROOT, root))) {
        record("taxonomy-config.containers", root, "governed root does not exist on disk");
        continue;
    }
    const special = stringArrayField(declaredSpecial, root);
    for (const container of [...containers, ...special]) {
        if (!existsSync(join(WORKSPACE_ROOT, root, container))) {
            record("taxonomy-config.containers", `${root}/${container}`, "declared container does not exist on disk");
        }
    }
}

if (drift.length === 0) {
    process.stdout.write(MANIFESTS_CLEAN);
    process.exit(0);
}

process.stderr.write(manifestsFailed(drift.length));
for (const d of drift) {
    process.stderr.write(`  ${d.manifest}  "${d.entry}"  ${d.reason}\n`);
}
process.exit(1);
