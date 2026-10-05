import { createResolver, refOf } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { describe, expect, it } from "vitest";
import { PAG_FACE } from "@govlab/constants";
import { createGovlabContext } from "@govlab/context";
import { grammarOf } from "@banes-lab/build-scripts/core/converters/grammar.converter.ts";
import { pagReferencesOf } from "@banes-lab/build-scripts/core/converters/grammar.reference.converter.ts";

const context = createGovlabContext();
const grammar = grammarOf(context, createResolver(context));
const index = pagReferencesOf(grammar);

describe("pagReferencesOf", () => {
    it("keys each document type and template record by its anchor under the grammar face", () => {
        for (const documentType of grammar.documentTypes) {
            expect(index[refOf(PAG_FACE, documentType.anchor)]?.name).toBe(documentType.type);
        }
        for (const template of grammar.templates) {
            expect(index[refOf(PAG_FACE, template.anchor)]?.name).toBe(template.title);
        }
    });

    it("carries a keyword's primary meaning as its summary", () => {
        const [keyword] = grammar.categories.flatMap((category) => category.keywords);
        expect(keyword === undefined ? null : index[refOf(PAG_FACE, keyword.anchor)]?.summary).toBe(
            keyword?.roles[0].meaning ?? null,
        );
    });
});
