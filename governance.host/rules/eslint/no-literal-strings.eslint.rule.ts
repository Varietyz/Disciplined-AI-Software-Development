import type { AstNode, CopyOf } from "../../types/syntax.types.ts";
import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { REGISTER_VERBS, opensWith } from "../../shared/manifests/verb.manifest.ts";
import {
    argumentAt,
    isType,
    literalString,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
} from "../../shared/selectors/syntax.selector.ts";
import { boundCopyOf, copyTextOf } from "../../shared/selectors/literal.selector.ts";
import {
    errorMessageSink,
    renderableTextAssignment,
    setAttributeLiteral,
    sinkLiteral,
    terminalSink,
} from "../../shared/selectors/sink.selector.ts";
import type { CopyHit } from "../../types/sink.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const USER_VISIBLE_OBJECT_KEYS = new Set([
    "alt",
    "ariaLabel",
    "caption",
    "description",
    "detail",
    "displayName",
    "footer",
    "heading",
    "headline",
    "label",
    "message",
    "placeholder",
    "subtitle",
    "summary",
    "text",
    "title",
    "tooltip",
]);

const USER_VISIBLE_ARRAY_KEYS = new Set(["lines", "messages", "words"]);

const EXEMPT_BASENAME_SUFFIXES = [concernSuffix("strings"), ".test.ts", ".spec.ts"];

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const textOf = function textOf(node: AstNode | null): string {
    return copyTextOf(node) ?? "";
};

const copyResolver = function copyResolver(context: RuleContext, raw: RuleNode): CopyOf {
    return boundCopyOf(context.sourceCode.getScope(raw));
};

const propertyKey = function propertyKey(prop: AstNode): string | null {
    if (prop.type !== "Property") {
        return null;
    }
    const key = nodeAt(prop, "key");
    if (key === null) {
        return null;
    }
    return key.type === "Identifier" ? nameOf(key) : literalString(key);
};

const userVisibleLiteralProps = function userVisibleLiteralProps(objectExpr: AstNode, copyOf: CopyOf): CopyHit[] {
    const matches: CopyHit[] = [];
    for (const prop of nodesAt(objectExpr, "properties")) {
        const keyName = propertyKey(prop);
        if (keyName === null || !USER_VISIBLE_OBJECT_KEYS.has(keyName)) {
            continue;
        }
        const value = copyOf(nodeAt(prop, "value"));
        if (value !== null && textOf(value) !== keyName) {
            matches.push({ keyName, value });
        }
    }
    return matches;
};

const userVisibleArrayLiterals = function userVisibleArrayLiterals(objectExpr: AstNode, copyOf: CopyOf): CopyHit[] {
    const matches: CopyHit[] = [];
    for (const prop of nodesAt(objectExpr, "properties")) {
        const keyName = propertyKey(prop);
        if (keyName === null || !USER_VISIBLE_ARRAY_KEYS.has(keyName)) {
            continue;
        }
        const value = nodeAt(prop, "value");
        for (const element of isType(value, "ArrayExpression") ? nodesAt(value, "elements") : []) {
            const copy = copyOf(element);
            if (copy !== null) {
                matches.push({ keyName: `${keyName}[]`, value: copy });
            }
        }
    }
    return matches;
};

const METADATA_KEY = "meta";
const METADATA_CHAIN = new Set(["CallExpression", "ObjectExpression", "Property"]);

const isUnderMetadataKey = function isUnderMetadataKey(objectExpr: AstNode): boolean {
    let cursor = nodeAt(objectExpr, "parent");
    while (cursor !== null && METADATA_CHAIN.has(cursor.type)) {
        if (cursor.type === "Property" && propertyKey(cursor) === METADATA_KEY) {
            return true;
        }
        cursor = nodeAt(cursor, "parent");
    }
    return false;
};

