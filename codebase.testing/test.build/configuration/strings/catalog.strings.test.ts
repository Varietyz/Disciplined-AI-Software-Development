import {
    CANONICAL_FORM,
    FACETS_INDEX_TITLE,
    GRAMMAR_LEVELS,
    JOURNAL_SHAPE,
    NO_CATALOG_SITEMAP,
    NO_ID_MANIFEST,
    NO_MANIFEST_HEAD,
    PAGES_INDEX_TITLE,
    RECORDS_INDEX_TITLE,
    SCHEMA_DESCRIPTION,
    SEARCH_KIND_LABELS,
    SOURCES_INDEX_TITLE,
    UNLISTED_LEAF,
    closureTitle,
    driftedLiteral,
    duplicateAddress,
    duplicateRef,
    emptyIndex,
    indexPartTitle,
    journalFieldNotObject,
    malformedJournal,
    markdownMissing,
    missingLeaf,
    missingMarkdownLeaf,
    noMarkdownForm,
    noReverse,
    noRoute,
    nonStringValue,
    overBudget,
    queryParametersOf,
    reservedPageId,
    schemaShapeDefect,
    schemaTypeDefect,
    schemaUndeclared,
    schemaUnrequired,
    searchKindTitle,
    searchShardTitle,
    sharedSlug,
    staleLeaf,
    strayInSitemap,
    undeclaredRelation,
    unexampledRow,
    unknownAddress,
    unlistedInSitemap,
    unmatchedAddress,
    unsafeSegment,
    unservedAddress,
    unslugged,
    untitledCollection,
    untitledGroup,
    versionLine,
} from "@banes-lab/build-scripts/configuration/strings/catalog.strings.ts";
import { describe, expect, it } from "vitest";

describe("the catalog build errors", () => {
    it("name the address, ref, id, group or entry each refusal is about", () => {
        expect(duplicateAddress("/json/a")).toContain("two leaves claim the address /json/a");
        expect(duplicateRef("api:a")).toContain("two leaves claim the ref api:a");
        expect(reservedPageId("api")).toContain('the page id "api" collides');
        expect(unsafeSegment("..")).toContain('the address segment ".."');
        expect(untitledGroup("x")).toContain('the address group "x" has no title');
        expect(untitledCollection("x")).toContain('the collection "x" has no title');
        expect(NO_MANIFEST_HEAD).toContain("id manifest head is missing");
        expect(nonStringValue("COMPANY_NAME")).toContain("COMPANY_NAME is not a string");
        expect(noReverse("requires", "a")).toContain('"requires" from a has no reverse');
        expect(noRoute("faq", "null")).toContain('page "faq" and tab "null"');
        expect(sharedSlug("lexicon", "kind", "A b", "a-b")).toContain('"A b" and "a-b" share one slug');
        expect(journalFieldNotObject("refs")).toContain("the refs field is not an object");
        expect(malformedJournal("refs", ["api:a"])).toContain("malformed refs entries for api:a");
        expect(JOURNAL_SHAPE).toContain("refs and moved");
    });
});

describe("the catalog findings", () => {
    it("name the ref, the address or the leaf each finding is about", () => {
        expect([NO_ID_MANIFEST, NO_CATALOG_SITEMAP, UNLISTED_LEAF].every((text) => text.endsWith("."))).toBe(true);
        expect(missingLeaf("api:x")).toContain("lists api:x, whose leaf");
        expect(staleLeaf("api:x")).toContain("fingerprint for api:x");
        expect(missingMarkdownLeaf("api:x")).toContain("Markdown form of api:x");
        expect(unservedAddress("https://x.test/y")).toBe("Names https://x.test/y, which the build does not serve.");
        expect(unlistedInSitemap("api/x.md")).toBe("The catalog sitemap does not list api/x.md.");
        expect(strayInSitemap("api/x.md")).toContain("lists api/x.md, which is not a catalog leaf");
        expect(undeclaredRelation("drifts")).toContain("the relation drifts, which the query contract does not list");
    });
});

describe("the index titles and grammar levels", () => {
    it("are phrases without a full stop", () => {
        const phrases = [
            PAGES_INDEX_TITLE,
            RECORDS_INDEX_TITLE,
            SOURCES_INDEX_TITLE,
            FACETS_INDEX_TITLE,
            ...Object.values(GRAMMAR_LEVELS),
        ];
        expect(phrases.every((phrase) => phrase.length > 0 && !phrase.endsWith("."))).toBe(true);
        expect(GRAMMAR_LEVELS.searchKind).toContain("one file of words per first letter");
    });
});

describe("the index part and budget copy", () => {
    it("titles a part by its place and states a file's size against the budget", () => {
        expect(indexPartTitle("Lexicon terms", 2, 3)).toBe("Lexicon terms, part 2 of 3");
        expect(closureTitle("Verify")).toBe("Verify and the contracts it depends on");
        expect(markdownMissing("https://x.test")).toContain("listed at https://x.test/api.md.");
        expect(unmatchedAddress("/json/x")).toContain("/json/x, which matches no row");
        expect(unexampledRow("/json/{x}")).toContain("publishes no address of that shape");
        expect(unslugged("A B")).toContain("key A B");
        expect(driftedLiteral("site")).toContain("nginx site file site");
        expect(SCHEMA_DESCRIPTION.endsWith(".")).toBe(true);
        expect(unknownAddress("/x")).toBe("catalog: the address /x matches no row of the address grammar");
        expect(versionLine(2, "2026-09-25", "b1")).toBe("Catalog version 2, last changed on 2026-09-25, build b1.");
        expect(CANONICAL_FORM.startsWith("The JSON files under /json/")).toBe(true);
        expect(overBudget(600, 512)).toBe(
            "The catalog file is 600 bytes, over the 512-byte budget every catalog file has to fit.",
        );
    });
});

describe("the schema and grammar findings", () => {
    it("name the node, the key, the type or the template each finding is about", () => {
        expect(schemaShapeDefect("$.a", "items", "array")).toContain(
            "$.a carries items, which applies only to the type array",
        );
        expect(schemaTypeDefect("$.a", "string", ["number", "null"])).toContain("admits only number, null");
        expect(schemaUnrequired("$.a", "id")).toContain("$.a lacks id");
        expect(schemaUndeclared("$.a", "extra")).toContain("$.a holds extra");
        expect(noMarkdownForm("/json/api/x")).toContain("/json/api/x with no Markdown form");
        expect(emptyIndex("api:source/x")).toContain("The index api:source/x lists no entry");
    });
});

describe("the query parameters", () => {
    it("state the limits the query contract declares, so the text and the limits never drift", () => {
        const parameters = queryParametersOf({ defaultLimit: 7, depth: 2, limit: 9 });
        expect(parameters["depth"]).toBe("With walk, how many steps to follow, from 1 to 2");
        expect(parameters["limit"]).toBe("How many results to return, at most 9, and 7 when the request names none");
        expect(Object.keys(parameters)).toContain("kind");
    });
});

describe("the search titles", () => {
    it("name the kind of entry an index covers, and refuse a kind with no label", () => {
        expect([...SEARCH_KIND_LABELS.keys()]).toStrictEqual(["sections", "records", "files"]);
        expect(searchKindTitle("records")).toBe("Search index of ontology records");
        expect(searchShardTitle("files", "g")).toBe("Search index entries in source files for words that start with g");
        expect(() => searchKindTitle("pages")).toThrow("pages");
    });
});
