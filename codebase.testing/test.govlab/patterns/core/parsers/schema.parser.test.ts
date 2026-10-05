import { describe, expect, it } from "vitest";
import { DataLoadError } from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import { schemaFromDict } from "@govlab/patterns/core/parsers/schema.parser.ts";

describe("schemaFromDict", () => {
    it("reads field descriptors, defaulting the optional properties", () => {
        expect(schemaFromDict([{ kind: "scalar", name: "color", primitive: "string" }])).toStrictEqual([
            {
                elementNumeric: false,
                fixedLength: null,
                kind: "scalar",
                name: "color",
                nullable: false,
                primitive: "string",
            },
        ]);
    });

    it("refuses a non-array schema and a descriptor with an unknown kind", () => {
        expect(() => schemaFromDict({})).toThrow(DataLoadError);
        expect(() => schemaFromDict([{ kind: "blob", name: "x" }])).toThrow(DataLoadError);
    });
});
