import { ALT_ATTRIBUTE, ARIA_LABEL_ATTRIBUTE, HREF_ATTRIBUTE, TITLE_ATTRIBUTE } from "#core/ids/element.ids";
import { genericLink, namelessLink } from "#configuration/strings/element.strings";
import type { Finding } from "#types/validation.types";
import { isGenericLabel } from "@banes-lab/web/core/predicates/link.predicate.ts";
import { readDocument } from "#core/adapters/document.adapter";

const SPACE = " ";

const imageNames = function imageNames(anchor: Element): string {
    return [...anchor.querySelectorAll("img")]
        .map((image) => image.getAttribute(ALT_ATTRIBUTE)?.trim() ?? "")
        .filter((alt) => alt.length > 0)
        .join(SPACE);
};

const accessibleName = function accessibleName(anchor: Element): string {
    const candidates = [
        anchor.getAttribute(ARIA_LABEL_ATTRIBUTE) ?? "",
        anchor.textContent,
        imageNames(anchor),
        anchor.getAttribute(TITLE_ATTRIBUTE) ?? "",
    ];
    return candidates.map((candidate) => candidate.trim()).find((name) => name.length > 0) ?? "";
};

const findingOf = function findingOf(file: string, anchor: Element): Finding | null {
    const href = anchor.getAttribute(HREF_ATTRIBUTE) ?? "";
    const text = anchor.textContent.trim();
    if (accessibleName(anchor).length === 0) {
        return { file, message: namelessLink(href) };
    }
    if (isGenericLabel(text)) {
        return { file, message: genericLink(href, text) };
    }
    return null;
};

export const checkLinkNames = function checkLinkNames(file: string, html: string): Finding[] {
    return readDocument(html, (document) =>
        [...document.querySelectorAll("a[href]")]
            .map((anchor) => findingOf(file, anchor))
            .filter((finding): finding is Finding => finding !== null),
    );
};
