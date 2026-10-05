import {
    LICENSE_DOCUMENTATION_CARD,
    LICENSE_FREE_CARD,
    LICENSE_PAID_CARD,
} from "@banes-lab/web/core/ids/license.ids.ts";
import { describe, expect, it } from "vitest";
import { TYPES_SECTION } from "@banes-lab/web/configuration/strings/license.fragment.strings.ts";
import { renderCards } from "@banes-lab/web/presentation/renderers/card.renderer.ts";

const CARD_CLASS = "block-card";
const PERMITTED_CLASS = "permitted";
const RESTRICTED_CLASS = "restricted";

const cardBlock = TYPES_SECTION.subsections
    .flatMap((subsection) => subsection.blocks ?? [])
    .find((block) => block.kind === "card");

describe("renderCards", () => {
    it("renders the license cards with their ids", () => {
        expect(cardBlock).toBeDefined();
        const grid = renderCards(cardBlock?.kind === "card" ? cardBlock : { cards: [], kind: "card" });
        const ids = [LICENSE_FREE_CARD, LICENSE_PAID_CARD, LICENSE_DOCUMENTATION_CARD];
        expect(grid.querySelectorAll(`.${CARD_CLASS}`)).toHaveLength(ids.length);
        for (const id of ids) {
            expect(grid.querySelector(`#${id}`)).not.toBeNull();
        }
    });

    it("lists permitted and restricted rules for each card", () => {
        const grid = renderCards(cardBlock?.kind === "card" ? cardBlock : { cards: [], kind: "card" });
        expect(grid.querySelectorAll(`.${PERMITTED_CLASS}`).length).toBeGreaterThan(0);
        expect(grid.querySelectorAll(`.${RESTRICTED_CLASS}`).length).toBeGreaterThan(0);
    });
});
