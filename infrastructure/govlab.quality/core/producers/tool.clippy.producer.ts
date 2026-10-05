import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { intAt, trailingIdentifier } from "#core/parsers/knob.parser";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { isThreshold } from "#core/predicates/knob.predicate";
import { remoteText } from "#core/adapters/remote.adapter";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const CLIPPY = "clippy";
const RUSTC = "rustc";
const DRIVER = "clippy-driver";
const CLIPPY_PREFIX = "clippy::";
const CLIPPY_DOCS = "https://rust-lang.github.io/rust-clippy/master/#";
const CONF_SOURCE = "https://raw.githubusercontent.com/rust-lang/rust-clippy/master/clippy_config/src/conf.rs";
const LINTS_OPEN = "#[lints(";
const LINTS_CLOSE = ")]";
const FIELD_WINDOW = 200;
const MIN_COLS = 2;

interface CheckLine {
    level: string;
    meaning: string | null;
    name: string;
}

const skipSpaces = function skipSpaces(text: string, start: number): number {
    let i = start;
    while (i < text.length && text[i] === " ") {
        i += 1;
    }
    return i;
};

const columnEnd = function columnEnd(text: string, start: number): number {
    let i = start;
    while (i < text.length && !(text[i] === " " && text[i + 1] === " ")) {
        i += 1;
    }
    return i;
};

const splitColumns = function splitColumns(text: string): string[] {
    const cols: string[] = [];
    let i = skipSpaces(text, 0);
    while (i < text.length) {
        const end = columnEnd(text, i);
        cols.push(text.slice(i, end).trimEnd());
        i = skipSpaces(text, end);
    }
    return cols;
};

const isTableRow = function isTableRow(text: string): boolean {
    return text.length > 0 && !text.startsWith("name") && !text.startsWith("----");
};

const parseCheckLine = function parseCheckLine(text: string): CheckLine | null {
    const cols = isTableRow(text) ? splitColumns(text) : [];
    if (cols.length < MIN_COLS) {
        return null;
    }
    const meaning = cols.slice(MIN_COLS).join(" ");
    return { level: cols[1] ?? "", meaning: meaning === "" ? null : meaning, name: cols[0] ?? "" };
};

const toUnderscore = function toUnderscore(name: string): string {
    return name.split("-").join("_");
};

const sectionLines = function sectionLines(lines: readonly string[], start: string, end: string): string[] {
    const from = lines.findIndex((line) => line.trim() === start);
    const to = end === "" ? lines.length : lines.findIndex((line) => line.trim() === end);
    return to === -1 ? [] : lines.slice(from + 1, to).map((line) => line.trim());
};

const groupMembers = function groupMembers(group: string, rest: readonly string[]): [string, string][] {
    if (rest.length === 0 || group === "clippy::all") {
        return [];
    }
    const short = group.startsWith(CLIPPY_PREFIX) ? group.slice(CLIPPY_PREFIX.length) : group;
    return rest
        .join(" ")
        .split(",")
        .map((member) => toUnderscore(member.trim()))
        .filter((id) => id.length > 0)
        .map((id): [string, string] => [id, short]);
};

const groupOf = function groupOf(lines: readonly string[]): Map<string, string> {
    return new Map(
        lines
            .filter(isTableRow)
            .map(splitColumns)
            .flatMap(([group = "", ...rest]) => groupMembers(group, rest)),
    );
};

const build = function build(
    checks: readonly CheckLine[],
    tool: string,
    context: { groups: Map<string, string>; version: string },
): CatalogRule[] {
    return checks
        .map((check): CatalogRule => {
            const id = toUnderscore(check.name);
            const short = id.startsWith(CLIPPY_PREFIX) ? id.slice(CLIPPY_PREFIX.length) : id;
            return {
                canonical: null,
                category: tool === CLIPPY ? (context.groups.get(id) ?? CLIPPY) : RUSTC,
                defaultLevel: check.level,
                description: check.meaning,
                ecosystem: "rust",
                name: short,
                ruleId: id,
                tool,
                toolVersion: context.version,
                url: tool === CLIPPY ? `${CLIPPY_DOCS}/${short}` : null,
            };
        })
        .toSorted(byRuleId);
};

const productOf = function productOf(tool: string, rules: CatalogRule[], version: string): CatalogProduct {
    return {
        rules,
        source: tool,
        summary: {
            byCategory: tallyBy(rules, "category"),
            byLevel: tallyBy(rules, "defaultLevel"),
            tool,
            toolVersion: version,
            total: rules.length,
        },
    };
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(DRIVER, ["--version"]);
    const lines = commandOutput(DRIVER, ["-Whelp"])
        .split("\n")
        .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
    const checksOf = (start: string, end: string): CheckLine[] =>
        sectionLines(lines, start, end).flatMap((line) => parseCheckLine(line) ?? []);
    const context = { groups: groupOf(sectionLines(lines, "Lint groups loaded by this crate:", "")), version };
    const clippy = build(
        checksOf("Lint checks loaded by this crate:", "Lint groups loaded by this crate:"),
        CLIPPY,
        context,
    );
    const rustc = build(checksOf("Lint checks provided by rustc:", "Lint groups provided by rustc:"), RUSTC, context);
    return [productOf(CLIPPY, clippy, version), productOf(RUSTC, rustc, version)];
};

const lintEntries = function lintEntries(text: string, open: number, close: number): KnobEntry[] {
    const colon = text.indexOf(":", close);
    const eq = text.indexOf("=", colon);
    const def = colon !== -1 && eq !== -1 && eq - close <= FIELD_WINDOW ? intAt(text, eq + 1) : null;
    if (def === null) {
        return [];
    }
    const field = trailingIdentifier(text.slice(close + LINTS_CLOSE.length, colon));
    return text
        .slice(open + LINTS_OPEN.length, close)
        .split(",")
        .map((lint) => lint.trim())
        .filter(Boolean)
        .map((lint): KnobEntry => [
            CLIPPY,
            `${CLIPPY_PREFIX}${lint}`,
            {
                default: def,
                knob: field === "" ? "threshold" : field,
                threshold: isThreshold(field),
                type: INTEGER_TYPE,
            },
        ]);
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    const text = (await remoteText(CONF_SOURCE)) ?? "";
    const entries: KnobEntry[] = [];
    let open = text.indexOf(LINTS_OPEN);
    while (open >= 0) {
        const close = text.indexOf(LINTS_CLOSE, open);
        if (close === -1) {
            return entries;
        }
        entries.push(...lintEntries(text, open, close));
        open = text.indexOf(LINTS_OPEN, close + LINTS_CLOSE.length);
    }
    return entries;
};

defineProducer({ knobs, name: CLIPPY, produce, refresh: "manual" });