const isRegistryMetadataObject = function isRegistryMetadataObject(objectExpr: AstNode): boolean {
    if (isUnderMetadataKey(objectExpr)) {
        return true;
    }
    const parent = nodeAt(objectExpr, "parent");
    if (!isType(parent, "CallExpression") || argumentAt(parent, 0) !== objectExpr) {
        return false;
    }
    const callee = nodeAt(parent, "callee");
    return isType(callee, "Identifier") && opensWith(nameOf(callee), REGISTER_VERBS);
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            assignmentExpression(view, node) {
                const hit = renderableTextAssignment(view, copyResolver(context, node));
                if (hit === null) {
                    return;
                }
                const payload = { name: hit.keyName, value: textOf(hit.value) };
                context.report({ data: payload, loc: locOf(hit.value), messageId: "literalTextProperty" });
            },
            callExpression(view, node) {
                const copyOf = copyResolver(context, node);
                const written = sinkLiteral(terminalSink(view), copyOf);
                if (written !== null) {
                    const data = { sink: written.keyName, value: textOf(written.value) };
                    context.report({ data, loc: locOf(written.value), messageId: "literalTerminalWrite" });
                }
                const hit = setAttributeLiteral(view, copyOf);
                if (hit === null) {
                    return;
                }
                const payload = { attr: hit.keyName, value: textOf(hit.value) };
                context.report({ data: payload, loc: locOf(hit.value), messageId: "literalSetAttribute" });
            },
            newExpression(view, node) {
                const hit = sinkLiteral(errorMessageSink(view), copyResolver(context, node));
                if (hit === null) {
                    return;
                }
                const payload = { error: hit.keyName, value: textOf(hit.value) };
                context.report({ data: payload, loc: locOf(hit.value), messageId: "literalErrorMessage" });
            },
            objectExpression(view, node) {
                if (isRegistryMetadataObject(view)) {
                    return;
                }
                const copyOf = copyResolver(context, node);
                for (const hit of [
                    ...userVisibleLiteralProps(view, copyOf),
                    ...userVisibleArrayLiterals(view, copyOf),
                ]) {
                    const payload = { key: hit.keyName, value: textOf(hit.value) };
                    context.report({ data: payload, loc: locOf(hit.value), messageId: "literalUserVisibleProp" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A user-visible string is referenced from the centralized editorial surface, never written at the site that emits it. Detection is by POSITION rather than by content — no rule can read a string and know whether a person will see it, so the slot it occupies is the evidence: a property whose key is a user-visible slot, an element of a user-visible collection, an assignment to a node's text, an attribute write whose attribute is user-visible, the message of a constructed error, or the text written to a terminal stream or the console, all of which reach the reader in a terminal or a log. A template counts as copy whether or not it interpolates, once its literal parts carry a word, because a sentence with a value inside it is still a sentence. A name in the slot is followed to the text it is bound to in scope, because moving copy into a local binding first changes where it is written, not whether it is written at the site. The slot names are a genuine vocabulary and live as a typed set; the registration callees are not, and are derived from the verb the callee opens with so a registry added tomorrow is covered without an edit. Registry metadata is exempt whether it is handed to a registration call or nested under a metadata key, because a description a registry reads is documentation, not copy. Copy has a review axis of its own, and a literal at a call site is invisible to it.",
        },
        messages: {
            literalErrorMessage:
                "Literal '{{value}}' is the message of a new {{error}}, and an error message reaches the reader in a terminal or a log. Add it to the relevant strings module and reference it.",
            literalSetAttribute:
                "Literal '{{value}}' passed to setAttribute(\"{{attr}}\", ...) — user-visible attribute. Import from a *.strings.ts file.",
            literalTerminalWrite:
                "Literal '{{value}}' is written to {{sink}}, and a terminal line reaches the reader. Add it to the relevant strings module and reference it.",
            literalTextProperty:
                "Literal '{{value}}' assigned to .{{name}} — import from a *.strings.ts file. Direct property assignment of user-visible text bypasses centralization.",
            literalUserVisibleProp:
                "Literal '{{value}}' in the user-visible slot {{key}} — copy is referenced from the centralized editorial surface, never written here. Add a const to the relevant strings module and reference it.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
