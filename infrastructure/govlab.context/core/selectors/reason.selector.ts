import { CELL_SEPARATOR } from "#configuration/constants/reason.constants";
import type { KindSchema } from "#types/field.types";
import { REASON_SCHEMA } from "#configuration/schemas/reason.schema";
import type { ReasonData } from "#types/reason.types";
import { undeclaredReasonKind } from "#configuration/strings/reason.strings";

export const REASON_KINDS: ReadonlyMap<string, (data: ReasonData) => readonly { id: string }[]> = new Map<
    string,
    (data: ReasonData) => readonly { id: string }[]
>([
    ["axis", (data) => data.axes],
    ["dimension", (data) => data.dimensions],
    ["failure-shape", (data) => data.failureShapes],
    ["invariant", (data) => data.invariants],
    ["layer", (data) => data.layers],
    ["lens", (data) => data.lenses],
    ["loop", (data) => [data.derivationLoop]],
    ["math-domain", (data) => data.mathDomains],
    ["math-type", (data) => data.mathTypes],
    ["mode", (data) => data.modes],
    ["model", (data) => data.models],
    ["node", (data) => data.nodes],
    ["pattern-type", (data) => data.patternTypes],
    ["representation", (data) => data.representations],
    ["stage", (data) => data.derivationLoop.stages],
    ["substrate-node", (data) => data.substrate.nodes],
    ["technique", (data) => data.techniques],
    ["test-surface", (data) => data.testSurfaces],
    ["universal-axis", (data) => data.universalAxes],
]);

export const kindMembersOf = function kindMembersOf(data: ReasonData): ReadonlyMap<string, ReadonlySet<string>> {
    return new Map(
        [...REASON_KINDS].map(([kind, recordsOf]) => [kind, new Set(recordsOf(data).map((record) => record.id))]),
    );
};

export const schemaOf = function schemaOf(kind: string): KindSchema {
    const schema = REASON_SCHEMA.get(kind);
    if (schema === undefined) {
        throw new Error(undeclaredReasonKind(kind));
    }
    return schema;
};

export const collectIds = function collectIds(data: ReasonData): string[] {
    const groups: readonly (readonly { id: string }[])[] = [
        data.nodes,
        data.axes,
        data.layers,
        data.mathTypes,
        data.substrate.nodes,
        data.dimensions,
        data.lenses,
        data.modes,
        data.representations,
        data.mathDomains,
        data.patternTypes,
        data.models,
        data.universalAxes,
        data.testSurfaces,
        data.techniques,
        data.invariants,
        data.failureShapes,
    ];
    const ids = new Set<string>([...groups.flat().map((record) => record.id), data.derivationLoop.id]);
    return [...ids].toSorted((a, b) => a.localeCompare(b));
};

export const cellOf = function cellOf(dimension: string, lens: string): string {
    return `${dimension}${CELL_SEPARATOR}${lens}`;
};

export const uncoveredCellsOf = function uncoveredCellsOf(data: ReasonData): { dimension: string; lens: string }[] {
    const covered = new Set(data.testSurfaces.map((surface) => cellOf(surface.dimension, surface.lens)));
    return data.dimensions.flatMap((dimension) =>
        data.lenses
            .filter((lens) => !covered.has(cellOf(dimension.id, lens.id)))
            .map((lens) => ({ dimension: dimension.id, lens: lens.id })),
    );
};
