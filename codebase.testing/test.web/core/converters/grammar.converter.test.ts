import { describe, expect, it } from "vitest";
import {
    joinRules,
    keywordsOf,
    productionsOf,
    templateBodyOf,
    templateConstraintsOf,
} from "@banes-lab/web/core/converters/grammar.converter.ts";
import {
    missingKeywordCategory,
    missingProductionGroup,
    missingTemplate,
} from "@banes-lab/web/configuration/strings/report.strings.ts";
import { ONTOLOGY } from "@banes-lab/web/core/generated/ontology.generated.ts";

const FIRST = { grammar: "<a> ::= b", title: "First" };
const SECOND = { grammar: "<c> ::= d", title: "Second" };

const firstOf = function firstOf<T>(items: readonly T[]): T {
    const [first] = items;
    if (first === undefined) {
        throw new Error("The snapshot's grammar carries no records.");
    }
    return first;
};

describe("joinRules", () => {
    it("prefixes each rule with a heading and separates rules by a blank line", () => {
        expect(joinRules([FIRST, SECOND])).toBe(
            `# ${FIRST.title}\n${FIRST.grammar}\n\n# ${SECOND.title}\n${SECOND.grammar}`,
        );
    });

    it("yields an empty string for no rules", () => {
        expect(joinRules([])).toBe("");
    });
});

describe("keywordsOf", () => {
    it("reads one category of the snapshot's grammar into a keyword block, the role's meaning as description", () => {
        const category = firstOf(ONTOLOGY.grammar.categories);
        const keyword = firstOf(category.keywords);
        const block = keywordsOf(category.category);
        expect(block.kind).toBe("keyword");
        expect(block.keywords[0]).toStrictEqual({
            description: keyword.roles[0].meaning,
            example: keyword.roles[0].example,
            name: keyword.name,
        });
    });

    it("lists a keyword under every category it plays a role in", () => {
        const shared = ONTOLOGY.grammar.categories
            .flatMap((group) => group.keywords)
            .find((keyword) => keyword.roles.length > 1);
        expect(shared).toBeDefined();
        for (const role of shared?.roles ?? []) {
            const names = keywordsOf(role.category).keywords.map((entry) =>
                typeof entry === "string" ? entry : entry.name,
            );
            expect(names).toContain(shared?.name);
        }
    });

    it("lists a category's own keywords first and the further roles of other keywords after them", () => {
        const names = keywordsOf("contextual").keywords.map((entry) =>
            typeof entry === "string" ? entry : entry.name,
        );
        expect(names.indexOf("INTO")).toBeLessThan(names.indexOf("FOR"));
        expect(names.slice(-4)).toStrictEqual(["FOR", "IN", "FROM", "TO"]);
    });

    it("refuses a category no keyword plays a role in", () => {
        expect(() => keywordsOf("no-such-category")).toThrow(missingKeywordCategory("no-such-category"));
    });
});

describe("productionsOf", () => {
    it("renders one production group as BNF lines under the given title", () => {
        const group = firstOf(ONTOLOGY.grammar.groups);
        const production = firstOf(group.productions);
        const rule = productionsOf(group.group, "Title");
        const lines = rule.grammar.split("\n");
        expect(rule.title).toBe("Title");
        expect(lines).toHaveLength(group.productions.length);
        expect(lines[0]).toBe(`<${production.lhs}> ::= ${production.rhs}`);
    });

    it("refuses a group the snapshot does not carry", () => {
        expect(() => productionsOf("no-such-group", "Title")).toThrow(missingProductionGroup("no-such-group"));
    });
});

describe("templateBodyOf and templateConstraintsOf", () => {
    it("read the body and the constraints of a template record by type", () => {
        const template = firstOf(ONTOLOGY.grammar.templates);
        expect(templateBodyOf(template.type)).toBe(template.body);
        expect(templateConstraintsOf(template.type)).toStrictEqual(template.constraints);
    });

    it("refuse a type the snapshot does not carry", () => {
        expect(() => templateBodyOf("NO_SUCH_TYPE")).toThrow(missingTemplate("NO_SUCH_TYPE"));
        expect(() => templateConstraintsOf("NO_SUCH_TYPE")).toThrow(missingTemplate("NO_SUCH_TYPE"));
    });
});
