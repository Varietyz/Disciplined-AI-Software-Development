import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/no-secret-value.eslint.rule.ts";

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

const messagesFor = function messagesFor(code: string): readonly string[] {
    return linter.verify(code, config, FILE).map((message) => message.message);
};

const run = function run(character: string, length: number): string {
    return character.repeat(length);
};

describe("no-secret-value", () => {
    it("reports a secret-shaped literal by its kind and never repeats the value", () => {
        const token = `sk-${run("a", 24)}`;
        const [message] = messagesFor(`const key = ${JSON.stringify(token)};`);
        expect(message).toContain("token");
        expect(message).not.toContain(token);
        expect(messagesFor(`const host = "${["203", "0", "113", "7"].join(".")}";`)[0]).toContain("address");
    });

    it("reports a secret shape inside a template's static text", () => {
        const placeholder = ["$", "{", "host", "}"].join("");
        const url = ["const url = `https://", "user:", "pass@", placeholder, "/`;"].join("");
        expect(messagesFor(url)[0]).toContain("credential");
    });

    it("accepts prose, a plain URL and a bare scheme", () => {
        expect(messagesFor('const text = "a token and a key";')).toStrictEqual([]);
        expect(messagesFor('const url = "https://banes-lab.com/";')).toStrictEqual([]);
        expect(messagesFor('const scheme = "postgres://";')).toStrictEqual([]);
    });
});
