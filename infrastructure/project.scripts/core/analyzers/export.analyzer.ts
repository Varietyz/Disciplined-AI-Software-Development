import type { ExportEntry, ImportEntry } from "#types/closure.types";
import { MANIFEST_NAME, TEST_MARK } from "#configuration/constants/closure.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import { RUNNER_MODULES, WHOLE } from "@banes-lab/build-scripts/configuration/constants/loader.constants.ts";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { stringAt, stringRecordAt } from "#core/selectors/manifest.selector";
import { BUILD_CONFIG_FILES } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { MEMBER_ROOTS } from "@ssot/govlab/shared/registries/location.registry.ts";
import { anchorSpecifier } from "#core/resolvers/specifier.resolver";
import { manifestOf } from "#core/loaders/manifest.loader";
import { sourceFilesUnder } from "#core/loaders/source.loader";
import ts from "typescript";

const PROJECT_ANCHOR = ".";

const namedImportsOf = function namedImportsOf(clause: ts.ImportClause): string[] {
    const bindings = clause.namedBindings;
    const named = bindings && ts.isNamedImports(bindings) ? bindings.elements : [];
    return [
        ...named.map((element) => element.propertyName?.text ?? element.name.text),
        ...(clause.name ? [clause.name.text] : []),
    ];
};

const importOf = function importOf(
    root: string,
    manifest: unknown,
    filePath: string,
    statement: ts.Statement,
): ImportEntry | null {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
        return null;
    }
    const names = statement.importClause ? namedImportsOf(statement.importClause) : [];
    if (names.length === 0) {
        return null;
    }
    const from = anchorSpecifier(root, manifest, filePath, statement.moduleSpecifier.text);
    return { file: PROJECT_ANCHOR, from, names };
};

const importsIn = function importsIn(root: string, manifest: unknown, filePath: string): ImportEntry[] {
    const sourceFile = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
    return sourceFile.statements.flatMap((statement) => {
        const entry = importOf(root, manifest, filePath, statement);
        return entry === null ? [] : [entry];
    });
};

const dependentMembers = function dependentMembers(root: string, manifest: unknown): string[] {
    const name = stringAt(manifest, "name");
    return MEMBER_ROOTS.map((member) => join(ROOT, member)).filter((member) => {
        if (resolve(member) === resolve(root) || !existsSync(join(member, MANIFEST_NAME))) {
            return false;
        }
        return name in stringRecordAt(manifestOf(member), "dependencies");
    });
};

const consumerFiles = function consumerFiles(root: string, manifest: unknown): string[] {
    const tests = absolutePath("codebase.testing.app");
    const configs = BUILD_CONFIG_FILES.map((file) => join(root, file)).filter((file) => existsSync(file));
    const siblings = dependentMembers(root, manifest).flatMap((member) =>
        sourceFilesUnder(member).filter((file) => !file.includes(TEST_MARK)),
    );
    return [...(existsSync(tests) ? sourceFilesUnder(tests) : []), ...configs, ...siblings];
};

const runnerImports = function runnerImports(
    root: string,
    manifest: unknown,
    exports: readonly ExportEntry[],
): ImportEntry[] {
    return Object.values(RUNNER_MODULES).map((module) => {
        const from = anchorSpecifier(root, manifest, root, module.path);
        const names =
            module.names === WHOLE
                ? exports.filter((entry) => `${PROJECT_ANCHOR}/${entry.file}` === from).map((entry) => entry.name)
                : module.names;
        return { file: PROJECT_ANCHOR, from, names };
    });
};

export const collectExternalConsumers = function collectExternalConsumers(
    root: string,
    exports: readonly ExportEntry[],
): ImportEntry[] {
    const manifest = manifestOf(root);
    return [
        ...consumerFiles(root, manifest).flatMap((file) => importsIn(root, manifest, file)),
        ...runnerImports(root, manifest, exports),
    ];
};
