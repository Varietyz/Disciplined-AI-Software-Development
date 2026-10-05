import { describe, expect, it } from "vitest";
import { MISSING_BUILD_FILE } from "@banes-lab/build-scripts/configuration/strings/validation.strings.ts";
import { fileForPath } from "@banes-lab/build-scripts/core/resolvers/page.resolver.ts";
import { sourcePageFindings } from "@banes-lab/build-scripts/core/validators/source.page.validator.ts";

const MISSING_PAGE = "/anatomy/no-such-tree/no-such-node";

describe("sourcePageFindings", () => {
    it("names a source page the build did not write", () => {
        const findings = sourcePageFindings([MISSING_PAGE], new Set(), { descriptions: new Set(), titles: new Set() });
        expect(findings).toContainEqual({ file: fileForPath(MISSING_PAGE), message: MISSING_BUILD_FILE });
    });
});
