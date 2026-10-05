import "@banes-lab/web/presentation/tokens/base.tokens.css";
import "@banes-lab/web/presentation/tokens/asset.tokens.css";
import "@banes-lab/web/presentation/tokens/page.tokens.css";
import "@banes-lab/web/presentation/generated/icon.tokens.generated.css";
import "@banes-lab/web/presentation/styles/element.style.css";
import "../../core/styles/stage.style.css";
import {
    CARD_PARAMETER,
    ERROR_FLAG,
    PROFILE_PARAMETER,
    READY_FLAG,
    RENDER_HOOK,
    STAGE_ID,
    STAGE_STEPS,
    STEP_FLAG,
} from "#configuration/constants/card.constants";
import type { CardSpec, Profile } from "#types/card.types";
import { NO_STAGE, SUBJECT_SEPARATOR, UNKNOWN_CARD, UNKNOWN_STAGE_PROFILE } from "#configuration/strings/card.strings";
import { PROFILES } from "#configuration/configs/card.config";
import { getCard } from "#core/registries/card.registry";
import { loadCards } from "#core/loaders/card.loader";
import { mountCard } from "#core/renderers/stage.renderer";
import { renderGrid } from "#core/renderers/grid.renderer";
import { resolveCard } from "#core/evaluators/card.evaluator";
import { validateCards } from "#core/validators/card.validator";

const messageOf = function messageOf(failure: unknown): string {
    return failure instanceof Error ? failure.message : String(failure);
};

const nextPaint = async function nextPaint(): Promise<void> {
    return new Promise((settle) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                settle();
            });
        });
    });
};

const showCapture = async function showCapture(host: HTMLElement, spec: CardSpec, profile: Profile): Promise<void> {
    Reflect.set(window, STEP_FLAG, STAGE_STEPS.mounting);
    const mounted = mountCard(host, resolveCard(spec, profile, spec.timeline.keyFrame));
    await mounted.ready();
    const render = async (index: number): Promise<boolean> => {
        await mounted.paint(resolveCard(spec, profile, index));
        await nextPaint();
        return true;
    };
    Reflect.set(window, RENDER_HOOK, render);
    Reflect.set(window, STEP_FLAG, STAGE_STEPS.fonts);
    await document.fonts.ready;
    Reflect.set(window, STEP_FLAG, STAGE_STEPS.painting);
    await render(spec.timeline.keyFrame);
    Reflect.set(window, READY_FLAG, true);
};

const captureTarget = function captureTarget(query: URLSearchParams): { spec: CardSpec; profile: Profile } {
    const card = query.get(CARD_PARAMETER) ?? "";
    const profileId = query.get(PROFILE_PARAMETER) ?? "";
    const captured = getCard(card);
    if (captured === undefined) {
        throw new Error(UNKNOWN_CARD + SUBJECT_SEPARATOR + card);
    }
    const profile = PROFILES.find((candidate) => candidate.id === profileId);
    if (profile === undefined) {
        throw new Error(UNKNOWN_STAGE_PROFILE + SUBJECT_SEPARATOR + profileId);
    }
    return { profile, spec: captured.spec };
};

const host = document.getElementById(STAGE_ID);
if (host === null) {
    throw new Error(NO_STAGE);
}
const query = new URLSearchParams(window.location.search);
if (query.has(CARD_PARAMETER) || query.has(PROFILE_PARAMETER)) {
    try {
        const target = captureTarget(query);
        await showCapture(host, target.spec, target.profile);
    } catch (error) {
        Reflect.set(window, ERROR_FLAG, messageOf(error));
        throw error;
    }
} else {
    const loaded = loadCards();
    const findings = validateCards(loaded.cards, loaded.plugins, {
        brand: loaded.brand,
        pages: loaded.pages,
        profiles: PROFILES,
        repeated: loaded.repeated,
    });
    const stopGrid = renderGrid(host, loaded.cards, loaded.pages, findings);
    import.meta.hot?.dispose(stopGrid);
}
