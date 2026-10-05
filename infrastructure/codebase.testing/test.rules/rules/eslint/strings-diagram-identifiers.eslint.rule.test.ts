import { DIAGRAM_HEADERS, DIAGRAM_KEYWORDS } from "@ssot/govlab/shared/manifests/diagram.manifest.ts";
import { describe, expect, it } from "vitest";
import { isDiagramSource, reservedNodeIdsOf } from "@ssot/govlab/shared/analyzers/diagram.analyzer.ts";
import { Linter } from "eslint";
import stringsDiagramIdentifiers from "@ssot/govlab/rules/eslint/strings-diagram-identifiers.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-diagram-identifiers": stringsDiagramIdentifiers } } },
    rules: { "local/strings-diagram-identifiers": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const NL = String.fromCodePoint(10);

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const diagram = function diagram(...lines: readonly string[]): string {
    return ["flowchart TB", ...lines.map((line) => `    ${line}`)].join(NL);
};

const stringsModule = function stringsModule(source: string): string {
    return `const D = ${JSON.stringify(source)};${NL}export const S = { caption: "c", kind: "mermaid", text: D };`;
};

describe("reservedNodeIdsOf", () => {
    it("reports a keyword declared as a node or used as an edge end", () => {
        const found = reservedNodeIdsOf(
            diagram('a["A"]', 'class["One class"]', "a --> class", "end --- a", "a -->|label| style"),
        );
        expect(found.map((hit) => `${hit.line}:${hit.word}`)).toStrictEqual(["3:class", "4:class", "5:end", "6:style"]);
    });

    it("accepts the keywords in their own positions and inside labels, brackets and quotes", () => {
        const found = reservedNodeIdsOf(
            diagram(
                'subgraph core["The end of the class"]',
                'subgraph graph["A group may carry the word"]',
                "direction TB",
                'inner["default"]',
                "end",
                "a -- the default --> b",
                "a -. by class .-> b",
                "class a b important",
                "style a fill:#fff",
            ),
        );
        expect(found).toStrictEqual([]);
    });

    it("recognizes a diagram by its header and holds the keyword set in data", () => {
        expect(isDiagramSource("flowchart LR")).toBe(true);
        expect(isDiagramSource("Plain prose")).toBe(false);
        expect(DIAGRAM_HEADERS.has("graph")).toBe(true);
        expect(DIAGRAM_KEYWORDS.has("class")).toBe(true);
    });
});

describe("strings-diagram-identifiers", () => {
    it("reports a reserved node identifier in a diagram block of a strings module, through the named const", () => {
        const msgs = lint(stringsModule(diagram('class["One class"]', "a --> class")), STRINGS_FILE);
        expect(msgs).toHaveLength(2);
        expect(msgs.every((msg) => msg.messageId === "reservedNodeId")).toBe(true);
    });

    it("accepts a diagram whose node identifiers avoid the keywords", () => {
        const clean = stringsModule(diagram('decay["One class"]', "a --> decay"));
        expect(lint(clean, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module and outside a diagram block", () => {
        const reserved = stringsModule(diagram('class["One class"]'));
        const outsideBlock = JSON.stringify(diagram('class["x"]'));
        expect(lint(reserved, OTHER_FILE)).toHaveLength(0);
        expect(lint(`export const X = ${outsideBlock};`, STRINGS_FILE)).toHaveLength(0);
    });
});
