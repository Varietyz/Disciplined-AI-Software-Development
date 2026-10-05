import type { FilenameCarrier, GovlabSettings, SettingsCarrier } from "#types/eslint.types";

export const govlabSettings = function govlabSettings(context: SettingsCarrier): GovlabSettings {
    return context.settings?.govlab ?? {};
};

export const normalizedFilename = function normalizedFilename(context: FilenameCarrier): string {
    return context.filename.split("\\").join("/");
};
