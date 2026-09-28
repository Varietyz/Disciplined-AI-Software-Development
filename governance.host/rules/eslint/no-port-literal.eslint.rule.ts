import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    argumentAt,
    calleeName,
    isType,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
    numberAt,
    propertyKeyName,
    recordAt,
    staticTextOf,
    stringAt,
    stringIn,
    walk,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const PORT_WORD = "port";
const WORD_BREAK = "_";
const DIGITS = "0123456789";
const HOST_MARKS: readonly string[] = ["localhost:", "127.0.0.1:", "0.0.0.0:", "-port="];
const FALLBACK_OPERATORS: ReadonlySet<string> = new Set(["??", "||"]);
const LISTEN_CALLEES: ReadonlySet<string> = new Set(["listen"]);
const SYSTEM_ASSIGNED = 0;

const segmentsOf = function segmentsOf(name: string): readonly string[] {
    const segments: string[] = [];
    let current = "";
    for (const char of name) {
        const upper = char !== char.toLowerCase();
        if (char === WORD_BREAK || (upper && current.length > 0 && current !== current.toUpperCase())) {
            segments.push(current.toLowerCase());
            current = char === WORD_BREAK ? "" : char;
            continue;
        }
        current += char;
    }
    return [...segments, current.toLowerCase()].filter((segment) => segment.length > 0);
};

const isPortName = function isPortName(name: string): boolean {
    return segmentsOf(name).includes(PORT_WORD);
};

const isDigits = function isDigits(text: string): boolean {
    for (let at = 0; at < text.length; at += 1) {
        if (!DIGITS.includes(text.charAt(at))) {
            return false;
        }
    }
    return text.length > 0;
};

const isPortLiteral = function isPortLiteral(node: AstNode | null): boolean {
    if (!isType(node, "Literal") && !isType(node, "TemplateLiteral")) {
        return false;
    }
    if (numberAt(node, "value") !== null) {
        return true;
    }
    const text = staticTextOf(node);
    return text !== null && isDigits(text);
};

const namesPort = function namesPort(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    let found = false;
    walk(node, (inner) => {
        if (isType(inner, "Identifier") && isPortName(nameOf(inner))) {
            found = true;
        }
    });
    return found;
};

const hostPortIn = function hostPortIn(text: string): string | null {
    for (const mark of HOST_MARKS) {
        const at = text.indexOf(mark);
        const next = at === -1 ? "" : text.charAt(at + mark.length);
        if (next.length > 0 && DIGITS.includes(next)) {
            return mark;
        }
    }
    return null;
};

const quasiTexts = function quasiTexts(node: AstNode): string {
    return nodesAt(node, "quasis")
        .map((part) => stringIn(recordAt(part, "value"), "cooked"))
        .join("");
};

export default {
    create(context: RuleContext): RuleListener {
        const reportLiteral = function reportLiteral(node: AstNode, name: string): void {
            context.report({ data: { name }, loc: locOf(node), messageId: "portLiteral" });
        };
        const reportHost = function reportHost(node: AstNode, text: string): void {
            const mark = hostPortIn(text);
            if (mark !== null) {
                context.report({ data: { mark }, loc: locOf(node), messageId: "hostPort" });
            }
        };
        return listener({
            assignmentExpression(view) {
                const left = nodeAt(view, "left");
                const right = nodeAt(view, "right");
                if (isType(left, "Identifier") && isPortName(nameOf(left)) && isPortLiteral(right) && right !== null) {
                    reportLiteral(right, nameOf(left));
                }
            },
            callExpression(view) {
                const callee = calleeName(view);
                const first = argumentAt(view, 0);
                if (first === null || !isPortLiteral(first)) {
                    return;
                }
                const listensOnLiteral = LISTEN_CALLEES.has(callee) && numberAt(first, "value") !== SYSTEM_ASSIGNED;
                if (isPortName(callee) || listensOnLiteral) {
                    reportLiteral(first, callee);
                }
            },
            literal(view) {
                const text = staticTextOf(view);
                if (text !== null) {
                    reportHost(view, text);
                }
            },
            logicalExpression(view) {
                if (!FALLBACK_OPERATORS.has(stringAt(view, "operator"))) {
                    return;
                }
                const left = nodeAt(view, "left");
                const right = nodeAt(view, "right");
                const literalSide = isPortLiteral(right) ? right : (isPortLiteral(left) ? left : null);
                const readSide = literalSide === right ? left : right;
                if (literalSide !== null && namesPort(readSide)) {
                    context.report({ loc: locOf(literalSide), messageId: "portFallback" });
                }
            },
            property(view) {
                const value = nodeAt(view, "value");
                const key = propertyKeyName(view);
                if (isPortName(key) && value !== null && isPortLiteral(value)) {
                    reportLiteral(value, key);
                }
            },
            templateLiteral(view) {
                reportHost(view, quasiTexts(view));
            },
            variableDeclarator(view) {
                const id = nodeAt(view, "id");
                const init = nodeAt(view, "init");
                if (isType(id, "Identifier") && isPortName(nameOf(id)) && init !== null && isPortLiteral(init)) {
                    reportLiteral(init, nameOf(id));
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hardcoded-configuration"],
                enforces: ["architecture:configuration-externalization"],
            }),
            description:
                "A network port is never written in source. Every port is read from the root environment file through the environment loader, and a missing value stops the run instead of falling back. The rule refuses a port-named variable, property, assignment or call given a number or a digit string, a listen call given a port other than 0, which asks the system for a free one, a fallback between a port read and a literal, and a host with a port or a port flag written into a string. A name is port-named when one of its word segments is port, so report, import and support pass.",
        },
        messages: {
            hostPort:
                "The string writes a port after '{{mark}}'. Build the address from the port the environment loader reads from the root environment file.",
            portFallback:
                "A port read falls back to a literal. Remove the fallback, because the environment loader stops the run when the root environment file does not set the port.",
            portLiteral:
                "{{name}} is given a port as a literal. Read the port from the root environment file through the environment loader, and add the variable there.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
