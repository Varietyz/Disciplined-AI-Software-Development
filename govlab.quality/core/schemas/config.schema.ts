import {
    MUST_BE_OBJECT,
    isObject,
    isStringArray,
    requireObjectField,
    stringArrayFieldError,
    stringFieldErrors,
    validateEcosystems,
    validateOwners,
} from "#core/validators/section.validator";
import { defineConfigSection } from "#core/registries/section.registry";

const validatePaths = (hostPolicy: Record<string, unknown>): string[] => {
    if (!Object.hasOwn(hostPolicy, "paths")) {
        return [];
    }
    const { paths } = hostPolicy;
    if (!isObject(paths)) {
        return ["paths must be an object"];
    }
    const arrayErrors = ["roots", "excluded", "packages"]
        .filter((key) => Object.hasOwn(paths, key) && !isStringArray(paths[key]))
        .map((key) => `paths.${key} must be an array of strings`);
    const stringErrors = ["source", "treeFile"]
        .filter((key) => Object.hasOwn(paths, key) && typeof paths[key] !== "string")
        .map((key) => `paths.${key} must be a string`);
    return [...arrayErrors, ...stringErrors];
};

const docsHarnessErrors = (harness: unknown): string[] => {
    if (!isObject(harness)) {
        return ["harness must be an object"];
    }
    return typeof harness["root"] === "string" ? [] : ["harness.root must be a string"];
};

export const hostPolicySection = defineConfigSection({
    key: "hostPolicy",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        return [
            ...requireObjectField(value, "moduleLevels"),
            ...requireObjectField(value, "testRoots"),
            ...validatePaths(value),
        ];
    },
});

export const contentPolicySection = defineConfigSection({
    key: "contentPolicy",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        return [
            ...stringFieldErrors(value, ["aiName"]),
            ...["allowNamespaces", "allowNumberNamespaces", "allow"].flatMap((key) =>
                stringArrayFieldError(value, key, `${key} must be an array of strings`),
            ),
        ];
    },
});

export const qualityEngineSection = defineConfigSection({
    key: "qualityEngine",
    validate(value) {
        return isObject(value)
            ? stringFieldErrors(value, ["root", "eslintConfig", "stylelintConfig"])
            : [MUST_BE_OBJECT];
    },
});

export const docsSection = defineConfigSection({
    key: "docs",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        const harnessErrors = Object.hasOwn(value, "harness") ? docsHarnessErrors(value["harness"]) : [];
        return [
            ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings"),
            ...stringFieldErrors(value, ["prettierConfig"]),
            ...stringArrayFieldError(value, "boundaryDocs", "boundaryDocs must be an array of strings"),
            ...stringArrayFieldError(value, "members", "members must be an array of strings"),
            ...stringArrayFieldError(value, "hostTokens", "hostTokens must be an array of strings"),
            ...harnessErrors,
        ];
    },
});

export const gainSection = defineConfigSection({
    key: "gain",
    validate(value) {
        return isObject(value)
            ? stringArrayFieldError(value, "ignore", "ignore must be an array of strings")
            : [MUST_BE_OBJECT];
    },
});

export const projectOrganizationSection = defineConfigSection({
    key: "projectOrganization",
    validate(value) {
        return isObject(value)
            ? [
                  ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings"),
                  ...stringArrayFieldError(value, "jsonChunks", "jsonChunks must be an array of module paths"),
              ]
            : [MUST_BE_OBJECT];
    },
});

export const qualitySection = defineConfigSection({
    key: "qualityMaster",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        return [
            ...(Object.hasOwn(value, "concerns") && !isObject(value["concerns"]) ? ["concerns must be an object"] : []),
            ...(Object.hasOwn(value, "owners") ? validateOwners(value["owners"]) : []),
            ...(Object.hasOwn(value, "ecosystems") ? validateEcosystems(value["ecosystems"]) : []),
            ...stringArrayFieldError(value, "exclude", "exclude must be an array of path-glob strings"),
        ];
    },
});

export const extensionsSection = defineConfigSection({
    key: "extensions",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        return Object.hasOwn(value, "global") && typeof value["global"] !== "boolean"
            ? ["extensions.global must be a boolean"]
            : [];
    },
});
