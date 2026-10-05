import { expect, test } from "vitest";
import { govlabSettings, normalizedFilename } from "@govlab/quality/core/selectors/eslint.selector.ts";
import type { FilenameCarrier } from "@govlab/quality/types/eslint.types.ts";

const contextFor = function contextFor(filename: string): FilenameCarrier {
    return { filename };
};

test("govlabSettings reads the govlab block from the rule context and defaults to an empty policy", () => {
    const declared = { hostPolicy: { paths: { source: "paths.yaml" } } };
    expect(govlabSettings({ settings: { govlab: declared } })).toBe(declared);
    expect(govlabSettings({ settings: {} })).toStrictEqual({});
});

test("normalizedFilename forward-slashes the linted filename", () => {
    expect(normalizedFilename(contextFor(String.raw`a\b.ts`))).toBe("a/b.ts");
});
