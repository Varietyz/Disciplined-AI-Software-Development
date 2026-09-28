import { FILESYSTEM_REFUSALS } from "../constants/file.constants.ts";

export const hasErrorCode = function hasErrorCode(error: unknown, codes: ReadonlySet<string>): boolean {
    if (!(error instanceof Error) || !("code" in error)) {
        return false;
    }
    const code: unknown = error.code;
    return typeof code === "string" && codes.has(code);
};

export const isFilesystemRefusal = function isFilesystemRefusal(error: unknown): boolean {
    return hasErrorCode(error, FILESYSTEM_REFUSALS);
};

export const isUnreadableJson = function isUnreadableJson(error: unknown): boolean {
    return error instanceof SyntaxError || isFilesystemRefusal(error);
};
