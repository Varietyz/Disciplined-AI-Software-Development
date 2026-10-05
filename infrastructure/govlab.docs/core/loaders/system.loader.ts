import { DISPATCH_TABLE, RUNTIME_DEFERRED } from "#configuration/strings/system.strings";
import type { DispatchEdge, SystemComponent, SystemModel, TrustBoundary } from "#types/system.types";
import { ROOT, absolutePath } from "@ssot/paths";
import { PACKAGE_FILE } from "#configuration/constants/document.constants";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { readJsonSafe } from "#core/loaders/base.loader";
import { workspaceMembers } from "#core/loaders/package.loader";

const SYSTEM_NAME = "banes-lab";
const SERVICE_KIND = "service";
const GROUP_PREFIX = "group-";
const POSIX_SEPARATOR = "/";
const RECORDS_KEY = "records";

const stringField = function stringField(value: unknown, key: string): string {
    const field = isPlainRecord(value) ? value[key] : undefined;
    return typeof field === "string" ? field : "";
};

const recordField = function recordField(value: unknown, key: string): Readonly<Record<string, unknown>> {
    const field = isPlainRecord(value) ? value[key] : undefined;
    return isPlainRecord(field) ? field : {};
};

const groupOf = function groupOf(dir: string): string {
    const [head] = dir.split(POSIX_SEPARATOR);
    return head ?? dir;
};

const componentsOf = function componentsOf(dirs: readonly string[]): SystemComponent[] {
    return dirs.map((dir) => ({
        boundary: groupOf(dir),
        id: dir,
        kind: SERVICE_KIND,
        label: stringField(readJsonSafe(join(ROOT, dir, PACKAGE_FILE)), "name"),
    }));
};

const boundariesOf = function boundariesOf(dirs: readonly string[]): TrustBoundary[] {
    const groups = [...new Set(dirs.map(groupOf))].toSorted((left, right) => left.localeCompare(right));
    return groups.map((group) => ({
        components: dirs.filter((dir) => groupOf(dir) === group),
        id: `${GROUP_PREFIX}${group}`,
        label: group,
    }));
};

const declaredTools = function declaredTools(): ReadonlySet<string> {
    const manifest = readJsonSafe(join(ROOT, PACKAGE_FILE));
    return new Set([
        ...Object.keys(recordField(manifest, "dependencies")),
        ...Object.keys(recordField(manifest, "devDependencies")),
    ]);
};

const dispatchOf = function dispatchOf(): DispatchEdge[] {
    const registry = readJsonSafe(absolutePath("govlab.quality.data.registry"));
    const records = isPlainRecord(registry) && Array.isArray(registry[RECORDS_KEY]) ? registry[RECORDS_KEY] : [];
    const declared = declaredTools();
    return records
        .flatMap((record: unknown): DispatchEdge[] => {
            const tool = stringField(record, "tool");
            const ecosystem = stringField(record, "ecosystem");
            return tool.length === 0 || ecosystem.length === 0 || !declared.has(tool)
                ? []
                : [{ key: ecosystem, table: DISPATCH_TABLE, target: tool }];
        })
        .toSorted((left, right) => (left.key + left.target).localeCompare(right.key + right.target));
};

export const buildSystemModel = function buildSystemModel(): SystemModel {
    const dirs = workspaceMembers(ROOT);
    return {
        components: componentsOf(dirs),
        dispatch: dispatchOf(),
        name: SYSTEM_NAME,
        runtimeDeferred: RUNTIME_DEFERRED,
        trustBoundaries: boundariesOf(dirs),
    };
};
