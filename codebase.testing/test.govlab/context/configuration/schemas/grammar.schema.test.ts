import { PAG_KINDS, createPagGrammar } from "@govlab/context";
import { PAG_SCHEMA } from "@govlab/context/configuration/schemas/grammar.schema.ts";
import assert from "node:assert/strict";
import { recordDefects } from "@govlab/context/core/validators/field.validator.ts";
import { test } from "vitest";

test("the keyword schema passes a bundled keyword and refuses one missing its meaning", () => {
    const schema = PAG_SCHEMA.get(PAG_KINDS.keyword);
    assert.ok(schema, "the grammar schema declares the keyword kind");
    const [keyword] = createPagGrammar().keywords();
    assert.ok(keyword, "the grammar holds a keyword");
    const [primary, ...further] = keyword.roles;
    const raw = { keyword: keyword.keyword, ...primary, ...(further.length > 0 ? { roles: further } : {}) };
    assert.deepEqual(recordDefects(schema, raw), []);
    const meaningless = Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "meaning"));
    assert.deepEqual(recordDefects(schema, meaningless), ["has no meaning, which its kind requires"]);
});
