import { emptyFigure } from "#configuration/strings/page.strings";

const FIGURE_SELECTOR = "figure";

const CAPTION_SELECTOR = "figcaption";

const CAPTION_TAG = "FIGCAPTION";

const bodyText = function bodyText(figure: Element): string {
    return [...figure.children]
        .filter((child) => child.tagName !== CAPTION_TAG)
        .map((child) => child.textContent)
        .join("")
        .trim();
};

const captionText = function captionText(figure: Element): string {
    const caption = figure.querySelector(CAPTION_SELECTOR);
    const parts =
        caption === null ? [] : [...caption.querySelectorAll("*")].filter((part) => part.children.length === 0);
    return parts
        .map((part) => part.textContent.trim())
        .filter((part) => part.length > 0)
        .join(" ");
};

export const assertFiguresFilled = function assertFiguresFilled(content: Element, path: string): void {
    for (const figure of content.querySelectorAll(FIGURE_SELECTOR)) {
        if (bodyText(figure).length === 0) {
            throw new Error(emptyFigure(path, captionText(figure)));
        }
    }
};
