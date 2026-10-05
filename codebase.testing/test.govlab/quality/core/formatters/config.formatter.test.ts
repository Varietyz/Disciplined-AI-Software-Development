import { describe, expect, it } from "vitest";
import type { ConfigValue } from "@govlab/quality/types/emitter.types.ts";
import { serializeIni } from "@govlab/quality/core/formatters/config.ini.formatter.ts";
import { serializeJsRecord } from "@govlab/quality/core/formatters/config.formatter.ts";
import { serializeToml } from "@govlab/quality/core/formatters/config.toml.formatter.ts";
import { serializeXml } from "@govlab/quality/core/formatters/config.xml.formatter.ts";
import { serializeYaml } from "@govlab/quality/core/formatters/config.yaml.formatter.ts";

const nl = (lines: string[]): string => `${lines.join("\n")}\n`;

const TEN = 10;
const HUNDRED = 100;
const FIVE = 5;

const r = function r(entries: [string, ConfigValue][]): Record<string, ConfigValue> {
    return Object.fromEntries(entries);
};

describe("serializeYaml (golangci shape)", () => {
    it("renders nested maps + scalar arrays", () => {
        const tree: ConfigValue = {
            linters: { enable: ["gocyclo", "cyclop"] },
            ...r([["linters-settings", { gocyclo: r([["min-complexity", TEN]]) }]]),
        };
        expect(serializeYaml(tree)).toBe(
            nl([
                "linters:",
                "  enable:",
                "    - gocyclo",
                "    - cyclop",
                "linters-settings:",
                "  gocyclo:",
                "    min-complexity: 10",
            ]),
        );
    });

    it("quotes strings that would otherwise parse as non-strings and renders booleans", () => {
        const tree: ConfigValue = {
            note: "yes",
            ...r([
                [
                    "Metrics/CyclomaticComplexity",
                    r([
                        ["Enabled", true],
                        ["Max", TEN],
                    ]),
                ],
            ]),
        };
        expect(serializeYaml(tree)).toBe(
            nl(['note: "yes"', "Metrics/CyclomaticComplexity:", "  Enabled: true", "  Max: 10"]),
        );
    });
});

describe("serializeToml (ruff shape)", () => {
    it("renders top-level scalars, tables, nested tables, and arrays", () => {
        const tree: ConfigValue = {
            lint: { mccabe: r([["max-complexity", TEN]]), select: ["E", "C90"] },
            ...r([["line-length", HUNDRED]]),
        };
        expect(serializeToml(tree)).toBe(
            nl([
                "line-length = 100",
                "",
                "[lint]",
                'select = ["E", "C90"]',
                "",
                "[lint.mccabe]",
                "max-complexity = 10",
            ]),
        );
    });
});

describe("serializeIni (pylint shape)", () => {
    it("renders sections + comma-joined array values", () => {
        const tree: ConfigValue = {
            DESIGN: r([["max-args", FIVE]]),
            ...r([["MESSAGES CONTROL", { disable: ["C0114", "C0115"] }]]),
        };
        expect(serializeIni(tree)).toBe(
            nl(["[DESIGN]", "max-args=5", "", "[MESSAGES CONTROL]", "disable=C0114,C0115"]),
        );
    });
});

describe("serializeJsRecord (eslint shape)", () => {
    it("renders a JSON config with rule entries", () => {
        const tree: ConfigValue = {
            rules: { complexity: ["error", { max: 10 }], ...r([["no-unused-vars", "error"]]) },
        };
        expect(serializeJsRecord(tree)).toBe(
            nl([
                "{",
                '    "rules": {',
                '        "complexity": [',
                '            "error",',
                "            {",
                '                "max": 10',
                "            }",
                "        ],",
                '        "no-unused-vars": "error"',
                "    }",
                "}",
            ]),
        );
    });
});

describe("serializeXml (pmd ruleset shape)", () => {
    it("renders a ruleset with a rule ref and properties, escaping attrs", () => {
        const root = {
            attrs: { name: "govlab" },
            children: [
                {
                    attrs: { ref: "category/java/design.xml/CyclomaticComplexity" },
                    children: [
                        {
                            children: [{ attrs: { name: "reportLevel", value: "10" }, tag: "property" }],
                            tag: "properties",
                        },
                    ],
                    tag: "rule",
                },
            ],
            tag: "ruleset",
        };
        expect(serializeXml(root)).toBe(
            nl([
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<ruleset name="govlab">',
                '  <rule ref="category/java/design.xml/CyclomaticComplexity">',
                "    <properties>",
                '      <property name="reportLevel" value="10"/>',
                "    </properties>",
                "  </rule>",
                "</ruleset>",
            ]),
        );
    });
});
