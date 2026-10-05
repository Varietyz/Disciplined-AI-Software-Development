import {
    FRESHNESS_LINE,
    GOOD,
    NODE_ONE_HEADER,
    NODE_ONE_POPULATION,
    NODE_ONE_RESULT,
    NO_SPAWN_INVARIANT,
    ONE_READ_INVARIANT,
    REFUSAL_LINE,
} from "../parsers/document.fixture.ts";
import { describe, expect, it } from "vitest";
import { executableDocuments, validate, validateDocuments, verdictOf } from "@govlab/context";
import type { DocumentSource } from "@govlab/context/types/grammar.document.types.ts";
import { readFileSync } from "node:fs";

const TEMPLATE: DocumentSource = { kind: "template", path: "template.md", relative: "template.md" };
const AGENT: DocumentSource = { kind: "agent", path: "agent.md", relative: "agent.md" };

const FENCED = [
    "# A template",
    "",
    "prose before the block",
    "",
    "```py CODE: PAG sample",
    "THIS TASK EXECUTES a sample",
    "# PHASE 1: the retired head",
    "```",
    "",
    "prose after the block",
].join("\n");

const codesOf = (text: string): string[] => validate(text).defects.map((defect) => defect.code);

describe("validate", () => {
    it("passes the well-formed node document", () => {
        expect(codesOf(GOOD)).toStrictEqual([]);
    });

    it("reports a retired unit head on a phase header, a validation gate and a tick marker", () => {
        expect(codesOf(GOOD.replace(NODE_ONE_HEADER, "# PHASE 1: READ THE SOURCE"))).toContain("retired_unit_head");
        expect(codesOf(GOOD.replace("HANDOFF GATE (evidence-bearing):", "VALIDATION GATE:"))).toContain(
            "retired_unit_head",
        );
        expect(codesOf(GOOD.replace("[check] held read", "✅ held read"))).toContain("retired_unit_head");
    });

    it("reports a bare invariant block and ignores its bullets", () => {
        expect(codesOf(GOOD.replace(NO_SPAWN_INVARIANT, "ALWAYS:\n  - VALIDATE at boundaries"))).toStrictEqual([
            "bare_invariant_block",
        ]);
    });

    it("reports a check with no evidence, a gate with no population and an empty population", () => {
        expect(codesOf(GOOD.replace(" (evidence: a count above zero)", ""))).toStrictEqual(["check_without_evidence"]);
        expect(codesOf(GOOD.replace(NODE_ONE_POPULATION, ""))).toStrictEqual(["gate_without_population"]);
        expect(codesOf(GOOD.replace("measured: 1 / 1", "measured: 0 / 0"))).toStrictEqual(["empty_population"]);
    });

    it("reports an unrouted unknown, a missing result, a write with no refusal and an artifact with no freshness", () => {
        expect(codesOf(GOOD.replace(" | unknown → BLOCKED", ""))).toStrictEqual(["unknown_unrouted"]);
        expect(codesOf(GOOD.replace(`${NODE_ONE_RESULT}\n`, ""))).toStrictEqual(["result_missing"]);
        expect(codesOf(GOOD.replace(REFUSAL_LINE, ""))).toStrictEqual(["write_without_refusal"]);
        expect(codesOf(GOOD.replace(FRESHNESS_LINE, ""))).toStrictEqual(["artifact_without_freshness"]);
    });

    it("reports a node declared twice, an input with no source and a malformed tag", () => {
        expect(codesOf(GOOD.replace("# NODE 2 —", "# NODE 1 —"))).toStrictEqual(["node_declared_twice"]);
        expect(codesOf(GOOD.replace("input:     held from NODE 1", "input:     the held content"))).toStrictEqual([
            "input_without_source",
        ]);
        expect(
            codesOf(GOOD.replace("[epistemic · analysis · set-theory · yields: set]", "[epistemic · analysis]")),
        ).toStrictEqual(["node_tag_malformed"]);
    });

    it("reports the three invariant codes on a record with no clauses", () => {
        const codes = codesOf(
            GOOD.replace(ONE_READ_INVARIANT, "INVARIANT one-read: a node reads only the prior node's output"),
        );
        expect(codes).toStrictEqual(
            ["invariant_without_parties", "invariant_without_objector", "invariant_without_set"].toSorted(),
        );
    });

    it("reports a node whose gate is missing", () => {
        const start = GOOD.indexOf("HANDOFF GATE:\n");
        const end = GOOD.indexOf("# CROSS-NODE INVARIANTS");
        expect(codesOf(`${GOOD.slice(0, start)}\n${GOOD.slice(end)}`)).toContain("node_without_gate");
    });

    it("reports a malformed document by token code", () => {
        const bad = [
            "THIS AGENT PERFORMS x",
            "",
            "# NODE 1 — p [epistemic · ontology · set-theory · yields: set]",
            "    for item in list",
            "    HANDOFF GATE:",
            "        [check] ok (evidence: x) over: items measured: 1 / 1",
            "        result: pass → TERMINATE | unknown → BLOCKED",
            "",
        ].join("\n");
        const result = validate(bad);
        expect(result.wellFormed).toBe(false);
        const codes = result.defects.map((defect) => defect.code);
        expect(codes).toContain("lowercase_keyword");
        expect(codes).toContain("gate_too_few_conditions");
    });
});

describe("verdictOf", () => {
    it("reports a planted retired head at the file's own line", () => {
        const verdict = verdictOf(TEMPLATE, FENCED);
        expect(verdict.extracted).toBe(true);
        expect(verdict.defects.map((defect) => [defect.code, defect.line])).toContainEqual(["retired_unit_head", 7]);
    });

    it("reports a template with no block as not extracted, with a defect on line 1", () => {
        expect(verdictOf(TEMPLATE, "prose only")).toStrictEqual({
            defects: [{ code: "template_without_block", line: 1, token: "CODE: PAG" }],
            extracted: false,
            source: TEMPLATE,
        });
    });

    it("never reports a missing block for an agent, which is validated whole", () => {
        expect(verdictOf(AGENT, "prose only").defects.map((defect) => defect.code)).not.toContain(
            "template_without_block",
        );
    });
});

describe("validateDocuments", () => {
    it("validates every agent and template on disk clean", () => {
        const verdicts = validateDocuments(executableDocuments());
        expect(verdicts.every((verdict) => verdict.extracted)).toBe(true);
        const defects = verdicts.flatMap((verdict) =>
            verdict.defects.map(
                (defect) => `${verdict.source.relative}:${String(defect.line)} ${defect.code} ${defect.token}`,
            ),
        );
        expect(defects).toStrictEqual([]);
    });

    it("reports a real template with a planted retired head, and the unplanted file stays clean", () => {
        const template = executableDocuments().find((source) => source.kind === "template");
        expect(template).toBeDefined();
        if (template === undefined) {
            return;
        }
        const text = readFileSync(template.path, "utf8");
        const planted = text.replace("\n# NODE 1", "\n# PHASE 1: planted\n# NODE 1");
        expect(planted).not.toBe(text);
        expect(verdictOf(template, planted).defects.map((defect) => defect.code)).toContain("retired_unit_head");
        expect(verdictOf(template, text).defects).toStrictEqual([]);
    });
});
