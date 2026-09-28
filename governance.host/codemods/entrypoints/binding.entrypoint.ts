import { CODEMOD_TSCONFIGS, programFor, repoSourceFiles } from "../selectors/program.selector.ts";
import { collectOverrides, scanSourceFile } from "../analyzers/binding.analyzer.ts";
import type { BindingFinding } from "../../types/analyzer.types.ts";
import type { Edit } from "../../types/codemod.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { defineCheck } from "@govlab/context/check";
import ts from "typescript";

const RULE_ID = "callable-field-impl";

const ACCESS_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
    ts.SyntaxKind.PublicKeyword,
    ts.SyntaxKind.PrivateKeyword,
    ts.SyntaxKind.ProtectedKeyword,
]);

const scanProgram = function scanProgram(tsconfigPath: string): BindingFinding[] {
    const program = programFor(tsconfigPath);
    const checker = program.getTypeChecker();
    const files = repoSourceFiles(program);
    const overrides = collectOverrides(checker, files);
    return files.flatMap((sourceFile) => scanSourceFile(checker, sourceFile, overrides));
};

const boundPropertyText = function boundPropertyText(method: ts.MethodDeclaration): string {
    const modifiers = method.modifiers ?? [];
    const access = modifiers.find((modifier) => ACCESS_KINDS.has(modifier.kind));
    const overrideText = modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.OverrideKeyword)
        ? "override "
        : "";
    const accessPrefix = access ? `${access.getText()} ` : "";
    const accessText = `${accessPrefix}${overrideText}`;
    const asyncText = modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword) ? "async " : "";
    const typeParams = method.typeParameters
        ? `<${method.typeParameters.map((param) => param.getText()).join(", ")}>`
        : "";
    const params = method.parameters.map((param) => param.getText()).join(", ");
    const returnType = method.type ? `: ${method.type.getText()}` : "";
    const body = method.body ? method.body.getText() : "{}";
    return `${accessText}${method.name.getText()} = ${asyncText}${typeParams}(${params})${returnType} => ${body};`;
};

const buildEdits = function buildEdits(findings: readonly BindingFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    const seenMethod = new Set<string>();
    for (const finding of findings) {
        const key = `${finding.fileName}:${String(finding.start)}`;
        if (seenMethod.has(key)) {
            continue;
        }
        seenMethod.add(key);
        const edit: Edit = { end: finding.end, replacement: boundPropertyText(finding.method), start: finding.start };
        byFile.set(finding.fileName, [...(byFile.get(finding.fileName) ?? []), edit]);
    }
    return byFile;
};

const collect = function collect(): BindingFinding[] {
    const seen = new Set<string>();
    const findings: BindingFinding[] = [];
    for (const tsconfig of CODEMOD_TSCONFIGS) {
        for (const finding of scanProgram(tsconfig)) {
            const key = `${finding.file}:${String(finding.start)}`;
            if (!seen.has(key)) {
                seen.add(key);
                findings.push(finding);
            }
        }
    }
    return findings;
};

applyCodemod({
    appliedNoun: "implementation(s) bound to arrow properties",
    blockedMessage: (finding) =>
        `interface '${finding.iface}' declares '${finding.member}' as a callable-property field, but this class implements it as a method — a method loses its 'this' binding the moment the member is read as a value and passed detached into a callback slot, invoking it with the wrong receiver. This member cannot be auto-bound (${finding.reason}); implement it as a bound arrow property by hand, or give the declaring interface a method signature if the member is only ever called attached.`,
    checks: defineCheck({ detects: [], enforces: ["architecture:explicit-contracts"] }),
    editsByFile: buildEdits,
    findings: collect(),
    gateOnBlocked: true,
    label: (finding) => `${finding.iface}.${finding.member}`,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
