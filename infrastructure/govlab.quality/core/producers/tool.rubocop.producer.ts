import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { firstRemoteText } from "#core/adapters/remote.adapter";
import { isRecord } from "#core/selectors/record.selector";
import { isThreshold } from "#core/predicates/knob.predicate";
import { parseYaml } from "#core/parsers/config.yaml.parser";
import { tallyBy } from "#core/aggregators/catalog.aggregator";
import { withoutRubyTags } from "#core/parsers/knob.parser";

const TOOL = "rubocop";
const PLUGINS_SOURCE = "rubocop-plugins";
const DOCS = "https://docs.rubocop.org";
const DESCRIPTION_KEY = "Description:";
const ENABLED_KEY = "Enabled:";
const ENABLED_LEVEL = "enabled";
const DISABLED_LEVEL = "disabled";
const PENDING_LEVEL = "pending";
const REPOSITORIES: readonly [string, string][] = [
    ["rubocop", "rubocop/rubocop"],
    ["rubocop-rails", "rubocop/rubocop-rails"],
    ["rubocop-rspec", "rubocop/rubocop-rspec"],
    ["rubocop-performance", "rubocop/rubocop-performance"],
    ["rubocop-minitest", "rubocop/rubocop-minitest"],
    ["rubocop-rake", "rubocop/rubocop-rake"],
    ["rubocop-thread_safety", "rubocop/rubocop-thread_safety"],
    ["rubocop-capybara", "rubocop/rubocop-capybara"],
    ["rubocop-factory_bot", "rubocop/rubocop-factory_bot"],
    ["rubocop-graphql", "DmitryTsepelev/rubocop-graphql"],
    ["rubocop-sequel", "rubocop/rubocop-sequel"],
];
const META_KEYS: ReadonlySet<string> = new Set([
    "Description",
    "Enabled",
    "VersionAdded",
    "VersionChanged",
    "StyleGuide",
    "Reference",
    "References",
    "SafeAutoCorrect",
    "Safe",
    "AutoCorrect",
    "Include",
    "Exclude",
    "Severity",
    "Details",
]);

interface Cop {
    department: string;
    description: string | null;
    level: string | null;
    name: string;
}

const stripQuotes = function stripQuotes(value: string): string {
    const text = value.trim();
    const quoted = (text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'));
    return quoted ? text.slice(1, -1) : text;
};

const levelOfDeclared = function levelOfDeclared(declared: string): string {
    if (declared === "false") {
        return DISABLED_LEVEL;
    }
    return declared === PENDING_LEVEL ? PENDING_LEVEL : ENABLED_LEVEL;
};

const isCopHeading = function isCopHeading(line: string): boolean {
    const unindented = line.length > 0 && !line.startsWith(" ") && !line.startsWith("\t");
    return unindented && line.includes("/") && line.endsWith(":");
};

const updatedCop = function updatedCop(cop: Cop, text: string): Cop {
    if (text.startsWith(DESCRIPTION_KEY)) {
        return { ...cop, description: stripQuotes(text.slice(DESCRIPTION_KEY.length)) };
    }
    if (text.startsWith(ENABLED_KEY)) {
        return { ...cop, level: levelOfDeclared(text.slice(ENABLED_KEY.length).trim()) };
    }
    return cop;
};

const readCopLine = function readCopLine(cops: readonly Cop[], line: string): Cop[] {
    if (isCopHeading(line)) {
        const name = line.slice(0, -1);
        return [...cops, { department: name.slice(0, name.indexOf("/")), description: null, level: null, name }];
    }
    const last = cops.at(-1);
    return last === undefined ? [...cops] : [...cops.slice(0, -1), updatedCop(last, line.trim())];
};

const copsOf = function copsOf(lines: readonly string[]): Cop[] {
    let cops: Cop[] = [];
    for (const line of lines) {
        cops = readCopLine(cops, line);
    }
    return cops;
};

const defaultConfig = async function defaultConfig(repository: string): Promise<Record<string, unknown>> {
    const root = `https://raw.githubusercontent.com/${repository}`;
    const text = await firstRemoteText([`${root}/master/config/default.yml`, `${root}/main/config/default.yml`]);
    const doc = parseYaml(withoutRubyTags(text ?? ""));
    return isRecord(doc) ? doc : {};
};

const copEntries = function copEntries(doc: Record<string, unknown>): [string, Record<string, unknown>][] {
    return Object.entries(doc).filter(
        (entry): entry is [string, Record<string, unknown>] => entry[0].includes("/") && isRecord(entry[1]),
    );
};

const levelOf = function levelOf(body: Record<string, unknown>): string {
    if (body["Enabled"] === false) {
        return DISABLED_LEVEL;
    }
    return body["Enabled"] === PENDING_LEVEL ? PENDING_LEVEL : ENABLED_LEVEL;
};

const coreProduct = function coreProduct(): CatalogProduct {
    const version = commandVersion(TOOL, ["--version"]);
    const lines = commandOutput(TOOL, ["--show-cops"])
        .split("\n")
        .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
    const rules = copsOf(lines)
        .map((cop): CatalogRule => ({
            canonical: null,
            category: cop.department,
            defaultLevel: cop.level ?? ENABLED_LEVEL,
            description: cop.description,
            ecosystem: "ruby",
            name: cop.name,
            ruleId: cop.name,
            tool: TOOL,
            toolVersion: version,
            url: `${DOCS}/rubocop/cops_${cop.department.toLowerCase()}.html`,
        }))
        .toSorted(byRuleId);
    return {
        rules,
        source: TOOL,
        summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: version, total: rules.length },
    };
};

