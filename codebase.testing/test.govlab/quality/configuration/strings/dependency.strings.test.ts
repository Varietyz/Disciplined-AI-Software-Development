import {
    eslintPluginsLine,
    generatorsLine,
    installedLine,
    invalidRegistry,
    npmLine,
    planHeading,
    systemInstructionLine,
    systemToolsLine,
    unknownEcosystem,
} from "@govlab/quality/configuration/strings/dependency.strings.ts";
import { expect, test } from "vitest";

const COUNT = 2;

test("dependency strings carry the names and counts they are given", () => {
    expect(unknownEcosystem("cobol", "go, rust", "py")).toContain("cobol");
    expect(planHeading("go")).toContain("go");
    expect(npmLine(COUNT, "a, b")).toContain("(2)");
    expect(systemToolsLine("gosec")).toContain("gosec");
    expect(eslintPluginsLine("sonarjs")).toContain("sonarjs");
    expect(generatorsLine("ruff")).toContain("ruff");
    expect(installedLine(COUNT)).toContain("2 npm package(s)");
    expect(systemInstructionLine("brew install x")).toContain("brew install x");
    expect(invalidRegistry("registry.json")).toContain("registry.json");
});
