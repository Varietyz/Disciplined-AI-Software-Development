export const NO_BUILD_CONFIG = "[transport] no build config found under the application root\n";

export const notABuildConfig = function notABuildConfig(file: string): string {
    return `[transport] ${file} did not load as a build config`;
};

export const transportHeld = function transportHeld(count: number): string {
    return `[transport] ${String(count)} build config(s) serve over encrypted transport\n`;
};

export const plaintextListener = function plaintextListener(file: string, surface: string): string {
    return `  ${file}  the ${surface} block listens without declaring encrypted transport; serve it with the generated local certificate`;
};

export const plaintextHeading = function plaintextHeading(count: number): string {
    return `[transport] ${String(count)} plaintext listener(s):`;
};
