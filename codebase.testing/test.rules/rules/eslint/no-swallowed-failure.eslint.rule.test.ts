import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/no-swallowed-failure.eslint.rule.ts";

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

describe("no-swallowed-failure", () => {
    it("reports a catch with no binding and one that never reads what it caught", () => {
        expect(idsFor("function f() { try { run(); } catch { return null; } }")).toStrictEqual(["droppedFailure"]);
        expect(idsFor("function f() { try { run(); } catch (error) { return null; } }")).toStrictEqual([
            "droppedFailure",
        ]);
    });

    it("accepts a catch that rethrows or reads the error", () => {
        expect(idsFor("try { run(); } catch { throw new Error('context'); }")).toStrictEqual([]);
        expect(idsFor("function f() { try { run(); } catch (error) { report(error); return null; } }")).toStrictEqual(
            [],
        );
        expect(idsFor("try { run(); } catch (error) { if (odd) { throw error; } }")).toStrictEqual([]);
    });

    it("parses every fixture, so a silent pass cannot come from a syntax error", () => {
        const fatal = linter.verify("function f() { try { run(); } catch { return null; } }", config, FILE);
        expect(fatal.every((message) => message.fatal !== true)).toBe(true);
    });

    it("reports an inline rejection handler that drops its reason, on catch and on then", () => {
        expect(idsFor("load().catch(() => fallback());")).toStrictEqual(["droppedRejection"]);
        expect(idsFor("load().catch((reason) => fallback());")).toStrictEqual(["droppedRejection"]);
        expect(idsFor("load().then(use, function () { return null; });")).toStrictEqual(["droppedRejection"]);
    });

    it("accepts a handler that reads its reason, and a handler passed by reference, which forwards it", () => {
        expect(idsFor("load().catch((reason) => report(reason));")).toStrictEqual([]);
        expect(idsFor("load().catch(fail);")).toStrictEqual([]);
        expect(idsFor("load().then(use);")).toStrictEqual([]);
        expect(idsFor("load().then(use, (reason) => { throw reason; });")).toStrictEqual([]);
    });
});
