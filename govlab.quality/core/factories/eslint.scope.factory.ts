import type { BaseContext, InstalledPlugin, TsTestScopeOptions } from "#types/eslint.types";
import type { ESLint, Linter } from "eslint";
import type { EslintRelaxScope, EslintRuleExclusion, EslintScopeConfig } from "#types/config.types";
import {
    HTML_FILES,
    JSON_PARSER,
    JSX,
    JS_ECOSYSTEMS,
    JS_FILES,
    LANGUAGE,
    LANG_FILES,
    LANG_PARSERS,
    MANIFEST_FILES,
    RULE_OFF,
    TS_FILES,
    TS_PREFIX,
    TS_TEST_FILES,
} from "#configuration/constants/eslint.constants";
import { emitEslintConfig, eslintRulesForConcepts } from "#core/emitters/eslint.emitter";
import { isParser, isPlugin, isRuleEntry } from "#core/predicates/eslint.predicate";
import { jsRulesOf, namespacesOf, pluginMap, toRulesRecord } from "#core/converters/eslint.converter";
import type { ConcernConfig } from "#types/concern.types";
import { isRecord } from "#core/selectors/record.selector";
import { loadModule } from "#core/loaders/eslint.loader";

const MANIFEST_CONFIG = "moduleManifest";
const TYPE_CHECK_OFF_CONFIG = "disable-type-checked";

const manifestRulesFrom = (plugin: unknown): Linter.RulesRecord => {
    if (!isRecord(plugin) || !isRecord(plugin["configs"])) {
        return {};
    }
    const manifest = plugin["configs"][MANIFEST_CONFIG];
    return isRecord(manifest) && isRecord(manifest["rules"]) ? toRulesRecord(manifest["rules"]) : {};
};

export const manifestScope = async (
    installed: InstalledPlugin[],
    plugins: Record<string, ESLint.Plugin>,
): Promise<Linter.Config | null> => {
    const rules: Linter.RulesRecord = {};
    for (const { plugin } of installed) {
        Object.assign(rules, manifestRulesFrom(plugin));
    }
    const parser = Object.keys(rules).length > 0 ? await loadModule(JSON_PARSER) : null;
    return isParser(parser) ? { files: MANIFEST_FILES, languageOptions: { parser }, plugins, rules } : null;
};

export const exclusionScopes = (exclusions: EslintRuleExclusion[]): Linter.Config[] =>
    exclusions.map((exclusion) => ({
        files: exclusion.eslintFiles,
        rules: Object.fromEntries(exclusion.rules.map((rule) => [rule, RULE_OFF])),
    }));

export const tsScopeOverride = (rules: Linter.RulesRecord): Linter.Config => {
    const off: Linter.RulesRecord = { "no-undef": RULE_OFF };
    for (const key of Object.keys(rules)) {
        const base = key.slice(TS_PREFIX.length);
        if (key.startsWith(TS_PREFIX) && Object.hasOwn(rules, base)) {
            off[base] = RULE_OFF;
        }
    }
    return { files: TS_FILES, rules: off };
};

export const disableTypeCheckedRules = (installed: InstalledPlugin[]): Linter.RulesRecord => {
    const tsPlugin = installed.find((entry) => entry.record.pluginNamespace === TS_PREFIX.slice(0, -1))?.plugin;
    if (!isRecord(tsPlugin) || !isRecord(tsPlugin["configs"])) {
        return {};
    }
    const disabled = tsPlugin["configs"][TYPE_CHECK_OFF_CONFIG];
    return isRecord(disabled) && isRecord(disabled["rules"]) ? toRulesRecord(disabled["rules"]) : {};
};

export const tsTestScope = (options: TsTestScopeOptions): Linter.Config | null =>
    isParser(options.tsParser)
        ? {
              files: [...TS_TEST_FILES, ...(options.extraGlobs ?? [])],
              languageOptions: {
                  ...options.language,
                  parser: options.tsParser,
                  parserOptions: { ...JSX, projectService: false },
              },
              rules: options.disabled,
          }
        : null;

export const baseConfigs = (context: BaseContext): Linter.Config[] => {
    const { plugins, rules, settings, tsParser, globals } = context;
    const language = { ...LANGUAGE, parserOptions: JSX, ...(globals ? { globals } : {}) };
    const withSettings = settings ? { settings } : {};
    const tsLanguage = isParser(tsParser) ? { parser: tsParser, parserOptions: { ...JSX, projectService: true } } : {};
    return [
        { plugins, ...withSettings },
        { files: TS_FILES, languageOptions: { ...language, ...tsLanguage }, rules, ...withSettings },
        { files: JS_FILES, languageOptions: language, rules: jsRulesOf(rules), ...withSettings },
    ];
};

const relaxScope = (scope: EslintRelaxScope): Linter.Config => ({
    files: scope.files,
    rules: Object.fromEntries(eslintRulesForConcepts(scope.relax).map((rule) => [rule, RULE_OFF])),
});

export const optionalScopes = (eslint: EslintScopeConfig): Linter.Config[] => {
    const relaxable = [eslint.generated, eslint.tests, eslint.buildScripts]
        .filter((scope): scope is EslintRelaxScope => Boolean(scope?.files.length))
        .map((scope) => relaxScope(scope));
    const { ignores } = eslint;
    const ignoreScope: Linter.Config[] = ignores && ignores.length > 0 ? [{ ignores }] : [];
    return [...ignoreScope, ...relaxable];
};

export const htmlScope = (
    rules: Linter.RulesRecord,
    settings: Linter.Config["settings"],
    htmlPlugin: unknown,
): Linter.Config | null =>
    isPlugin(htmlPlugin)
        ? {
              files: HTML_FILES,
              languageOptions: LANGUAGE,
              plugins: { html: htmlPlugin },
              rules,
              ...(settings ? { settings } : {}),
          }
        : null;

const namespaceRules = (activePlugins: string[], concerns: ConcernConfig): Linter.RulesRecord => {
    const namespaces = new Set(activePlugins);
    const out: Linter.RulesRecord = {};
    for (const [key, value] of Object.entries(emitEslintConfig({ activePlugins, concerns }))) {
        if (namespaces.has(key.split("/")[0] ?? "") && isRuleEntry(value)) {
            out[key] = value;
        }
    }
    return out;
};

const langScope = async (
    ecosystem: string,
    entries: InstalledPlugin[],
    concerns: ConcernConfig,
): Promise<Linter.Config | null> => {
    const files = LANG_FILES.get(ecosystem);
    const parser = files ? await loadModule(LANG_PARSERS.get(ecosystem) ?? "") : null;
    return isParser(parser)
        ? {
              ...(files ? { files } : {}),
              languageOptions: { parser },
              plugins: pluginMap(entries),
              rules: namespaceRules(namespacesOf(entries), concerns),
          }
        : null;
};

export const langScopes = async (installed: InstalledPlugin[], concerns: ConcernConfig): Promise<Linter.Config[]> => {
    const byEcosystem = new Map<string, InstalledPlugin[]>();
    for (const entry of installed.filter((item) => !JS_ECOSYSTEMS.has(item.record.ecosystem))) {
        byEcosystem.set(entry.record.ecosystem, [...(byEcosystem.get(entry.record.ecosystem) ?? []), entry]);
    }
    const scopes = await Promise.all(
        [...byEcosystem].map(async ([ecosystem, entries]) => langScope(ecosystem, entries, concerns)),
    );
    return scopes.filter((scope): scope is Linter.Config => scope !== null);
};
