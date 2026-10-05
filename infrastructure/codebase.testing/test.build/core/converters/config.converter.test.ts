import { describe, expect, it } from "vitest";
import { eslintScopes, jsonSafe, neutralized } from "@banes-lab/build-scripts/core/converters/config.converter.ts";

describe("jsonSafe", () => {
    it("keeps null and plain data, turns a RegExp into its source, and drops functions, symbols and class instances", () => {
        const value = {
            kept: [1, "two", null, true],
            pattern: Reflect.construct(RegExp, [String.raw`\.ts$`, "u"]),
            plugin: () => null,
            symbol: Symbol("s"),
            when: new Date(0),
        };
        expect(jsonSafe(value)).toStrictEqual({ kept: [1, "two", null, true], pattern: "/\\.ts$/u" });
        expect(jsonSafe([() => null, 3])).toStrictEqual([3]);
    });
});

describe("eslintScopes", () => {
    it("keeps each scope's name, files, ignores, linter options and rules, and names its plugins", () => {
        const scopes = eslintScopes([
            {
                files: ["**/*.ts"],
                languageOptions: { parser: {} },
                name: "ts",
                plugins: { local: { rules: {} }, sonarjs: { rules: {} } },
                rules: { "local/x": "error" },
            },
            { ignores: ["dist"] },
            "not a scope",
        ]);
        expect(scopes).toStrictEqual([
            { files: ["**/*.ts"], name: "ts", plugins: ["local", "sonarjs"], rules: { "local/x": "error" } },
            { ignores: ["dist"] },
        ]);
    });
});

describe("neutralized", () => {
    it("replaces each token in strings, keys and nested values, in the order given, and leaves other values alone", () => {
        const tokens = [
            ["D:/host", "{root}"],
            ["host", "{root}"],
        ] as const;
        expect(neutralized({ "D:/host/a": ["D:/host/b", 4, { name: "host" }] }, tokens)).toStrictEqual({
            "{root}/a": ["{root}/b", 4, { name: "{root}" }],
        });
    });
});
