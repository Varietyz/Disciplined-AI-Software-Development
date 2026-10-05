import {
    ADDRESS_OVERFLOWS,
    LIST_SEPARATOR,
    OFF_BRAND,
    OFF_TONE,
    PAGE_SHARED,
    PAGE_WITHOUT_CARD,
    SUBJECT_SEPARATOR,
} from "#configuration/strings/card.strings";
import type { CardContext, CardFinding, CardPage, LayerKind, RegisteredCard } from "#types/card.types";
import { ADDRESS_ADVANCE } from "#configuration/constants/card.constants";
import { pixelValue } from "#core/evaluators/card.fragment.evaluator";
import { resolveCard } from "#core/evaluators/card.evaluator";

const FONT_SIZE = "fontSize";

const coverageOf = function coverageOf(page: CardPage, cards: readonly RegisteredCard[]): readonly CardFinding[] {
    const serving = cards.filter((card) => card.spec.page === page.id);
    if (serving.length === 0) {
        return [{ card: page.id, message: PAGE_WITHOUT_CARD }];
    }
    if (serving.length > 1) {
        const ids = serving.map((card) => card.id).join(LIST_SEPARATOR);
        return [{ card: page.id, message: PAGE_SHARED + SUBJECT_SEPARATOR + ids }];
    }
    return [];
};

const SHOWN_KINDS: ReadonlySet<LayerKind> = new Set<LayerKind>(["animation", "image", "text"]);

const shownContent = function shownContent(card: RegisteredCard, context: CardContext): ReadonlySet<string> {
    const shown = new Set<string>();
    for (const profile of context.profiles.filter((candidate) => card.spec.profiles.includes(candidate.id))) {
        for (const layer of resolveCard(card.spec, profile, card.spec.timeline.keyFrame).layers) {
            if (SHOWN_KINDS.has(layer.kind)) {
                shown.add(layer.content);
            }
        }
    }
    return shown;
};

const overflowsOf = function overflowsOf(
    card: RegisteredCard,
    page: CardPage,
    context: CardContext,
): readonly string[] {
    return context.profiles
        .filter((profile) => card.spec.profiles.includes(profile.id))
        .filter((profile) =>
            resolveCard(card.spec, profile, card.spec.timeline.keyFrame).layers.some((layer) => {
                const size = pixelValue(layer.style[FONT_SIZE] ?? "");
                const room = layer.placement.width * profile.width;
                return (
                    layer.kind === "text" &&
                    layer.content === page.address &&
                    page.address.length * ADDRESS_ADVANCE * size > room
                );
            }),
        )
        .map((profile) => profile.id);
};

const brandOf = function brandOf(card: RegisteredCard, page: CardPage, context: CardContext): readonly CardFinding[] {
    const shown = shownContent(card, context);
    const parts = [page.mark, page.headline, page.tagline, page.address, ...context.brand];
    const missing = parts.filter((mark) => !shown.has(mark));
    const overflows = overflowsOf(card, page, context);
    return [
        ...(card.spec.tone === page.accent ? [] : [{ card: card.id, message: OFF_TONE }]),
        ...(overflows.length === 0
            ? []
            : [{ card: card.id, message: ADDRESS_OVERFLOWS + SUBJECT_SEPARATOR + overflows.join(LIST_SEPARATOR) }]),
        ...(missing.length === 0
            ? []
            : [{ card: card.id, message: OFF_BRAND + SUBJECT_SEPARATOR + missing.join(LIST_SEPARATOR) }]),
    ];
};

export const coverageFindings = function coverageFindings(
    cards: readonly RegisteredCard[],
    pages: readonly CardPage[],
): readonly CardFinding[] {
    return pages.flatMap((page) => coverageOf(page, cards));
};

export const brandFindings = function brandFindings(
    cards: readonly RegisteredCard[],
    context: CardContext,
): readonly CardFinding[] {
    const pages = new Map(context.pages.map((page) => [page.id, page]));
    return cards.flatMap((card) => {
        const page = pages.get(card.spec.page);
        return page === undefined ? [] : brandOf(card, page, context);
    });
};
