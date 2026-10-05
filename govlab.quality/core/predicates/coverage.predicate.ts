import { isExcludedPath } from "#core/matchers/exclusions.matcher";

const DECLARATION_SUFFIX = ".d.ts";
const TEST_MARKER = ".test.";

export const isSkippable = function isSkippable(file: string, excluded: readonly string[]): boolean {
    return file.endsWith(DECLARATION_SUFFIX) || file.includes(TEST_MARKER) || isExcludedPath(file, excluded);
};
