import type { DiagramWalk } from "#types/diagram.types";
import { JSDOM } from "jsdom";
import { THEME_TOKENS } from "#configuration/constants/diagram.constants";
import { undeclaredToken } from "#configuration/strings/diagram.strings";

const TOKEN_PREFIX = "--";
const DECLARATION_END = ";";
const ASSIGN = ":";
const SVG_OPEN = "<svg";

export const tokenValues = function tokenValues(css: string): ReadonlyMap<string, string> {
    const values = new Map<string, string>();
    for (const raw of css.split("\n")) {
        const line = raw.trim();
        const assign = line.indexOf(ASSIGN);
        if (!line.startsWith(TOKEN_PREFIX) || assign === -1 || !line.endsWith(DECLARATION_END)) {
            continue;
        }
        values.set(line.slice(0, assign), line.slice(assign + 1, -DECLARATION_END.length).trim());
    }
    return values;
};

export const themeVariables = function themeVariables(tokens: ReadonlyMap<string, string>): Record<string, string> {
    const variables: Record<string, string> = { background: "transparent" };
    for (const [variable, token] of THEME_TOKENS) {
        const value = tokens.get(token);
        if (value === undefined) {
            throw new Error(undeclaredToken(token));
        }
        variables[variable] = value;
    }
    return variables;
};

export const withWalk = function withWalk(markup: string, walk: DiagramWalk): string {
    const order = walk.orderOf(JSDOM.fragment(markup));
    const at = markup.indexOf(SVG_OPEN);
    if (order.length === 0 || at === -1) {
        return markup;
    }
    const end = at + SVG_OPEN.length;
    return `${markup.slice(0, end)} ${walk.attribute}="${order}"${markup.slice(end)}`;
};
