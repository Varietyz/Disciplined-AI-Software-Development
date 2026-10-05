import type { EmitDescriptor, EmitFile, EmitTokens } from "@govlab/quality/types/emitter.types.ts";
import { beforeAll, describe, expect, it } from "vitest";
import { emitConfigs, emitToolConfig } from "@govlab/quality/core/emitters/tool.emitter.ts";
import { loadDescriptors, loadEmitTokens, loadFormatters } from "@govlab/quality/core/loaders/emitter.loader.ts";
import type { ToolResolution } from "@govlab/quality/types/plan.types.ts";

const TOOL = "golangci-lint";
const CONCEPT = "cyclomatic-complexity";

const GOLANGCI: EmitDescriptor = {
    configTarget: ".golangci.yml",
    format: "yaml",
    idiom: "central",
    ignoreContainer: "linters.disable",
    preamble: { version: "2" },
    selectContainer: "linters.enable",
    settingsContainer: "linters.settings",
    tool: TOOL,
};

const TOKENS: EmitTokens = Object.fromEntries([
    [
        TOOL,
        Object.fromEntries<EmitTokens[string][string]>([
            [CONCEPT, { knob: "gocyclo.min-complexity", ruleIds: ["cyclop", "gocyclo"] }],
            ["format-string", { knob: "enabled+severity", ruleIds: ["goprintffuncname"] }],
        ]),
    ],
]);

const V2 = 2;
const V5 = 5;
const V7 = 7;
const V10 = 10;
const V12 = 12;
const V80 = 80;

const res = function res(over: Partial<ToolResolution>): ToolResolution {
    return { disabledSurfaces: [], enabledIntents: [], knobs: {}, ...over };
};

const knob = function knob(id: string, value: number): Record<string, unknown> {
    return Object.fromEntries([[id, value]]);
};

const oneTool = function oneTool(tool: string, resolution: ToolResolution): Record<string, ToolResolution> {
    return Object.fromEntries([[tool, resolution]]);
};

beforeAll(async () => {
    await loadFormatters();
});

describe("emitToolConfig — central idiom (golangci)", () => {
    it("places the resolved threshold at its native path and enables the concept's linters", () => {
        const file = emitToolConfig({
            descriptor: GOLANGCI,
            resolution: res({ knobs: knob(CONCEPT, V10) }),
            surfaceMap: new Map(),
            tokens: TOKENS,
            tool: TOOL,
        });
        expect(file.path).toBe(".golangci.yml");
        expect(file.content).toBe(
            [
                'version: "2"',
                "linters:",
                "  enable:",
                "    - cyclop",
                "    - gocyclo",
                "  settings:",
                "    gocyclo:",
                "      min-complexity: 10",
                "",
            ].join("\n"),
        );
    });

    it("enables the native rule ids for an enabled rule-intent concept", () => {
        const file = emitToolConfig({
            descriptor: GOLANGCI,
            resolution: res({ enabledIntents: ["format-string"] }),
            surfaceMap: new Map(),
            tokens: TOKENS,
            tool: TOOL,
        });
        expect(file.content).toContain("- goprintffuncname");
    });

    it("emits the tool's rule ids for an ownership-disabled surface to the ignore container", () => {
        const file = emitToolConfig({
            descriptor: GOLANGCI,
            resolution: res({ disabledSurfaces: ["layout"] }),
            surfaceMap: new Map([["layout", ["format-string"]]]),
            tokens: TOKENS,
            tool: TOOL,
        });
        expect(file.content).toBe(['version: "2"', "linters:", "  disable:", "    - goprintffuncname", ""].join("\n"));
    });
});

