import type { NumberRow, RouteRow } from "#types/catalog.types";
import { blocks, heading } from "#core/formatters/markdown.formatter";
import { linkText } from "#core/formatters/link.formatter";

const SEPARATOR = ", ";
const ITEM = "- ";

export const renderNumbers = function renderNumbers(title: string, rows: readonly NumberRow[]): string {
    return blocks([heading(title), rows.map((row) => `${ITEM}${row.number} ${linkText(row.link)}`).join("\n")]);
};

export const renderRoute = function renderRoute(title: string, rows: readonly RouteRow[]): string {
    const lines = rows.map((row) => {
        const requires = row.requires.filter((at): at is number => at !== null);
        const after = requires.length === 0 ? "" : `, after stop ${requires.map(String).join(SEPARATOR)}`;
        return `${String(row.position)}. ${linkText(row.link)} (${row.block}${after})`;
    });
    return blocks([heading(title), lines.join("\n")]);
};
