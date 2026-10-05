import {
    DUPLICATE_CONCERN_FOLDER,
    DUPLICATE_CONCERN_TAG,
    TAXONOMY_MESSAGES,
    ambiguousContainer,
    ambiguousCoordinate,
    bucketNotConcern,
    containerAndBucket,
    doubleBoundExtension,
    duplicateContainer,
    duplicateSplitter,
    emptyRoot,
    extensionIgnore,
    malformedJoiner,
    markerShadowsConcern,
    mirrorIsRoot,
    noSplitter,
    redundantSubject,
    rootScope,
    shallowCap,
    taxonomyFindingLine,
    taxonomySummary,
    unboundDialect,
    unboundTestMarker,
    undeclaredBucketRoot,
    undeclaredConcernTag,
    undeclaredContainerPath,
    undeclaredTierContainer,
    unknownMirrorSource,
    unknownSplitter,
    unresolvedCoordinate,
    wildcardIgnore,
} from "@ssot/govlab/shared/strings/taxonomy.strings.ts";
import { describe, expect, it } from "vitest";

describe("the taxonomy declaration errors", () => {
    it("name the root, container, tag, pattern or case each refusal is about", () => {
        expect([DUPLICATE_CONCERN_TAG, DUPLICATE_CONCERN_FOLDER].every((text) => text.startsWith("taxonomy: "))).toBe(
            true,
        );
        expect(redundantSubject("registry")).toContain("'registry' is declared in subjects");
        expect(markerShadowsConcern("test")).toContain("'test' is both a compound marker");
        expect(emptyRoot("root")).toContain("root 'root' declares no containers");
        expect(duplicateContainer("root")).toContain("declares a container twice");
        expect(containerAndBucket("root", "types")).toContain("'types' in both containers and specialContainers");
        expect(bucketNotConcern("root", "misc")).toContain("the special container 'misc'");
        expect(wildcardIgnore("*")).toContain("only wildcards");
        expect(extensionIgnore("*.md")).toContain("a whole file extension");
        expect(unknownSplitter("screaming", ["kebab", "camel"])).toContain("the splitter 'screaming'");
        expect(unknownSplitter("screaming", ["kebab", "camel"])).toContain("one of kebab, camel");
        expect(duplicateSplitter("snake")).toContain("declares 'snake' twice");
        expect(malformedJoiner("ex", "x")).toContain("joins words with 'x'");
        expect(unboundDialect("pascal")).toContain("binds no extension");
        expect(doubleBoundExtension("kt")).toContain("bound by two dialects");
        expect(undeclaredBucketRoot("root")).toContain("specialContainers names 'root'");
        expect(shallowCap("1", 2)).toContain("maxDepthFromRoot is 1");
        expect(unboundTestMarker("probe")).toContain("testMarkers names 'probe'");
        expect(unknownMirrorSource("test.x", "x")).toContain("maps 'test.x' to 'x'");
        expect(mirrorIsRoot("test.x")).toContain("'test.x' is both a test mirror and a declared root");
    });

    it("name the container, coordinate or tag a lookup could not resolve", () => {
        expect(undeclaredTierContainer("core", "web")).toContain('"core" is not a declared container of "web"');
        expect(noSplitter("screaming")).toContain("no declared splitter is named 'screaming'");
        expect(undeclaredContainerPath("core", rootScope("web"))).toContain(
            "'core' is not a declared container of root 'web'",
        );
        expect(ambiguousContainer("core", ["a/core/", "b/core/"])).toContain("(a/core/, b/core/)");
        expect(unresolvedCoordinate("form", "validator")).toContain("the subject 'form' with the concern 'validator'");
        expect(ambiguousCoordinate("form", "validator", ["a", "b"])).toContain("'form.validator' resolves to 2 files");
        expect(undeclaredConcernTag("gadget")).toContain("'gadget' is not a declared concern tag");
    });
});

describe("the taxonomy gate output", () => {
    it("renders a message for every finding the walk emits, naming its operands", () => {
        expect(Object.keys(TAXONOMY_MESSAGES).toSorted()).toStrictEqual([
            "badShape",
            "concernMismatch",
            "generatedFolderIntruder",
            "looseFileAtRoot",
            "markerFolderIntruder",
            "markerMisplaced",
            "misplacedTest",
            "missingContainer",
            "missingRoot",
            "nestedInSpecial",
            "nonTestInMirror",
            "undeclaredContainer",
            "ungovernedFile",
            "ungovernedTree",
            "unmirroredTest",
            "unparsable",
        ]);
        expect(TAXONOMY_MESSAGES["unmirroredTest"]?.({ basename: "a.test.ts", source: "web", subject: "a" })).toContain(
            "'a.test.ts' names the subject 'a'",
        );
        expect(TAXONOMY_MESSAGES["looseFileAtRoot"]?.({ name: "notes.md", root: "web" })).toContain(
            "'notes.md' sits directly in the governed root 'web'",
        );
    });

    it("prints a finding line, an uncovered tree and the summary", () => {
        expect(taxonomyFindingLine("web/a.ts", "badShape", "x")).toBe("✖ web/a.ts [badShape] x\n");
        expect(TAXONOMY_MESSAGES["ungovernedTree"]?.({ files: "3" })).toContain("This tree holds 3 text files");
        expect(taxonomySummary(0, 10, 2)).toContain("0 finding(s) across 10 files in 2 governed roots");
    });
});
