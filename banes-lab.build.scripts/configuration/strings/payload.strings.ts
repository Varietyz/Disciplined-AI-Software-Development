export const MISSING_PAGE_ERROR = "No page is registered under this id.";

export const EMPTY_PAYLOAD = "The payload content is empty.";

export const MALFORMED_PAYLOAD = "The payload lacks an id or a content field.";

export const BODILESS_ALTERNATE = "The Markdown alternate carries a head and no body.";

export const inlineTag = function inlineTag(tag: string): string {
    return `A payload string carries an inline <${tag}> tag; payload text uses Markdown marks, never HTML.`;
};

export const wrongPayloadId = function wrongPayloadId(found: string, expected: string): string {
    return `The payload id is ${found}, expected ${expected}.`;
};

export const wrongPayloadTab = function wrongPayloadTab(expected: string): string {
    return `The payload tab is not ${expected}.`;
};

export const untitledAlternate = function untitledAlternate(title: string): string {
    return `The Markdown alternate does not open with the page title "${title}".`;
};

export const unanchoredAlternate = function unanchoredAlternate(address: string): string {
    return `The Markdown alternate does not name its canonical address ${address}.`;
};
