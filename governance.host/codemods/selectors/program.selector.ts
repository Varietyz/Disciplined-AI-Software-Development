import { dirname, relative, resolve, sep } from "node:path";
import { MEMBER_ROOTS } from "../../shared/registries/location.registry.ts";
import { existsSync } from "node:fs";
import ts from "typescript";

const REPO_ROOT = process.cwd().split(sep).join("/");
const NODE_MODULES = "/node_modules/";
const ARGV_START = 2;
const TSCONFIG_FLAG = "--tsconfig";
const TSCONFIG = "tsconfig.json";

const ALL_TSCONFIGS: readonly string[] = MEMBER_ROOTS.map((member) => `${member}/${TSCONFIG}`).filter((file) =>
    existsSync(resolve(process.cwd(), file)),
);

const requestedTsconfigs = function requestedTsconfigs(argv: readonly string[]): string[] {
    const flagIndex = argv.indexOf(TSCONFIG_FLAG);
    const value = flagIndex === -1 ? "" : (argv[flagIndex + 1] ?? "");
    return value.split(",").filter((entry) => entry.length > 0);
};

const REQUESTED = requestedTsconfigs(process.argv.slice(ARGV_START));

export const CODEMOD_TSCONFIGS: readonly string[] = REQUESTED.length > 0 ? REQUESTED : ALL_TSCONFIGS;

export const toPosix = function toPosix(value: string): string {
    return value.split(sep).join("/");
};

export const relPath = function relPath(fileName: string): string {
    return toPosix(relative(process.cwd(), fileName));
};

export const inRepo = function inRepo(fileName: string): boolean {
    return toPosix(fileName).startsWith(REPO_ROOT) && !toPosix(fileName).includes(NODE_MODULES);
};

export const programFor = function programFor(tsconfigPath: string): ts.Program {
    const absolute = resolve(process.cwd(), tsconfigPath);
    const configFile = ts.readConfigFile(absolute, (file) => ts.sys.readFile(file));
    const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dirname(absolute));
    return ts.createProgram({
        host: ts.createCompilerHost(parsed.options),
        options: parsed.options,
        rootNames: parsed.fileNames,
    });
};

export const repoSourceFiles = function repoSourceFiles(program: ts.Program): ts.SourceFile[] {
    return program
        .getSourceFiles()
        .filter((sourceFile) => !sourceFile.isDeclarationFile && inRepo(sourceFile.fileName));
};

export const lineOf = function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
};
