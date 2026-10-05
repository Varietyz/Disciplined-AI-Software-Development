import type {
    GovlabConfig,
    GovlabEslintSettings,
    ResolvedDocsConfig,
    ResolvedQualityEngineConfig,
} from "#types/config.types";
import { masterExcludeMarkers } from "#core/selectors/exclusions.selector";

export const docsConfig = function docsConfig(config: GovlabConfig): ResolvedDocsConfig {
    return {
        boundaryDocs: config.docs?.boundaryDocs ?? [],
        harness: config.docs?.harness,
        hostTokens: config.docs?.hostTokens ?? [],
        ignore: config.docs?.ignore ?? [],
        members: config.docs?.members ?? [],
        prettierConfig: config.docs?.prettierConfig,
    };
};

export const qualityEngineConfig = function qualityEngineConfig(config: GovlabConfig): ResolvedQualityEngineConfig {
    const engine = config.qualityEngine ?? {};
    return { eslintConfig: engine.eslintConfig, root: engine.root, stylelintConfig: engine.stylelintConfig };
};

export const govlabEslintSettings = function govlabEslintSettings(config: GovlabConfig): GovlabEslintSettings {
    const eslint = config.eslint ?? {};
    return {
        contentPolicy: config.contentPolicy ?? {},
        exclude: masterExcludeMarkers(config),
        hostPolicy: config.hostPolicy ?? {},
        layout: eslint.layout ?? {},
        scopes: eslint.scopes ?? {},
    };
};

export const sectionOf = function sectionOf(config: GovlabConfig, key: string): Record<string, unknown> {
    const section = config[key];
    return typeof section === "object" && section !== null && !Array.isArray(section)
        ? Object.fromEntries(Object.entries(section))
        : {};
};
