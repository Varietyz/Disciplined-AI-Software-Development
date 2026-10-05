import { PROGRAM_OPTIONS, PROGRAM_OVERRIDES } from "#configuration/constants/program.constants";
import { dirname } from "node:path";
import ts from "typescript";

export const moduleCompilerOptions = function moduleCompilerOptions(moduleDir: string): ts.CompilerOptions {
    const configPath = ts.findConfigFile(moduleDir, (file) => ts.sys.fileExists(file));
    if (configPath === undefined) {
        return PROGRAM_OPTIONS;
    }
    const read = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file));
    if (read.error !== undefined) {
        return PROGRAM_OPTIONS;
    }
    const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, dirname(configPath), {}, configPath);
    return { ...PROGRAM_OPTIONS, ...parsed.options, ...PROGRAM_OVERRIDES };
};
