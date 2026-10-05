import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";

export const parseMermaid = async function parseMermaid(code: string): Promise<string | null> {
    const parser = await createMermaidParser();
    if (!parser.available) {
        throw new Error(parser.reason);
    }
    return parser.parse(code);
};
