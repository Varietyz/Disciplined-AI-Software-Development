import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import {
    brokenPathsIn,
    governDeclaredDocs,
    governManifest,
    hostCouplingIn,
} from "@govlab/docs/core/validators/manifest.prose.validator.ts";
import { describe, expect, it } from "vitest";
import { DOC_CONCERNS } from "@govlab/docs/configuration/constants/concern.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import type { DiscoveredModule } from "@govlab/docs/types/readme.types.ts";

const MODULE_DIR = absolutePath("govlab.utils.contentFingerprint");
const MODULE_PATH = relativePath("govlab.utils.contentFingerprint");
const HOST_TOKENS = [`${relativePath("app.root")}/`];
const BASE_DOCS = {
    aiContext: ["a leaf"],
    configuration: "no options",
    disposal: ["remove it"],
    overview: "Does a thing.",
    quickStart: "run it",
    whenNotToUse: ["b"],
    whenToUse: ["a"],
};

const moduleWith = function moduleWith(docs: Record<string, unknown>): DiscoveredModule {
    return { axis: "utils", dir: MODULE_DIR, manifest: { docs }, slug: "content-fingerprint" };
};

const axesOf = function axesOf(docs: Record<string, unknown>): string[] {
    return governManifest(moduleWith(docs), ROOT, HOST_TOKENS).map((finding) => `${finding.field}:${finding.axis}`);
};

describe("governManifest", () => {
    it("is clean on well-formed docs strings and on a real path", () => {
        expect(axesOf(BASE_DOCS)).toStrictEqual([]);
        expect(axesOf({ ...BASE_DOCS, disposal: [`Remove \`${MODULE_PATH}/\`.`] })).toStrictEqual([]);
    });

    it("reports a history term, a broken path and a host path at their fields", () => {
        expect(axesOf({ ...BASE_DOCS, overview: "This no longer works." })).toContain("overview:history-smell");
        expect(axesOf({ ...BASE_DOCS, overview: "See `nonexistent-dir/gone.ts` for details." })).toContain(
            "overview:broken-path",
        );
        const hostPath = `${relativePath("app.member")}/core/registries/base.registry.ts`;
        expect(axesOf({ ...BASE_DOCS, disposal: [`Remove the import in \`${hostPath}\`.`] })).toContain(
            "disposal:host-coupling",
        );
    });
});

describe("brokenPathsIn and hostCouplingIn", () => {
    it("read the paths of a fragment against the module and the host tokens", () => {
        expect(brokenPathsIn("See `nonexistent-dir/gone.ts`.", MODULE_DIR, ROOT)).toStrictEqual([
            "nonexistent-dir/gone.ts",
        ]);
        expect(hostCouplingIn(`See \`${relativePath("app.member")}/x.ts\`.`, HOST_TOKENS)).toHaveLength(1);
        expect(hostCouplingIn(`See \`${MODULE_PATH}/x.ts\`.`, HOST_TOKENS)).toStrictEqual([]);
    });
});

describe("governDeclaredDocs", () => {
    it("reports a hardcoded count in a declared document section", () => {
        const context = {
            consumerRoot: ROOT,
            hostTokens: HOST_TOKENS,
            options: {},
            registries: { concerns: DOC_CONCERNS, forms: DOC_FORMS },
        };
        const documents = [
            {
                body: [{ content: "It holds 1,284 rules today.", heading: "Rules" }],
                concern: "quality",
                name: "x",
                summary: "s",
                type: "reference",
            },
        ];
        const module: DiscoveredModule = {
            axis: "utils",
            dir: MODULE_DIR,
            manifest: { documents },
            slug: "content-fingerprint",
        };
        expect(governDeclaredDocs(module, context).map((finding) => finding.axis)).toContain("magic-number");
    });
});
