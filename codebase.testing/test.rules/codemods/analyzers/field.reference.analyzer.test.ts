import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import ts from "typescript";
import { visitRead } from "@ssot/govlab/codemods/analyzers/field.reference.analyzer.ts";
import { writeCanonicalText } from "@govlab/canonical-write";

const SOURCE = [
    "interface Box { size: number; label: string; hidden: string; spread: number }",
    "declare const box: Box;",
    "export const size = box.size;",
    "export const label = box['label'];",
    "export const { spread } = box;",
].join("\n");

describe("visitRead", () => {
    it("marks a field read through property access, a literal key and destructuring, and leaves the rest", async () => {
        const dir = mkdtempSync(join(tmpdir(), "field-reference-"));
        const file = join(dir, "box.generated.ts");
        await writeCanonicalText(file, SOURCE);
        const program = ts.createProgram([file], { noEmit: true, strict: true, target: ts.ScriptTarget.ES2022 });
        const source = program.getSourceFile(file);
        const read = new Set<string>();
        if (source !== undefined) {
            visitRead(program.getTypeChecker(), source, read);
        }
        expect([...read].sort()).toStrictEqual(["Box.label", "Box.size", "Box.spread"]);
    });
});
