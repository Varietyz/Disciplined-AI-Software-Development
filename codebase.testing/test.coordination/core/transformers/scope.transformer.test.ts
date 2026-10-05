import { decodeScope, encodeScope } from "coordination-surface/tools/core/transformers/scope.transformer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("encodeScope and decodeScope", () => {
    it("keep letters, digits and hyphens, escape every other character, and decode back to the scope", () => {
        const scope = "tools/core ~ a.ts";
        const encoded = encodeScope(scope);
        assert.equal(encodeScope("tools-core"), "tools-core");
        assert.equal(encodeScope("/"), "~22f");
        assert.equal(decodeScope(encoded), scope);
    });

    it("refuses a character the encoding never writes, and an escape cut short", () => {
        assert.equal(decodeScope("a/b"), null);
        assert.equal(decodeScope("~2"), null);
        assert.equal(decodeScope("~0"), null);
        assert.equal(decodeScope("~2zz"), null);
    });
});
