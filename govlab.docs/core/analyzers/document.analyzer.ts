import type { Categories, Finding, NameFinding } from "#types/finding.types";
import type { DocMeta, DocNode } from "#types/document.types";
import { GENERATED_MARKER, README_FILE } from "#configuration/constants/document.constants";
import { brokenPaths, frontmatterFileRefs } from "#core/analyzers/reference.analyzer";
import { docBasename, docStem, spineProfileFor, stemParts } from "#core/selectors/metadata.selector";
import { isBoundaryFilename, isHarnessOwned, isHostBoundary } from "#core/predicates/document.predicate";
import { AGENT_FRONTMATTER_SCHEMA } from "#configuration/schemas/agent.schema";
import { DOC_ARCH_FRONTMATTER_SCHEMA } from "#configuration/schemas/document.schema";
import { DOC_TYPE_SCHEMAS } from "#configuration/schemas/readme.schema";
import type { DocEntry } from "#types/location.types";
import { REF_CLAIMS } from "#configuration/constants/verb.constants";
import type { RefScan } from "#types/reference.types";
import type { ValidateCtx } from "#types/environment.types";
import { bannedLanguage } from "#core/analyzers/vocabulary.analyzer";
import { conventionHits } from "#core/analyzers/markdown.analyzer";
import { docLocation } from "#core/validators/location.validator";
import { docName } from "#core/validators/filename.validator";
import { docNodeOf } from "#core/converters/document.converter";
import { frontmatterSchema } from "#core/validators/metadata.validator";
import { mermaidHardening } from "#core/analyzers/diagram.analyzer";
import { offSchema } from "#core/validators/section.validator";
import { parseFrontmatter } from "#core/parsers/metadata.parser";
import { refConstructs } from "#core/validators/reference.validator";
import { validateSpine } from "#core/validators/document.validator";

const README_TYPE = "readme";
const NAME_FIELD = "name";
const TYPE_FIELD = "type";
const CONCERN_FIELD = "concern";
const MEMBER_DOT = ".";
const POSIX_SEPARATOR = "/";
const GENERATED_SEGMENT = `${MEMBER_DOT}${GENERATED_MARKER}${MEMBER_DOT}`;
const README_SUFFIX = `${POSIX_SEPARATOR}${README_FILE}`;

export const docMeta = function docMeta(context: ValidateCtx, doc: string, source: string): DocMeta {
    const relDoc = context.relative(doc);
    const { fields } = parseFrontmatter(source);
    const docFilename = docBasename(relDoc);
    return {
        delegated: context.delegatedRoots.some((prefix) => relDoc.startsWith(prefix)),
        doc,
        docFilename,
        fields,
        fmConcern: fields[CONCERN_FIELD] ?? "",
        fmType: fields[TYPE_FIELD],
        harnessOwned: isHarnessOwned(relDoc, context.harnessRoot),
        hostBoundary: isHostBoundary(docFilename, context.boundaryDocs),
        relDoc,
        source,
    };
};

const locationFindings = function locationFindings(context: ValidateCtx, meta: DocMeta): Finding[] {
    if (meta.harnessOwned || meta.hostBoundary || meta.relDoc.includes(GENERATED_SEGMENT)) {
        return [];
    }
    return docLocation({
        concern: meta.fmConcern,
        form: meta.fmType ?? "",
        kind: "authored",
        options: context.locationOptions,
        registries: context.registries,
        relPath: meta.relDoc,
    });
};

const sectionFindings = function sectionFindings(meta: DocMeta): Finding[] {
    const schema = meta.fmType === undefined ? undefined : DOC_TYPE_SCHEMAS[meta.fmType];
    if (schema === undefined || (meta.fmType === README_TYPE && !meta.relDoc.endsWith(README_SUFFIX))) {
        return [];
    }
    return offSchema(meta.source, schema);
};

export const refScanOf = function refScanOf(context: ValidateCtx, meta: DocMeta): RefScan {
    return refConstructs(meta.source, { claims: REF_CLAIMS, verbs: context.userReg.refVerbs });
};

const agentSchemaFindings = function agentSchemaFindings(context: ValidateCtx, meta: DocMeta): Finding[] {
    const agentDir = context.harnessAgentDir;
    return agentDir !== null && meta.relDoc.startsWith(agentDir)
        ? frontmatterSchema(meta.source, AGENT_FRONTMATTER_SCHEMA)
        : [];
};

const spineFindings = function spineFindings(context: ValidateCtx, meta: DocMeta): Finding[] {
    const profile = spineProfileFor(meta.relDoc, context);
    return validateSpine(meta.source, profile.keys, {
        requireFrontmatter: profile.requireFrontmatter,
        requireTitle: profile.requireTitle,
    });
};

const structuralFindings = function structuralFindings(context: ValidateCtx, meta: DocMeta): Categories {
    if (meta.delegated) {
        return { agentSchema: [], docStatus: [], location: [], sections: [], spine: [] };
    }
    return {
        agentSchema: agentSchemaFindings(context, meta),
        docStatus: meta.relDoc.startsWith(context.rootPrefix)
            ? frontmatterSchema(meta.source, DOC_ARCH_FRONTMATTER_SCHEMA)
            : [],
        location: locationFindings(context, meta),
        sections: sectionFindings(meta),
        spine: spineFindings(context, meta),
    };
};

export const analyzeSync = function analyzeSync(context: ValidateCtx, meta: DocMeta): Categories {
    return {
        ...structuralFindings(context, meta),
        broken: [
            ...brokenPaths(context.paths, meta.doc, meta.source),
            ...frontmatterFileRefs(context.paths, meta.doc, meta.source),
        ],
        conventions: conventionHits(meta.source),
        mermaid: mermaidHardening(meta.source),
        refs: refScanOf(context, meta).defects,
        smell: meta.harnessOwned ? [] : bannedLanguage(meta.source),
    };
};

export const locationEntryOf = function locationEntryOf(context: ValidateCtx, meta: DocMeta): DocEntry | null {
    if (meta.delegated || meta.harnessOwned || meta.hostBoundary || isBoundaryFilename(meta.docFilename)) {
        return null;
    }
    const form = meta.fmType ?? "";
    return {
        concern: meta.fmConcern,
        form,
        ...stemParts(docStem(meta.relDoc), context.registries.forms[form]?.tag),
        source: meta.relDoc,
    };
};

export const docNodeFor = function docNodeFor(context: ValidateCtx, meta: DocMeta): DocNode | null {
    return meta.relDoc.startsWith(context.rootPrefix) && typeof meta.fields[NAME_FIELD] === "string"
        ? docNodeOf(meta.relDoc, meta.fields)
        : null;
};

export const nameFindingFor = function nameFindingFor(context: ValidateCtx, meta: DocMeta): NameFinding | null {
    const form = meta.fmType === undefined ? undefined : context.userReg.forms[meta.fmType];
    const name = meta.fields[NAME_FIELD];
    if (!meta.relDoc.startsWith(context.rootPrefix) || name === undefined || form === undefined) {
        return null;
    }
    const names = docName({ activityVerbs: context.userReg.activityVerbs, concern: meta.fmConcern, form, name });
    return names.length > 0 ? { names, relDoc: meta.relDoc } : null;
};
