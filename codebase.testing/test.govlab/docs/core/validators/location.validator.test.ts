import { describe, expect, it } from "vitest";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import type { DocLocationInput } from "@govlab/docs/types/location.types.ts";
import { docLocation } from "@govlab/docs/core/validators/location.validator.ts";
import { relativePath } from "@ssot/paths";

const registries = { concerns: ["architecture", "quality", "security", "frontend"], forms: DOC_FORMS };

const inputOf = function inputOf(relPath: string, form: string, concern: string): DocLocationInput {
    return { concern, form, kind: "authored", registries, relPath };
};

const codesOf = function codesOf(input: DocLocationInput): string[] {
    return docLocation(input).map((defect) => defect.code);
};

describe("docLocation", () => {
    it("passes a correctly placed authored document", () => {
        expect(codesOf(inputOf(`${DEFAULT_ROOT_PREFIX}plans/harden-auth.plan.md`, "plan", "security"))).toStrictEqual(
            [],
        );
    });

    it("reports a misplaced authored document with its routed path", () => {
        const [defect] = docLocation(inputOf("documentation/harden-auth.plan.md", "plan", "security"));
        expect(defect?.code).toBe("off-location");
        expect(defect?.expected).toBe(`${DEFAULT_ROOT_PREFIX}plans/harden-auth.plan.md`);
        const [atRoot] = docLocation(inputOf(`${relativePath("govlab.quality")}/notes.note.md`, "note", "quality"));
        expect(atRoot?.expected).toBe(`${DEFAULT_ROOT_PREFIX}notes/notes.note.md`);
    });

    it("passes a co-located boundary document and reports one inside the tree", () => {
        const colocated = inputOf(`${relativePath("govlab.quality")}/README.md`, "readme", "");
        expect(codesOf(colocated)).toStrictEqual([]);
        expect(codesOf(inputOf(`${DEFAULT_ROOT_PREFIX}references/architecture/README.md`, "readme", ""))).toStrictEqual(
            ["boundary-misplaced"],
        );
    });

    it("reports the router reason for an unknown concern and a contradicting axis", () => {
        expect(codesOf(inputOf(`${DEFAULT_ROOT_PREFIX}plans/gain/x.md`, "plan", "gain"))).toStrictEqual([
            "unknown-concern",
        ]);
        expect(
            codesOf(inputOf(`${DEFAULT_ROOT_PREFIX}changelogs/govlab-sync.md`, "changelog", "security")),
        ).toStrictEqual(["axis-contradiction"]);
    });

    it("exempts generated and template kinds anywhere", () => {
        expect(codesOf({ ...inputOf("anywhere/at/all.md", "plan", "security"), kind: "generated" })).toStrictEqual([]);
        expect(codesOf({ ...inputOf("x.md", "plan", "security"), kind: "template" })).toStrictEqual([]);
    });
});
