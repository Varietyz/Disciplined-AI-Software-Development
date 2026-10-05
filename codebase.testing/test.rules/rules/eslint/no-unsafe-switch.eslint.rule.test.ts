import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/no-unsafe-switch.eslint.rule.ts";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const FILE = "sample.ts";

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, FILE)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-unsafe-switch", () => {
    it("reports a switch whose name carries a safety-off word, in a literal and in a template", () => {
        expect(idsFor('const flags = ["--enable-unsafe-gpu"];')).toStrictEqual(["unsafeSwitch"]);
        expect(idsFor('const flag = "--unsafe-mode=on";')).toStrictEqual(["unsafeSwitch"]);
        const templated = ["const flag = `--enable-unsafe-", "{name}`;"].join("$");
        expect(idsFor(templated)).toStrictEqual(["unsafeSwitch"]);
    });

    it("accepts a supported switch, a switch value that names a word, and prose", () => {
        expect(idsFor('const flags = ["--enable-features=Vulkan", "--use-angle=swiftshader"];')).toStrictEqual([]);
        expect(idsFor('const flag = "--mode=unsafe";')).toStrictEqual([]);
        expect(idsFor('const note = "an unsafe switch is never passed";')).toStrictEqual([]);
        expect(idsFor('const flag = "--unsafety-margin";')).toStrictEqual([]);
    });
});
