import { CHECK_KEY, RECORDS_KEY } from "#configuration/constants/ontology.constants";
import {
    DOCUMENT_TYPES_FILE,
    KEYWORDS_FILE,
    PRODUCTIONS_FILE,
    TEMPLATES_SOURCE,
    TEMPLATE_FILE_PREFIX,
    TERMINALS_KEY,
} from "#configuration/constants/grammar.constants";
import type { GrammarFile, PagData } from "#types/grammar.types";
import {
    normalizeDocumentType,
    normalizeKeyword,
    normalizeProduction,
    normalizeTemplate,
    refused,
} from "#core/normalizers/grammar.normalizer";
import { readJsonDir, readJsonFile } from "#core/loaders/ontology.loader";
import type { CheckTable } from "#core/stores/check.store";
import { PAG_KINDS } from "#configuration/schemas/grammar.schema";
import type { ReadAudit } from "#core/observers/record.observer";
import { absolutePath } from "@ssot/paths";
import { asString } from "#core/normalizers/field.normalizer";
import { isObject } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { keywordIdOf } from "#core/selectors/grammar.selector";

interface GrammarLoad {
    audit: ReadAudit;
    checks: CheckTable;
    dir: string;
}

const fileOf = function fileOf(load: GrammarLoad, source: string, kind: string): GrammarFile {
    const parsed = readJsonFile(join(load.dir, source));
    if (!isObject(parsed)) {
        load.audit.reject(parsed, source);
        return { kind, object: {}, source };
    }
    const tracked = load.audit.track(parsed, source);
    load.audit.attribution(tracked);
    return { kind, object: tracked, source };
};

const declaredRecords = function declaredRecords<T>(
    load: GrammarLoad,
    file: GrammarFile,
    normalize: (raw: Record<string, unknown>) => T,
    idOf: (record: T) => string,
): T[] {
    load.checks.forKind(file.kind, file.object[CHECK_KEY]);
    return load.audit.records(file.object[RECORDS_KEY], file.source).map((raw) => {
        const record = normalize(raw);
        load.checks.forRecord(file.kind, idOf(record), raw[CHECK_KEY]);
        return record;
    });
};

const terminalsOf = function terminalsOf(file: GrammarFile): string[] {
    const terminals = file.object[TERMINALS_KEY];
    return Array.isArray(terminals) ? terminals.map(asString) : [];
};

export const loadBundledData = function loadBundledData(audit: ReadAudit, checks: CheckTable): PagData {
    const load: GrammarLoad = { audit, checks, dir: absolutePath("govlab.context.grammar") };
    const productionsFile = fileOf(load, PRODUCTIONS_FILE, PAG_KINDS.production);
    const keywords = declaredRecords(
        load,
        fileOf(load, KEYWORDS_FILE, PAG_KINDS.keyword),
        refused(PAG_KINDS.keyword, normalizeKeyword),
        keywordIdOf,
    );
    const documentTypes = declaredRecords(
        load,
        fileOf(load, DOCUMENT_TYPES_FILE, PAG_KINDS.documentType),
        refused(PAG_KINDS.documentType, normalizeDocumentType),
        (record) => record.type,
    );
    const productions = declaredRecords(
        load,
        productionsFile,
        refused(PAG_KINDS.production, normalizeProduction),
        (record) => record.lhs,
    );
    const template = refused(PAG_KINDS.template, normalizeTemplate);
    const raws = readJsonDir(load.dir, { only: (name) => name.startsWith(TEMPLATE_FILE_PREFIX) });
    const templates = audit.records(raws, TEMPLATES_SOURCE).map((raw) => {
        audit.attribution(raw);
        const record = template(raw);
        checks.forRecord(PAG_KINDS.template, record.type, raw[CHECK_KEY]);
        return record;
    });
    return { documentTypes, keywords, productions, templates, terminals: terminalsOf(productionsFile) };
};
