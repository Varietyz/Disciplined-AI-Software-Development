import type { AsciiArrow } from "#types/validation.types";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";

const ASCII_ARROW = "->";
const DECLARED_ALTERNATIVE = '"→" | "->"';
const PATH_JOINER = ".";
const EDGE_ID_PREFIX = "edge:";
const REASONING = COLLECTIONS.reasoning;
const PAG = COLLECTIONS.pag;

const carriesAsciiArrow = function carriesAsciiArrow(text: string): boolean {
    return text.split(DECLARED_ALTERNATIVE).some((part) => part.includes(ASCII_ARROW));
};

const arrowFieldsOf = function arrowFieldsOf(value: unknown, path: string): string[] {
    if (typeof value === "string") {
        return carriesAsciiArrow(value) ? [path] : [];
    }
    if (Array.isArray(value)) {
        return value.flatMap((item, index) => arrowFieldsOf(item, `${path}[${String(index)}]`));
    }
    if (typeof value === "object" && value !== null) {
        return Object.entries(value).flatMap(([key, item]) =>
            arrowFieldsOf(item, path === "" ? key : `${path}${PATH_JOINER}${key}`),
        );
    }
    return [];
};

export const asciiArrowsIn = function asciiArrowsIn(collection: string, id: string, record: unknown): AsciiArrow[] {
    return arrowFieldsOf(record, "").map((field) => ({ collection, field, id }));
};

const recordsOf = function recordsOf<R>(
    collection: string,
    records: readonly R[],
    idOf: (record: R) => string,
): AsciiArrow[] {
    return records.flatMap((record) => asciiArrowsIn(collection, idOf(record), record));
};

const reasonArrowsOf = function reasonArrowsOf(reason: Faces["reason"]): AsciiArrow[] {
    const withId = [
        ...reason.layers(),
        ...reason.mathTypes(),
        ...reason.axes(),
        ...reason.nodes(),
        ...reason.dimensions(),
        ...reason.lenses(),
        ...reason.modes(),
        ...reason.representations(),
        ...reason.mathDomains(),
        ...reason.patternTypes(),
        ...reason.models(),
        ...reason.universalAxes(),
        ...reason.testSurfaces(),
        ...reason.techniques(),
        ...reason.invariants(),
        ...reason.failureShapes(),
    ];
    return [
        ...recordsOf(REASONING, withId, (record) => record.id),
        ...asciiArrowsIn(REASONING, "derivation-loop", reason.derivationLoop()),
        ...asciiArrowsIn(REASONING, "substrate", reason.substrate()),
        ...recordsOf(REASONING, reason.edges(), (edge) => `${EDGE_ID_PREFIX}${edge.from}`),
    ];
};

const pagArrowsOf = function pagArrowsOf(pag: Faces["pag"]): AsciiArrow[] {
    return [
        ...recordsOf(PAG, pag.keywords(), (keyword) => keyword.keyword),
        ...recordsOf(PAG, pag.documentTypes(), (documentType) => documentType.type),
        ...recordsOf(PAG, pag.productions(), (production) => production.lhs),
        ...recordsOf(PAG, pag.templates(), (template) => template.type),
    ];
};

export const asciiArrowsOf = function asciiArrowsOf(faces: Faces): AsciiArrow[] {
    return [
        ...recordsOf(COLLECTIONS.architecture, faces.arch.all(), (principle) => principle.id),
        ...recordsOf(COLLECTIONS.lexicon, faces.lex.all(), (term) => term.id),
        ...recordsOf(COLLECTIONS.algorithms, faces.algo.all(), (contract) => contract.id),
        ...reasonArrowsOf(faces.reason),
        ...pagArrowsOf(faces.pag),
    ];
};