const pluginRules = function pluginRules(tool: string, doc: Record<string, unknown>): CatalogRule[] {
    return copEntries(doc).map(([key, body]): CatalogRule => {
        const description = body["Description"];
        return {
            canonical: null,
            category: key.slice(0, key.indexOf("/")),
            defaultLevel: levelOf(body),
            description: typeof description === "string" ? description : null,
            ecosystem: "ruby",
            name: key,
            ruleId: key,
            tool,
            toolVersion: "latest",
            url: `${DOCS}/${tool}/cops.html`,
        };
    });
};

const pluginProduct = async function pluginProduct(): Promise<CatalogProduct> {
    const plugins = REPOSITORIES.filter(([tool]) => tool !== TOOL);
    const docs = await Promise.all(plugins.map(async ([, repository]) => defaultConfig(repository)));
    const perPlugin = plugins.map(([tool], index) => ({ rules: pluginRules(tool, docs[index] ?? {}), tool }));
    const rules = perPlugin.flatMap((entry) => entry.rules).toSorted(byRuleId);
    const extensions = perPlugin.map((entry) => ({ cops: entry.rules.length, tool: entry.tool }));
    return { rules, source: PLUGINS_SOURCE, summary: { extensions, tool: PLUGINS_SOURCE, total: rules.length } };
};

const typeOf = function typeOf(value: unknown): string {
    if (typeof value === "number") {
        return INTEGER_TYPE;
    }
    if (typeof value === "boolean") {
        return "boolean";
    }
    return Array.isArray(value) ? "array" : "string";
};

const copKnobs = function copKnobs(tool: string, cop: string, body: Record<string, unknown>): KnobEntry[] {
    return Object.entries(body)
        .filter(([key]) => !META_KEYS.has(key))
        .map(([key, value]): KnobEntry => {
            const type = typeOf(value);
            const fallback = typeof value === "object" ? null : value;
            return [
                tool,
                cop,
                { default: fallback, knob: key, threshold: type === INTEGER_TYPE && isThreshold(key), type },
            ];
        });
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    const docs = await Promise.all(REPOSITORIES.map(async ([, repository]) => defaultConfig(repository)));
    return REPOSITORIES.flatMap(([tool], index) =>
        copEntries(docs[index] ?? {}).flatMap(([cop, body]) => copKnobs(tool, cop, body)),
    );
};

defineProducer({ knobs, name: TOOL, produce: async () => [coreProduct(), await pluginProduct()], refresh: "manual" });
