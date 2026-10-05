import type { ArchPort, Manifest } from "@govlab/docs/types/readme.types.ts";
import { type PrincipleRecord, createArchRelations } from "@govlab/context";
import { describe, expect, it } from "vitest";
import {
    governConcepts,
    governPrinciples,
    ontologyDuplicateFindings,
} from "@govlab/docs/core/validators/governance.validator.ts";
import { absolutePath } from "@ssot/paths";
import { loadConceptMap } from "@govlab/docs/core/loaders/quality.loader.ts";
import { readManifest } from "@govlab/docs/core/loaders/manifest.loader.ts";

const toPort = function toPort(arch: ReturnType<typeof createArchRelations>): ArchPort {
    return {
        get: (id) => arch.get(id),
        resolve: (ids) => arch.resolve([...ids]),
        validateOntology: () => arch.validateOntology(),
    };
};

const principle = function principle(name: string, conflictsWith: string[] = []): PrincipleRecord {
    return {
        conflicts_with: conflictsWith,
        definition: "",
        detected_by: [],
        enables: [],
        enforced_by: [],
        measured_by: [],
        name,
        refactored_by: [],
        reinforces: [],
        requires: [],
        scope: [],
        severity: "mandatory",
        tensions_with: [],
        type: "Principle",
    };
};

const FAKE = toPort(
    createArchRelations({
        data: [
            {
                category: "Test",
                records: [principle("Alpha Principle", ["Beta Principle"]), principle("Beta Principle")],
            },
        ],
    }),
);

const governed = function governed(principles: string[]): Manifest {
    return { governance: { principles } };
};

const manifestAt = function manifestAt(key: string): Manifest {
    return readManifest(absolutePath(key));
};

const CONCEPTS = new Map([
    ["csp", { dimension: "security", id: "csp" }],
    ["dom", { dimension: "best-practice", id: "dom" }],
]);

describe("governPrinciples", () => {
    it("is clean without a governance block and for a lone principle whose conflict is undeclared", () => {
        expect(governPrinciples({}, FAKE)).toStrictEqual([]);
        expect(governPrinciples(governed(["alpha-principle"]), FAKE)).toStrictEqual([]);
    });

    it("reports an unresolved id and two conflicting principles", () => {
        expect(governPrinciples(governed(["ghost-principle"]), FAKE).map((finding) => finding.axis)).toStrictEqual([
            "unresolved-principle",
        ]);
        expect(
            governPrinciples(governed(["alpha-principle", "beta-principle"]), FAKE).some(
                (finding) => finding.axis === "conflicting-principles",
            ),
        ).toBe(true);
    });

    it("resolves the live declared modules clean", () => {
        const live = toPort(createArchRelations());
        const manifests = ["govlab.context", "govlab.patterns"].map(manifestAt);
        expect(manifests.flatMap((manifest) => governPrinciples(manifest, live))).toStrictEqual([]);
    });
});

describe("ontologyDuplicateFindings", () => {
    it("reports a duplicate id and is clean otherwise", () => {
        const duplicate = createArchRelations({
            data: [{ category: "T", records: [principle("Same Name"), principle("Same Name")] }],
        });
        expect(ontologyDuplicateFindings(toPort(duplicate))).toHaveLength(1);
        expect(ontologyDuplicateFindings(FAKE)).toStrictEqual([]);
    });
});

describe("governConcepts", () => {
    it("is clean without governedBy, when every concept resolves, and when the catalog is absent", () => {
        expect(governConcepts({}, CONCEPTS)).toStrictEqual([]);
        expect(governConcepts({ governedBy: ["csp", "dom"] }, CONCEPTS)).toStrictEqual([]);
        expect(governConcepts({ governedBy: ["csp"] }, new Map())).toStrictEqual([]);
    });

    it("reports a concept that resolves to nothing", () => {
        const findings = governConcepts({ governedBy: ["csp", "ghost-concept"] }, CONCEPTS);
        expect(findings.map((finding) => finding.axis)).toStrictEqual(["unresolved-concept"]);
        expect(findings[0]?.detail).toContain("ghost-concept");
    });

    it("resolves the live governed modules clean", () => {
        const live = loadConceptMap(absolutePath("govlab.quality.generated.concepts"));
        const manifests = ["govlab.docs", "govlab.quality", "govlab.utils.codeParse"].map(manifestAt);
        expect(manifests.flatMap((manifest) => governConcepts(manifest, live))).toStrictEqual([]);
    });
});
