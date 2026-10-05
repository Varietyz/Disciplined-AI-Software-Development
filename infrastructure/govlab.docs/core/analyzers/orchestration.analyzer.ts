import type { FunctionBody, OrchestrationFold, OrchestrationTarget, ProgramAnalysis } from "#types/code.types";
import type { DetectedProtocol } from "#types/graph.types";
import { firstDeclaration } from "#core/selectors/code.typescript.selector";
import { inPackageSources } from "#core/selectors/program.selector";
import ts from "typescript";

const MAX_MESSAGES = 50;
const MIN_PARTICIPANT_LEN = 3;
const MIN_ORCH_PARTICIPANTS = 2;
const MIN_ORCH_MESSAGES = 2;
const THIS = "this";

const foldTarget = function foldTarget(
    fold: OrchestrationFold,
    target: OrchestrationTarget,
    fnName: string,
): OrchestrationFold {
    const key = `${target.participant} ${target.method}`;
    const skip =
        target.participant === fnName ||
        target.participant.length < MIN_PARTICIPANT_LEN ||
        fold.msgKey.has(key) ||
        fold.messages.length >= MAX_MESSAGES;
    if (skip) {
        return fold;
    }
    return {
        messages: [...fold.messages, { async: true, text: target.method, to: target.participant }],
        msgKey: new Set([...fold.msgKey, key]),
        seen: new Set([...fold.seen, target.participant]),
    };
};

const isNamedBinding = function isNamedBinding(node: ts.Node): node is ts.PropertyAssignment | ts.VariableDeclaration {
    return (ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) && ts.isIdentifier(node.name);
};

const boundFunction = function boundFunction(
    node: ts.PropertyAssignment | ts.VariableDeclaration,
): FunctionBody | null {
    const init = node.initializer;
    if (!init || !(ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
        return null;
    }
    return { body: init.body, name: node.name.getText() };
};

const functionBodyOf = function functionBodyOf(node: ts.Node): FunctionBody | null {
    if (ts.isFunctionDeclaration(node) && node.name) {
        return { body: node.body, name: node.name.text };
    }
    if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
        return { body: node.body, name: node.name.text };
    }
    return isNamedBinding(node) ? boundFunction(node) : null;
};

const isTopLevelVariable = function isTopLevelVariable(decl: ts.Declaration): boolean {
    return ts.isVariableDeclaration(decl) && ts.isSourceFile(decl.parent.parent.parent);
};

const isCallableDeclaration = function isCallableDeclaration(decl: ts.Declaration): boolean {
    return (
        ts.isFunctionDeclaration(decl) ||
        ts.isImportSpecifier(decl) ||
        ts.isImportClause(decl) ||
        ts.isImportEqualsDeclaration(decl)
    );
};

class ProtocolDetector {
    readonly #checker: ts.TypeChecker;

    public constructor(checker: ts.TypeChecker) {
        this.#checker = checker;
    }

    public bestIn(node: ts.Node, best: DetectedProtocol | null): DetectedProtocol | null {
        let current = this.#consider(node, best);
        ts.forEachChild(node, (child) => {
            current = this.bestIn(child, current);
        });
        return current;
    }

    #consider(node: ts.Node, best: DetectedProtocol | null): DetectedProtocol | null {
        const fn = functionBodyOf(node);
        if (!fn?.body || !ts.isBlock(fn.body)) {
            return best;
        }
        const found = this.#orchestrationOf(fn.name, fn.body);
        return found !== null && (best === null || found.messages.length > best.messages.length) ? found : best;
    }

    #orchestrationOf(fnName: string, body: ts.Block): DetectedProtocol | null {
        const seed: OrchestrationFold = { messages: [], msgKey: new Set<string>(), seen: new Set<string>() };
        const fold = this.#awaitTargets(body).reduce((acc, target) => foldTarget(acc, target, fnName), seed);
        return fold.seen.size >= MIN_ORCH_PARTICIPANTS && fold.messages.length >= MIN_ORCH_MESSAGES
            ? { messages: fold.messages, participants: [...fold.seen], self: fnName }
            : null;
    }

    #awaitTargets(body: ts.Block): OrchestrationTarget[] {
        const out: OrchestrationTarget[] = [];
        const visit = (child: ts.Node): void => {
            const target = this.#targetOf(child);
            if (target !== null) {
                out.push(target);
            }
            ts.forEachChild(child, visit);
        };
        ts.forEachChild(body, visit);
        return out;
    }

    #targetOf(child: ts.Node): OrchestrationTarget | null {
        if (!ts.isAwaitExpression(child) || !ts.isCallExpression(child.expression)) {
            return null;
        }
        return this.#awaitTarget(child.expression.expression);
    }

    #awaitTarget(callee: ts.Expression): OrchestrationTarget | null {
        if (ts.isIdentifier(callee)) {
            return this.#keepIdentifierCallee(callee) ? { method: callee.text, participant: callee.text } : null;
        }
        if (
            ts.isPropertyAccessExpression(callee) &&
            ts.isIdentifier(callee.expression) &&
            callee.expression.text !== THIS &&
            ts.isIdentifier(callee.name)
        ) {
            return { method: callee.name.text, participant: callee.expression.text };
        }
        return null;
    }

    #keepIdentifierCallee(idNode: ts.Node): boolean {
        const symbol = this.#checker.getSymbolAtLocation(idNode);
        const decl = symbol ? firstDeclaration(symbol, this.#checker) : null;
        if (decl === null || isCallableDeclaration(decl)) {
            return true;
        }
        return isTopLevelVariable(decl);
    }
}

export const detectProtocol = function detectProtocol(analysis: ProgramAnalysis): DetectedProtocol | null {
    const detector = new ProtocolDetector(analysis.checker);
    return inPackageSources(analysis.program, analysis.dirPosix).reduce<DetectedProtocol | null>(
        (best, file) => detector.bestIn(file, best),
        null,
    );
};
