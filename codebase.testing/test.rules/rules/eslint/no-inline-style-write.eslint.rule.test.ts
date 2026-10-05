import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import noInlineStyleWrite from "@ssot/govlab/rules/eslint/no-inline-style-write.eslint.rule.ts";

const linter = new Linter();

const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "no-inline-style-write": noInlineStyleWrite } } },
    rules: { "local/no-inline-style-write": ["error", { modules: ["style.registry.ts"] }] },
};

const SRC_FILE = "presentation/components/base.component.ts";

const lint = function lint(code: string, filename = SRC_FILE): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("no-inline-style-write", () => {
    it("fires on a custom-property write onto a node", () => {
        const msgs = lint(`const node = {}; node.style.setProperty("--x", "1px");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationWrite");
    });

    it("fires on a named-property write onto a node", () => {
        const msgs = lint(`const node = {}; node.style.left = "10px";`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationWrite");
    });

    it("fires on replacing the whole declaration block", () => {
        const msgs = lint(`const node = {}; node.style.cssText = "left:0";`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationWrite");
    });

    it("fires on assigning the accessor itself", () => {
        const msgs = lint(`const node = {}; node.style = "left:0";`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationWrite");
    });

    it("fires on the typed declaration map", () => {
        const msgs = lint(`const node = {}; node.attributeStyleMap.set("left", "0");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationWrite");
    });

    it("fires on the presentation attribute written by name", () => {
        const msgs = lint(`const node = {}; node.setAttribute("style", "left:0");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("presentationAttribute");
    });

    it("does not fire inside the declared owner module", () => {
        expect(lint(`const node = {}; node.style.setProperty("--x", "1px");`, "style.registry.ts")).toHaveLength(0);
    });

    it("does not fire on reading a presentation value", () => {
        expect(lint(`const node = {}; const held = node.style.left;`)).toHaveLength(0);
    });

    it("does not fire on another attribute", () => {
        expect(lint(`const node = {}; node.setAttribute("class", "open");`)).toHaveLength(0);
    });

    it("does not fire on a class write", () => {
        expect(lint(`const node = {}; node.classList.add("open");`)).toHaveLength(0);
    });
});
