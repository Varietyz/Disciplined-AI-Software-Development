import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { surfacePath, surfacePrefix, surfaceRoot } from "../../../config/surface.config.ts";
import type { Finding } from "../types/segment.types.ts";
import { leadingInteger } from "../predicates/text.predicate.ts";
import { runTool } from "../runners/process.runner.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

export const KINDS: readonly string[] = ["typecheck/diagnostic", "typecheck/unavailable", "typecheck/unparsed"];

const COMMAND = "npm";

const ARGS = ["run", "--silent", "typecheck"];

const within = function within(path: string): string {
    const prefix = surfacePrefix();
    return prefix.length === 0 ? path : `${prefix}/${path}`;
};

const parseDiagnostic = function parseDiagnostic(line: string): Finding | null {
    const open = line.indexOf("(");
    const close = line.indexOf(")", open);
    if (open <= 0 || close <= open) {
        return null;
    }

    const marker = line.indexOf("): error ");
    if (marker !== close) {
        return null;
    }

    const path = line.slice(0, open);
    const position = line.slice(open + 1, close);
    const comma = position.indexOf(",");
    const lineNumber = leadingInteger(comma === -1 ? position : position.slice(0, comma));
    const message = line.slice(marker + 9);

    const colon = message.indexOf(":");
    const code = colon === -1 ? "" : message.slice(0, colon);

    return {
        actual: colon === -1 ? message : message.slice(colon + 1).trim(),
        expected: null,
        healed: false,
        line: Number.isNaN(lineNumber) ? 0 : lineNumber,
        locus: code.length > 0 ? code : "type",
        path: within(path),
        remediation: {
            action: "none",
            decide: "the compiler states the mismatch; correct the type or the value so the two agree, never by widening to any",
            deterministic: false,
            from: path,
            target: within(path),
            to: null,
        },
        rule: "typecheck/diagnostic",
        stack: [
            { check: "compiler", resolved: "tsc --noEmit" },
            { check: "diagnostic", resolved: code },
        ],
    };
};

interface TypecheckResult {
    readonly findings: readonly Finding[];
    readonly ran: boolean;
}

const INVARIANT = "the gate sources compile under the project's strict configuration";

const PROJECT = `${surfacePath("pipeline")}/tsconfig.json`;

const PROJECTS = [PROJECT];

export const typecheckStage = function typecheckStage(options: StepOptions): StepOutcome {
    if (options.bypass.includes("typecheck")) {
        return {
            findings: [],
            stage: { bypassed: true, findings: 0, healed: 0, invariant: INVARIANT, rule: "typecheck", stage: "meta" },
        };
    }

    const result = runTypecheck();

    writeRuleReport(options.repoRoot, "typecheck", {
        authoritative: options.authoritative,
        derivations: { compilerProjectsWalked: [...PROJECTS], ran: result.ran },
        findings: result.findings,
        healed: [],
        invariant: INVARIANT,
        rule: "typecheck",
        scanned: PROJECTS.length,
        scope: options.scope,
        stage: "meta",
        verdict: result.findings.length === 0 ? "pass" : "fail",
    });

    return {
        findings: result.findings,
        stage: {
            bypassed: false,
            findings: result.findings.length,
            healed: 0,
            invariant: INVARIANT,
            rule: "typecheck",
            stage: "meta",
        },
    };
};

export const runTypecheck = function runTypecheck(): TypecheckResult {
    const result = runTool(surfaceRoot(), "typecheck", COMMAND, INVARIANT, ARGS);

    if (result.exitCode === -1) {
        return {
            findings: [
                {
                    actual: "the type checker could not be launched",
                    expected: null,
                    healed: false,
                    line: 0,
                    locus: "scripts.typecheck",
                    path: "package.json",
                    remediation: {
                        action: "none",
                        decide: "a gate that cannot run is a failure, never a skip — restore the script before trusting the run",
                        deterministic: false,
                        from: "typecheck",
                        target: "package.json",
                        to: null,
                    },
                    rule: "typecheck/unavailable",
                    stack: [{ check: "process", resolved: result.output }],
                },
            ],
            ran: false,
        };
    }

    const findings: Finding[] = [];
    const { output } = result;

    for (const line of output.split("\n")) {
        const finding = parseDiagnostic(line.trim());
        if (finding !== null) {
            findings.push(finding);
        }
    }

    if (findings.length === 0 && result.exitCode !== 0) {
        findings.push({
            actual: output.trim().slice(0, 400),
            expected: null,
            healed: false,
            line: 0,
            locus: "tsc",
            path: PROJECT,
            remediation: {
                action: "none",
                decide: "the compiler failed without a recognizable diagnostic — read the output directly",
                deterministic: false,
                from: "tsc",
                target: PROJECT,
                to: null,
            },
            rule: "typecheck/unparsed",
            stack: [{ check: "exit", resolved: String(result.exitCode) }],
        });
    }

    return { findings, ran: true };
};
