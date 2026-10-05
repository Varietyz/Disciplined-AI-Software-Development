import { MUST_BE_OBJECT, isObject, isStringArray, requireObjectField } from "#core/validators/section.validator";
import { defineConfigSection } from "#core/registries/section.registry";

const TS_STRING_ARRAY_KEYS = [
    "elementTypes",
    "nativeTags",
    "iconPrefixes",
    "appShellAllow",
    "shellAllow",
    "iconSelectors",
    "variantScaleExempt",
    "semanticColorTokens",
];

const TS_STRING_KEYS = [
    "typesHome",
    "utilityPrefix",
    "componentPrefix",
    "layerOrder",
    "layerStatementHome",
    "tokensFile",
    "focusHome",
    "zTokenPrefix",
    "mobileSuffix",
];

const tsAxesErrors = (ts: Record<string, unknown>): string[] => {
    if (!Object.hasOwn(ts, "axes")) {
        return [];
    }
    if (!isObject(ts["axes"])) {
        return ["layout.typeSystem.axes must be an object"];
    }
    return Object.entries(ts["axes"])
        .filter(([, steps]) => !isStringArray(steps))
        .map(([axis]) => `layout.typeSystem.axes.${axis} must be an array of strings`);
};

const tsAxisHomesErrors = (ts: Record<string, unknown>): string[] => {
    if (!Object.hasOwn(ts, "axisHomes")) {
        return [];
    }
    if (!isObject(ts["axisHomes"])) {
        return ["layout.typeSystem.axisHomes must be an object"];
    }
    return Object.entries(ts["axisHomes"])
        .filter(([, home]) => typeof home !== "string")
        .map(([axis]) => `layout.typeSystem.axisHomes.${axis} must be a string`);
};

const tsStringArrayErrors = (ts: Record<string, unknown>): string[] =>
    TS_STRING_ARRAY_KEYS.filter((key) => Object.hasOwn(ts, key) && !isStringArray(ts[key])).map(
        (key) => `layout.typeSystem.${key} must be an array of strings`,
    );

const tsStringErrors = (ts: Record<string, unknown>): string[] =>
    TS_STRING_KEYS.filter((key) => Object.hasOwn(ts, key) && typeof ts[key] !== "string").map(
        (key) => `layout.typeSystem.${key} must be a string`,
    );

const tsLayerSegmentsErrors = (ts: Record<string, unknown>): string[] => {
    if (!Object.hasOwn(ts, "layerSegments")) {
        return [];
    }
    const segments = ts["layerSegments"];
    const ok =
        Array.isArray(segments) &&
        segments.every((s) => isObject(s) && typeof s["layer"] === "string" && typeof s["needle"] === "string");
    return ok ? [] : ["layout.typeSystem.layerSegments must be an array of { layer, needle } strings"];
};

const tsVarCategoriesErrors = (ts: Record<string, unknown>): string[] => {
    if (!Object.hasOwn(ts, "varCategories")) {
        return [];
    }
    const categories = ts["varCategories"];
    const ok =
        Array.isArray(categories) &&
        categories.every(
            (c) =>
                isObject(c) &&
                typeof c["file"] === "string" &&
                typeof c["description"] === "string" &&
                isStringArray(c["prefixes"]),
        );
    return ok ? [] : ["layout.typeSystem.varCategories must be an array of { file, description, prefixes } entries"];
};

const validateTypeSystem = (layout: unknown): string[] => {
    if (!isObject(layout) || !Object.hasOwn(layout, "typeSystem")) {
        return [];
    }
    const ts = layout["typeSystem"];
    if (!isObject(ts)) {
        return ["layout.typeSystem must be an object"];
    }
    return [
        ...tsAxesErrors(ts),
        ...tsAxisHomesErrors(ts),
        ...tsStringArrayErrors(ts),
        ...tsStringErrors(ts),
        ...tsLayerSegmentsErrors(ts),
        ...tsVarCategoriesErrors(ts),
    ];
};

export const eslintSection = defineConfigSection({
    key: "eslint",
    validate(value) {
        if (!isObject(value)) {
            return [MUST_BE_OBJECT];
        }
        return [
            ...requireObjectField(value, "scopes"),
            ...requireObjectField(value, "layout"),
            ...validateTypeSystem(value["layout"]),
            ...(Object.hasOwn(value, "rules") && !isObject(value["rules"])
                ? ["rules must be an object (raw eslint rule config)"]
                : []),
        ];
    },
});
