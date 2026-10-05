import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/no-port-literal.eslint.rule.ts";

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

describe("no-port-literal", () => {
    it("reports a port-named variable, property and call given a literal", () => {
        expect(idsFor("const sitePort = 4203;")).toStrictEqual(["portLiteral"]);
        expect(idsFor("const options = { port: 4203 };")).toStrictEqual(["portLiteral"]);
        expect(idsFor("freePort(4203);")).toStrictEqual(["portLiteral"]);
    });

    it("reports a listen call given a literal port", () => {
        expect(idsFor("server.listen(4203);")).toStrictEqual(["portLiteral"]);
        expect(idsFor('server.listen("4203", "127.0.0.1");')).toStrictEqual(["portLiteral"]);
    });

    it("accepts a listen call that asks the system for a free port, and one given a read port", () => {
        expect(idsFor('server.listen(0, "127.0.0.1");')).toStrictEqual([]);
        expect(idsFor("server.listen(sitePort());")).toStrictEqual([]);
    });

    it("accepts port 0 in every form, because it asks the system for a free port and names none", () => {
        expect(idsFor("const options = { port: 0 }")).toStrictEqual([]);
        expect(idsFor('const flag = "--remote-debugging-port=0"')).toStrictEqual([]);
        expect(idsFor('const origin = "localhost:0"')).toStrictEqual([]);
    });

    it("still reports a flag or a host given a real port, also one that starts with 0", () => {
        expect(idsFor('const flag = "--remote-debugging-port=09222"')).toStrictEqual(["hostPort"]);
        expect(idsFor('const flag = "--remote-debugging-port=9222"')).toStrictEqual(["hostPort"]);
        expect(idsFor("const options = { port: 9222 }")).toStrictEqual(["portLiteral"]);
    });

    it("reports a fallback between a port read and a literal", () => {
        expect(idsFor("const value = readPort() ?? 4203;")).toStrictEqual(["portFallback"]);
    });

    it("reports a host with a port written into a string", () => {
        expect(idsFor('const origin = "localhost:4203";')).toStrictEqual(["hostPort"]);
    });

    it("leaves names whose word segments only contain the letters of port", () => {
        expect(idsFor("const report = 4203;")).toStrictEqual([]);
        expect(idsFor("support(4203);")).toStrictEqual([]);
    });
});
