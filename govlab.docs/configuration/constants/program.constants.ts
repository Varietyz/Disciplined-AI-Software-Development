import ts from "typescript";

export const PROGRAM_OPTIONS: ts.CompilerOptions = {
    customConditions: ["development"],
    exactOptionalPropertyTypes: true,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    noEmit: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
};

export const PROGRAM_OVERRIDES: ts.CompilerOptions = { declaration: false, noEmit: true };

export const FLAG_PARITY = 2;

export const CODE_EXTENSIONS: readonly string[] = [".ts", ".tsx", ".mts", ".cts"];
