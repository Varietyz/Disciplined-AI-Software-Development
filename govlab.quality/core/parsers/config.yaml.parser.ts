import { parse } from "yaml";

export const parseYaml = function parseYaml(text: string): unknown {
    const parsed: unknown = parse(text, { merge: true });
    return parsed ?? {};
};
