import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-lifecycle-handle-must-be-stored.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const SRC = `${absolutePath("app.member").split(sep).join("/")}/runtime/entrypoints/probe.entrypoint.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-lifecycle-handle-must-be-stored", () => {
    it("reports a discarded free lifecycle call", () => {
        expect(idsFor("startTicker(config);")).toStrictEqual(["handleDiscarded"]);
    });

    it("reports a bare lifecycle verb as a method", () => {
        expect(idsFor("ticker.start();")).toStrictEqual(["handleDiscarded"]);
    });

    it("accepts a stored handle", () => {
        expect(idsFor("const handle = startTicker(config);")).toStrictEqual([]);
    });

    it("accepts an explicitly voided discard", () => {
        expect(idsFor("void startTicker(config);")).toStrictEqual([]);
    });

    it("does not treat a verb-prefixed platform accessor as lifecycle", () => {
        expect(idsFor("element.attachShadow({ mode: 'open' });")).toStrictEqual([]);
    });

    it("does not fire on a name that merely begins with the letters of a verb", () => {
        expect(idsFor("starter(config);")).toStrictEqual([]);
    });

    it("reports a lifecycle method bound to be called later, which would hide the call from the check", () => {
        expect(idsFor("const track = observer.observe.bind(observer);\ntrack(element);")).toStrictEqual([
            "lifecycleBound",
        ]);
    });

    it("still reports a discarded lifecycle call when no type information says it returns nothing", () => {
        expect(idsFor("observer.observe(element);")).toStrictEqual(["handleDiscarded"]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor("startTicker(config);", "probe.test.ts")).toStrictEqual([]);
    });
});
