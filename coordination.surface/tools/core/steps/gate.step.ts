import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { existsSync, readFileSync } from "node:fs";

import { surfacePath, surfaceRoot } from "../../../config/surface.config.ts";
import type { Finding } from "../types/segment.types.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { isUnreadableJson } from "../predicates/file.predicate.ts";
import { proofRunEmpty } from "../strings/gate.strings.ts";
import { resolve } from "node:path";
import { runTool } from "../runners/process.runner.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

const COMMAND = "npm";

const ARGS = ["run", "--silent", "gates"];

const REPORT = "gate.report.generated.json";

const INVARIANT = "every registered rule is proven to fire on a violation and to accept a clean input";

const DECIDE =
    "a rule nobody has watched fail is indistinguishable from one that cannot fail, and a gate that scans " +
    "nothing passes; declare a fixture pair — one sample " +
    "the rule must report and one it must accept — so the proof is an artifact rather than a ritual repeated " +
    "from memory each time the rule is touched";

interface Outcome {
    readonly rule: string;
    readonly state: string;
    readonly detail: string;
}

const gateReportList = function gateReportList(repoRoot: string, key: string): unknown[] {
    const path = resolve(repoRoot, GENERATED_DIR, REPORT);
    if (!existsSync(path)) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
        const held = isObject(parsed) ? parsed[key] : null;
        return Array.isArray(held) ? held : [];
    } catch (error) {
        if (isUnreadableJson(error)) {
            return [];
        }
        throw error;
    }
};

const unfixturedFrom = function unfixturedFrom(repoRoot: string): string[] {
    return gateReportList(repoRoot, "unfixturedKinds").filter((kind): kind is string => typeof kind === "string");
};

const unfixturedFinding = function unfixturedFinding(kind: string): Finding {
    const rule = kind.slice(0, kind.indexOf("/"));

    return {
        actual: `${kind} is emitted and no fixture pair declares it`,
        expected: "a sample the kind must report and one it must accept, or a written exemption",
        healed: false,
        line: 0,
        locus: kind,
        path: `${surfacePath("rules")}/${rule}.rule.ts`,
        remediation: {
            action: "declare",
            decide:
                "a rule proven at RULE granularity says nothing about the kinds it can emit — a pair covering one " +
                "kind leaves every other kind of that rule unobserved, which is how a detector ships having only " +
                "ever been seen to stay quiet. Declare the pair, or declare the exemption with the reason a " +
                "synthetic sample cannot hold the construct",
            deterministic: false,
            from: kind,
            target: `${surfacePath("core")}/fixtures/gate.fixture.ts`,
            to: null,
        },
        rule: "gate/unfixturedKind",
        stack: [
            { check: "emitted", resolved: kind },
            { check: "fixturePair", resolved: "none declares this kind" },
        ],
    };
};

const isOutcome = function isOutcome(value: unknown): value is Outcome {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const candidate = value as { rule?: unknown; state?: unknown; detail?: unknown };
    return (
        typeof candidate.rule === "string" &&
        typeof candidate.state === "string" &&
        typeof candidate.detail === "string"
    );
};

const outcomesFrom = function outcomesFrom(repoRoot: string): Outcome[] {
    return gateReportList(repoRoot, "outcomes").filter(isOutcome);
};

const gateFinding = function gateFinding(outcome: Outcome): Finding {
    return {
        actual: outcome.detail,
        expected: "a fixture pair the rule fires on and accepts",
        healed: false,
        line: 0,
        locus: outcome.rule,
        path: `${surfacePath("rules")}/${outcome.rule}.rule.ts`,
        remediation: {
            action: "declare",
            decide: DECIDE,
            deterministic: false,
            from: outcome.rule,
            target: `${surfacePath("core")}/fixtures/gate.fixture.ts`,
            to: null,
        },
        rule: `gate/${outcome.state}`,
        stack: [
            { check: "fixturePair", resolved: outcome.state },
            { check: "detail", resolved: outcome.detail },
        ],
    };
};

export const KINDS: readonly string[] = ["gate/unfixturedKind", "gate/silent", "gate/noisy", "gate/untested"];

export const gateStage = function gateStage(options: StepOptions): StepOutcome {
    if (options.bypass.includes("gates")) {
        return {
            findings: [],
            stage: { bypassed: true, findings: 0, healed: 0, invariant: INVARIANT, rule: "gates", stage: "meta" },
        };
    }

    const run = runTool(surfaceRoot(), "gates", COMMAND, INVARIANT, ARGS);

    const outcomes = outcomesFrom(options.repoRoot);

    const findings =
        outcomes.length === 0
            ? [
                  gateFinding({
                      detail: proofRunEmpty(run.output.trim().slice(0, 300)),
                      rule: "gates",
                      state: "unproven",
                  }),
              ]
            : [
                  ...outcomes
                      .filter((outcome) => outcome.state !== "proven" && outcome.state !== "exempt")
                      .map(gateFinding),
                  ...unfixturedFrom(options.repoRoot).map(unfixturedFinding),
              ];

    writeRuleReport(options.repoRoot, "gates", {
        authoritative: options.authoritative,
        derivations: {
            provenKinds: outcomes
                .filter((outcome) => outcome.state === "proven")
                .map((outcome) => `${outcome.rule}: ${outcome.detail}`),
            reached: outcomes.map((outcome) => outcome.rule),
            skippedAsExemptByDerivation: outcomes
                .filter((outcome) => outcome.state === "exempt")
                .map((outcome) => `${outcome.rule}: ${outcome.detail}`),
            unfixturedKinds: unfixturedFrom(options.repoRoot),
        },
        findings,
        healed: [],
        invariant: INVARIANT,
        rule: "gates",
        scanned: outcomes.length,
        scope: options.scope,
        stage: "meta",
        verdict: findings.length === 0 ? "pass" : "fail",
    });

    return {
        findings,
        stage: {
            bypassed: false,
            findings: findings.length,
            healed: 0,
            invariant: INVARIANT,
            rule: "gates",
            stage: "meta",
        },
    };
};
