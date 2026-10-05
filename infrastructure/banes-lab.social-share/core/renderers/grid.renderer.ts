import {
    CAPTION_CLASS,
    FINDINGS_CLASS,
    FRAME_CLASS,
    GRID_CLASS,
    HEADER_CLASS,
    HEADING_CLASS,
    KICKER_CLASS,
    SPREAD_CLASS,
    SPREAD_META_CLASS,
    SPREAD_ROW_CLASS,
    SPREAD_TITLE_CLASS,
    TILE_CLASS,
} from "#configuration/constants/card.constants";
import {
    CAPTION_SEPARATOR,
    DIMENSION_SEPARATOR,
    STAGE_HEADING,
    SUBJECT_SEPARATOR,
} from "#configuration/strings/card.strings";
import type { CardFinding, CardPage, CardSpec, Profile, RegisteredCard } from "#types/card.types";
import { OUTPUT_RATE, PROFILES } from "#configuration/configs/card.config";
import type { Disposer } from "@banes-lab/web/types/base.types.ts";
import { ICON_BASE_CLASS } from "@banes-lab/web/configuration/icons/element.icons.ts";
import type { MountedCard } from "#types/stage.types";
import { SITE_NAME } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { declareStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { mountCard } from "#core/renderers/stage.renderer";
import { pixelValue } from "#core/evaluators/card.fragment.evaluator";
import { playWhileVisible } from "#core/timers/stage.timer";
import { resolveCard } from "#core/evaluators/card.evaluator";

const CLASS_SEPARATOR = " ";

interface Tile {
    readonly element: HTMLElement;
    readonly aspect: number;
    readonly fit: (height: number) => void;
    readonly stop: Disposer;
}

interface Spread {
    readonly element: HTMLElement;
    readonly stop: Disposer;
}

const pixels = function pixels(value: number): string {
    return `${String(Math.round(value))}px`;
};

const messageOf = function messageOf(failure: unknown): string {
    return failure instanceof Error ? failure.message : String(failure);
};

const findingNote = function findingNote(text: string): HTMLElement {
    console.error(text);
    return createElement("p", { className: FINDINGS_CLASS, text });
};

const playTile = function playTile(
    mounted: MountedCard,
    spec: CardSpec,
    profile: Profile,
    frame: HTMLElement,
): Disposer {
    const report = (failure: unknown): void => {
        mounted.report(failure);
    };
    mounted.ready().catch(report);
    return playWhileVisible(
        frame,
        spec.timeline,
        OUTPUT_RATE,
        async (index) => mounted.paint(resolveCard(spec, profile, index)),
        report,
    );
};

const mountTile = function mountTile(frame: HTMLElement, spec: CardSpec, profile: Profile): MountedCard | null {
    try {
        return mountCard(frame, resolveCard(spec, profile, spec.timeline.keyFrame));
    } catch (error) {
        frame.append(findingNote(spec.id + SUBJECT_SEPARATOR + messageOf(error)));
        return null;
    }
};

const tileOf = function tileOf(spec: CardSpec, profile: Profile): Tile {
    const frame = createElement("div", { className: FRAME_CLASS });
    const mounted = mountTile(frame, spec, profile);
    const stop = mounted === null ? (): void => undefined : playTile(mounted, spec, profile, frame);
    const caption = [profile.id, String(profile.width) + DIMENSION_SEPARATOR + String(profile.height)].join(
        CAPTION_SEPARATOR,
    );
    const element = createElement("figure", {
        children: [createElement("figcaption", { className: CAPTION_CLASS, text: caption }), frame],
        className: TILE_CLASS,
    });
    const fit = (height: number): void => {
        const scale = height / profile.height;
        declareStyle(frame, "width", pixels(profile.width * scale));
        declareStyle(frame, "height", pixels(height));
        if (mounted !== null) {
            declareStyle(mounted.element, "transform", `scale(${String(scale)})`);
        }
    };
    return { aspect: profile.width / profile.height, element, fit, stop };
};

const fitRow = function fitRow(row: HTMLElement, tiles: readonly Tile[]): void {
    const gap = pixelValue(getComputedStyle(row).columnGap) || 0;
    const room = row.clientWidth - gap * Math.max(0, tiles.length - 1);
    const aspects = tiles.reduce((sum, tile) => sum + tile.aspect, 0);
    const height = aspects > 0 && room > 0 ? Math.floor(room / aspects) : 0;
    for (const tile of tiles) {
        tile.fit(height);
    }
};

const spreadOf = function spreadOf(
    card: RegisteredCard,
    page: CardPage | undefined,
    findings: readonly CardFinding[],
): Spread {
    const tiles = PROFILES.filter((profile) => card.spec.profiles.includes(profile.id)).map((profile) =>
        tileOf(card.spec, profile),
    );
    const notes = findings
        .filter((finding) => finding.card === card.id)
        .map((finding) => findingNote(finding.card + SUBJECT_SEPARATOR + finding.message));
    const meta = [page?.address ?? card.spec.page, card.id].join(CAPTION_SEPARATOR);
    const row = createElement("div", { children: tiles.map((tile) => tile.element), className: SPREAD_ROW_CLASS });
    const icon = createElement("i", { className: [ICON_BASE_CLASS, page?.icon ?? ""].join(CLASS_SEPARATOR) });
    const element = createElement("section", {
        children: [
            createElement("h2", {
                children: [icon, createElement("span", { text: page?.headline ?? card.id })],
                className: SPREAD_TITLE_CLASS,
            }),
            createElement("p", { className: SPREAD_META_CLASS, text: meta }),
            ...notes,
            row,
        ],
        className: `${SPREAD_CLASS} ${card.spec.tone}`,
    });
    const sizes = new ResizeObserver(() => {
        fitRow(row, tiles);
    });
    sizes.observe(row);
    return {
        element,
        stop: () => {
            sizes.disconnect();
            for (const tile of tiles) {
                tile.stop();
            }
        },
    };
};

export const renderGrid = function renderGrid(
    host: HTMLElement,
    cards: readonly RegisteredCard[],
    pages: readonly CardPage[],
    findings: readonly CardFinding[],
): Disposer {
    const known = new Set(cards.map((card) => card.id));
    const orphans = findings
        .filter((finding) => !known.has(finding.card))
        .map((finding) => findingNote(finding.card + SUBJECT_SEPARATOR + finding.message));
    const byPage = new Map(pages.map((page) => [page.id, page]));
    const rank = new Map(pages.map((page, index) => [page.id, index]));
    const ordered = cards.toSorted(
        (left, right) => (rank.get(left.spec.page) ?? pages.length) - (rank.get(right.spec.page) ?? pages.length),
    );
    const spreads = ordered.map((card) => spreadOf(card, byPage.get(card.spec.page), findings));
    const header = createElement("header", {
        children: [
            createElement("p", { className: KICKER_CLASS, text: SITE_NAME }),
            createElement("h1", { className: HEADING_CLASS, text: STAGE_HEADING }),
        ],
        className: HEADER_CLASS,
    });
    host.replaceChildren(
        header,
        ...orphans,
        createElement("div", { children: spreads.map((spread) => spread.element), className: GRID_CLASS }),
    );
    return () => {
        for (const spread of spreads) {
            spread.stop();
        }
    };
};
