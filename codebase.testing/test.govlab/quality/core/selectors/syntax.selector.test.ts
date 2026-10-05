import { asNode, identName, propKeyName } from "@govlab/quality/core/selectors/syntax.selector.ts";
import { expect, test } from "vitest";

test("asNode narrows a typed record and refuses anything else", () => {
    expect(asNode({ type: "Identifier" })).toStrictEqual({ type: "Identifier" });
    expect(asNode(null)).toBeNull();
    expect(asNode("x")).toBeNull();
});

test("identName reads an Identifier's name only", () => {
    expect(identName({ name: "a", type: "Identifier" })).toBe("a");
    expect(identName({ type: "Literal", value: "a" })).toBeNull();
    expect(identName()).toBeNull();
});

test("propKeyName reads an identifier or string key and refuses a computed one", () => {
    expect(propKeyName({ key: { name: "a", type: "Identifier" }, type: "Property" })).toBe("a");
    expect(propKeyName({ key: { type: "Literal", value: "b" }, type: "Property" })).toBe("b");
    expect(propKeyName({ computed: true, key: { name: "c", type: "Identifier" }, type: "Property" })).toBeNull();
});
