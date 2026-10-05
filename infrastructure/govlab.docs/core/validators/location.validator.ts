import type { DocLocationDefect, DocLocationInput } from "#types/location.types";
import { boundaryMisplaced, offLocation } from "#configuration/strings/location.strings";
import { docStem, stemParts } from "#core/selectors/metadata.selector";
import { DEFAULT_ROOT_PREFIX } from "#configuration/constants/document.constants";
import { computeLocation } from "#core/resolvers/location.resolver";
import { isBoundaryFilename } from "#core/predicates/document.predicate";
import path from "node:path";

const locationDefects = function locationDefects(input: DocLocationInput, filename: string): DocLocationDefect[] {
    const parts = stemParts(docStem(filename), input.registries.forms[input.form]?.tag);
    const expected = computeLocation({
        concern: input.concern,
        form: input.form,
        ...parts,
        options: input.options,
        registries: input.registries,
    });
    if (!expected.ok) {
        return [{ code: expected.reason, detail: expected.detail }];
    }
    if (expected.path === input.relPath) {
        return [];
    }
    return [{ code: "off-location", detail: offLocation(input.relPath, expected.path), expected: expected.path }];
};

export const docLocation = function docLocation(input: DocLocationInput): DocLocationDefect[] {
    if (input.kind !== "authored") {
        return [];
    }
    const filename = path.posix.basename(input.relPath);
    const rootPrefix = input.options?.rootPrefix ?? DEFAULT_ROOT_PREFIX;
    if (!isBoundaryFilename(filename)) {
        return locationDefects(input, filename);
    }
    return input.relPath.startsWith(rootPrefix)
        ? [{ code: "boundary-misplaced", detail: boundaryMisplaced(filename, rootPrefix) }]
        : [];
};
