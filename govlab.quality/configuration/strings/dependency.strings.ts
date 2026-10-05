export const NONE_LABEL = "(none)";

export const unknownEcosystem = function unknownEcosystem(name: string, known: string, shortcodes: string): string {
    return `govlab install: "${name}" is not a known ecosystem. Name one of ${known}, or a shortcode: ${shortcodes}.`;
};

export const EMPTY_REQUEST =
    "govlab install: name at least one ecosystem, or pass --auto to detect them from the codebase.";

export const planHeading = function planHeading(ecosystems: string): string {
    return `govlab install for ${ecosystems}, with every mapped tool and plugin`;
};

export const npmLine = function npmLine(count: number, packages: string): string {
    return `  npm packages to install (${String(count)}): ${packages}`;
};

export const systemToolsLine = function systemToolsLine(tools: string): string {
    return `  system tools to install by hand: ${tools}`;
};

export const eslintPluginsLine = function eslintPluginsLine(plugins: string): string {
    return `  ESLint plugins: ${plugins}`;
};

export const generatorsLine = function generatorsLine(generators: string): string {
    return `  config generators: ${generators}`;
};

export const installedLine = function installedLine(count: number): string {
    return `\n✓ installed ${String(count)} npm package(s)\n`;
};

export const systemInstructionLine = function systemInstructionLine(system: string): string {
    return `  install this system tool: ${system}\n`;
};

export const invalidRegistry = function invalidRegistry(file: string): string {
    return `The dependency registry at ${file} does not hold a records array. Restore the file's records list.`;
};
