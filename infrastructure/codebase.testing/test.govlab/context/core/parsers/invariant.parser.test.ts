import { LINE } from "./document.fixture.ts";
import assert from "node:assert/strict";
import { parseInvariant } from "@govlab/context/core/parsers/invariant.parser.ts";
import { test } from "vitest";

test("parseInvariant reads the name, the property and the three clauses", () => {
    const invariant = parseInvariant(
        "INVARIANT one-writer: a record has exactly one writer over: every record on the surface binds: every party writing there objector: [check] one open fence per record",
        LINE,
    );
    assert.equal(invariant.name, "one-writer");
    assert.equal(invariant.property, "a record has exactly one writer");
    assert.equal(invariant.set, "every record on the surface");
    assert.equal(invariant.parties, "every party writing there");
    assert.equal(invariant.objector, "[check] one open fence per record");
    const bare = parseInvariant("INVARIANT stated: a property", LINE);
    assert.equal(bare.set, null);
    assert.equal(bare.objector, null);
});
