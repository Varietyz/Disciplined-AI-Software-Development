import type { Hoisted, Rescoped } from "#types/diagram.types";
import { decodeEntities, nextQuote, parseTag, serializeTag, tagEnd } from "#core/converters/markup.converter";
import type { Tag } from "#types/markup.types";
import { attributeOf } from "#core/selectors/markup.selector";

const TAG_OPEN = "<";
const STYLE_OPEN = "<style>";
const STYLE_CLOSE = "</style>";
const STYLE_ATTRIBUTE = "style";
const CLASS_ATTRIBUTE = "class";
const ID_ATTRIBUTE = "id";
const ROOT_TAG = "svg";
const VECTOR_CLASS = "diagram-vector";
const RULE_CLASS_PREFIX = "diagram-style-";
const ID_MARK = "#";
const CLASS_MARK = ".";
const SPACE = " ";
const LINE_END = "\n";
const DECLARATION_END = ";";
const IMPORTANT = "!important";
const RULE_OPEN = "{";
const RULE_CLOSE = "}";
const GROUP_OPEN = "(";
const GROUP_CLOSE = ")";
const NON_ELEMENT_OPENERS = new Set(["/", "!", "?"]);
const IDENTIFIER_CHARS = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_");

class Sheet {
    private readonly blocks = new Set<string>();
    private readonly classes = new Map<string, string>();

    public addBlock(css: string): void {
        this.blocks.add(css);
    }

    public classFor(declarations: string): string {
        const known = this.classes.get(declarations);
        if (known !== undefined) {
            return known;
        }
        const created = RULE_CLASS_PREFIX + String(this.classes.size + 1);
        this.classes.set(declarations, created);
        return created;
    }

    public render(): string {
        const rules = [...this.classes].map(
            ([declarations, name]) => CLASS_MARK + name + RULE_OPEN + declarations + RULE_CLOSE,
        );
        return [...this.blocks, ...rules].join(LINE_END) + LINE_END;
    }
}

const identifierEnd = function identifierEnd(text: string, from: number): number {
    let at = from;
    while (at < text.length && IDENTIFIER_CHARS.has(text.charAt(at))) {
        at += 1;
    }
    return at;
};

export const rescope = function rescope(css: string, rootId: string): Rescoped {
    const needle = ID_MARK + rootId;
    const derived = new Set<string>();
    let out = "";
    let at = 0;
    if (rootId.length === 0) {
        return { css, derived };
    }
    while (at < css.length) {
        const found = css.indexOf(needle, at);
        if (found === -1) {
            return { css: out + css.slice(at), derived };
        }
        const end = identifierEnd(css, found + needle.length);
        const suffix = css.slice(found + needle.length, end);
        if (suffix.length > 0) {
            derived.add(suffix);
        }
        out += css.slice(at, found) + (suffix.length === 0 ? CLASS_MARK : ID_MARK) + VECTOR_CLASS + suffix;
        at = end;
    }
    return { css: out, derived };
};

const renameDerived = function renameDerived(markup: string, rootId: string, derived: ReadonlySet<string>): string {
    let out = markup;
    for (const suffix of derived) {
        out = out.split(rootId + suffix).join(VECTOR_CLASS + suffix);
    }
    return out;
};

const splitDeclarations = function splitDeclarations(text: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let quote = "";
    let start = 0;
    for (let at = 0; at < text.length; at += 1) {
        const char = text.charAt(at);
        const wasQuoted = quote !== "";
        quote = nextQuote(quote, char);
        if (wasQuoted || quote !== "") {
            continue;
        }
        depth += char === GROUP_OPEN ? 1 : 0;
        depth -= char === GROUP_CLOSE ? 1 : 0;
        if (char === DECLARATION_END && depth === 0) {
            parts.push(text.slice(start, at));
            start = at + 1;
        }
    }
    parts.push(text.slice(start));
    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
};

