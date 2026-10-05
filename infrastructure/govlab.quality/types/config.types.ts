import type { ConcernConfig } from "#types/concern.types";
import type { OwnerOverride } from "#types/canon.types";

export interface TypeSystemLayout {
    axes?: {
        variant?: string[];
        size?: string[];
        gap?: string[];
        tone?: string[];
        measure?: string[];
        layout?: string[];
    };
    axisHomes?: { size?: string; gap?: string; tone?: string; measure?: string; layout?: string };
    variants?: string[];
    elementTypes?: string[];
    nativeTags?: string[];
    typesHome?: string;
    utilityPrefix?: string;
    componentPrefix?: string;
    iconPrefixes?: string[];
    layerOrder?: string;
    layerStatementHome?: string;
    tokensFile?: string;
    layerSegments?: { layer: string; needle: string }[];
    appShellAllow?: string[];
    shellAllow?: string[];
    iconSelectors?: string[];
    mobileSuffix?: string;
    variantScaleExempt?: string[];
    semanticColorTokens?: string[];
    focusHome?: string;
    zTokenPrefix?: string;
    varCategories?: { file: string; description: string; prefixes: string[]; contains?: string[] }[];
    tokenParity?: { reference: string; target: string };
}

export interface EslintRelaxScope {
    files: string[];
    relax: string[];
}

export interface EslintRuleExclusion {
    eslintFiles: string[];
    vitePath: string;
    rules: string[];
}

export interface EslintLayout {
    domFactory?: string;
    contentSinks?: string[];
    pages?: string[];
    components?: string[];
    utilitiesPath?: string;
    componentsDir?: string;
    frontendMarkers?: string[];
    backendMarkers?: string[];
    configExemptions?: string[];
    typeSystem?: TypeSystemLayout;
}

export interface EslintScopeConfig {
    scopes?: { backend?: string };
    layout?: EslintLayout;
    ignores?: string[];
    env?: string[];
    globals?: Record<string, string>;
    generated?: EslintRelaxScope;
    tests?: EslintRelaxScope;
    buildScripts?: EslintRelaxScope;
    exclusions?: EslintRuleExclusion[];
    rules?: Record<string, unknown>;
}

export interface HostPathsPolicy {
    roots?: string[];
    source?: string;
    treeFile?: string;
    excluded?: string[];
    packages?: string[];
}

export interface HostEndpointsPolicy {
    migrationAllow?: string[];
    source?: string;
}

export interface HostPolicyConfig {
    moduleLevels?: Record<string, number>;
    testRoots?: { testbase?: string; hostRoot?: string };
    paths?: HostPathsPolicy;
    endpoints?: HostEndpointsPolicy;
}

export interface ContentPolicyConfig {
    aiName?: string;
    allowNamespaces?: string[];
    allowNumberNamespaces?: string[];
    allow?: string[];
}

export interface QualityEngineConfig {
    root?: string;
    eslintConfig?: string;
    stylelintConfig?: string;
}

export interface HarnessDocProfile {
    prefix: string;
    keys: string[];
    requireFrontmatter: boolean;
    requireTitle: boolean;
}

export interface HarnessDocsConfig {
    root: string;
    runtimeRoots?: string[];
    agentDir?: string;
    adapter?: string;
    profiles?: HarnessDocProfile[];
}

export interface DocsConfig {
    ignore?: string[];
    prettierConfig?: string;
    boundaryDocs?: string[];
    members?: string[];
    hostTokens?: string[];
    harness?: HarnessDocsConfig;
}

export interface GainConfig {
    ignore?: string[];
}

export interface QualitySectionConfig {
    concerns?: Record<string, (number | string)[] | boolean | number | string>;
    owners?: Record<string, Record<string, string>>;
    ecosystems?: string[];
    exclude?: string[];
    toolExclude?: Record<string, string[]>;
}

export interface OxlintBlockExclusion {
    file: string;
    rule: string;
    functions: string[];
}

export interface OxlintConfig {
    blockExclusions?: OxlintBlockExclusion[];
    plugins?: string[];
    categories?: Record<string, string>;
    rules?: Record<string, unknown>;
    env?: Record<string, boolean>;
    globals?: Record<string, string>;
    ignorePatterns?: string[];
    reportOnly?: string[];
}

export interface ExtensionsConfig {
    global?: boolean;
}

export interface GovlabConfig {
    [section: string]: unknown;
    extends?: GovlabConfig[];
    eslint?: EslintScopeConfig;
    hostPolicy?: HostPolicyConfig;
    contentPolicy?: ContentPolicyConfig;
    qualityEngine?: QualityEngineConfig;
    docs?: DocsConfig;
    gain?: GainConfig;
    qualityMaster?: QualitySectionConfig;
    extensions?: ExtensionsConfig;
    oxlint?: OxlintConfig;
}

export interface ConfigSection {
    key: string;
    validate: (value: unknown) => string[];
}

export interface ResolvedDocsConfig {
    ignore: string[];
    prettierConfig: string | undefined;
    boundaryDocs: string[];
    members: string[];
    hostTokens: string[];
    harness: HarnessDocsConfig | undefined;
}

export interface ResolvedQualityEngineConfig {
    root: string | undefined;
    eslintConfig: string | undefined;
    stylelintConfig: string | undefined;
}

export interface GovlabEslintSettings {
    scopes: NonNullable<EslintScopeConfig["scopes"]>;
    layout: EslintLayout;
    hostPolicy: HostPolicyConfig;
    contentPolicy: ContentPolicyConfig;
    exclude: string[];
}

export interface EmitInputs {
    concerns: ConcernConfig;
    config: GovlabConfig;
    owners: OwnerOverride | undefined;
}
