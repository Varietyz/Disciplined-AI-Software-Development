import { describe, expect, it } from "vitest";
import { ACTIVITY_VERBS } from "@govlab/docs/configuration/constants/concern.constants.ts";
import { DOC_FORMS } from "@govlab/docs/configuration/constants/form.constants.ts";
import { docName } from "@govlab/docs/core/validators/filename.validator.ts";

const codesOf = function codesOf(formId: string, concern: string, name: string): string[] {
    const form = DOC_FORMS[formId];
    return form === undefined
        ? ["no-form"]
        : docName({ activityVerbs: ACTIVITY_VERBS, concern, form, name }).map((defect) => defect.code);
};

describe("docName", () => {
    it("passes a directive name that opens with its verb", () => {
        expect(codesOf("guide", "scaling", "scale-govlab-quality")).toStrictEqual([]);
        expect(codesOf("plan", "migration", "migrate-i18n-cutover")).toStrictEqual([]);
        expect(codesOf("checklist", "implementation", "implement-context-delivery")).toStrictEqual([]);
    });

    it("passes a declarative name with a bare subject", () => {
        expect(codesOf("reference", "governance", "glossary")).toStrictEqual([]);
        expect(codesOf("design", "ai", "devlab")).toStrictEqual([]);
        expect(codesOf("taxonomy", "governance", "file-typing")).toStrictEqual([]);
        expect(codesOf("research", "product", "idle-games")).toStrictEqual([]);
    });

    it("reports a wrong verb, a domain concern on a directive form and a missing subject", () => {
        const form = DOC_FORMS["guide"];
        const [defect] =
            form === undefined
                ? []
                : docName({ activityVerbs: ACTIVITY_VERBS, concern: "scaling", form, name: "use-govlab-quality" });
        expect(defect?.code).toBe("missing-concern-verb");
        expect(defect?.expected).toBe("scale-…");
        expect(codesOf("guide", "quality", "scale-x")).toStrictEqual(["non-activity-concern"]);
        expect(codesOf("guide", "scaling", "scale-")).toStrictEqual(["missing-subject"]);
        expect(codesOf("reference", "ai", "")).toStrictEqual(["missing-subject"]);
    });

    it("exempts module-owned and boundary forms", () => {
        expect(codesOf("changelog", "", "govlab-sync")).toStrictEqual([]);
        expect(codesOf("readme", "", "README")).toStrictEqual([]);
    });

    it("finds a mood and a tag on every routable authored form", () => {
        const routable = Object.values(DOC_FORMS).filter(
            (def) => !def.boundary && def.kind === "authored" && def.ownerAxis !== "module",
        );
        expect(routable.every((def) => def.mood !== undefined && def.tag !== undefined)).toBe(true);
    });
});
