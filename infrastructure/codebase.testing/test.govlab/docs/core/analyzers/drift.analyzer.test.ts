import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { symbolDriftIn } from "@govlab/docs/core/analyzers/drift.analyzer.ts";

const PARSERS = join(absolutePath("govlab.docs"), "core", "parsers");

describe("symbolDriftIn", () => {
    it("passes a reference whose symbol the target file exports", () => {
        expect(symbolDriftIn("See `./export.parser.ts#exportedNames` for details.", PARSERS, PARSERS)).toStrictEqual(
            [],
        );
    });

    it("reports a reference whose symbol the target file does not export", () => {
        expect(symbolDriftIn("See `./export.parser.ts#ghostSymbol` for details.", PARSERS, PARSERS)).toHaveLength(1);
    });
});
