import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { deriveCodeGraph } from "@govlab/docs/core/coordinators/code.coordinator.ts";
import { loadPackage } from "@govlab/docs/core/factories/diagram.factory.ts";

const GRAPH_TIMEOUT_MS = 60_000;

const graphOf = async function graphOf(key: string): ReturnType<typeof deriveCodeGraph> {
    const dir = absolutePath(key);
    return deriveCodeGraph(dir, loadPackage(dir));
};

describe("deriveCodeGraph", () => {
    it(
        "follows the entry into collaborators and cross-file calls",
        async () => {
            const graph = await graphOf("govlab.context");
            expect(graph?.nodes.map((node) => node.label)).toContain("createGovlabContext");
            expect(graph?.nodes.some((node) => node.kind === "collaborator")).toBe(true);
            expect(graph?.edges.some((edge) => edge.kind === "call")).toBe(true);
        },
        GRAPH_TIMEOUT_MS,
    );

    it(
        "produces the entry graph of a leaf module",
        async () => {
            const graph = await graphOf("govlab.utils.contentFingerprint");
            expect(graph?.nodes.some((node) => node.label === "fingerprint")).toBe(true);
        },
        GRAPH_TIMEOUT_MS,
    );
});
