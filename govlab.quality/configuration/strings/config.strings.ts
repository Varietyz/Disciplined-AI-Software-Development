export const forbiddenConfig = function forbiddenConfig(file: string): string {
    return `${file}: an ecosystem config file exists, and every tool reads its config from govlab.config through the govlab runner. Delete the file and move its data into govlab.config.`;
};

export const unsanctionedConfig = function unsanctionedConfig(file: string, registry: string): string {
    return `${file}: a native tool config exists that the sanctioned-exception registry ${registry} does not list. Add it to the registry or delete it.`;
};

export const CONFIG_DRIFT_FAILED = "config-drift: validation failed, because govlab.config is the one config truth.\n";

export const configDriftClean = function configDriftClean(scanned: number): string {
    return `config-drift: clean. ${String(scanned)} files scanned, and no ecosystem config file exists.\n`;
};
