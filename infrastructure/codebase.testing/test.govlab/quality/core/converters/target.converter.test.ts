import { describe, expect, it } from "vitest";
import { bumpEsTokens } from "@govlab/quality/core/converters/target.converter.ts";

const ENFORCED_YEAR = 2025;

const TSCONFIG = `{
    // frontend package
    "compilerOptions": {
        "target": "ES2021",
        "module": "NodeNext",
        "lib": ["ES2021", "DOM", "DOM.Iterable"]
    }
}
`;

describe("bumpEsTokens", () => {
    it("rewrites only the stale ES tokens to the replacement, preserving DOM libs, module, and comments", () => {
        const result = bumpEsTokens(TSCONFIG, ENFORCED_YEAR, "ESNext");
        expect(result.changed).toBe(true);
        expect(result.text).toContain(`"target": "ESNext"`);
        expect(result.text).toContain(`"lib": ["ESNext", "DOM", "DOM.Iterable"]`);
        expect(result.text).toContain(`"module": "NodeNext"`);
        expect(result.text).toContain("// frontend package");
    });

    it("is a no-op when everything already meets the enforced revision", () => {
        const text = `{ "target": "ESNext", "lib": ["ESNext", "DOM"] }`;
        expect(bumpEsTokens(text, ENFORCED_YEAR, "ESNext")).toEqual({ changed: false, text });
    });
});
