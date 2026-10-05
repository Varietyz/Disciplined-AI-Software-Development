import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { intAfter } from "#core/parsers/knob.parser";
import { isThreshold } from "#core/predicates/knob.predicate";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "golangci-lint";
const DOCS = "https://golangci-lint.run/usage/linters/#";
const SCHEMA = "https://raw.githubusercontent.com/golangci/golangci-lint/main/jsonschema/golangci.next.jsonschema.json";
const SCHEMA_WINDOW = 4000;
const AGGREGATORS: ReadonlySet<string> = new Set([
    "staticcheck",
    "gocritic",
    "revive",
    "gosec",
    "govet",
    "g.staticcheck",
]);
const SECTION_TOGGLE: ReadonlyMap<string, boolean> = new Map([
    ["Enabled by default linters:", true],
    ["Disabled by default linters:", false],
]);
const STOP_PREFIXES = ["Linters presets:", "Linters:"];
const KNOB_SETTINGS: readonly [string, string][] = [
    ["gocyclo", "min-complexity"],
    ["cyclop", "max-complexity"],
    ["gocognit", "min-complexity"],
    ["funlen", "lines"],
    ["funlen", "statements"],
    ["nestif", "min-complexity"],
    ["lll", "line-length"],
    ["dupl", "threshold"],
    ["maintidx", "under"],
    ["varnamelen", "min-name-length"],
    ["interfacebloat", "max"],
    ["maligned", "suggest-new"],
];

const stripFlags = function stripFlags(text: string): { desc: string; flags: string[] } {
    let desc = text;
    const flags: string[] = [];
    while (desc.endsWith("]") && desc.lastIndexOf("[") !== -1) {
        const open = desc.lastIndexOf("[");
        flags.push(desc.slice(open + 1, -1));
        desc = desc.slice(0, open).trim();
    }
    return { desc, flags };
};

const linterRule = function linterRule(line: string, enabled: boolean, version: string): CatalogRule | null {
    const colon = line.indexOf(": ");
    if (colon === -1) {
        return null;
    }
    const name = line.slice(0, colon);
    const { desc, flags } = stripFlags(line.slice(colon + ": ".length).trim());
    return {
        aggregate: AGGREGATORS.has(name),
        autofix: flags.includes("auto-fix"),
        canonical: null,
        category: "linter",
        description: desc === "" ? null : desc,
        ecosystem: "go",
        enabledByDefault: enabled,
        fast: flags.includes("fast"),
        name,
        ruleId: name,
        tool: TOOL,
        toolVersion: version,
        url: `${DOCS}${name}`,
    };
};

const linters = function linters(lines: readonly string[], version: string): CatalogRule[] {
    const rules: CatalogRule[] = [];
    let enabled: boolean | null = null;
    for (const raw of lines) {
        const text = raw.trim();
        if (STOP_PREFIXES.some((prefix) => text.startsWith(prefix))) {
            break;
        }
        const toggled = SECTION_TOGGLE.get(text);
        enabled = toggled ?? enabled;
        const rule =
            toggled === undefined && enabled !== null && text !== "" ? linterRule(text, enabled, version) : null;
        if (rule !== null) {
            rules.push(rule);
        }
    }
    return rules;
};

const count = function count(rules: readonly CatalogRule[], key: string): number {
    return rules.filter((rule) => rule[key] === true).length;
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(TOOL, ["version"]);
    const rules = linters(commandOutput(TOOL, ["help", "linters"]).split("\n"), version).toSorted(byRuleId);
    const summary = {
        aggregators: count(rules, "aggregate"),
        autofix: count(rules, "autofix"),
        enabledByDefault: count(rules, "enabledByDefault"),
        tool: TOOL,
        toolVersion: version,
        total: rules.length,
    };
    return [{ rules, source: TOOL, summary }];
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    const schema = (await remoteText(SCHEMA)) ?? "";
    return KNOB_SETTINGS.flatMap(([linter, setting]): KnobEntry[] => {
        const at = schema.indexOf(`"${linter}"`);
        const value = at === -1 ? null : intAfter(schema, `"${setting}"`, { from: at, window: SCHEMA_WINDOW });
        return value === null
            ? []
            : [[TOOL, linter, { default: value, knob: setting, threshold: isThreshold(setting), type: INTEGER_TYPE }]];
    });
};

defineProducer({ knobs, name: TOOL, produce, refresh: "manual" });
