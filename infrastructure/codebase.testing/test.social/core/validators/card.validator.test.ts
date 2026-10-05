import type { CardInput, RegisteredCard } from "@banes-lab/social-share/types/card.types.ts";
import {
    DUPLICATE_CARD,
    EXPRESSION_FAILED,
    FOLDER_MISMATCH,
    FRAMES_OUT_OF_RANGE,
    MISSING_SHARE_PROFILE,
    NOT_FINITE,
    OUTSIDE_CANVAS,
    SHADER_WITHOUT_ENTRY,
    STYLE_NOT_ALLOWED,
    UNKNOWN_PAGE,
    UNKNOWN_PROFILE,
    UNREGISTERED_PLUGIN,
} from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { describe, expect, it } from "vitest";
import { folderOf, validateCards } from "@banes-lab/social-share/core/validators/card.validator.ts";
import { PROFILES } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";

const ORIGIN = "/cards/demo/plugins/demo.plugin.ts";
const PAGE = {
    accent: "page-gold",
    address: "lab.example",
    headline: "Demo",
    icon: "bi-house",
    id: "home",
    mark: "/mark.gif",
    tagline: "A demo page",
};
const CONTEXT = { brand: ["Lab"], pages: [PAGE], profiles: PROFILES, repeated: [] };

const base: CardInput = {
    alt: "A demo card.",
    id: "demo",
    layers: [
        { id: "title", kind: "text", placement: { x: 0.5, y: 0.5 }, text: PAGE.headline },
        { id: "subtitle", kind: "text", placement: { x: 0.5, y: 0.6 }, text: PAGE.tagline },
        { id: "kicker", kind: "text", placement: { x: 0.5, y: 0.4 }, text: "Lab" },
        { id: "domain", kind: "text", placement: { x: 0.5, y: 0.9 }, text: PAGE.address },
        { alt: "Mark", id: "mark", kind: "animation", placement: { x: 0.2, y: 0.5 }, source: PAGE.mark },
    ],
    page: PAGE.id,
    stylesheet: "",
    tone: PAGE.accent,
};

const registered = function registered(input: Partial<CardInput>, origin = ORIGIN): RegisteredCard {
    const spec = createCard({ ...base, ...input });
    return { id: spec.id, origin, spec };
};

const failing = function failing(): number {
    throw new Error("boom");
};

const messagesOf = function messagesOf(input: Partial<CardInput>): readonly string[] {
    return validateCards([registered(input)], [ORIGIN], CONTEXT).map((finding) => finding.message);
};

describe("folderOf", () => {
    it("reads the card folder above the plugins folder on either separator", () => {
        expect(folderOf(ORIGIN)).toBe("demo");
        expect(folderOf(String.raw`C:\cards\demo\plugins\demo.plugin.ts`)).toBe("demo");
        expect(folderOf("/cards/demo/demo.ts")).toBe("");
    });
});

describe("validateCards", () => {
    it("passes a well-formed card", () => {
        expect(messagesOf({})).toStrictEqual([]);
    });

    it("reports each broken spec shape", () => {
        expect(messagesOf({ profiles: ["og", "poster"] })).toContain(UNKNOWN_PROFILE);
        expect(messagesOf({ page: "nowhere" })).toContain(UNKNOWN_PAGE);
        expect(messagesOf({ profiles: ["x"] })).toContain(MISSING_SHARE_PROFILE);
        expect(messagesOf({ timeline: { frames: 0 } })).toContain(FRAMES_OUT_OF_RANGE);
        expect(
            messagesOf({ layers: [{ id: "t", kind: "text", placement: { x: Number.NaN, y: 0 }, text: "" }] }),
        ).toContain(NOT_FINITE);
        expect(messagesOf({ layers: [{ id: "t", kind: "text", placement: { x: 4, y: 0 }, text: "" }] })).toContain(
            OUTSIDE_CANVAS,
        );
        expect(
            messagesOf({
                layers: [{ id: "t", kind: "text", placement: { x: 0, y: 0 }, style: { position: "fixed" }, text: "" }],
            }),
        ).toContain(STYLE_NOT_ALLOWED);
        expect(
            messagesOf({ layers: [{ id: "s", kind: "shader", placement: { x: 0, y: 0 }, shader: "", uniforms: {} }] }),
        ).toContain(SHADER_WITHOUT_ENTRY);
    });

    it("turns an expression that throws into a finding naming the failure", () => {
        const messages = messagesOf({ layers: [{ id: "t", kind: "text", placement: { x: failing, y: 0 }, text: "" }] });
        expect(messages.some((message) => message.startsWith(EXPRESSION_FAILED) && message.endsWith("boom"))).toBe(
            true,
        );
    });

    it("reports repeated ids, silent plugins and misplaced cards", () => {
        const findings = validateCards(
            [registered({}, "/cards/other/plugins/other.plugin.ts")],
            ["/cards/other/plugins/other.plugin.ts", "/cards/empty/plugins/empty.plugin.ts"],
            { ...CONTEXT, repeated: ["demo"] },
        );
        expect(findings).toContainEqual({ card: "demo", message: DUPLICATE_CARD });
        expect(findings).toContainEqual({ card: "empty", message: UNREGISTERED_PLUGIN });
        expect(findings).toContainEqual({ card: "demo", message: FOLDER_MISMATCH });
    });
});
