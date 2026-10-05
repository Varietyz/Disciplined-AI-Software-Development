import { describe, it } from "vitest";
import { readRowMarkers, readTemplateContract } from "coordination-surface/tools/core/readers/template.reader.ts";
import assert from "node:assert/strict";

const TEMPLATE = [
    'SET substrate_cycle = ["seed", "grow"] then "ignored"',
    'SET ripple_dimensions = ["cost", "risk", "open',
    "SET confidence_threshold =  0.8 or so",
    "SET confidence_threshold = 0.1",
    "graph_4d: { axis_d: [], axis_s: [], note } trailing: x",
].join("\n");

describe("readTemplateContract", () => {
    it("reads the stages, the closed ripple items, the first threshold and the graph's axes", () => {
        assert.deepEqual(readTemplateContract(TEMPLATE), {
            confidenceThreshold: 0.8,
            dependencyAxes: ["axis_d", "axis_s"],
            genesisStages: ["seed", "grow"],
            rippleDimensions: ["cost", "risk"],
        });
    });

    it("reads zero and empty lists from a template that assigns nothing", () => {
        assert.deepEqual(readTemplateContract("prose"), {
            confidenceThreshold: 0,
            dependencyAxes: [],
            genesisStages: [],
            rippleDimensions: [],
        });
    });
});

describe("readRowMarkers", () => {
    it("reads the row markers in the rendered-as column of the first table that has one", () => {
        const source = [
            "| field | rendered as |",
            "|---|---|",
            "| a | `*A:*` |",
            "| b | plain |",
            "",
            "| c | `*C:*` |",
        ].join("\n");
        assert.deepEqual(readRowMarkers(source), ["*A:*"]);
        assert.deepEqual(readRowMarkers("| no | table |"), []);
    });
});
