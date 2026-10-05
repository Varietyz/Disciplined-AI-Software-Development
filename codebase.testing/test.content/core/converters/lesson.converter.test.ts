import {
    type ContractCategory,
    type PrincipleCategory,
    createAlgoGrammar,
    createArchRelations,
    createLexicon,
} from "@govlab/context";
import { algoSeeds, missingFieldsOf, reportOf } from "@banes-lab/content/core/converters/lesson.converter.ts";
import { describe, expect, it } from "vitest";
import type { Faces } from "@banes-lab/content/types/lesson.types.ts";

const FIXTURE_ALGO: ContractCategory[] = [
    {
        category: "fixture-loop",
        records: [
            {
                composes: [],
                exemplar: {
                    after: "verified",
                    before: "A claim asserted from confidence.",
                    lang: "flow",
                    medium: "composite",
                },
                flow: ["Run", "Read"],
                force: ["correctness_verification"],
                id: "verify-step",
                intent: "Run the verifier and read its output.",
                invariant: "Compliance rests on verifier output.",
                productions: [],
                stage: "verify",
                title: "Verify Step",
            },
            {
                composes: ["verify-step"],
                derivationMap: [{ record: "verify-step", stage: "verify" }],
                exemplar: {
                    after: "loop",
                    before: "One-shot fix, never re-verified.",
                    lang: "flow",
                    medium: "composite",
                },
                flow: ["Init", "Verify"],
                force: ["correctness_verification"],
                id: "fixture-kernel",
                intent: "Loop until pass.",
                invariant: "Verification is a bounded loop.",
                productions: [],
                title: "Fixture Kernel",
            },
            {
                composes: [],
                flow: ["Rules", "Verify"],
                force: ["correctness_verification"],
                id: "fixture-concern",
                intent: "<Load rules> → <Verify>",
                invariant: "Any compliance workflow is a bounded loop.",
                meta: true,
                principleRef: "verification-loop",
                productions: [],
                title: "<Fixture Concern>",
            },
        ],
        tier: "process",
    },
    {
        category: "orphan",
        records: [
            {
                composes: [],
                flow: [],
                force: ["correctness_verification"],
                id: "orphan-concern",
                intent: "<Stand alone>",
                invariant: "An orphan concern has no kernel.",
                meta: true,
                productions: [],
                title: "<Orphan Concern>",
            },
        ],
        tier: "exempt",
    },
    {
        category: "cluster",
        records: [
            {
                composes: [],
                flow: ["Declare"],
                force: [],
                id: "cluster-core",
                intent: "The rules a cluster groups.",
                invariant: "A cluster holds only while its governing rule holds.",
                meta: true,
                principleRef: "governed-rule",
                productions: [],
                title: "Cluster Core",
            },
            {
                composes: [],
                flow: ["Declare"],
                force: [],
                id: "term-cluster-core",
                intent: "The rules a second cluster groups.",
                invariant: "A cluster holds only while its governing rule holds.",
                meta: true,
                principleRef: "term-governed-rule",
                productions: [],
                title: "Term Cluster Core",
            },
        ],
        tier: "exempt",
    },
];

const FIXTURE_ARCH: PrincipleCategory[] = [
    {
        category: "fixture",
        records: [
            {
                conflicts_with: [],
                definition: "",
                detected_by: [],
                enables: [],
                enforced_by: [],
                measured_by: [],
                name: "Verification Loop",
                refactored_by: [],
                reinforces: [],
                requires: [],
                scope: ["correctness_verification"],
                severity: "mandatory",
                tensions_with: [],
                type: "principle",
                violated_by: [],
            },
            {
                conflicts_with: [],
                definition: "A design rule that governs the cluster.",
                detected_by: ["clone scan", "second copy"],
                enables: [],
                enforced_by: ["clone analyzers"],
                exemplar: { after: "one", before: "two copies drift apart", lang: "ts", medium: "code" },
                id: "governed-rule",
                measured_by: ["clone count"],
                name: "Governed Rule",
                refactored_by: [],
                reinforces: [],
                requires: [],
                scope: [],
                severity: "mandatory",
                tensions_with: [],
                type: "principle",
                violated_by: ["architecture:copied-rule"],
            },
            {
                conflicts_with: [],
                definition: "A rule held in two places.",
                detected_by: [],
                enables: [],
                enforced_by: [],
                formed_by: "the same rule written in two places",
                id: "copied-rule",
                measured_by: [],
                name: "Copied Rule",
                refactored_by: [],
                reinforces: [],
                requires: [],
                scope: [],
                severity: "mandatory",
                tensions_with: [],
                type: "anti-pattern",
            },
            {
                conflicts_with: [],
                definition: "A design rule that governs the second cluster.",
                detected_by: ["copy scan"],
                enables: [],
                enforced_by: ["copy analyzers"],
                exemplar: { after: "one", before: "a copy in every file", lang: "ts", medium: "code" },
                id: "term-governed-rule",
                measured_by: ["copy count"],
                name: "Term Governed Rule",
                refactored_by: [],
                reinforces: [],
                requires: [],
                scope: [],
                severity: "mandatory",
                tensions_with: [],
                type: "principle",
                violated_by: ["lexicon:scattered-copy"],
            },
        ],
    },
];

