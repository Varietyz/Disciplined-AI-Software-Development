import "@banes-lab/web/presentation/records/records.barrel.ts";
import {
    ANATOMY_ACCENT,
    ARCHITECTURE_ACCENT,
    FAQ_ACCENT,
    GRAMMAR_ACCENT,
    HOME_ACCENT,
    INFORMATION_ACCENT,
    LICENSE_ACCENT,
    METHODOLOGY_ACCENT,
    ONTOLOGY_ACCENT,
    PRIVACY_ACCENT,
    SEARCH_ACCENT,
    TERMS_ACCENT,
} from "@banes-lab/web/configuration/constants/page.constants.ts";
import {
    ANATOMY_SHARE,
    ARCHITECTURE_SHARE,
    FAQ_SHARE,
    GRAMMAR_SHARE,
    HOME_SHARE,
    INFORMATION_SHARE,
    LICENSE_SHARE,
    METHODOLOGY_SHARE,
    ONTOLOGY_SHARE,
    PRIVACY_SHARE,
    SEARCH_SHARE,
    TERMS_SHARE,
} from "@banes-lab/web/configuration/strings/page.strings.ts";
import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { registeredPages } from "@banes-lab/web/domain/registries/page.registry.ts";

const accentTokens = readFileSync(
    fileURLToPath(import.meta.resolve("@banes-lab/web/presentation/tokens/page.tokens.css")),
    "utf8",
);

const ACCENTS = [
    HOME_ACCENT,
    GRAMMAR_ACCENT,
    METHODOLOGY_ACCENT,
    ARCHITECTURE_ACCENT,
    ONTOLOGY_ACCENT,
    ANATOMY_ACCENT,
    FAQ_ACCENT,
    LICENSE_ACCENT,
    INFORMATION_ACCENT,
    TERMS_ACCENT,
    PRIVACY_ACCENT,
    SEARCH_ACCENT,
];

const SHARES = [
    HOME_SHARE,
    GRAMMAR_SHARE,
    METHODOLOGY_SHARE,
    ARCHITECTURE_SHARE,
    ONTOLOGY_SHARE,
    ANATOMY_SHARE,
    FAQ_SHARE,
    LICENSE_SHARE,
    INFORMATION_SHARE,
    TERMS_SHARE,
    PRIVACY_SHARE,
    SEARCH_SHARE,
];

describe("page accents", () => {
    it("gives every registered page its own accent, each a class the accent tokens define", () => {
        const pages = registeredPages();
        expect(new Set(pages.map((page) => page.accent)).size).toBe(pages.length);
        expect(pages.map((page) => page.accent).toSorted()).toStrictEqual([...ACCENTS].toSorted());
        for (const accent of ACCENTS) {
            expect(accentTokens).toContain(`.${accent} {`);
        }
    });
});

describe("page share copy", () => {
    it("gives every registered page its own headline and tagline, none closed by a full stop", () => {
        const pages = registeredPages();
        expect(pages.map((page) => page.share).toSorted((a, b) => a.headline.localeCompare(b.headline))).toStrictEqual(
            [...SHARES].toSorted((a, b) => a.headline.localeCompare(b.headline)),
        );
        for (const share of SHARES) {
            expect(share.headline.length).toBeGreaterThan(0);
            expect(share.tagline.endsWith(".")).toBe(false);
        }
    });
});
