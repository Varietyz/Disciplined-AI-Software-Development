import { codeTargetRefOf, evidenceTargetOf } from "@banes-lab/build-scripts/core/resolvers/evidence.resolver.ts";
import { describe, expect, it } from "vitest";
import { fileId, folderId } from "@banes-lab/web/domain/converters/source.converter.ts";
import { ANATOMY_PREFIX } from "@banes-lab/build-scripts/configuration/constants/graph.constants.ts";
import { ANATOMY_TREES } from "@banes-lab/web/core/registries/anatomy.registry.ts";
import { COORDINATION_EVIDENCE } from "@banes-lab/web/configuration/constants/evidence.coordination.constants.ts";
import { EVIDENCE } from "@banes-lab/web/configuration/constants/evidence.source.constants.ts";
import { definitionIndexOf } from "@banes-lab/web/core/converters/definition.converter.ts";
import { unknownTargetKind } from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";

const roots = ANATOMY_TREES.map((tree) => tree.snapshot.tree);
const targetOf = evidenceTargetOf(roots, definitionIndexOf(roots), { fileId, folderId });

describe("evidenceTargetOf", () => {
    it("resolves every node the evidence registry names to one graph node", () => {
        const unresolved = EVIDENCE.flatMap((entry) => entry.nodes.filter((node) => targetOf(node) === null));
        expect(unresolved).toStrictEqual([]);
    });

    it("resolves every coordination-tree grounding, each one also in the registry", () => {
        expect(COORDINATION_EVIDENCE.length).toBeGreaterThan(0);
        expect(COORDINATION_EVIDENCE.every((entry) => EVIDENCE.includes(entry))).toBe(true);
        const unresolved = COORDINATION_EVIDENCE.flatMap((entry) =>
            entry.nodes.filter((node) => targetOf(node) === null),
        );
        expect(unresolved).toStrictEqual([]);
    });

    it("returns null for a file the trees do not hold", () => {
        expect(targetOf({ kind: "file", name: "absent-file-name.none.ts" })).toBeNull();
    });
});

describe("codeTargetRefOf", () => {
    const refOf = codeTargetRefOf(roots, { fileId, folderId });

    it("maps an exact target to its graph ref and candidates to none", () => {
        expect(refOf({ kind: "file", path: "a.ts" })).toBe(ANATOMY_PREFIX + fileId("a.ts"));
        expect(refOf({ kind: "folder", path: "core" })).toBe(ANATOMY_PREFIX + folderId("core"));
        expect(refOf({ kind: "record", ref: "lexicon:term" })).toBe("lexicon:term");
        expect(refOf({ kind: "candidates", locations: [] })).toBeNull();
        expect(refOf({ kind: "definition", location: { file: "none.ts", line: 1, name: "none" } })).toBeNull();
    });

    it("names the resolver to extend when a target kind has no mapping", () => {
        expect(unknownTargetKind("{}")).toContain("codeTargetRefOf");
    });
});
