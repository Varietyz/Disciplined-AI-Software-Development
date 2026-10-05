const BLANK = "\n\n";
const LINE_END = "\n";
const BULLET = "- ";
const HEADING = "# ";
const SUBHEADING = "## ";
const QUOTE = "> ";
const TICK = "`";
const FENCE_MINIMUM = 3;

export const blocks = function blocks(parts: readonly (string | null)[]): string {
    return parts.filter((part): part is string => part !== null && part.length > 0).join(BLANK) + LINE_END;
};

export const heading = function heading(title: string): string {
    return HEADING + title;
};

export const quote = function quote(text: string | null): string | null {
    return text === null || text.length === 0 ? null : QUOTE + text;
};

export const section = function section(title: string, items: readonly string[]): string | null {
    return items.length === 0 ? null : SUBHEADING + title + BLANK + items.map((item) => BULLET + item).join(LINE_END);
};

export const addressLines = function addressLines(pairs: readonly (readonly [string, string | null])[]): string | null {
    const held = pairs.filter((pair): pair is readonly [string, string] => pair[1] !== null);
    return held.length === 0 ? null : held.map(([label, value]) => `${label}: ${value}`).join(LINE_END);
};

export const code = function code(text: string): string {
    return TICK + text + TICK;
};

export const fenced = function fenced(text: string, language: string): string {
    let longest = 0;
    let run = 0;
    for (const char of text) {
        run = char === TICK ? run + 1 : 0;
        longest = Math.max(longest, run);
    }
    const fence = TICK.repeat(Math.max(FENCE_MINIMUM, longest + 1));
    return fence + language + LINE_END + text.trimEnd() + LINE_END + fence;
};
