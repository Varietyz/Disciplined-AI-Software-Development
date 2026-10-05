import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "pylint";
const PYTHON = "python";
const CATEGORY_BY_LETTER: ReadonlyMap<string, string> = new Map([
    ["C", "convention"],
    ["E", "error"],
    ["F", "fatal"],
    ["I", "information"],
    ["R", "refactor"],
    ["W", "warning"],
]);

interface Message {
    code: string | null;
    desc: string;
    name: string;
    template: string | null;
}

const headerOf = function headerOf(line: string): Message {
    const openParen = line.indexOf(" (");
    const closeParen = line.indexOf(")", openParen);
    const firstStar = line.indexOf("*");
    const lastStar = line.lastIndexOf("*");
    return {
        code: openParen > 0 && closeParen > openParen ? line.slice(openParen + " (".length, closeParen) : null,
        desc: "",
        name: openParen > 0 ? line.slice(1, openParen) : line.slice(1),
        template: firstStar !== -1 && lastStar > firstStar ? line.slice(firstStar + 1, lastStar) : null,
    };
};

const messagesOf = function messagesOf(lines: readonly string[]): Message[] {
    const messages: Message[] = [];
    for (const line of lines) {
        const last = messages.at(-1);
        if (line.startsWith(":")) {
            messages.push(headerOf(line));
            continue;
        }
        if (last !== undefined && line.trim() !== "") {
            last.desc += (last.desc === "" ? "" : " ") + line.trim();
        }
    }
    return messages;
};

const ruleOf = function ruleOf(message: Message, version: string): CatalogRule[] {
    const { code } = message;
    if (code === null || code === "") {
        return [];
    }
    const letter = code[0] ?? "";
    return [
        {
            canonical: null,
            category: CATEGORY_BY_LETTER.get(letter) ?? letter,
            description: message.desc === "" ? message.template : message.desc,
            ecosystem: PYTHON,
            messageTemplate: message.template,
            name: message.name,
            ruleId: code,
            tool: TOOL,
            toolVersion: version,
            url: null,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(PYTHON, ["-m", TOOL, "--version"]);
    const lines = commandOutput(PYTHON, ["-m", TOOL, "--list-msgs"])
        .split("\n")
        .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
    const rules = messagesOf(lines)
        .flatMap((message) => ruleOf(message, version))
        .toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: version, total: rules.length },
        },
    ];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });
