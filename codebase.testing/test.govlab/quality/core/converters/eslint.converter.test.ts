import { expect, test } from "vitest";
import {
    jsRulesOf,
    namespacesOf,
    pluginMap,
    pluginsFromRecord,
    toRulesRecord,
} from "@govlab/quality/core/converters/eslint.converter.ts";
import type { InstalledPlugin } from "@govlab/quality/types/eslint.types.ts";

const installed: InstalledPlugin[] = [
    {
        plugin: { rules: {} },
        record: {
            configTarget: "eslint",
            ecosystem: "typescript",
            emitter: "eslint",
            isPlugin: true,
            pluginNamespace: "demo",
            tool: "eslint-plugin-demo",
        },
    },
];

test("toRulesRecord keeps only rule entries and jsRulesOf drops the typescript rules", () => {
    expect(toRulesRecord({ a: "error", b: { nope: true } })).toStrictEqual({ a: "error" });
    expect(jsRulesOf({ "@typescript-eslint/x": "error", y: "off" })).toStrictEqual({ y: "off" });
});

test("plugin records map by namespace", () => {
    expect(Object.keys(pluginsFromRecord({ p: {}, q: 1 }))).toStrictEqual(["p"]);
    expect(namespacesOf(installed)).toStrictEqual(["demo"]);
    expect(Object.keys(pluginMap(installed))).toStrictEqual(["demo"]);
});