const faces: Faces = {
    algo: createAlgoGrammar({ data: FIXTURE_ALGO }),
    arch: createArchRelations({ data: FIXTURE_ARCH }),
    lex: createLexicon({
        data: [
            {
                category: "fixture",
                records: [
                    {
                        definition: "A rule copied into each file that needs it.",
                        kind: "anti-pattern",
                        name: "Scattered Copy",
                    },
                ],
            },
        ],
    }),
};

describe("algoSeeds", () => {
    const seeds = algoSeeds(faces);
    const byId = new Map(seeds.map((seed) => [seed.id, seed]));

    it("joins a meta record to its category's kernel for the problem and the validation", () => {
        const seed = byId.get("fixture-concern");
        expect(seed?.problem).toBe("One-shot fix, never re-verified.");
        expect(seed?.validation).toBe("Compliance rests on verifier output.");
        expect(seed?.principle).toBe("Any compliance workflow is a bounded loop.");
        expect(seed?.cause).toStrictEqual(["Verification Loop"]);
    });

    it("emits a kernel-less meta record with a null problem, and takes no cause from a shared force alone", () => {
        const seed = byId.get("orphan-concern");
        expect(seed?.problem).toBeNull();
        expect(seed?.cause).toStrictEqual([]);
    });

    it("takes a kernel-less meta record's problem from the anti-pattern its principle names, and its failure and check from the principle", () => {
        const seed = byId.get("cluster-core");
        expect(seed?.cause).toStrictEqual(["Governed Rule"]);
        expect(seed?.problem).toBe("the same rule written in two places");
        expect(seed?.failureMode).toBe("two copies drift apart");
        expect(seed?.validation).toBe("clone scan, second copy");
    });

    it("takes the problem from a lexicon anti-pattern's definition when the principle names no architecture one", () => {
        const seed = byId.get("term-cluster-core");
        expect(seed?.problem).toBe("A rule copied into each file that needs it.");
        expect(seed?.validation).toBe("copy scan");
    });
});

describe("missingFieldsOf and reportOf", () => {
    it("lists the fields a seed lacks and collects the incomplete seeds", () => {
        const report = reportOf(algoSeeds(faces));
        const orphan = report.incomplete.find((entry) => entry.id === "orphan-concern");
        expect(orphan?.missing).toStrictEqual(["problem", "cause", "validation"]);
        expect(report.seeds.every((seed) => missingFieldsOf(seed).length === 0 || seed.id === "orphan-concern")).toBe(
            true,
        );
    });

    it("holds each seed only to the fields its source declares", () => {
        const base = {
            application: [],
            boundary: null,
            cause: [],
            decision: "d",
            domain: "x",
            failureMode: null,
            id: "s",
            level: "principles",
            problem: null,
        } as const;
        expect(missingFieldsOf({ ...base, principle: "p", source: "model", validation: "v" })).toStrictEqual([]);
        expect(missingFieldsOf({ ...base, principle: "p", source: "model", validation: null })).toStrictEqual([
            "validation",
        ]);
        expect(missingFieldsOf({ ...base, principle: "", source: "profile", validation: null })).toStrictEqual([
            "principle",
        ]);
    });
});
