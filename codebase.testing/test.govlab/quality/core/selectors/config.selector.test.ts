import {
    docsConfig,
    govlabEslintSettings,
    qualityEngineConfig,
    sectionOf,
} from "@govlab/quality/core/selectors/config.selector.ts";
import { expect, test } from "vitest";

test("config selectors read their sections with defaults", () => {
    expect(docsConfig({}).members).toStrictEqual([]);
    expect(qualityEngineConfig({}).root).toBeUndefined();
    expect(govlabEslintSettings({}).scopes).toStrictEqual({});
    expect(sectionOf({ knip: { a: 1 } }, "knip")).toStrictEqual({ a: 1 });
    expect(sectionOf({ knip: [1] }, "knip")).toStrictEqual({});
});
