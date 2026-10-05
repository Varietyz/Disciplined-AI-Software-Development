import { describe, expect, it } from "vitest";
import { parseYaml } from "@govlab/quality/core/parsers/config.yaml.parser.ts";

describe("parseYaml", () => {
    it("parses a mapping into an object", () => {
        expect(parseYaml("a: 1\nb: two\n")).toStrictEqual({ a: 1, b: "two" });
    });

    it("resolves merge keys", () => {
        expect(parseYaml("base: &b\n  x: 1\nchild:\n  <<: *b\n  y: 2\n")).toStrictEqual({
            base: { x: 1 },
            child: { x: 1, y: 2 },
        });
    });

    it("returns an empty object for an empty document and throws on invalid YAML", () => {
        expect(parseYaml("")).toStrictEqual({});
        expect(() => parseYaml("[1, 2")).toThrow();
    });
});
