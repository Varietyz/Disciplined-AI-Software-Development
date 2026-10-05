export const duplicateFormatter = function duplicateFormatter(format: string): string {
    return `Two formatters register the "${format}" config format. Keep one formatter file per format.`;
};

export const missingFormatter = function missingFormatter(format: string, tool: string): string {
    return `No formatter registers the "${format}" config format that the emit descriptor for ${tool} names. Add a config formatter file for the format, or correct the descriptor.`;
};
