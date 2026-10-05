const XML_ESCAPES: ReadonlyMap<string, string> = new Map([
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&apos;"],
]);

export const escapeXml = function escapeXml(value: string): string {
    let out = "";
    for (const ch of value) {
        out += XML_ESCAPES.get(ch) ?? ch;
    }
    return out;
};
