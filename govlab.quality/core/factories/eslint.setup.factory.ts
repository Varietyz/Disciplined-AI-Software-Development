import {
    CONSUMER_CONFIG_FILES,
    CONSUMER_CONFIG_OFF,
    HTML_PLUGIN,
    JSX,
    JS_ECOSYSTEMS,
    LANGUAGE,
    RULE_OFF,
    TS_FILES,
    TS_PARSER,
    TS_PREFIX,
} from "#configuration/constants/eslint.constants";
import type { CoreState, InstalledPlugin } from "#types/eslint.types";
import type { EslintScopeConfig, GovlabConfig } from "#types/config.types";
import {
    baseConfigs,
    disableTypeCheckedRules,
    exclusionScopes,
    htmlScope,
    langScopes,
    manifestScope,
    optionalScopes,
    tsScopeOverride,
    tsTestScope,
} from "#core/factories/eslint.scope.factory";
import { installedEslintPlugins, loadModule, resolveGlobals } from "#core/loaders/eslint.loader";
import {
    jsRulesOf,
    namespacesOf,
    pluginMap,
    pluginsFromRecord,
    toRulesRecord,
} from "#core/converters/eslint.converter";
import type { ConcernConfig } from "#types/concern.types";
import type { Linter } from "eslint";
import { emitEslintConfig } from "#core/emitters/eslint.emitter";
import { govlabEslintSettings } from "#core/selectors/config.selector";
import { isPlugin } from "#core/predicates/eslint.predicate";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { loadUserPlugins } from "#core/loaders/plugin.loader";
import { masterExclude } from "#core/selectors/exclusions.selector";
import process from "node:process";
import { validConcepts } from "#core/selectors/concept.selector";
import { validateConcerns } from "#core/validators/concern.validator";

const TEST_GLOB_EXTENSIONS = ["ts", "mts"];

const flat = (...groups: (Linter.Config | Linter.Config[] | null)[]): Linter.Config[] =>
    groups.flatMap((group) => (group ? (Array.isArray(group) ? group : [group]) : []));

const buildCoreState = async (config: GovlabConfig, concerns: ConcernConfig): Promise<CoreState> => {
    const installed = await installedEslintPlugins();
    const jsActive = namespacesOf(
        installed.filter((entry: InstalledPlugin) => JS_ECOSYSTEMS.has(entry.record.ecosystem)),
    );
    const htmlPlugin = await loadModule(HTML_PLUGIN);
    const plugins = { ...pluginMap(installed), ...(isPlugin(htmlPlugin) ? { html: htmlPlugin } : {}) };
    const rules = toRulesRecord(emitEslintConfig({ activePlugins: jsActive, concerns }));
    const settings = { govlab: govlabEslintSettings(config) };
    const tsParser = await loadModule(TS_PARSER);
    return { htmlPlugin, installed, plugins, rules, settings, tsParser };
};

const buildUserScopes = async (
    consumerRoot: string,
    config: GovlabConfig,
    reserved: Set<string>,
): Promise<Linter.Config[]> => {
    const userPlugins = await loadUserPlugins(consumerRoot, {
        allowGlobal: config.extensions?.global ?? false,
        reservedNamespaces: reserved,
    });
    const userRules = toRulesRecord(config.eslint?.rules ?? {});
    const userTsRules = Object.fromEntries(Object.entries(userRules).filter(([key]) => key.startsWith(TS_PREFIX)));
    const userManaged: Linter.Config = { plugins: pluginsFromRecord(userPlugins.eslint), rules: jsRulesOf(userRules) };
    const userTs: Linter.Config[] =
        Object.keys(userTsRules).length > 0 ? [{ files: TS_FILES, rules: userTsRules }] : [];
    return [userManaged, ...userTs];
};

const buildTestScope = function buildTestScope(
    core: CoreState,
    config: GovlabConfig,
    globals: Record<string, string>,
): Linter.Config | null {
    const testbaseRoot = config.hostPolicy?.testRoots?.testbase;
    const testbaseGlobs =
        typeof testbaseRoot === "string" ? TEST_GLOB_EXTENSIONS.map((ext) => `${testbaseRoot}/**/*.${ext}`) : [];
    return tsTestScope({
        disabled: disableTypeCheckedRules(core.installed),
        extraGlobs: testbaseGlobs,
        language: { ...LANGUAGE, globals, parserOptions: JSX },
        tsParser: core.tsParser,
    });
};

export const govlabEslintConfig = async (consumerRoot: string = process.cwd()): Promise<Linter.Config[]> => {
    const config = await loadGovlabConfig(consumerRoot);
    const eslint: EslintScopeConfig = config.eslint ?? {};
    const concerns = validateConcerns(config.qualityMaster?.concerns ?? {}, validConcepts());
    const core = await buildCoreState(config, concerns);
    const [langs, manifest, globals] = await Promise.all([
        langScopes(core.installed, concerns),
        manifestScope(core.installed, core.plugins),
        resolveGlobals(eslint.env ?? [], eslint.globals),
    ]);
    const master = masterExclude(config);
    const userScopes = await buildUserScopes(consumerRoot, config, new Set(Object.keys(core.plugins)));
    return flat(
        master.length > 0 ? { ignores: master } : null,
        baseConfigs({ globals, ...core }),
        tsScopeOverride(core.rules),
        buildTestScope(core, config, globals),
        langs,
        htmlScope(jsRulesOf(core.rules), core.settings, core.htmlPlugin),
        exclusionScopes(eslint.exclusions ?? []),
        manifest,
        userScopes,
        optionalScopes(eslint),
        {
            files: CONSUMER_CONFIG_FILES,
            rules: Object.fromEntries(CONSUMER_CONFIG_OFF.map((rule) => [rule, RULE_OFF])),
        },
    );
};
