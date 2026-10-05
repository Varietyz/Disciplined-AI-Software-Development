import { NAVIGATION_FAILED, stageUnaddressed } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { describe, expect, it } from "vitest";
import { HOME_CARD } from "@banes-lab/social-share/core/ids/card.ids.ts";

describe("openStage listening", () => {
    it("listens on a port the system assigns and names it in the stage address", async () => {
        const stage = await openStage(true);
        await stage.close();
        const port = Number(new URL(stage.url).port);
        expect(port).toBeGreaterThan(0);
        expect(stageUnaddressed("null")).toContain("its address is null");
    });
});
import { PROFILES } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { captureCards } from "@banes-lab/social-share/core/coordinators/card.coordinator.ts";
import { openStage } from "@banes-lab/social-share/core/adapters/stage.adapter.ts";

describe("openStage", () => {
    it("loads every registered card and the site's pages through the stage's module runner", async () => {
        const stage = await openStage(false);
        const loaded = await stage.cards();
        await stage.close();
        expect(stage.url.startsWith("https://")).toBe(true);
        expect(loaded.cards.map((card) => card.id)).toContain(HOME_CARD);
        expect(loaded.pages).toHaveLength(loaded.cards.length);
    });
});

describe("captureCards", () => {
    it("fails loudly when the browser cannot open the stage page", async () => {
        const stage = await openStage(false);
        const loaded = await stage.cards();
        await stage.close();
        const jobs = loaded.cards
            .filter((card) => card.id === HOME_CARD)
            .flatMap((card) => PROFILES.slice(0, 1).map((profile) => ({ profile, spec: card.spec })));
        await expect(captureCards({ gpu: false, url: "https://127.0.0.1:1/" }, jobs)).rejects.toThrow(
            NAVIGATION_FAILED,
        );
    }, 120_000);
});
