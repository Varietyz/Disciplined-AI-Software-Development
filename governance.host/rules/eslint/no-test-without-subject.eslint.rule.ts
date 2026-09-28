import type { Rule } from "eslint";
import { defineCheck } from "@govlab/context/check";

defineCheck({ detects: [], enforces: ["architecture:testability"] });

interface DomNode {
    type: string;
    name?: string;
    value?: unknown;
    source?: DomNode;
    callee?: DomNode;
    object?: DomNode;
    property?: DomNode;
    arguments?: DomNode[];
}

interface FileState {
    subjectImports: number;
    testStructure: boolean;
}

const TEST_MARKER = ".test.";
const RUNTIME_ONLY_EXACT = new Set(["vitest", "chai", "sinon", "expect", "should"]);
const RUNTIME_ONLY_PREFIXES = ["node:", "@jest/", "@vitest/", "@playwright/"];
const SUITE_NAMES = new Set(["describe", "it", "test", "suite", "context"]);

const TAG = "[no_test_without_subject]";
const SUBJECTLESS_MESSAGE = `This test declares suites or cases but imports no module under test — its only imports resolve to test-runtime modules. Import the module under test through its declared specifier and assert against its real exported surface; delete any logic re-implemented inside the test. ${TAG}`;

const isDomNode = function isDomNode(value: unknown): value is DomNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): DomNode | null {
    return isDomNode(value) ? value : null;
};

const normalizedFilename = function normalizedFilename(context: Rule.RuleContext): string {
    return context.filename.split("\\").join("/");
};

const isTestFile = function isTestFile(filename: string): boolean {
    return filename.includes(TEST_MARKER) && !filename.endsWith(".d.ts");
};

const isRuntimeOnly = function isRuntimeOnly(specifier: string): boolean {
    if (RUNTIME_ONLY_EXACT.has(specifier)) {
        return true;
    }
    for (const prefix of RUNTIME_ONLY_PREFIXES) {
        if (specifier.startsWith(prefix)) {
            return true;
        }
    }
    return false;
};

const specifierOf = function specifierOf(node: DomNode | null): string | null {
    const source = node?.source;
    return source?.type === "Literal" && typeof source.value === "string" ? source.value : null;
};

const callSpecifier = function callSpecifier(call: DomNode): string | null {
    const first = call.arguments?.[0];
    return first?.type === "Literal" && typeof first.value === "string" ? first.value : null;
};

const isRequireCall = function isRequireCall(call: DomNode): boolean {
    return call.callee?.type === "Identifier" && call.callee.name === "require";
};

const isImportExpression = function isImportExpression(call: DomNode): boolean {
    return call.callee?.type === "Import";
};

const suiteName = function suiteName(callee: DomNode | undefined): string | null {
    if (callee?.type === "Identifier" && typeof callee.name === "string") {
        return callee.name;
    }
    if (
        callee?.type === "MemberExpression" &&
        callee.object?.type === "Identifier" &&
        typeof callee.object.name === "string"
    ) {
        return callee.object.name;
    }
    return null;
};

const countSubject = function countSubject(state: FileState, specifier: string | null): void {
    if (specifier !== null && !isRuntimeOnly(specifier)) {
        state.subjectImports += 1;
    }
};

const handleCall = function handleCall(state: FileState, call: DomNode): void {
    if (isRequireCall(call) || isImportExpression(call)) {
        countSubject(state, callSpecifier(call));
        return;
    }
    const name = suiteName(call.callee);
    if (name !== null && SUITE_NAMES.has(name)) {
        state.testStructure = true;
    }
};

const onImport = function onImport(state: FileState, node: Rule.Node): void {
    countSubject(state, specifierOf(asNode(node)));
};

const onCall = function onCall(state: FileState, node: Rule.Node): void {
    const call = asNode(node);
    if (call !== null) {
        handleCall(state, call);
    }
};

const onProgramExit = function onProgramExit(state: FileState, context: Rule.RuleContext, node: Rule.Node): void {
    if (state.testStructure && state.subjectImports === 0) {
        context.report({ messageId: "subjectless", node });
    }
};

const buildHandlers = function buildHandlers(
    state: FileState,
    context: Rule.RuleContext,
): [string, (node: Rule.Node) => void][] {
    const callHandler = (node: Rule.Node): void => {
        onCall(state, node);
    };
    const importHandler = (node: Rule.Node): void => {
        onImport(state, node);
    };
    const exitHandler = (node: Rule.Node): void => {
        onProgramExit(state, context, node);
    };
    return [
        ["CallExpression", callHandler],
        ["ImportDeclaration", importHandler],
        ["ImportExpression", importHandler],
        ["Program:exit", exitHandler],
    ];
};

const rule: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!isTestFile(normalizedFilename(context))) {
            return {};
        }
        const state: FileState = { subjectImports: 0, testStructure: false };
        return Object.fromEntries(buildHandlers(state, context));
    },
    meta: {
        docs: {
            description:
                "A test file that declares suites or cases must import the module it exercises. Imports that resolve only to test-runtime modules do not count as a subject.",
        },
        messages: { subjectless: SUBJECTLESS_MESSAGE },
        schema: [],
        type: "problem",
    },
};

export default { plugins: { "govlab-test": { rules: { "no-test-without-subject": rule } } }, tool: "eslint" };
