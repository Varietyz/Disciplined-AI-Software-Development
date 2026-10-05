import { KEY_SEP, keyOf, scopeOf } from "@govlab/patterns/core/formatters/definition.formatter.ts";
import { describe, expect, it } from "vitest";

describe("the definition key", () => {
    it("joins a scope and a name and reads the scope back", () => {
        const key = keyOf("core/a.ts", "run");
        expect(key).toBe(`core/a.ts${KEY_SEP}run`);
        expect(scopeOf(key)).toBe("core/a.ts");
    });
});
