import { ROLE_CALL, ROLE_DEFINITION, ROLE_NODE, roleOf } from "#core/classifiers/syntax.classifier";
import { childNodes, fieldText, fieldType, lineOf } from "#core/selectors/syntax.selector";
import type { CodeSymbol } from "#types/code.types";
import type { CstNode } from "@govlab/code-parse";
import { MODULE_SCOPE } from "#configuration/constants/report.constants";
import { bodyHash } from "#core/converters/code.converter";

const NAME_FIELD = "name";
const ALIAS_FIELD = "alias";
const CALL_FUNCTION_FIELD = "function";
const VALUE_FIELD = "value";
const IMPORT_SPECIFIER = "import_specifier";
const EXPORT_TOKEN = "export";
const EXPORT_SPECIFIER = "export_specifier";
const SEGMENT = ".";

const NAME_FIELD_BY_ROLE: ReadonlyMap<string, string> = new Map([
    [ROLE_DEFINITION, NAME_FIELD],
    [ROLE_CALL, CALL_FUNCTION_FIELD],
]);
const MEMBER_CALL_TYPES: ReadonlySet<string> = new Set([
    "member_expression",
    "selector_expression",
    "attribute",
    "field_expression",
]);
const FUNCTION_KIND_TOKENS: readonly string[] = ["function", "method"];
const FUNCTION_VALUE_TYPES: ReadonlySet<string> = new Set([
    "arrow_function",
    "function",
    "function_expression",
    "generator_function",
    "function_definition",
]);

interface SymbolSite {
    enclosing: string;
    name: string;
    role: string;
}

const descendName = function descendName(node: CstNode): string {
    return (
        childNodes(node)
            .map((child) => fieldText(child, NAME_FIELD))
            .find((nested) => nested.length > 0) ?? ""
    );
};

const lastSegment = function lastSegment(name: string): string {
    const dot = name.lastIndexOf(SEGMENT);
    return dot === -1 ? name : name.slice(dot + 1);
};

const nameOf = function nameOf(node: CstNode, role: string): string {
    const field = NAME_FIELD_BY_ROLE.get(role);
    if (field === undefined) {
        return "";
    }
    const direct = fieldText(node, field);
    return lastSegment(direct.length > 0 ? direct : descendName(node));
};

const collectAliases = function collectAliases(node: CstNode): Map<string, string> {
    const aliases = new Map<string, string>();
    const imported = node.type === IMPORT_SPECIFIER ? fieldText(node, NAME_FIELD) : "";
    const local = node.type === IMPORT_SPECIFIER ? fieldText(node, ALIAS_FIELD) : "";
    if (imported.length > 0 && local.length > 0) {
        aliases.set(local, imported);
    }
    for (const child of childNodes(node)) {
        for (const [key, value] of collectAliases(child)) {
            aliases.set(key, value);
        }
    }
    return aliases;
};

const isMemberCall = function isMemberCall(node: CstNode): boolean {
    const fn = fieldType(node, CALL_FUNCTION_FIELD);
    return fn !== undefined && MEMBER_CALL_TYPES.has(fn);
};

const isCallableDef = function isCallableDef(node: CstNode): boolean {
    const lower = node.type.toLowerCase();
    const hasFunctionValue = childNodes(node).some((child) =>
        FUNCTION_VALUE_TYPES.has(fieldType(child, VALUE_FIELD) ?? ""),
    );
    return FUNCTION_KIND_TOKENS.some((token) => lower.includes(token)) || hasFunctionValue;
};

const symbolAt = function symbolAt(node: CstNode, site: SymbolSite): CodeSymbol {
    const isDefinition = site.role === ROLE_DEFINITION;
    return {
        callable: isDefinition && isCallableDef(node),
        enclosing: site.enclosing,
        exported: false,
        file: "",
        hash: isDefinition ? bodyHash(node.text ?? "") : "",
        kind: node.type,
        line: lineOf(node),
        member: site.role === ROLE_CALL && isMemberCall(node),
        name: site.name,
        role: site.role,
        size: isDefinition ? (node.text ?? "").length : 0,
    };
};

const symbolWalk = function symbolWalk(
    node: CstNode,
    enclosing: string,
    aliases: ReadonlyMap<string, string>,
): CodeSymbol[] {
    const role = node.isNamed ? roleOf(node.type) : ROLE_NODE;
    const found = nameOf(node, role);
    const name = role === ROLE_CALL ? (aliases.get(found) ?? found) : found;
    const here = name.length > 0 && role !== ROLE_NODE ? [symbolAt(node, { enclosing, name, role })] : [];
    const childEnclosing = role === ROLE_DEFINITION && name.length > 0 ? name : enclosing;
    return [...here, ...childNodes(node).flatMap((child) => symbolWalk(child, childEnclosing, aliases))];
};

const exportNamesAt = function exportNamesAt(node: CstNode, underExport: boolean): string[] {
    const active = underExport || node.type.includes(EXPORT_TOKEN);
    const isDefinition = active && node.isNamed && roleOf(node.type) === ROLE_DEFINITION;
    const defName = isDefinition ? nameOf(node, ROLE_DEFINITION) : "";
    const specName = node.type === EXPORT_SPECIFIER ? fieldText(node, NAME_FIELD) : "";
    const nested = childNodes(node).flatMap((child) => exportNamesAt(child, active));
    return [defName, specName, ...nested].filter((name) => name.length > 0);
};

export const codeSymbols = function codeSymbols(root: CstNode): CodeSymbol[] {
    const exported = new Set(exportNamesAt(root, false));
    return symbolWalk(root, MODULE_SCOPE, collectAliases(root)).map((symbol) =>
        symbol.role === ROLE_DEFINITION && exported.has(symbol.name) ? { ...symbol, exported: true } : symbol,
    );
};
