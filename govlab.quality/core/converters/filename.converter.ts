import { SOURCE_EXTENSIONS } from "#configuration/constants/specifier.constants";

export const stripExtension = function stripExtension(value: string): string {
    for (const ext of SOURCE_EXTENSIONS) {
        if (value.endsWith(ext)) {
            return value.slice(0, value.length - ext.length);
        }
    }
    return value;
};

export const forwardSlashed = function forwardSlashed(value: string): string {
    return value.split("\\").join("/");
};

export const dirOf = function dirOf(file: string): string {
    const norm = forwardSlashed(file);
    return norm.slice(0, norm.lastIndexOf("/"));
};
