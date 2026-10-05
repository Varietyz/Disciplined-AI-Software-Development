import type { DocVerb } from "#types/reference.types";

const PATHS = "paths";
const IDENTIFIERS = "identifiers";
const PATH_EXISTS = "path-exists";

const PATH_ONLY: DocVerb = { checks: [PATH_EXISTS], satisfies: [PATHS] };
const EXPORTED: DocVerb = { checks: [PATH_EXISTS, "ident-exported-from-path"], satisfies: [PATHS, IDENTIFIERS] };
const DECLARED: DocVerb = { checks: [PATH_EXISTS, "ident-declared-in-path"], satisfies: [PATHS, IDENTIFIERS] };

export const REF_CLAIMS: readonly string[] = [PATHS, IDENTIFIERS, "registries", "rules"];

export const DOC_VERBS: Readonly<Record<string, DocVerb>> = {
    at: PATH_ONLY,
    "declared at": DECLARED,
    "defined at": DECLARED,
    "enforced by": { checks: [PATH_EXISTS], satisfies: [PATHS, "rules"] },
    exports: EXPORTED,
    from: PATH_ONLY,
    "imports from": EXPORTED,
    in: PATH_ONLY,
    "lives at": EXPORTED,
    "located at": EXPORTED,
    "registered at": {
        checks: [PATH_EXISTS, "ident-referenced-in-path"],
        satisfies: [PATHS, IDENTIFIERS, "registries"],
    },
    see: PATH_ONLY,
    via: PATH_ONLY,
};

export const EXPORT_FORMS: readonly string[] = [
    "export const ",
    "export function ",
    "export class ",
    "export type ",
    "export interface ",
    "export enum ",
    "export { ",
];

export const DECLARE_FORMS: readonly string[] = [
    "const ",
    "function ",
    "class ",
    "type ",
    "interface ",
    "enum ",
    "let ",
];
