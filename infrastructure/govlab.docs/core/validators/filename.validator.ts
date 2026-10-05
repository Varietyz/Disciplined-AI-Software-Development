import type { DirectiveSubject, DocNameDefect, DocNameInput } from "#types/document.types";
import { missingConcernVerb, missingSubject, nonActivityConcern } from "#configuration/strings/document.strings";

const VERB_JOIN = "-";
const ELLIPSIS = "…";

const directiveCheck = function directiveCheck(input: DocNameInput): DirectiveSubject {
    const verb = input.activityVerbs[input.concern];
    if (typeof verb !== "string") {
        return {
            defects: [{ code: "non-activity-concern", detail: nonActivityConcern(input.form.id, input.concern) }],
            subject: "",
        };
    }
    const verbSegment = `${verb}${VERB_JOIN}`;
    if (!input.name.startsWith(verbSegment)) {
        const detail = missingConcernVerb(input.name, verbSegment, input.concern, verb);
        return {
            defects: [{ code: "missing-concern-verb", detail, expected: `${verbSegment}${ELLIPSIS}` }],
            subject: "",
        };
    }
    return { defects: [], subject: input.name.slice(verbSegment.length) };
};

export const docName = function docName(input: DocNameInput): DocNameDefect[] {
    const { form } = input;
    if (form.kind !== "authored" || form.boundary || typeof form.mood !== "string") {
        return [];
    }
    const checked: DirectiveSubject =
        form.mood === "directive" ? directiveCheck(input) : { defects: [], subject: input.name };
    if (checked.defects.length > 0) {
        return checked.defects;
    }
    return checked.subject.length === 0 ? [{ code: "missing-subject", detail: missingSubject(input.name) }] : [];
};
