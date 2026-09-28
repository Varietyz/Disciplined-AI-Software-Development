import type { BoardContract } from "../types/board.types.ts";

const AGENT_ANCHOR = "Agent <";

const GATE_ANCHOR = "Gate ";

const PLACEHOLDER = "<";

const EMPTY = "—";

const fieldKey = function fieldKey(raw: string): string | null {
    const line = raw.trim();
    const colon = line.indexOf(":");
    const key = colon <= 0 ? "" : line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    const placeholder = value.startsWith(PLACEHOLDER) || value.startsWith(EMPTY);
    return key.length === 0 || key.includes(" ") || !placeholder ? null : key;
};

const fieldsAfter = function fieldsAfter(lines: readonly string[], from: number): string[] {
    const keys = lines.slice(from).map(fieldKey);
    const end = keys.indexOf(null);
    return (end === -1 ? keys : keys.slice(0, end)).filter((key): key is string => key !== null);
};

const firstFields = function firstFields(lines: readonly string[], anchor: string): string[] {
    return (
        lines
            .map((line, index) => (line.trim().startsWith(anchor) ? fieldsAfter(lines, index + 1) : []))
            .find((fields) => fields.length > 0) ?? []
    );
};

export const readBoardContract = function readBoardContract(template: string): BoardContract {
    const lines = template.split("\n");
    return { agentFields: firstFields(lines, AGENT_ANCHOR), gateFields: firstFields(lines, GATE_ANCHOR) };
};
