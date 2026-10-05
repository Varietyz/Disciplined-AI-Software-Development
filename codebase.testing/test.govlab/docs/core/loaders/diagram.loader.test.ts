import { describe, expect, it } from "vitest";
import { DIAGRAM_KINDS } from "@govlab/docs/core/loaders/diagram.loader.ts";

describe("DIAGRAM_KINDS", () => {
    it("discovers every diagram plugin, ordered, with the lifecycle first", () => {
        const orders = DIAGRAM_KINDS.map((kind) => kind.order);
        expect(orders).toStrictEqual(orders.toSorted((left, right) => left - right));
        expect(DIAGRAM_KINDS[0]?.id).toBe("lifecycle");
        expect(DIAGRAM_KINDS.map((kind) => kind.id)).toEqual(
            expect.arrayContaining(["data-flow", "sequence", "state", "type-relationship"]),
        );
    });
});
