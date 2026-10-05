import { DECLARE_FORMS, EXPORT_FORMS } from "#configuration/constants/verb.constants";
import type {
    RefCheck,
    RefConstruct,
    RefConstructDefect,
    RefFinding,
    RefResolveCtx,
    RefScan,
    RefScanOptions,
} from "#types/reference.types";
import {
    emptyDirectory,
    emptyFile,
    missingPath,
    notDeclared,
    notExported,
    notReferenced,
    unknownClaim,
    unknownVerbResolved,
    unsatisfiedClaim,
} from "#configuration/strings/reference.strings";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { listValues, parseFrontmatter } from "#core/parsers/metadata.parser";
import { join } from "node:path";
import { parseReferences } from "#core/parsers/reference.parser";

const FIRST_COLUMN = 1;
const CLAIM_KEY = "validates";
const LIST_SEPARATOR = ", ";

const declaredClaims = function declaredClaims(source: string): string[] {
    const raw = parseFrontmatter(source).fields[CLAIM_KEY];
    return typeof raw === "string" ? (listValues(raw) ?? []) : [];
};

const claimDefect = function claimDefect(
    claim: string,
    satisfied: ReadonlySet<string>,
    options: RefScanOptions,
): RefConstructDefect | null {
    if (!options.claims.includes(claim)) {
        const detail = unknownClaim(claim, options.claims.join(LIST_SEPARATOR));
        return { code: "unknown-claim", col: FIRST_COLUMN, detail, line: FIRST_COLUMN };
    }
    if (satisfied.has(claim)) {
        return null;
    }
    return { code: "unsatisfied-claim", col: FIRST_COLUMN, detail: unsatisfiedClaim(claim), line: FIRST_COLUMN };
};

const claimDefects = function claimDefects(
    source: string,
    used: readonly RefConstruct[],
    options: RefScanOptions,
): RefConstructDefect[] {
    const satisfied = new Set(used.flatMap((construct) => options.verbs[construct.verb]?.satisfies ?? []));
    return declaredClaims(source).flatMap((claim) => {
        const defect = claimDefect(claim, satisfied, options);
        return defect === null ? [] : [defect];
    });
};

export const refConstructs = function refConstructs(source: string, options: RefScanOptions): RefScan {
    const scan = parseReferences(source, Object.keys(options.verbs));
    return {
        constructs: scan.constructs,
        defects: [...scan.defects, ...claimDefects(source, scan.constructs, options)],
    };
};

const resolveIn = function resolveIn(roots: readonly string[], target: string): string | null {
    return roots.map((root) => join(root, target)).find((full) => existsSync(full)) ?? null;
};

const emptyDefect = function emptyDefect(full: string, target: string): string | null {
    const stat = statSync(full);
    if (stat.isDirectory()) {
        return readdirSync(full).length === 0 ? emptyDirectory(target) : null;
    }
    return stat.size === 0 ? emptyFile(target) : null;
};

const namedIn = function namedIn(text: string, forms: readonly string[], name: string): boolean {
    if (forms.some((form) => text.includes(form + name))) {
        return true;
    }
    const listed = [`{ ${name} }`, `{ ${name},`, `, ${name} }`, `, ${name},`];
    return listed.some((shape) => text.includes(shape));
};

const identDetail = function identDetail(check: RefCheck, full: string, construct: RefConstruct): string | null {
    if (statSync(full).isDirectory()) {
        return null;
    }
    const text = readFileSync(full, "utf8");
    const { identifier, path } = construct;
    if (check === "ident-exported-from-path") {
        return namedIn(text, EXPORT_FORMS, identifier) ? null : notExported(identifier, path);
    }
    if (check === "ident-declared-in-path") {
        return namedIn(text, DECLARE_FORMS, identifier) ? null : notDeclared(identifier, path);
    }
    return text.includes(identifier) ? null : notReferenced(identifier, path);
};

const detailFor = function detailFor(check: RefCheck, construct: RefConstruct, context: RefResolveCtx): string | null {
    const full = resolveIn(context.roots, construct.path);
    if (full === null) {
        return missingPath(construct.path);
    }
    return check === "path-exists" ? emptyDefect(full, construct.path) : identDetail(check, full, construct);
};

const constructFindings = function constructFindings(construct: RefConstruct, context: RefResolveCtx): RefFinding[] {
    const verb = context.verbs[construct.verb];
    if (verb === undefined) {
        return [{ col: construct.col, detail: unknownVerbResolved(construct.verb), line: construct.line }];
    }
    return verb.checks.flatMap((check) => {
        const detail = detailFor(check, construct, context);
        return detail === null ? [] : [{ col: construct.col, detail, line: construct.line }];
    });
};

export const resolveRefs = function resolveRefs(
    constructs: readonly RefConstruct[],
    context: RefResolveCtx,
): RefFinding[] {
    return constructs.flatMap((construct) => constructFindings(construct, context));
};
