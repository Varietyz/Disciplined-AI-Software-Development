import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { circularDependency } from "#configuration/strings/tool.strings";
import { jsonArray } from "#core/parsers/record.parser";

const TOOL = "madge";
const CHAIN_SEPARATOR = " → ";

const isCycle = function isCycle(cycle: unknown): cycle is string[] {
    return Array.isArray(cycle) && cycle.length > 0 && typeof cycle[0] === "string";
};

export const parseMadgeOutput = function parseMadgeOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonArray(stdout || "[]")
        .filter(isCycle)
        .map((cycle) =>
            advisoryFinding({
                column: POSITION,
                ecosystem,
                file: cycle[0] ?? "",
                line: POSITION,
                message: circularDependency([...cycle, cycle[0]].join(CHAIN_SEPARATOR)),
                ruleId: "circular-dependency",
                tool: TOOL,
            }),
        );
};
