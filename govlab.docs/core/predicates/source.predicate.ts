import { CODE_EXTENSIONS } from "#configuration/constants/program.constants";

export const isCodeFile = function isCodeFile(filePath: string): boolean {
    return CODE_EXTENSIONS.some((extension) => filePath.endsWith(extension));
};
