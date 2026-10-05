import type { GovlabConfig } from "#types/config.types";

export const defineGovlabConfig = function defineGovlabConfig<T extends GovlabConfig>(config: T): T {
    return config;
};
