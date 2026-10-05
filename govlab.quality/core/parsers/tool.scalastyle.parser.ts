import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "scalastyle";
const FILE_MARKER = '<file name="';
const ERROR_MARKER = "<error ";
const QUOTE = '"';
const XML_ENTITIES: readonly (readonly [string, string])[] = [
    ["&quot;", '"'],
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&apos;", "'"],
    ["&amp;", "&"],
];

interface ScanState {
    currentFile: string;
    cursor: number;
}

interface ScanStep {
    finding: Finding | null;
    state: ScanState;
}

const unescapeXml = function unescapeXml(value: string): string {
    return XML_ENTITIES.reduce((text, [entity, char]) => text.split(entity).join(char), value);
};

const attr = function attr(tag: string, name: string): string {
    const key = `${name}="`;
    const from = tag.indexOf(key);
    const end = from === -1 ? -1 : tag.indexOf(QUOTE, from + key.length);
    return end === -1 ? "" : unescapeXml(tag.slice(from + key.length, end));
};

const errorFinding = function errorFinding(tag: string, currentFile: string, ecosystem: string): Finding {
    return toolFinding({
        column: Number(attr(tag, "column")) || POSITION,
        ecosystem,
        file: currentFile,
        line: Number(attr(tag, "line")) || POSITION,
        message: attr(tag, "message"),
        ruleId: attr(tag, "source") || TOOL,
        tool: TOOL,
    });
};

const fileStep = function fileStep(xml: string, fileIdx: number, state: ScanState): ScanStep {
    const start = fileIdx + FILE_MARKER.length;
    const end = xml.indexOf(QUOTE, start);
    return end === -1
        ? { finding: null, state: { ...state, cursor: start } }
        : { finding: null, state: { currentFile: unescapeXml(xml.slice(start, end)), cursor: end + 1 } };
};

const errorStep = function errorStep(xml: string, errIdx: number, state: ScanState, ecosystem: string): ScanStep {
    const tagEnd = xml.indexOf(">", errIdx);
    const stop = tagEnd === -1 ? xml.length : tagEnd;
    return {
        finding: errorFinding(xml.slice(errIdx, stop), state.currentFile, ecosystem),
        state: { currentFile: state.currentFile, cursor: tagEnd === -1 ? xml.length : tagEnd + 1 },
    };
};

const stepFrom = function stepFrom(xml: string, state: ScanState, ecosystem: string): ScanStep | null {
    const fileIdx = xml.indexOf(FILE_MARKER, state.cursor);
    const errIdx = xml.indexOf(ERROR_MARKER, state.cursor);
    if (fileIdx === -1 && errIdx === -1) {
        return null;
    }
    const takeFile = fileIdx !== -1 && (errIdx === -1 || fileIdx < errIdx);
    return takeFile ? fileStep(xml, fileIdx, state) : errorStep(xml, errIdx, state, ecosystem);
};

export const parseScalastyleXml = function parseScalastyleXml(xml: string, ecosystem: string): Finding[] {
    const findings: Finding[] = [];
    const initial: ScanState = { currentFile: "", cursor: 0 };
    let step = stepFrom(xml, initial, ecosystem);
    while (step !== null) {
        if (step.finding !== null) {
            findings.push(step.finding);
        }
        step = stepFrom(xml, step.state, ecosystem);
    }
    return findings;
};
