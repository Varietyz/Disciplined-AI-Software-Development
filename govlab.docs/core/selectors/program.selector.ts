import type ts from "typescript";

const DECLARATION_SUFFIX = ".d.ts";

export const inPackageSources = function inPackageSources(
    program: ts.Program,
    dirPosix: string,
): readonly ts.SourceFile[] {
    return program
        .getSourceFiles()
        .filter(
            (file) =>
                !file.fileName.endsWith(DECLARATION_SUFFIX) && file.fileName.split("\\").join("/").startsWith(dirPosix),
        );
};
