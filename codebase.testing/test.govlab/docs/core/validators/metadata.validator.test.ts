import { describe, expect, it } from "vitest";
import { frontmatterSchema } from "@govlab/docs/core/validators/metadata.validator.ts";

const SCHEMA = {
    fields: {
        draft: { kind: "boolean" as const },
        name: { kind: "kebab" as const },
        order: { kind: "integer" as const },
        status: { enum: ["current", "planned"] },
        validates: { items: ["paths", "rules"] },
    },
    required: ["name", "status"],
};

const codesOf = function codesOf(frontmatter: string): string[] {
    return frontmatterSchema(`---\n${frontmatter}\n---\n# T\n`, SCHEMA).map(
        (defect) => `${defect.field}:${defect.code}`,
    );
};

describe("frontmatterSchema", () => {
    it("passes a conforming header", () => {
        expect(codesOf("name: a-b\nstatus: current\norder: 3\ndraft: true\nvalidates: [paths]")).toStrictEqual([]);
    });

    it("reports a missing field, an off-enum value, a wrong type and an unknown list entry", () => {
        expect(codesOf("name: A_b\nstatus: old\norder: x\ndraft: maybe\nvalidates: [odd]")).toStrictEqual([
            "name:invalid-type",
            "status:invalid-enum",
            "order:invalid-type",
            "draft:invalid-type",
            "validates:invalid-enum",
        ]);
        expect(codesOf("status: current\nvalidates: paths")).toStrictEqual([
            "name:missing-required",
            "validates:invalid-type",
        ]);
    });
});
