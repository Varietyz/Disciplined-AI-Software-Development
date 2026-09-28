import type { FieldEntry, FieldRoot, FieldScope, ScopeReach } from "../../types/field.types.ts";
import { innerTypes, keyOf, within } from "../selectors/field.selector.ts";
import { lineOf, programFor, toPosix } from "../selectors/program.selector.ts";
import { relative } from "node:path";
import ts from "typescript";
import { visitRead } from "./field.reference.analyzer.ts";

interface Found {
    readonly entries: readonly FieldEntry[];
    readonly next: readonly ts.Type[];
}

const rootType = function rootType(program: ts.Program, checker: ts.TypeChecker, root: FieldRoot): ts.Type | null {
    const source = program.getSourceFile(root.file);
    const declaration = source?.statements.find(
        (statement): statement is ts.InterfaceDeclaration =>
            ts.isInterfaceDeclaration(statement) && statement.name.text === root.name,
    );
    return declaration === undefined ? null : checker.getTypeAtLocation(declaration);
};

const seedTypes = function seedTypes(program: ts.Program, checker: ts.TypeChecker, root: FieldRoot): ts.Type[] {
    const type = rootType(program, checker, root);
    if (type === null) {
        return [];
    }
    if (root.container !== true) {
        return [type];
    }
    return checker
        .getPropertiesOfType(type)
        .flatMap((property) => innerTypes(checker, checker.getTypeOfSymbol(property)));
};

const fieldsOfType = function fieldsOfType(checker: ts.TypeChecker, type: ts.Type, scope: FieldScope): Found {
    const pairs = checker
        .getPropertiesOfType(type)
        .flatMap((property) => (property.declarations ?? []).map((declaration) => ({ declaration, property })));
    const owned = pairs.filter(
        ({ declaration }) =>
            keyOf(declaration) !== null && within(declaration.getSourceFile().fileName, scope.typeRoots),
    );
    return {
        entries: owned.map(({ declaration }) => ({
            file: toPosix(relative(process.cwd(), declaration.getSourceFile().fileName)),
            key: keyOf(declaration) ?? "",
            line: lineOf(declaration.getSourceFile(), declaration),
        })),
        next: owned.flatMap(({ property }) => innerTypes(checker, checker.getTypeOfSymbol(property))),
    };
};

const collectFields = function collectFields(
    program: ts.Program,
    checker: ts.TypeChecker,
    scope: FieldScope,
): readonly FieldEntry[] {
    const fields = new Map<string, FieldEntry>();
    const seen = new Set<ts.Type>();
    const queue = scope.roots.flatMap((root) => seedTypes(program, checker, root));
    let type = queue.pop();
    while (type !== undefined) {
        if (!seen.has(type)) {
            seen.add(type);
            const found = fieldsOfType(checker, type, scope);
            for (const entry of found.entries) {
                fields.set(entry.key, entry);
            }
            queue.push(...found.next);
        }
        type = queue.pop();
    }
    return [...fields.values()];
};

export const scopeReach = function scopeReach(scope: FieldScope): ScopeReach {
    const program = programFor(scope.tsconfig);
    const checker = program.getTypeChecker();
    const read = new Set<string>();
    for (const source of program.getSourceFiles()) {
        if (!source.isDeclarationFile && within(source.fileName, scope.readerRoots)) {
            visitRead(checker, source, read);
        }
    }
    return {
        fields: collectFields(program, checker, scope),
        label: scope.label,
        missingRoots: scope.roots.filter((root) => rootType(program, checker, root) === null),
        read,
    };
};
