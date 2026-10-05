import { childNodes, fieldText } from "#core/selectors/syntax.selector";
import type { CstNode } from "@govlab/code-parse";
import type { ImportBinding } from "#types/code.types";

const IMPORT_STATEMENT = "import_statement";
const IMPORT_SPECIFIER = "import_specifier";
const SOURCE_FIELD = "source";
const NAME_FIELD = "name";
const MIN_QUOTED = 2;
const QUOTES: readonly string[] = ['"', "'"];

const stripQuotes = function stripQuotes(text: string): string {
    const quoted = QUOTES.some((quote) => text.startsWith(quote) && text.endsWith(quote));
    return quoted && text.length >= MIN_QUOTED ? text.slice(1, -1) : text;
};

const specifierNames = function specifierNames(node: CstNode): string[] {
    const name = node.type === IMPORT_SPECIFIER ? fieldText(node, NAME_FIELD) : "";
    const here = name.length > 0 ? [name] : [];
    return [...here, ...childNodes(node).flatMap(specifierNames)];
};

const bindingOf = function bindingOf(node: CstNode): ImportBinding | null {
    const source = stripQuotes(fieldText(node, SOURCE_FIELD));
    const importedNames = specifierNames(node);
    return source.length > 0 && importedNames.length > 0 ? { importedNames, source } : null;
};

export const codeImports = function codeImports(node: CstNode): ImportBinding[] {
    const binding = node.type === IMPORT_STATEMENT ? bindingOf(node) : null;
    const here = binding === null ? [] : [binding];
    return [...here, ...childNodes(node).flatMap(codeImports)];
};
