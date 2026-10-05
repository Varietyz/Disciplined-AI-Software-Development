import type { XmlElement } from "#types/emitter.types";
import { defineFormatter } from "#core/registries/formatter.registry";
import { xmlRulesetTree } from "#core/converters/emitter.xml.converter";

const XML_INDENT = 2;
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const XML_ESCAPES = new Map<string, string>([
    ['"', "&quot;"],
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
]);

const escapeXml = function escapeXml(text: string): string {
    let escaped = "";
    for (const ch of text) {
        escaped += XML_ESCAPES.get(ch) ?? ch;
    }
    return escaped;
};

const renderAttrs = function renderAttrs(attrs: Record<string, string> | undefined): string {
    return Object.entries(attrs ?? {})
        .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
        .join("");
};

const renderElement = function renderElement(element: XmlElement, indent: number): string[] {
    const pad = " ".repeat(indent);
    const attrs = renderAttrs(element.attrs);
    const children = element.children ?? [];
    const text = element.text ?? "";
    if (children.length === 0 && text === "") {
        return [`${pad}<${element.tag}${attrs}/>`];
    }
    if (children.length === 0) {
        return [`${pad}<${element.tag}${attrs}>${escapeXml(text)}</${element.tag}>`];
    }
    const childLines = children.flatMap((child) => renderElement(child, indent + XML_INDENT));
    return [`${pad}<${element.tag}${attrs}>`, ...childLines, `${pad}</${element.tag}>`];
};

export const serializeXml = function serializeXml(root: XmlElement, doctype?: string): string {
    const head = typeof doctype === "string" && doctype.length > 0 ? [XML_DECLARATION, doctype] : [XML_DECLARATION];
    return `${[...head, ...renderElement(root, 0)].join("\n")}\n`;
};

defineFormatter({
    format: "xml",
    render: (input) => serializeXml(xmlRulesetTree(input.descriptor, input.concepts), input.descriptor.xmlDoctype),
});
