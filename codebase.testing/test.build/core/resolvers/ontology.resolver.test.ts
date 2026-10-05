import {
    createResolver,
    faceOf,
    idOf,
    pagAnchor,
    reasonAnchor,
    refOf,
} from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";

const context = createGovlabContext();
const resolve = createResolver(context);

describe("refOf, faceOf and idOf", () => {
    it("joins and splits a collection reference", () => {
        expect(refOf("architecture", "single-responsibility")).toBe("architecture:single-responsibility");
        expect(faceOf("lexicon:yagni")).toBe("lexicon");
        expect(idOf("lexicon:yagni")).toBe("yagni");
        expect(reasonAnchor("node", "identity")).toBe("node-identity");
        expect(pagAnchor("template", "checklist")).toBe("template-checklist");
    });
});

describe("createResolver", () => {
    it("resolves a principle by id, name or alias, falls back to a term, and leaves an unknown label unlinked", () => {
        const [first] = context.arch.all();
        if (first === undefined) {
            throw new Error("no principles");
        }
        expect(resolve.arch(first.id)).toStrictEqual({ label: first.name, ref: `architecture:${first.id}` });
        expect(resolve.arch(first.name).ref).toBe(`architecture:${first.id}`);
        const viaLexicon = context.lex
            .all()
            .filter((candidate) => resolve.arch(candidate.name).ref === `lexicon:${candidate.id}`);
        expect(viaLexicon.length).toBeGreaterThan(100);
        expect(resolve.arch("no such record anywhere").ref).toBeNull();
    });

    it("resolves contracts, reason records, stages, kinds, layers, forces and categories to their collections", () => {
        const [contract] = context.algo.all();
        const {
            stages: [stage],
        } = context.reason.derivationLoop();
        const [axis] = context.reason.axes();
        if (contract === undefined || stage === undefined || axis === undefined) {
            throw new Error("collections are empty");
        }
        expect(resolve.algo(contract.id)).toStrictEqual({ label: contract.title, ref: `algorithms:${contract.id}` });
        expect(resolve.reason(axis.id).ref).toBe(`reasoning:axis-${axis.id}`);
        expect(resolve.reasonAs("axis", axis.id).ref).toBe(`reasoning:${reasonAnchor("axis", axis.id)}`);
        expect(resolve.reasonAs("lens", axis.id).ref).toBeNull();
        expect(resolve.stage(stage.id).ref).toBe(`stage:${stage.id}`);
        expect(resolve.stage("nowhere").ref).toBeNull();
        expect(resolve.kind("anti-pattern").ref).toBe("kind:anti-pattern");
        expect(resolve.kind("gadget").ref).toBeNull();
        expect(resolve.layer(contract.id)).toStrictEqual({ label: contract.title, ref: `layer:${contract.id}` });
        expect(resolve.force("modularity", new Set(["modularity"])).ref).toBe("force:modularity");
        expect(resolve.force("AI system", new Set(["modularity"])).ref).toBeNull();
        expect(resolve.archCategory("Core Modular Design")).toStrictEqual({
            label: "Core Modular Design",
            ref: "architecture-category:core-modular-design",
        });
        expect(resolve.lexCategory("core-vocabulary")).toStrictEqual({
            label: "Core Vocabulary",
            ref: "lexicon-category:core-vocabulary",
        });
        expect(resolve.lexCategory("core-modular-design").label).toBe("Core Modular Design");
    });

    it("resolves a face-prefixed target only in the collection it names, the way the canon's own grounding check does", () => {
        const [contract] = context.algo.all();
        const [principle] = context.arch.all();
        const [term] = context.lex.all();
        const [axis] = context.reason.axes();
        if (contract === undefined || principle === undefined || term === undefined || axis === undefined) {
            throw new Error("collections are empty");
        }
        expect(resolve.target(`algorithms:${contract.id}`).ref).toBe(`algorithms:${contract.id}`);
        expect(resolve.target(`architecture:${principle.id}`).ref).toBe(`architecture:${principle.id}`);
        expect(resolve.target(`architecture:${principle.name}`).ref).toBeNull();
        expect(resolve.target(`lexicon:${term.name}`).ref).toBe(`lexicon:${term.id}`);
        expect(resolve.target(`reasoning:${axis.id}`).ref).toBe(`reasoning:axis-${axis.id}`);
        expect(resolve.target("lexicon:no-such-term-anywhere").ref).toBeNull();
        expect(resolve.target("pag:template:checklist").ref).toBe("pag:template-checklist");
        expect(resolve.target("pag:template:no-such-template").ref).toBeNull();
        expect(resolve.target("nowhere:anything").ref).toBeNull();
        expect(resolve.tension({ label: "A", ref: null }, { label: "B", ref: null })).toStrictEqual({
            label: "A / B",
            ref: "tension:a-b",
        });
    });

    it("resolves a bare target by identity across the reason, principle, term and contract collections, and an edge source as a stage, a node or the loop", () => {
        const [contract] = context.algo.all();
        const {
            stages: [stage],
        } = context.reason.derivationLoop();
        const [node] = context.reason.nodes();
        if (contract === undefined || stage === undefined || node === undefined) {
            throw new Error("collections are empty");
        }
        expect(resolve.target(contract.id).ref).toBe(`algorithms:${contract.id}`);
        expect(resolve.target("claims-are-lies-of-no-record").ref).toBeNull();
        expect(resolve.edgeSource(stage.id).ref).toBe(`stage:${stage.id}`);
        expect(resolve.edgeSource(node.id).ref).toBe(`reasoning:node-${node.id}`);
        expect(resolve.edgeSource(context.reason.derivationLoop().id).ref).toBe(
            `reasoning:loop-${context.reason.derivationLoop().id}`,
        );
        expect(resolve.edgeSource("nowhere").ref).toBeNull();
    });

    it("keeps every label in order, links only a label that is itself a record, and never guesses past a leading verb", () => {
        const guardrails = context.lex.resolve("Guardrails");
        if (guardrails === null) {
            throw new Error("no guardrails term");
        }
        const phrases = resolve.labels(["Guardrails", "something nobody catalogued", "Add Guardrails"]);
        expect(phrases.map((phrase) => phrase.label)).toStrictEqual([
            "Guardrails",
            "something nobody catalogued",
            "Add Guardrails",
        ]);
        expect(phrases[0]?.ref).toBe(`lexicon:${guardrails.id}`);
        expect(phrases[1]?.ref).toBeNull();
        expect(phrases[2]?.ref).toBeNull();
        expect(resolve.labels([])).toStrictEqual([]);
    });
});
