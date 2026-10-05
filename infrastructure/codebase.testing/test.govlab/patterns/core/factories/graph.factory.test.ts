import { describe, expect, it } from "vitest";
import { GraphError } from "@govlab/patterns/core/validators/graph.validator.ts";
import { graphOf } from "@govlab/patterns/core/factories/graph.factory.ts";
import { sourceNode } from "@govlab/patterns/core/factories/node.factory.ts";

describe("graphOf", () => {
    it("returns a validated graph over the nodes", () => {
        expect(graphOf([sourceNode()]).nodes).toHaveLength(1);
    });

    it("refuses an invalid node set before returning", () => {
        expect(() => graphOf([sourceNode(), sourceNode()])).toThrow(GraphError);
    });
});
