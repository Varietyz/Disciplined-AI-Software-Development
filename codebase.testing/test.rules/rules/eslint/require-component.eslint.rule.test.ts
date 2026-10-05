import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import requireComponent from "@ssot/govlab/rules/eslint/require-component.eslint.rule.ts";

const linter = new Linter();

const configWith = function configWith(factories: string[]): Linter.Config {
    return {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025, sourceType: "module" },
        plugins: { local: { rules: { "require-component": requireComponent } } },
        rules: { "local/require-component": ["error", { factories }] },
    };
};

const DECLARED = configWith(["el"]);
const UNDECLARED = configWith([]);

const SRC_FILE = "domain/views/base.view.ts";

const lint = function lint(code: string, filename = SRC_FILE, config = DECLARED): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("require-component", () => {
    it("is inert until a project declares its raw element factory", () => {
        expect(lint(`el("button", { class: "x" });`, SRC_FILE, UNDECLARED)).toHaveLength(0);
    });

    it("fires on every interactive tag built through a declared factory", () => {
        for (const tag of ["button", "input", "select", "option", "textarea"]) {
            const msgs = lint(`el("${tag}", {});`);
            expect(msgs).toHaveLength(1);
            expect(msgs[0]?.messageId).toBe("rawInteractiveTag");
        }
    });

    it("does not fire on a non-interactive tag", () => {
        expect(lint(`el("div", { class: "x" });`)).toHaveLength(0);
        expect(lint(`el("span", { class: "x" });`)).toHaveLength(0);
    });

    it("does not fire on a call to some other function", () => {
        expect(lint(`build("button", {});`)).toHaveLength(0);
    });

    it("does not fire inside a component file", () => {
        expect(lint(`el("button", {});`, "core/components/base.component.ts")).toHaveLength(0);
    });

    it("does not fire on a dynamic template literal tag", () => {
        expect(lint(`el(\`\${tag}\`, {});`)).toHaveLength(0);
    });
});
