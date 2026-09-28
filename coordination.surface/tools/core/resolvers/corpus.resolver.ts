import type { CorpusRootData } from "../types/taxonomy.types.ts";
import type { Document } from "../types/segment.types.ts";

const SEPARATOR = ".";

export const nameParts = function nameParts(name: string): string[] {
    const parts: string[] = [];
    let held = "";

    for (let index = 0; index < name.length; index += 1) {
        const character = name.charAt(index);
        if (character === SEPARATOR) {
            parts.push(held);
            held = "";
            continue;
        }
        held += character;
    }
    parts.push(held);

    return parts;
};

export const rawFacetOf = function rawFacetOf(document: Document, config: CorpusRootData): string | null {
    const fields = document.segments.filter((segment) => segment.kind === "frontmatter-field");
    const value = config.facetFields
        .flatMap((field) => fields.filter((segment) => segment.key === field).map((segment) => segment.value ?? ""))
        .find((held) => held.length > 0);
    return value ?? null;
};

export const symbolOf = function symbolOf(document: Document): string | null {
    for (const segment of document.segments) {
        if (segment.kind !== "heading") {
            continue;
        }

        const value = (segment.key ?? segment.value ?? "").trim();
        if (value.length > 0) {
            return value;
        }
    }

    return null;
};

export const keyFromSymbol = function keyFromSymbol(symbol: string): string {
    let key = "";

    for (let index = 0; index < symbol.length; index += 1) {
        const character = symbol.charAt(index);
        if (character === "_") {
            key += "-";
            continue;
        }
        key += character.toLowerCase();
    }

    return key;
};
