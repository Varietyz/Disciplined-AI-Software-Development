import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import noRawDom from "@ssot/govlab/rules/eslint/no-raw-dom.eslint.rule.ts";

const linter = new Linter();

const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "no-raw-dom": noRawDom } } },
    rules: { "local/no-raw-dom": ["error", { modules: ["element.factory.ts"] }] },
};

const SRC_FILE = "domain/renderers/base.renderer.ts";

const lint = function lint(code: string, filename = SRC_FILE): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("no-raw-dom", () => {
    it("fires on the raw element-creation primitive", () => {
        const msgs = lint(`const x = document.createElement("div");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("rawCreateElement");
    });

    it("fires on the namespaced creation primitive too", () => {
        const msgs = lint(`const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("rawCreateElement");
    });

    it("does not fire inside the declared factory module", () => {
        expect(lint(`const x = document.createElement("div");`, "element.factory.ts")).toHaveLength(0);
    });

    it("fires on innerHTML assignment", () => {
        const msgs = lint(`const node = {}; node.innerHTML = "<span/>";`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("innerHtmlAssignment");
    });

    it("fires on innerHTML += assignment", () => {
        const msgs = lint(`const node = {}; node.innerHTML += "<span/>";`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("innerHtmlAssignment");
    });

    it("fires on constructing a markup parser", () => {
        const msgs = lint(`const parsed = new DOMParser().parseFromString("<svg/>", "image/svg+xml");`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("rawMarkupParser");
    });

    it("fires on constructing a document environment from markup, whichever parser the registry names", () => {
        const msgs = lint(`const { document } = new JSDOM("<main></main>").window;`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("rawMarkupParser");
        expect(lint(`const dom = new JSDOM("");`, "document.adapter.ts")).toHaveLength(1);
    });

    it("lets the declared factory module construct a markup parser", () => {
        expect(lint(`const parser = new DOMParser();`, "element.factory.ts")).toHaveLength(0);
    });

    it("does not fire on textContent assignment", () => {
        const msgs = lint(`const node = {}; node.textContent = "safe";`);
        expect(msgs).toHaveLength(0);
    });

    it("does not fire on document.createTextNode", () => {
        const msgs = lint(`const x = document.createTextNode(" ");`);
        expect(msgs).toHaveLength(0);
    });
});
