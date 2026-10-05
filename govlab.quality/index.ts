export { defineGovlabConfig } from "#core/factories/config.factory";
export { loadGovlabConfig, resolveConfigInDir } from "#core/loaders/config.loader";
export { defineConfigSection, registeredSections, validateConfig } from "#core/registries/section.registry";
export { docsConfig, govlabEslintSettings, qualityEngineConfig } from "#core/selectors/config.selector";
export { govlabEslintConfig } from "#core/factories/eslint.setup.factory";
export { govlabStylelintConfig } from "#core/adapters/stylelint.adapter";
export { govlabPrettierConfig, govlabPrettierIgnore } from "#core/adapters/tool.prettier.adapter";
export { govlabJscpdConfig } from "#core/adapters/tool.jscpd.adapter";
export { govlabKnipConfig } from "#core/adapters/tool.knip.adapter";
export { govlabOxlintConfig, govlabOxlintFixConfig } from "#core/adapters/tool.oxlint.adapter";
export { govlabHtmlhintConfig } from "#core/adapters/tool.htmlhint.adapter";
export { govlabYamllintConfig } from "#core/adapters/tool.yamllint.adapter";
export { masterExclude, masterExcludeMarkers, withMasterExclude } from "#core/selectors/exclusions.selector";
export { excludeMatcher } from "#core/factories/exclusions.factory";
export { isExcludedPath, pathExclusion } from "#core/matchers/exclusions.matcher";
export type { PathExclusion } from "#types/exclusions.types";
export type {
    ConfigSection,
    ContentPolicyConfig,
    DocsConfig,
    EslintScopeConfig,
    ExtensionsConfig,
    GainConfig,
    GovlabConfig,
    GovlabEslintSettings,
    HarnessDocProfile,
    HarnessDocsConfig,
    HostPolicyConfig,
    OxlintConfig,
    QualityEngineConfig,
    QualitySectionConfig,
    ResolvedDocsConfig,
    ResolvedQualityEngineConfig,
} from "#types/config.types";
