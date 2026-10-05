export const jsSourceFailed = function jsSourceFailed(count: number): string {
    return `ts-only: ${String(count)} JavaScript-family source files exist. The project is TypeScript throughout, and only skipped build output may be JavaScript. Author each file as .ts:\n`;
};

export const declarationFailed = function declarationFailed(count: number): string {
    return `ts-only: ${String(count)} hand-authored .d.ts files exist. A hand-authored declaration loosens types that the real package or a .ts module owns. Delete each one and use the real types, through the package, a 'declare module' block inside a .ts module or a typed .ts wrapper:\n`;
};

export const builtTargetFailed = function builtTargetFailed(count: number): string {
    return `ts-only: ${String(count)} package.json main or exports targets resolve to built JavaScript. A workspace package ships its TypeScript source and no build. Point each target at the .ts source:\n`;
};

export const jsGlobFailed = function jsGlobFailed(count: number): string {
    return `ts-only: ${String(count)} JavaScript-family coverage globs sit in a consumer config, where the source is TypeScript only. Point each glob at .ts in govlab.config:\n`;
};

export const jsConfigFailed = function jsConfigFailed(count: number): string {
    return `ts-only: ${String(count)} tsconfig files set allowJs or checkJs, which TypeScript source never needs. Remove the option:\n`;
};

export const distImportFailed = function distImportFailed(count: number): string {
    return `ts-only: ${String(count)} source files import the workspace's own build output, which works only while a stale build exists. Import the source module directly:\n`;
};

export const tsOnlyClean = function tsOnlyClean(scanned: number): string {
    return `ts-only: clean. ${String(scanned)} files scanned, with no JavaScript-family source, no hand-authored .d.ts and no allowJs or checkJs option.\n`;
};
