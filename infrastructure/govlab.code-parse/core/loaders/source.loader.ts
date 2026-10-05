import { existsSync, readFileSync } from "node:fs";
import { EXTENSION_DOT } from "#configuration/constants/source.constants";
import { EXTENSION_MAP_FILE } from "#configuration/constants/grammar.constants";
import { absolutePath } from "@ssot/paths";
import { isRecord } from "#core/predicates/record.predicate";

const dotted = function dotted(fileType: string): string {
    const bare = fileType.startsWith(EXTENSION_DOT) ? fileType.slice(EXTENSION_DOT.length) : fileType;
    return `${EXTENSION_DOT}${bare.toLowerCase()}`;
};

const readExtensionMap = function readExtensionMap(): unknown {
    const file = absolutePath("govlab.utils.codeParse.generated", EXTENSION_MAP_FILE);
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
};

const addLanguageExtensions = function addLanguageExtensions(
    map: Map<string, string>,
    language: string,
    fileTypes: unknown,
): void {
    if (!Array.isArray(fileTypes)) {
        return;
    }
    for (const fileType of fileTypes) {
        if (typeof fileType === "string" && !map.has(dotted(fileType))) {
            map.set(dotted(fileType), language);
        }
    }
};

export const loadDerivedExtensions = function loadDerivedExtensions(): Map<string, string> {
    const map = new Map<string, string>();
    const parsed = readExtensionMap();
    if (isRecord(parsed)) {
        for (const language of Object.keys(parsed).sort((a, b) => a.localeCompare(b))) {
            addLanguageExtensions(map, language, parsed[language]);
        }
    }
    return map;
};
