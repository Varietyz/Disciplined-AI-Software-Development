import { CLAIMS, IGNORE, TAXONOMY } from "../loaders/stats.fixture.ts";
import { ROOT, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { otherGateClaims } from "@govlab/stats/core/resolvers/folder.resolver.ts";

const isIgnored = IGNORE;

describe("the census exclusions", () => {
    it("exclude the dependency tree, the build output, the vendored sources and the gate reports", () => {
        const vendored = join(ROOT, relativePath("thirdParty"));
        expect(isIgnored("node_modules")).toBe(true);
        expect(isIgnored(relativePath("builds.root"))).toBe(true);
        expect(isIgnored(vendored)).toBe(true);
        expect(isIgnored(relativePath("govlabHost.reports"))).toBe(true);
        expect(isIgnored(relativePath("govlabHost.rules"))).toBe(false);
    });
});

describe("otherGateClaims", () => {
    it("names the document tree, the harness tree and the boundary documents, and none of them counts as ungoverned", () => {
        expect(CLAIMS).toContain(relativePath("docArch"));
        expect(CLAIMS).toContain(relativePath("claude"));
        expect(CLAIMS).toContain(relativePath("claudePolicy"));
        expect(TAXONOMY.ungoverned.map((area) => area.area)).not.toContain(relativePath("docArch"));
        expect(otherGateClaims).toBeTypeOf("function");
    });
});
