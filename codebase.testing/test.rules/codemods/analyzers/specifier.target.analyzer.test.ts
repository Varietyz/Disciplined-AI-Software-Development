import {
    collectTargetFindings,
    filePartOf,
    relocatedSpecifier,
    targetCandidates,
} from "@ssot/govlab/codemods/analyzers/specifier.target.analyzer.ts";
import { describe, expect, it } from "vitest";

describe("filePartOf", () => {
    it("drops a bundler resource query and leaves a plain specifier as written", () => {
        expect(filePartOf("../styles/page.style.css?raw")).toBe("../styles/page.style.css");
        expect(filePartOf("./a.ts")).toBe("./a.ts");
    });
});

describe("targetCandidates", () => {
    const files = ["/m/core/loaders/stats.fixture.ts", "/m/core/converters/site.fixture.ts", "/m/core/a/site.ts"];

    it("matches a file by the name the specifier carries", () => {
        expect(targetCandidates("./stats.fixture.ts", files)).toStrictEqual(["/m/core/loaders/stats.fixture.ts"]);
    });

    it("matches an extensionless specifier by the file's stem", () => {
        expect(targetCandidates("../../site", files)).toStrictEqual(["/m/core/a/site.ts"]);
    });

    it("matches a specifier that carries a resource query by its file part", () => {
        expect(targetCandidates("../../site.fixture.ts?raw", files)).toStrictEqual([
            "/m/core/converters/site.fixture.ts",
        ]);
    });

    it("returns nothing for a name no file carries", () => {
        expect(targetCandidates("./absent.fixture.ts", files)).toStrictEqual([]);
    });
});

describe("relocatedSpecifier", () => {
    it("points a sibling at its own folder", () => {
        expect(
            relocatedSpecifier("/m/core/a/x.test.ts", "../../site/tests/s.fixture.ts", "/m/core/a/s.fixture.ts"),
        ).toBe("./s.fixture.ts");
    });

    it("climbs to a neighboring folder", () => {
        expect(relocatedSpecifier("/m/core/a/x.test.ts", "./s.fixture.ts", "/m/core/b/s.fixture.ts")).toBe(
            "../b/s.fixture.ts",
        );
    });

    it("descends into a child folder", () => {
        expect(relocatedSpecifier("/m/x.test.ts", "./s.fixture.ts", "/m/core/s.fixture.ts")).toBe(
            "./core/s.fixture.ts",
        );
    });
});

describe("collectTargetFindings", () => {
    it("leaves no relative import that resolves to no file", () => {
        expect(
            collectTargetFindings().map((finding) => `${finding.file}:${String(finding.line)} ${finding.from}`),
        ).toStrictEqual([]);
    }, 180_000);
});
