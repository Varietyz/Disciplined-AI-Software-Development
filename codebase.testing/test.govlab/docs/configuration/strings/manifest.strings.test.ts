import {
    computedField,
    customDocsField,
    deliverMode,
    documentBody,
    documentConcern,
    documentLead,
    documentMember,
    documentName,
    documentObject,
    documentSummary,
    documentTitle,
    documentType,
    domainObject,
    duplicateDocument,
    duplicateDomain,
    indentedError,
    manifestErrorCount,
    manifestsValid,
    missingDocsField,
    moduleError,
    nonEmptyField,
    relationshipShape,
    sectionContent,
    sectionHeading,
    selfGovernedField,
    selfGovernedShape,
    unknownConcept,
    unknownContract,
    unknownDomainMeta,
    unknownDomainSub,
    unknownKey,
    unknownPrinciple,
    unknownSectionKey,
    unknownSurface,
    unknownVisibilityKey,
    visibilityFlag,
} from "@govlab/docs/configuration/strings/manifest.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the manifest field strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [nonEmptyField("label"), "'label'"],
                [visibilityFlag("hidden"), "visibility.hidden"],
                [unknownVisibilityKey("odd"), "'odd'"],
                [relationshipShape("pairsWith"), "'pairsWith'"],
                [computedField("api"), "'api'"],
                [unknownKey("odd"), "'odd'"],
                [unknownSectionKey("docs", "odd"), "docs key 'odd'"],
                [unknownContract("c1"), "'c1'"],
                [unknownPrinciple("p1"), "'p1'"],
                [unknownSurface("s1"), "'s1'"],
                [unknownConcept("k1"), "'k1'"],
                [deliverMode("source | build"), "source | build"],
                [missingDocsField("overview"), "'overview'"],
                [customDocsField("the-thing"), "'the-thing'"],
            ]),
        ).toStrictEqual([]);
    });
});

const AT = "documents[0]";

describe("the manifest document, domain and report strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [documentType(AT, "memo"), `${AT}.type 'memo'`],
                [documentConcern(AT, "odd"), "concern 'odd'"],
                [documentMember(AT, "ghost", "govlab"), "member 'ghost'"],
                [sectionHeading(AT, 2), "body[2].heading"],
                [sectionContent(AT, 2), "body[2].content"],
                [documentBody(AT), `${AT}.body`],
                [documentObject(AT), `${AT} must be an object`],
                [documentName(AT), `${AT}.name`],
                [documentSummary(AT), `${AT}.summary`],
                [documentTitle(AT), `${AT}.title`],
                [documentLead(AT), `${AT}.lead`],
                [duplicateDocument(1, "x"), "documents[1].name 'x'"],
                [domainObject("domains[0]"), "domains[0] must be an object"],
                [unknownDomainMeta("domains[0]", "odd"), "meta 'odd'"],
                [unknownDomainSub("domains[0]", "odd", "ai"), "sub 'odd' is not a sub-domain of 'ai'"],
                [duplicateDomain(1, "ai/speech"), "domains[1] 'ai/speech'"],
                [selfGovernedShape("selfGoverned"), "'selfGoverned'"],
                [selfGovernedField("selfGoverned", "checker"), "selfGoverned.checker"],
                [moduleError("mod", "bad"), "mod: bad"],
                [manifestErrorCount(3), "3 manifest error(s)"],
                [manifestsValid(8), "8 manifest(s) valid"],
                [indentedError("bad"), "   bad"],
            ]),
        ).toStrictEqual([]);
    });
});
