import type { DetectedState, DetectedTransition } from "#types/graph.types";
import { INITIAL_HINTS, STATE_NAME_HINTS } from "#configuration/constants/code.typescript.constants";
import type { KeyedTransition, ProgramAnalysis, StateCandidate } from "#types/code.types";
import { inPackageSources } from "#core/selectors/program.selector";
import ts from "typescript";
import { unionStringLiterals } from "#core/selectors/code.typescript.selector";

const compareCandidates = function compareCandidates(left: StateCandidate, right: StateCandidate): number {
    if (left.hinted !== right.hinted) {
        return left.hinted ? -1 : 1;
    }
    return right.members.length - left.members.length;
};

const keyTextOf = function keyTextOf(name: ts.PropertyName): string | null {
    return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
};

const transitionOf = function transitionOf(
    prop: ts.ObjectLiteralElementLike,
    states: ReadonlySet<string>,
): KeyedTransition | null {
    if (!ts.isPropertyAssignment(prop)) {
        return null;
    }
    const from = keyTextOf(prop.name);
    const value = prop.initializer;
    if (from === null || !states.has(from) || !ts.isStringLiteral(value) || !states.has(value.text)) {
        return null;
    }
    return { from, key: `${from} ${value.text}`, to: value.text };
};

const initialState = function initialState(members: readonly string[]): string | null {
    return members.find((member) => INITIAL_HINTS.has(member.toLowerCase())) ?? null;
};

const stateTypes = function stateTypes(node: ts.Node): StateCandidate[] {
    const out: StateCandidate[] = [];
    const members = ts.isTypeAliasDeclaration(node) ? unionStringLiterals(node.type) : null;
    if (ts.isTypeAliasDeclaration(node) && members !== null) {
        const name = node.name.text.toLowerCase();
        out.push({ hinted: STATE_NAME_HINTS.some((hint) => name.includes(hint)), members });
    }
    ts.forEachChild(node, (child) => {
        out.push(...stateTypes(child));
    });
    return out;
};

const transitionsIn = function transitionsIn(
    node: ts.Node,
    states: ReadonlySet<string>,
    seen: Set<string>,
): DetectedTransition[] {
    const out: DetectedTransition[] = [];
    const props = ts.isObjectLiteralExpression(node) ? node.properties : [];
    for (const prop of props) {
        const transition = transitionOf(prop, states);
        if (transition !== null && !seen.has(transition.key)) {
            seen.add(transition.key);
            out.push({ from: transition.from, to: transition.to });
        }
    }
    ts.forEachChild(node, (child) => {
        out.push(...transitionsIn(child, states, seen));
    });
    return out;
};

export const detectState = function detectState(analysis: ProgramAnalysis): DetectedState | null {
    const sources = inPackageSources(analysis.program, analysis.dirPosix);
    const [first] = sources.flatMap(stateTypes).toSorted(compareCandidates);
    if (!first) {
        return null;
    }
    const states = new Set(first.members);
    const seen = new Set<string>();
    return {
        initial: initialState(first.members),
        states: first.members,
        transitions: sources.flatMap((file) => transitionsIn(file, states, seen)),
    };
};
