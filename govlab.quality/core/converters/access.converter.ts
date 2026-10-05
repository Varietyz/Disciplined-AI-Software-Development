import type { AccessEdit, AccessHit } from "#types/access.types";
import ts from "typescript";

const LINE_BASE = 1;
const PROBE_NAME = "index-access.ts";

const accessAt = function accessAt(source: ts.SourceFile, position: number): ts.PropertyAccessExpression | null {
    let result: ts.PropertyAccessExpression | null = null;
    const visit = function visit(node: ts.Node): void {
        if (position < node.getStart(source) || position >= node.getEnd()) {
            return;
        }
        if (
            ts.isPropertyAccessExpression(node) &&
            node.name.getStart(source) <= position &&
            position < node.name.getEnd()
        ) {
            result = node;
        }
        node.forEachChild(visit);
    };
    visit(source);
    return result;
};

const editFor = function editFor(access: ts.PropertyAccessExpression): AccessEdit {
    const optional = access.questionDotToken ? "?." : "";
    return { end: access.name.getEnd(), start: access.expression.getEnd(), text: `${optional}["${access.name.text}"]` };
};

const editsFor = function editsFor(text: string, hits: readonly AccessHit[]): AccessEdit[] {
    const source = ts.createSourceFile(PROBE_NAME, text, ts.ScriptTarget.Latest, true);
    return hits
        .map((hit) =>
            accessAt(source, source.getPositionOfLineAndCharacter(hit.line - LINE_BASE, hit.column - LINE_BASE)),
        )
        .filter((access): access is ts.PropertyAccessExpression => access !== null)
        .map(editFor);
};

export const bracketAccess = function bracketAccess(text: string, hits: readonly AccessHit[]): string {
    return editsFor(text, hits)
        .toSorted((left, right) => right.start - left.start)
        .reduce((acc, edit) => acc.slice(0, edit.start) + edit.text + acc.slice(edit.end), text);
};
