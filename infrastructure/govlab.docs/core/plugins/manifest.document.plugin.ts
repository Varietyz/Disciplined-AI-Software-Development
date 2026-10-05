import { ACTIVITY_VERBS, DOC_CONCERNS } from "#configuration/constants/concern.constants";
import {
    MANIFEST_ERRORS,
    documentBody,
    documentConcern,
    documentLead,
    documentMember,
    documentName,
    documentObject,
    documentSummary,
    documentTitle,
    documentType,
    duplicateDocument,
    sectionContent,
    sectionHeading,
} from "#configuration/strings/manifest.strings";
import { docsConfig, loadGovlabConfig } from "@govlab/quality/config";
import { isNonEmptyString, isRenderable } from "#core/predicates/readme.predicate";
import { DOC_FORMS } from "#configuration/constants/form.constants";
import { DOC_VERBS } from "#configuration/constants/verb.constants";
import type { Manifest } from "#types/readme.types";
import type { ManifestPlugin } from "#types/manifest.types";
import { ROOT } from "@ssot/paths";
import { isKebab } from "#core/predicates/character.predicate";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { loadUserRegistries } from "#core/loaders/registry.loader";

const SECTION = "documents";
const KNOWN_SEPARATOR = ", ";
const REGISTRIES = await loadUserRegistries(ROOT, {
    activityVerbs: ACTIVITY_VERBS,
    concerns: DOC_CONCERNS,
    forms: DOC_FORMS,
    refVerbs: DOC_VERBS,
});
const MEMBERS = docsConfig(await loadGovlabConfig(ROOT)).members;

const memberErrors = function memberErrors(doc: Manifest, at: string, ownerAxis: string): string[] {
    const { member } = doc;
    if (MEMBERS.length === 0 || ownerAxis === "module" || (typeof member === "string" && MEMBERS.includes(member))) {
        return [];
    }
    return [documentMember(at, String(member), MEMBERS.join(KNOWN_SEPARATOR))];
};

const typeErrors = function typeErrors(doc: Manifest, at: string): string[] {
    const { type, concern } = doc;
    const form = typeof type === "string" ? REGISTRIES.forms[type] : undefined;
    if (form === undefined || form.boundary) {
        return [documentType(at, String(type))];
    }
    if (form.ownerAxis === "concern" && !(typeof concern === "string" && REGISTRIES.concerns.includes(concern))) {
        return [documentConcern(at, String(concern))];
    }
    return memberErrors(doc, at, form.ownerAxis);
};

const sectionErrors = function sectionErrors(section: unknown, at: string, index: number): string[] {
    const record = isPlainRecord(section) ? section : {};
    return [
        ...(isNonEmptyString(record["heading"]) ? [] : [sectionHeading(at, index)]),
        ...(isRenderable(record["content"]) ? [] : [sectionContent(at, index)]),
    ];
};

const bodyErrors = function bodyErrors(doc: Manifest, at: string): string[] {
    const { body } = doc;
    if (!Array.isArray(body) || body.length === 0) {
        return [documentBody(at)];
    }
    return body.flatMap((section, index) => sectionErrors(section, at, index));
};

const optionalErrors = function optionalErrors(doc: Manifest, at: string): string[] {
    return [
        ...(doc["title"] !== undefined && !isNonEmptyString(doc["title"]) ? [documentTitle(at)] : []),
        ...(doc["lead"] !== undefined && !isRenderable(doc["lead"]) ? [documentLead(at)] : []),
    ];
};

const entryErrors = function entryErrors(doc: unknown, at: string): string[] {
    if (!isPlainRecord(doc)) {
        return [documentObject(at)];
    }
    return [
        ...typeErrors(doc, at),
        ...(isKebab(doc["name"]) ? [] : [documentName(at)]),
        ...(isNonEmptyString(doc["summary"]) ? [] : [documentSummary(at)]),
        ...optionalErrors(doc, at),
        ...bodyErrors(doc, at),
    ];
};

const duplicateErrors = function duplicateErrors(documents: readonly unknown[], doc: unknown, index: number): string[] {
    const name = isPlainRecord(doc) ? doc["name"] : undefined;
    if (typeof name !== "string") {
        return [];
    }
    const first = documents.findIndex((other) => isPlainRecord(other) && other["name"] === name);
    return first < index ? [duplicateDocument(index, name)] : [];
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const documents = manifest[SECTION];
        const names = (Array.isArray(documents) ? documents : []).flatMap((doc) =>
            isPlainRecord(doc) && typeof doc["name"] === "string" ? [doc["name"]] : [],
        );
        if (names.length > 0) {
            entry[SECTION] = names;
        }
    },
    name: "documents",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const documents = manifest[SECTION];
            if (documents === undefined) {
                return [];
            }
            if (!Array.isArray(documents)) {
                return [MANIFEST_ERRORS.documentsShape];
            }
            return documents.flatMap((doc, index) => [
                ...entryErrors(doc, `${SECTION}[${index}]`),
                ...duplicateErrors(documents, doc, index),
            ]);
        },
    },
};
