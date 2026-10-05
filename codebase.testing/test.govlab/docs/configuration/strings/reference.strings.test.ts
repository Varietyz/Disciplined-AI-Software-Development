import { describe, expect, it } from "vitest";
import {
    emptyDirectory,
    emptyFile,
    hostCoupling,
    missingPath,
    missingTarget,
    notDeclared,
    notExported,
    notReferenced,
    symbolDrift,
    unboundSlot,
    unknownClaim,
    unknownVerb,
    unknownVerbResolved,
    unresolvedOntologyRef,
    unsatisfiedClaim,
} from "@govlab/docs/configuration/strings/reference.strings.ts";
import { unmatched } from "./strings.fixture.ts";

describe("the reference strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [unknownVerb("seee", "see"), '"seee:"'],
                [unknownClaim("odd", "paths"), "validates: [odd]"],
                [unsatisfiedClaim("paths"), "validates: [paths]"],
                [unknownVerbResolved("seee"), '"seee:"'],
                [missingPath("a/b.ts"), "`a/b.ts`"],
                [emptyDirectory("a"), "directory `a`"],
                [emptyFile("a.ts"), "file `a.ts`"],
                [notExported("x", "a.ts"), "`x` is not exported from `a.ts`"],
                [notDeclared("x", "a.ts"), "`x` is not declared in `a.ts`"],
                [notReferenced("x", "a.ts"), "`x` is not referenced in `a.ts`"],
                [unresolvedOntologyRef("principle:x"), "`principle:x`"],
                [unboundSlot("slot"), "`{slot}`"],
                [missingTarget("gone.md"), '"gone.md"'],
                [symbolDrift("a.ts#x"), '"a.ts#x"'],
                [hostCoupling("app/x.ts"), '"app/x.ts"'],
            ]),
        ).toStrictEqual([]);
    });
});
