import {
    ASSET_SPECIFIER,
    FACE_JOINER,
    GENERATED_TAG,
    REFERENCE_STEM,
} from "#configuration/constants/reference.constants";
import type { ReferenceIndex } from "@banes-lab/web/types/reference.types.js";

export const renderReferenceFace = function renderReferenceFace(index: ReferenceIndex): string {
    return [
        'import type { ReferenceIndex } from "#types/reference.types";',
        "",
        `export const REFERENCES: ReferenceIndex = JSON.parse(${JSON.stringify(JSON.stringify(index))});`,
        "",
    ].join("\n");
};

export const renderReferenceLoader = function renderReferenceLoader(faces: readonly string[]): string {
    const entries = faces.map(
        (face) =>
            `    [${JSON.stringify(face)}, () => import(${JSON.stringify(ASSET_SPECIFIER + REFERENCE_STEM + FACE_JOINER + face + GENERATED_TAG)})],`,
    );
    return [
        'import type { ReferenceIndex } from "#types/reference.types";',
        "",
        "const LOADERS: ReadonlyMap<string, () => Promise<{ readonly REFERENCES: ReferenceIndex }>> = new Map([",
        ...entries,
        "]);",
        "",
        "export const loadReferences = async function loadReferences(collection: string): Promise<ReferenceIndex | null> {",
        "    const load = LOADERS.get(collection);",
        "    return load === undefined ? null : (await load()).REFERENCES;",
        "};",
        "",
    ].join("\n");
};
