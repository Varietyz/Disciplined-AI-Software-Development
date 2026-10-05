import type { AvailableParser, ChartChecker, ChartFinding, ChartReport, MermaidParser } from "#types/diagram.types";
import { hardeningMessage, parserUnavailable } from "#configuration/strings/diagram.strings";
import { createMermaidParser } from "#core/adapters/diagram.adapter";
import { mermaidBlocks } from "#core/parsers/diagram.parser";
import { mermaidHardening } from "#core/analyzers/diagram.analyzer";
import { print } from "#core/reporters/base.reporter";

const parseBlocks = async function parseBlocks(parser: AvailableParser, markdown: string): Promise<ChartFinding[]> {
    return mermaidBlocks(markdown).reduce(async (pending, block) => {
        const findings = await pending;
        const message = await parser.parse(block.code);
        return message === null ? findings : [...findings, { line: block.startLine, message }];
    }, Promise.resolve<ChartFinding[]>([]));
};

export const validateCharts = async function validateCharts(markdown: string): Promise<ChartReport> {
    const hardening = mermaidHardening(markdown).map((hit) => ({
        line: hit.line,
        message: hardeningMessage(hit.code, hit.detail),
    }));
    const parser = await createMermaidParser();
    if (!parser.available) {
        return { available: false, findings: hardening, reason: parser.reason };
    }
    return { available: true, findings: [...hardening, ...(await parseBlocks(parser, markdown))] };
};

export const createMermaidChecker = function createMermaidChecker(): ChartChecker {
    const state: { parser?: Promise<MermaidParser>; warned: boolean } = { warned: false };
    return {
        async check(source) {
            if (mermaidBlocks(source).length === 0) {
                return [];
            }
            state.parser ??= createMermaidParser();
            const parser = await state.parser;
            if (parser.available) {
                return parseBlocks(parser, source);
            }
            if (!state.warned) {
                print(parserUnavailable(parser.reason));
                state.warned = true;
            }
            return [];
        },
    };
};
