import { convertText, exportText, nounFor } from "@banes-lab/web/core/converters/text.converter.ts";
import { describe, expect, it } from "vitest";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

describe("nounFor", () => {
    it("takes the singular for exactly one and the plural for every other count", () => {
        expect(nounFor(1, "file", "files")).toBe("file");
        expect(nounFor(0, "file", "files")).toBe("files");
        expect(nounFor(12, "file", "files")).toBe("files");
    });
});

const HEADING = "Title";
const BODY = "Body text";
const CODE = "let x = 1;";
const SKIPPED = "skip-me";

const fixture = function fixture(): HTMLElement {
    return createElement("section", {
        children: [
            createElement("h2", { text: HEADING }),
            createElement("p", { text: BODY }),
            createElement("ul", { children: [createElement("li", { text: BODY })] }),
            createElement("pre", { children: [createElement("code", { text: CODE })] }),
            createElement("button", { className: SKIPPED, text: SKIPPED }),
        ],
    });
};

describe("convertText", () => {
    it("renders headings as markdown headings at their level and lists as bullets", () => {
        const text = convertText(fixture(), [`.${SKIPPED}`]);
        expect(text.startsWith(`## ${HEADING}`)).toBe(true);
        expect(text).toContain(`- ${BODY}`);
    });

    it("fences the code inside a pre block, leaving its chrome out, and drops ignored selectors", () => {
        const text = convertText(fixture(), [`.${SKIPPED}`]);
        expect(text).toContain("```");
        expect(text).toContain(CODE);
        expect(text).not.toContain(SKIPPED);
        const chromed = createElement("pre", {
            children: [createElement("span", { text: "Header" }), createElement("code", { text: CODE })],
        });
        expect(convertText(chromed, [])).not.toContain("Header");
    });

    it("writes a code block's title as its own paragraph above the fence", () => {
        const mark = createElement("span", { text: "H1·a" });
        const titled = createElement("pre", {
            children: [
                createElement("div", {
                    children: [createElement("span", { children: [mark, "a policy file"], className: "code-title" })],
                }),
                createElement("code", { text: CODE }),
            ],
        });
        expect(convertText(titled, [])).toBe(`H1·a a policy file\n\n\`\`\`\n${CODE}\n\`\`\``);
    });

    it("keeps a link inside emphasis and puts the spacing outside the marks", () => {
        const paragraph = createElement("p", {
            children: [
                "With it: ",
                createElement("em", {
                    children: [
                        "one limit with ",
                        createElement("a", { attributes: { href: "/x" }, text: "one home" }),
                        "; not in scope ",
                    ],
                }),
                "end",
            ],
        });
        expect(convertText(paragraph, [])).toBe("With it: *one limit with [one home](/x); not in scope* end");
    });

    it("collapses runs of blank lines", () => {
        expect(convertText(fixture(), []).includes("\n\n\n")).toBe(false);
    });

    it("keeps the spacing around inline marks, inside list items too", () => {
        const paragraph = createElement("p", {
            children: ["a ", createElement("strong", { text: "b" }), " c, ", createElement("code", { text: "d" }), "."],
        });
        expect(convertText(paragraph, [])).toBe("a **b** c, `d`.");
        const item = createElement("ul", {
            children: [createElement("li", { children: [createElement("em", { text: "e" }), " f"] })],
        });
        expect(convertText(item, [])).toBe("- *e* f");
    });

    it("keeps a definition list readable: a bold term line, its parts separated, and the definition as its own paragraph", () => {
        const list = createElement("dl", {
            children: [
                createElement("dt", {
                    children: [createElement("span", { text: "Term" }), createElement("span", { text: "kind" })],
                }),
                createElement("dd", { text: "The definition." }),
                createElement("dt", { text: "Other" }),
                createElement("dd", { text: "Another." }),
            ],
        });
        expect(convertText(list, [])).toBe("**Term · kind**\n\nThe definition.\n\n**Other**\n\nAnother.");
    });

    it("separates a term's name from its short code when both sit inside one heading span", () => {
        const term = createElement("dt", {
            children: [
                createElement("span", {
                    children: [
                        createElement("span", { text: "Dependency Injection" }),
                        createElement("span", { text: "DI" }),
                    ],
                }),
                createElement("span", { text: "pattern" }),
            ],
        });
        expect(convertText(term, [])).toBe("**Dependency Injection · DI · pattern**");
    });

    it("separates a heading's title from its subtitle when the heading is built from two elements", () => {
        const heading = createElement("h2", {
            children: [
                createElement("a", { text: "Methodology" }),
                createElement("small", { text: "Disciplined Methodology" }),
            ],
        });
        const words = createElement("h1", {
            children: [createElement("span", { text: "Structured" }), " ", createElement("span", { text: "AI" })],
        });
        expect(convertText(heading, [])).toBe("## Methodology · Disciplined Methodology");
        expect(convertText(words, [])).toBe("# Structured AI");
    });

    it("exports an element's settled text rather than the frame it is animating through", () => {
        const stat = createElement("p", {
            children: [createElement("b", { attributes: { "data-settled-text": "446" }, text: "12" }), " principles"],
        });
        expect(convertText(stat, [])).toBe("**446** principles");
    });

    it("starts an inline element that follows a list on its own line", () => {
        const card = createElement("div", {
            children: [
                createElement("ul", { children: [createElement("li", { text: "Optional support" })] }),
                createElement("a", { attributes: { href: "mailto:me@example.com" }, text: "Request" }),
            ],
        });
        expect(convertText(card, [])).toBe("- Optional support\n[Request](mailto:me@example.com)");
    });

    it("keeps a heading made of text as it is", () => {
        expect(convertText(createElement("h2", { text: "Title" }), [])).toBe("## Title");
    });

    it("keeps a link as a markdown link and a caption as its own paragraph", () => {
        const figure = createElement("figure", {
            children: [
                createElement("p", {
                    children: [
                        "See ",
                        createElement("a", {
                            attributes: { href: "/ontology#architecture-modularity" },
                            text: "modularity",
                        }),
                        ".",
                    ],
                }),
                createElement("figcaption", { text: "A caption." }),
            ],
        });
        expect(convertText(figure, [])).toBe("See [modularity](/ontology#architecture-modularity).\n\nA caption.");
    });

    it("separates sibling blocks and touching elements, keeps a suffix glued to a link, and honors a line break", () => {
        const gate = createElement("a", {
            attributes: { href: "#a" },
            children: [createElement("span", { text: "A1·a" }), "the gate"],
        });
        const stats = createElement("div", {
            children: [
                createElement("div", {
                    children: [createElement("span", { text: "Files" }), createElement("span", { text: "1" })],
                }),
                createElement("div", {
                    children: [createElement("span", { text: "Lines" }), createElement("span", { text: "154" })],
                }),
                createElement("nav", {
                    children: [
                        createElement("a", { attributes: { href: "#root" }, text: "root" }),
                        createElement("a", { attributes: { href: "#core" }, text: "core" }),
                    ],
                }),
                createElement("p", { children: [gate, "'s edge", createElement("br"), "next line"] }),
            ],
        });
        expect(convertText(stats, [])).toBe(
            "Files 1\n\nLines 154\n\n[root](#root) [core](#core)\n\n[A1·a the gate](#a)'s edge\nnext line",
        );
    });

    it("leaves the source element untouched", () => {
        const source = fixture();
        convertText(source, [`.${SKIPPED}`]);
        expect(source.querySelector(`.${SKIPPED}`)).not.toBeNull();
    });
});

describe("exportText", () => {
    it("converts a page for export with the navigation chrome dropped", () => {
        const page = createElement("div", {
            children: [
                createElement("div", { className: "tab-anchor", text: "Tabs" }),
                createElement("p", { text: BODY }),
            ],
        });
        const text = exportText(page);
        expect(text).toContain(BODY);
        expect(text).not.toContain("Tabs");
    });
});
