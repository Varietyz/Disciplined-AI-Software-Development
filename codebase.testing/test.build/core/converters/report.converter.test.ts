import { FILE_PATH, LINE, report, sourceFile } from "./anatomy.fixture.ts";
import {
    definitionKey,
    definitionsByFile,
    fileStatsOf,
    findingView,
    flaggedOf,
} from "@banes-lab/build-scripts/core/converters/report.converter.ts";
import { describe, expect, it } from "vitest";

describe("definitionKey and definitionsByFile", () => {
    it("groups the report's definitions by the file that declares them", () => {
        const grouped = definitionsByFile(report());
        expect(grouped.get(FILE_PATH)).toHaveLength(1);
        expect(definitionKey(FILE_PATH, "a")).not.toBe(definitionKey(FILE_PATH, "b"));
    });
});

describe("flaggedOf and findingView", () => {
    it("flags nothing for no findings and keeps a finding's kind in its view", () => {
        expect(flaggedOf([]).size).toBe(0);
        expect(
            findingView({
                confidence: "c",
                detail: "d",
                file: FILE_PATH,
                kind: "k",
                line: LINE,
                members: [],
                name: "n",
                relevance: 0,
                remedy: "r",
                severity: "s",
            }).kind,
        ).toBe("k");
    });
});

describe("fileStatsOf", () => {
    it("counts a file as one file", () => {
        expect(fileStatsOf(sourceFile(), [], 0, []).files).toBe(1);
    });
});
