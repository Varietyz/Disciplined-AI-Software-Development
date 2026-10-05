import type { InstallRecord, InstallRegistry } from "#types/dependency.types";
import { absolutePath } from "@ssot/paths";
import { invalidRegistry } from "#configuration/strings/dependency.strings";
import { readFileSync } from "node:fs";

const isInstallRegistry = function isInstallRegistry(value: unknown): value is InstallRegistry {
    return typeof value === "object" && value !== null && "records" in value && Array.isArray(value.records);
};

export const loadInstallRegistry = function loadInstallRegistry(): InstallRegistry {
    const file = absolutePath("govlab.quality.data.registry");
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    if (isInstallRegistry(parsed)) {
        return parsed;
    }
    throw new Error(invalidRegistry(file));
};

export const installRecordFor = function installRecordFor(
    tool: string,
    registry: InstallRegistry = loadInstallRegistry(),
): InstallRecord | undefined {
    return registry.records.find((record) => record.tool === tool);
};

export const selectableTools = function selectableTools(
    registry: InstallRegistry = loadInstallRegistry(),
): Set<string> {
    return new Set(
        registry.records.filter((record) => record.disposition === "selectable").map((record) => record.tool),
    );
};
