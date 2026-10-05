import {
    circularDependency,
    commandHint,
    credoIncomplete,
    dependencyEdge,
    dryRunFixes,
    duplicatedBlock,
    electedMissing,
    incompleteScan,
    installHint,
    lintrFailed,
    missingDependency,
    missingFlagValue,
    notInstalledOutput,
    outsideWorkspace,
    pmdRecoverable,
    prettierFailed,
    runSummary,
    scalastyleIncomplete,
    semgrepFailed,
    signalDeathMessage,
    spawnErrorMessage,
    toolErrorBecause,
    toolErrorMessage,
    unimportedExport,
    unknownConcern,
    unknownFlag,
    unknownReporter,
    unusedDependency,
    unusedItem,
} from "@govlab/quality/configuration/strings/tool.strings.ts";
import { describe, expect, it } from "vitest";

const STATUS = 2;

describe("install and command hints", () => {
    it("names the missing tool and how to provide it", () => {
        expect(installHint("ruff")).toContain("govlab install python");
        expect(installHint("unknown-tool")).toBe(notInstalledOutput("unknown-tool"));
        expect(commandHint("bandit", "python")).toContain("bandit.command");
        expect(commandHint("slither", "slither")).toContain("could not run");
        expect(electedMissing("pylint")).toContain("quality.owners");
    });
});

describe("tool failure messages", () => {
    it("carries the tool, the exit status and the detail", () => {
        expect(spawnErrorMessage("ruff", "ENOENT")).toContain("ENOENT");
        expect(toolErrorMessage("ruff", STATUS, "bad")).toContain("exit 2");
        expect(toolErrorBecause("phpmd", STATUS, "a bad ruleset", "bad")).toContain("a bad ruleset");
        expect(incompleteScan("kics", "a missing query library", "bad")).toContain("could not complete a scan");
        expect(credoIncomplete(STATUS, "bad")).toContain("mix credo");
        expect(scalastyleIncomplete("bad")).toContain("Processed");
        expect(semgrepFailed(STATUS, "bad")).toContain("ruleset");
        expect(lintrFailed(STATUS, "bad")).toContain("Rscript");
        expect(pmdRecoverable(STATUS)).toContain("recoverable");
        expect(signalDeathMessage("knip", "SIGKILL")).toContain("SIGKILL");
        expect(prettierFailed(STATUS)).toContain("prettier");
    });
});

describe("finding messages", () => {
    it("names the offending item", () => {
        expect(unusedItem("export", "x")).toBe("Unused export: x");
        expect(duplicatedBlock("a.ts", STATUS)).toContain("a.ts:2");
        expect(unusedDependency("dep", "package.json")).toContain("never used");
        expect(missingDependency("dep", "package.json")).toContain("not declared");
        expect(dependencyEdge("a", "b")).toBe("a → b");
        expect(circularDependency("a → b → a")).toContain("Circular");
        expect(unimportedExport("x")).toContain("never imported");
    });
});

describe("run and command-line messages", () => {
    it("reports counts and refuses malformed input", () => {
        expect(dryRunFixes(1, "  a.ts")).toContain("would be fixed");
        expect(outsideWorkspace("/x/a.ts", "/repo")).toContain("outside the workspace root");
        expect(runSummary(1, 0, 0, 0)).toBe("1 error(s), 0 advisory, 0 notice(s), 0 fixed");
        expect(missingFlagValue("--config")).toContain("needs a value");
        expect(unknownReporter("xml", "human, json")).toContain("xml");
        expect(unknownFlag("--fast")).toContain("--fast");
        expect(unknownConcern("lints", "lint")).toContain("lints");
    });
});
