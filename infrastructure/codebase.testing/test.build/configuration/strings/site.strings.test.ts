import {
    EMPTY_MAIN,
    EXCLUDED_ROUTE,
    INDEXED_ERROR_PAGE,
    NO_ORGANIZATION,
    WEAK_DESCRIPTION,
    cachedGive,
    duplicateGiver,
    duplicateStep,
    missingNeed,
    missingOntology,
    missingText,
    missingWebPage,
    skippedLine,
    stepLine,
    strayRoute,
    stuckSteps,
    trainingConsent,
    undeclaredGive,
    unlistedRoute,
    unservedEncoding,
    unservedLink,
    weakTitle,
    wrongAlternate,
    wrongCanonical,
} from "@banes-lab/build-scripts/configuration/strings/site.strings.ts";
import { describe, expect, it } from "vitest";

describe("the site pipeline lines", () => {
    it("name the step and the key each refusal is about, with its way out", () => {
        expect(stepLine("icons", 12.4, 1023.6)).toBe("site: icons finished in 12 ms, process at 1024 MB resident\n");
        expect(missingNeed("graph", "ontology")).toContain("the graph step needs ontology");
        expect(duplicateStep("icons")).toContain("two step files register the name icons");
        expect(duplicateGiver("ontology", "a", "b")).toContain("the a and b steps both give ontology");
        expect(stuckSteps(["a", "b"])).toContain("the steps a, b need each other in a cycle");
        expect(undeclaredGive("icons", "glyphs")).toContain("the icons step returned glyphs");
        expect(missingOntology("graph")).toContain("Declare ontology in the step's needs.");
        expect(skippedLine("chapters")).toContain("site: chapters skipped");
        expect(cachedGive("chapters", "ontology")).toContain("declares a cache and returned ontology");
    });
});

describe("trainingConsent", () => {
    it("states the consent and asks for attribution to the author and the site", () => {
        expect(trainingConsent("Yes.", "Ada", "https://x.test")).toContain(
            "attribute it to Ada and cite https://x.test",
        );
    });
});

describe("the site findings", () => {
    it("name the address, title, link or fragment each finding is about", () => {
        expect(
            [NO_ORGANIZATION, EXCLUDED_ROUTE, INDEXED_ERROR_PAGE, EMPTY_MAIN, WEAK_DESCRIPTION].every((text) =>
                text.endsWith("."),
            ),
        ).toBe(true);
        expect(missingWebPage("https://x.test/a")).toContain("web page entity for https://x.test/a");
        expect(wrongAlternate("JSON", "a", "b")).toBe("The JSON alternate link is a, expected b.");
        expect(weakTitle("Terms")).toContain('The title "Terms"');
        expect(wrongCanonical("a", "b")).toBe("The canonical link is a, expected b.");
        expect(unlistedRoute("https://x.test/a")).toBe("The sitemap does not list https://x.test/a.");
        expect(strayRoute("https://x.test/b")).toContain("which is not a registered page");
        expect(missingText("## Query")).toBe('Expected to find "## Query".');
        expect(unservedLink("/gone")).toBe("Links to /gone, which no pre-rendered route serves.");
        expect(unservedEncoding("https://x.test/a")).toContain("names https://x.test/a as an encoding");
    });
});
