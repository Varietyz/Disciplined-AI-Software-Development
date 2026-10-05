import { describe, expect, it } from "vitest";
import { instanceDefects, schemaShapeDefects } from "@banes-lab/build-scripts/core/validators/schema.validator.ts";
import { inferSchema } from "@banes-lab/build-scripts/core/converters/schema.converter.ts";

describe("schemaShapeDefects", () => {
    it("reports object keywords on a node whose type admits no object, and items on one that admits no array", () => {
        expect(
            schemaShapeDefects({ properties: { "0": { type: "string" } }, required: ["0"], type: "array" }, "$"),
        ).toHaveLength(2);
        expect(schemaShapeDefects({ items: { type: "string" }, type: "object" }, "$")).toHaveLength(1);
    });

    it("accepts a schema inferred from objects holding arrays", () => {
        const schema = inferSchema([{ tags: ["a", "b"] }, { tags: [] }]);
        expect(schemaShapeDefects(schema, "$")).toStrictEqual([]);
        expect(schema).toMatchObject({ properties: { tags: { items: { type: "string" }, type: "array" } } });
    });
});

describe("instanceDefects", () => {
    const schema = inferSchema([
        { count: 1, name: "a" },
        { count: 2.5, name: "b" },
    ]);

    it("accepts every value the schema was inferred from", () => {
        expect(instanceDefects({ count: 1, name: "a" }, schema, "$")).toStrictEqual([]);
        expect(instanceDefects({ count: 2.5, name: "b" }, schema, "$")).toStrictEqual([]);
    });

    it("reports a wrong type, a missing required field and an undeclared field", () => {
        expect(instanceDefects({ count: "1", name: "a" }, schema, "$")).toHaveLength(1);
        expect(instanceDefects({ name: "a" }, schema, "$")).toHaveLength(1);
        expect(instanceDefects({ count: 1, extra: true, name: "a" }, schema, "$")).toHaveLength(1);
    });
});