export const prioritize = function prioritize(declarations: string): string {
    return splitDeclarations(declarations)
        .map((declaration) => (declaration.endsWith(IMPORTANT) ? declaration : declaration + SPACE + IMPORTANT))
        .join(DECLARATION_END);
};

const withClass = function withClass(tag: Tag, className: string): Tag {
    const present = attributeOf(tag, CLASS_ATTRIBUTE) !== undefined;
    const attributes = present
        ? tag.attributes.map((attribute) =>
              attribute.name === CLASS_ATTRIBUTE
                  ? { ...attribute, value: [attribute.value ?? "", className].join(SPACE).trim() }
                  : attribute,
          )
        : [...tag.attributes, { name: CLASS_ATTRIBUTE, quote: '"', value: className }];
    return { ...tag, attributes };
};

const hoistTag = function hoistTag(tag: Tag, sheet: Sheet, isRoot: boolean): Tag {
    const style = attributeOf(tag, STYLE_ATTRIBUTE);
    const stripped = { ...tag, attributes: tag.attributes.filter((attribute) => attribute !== style) };
    const rooted = isRoot ? withClass(stripped, VECTOR_CLASS) : stripped;
    const declarations = decodeEntities(style?.value ?? "").trim();
    return declarations.length === 0 ? rooted : withClass(rooted, sheet.classFor(prioritize(declarations)));
};

const rootIdOf = function rootIdOf(markup: string): string {
    const open = markup.indexOf(TAG_OPEN + ROOT_TAG);
    const close = open === -1 ? -1 : tagEnd(markup, open + 1);
    return close < 0 ? "" : (attributeOf(parseTag(markup.slice(open + 1, close)), ID_ATTRIBUTE)?.value ?? "");
};

const liftBlocks = function liftBlocks(markup: string, sheet: Sheet, rootId: string): string {
    const derived = new Set<string>();
    let out = "";
    let at = 0;
    while (at < markup.length) {
        const open = markup.indexOf(STYLE_OPEN, at);
        const close = open === -1 ? -1 : markup.indexOf(STYLE_CLOSE, open);
        if (close < 0) {
            out += markup.slice(at);
            at = markup.length;
            continue;
        }
        const rescoped = rescope(decodeEntities(markup.slice(open + STYLE_OPEN.length, close)), rootId);
        sheet.addBlock(rescoped.css);
        for (const suffix of rescoped.derived) {
            derived.add(suffix);
        }
        out += markup.slice(at, open);
        at = close + STYLE_CLOSE.length;
    }
    return renameDerived(out, rootId, derived);
};

const liftAttributes = function liftAttributes(markup: string, sheet: Sheet): string {
    let out = "";
    let at = 0;
    let rootSeen = false;
    while (at < markup.length) {
        const open = markup.indexOf(TAG_OPEN, at);
        if (open === -1) {
            return out + markup.slice(at);
        }
        const close = NON_ELEMENT_OPENERS.has(markup.charAt(open + 1)) ? -1 : tagEnd(markup, open + 1);
        if (close < 0) {
            out += markup.slice(at, open + 1);
            at = open + 1;
            continue;
        }
        const tag = parseTag(markup.slice(open + 1, close));
        const isRoot: boolean = !rootSeen && tag.name === ROOT_TAG;
        rootSeen ||= isRoot;
        const touched = isRoot || attributeOf(tag, STYLE_ATTRIBUTE) !== undefined;
        out +=
            markup.slice(at, open) +
            (touched ? serializeTag(hoistTag(tag, sheet, isRoot)) : markup.slice(open, close + 1));
        at = close + 1;
    }
    return out;
};

export const hoistStyles = function hoistStyles(rendered: ReadonlyMap<string, string>): Hoisted {
    const sheet = new Sheet();
    const vectors = new Map<string, string>();
    for (const [source, markup] of rendered) {
        const lifted = liftBlocks(markup, sheet, rootIdOf(markup));
        vectors.set(source, liftAttributes(lifted, sheet));
    }
    return { stylesheet: sheet.render(), vectors };
};
