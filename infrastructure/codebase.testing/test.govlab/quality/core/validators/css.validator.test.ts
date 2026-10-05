import { describe, expect, it } from "vitest";
import { validateWith } from "./validation.fixture.ts";

const TWO = 2;
const TOKENS = "tokens.css";

describe("the css-dead-var validator", () => {
    it("flags a custom property never referenced via var()", () => {
        const found = validateWith("css-dead-var", [
            ["c.css", ".a{color:var(--used)}"],
            [TOKENS, ":root{--used:1;--dead:2}"],
        ]);
        expect(found).toHaveLength(1);
        expect(found[0]?.message).toContain("--dead");
        expect(found[0]?.file).toBe(TOKENS);
    });

    it("does not flag a var referenced by name in a script file", () => {
        const found = validateWith("css-dead-var", [
            [TOKENS, ":root{--js-driven:1}"],
            ["set-var.ts", 'element.style.setProperty("--js-driven", value);'],
        ]);
        expect(found).toEqual([]);
    });

    it("keeps a custom property that a member importing the definitions uses", () => {
        const found = validateWith(
            "css-dead-var",
            [[TOKENS, ":root{--shared:1;--dead:2}"]],
            [["consumer.css", ".b{border-radius:var(--shared)}"]],
        );
        expect(found.map((finding) => finding.message)).toHaveLength(1);
        expect(found[0]?.message).toContain("--dead");
    });
});

describe("the css-dangling-var validator", () => {
    it("flags a var() reference with no definition anywhere", () => {
        const found = validateWith("css-dangling-var", [
            ["c.css", ".a{color:var(--defined);background:var(--missing)}"],
            [TOKENS, ":root{--defined:1}"],
        ]);
        expect(found).toHaveLength(1);
        expect(found[0]?.message).toContain("--missing");
        expect(found[0]?.file).toBe("c.css");
    });

    it("does not flag a var set by name in a script file", () => {
        const found = validateWith("css-dangling-var", [
            ["c.css", ".a{transform:translateX(var(--drift-x))}"],
            ["physics.ts", 'shape.style.setProperty("--drift-x", offset);'],
        ]);
        expect(found).toEqual([]);
    });
});

describe("the css-duplicate-components validator", () => {
    it("flags a base component defined in multiple non-page files", () => {
        const found = validateWith("css-duplicate-components", [
            ["components/buttons.css", ".btn { color: red; }"],
            ["components/forms.css", ".btn { color: blue; }"],
            ["components/x.css", ".unique { color: green; }"],
        ]);
        expect(found).toHaveLength(TWO);
        expect(found.every((finding) => finding.message.includes(".btn"))).toBe(true);
    });

    it("ignores page files styling components", () => {
        const found = validateWith("css-duplicate-components", [
            ["components/buttons.css", ".btn { color: red; }"],
            ["pages/home/home.css", ".btn { color: blue; }"],
        ]);
        expect(found).toEqual([]);
    });
});
