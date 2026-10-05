import { DEFAULT_ROOT_PREFIX, GENERATED_MARKER, MARKDOWN_SUFFIX } from "#configuration/constants/document.constants";
import type {
    DocForm,
    DocRegistries,
    LocationOptions,
    LocationRequest,
    LocationResult,
    OwnerContext,
} from "#types/location.types";
import {
    badName,
    boundaryForm,
    declaredDocFailure,
    missingConcern,
    moduleConcern,
    noConcernForm,
    notAuthored,
    unknownConcern,
    unknownForm,
    unknownMember,
    unmarkedMember,
    unresolvedOwner,
} from "#configuration/strings/location.strings";
import type { DocumentDecl } from "#types/document.types";

const NAME_STOP: ReadonlySet<string> = new Set(["/", "\\", " ", "\t", "\r", "\n"]);
const OWNER_SEPARATOR = ", ";

const isCleanName = function isCleanName(name: string): boolean {
    if (name.length === 0 || name.endsWith(MARKDOWN_SUFFIX)) {
        return false;
    }
    for (const char of name) {
        if (NAME_STOP.has(char)) {
            return false;
        }
    }
    return true;
};

const memberDefect = function memberDefect(
    member: string | undefined,
    registries: DocRegistries,
): LocationResult | null {
    const owners = registries.owners ?? [];
    if (owners.length === 0) {
        return null;
    }
    if (member === undefined || member.length === 0) {
        return { detail: unmarkedMember(owners.join(OWNER_SEPARATOR)), ok: false, reason: "unmarked-member" };
    }
    if (!owners.includes(member)) {
        return { detail: unknownMember(member, owners.join(OWNER_SEPARATOR)), ok: false, reason: "unknown-member" };
    }
    return null;
};

const fileOf = function fileOf(name: string, member: string | undefined, def: DocForm, generated: boolean): string {
    const stem = member === undefined || member.length === 0 ? name : `${name}.${member}`;
    const tag = generated ? GENERATED_MARKER : def.tag;
    return tag === undefined || tag.length === 0 ? stem : `${stem}.${tag}`;
};

const concernOwned = function concernOwned(context: OwnerContext): LocationResult {
    if (context.concern.length === 0) {
        return { detail: missingConcern(context.def.id), ok: false, reason: "missing-concern" };
    }
    if (!context.registries.concerns.includes(context.concern)) {
        return { detail: unknownConcern(context.concern), ok: false, reason: "unknown-concern" };
    }
    return { ok: true, path: `${context.base}${context.file}${MARKDOWN_SUFFIX}` };
};

const moduleOwned = function moduleOwned(context: OwnerContext): LocationResult {
    if (context.concern.length > 0) {
        return { detail: moduleConcern(context.def.id), ok: false, reason: "axis-contradiction" };
    }
    const owner = context.options.resolveOwner ? context.options.resolveOwner(context.name) : context.name;
    if (owner.length === 0) {
        return { detail: unresolvedOwner(context.name), ok: false, reason: "unresolved-owner" };
    }
    return { ok: true, path: `${context.base}${owner}${MARKDOWN_SUFFIX}` };
};

const resolveForOwner = function resolveForOwner(context: OwnerContext): LocationResult {
    if (context.def.ownerAxis === "concern") {
        return concernOwned(context);
    }
    if (context.def.ownerAxis === "module") {
        return moduleOwned(context);
    }
    if (context.concern.length > 0) {
        return { detail: noConcernForm(context.def.id), ok: false, reason: "axis-contradiction" };
    }
    return { ok: true, path: `${context.base}${context.file}${MARKDOWN_SUFFIX}` };
};

const formDefect = function formDefect(def: DocForm, form: string, name: string): LocationResult | null {
    if (def.boundary) {
        return { detail: boundaryForm(form), ok: false, reason: "boundary-form" };
    }
    if (def.kind !== "authored") {
        return { detail: notAuthored(def.kind), ok: false, reason: "not-authored" };
    }
    return isCleanName(name) ? null : { detail: badName(name), ok: false, reason: "bad-name" };
};

export const computeLocation = function computeLocation(request: LocationRequest): LocationResult {
    const { form, concern, name, member, registries, options = {} } = request;
    const generated = request.generated === true;
    const def = registries.forms[form];
    if (!def) {
        return { detail: unknownForm(form), ok: false, reason: "unknown-form" };
    }
    const defect =
        formDefect(def, form, name) ?? (def.ownerAxis === "module" ? null : memberDefect(member, registries));
    if (defect !== null) {
        return defect;
    }
    const folder = generated ? GENERATED_MARKER : def.folder;
    const base = `${options.rootPrefix ?? DEFAULT_ROOT_PREFIX}${folder}/`;
    return resolveForOwner({
        base,
        concern,
        def,
        file: fileOf(name, member, def, generated),
        name,
        options,
        registries,
    });
};

export const declaredDocLocation = function declaredDocLocation(
    doc: DocumentDecl,
    registries: DocRegistries,
    options: LocationOptions,
): string {
    const location = computeLocation({
        concern: doc.concern ?? "",
        form: doc.type,
        generated: doc.generated,
        member: doc.member,
        name: doc.name,
        options,
        registries,
    });
    if (!location.ok) {
        throw new Error(declaredDocFailure(doc.name, location.reason, location.detail));
    }
    return location.path;
};
