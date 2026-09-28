import { contractContradicted, gateSummary, outcomeLine, unfixturedKind } from "../strings/gate.strings.ts";
import { mkdirSync, writeFileSync } from "node:fs";

import { GENERATED_DIR } from "../constants/path.constants.ts";
import { contradictedContracts } from "../validators/governance.validator.ts";
import { projectRoot } from "../../../config/surface.config.ts";
import { resolve } from "node:path";
import { runGates } from "../runners/gate.runner.ts";

const REPO_ROOT = projectRoot();

const REPORT = "gate.report.generated.json";

export const RESTATES: readonly string[] = ["gate_fires_before_it_is_trusted", "positive_control_precedes_trust"];

const main = async function main(): Promise<void> {
    const report = await runGates(REPO_ROOT);

    for (const outcome of [...report.outcomes, ...report.branches]) {
        if (outcome.state === "proven" || outcome.state === "exempt") {
            continue;
        }
        process.stdout.write(outcomeLine(outcome.state, outcome.rule, outcome.detail));
    }

    const reached = [...report.outcomes, ...report.branches].map((outcome) => outcome.rule);
    const derivations = {
        branchesExercised: report.branches.map((outcome) => outcome.rule),
        kindVerdictKeys: Object.keys(report.kindVerdicts),
        kindVerdictKeysFlat: Object.keys(report.kindVerdicts).filter((key) => !key.includes("/")),
        provenKinds: [...report.outcomes, ...report.branches]
            .filter((outcome) => outcome.state === "proven")
            .map((outcome) => `${outcome.rule}: ${outcome.detail}`),
        provenKindsNote:
            "PER-RULE PROSE and a SUMMARY, which is stated here because a reader joining an authored `rule/kind` " +
            "pairing against it would be parsing a sentence to decide a verdict. THE COMPOSITE-KEYED OPERAND IS " +
            "`kindVerdicts`, which carries every rule-and-kind pair with its own state and is what a pairing resolves " +
            "against — the outcome list collapses every kind of one rule into a single entry so its counts range over " +
            "RULES, and this array inherits that collapse. Two surfaces, two units, and only one of them answers a " +
            "question about a kind",
        reached,
        scanned: reached.length,
        skippedAsExemptByDerivation: report.outcomes
            .filter((outcome) => outcome.state === "exempt")
            .map((outcome) => `${outcome.rule}: ${outcome.detail}`),
        unfixturedKinds: report.unfixturedKinds,
    };

    const contradicted = contradictedContracts(derivations);
    if (contradicted.length > 0) {
        process.stdout.write(contractContradicted(contradicted));
        process.exit(2);
    }

    mkdirSync(resolve(REPO_ROOT, GENERATED_DIR), { recursive: true });
    writeFileSync(
        resolve(REPO_ROOT, GENERATED_DIR, REPORT),
        `${JSON.stringify({ scanned: reached.length, tool: "gate", ...report, derivations }, null, 4)}\n`,
        "utf8",
    );

    for (const kind of report.unfixturedKinds) {
        process.stdout.write(unfixturedKind(kind));
    }

    const open = report.failed + report.untested + report.unfixturedKinds.length + report.branchesOpen;
    const verdict = open > 0 ? "FAIL" : "PASS";
    const tally = {
        branchesOpen: report.branchesOpen,
        branchesProven: report.branchesProven,
        exempt: report.exempt,
        failed: report.failed,
        proven: report.proven,
        unfixtured: report.unfixturedKinds.length,
        untested: report.untested,
    };
    process.stdout.write(gateSummary(verdict, tally, `${GENERATED_DIR}/${REPORT}`));

    process.exit(open > 0 ? 1 : 0);
};

await main();
