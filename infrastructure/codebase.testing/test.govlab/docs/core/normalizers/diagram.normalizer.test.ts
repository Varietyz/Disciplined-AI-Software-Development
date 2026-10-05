import { describe, expect, it } from "vitest";
import { idSanitize, label, nodeId } from "@govlab/docs/core/normalizers/diagram.normalizer.ts";

describe("label", () => {
    it("drops reserved and non-ASCII characters and collapses whitespace", () => {
        expect(label("run (x) — then;  go")).toBe("run x then, go");
    });
});

describe("idSanitize", () => {
    it("keeps an identifier, fills other characters and prefixes a leading digit", () => {
        expect(idSanitize("a-b.c")).toBe("a_b_c");
        expect(idSanitize("1x")).toBe("n_1x");
        expect(idSanitize("")).toBe("n");
    });
});

describe("nodeId", () => {
    it("builds a stable id from the last name segment plus a hash of the whole name", () => {
        const id = nodeId("src/a.ts#createThing");
        expect(id.startsWith("createThing_")).toBe(true);
        expect(nodeId("src/a.ts#createThing")).toBe(id);
        expect(nodeId("src/b.ts#createThing")).not.toBe(id);
        expect(nodeId("pkg/2fast").startsWith("n2fast_")).toBe(true);
    });
});
