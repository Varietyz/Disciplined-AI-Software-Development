import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { isResolved, projectRoot, slot, slotList, slotText, surfacePrefix } from "../../../config/surface.config.ts";
import type { Finding } from "../types/segment.types.ts";
import { leadingInteger } from "../predicates/text.predicate.ts";
import { runTool } from "../runners/process.runner.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

const INVARIANT =
    "where the consumer declares a quality toolchain, the pipeline runs it as one stage rather than leaving a second chain to be remembered";

const STAGE = "meta";

const RULE = "quality";

export const declaredKinds = function declaredKinds(): string[] {
    return [`${RULE}/notDeclared`, ...slotList("execution", "quality_concerns").map((concern) => `${RULE}/${concern}`)];
};

const commandParts = function commandParts(): { readonly command: string; readonly leading: readonly string[] } {
    const declared = slotText("execution", "quality_command").split(" ");
    const command = declared[0] ?? "";
    return { command, leading: declared.slice(1) };
};

const absenceFinding = function absenceFinding(reason: string, locus: string): Finding {
    return {
        actual: reason,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path: "config/surface.config.ts",
        remediation: {
            action: "declare",
            decide: "a consumer whose toolchain performs these checks declares the command and elects the concerns, and the stage then runs inside the one pipeline. A consumer with no such toolchain leaves it ABSENT and the stage does not exist — which is reported rather than passed, because a green over a check nobody ran is the state this package refuses to produce",
            deterministic: false,
            from: locus,
            target: "config/surface.config.ts",
            to: null,
        },
        rule: `${RULE}/notDeclared`,
        stack: [
            { check: "slot", resolved: slot("execution", "quality_command").state },
            { check: "concerns", resolved: String(slotList("execution", "quality_concerns").length) },
        ],
    };
};

const scanFinding = function scanFinding(line: string, concern: string): Finding | null {
    const open = line.indexOf(":");
    if (open <= 0) {
        return null;
    }

    const path = line.slice(0, open);
    if (!path.includes("/") && !path.includes("\\")) {
        return null;
    }

    const rest = line.slice(open + 1);
    const nextColon = rest.indexOf(":");
    const lineNumber = leadingInteger(nextColon === -1 ? rest : rest.slice(0, nextColon));

    return {
        actual: line.trim(),
        expected: null,
        healed: false,
        line: Number.isNaN(lineNumber) ? 0 : lineNumber,
        locus: concern,
        path,
        remediation: {
            action: "none",
            decide: "a finding arriving from outside carries premises this package may not share, so it is TRIAGED before it is satisfied — one resting on a false premise is deleted rather than answered, and one naming a real defect is repaired here rather than by the tool that found it",
            deterministic: false,
            from: concern,
            target: path,
            to: null,
        },
        rule: `${RULE}/${concern}`,
        stack: [{ check: "toolchain", resolved: concern }],
    };
};

const concernFindings = function concernFindings(concern: string): Finding[] {
    const { command, leading } = commandParts();
    const result = runTool(projectRoot(), `${RULE}:${concern}`, command, INVARIANT, [
        ...leading,
        concern,
        surfacePrefix(),
    ]);

    if (result.exitCode === -1) {
        return [absenceFinding(`the declared toolchain could not be launched — ${result.output}`, concern)];
    }

    return result.output.split("\n").flatMap((line) => {
        const finding = scanFinding(line.trim(), concern);
        return finding === null ? [] : [finding];
    });
};

const qualityFindings = function qualityFindings(concerns: readonly string[]): Finding[] {
    if (!isResolved("execution", "quality_command")) {
        return [absenceFinding("no quality toolchain is declared, so no external check runs", "quality_command")];
    }

    if (concerns.length === 0) {
        return [
            absenceFinding("a toolchain is declared and no concern is elected, so it runs nothing", "quality_concerns"),
        ];
    }

    return concerns.flatMap(concernFindings);
};

export const qualityStage = function qualityStage(options: StepOptions): StepOutcome {
    if (options.bypass.includes(RULE)) {
        return {
            findings: [],
            stage: { bypassed: true, findings: 0, healed: 0, invariant: INVARIANT, rule: RULE, stage: STAGE },
        };
    }

    const concerns = slotList("execution", "quality_concerns");
    const findings = qualityFindings(concerns);
    const declaredOnly = findings.every((entry) => entry.rule === `${RULE}/notDeclared`);

    writeRuleReport(options.repoRoot, RULE, {
        authoritative: options.authoritative,
        derivations: {
            bound: "the population of this step is the CONCERNS a consumer elects, never the files a run hands it — the toolchain is the consumer's and it decides its own scope, so a handed file count inherited from the pipeline asserts nothing this step measured. An empty reached set with the command ABSENT is the slot being honored rather than a scope that stopped reaching, and stating it is what separates the two",
            commandState: slot("execution", "quality_command").state,
            concernsElected: [...concerns],
        },
        findings,
        healed: [],
        invariant: INVARIANT,
        rule: RULE,
        scanned: options.scanned,
        scope: options.scope,
        stage: STAGE,
        verdict: declaredOnly ? "pass" : "fail",
    });

    return {
        findings: declaredOnly ? [] : findings,
        stage: {
            bypassed: false,
            findings: declaredOnly ? 0 : findings.length,
            healed: 0,
            invariant: INVARIANT,
            rule: RULE,
            stage: STAGE,
        },
    };
};
