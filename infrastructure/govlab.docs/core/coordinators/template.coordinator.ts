import {
    MISSING_SUBJECT,
    alreadyExists,
    brokenName,
    concernHint,
    created,
    memberHint,
    notActivity,
    placeholderSummary,
    unknownForm,
    unplaceable,
} from "#configuration/strings/template.strings";
import type { TemplateArguments, TemplateContext } from "#types/environment.types";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import type { DocForm } from "#types/location.types";
import { computeLocation } from "#core/resolvers/location.resolver";
import { docName } from "#core/validators/filename.validator";
import { print } from "#core/reporters/base.reporter";
import { renderTemplate } from "#core/formatters/template.formatter";
import { writeVerbatim } from "@govlab/canonical-write";

const LIST_SEPARATOR = ", ";
const VERB_JOIN = "-";
const DIRECTIVE_MOOD = "directive";
const MODULE_AXIS = "module";
const CURRENT_STATUS = "current";
const PLANNED_STATUS = "planned";
const CONCERN_REASONS: ReadonlySet<string> = new Set(["unknown-concern", "missing-concern"]);
const MEMBER_REASONS: ReadonlySet<string> = new Set(["unmarked-member", "unknown-member"]);

const resolveForm = function resolveForm(context: TemplateContext, form: string): DocForm {
    const def = context.userReg.forms[form];
    if (def === undefined || def.boundary) {
        const valid = Object.entries(context.userReg.forms).flatMap(([id, entry]) => (entry.boundary ? [] : [id]));
        throw new Error(unknownForm(form, valid.join(LIST_SEPARATOR)));
    }
    return def;
};

const composedName = function composedName(context: TemplateContext, def: DocForm, args: TemplateArguments): string {
    if (args.name.length > 0) {
        return args.name;
    }
    if (args.subject.length === 0) {
        throw new Error(MISSING_SUBJECT);
    }
    if (def.mood !== DIRECTIVE_MOOD) {
        return args.subject;
    }
    const verb = context.userReg.activityVerbs[args.concern];
    if (verb === undefined) {
        const activities = Object.keys(context.userReg.activityVerbs).join(LIST_SEPARATOR);
        throw new Error(notActivity(def.id, args.concern, activities));
    }
    return [verb, args.subject].join(VERB_JOIN);
};

const assertName = function assertName(context: TemplateContext, def: DocForm, concern: string, name: string): void {
    const [defect] = docName({ activityVerbs: context.userReg.activityVerbs, concern, form: def, name });
    if (defect !== undefined) {
        throw new Error(brokenName(name, defect.detail));
    }
};

const hintFor = function hintFor(context: TemplateContext, reason: string): string {
    if (CONCERN_REASONS.has(reason)) {
        return concernHint(context.userReg.concerns.join(LIST_SEPARATOR));
    }
    return MEMBER_REASONS.has(reason) ? memberHint((context.registries.owners ?? []).join(LIST_SEPARATOR)) : "";
};

const locate = function locate(context: TemplateContext, args: TemplateArguments, name: string): string {
    const result = computeLocation({
        concern: args.concern,
        form: args.form,
        member: args.member,
        name,
        options: context.locationOptions,
        registries: context.registries,
    });
    if (!result.ok) {
        throw new Error(unplaceable(result.reason, result.detail, hintFor(context, result.reason)));
    }
    return result.path;
};

const statusFor = function statusFor(def: DocForm, requested: string): string {
    if (requested.length > 0) {
        return requested;
    }
    return def.ownerAxis === MODULE_AXIS ? CURRENT_STATUS : PLANNED_STATUS;
};

export const runNew = function runNew(context: TemplateContext, args: TemplateArguments): void {
    const def = resolveForm(context, args.form);
    const name = composedName(context, def, args);
    assertName(context, def, args.concern, name);
    const path = locate(context, args, name);
    const absolute = join(context.root, path);
    if (existsSync(absolute)) {
        throw new Error(alreadyExists(path));
    }
    const summary = args.summary.length > 0 ? args.summary : placeholderSummary(name);
    mkdirSync(dirname(absolute), { recursive: true });
    writeVerbatim(
        absolute,
        renderTemplate({
            concern: args.concern,
            def,
            form: args.form,
            name,
            status: statusFor(def, args.status),
            summary,
        }),
    );
    print(created(path));
};
