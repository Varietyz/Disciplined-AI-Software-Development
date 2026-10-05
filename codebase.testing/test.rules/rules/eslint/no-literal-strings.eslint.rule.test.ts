import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import noLiteralStrings from "@ssot/govlab/rules/eslint/no-literal-strings.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "no-literal-strings": noLiteralStrings } } },
    rules: { "local/no-literal-strings": "error" },
};

const SRC_FILE = "src/page.ts";

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const hole = function hole(name: string): string {
    return ["$", "{", name, "}"].join("");
};

describe("no-literal-strings", () => {
    it("fires on el(tag, { text: 'literal' })", () => {
        const msgs = lint(`el("p", { text: "Reset to defaults" });`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalUserVisibleProp");
    });

    it("fires on el(tag, { ariaLabel: 'literal' })", () => {
        const msgs = lint(`el("button", { ariaLabel: "Increase value" });`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalUserVisibleProp");
    });

    it("fires on any object with title: 'literal'", () => {
        const msgs = lint(`const x = { title: "All done" };`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalUserVisibleProp");
    });

    it("fires on any object with label: 'literal'", () => {
        const msgs = lint(`const x = { label: "God mode" };`, SRC_FILE);
        expect(msgs).toHaveLength(1);
    });

    it("fires on any object with headline / detail / footer literal", () => {
        const msgs = lint(
            `const x = { headline: "Slow down", detail: "Take it easy", footer: "Mellow out." };`,
            SRC_FILE,
        );
        expect(msgs).toHaveLength(3);
    });

    it("passes when text comes from a const", () => {
        const msgs = lint(`el("p", { text: PAUSE_OVERLAY_TITLE });`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on .textContent = 'literal'", () => {
        const msgs = lint(`node.textContent = "Press any key";`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalTextProperty");
    });

    it("passes when .textContent = const", () => {
        const msgs = lint(`node.textContent = LABEL;`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on setAttribute('aria-label', 'literal')", () => {
        const msgs = lint(`node.setAttribute("aria-label", "Close dialog");`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("literalSetAttribute");
    });

    it("fires on setAttribute('title', 'literal')", () => {
        const msgs = lint(`node.setAttribute("title", "Tooltip");`, SRC_FILE);
        expect(msgs).toHaveLength(1);
    });

    it("does not fire on setAttribute('data-x', 'value') (not user-visible)", () => {
        const msgs = lint(`node.setAttribute("data-action", "exit");`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("does not fire inside *.strings.ts", () => {
        const msgs = lint(`const X = { text: "Literal here" };`, "src/pause.strings.ts");
        expect(msgs).toHaveLength(0);
    });

    it("fires inside page-config.ts (no longer exempt)", () => {
        const msgs = lint(
            `export const config = { headline: "This page does not exist" };`,
            "domain/schemas/base.schema.ts",
        );
        expect(msgs).toHaveLength(1);
    });

    it("fires inside *-config.ts files (no longer exempt)", () => {
        const msgs = lint(`const x = { label: "Hint" };`, "configuration/constants/absent.constants.ts");
        expect(msgs).toHaveLength(1);
    });

    it("does not fire on registerComponent({ description: 'X' }) (registry metadata)", () => {
        const msgs = lint(
            `registerComponent({ id: ID, description: "Internal dev description", build: fn });`,
            SRC_FILE,
        );
        expect(msgs).toHaveLength(0);
    });

    it("does not fire on metadata a call builds under a meta key, and fires on the same call outside one", () => {
        const msgs = lint(
            [
                `const rule = { meta: buildMeta({ description: "Internal rule description" }) };`,
                `const card = { body: buildMeta({ description: "Shown on the card" }) };`,
            ].join("\n"),
            SRC_FILE,
        );
        expect(msgs.map((msg) => msg.line)).toStrictEqual([2]);
    });

    it("does not fire when key equals value (dispatch table pattern)", () => {
        const msgs = lint(
            `const TYPE_BY_KIND = { number: "number", text: "text", file: "file" };`,
            "src/form-input.component.ts",
        );
        expect(msgs).toHaveLength(0);
    });

    it("does not fire on .textContent = '' (empty string clear)", () => {
        const msgs = lint(`node.textContent = "";`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("does not fire on el(tag, { class: 'literal-class-name' }) (non-renderable prop)", () => {
        const msgs = lint(`el("div", { class: "pause-card__title" });`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on template literal without expressions (still a static string)", () => {
        const msgs = lint("const x = { text: `Static heading` };", SRC_FILE);
        expect(msgs).toHaveLength(1);
    });

    it("fires on a template literal whose text parts carry a word, interpolated or not", () => {
        const msgs = lint(`const x = { text: \`Slot \${i}\` };`, SRC_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.message).toContain("Slot …");
    });

    it("does not fire on a template literal whose text parts carry no word", () => {
        const msgs = lint(`const x = { title: \`\${a}/\${b}.md\` };`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("follows a name in a slot to the copy it is bound to, shorthand or not, and reports the binding", () => {
        const msgs = lint(
            [
                "const make = (c) => {",
                ["    const title = `", "{c.title} closure`;"].join("$"),
                "    const label = LABEL;",
                "    return [{ title }, { label }, { text: title }];",
                "};",
            ].join("\n"),
            SRC_FILE,
        );
        expect(msgs.map((msg) => msg.line)).toStrictEqual([2, 2]);
        expect(msgs[0]?.message).toContain("… closure");
    });

    it("does not follow a name bound to a value that carries no copy", () => {
        const msgs = lint(`const f = (id) => { const title = id; return { title }; };`, SRC_FILE);
        expect(msgs).toHaveLength(0);
    });

    it("fires on the message of a constructed error, static or interpolated, followed through a binding", () => {
        const msgs = lint(
            [
                'throw new Error("The report is missing.");',
                `throw new TypeError(\`No grammar for ${hole("name")}.\`);`,
                `const reason = \`The step ${hole("step")} failed.\`;`,
                "throw new RangeError(reason);",
            ].join("\n"),
            SRC_FILE,
        );
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual([
            "literalErrorMessage",
            "literalErrorMessage",
            "literalErrorMessage",
        ]);
    });

    it("fires on a literal written to a terminal stream or the console, and passes one built from a strings export", () => {
        const msgs = lint(
            [
                String.raw`process.stdout.write("Wrote the report.\n");`,
                `process.stderr.write(\`The step ${hole("step")} failed.\\n\`);`,
                'console.warn("Nothing was written.");',
                "process.stdout.write(wroteLine(count));",
                `process.stdout.write(\`${hole("a")}\\n\`);`,
            ].join("\n"),
            SRC_FILE,
        );
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual([
            "literalTerminalWrite",
            "literalTerminalWrite",
            "literalTerminalWrite",
        ]);
    });

    it("fires on copy assembled by concatenation, and passes a concatenation with no word in it", () => {
        const msgs = lint(
            [
                'throw new Error("The step " + step + " failed.");',
                `process.stdout.write(\`${hole("a")} \` + \`scanned=${hole("b")}\\n\`);`,
                'process.stdout.write(a + ":" + b);',
            ].join("\n"),
            SRC_FILE,
        );
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual(["literalErrorMessage", "literalTerminalWrite"]);
    });

    it("does not fire on an error built from a strings export or on a constructor that is not an error", () => {
        const msgs = lint(
            ['throw new Error(reportMissing("r.json"));', 'const map = new Map([["a", "Some words"]]);'].join("\n"),
            SRC_FILE,
        );
        expect(msgs).toHaveLength(0);
    });

    it("fires on a finding message, static or interpolated", () => {
        const msgs = lint(
            `const f = [{ file, message: "The build produced no report." }, { file, message: \`Links to \${x}.\` }];`,
            SRC_FILE,
        );
        expect(msgs).toHaveLength(2);
    });
});
