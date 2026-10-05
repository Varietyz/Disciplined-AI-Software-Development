import { ROOT, absolutePath } from "@ssot/paths";
import {
    analyzeSync,
    docMeta,
    docNodeFor,
    locationEntryOf,
    nameFindingFor,
    refScanOf,
} from "@govlab/docs/core/analyzers/document.analyzer.ts";
import { describe, expect, it } from "vitest";
import { docsHostFor } from "@govlab/docs/core/factories/environment.factory.ts";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const host = await docsHostFor(ROOT);
const GUIDE = join(absolutePath("docArch"), "guides", "scale-govlab-docs.govlab.guide.md");
const guideMeta = docMeta(host.ctx, GUIDE, readFileSync(GUIDE, "utf8"));
const README = join(absolutePath("govlab.docs"), "README.md");
const readmeMeta = docMeta(host.ctx, README, readFileSync(README, "utf8"));

describe("docMeta", () => {
    it("reads the frontmatter and the placement facts of a document", () => {
        expect(guideMeta.fmType).toBe("guide");
        expect(guideMeta.docFilename).toBe("scale-govlab-docs.govlab.guide.md");
        expect(guideMeta.harnessOwned).toBe(false);
    });
});

describe("the per-document checks", () => {
    it("find the routed guide clean on location, spine and naming", () => {
        const all = analyzeSync(host.ctx, guideMeta);
        expect(all["location"]).toStrictEqual([]);
        expect(all["spine"]).toStrictEqual([]);
        expect(nameFindingFor(host.ctx, guideMeta)).toBeNull();
        expect(refScanOf(host.ctx, guideMeta).defects).toStrictEqual([]);
    });

    it("give a routed document a graph node and a location entry, and a boundary document neither", () => {
        expect(docNodeFor(host.ctx, guideMeta)?.name).toBe("scale-govlab-docs");
        expect(locationEntryOf(host.ctx, guideMeta)).toMatchObject({ member: "govlab", name: "scale-govlab-docs" });
        expect(docNodeFor(host.ctx, readmeMeta)).toBeNull();
        expect(locationEntryOf(host.ctx, readmeMeta)).toBeNull();
    });
});
