import { describe, expect, it } from "vitest";
import { edgeEndsOf, nodeNameOf, walkAttributeOf, walkOrder } from "@banes-lab/web/core/analyzers/diagram.analyzer.ts";
import { readFileSync, readdirSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const NODES = [
    "diagram-7-flowchart-write-0",
    "diagram-7-flowchart-plant_a_violation-1",
    "diagram-7-flowchart-code-2",
    "diagram-7-flowchart-orphan-3",
];
const EDGES = ["L_write_plant_a_violation_0", "L_plant_a_violation_code_0"];
const ID_OPEN = 'id="';
const ID_CLOSE = '"';
const DIAGRAM_SAMPLES = 3;

const idsIn = function idsIn(markup: string, head: string): readonly string[] {
    const found: string[] = [];
    for (let at = markup.indexOf(ID_OPEN + head); at !== -1; at = markup.indexOf(ID_OPEN + head, at + 1)) {
        const start = at + ID_OPEN.length;
        found.push(markup.slice(start, markup.indexOf(ID_CLOSE, start)));
    }
    return found;
};

const part = function part(className: string, id: string): Element {
    const element = document.createElement("span");
    element.className = className;
    element.id = id;
    return element;
};

describe("nodeNameOf and edgeEndsOf", () => {
    it("reads a node's name between the flowchart mark and its counter", () => {
        expect(nodeNameOf("diagram-7-flowchart-plant_a_violation-1")).toBe("plant_a_violation");
        expect(nodeNameOf("not-a-node")).toBeNull();
    });

    it("splits an edge only where both halves name real nodes, even when names hold underscores", () => {
        const names = new Set(["write", "plant_a_violation", "code"]);
        expect(edgeEndsOf("L_write_plant_a_violation_0", names)).toStrictEqual(["write", "plant_a_violation"]);
        expect(edgeEndsOf("L_write_nowhere_0", names)).toBeNull();
        expect(edgeEndsOf("path-1", names)).toBeNull();
    });
});

describe("walkOrder", () => {
    it("walks each edge between its two nodes in declaration order and visits isolated nodes last", () => {
        expect(walkOrder(NODES, EDGES).map((step) => step.id)).toStrictEqual([
            "diagram-7-flowchart-write-0",
            "L_write_plant_a_violation_0",
            "diagram-7-flowchart-plant_a_violation-1",
            "L_plant_a_violation_code_0",
            "diagram-7-flowchart-code-2",
            "diagram-7-flowchart-orphan-3",
        ]);
    });

    it("writes the walk of a rendered vector as its node and edge ids in walk order", () => {
        const vector = document.createElement("div");
        vector.append(
            part("node", "diagram-7-flowchart-write-0"),
            part("node", "diagram-7-flowchart-code-1"),
            part("flowchart-link", "L_write_code_0"),
        );
        expect(walkAttributeOf(vector)).toBe("diagram-7-flowchart-write-0 L_write_code_0 diagram-7-flowchart-code-1");
    });

    it("walks the site's own rendered diagrams, edge ids included, without inventing an edge", () => {
        const folder = absolutePath("app.diagrams");
        const files = readdirSync(folder)
            .filter((name) => name.endsWith(".svg"))
            .slice(0, DIAGRAM_SAMPLES);
        expect(files).toHaveLength(DIAGRAM_SAMPLES);
        for (const file of files) {
            const markup = readFileSync(join(folder, file), "utf8");
            const nodes = idsIn(markup, "").filter((id) => nodeNameOf(id) !== null);
            const edges = idsIn(markup, "L_");
            const walked = walkOrder(nodes, edges).filter((step) => step.kind === "edge");
            expect(walked.length).toBeLessThanOrEqual(edges.length);
            expect(walked.length > 0 || edges.length === 0).toBe(true);
        }
    });
});