describe("emitConfigs — real bundled descriptors + tokens", () => {
    const descriptors = loadDescriptors();
    const tokens = loadEmitTokens();
    const emit = async (perTool: Record<string, ToolResolution>): Promise<EmitFile[]> =>
        emitConfigs(perTool, { descriptorFile: descriptors, tokens });
    const emitted = async (perTool: Record<string, ToolResolution>, path: string): Promise<EmitFile | undefined> =>
        (await emit(perTool)).find((file) => file.path === path);

    it("golangci (yaml central): resolved threshold + owning linter", async () => {
        const resolution = res({ knobs: knob(CONCEPT, V12) });
        const file = await emitted(oneTool(TOOL, resolution), ".golangci.yml");
        expect(file?.content).toContain("min-complexity: 12");
        expect(file?.content).toContain("- gocyclo");
    });

    it("ruff (toml central, self-pathed knob): setting + select code", async () => {
        const file = await emitted({ ruff: res({ knobs: knob(CONCEPT, V10) }) }, "ruff.toml");
        expect(file?.content).toContain("[lint.mccabe]");
        expect(file?.content).toContain("max-complexity = 10");
        expect(file?.content).toContain('"C901"');
    });

    it("clippy (toml central, top-level knob, no select)", async () => {
        const file = await emitted({ clippy: res({ knobs: knob("long-function", V80) }) }, "clippy.toml");
        expect(file?.content).toContain("too-many-lines-threshold = 80");
    });

    it("rubocop (yaml per-rule): a cop block with Enabled + the resolved knob", async () => {
        const file = await emitted({ rubocop: res({ knobs: knob(CONCEPT, V7) }) }, ".rubocop.yml");
        expect(file?.content).toContain("Metrics/CyclomaticComplexity:");
        expect(file?.content).toContain("Enabled: true");
        expect(file?.content).toContain("Max: 7");
    });

    it("perlcritic (ini per-rule, no enable key): a policy section with the resolved knob", async () => {
        const file = await emitted({ perlcritic: res({ knobs: knob("too-many-params", V5) }) }, ".perlcriticrc");
        expect(file?.content).toContain("[Subroutines::ProhibitManyArgs]");
        expect(file?.content).toContain("max_arguments=5");
        expect(file?.content).not.toContain("Enabled");
    });

    it("pylint (ini central, per-knob section): the knob under its real section", async () => {
        const file = await emitted({ pylint: res({ knobs: knob("too-many-params", 1) }) }, ".pylintrc");
        expect(file?.content).toContain("[DESIGN]");
        expect(file?.content).toContain("max-args=1");
    });

    it("yamllint (rules-container): the knob attaches to the owner rule under the container", async () => {
        const file = await emitted({ yamllint: res({ knobs: { indentation: 4 } }) }, ".yamllint");
        expect(file?.content).toBe(["rules:", "  indentation:", "    spaces: 4", ""].join("\n"));
    });

    it("checkstyle (xml ruleset): Checker>TreeWalker>module + property, with the required DOCTYPE", async () => {
        const file = await emitted({ checkstyle: res({ knobs: knob(CONCEPT, 1) }) }, "checkstyle.xml");
        expect(file?.content).toContain("<!DOCTYPE module PUBLIC");
        expect(file?.content).toContain('<module name="Checker">');
        expect(file?.content).toContain('<module name="TreeWalker">');
        expect(file?.content).toContain("CyclomaticComplexityCheck");
        expect(file?.content).toContain('<property name="max" value="1"/>');
    });

    it("pmd (xml ruleset): category-qualified ref + wrapped properties + description", async () => {
        const file = await emitted({ pmd: res({ knobs: knob(CONCEPT, 1) }) }, "pmd-ruleset.xml");
        expect(file?.content).toContain('<ruleset name="govlab"');
        expect(file?.content).toContain("<description>GovLab SSOT-emitted ruleset</description>");
        expect(file?.content).toContain('<rule ref="category/java/design.xml/CyclomaticComplexity">');
        expect(file?.content).toContain('<property name="methodReportLevel" value="1"/>');
    });

    it("phpmd (xml ruleset): codesize ref + phpmd xmlns", async () => {
        const file = await emitted({ phpmd: res({ knobs: knob(CONCEPT, 1) }) }, "phpmd.xml");
        expect(file?.content).toContain('xmlns="http://pmd.sf.net/ruleset/1.0.0"');
        expect(file?.content).toContain('<rule ref="rulesets/codesize.xml/CyclomaticComplexity">');
        expect(file?.content).toContain('<property name="reportLevel" value="1"/>');
    });

    it("prettier (js-record central): the resolved indentation lands on tabWidth", async () => {
        const file = await emitted({ prettier: res({ knobs: { indentation: 4 } }) }, ".prettierrc");
        expect(file?.content).toContain('"tabWidth": 4');
    });

    it("revive (toml rules-container, positional args): value wrapped as an arguments array", async () => {
        const file = await emitted({ revive: res({ knobs: knob(CONCEPT, V2) }) }, "revive.toml");
        expect(file?.content).toContain("[rule.cognitive-complexity]");
        expect(file?.content).toContain("arguments = [2]");
    });

    it("swiftlint (yaml per-rule, compound knob split): threshold under the warning key", async () => {
        const file = await emitted({ swiftlint: res({ knobs: knob(CONCEPT, V2) }) }, ".swiftlint.yml");
        expect(file?.content).toContain("cyclomatic_complexity:");
        expect(file?.content).toContain("warning: 2");
        expect(file?.content).not.toContain("warning|error");
    });

    it("sqlfluff (ini central, colon knob-section): tab_space_size under [sqlfluff:indentation]", async () => {
        const file = await emitted({ sqlfluff: res({ knobs: { indentation: 8 } }) }, ".sqlfluff");
        expect(file?.content).toContain("[sqlfluff:indentation]");
        expect(file?.content).toContain("tab_space_size=8");
    });

    it("skips a tool with no descriptor", async () => {
        const files = await emit(oneTool("some-unmapped-tool", res({})));
        expect(files.find((file) => file.path.includes("some-unmapped"))).toBeUndefined();
    });

    it("reports an unmapped tool through the onSkip callback instead of silently dropping it", async () => {
        const skipped: string[] = [];
        await emitConfigs(oneTool("some-unmapped-tool", res({})), {
            descriptorFile: descriptors,
            onSkip: (tool) => {
                skipped.push(tool);
            },
            tokens,
        });
        expect(skipped).toEqual(["some-unmapped-tool"]);
    });
});
