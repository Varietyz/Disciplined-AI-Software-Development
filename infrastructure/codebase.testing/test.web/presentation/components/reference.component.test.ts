import {
    REFERENCE_ABOVE_CLASS,
    REFERENCE_GAP_PX,
    REFERENCE_PENDING_CLASS,
} from "@banes-lab/web/configuration/constants/reference.constants.ts";
import {
    armLink,
    clampPanel,
    createChapterPanel,
    createRecordPanel,
    placePanel,
} from "@banes-lab/web/presentation/components/reference.component.ts";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { hrefOf } from "@banes-lab/web/domain/converters/ontology.converter.ts";

const rectOf = function rectOf(top: number, left: number): DOMRect {
    return {
        bottom: top + 10,
        height: 10,
        left,
        right: left + 10,
        toJSON: () => ({}),
        top,
        width: 10,
        x: left,
        y: top,
    };
};

describe("placePanel", () => {
    it("sits below the anchor when there is room, clamped to the viewport, else above it", () => {
        const panel = createElement("div");
        const anchor = createElement("a");
        vi.spyOn(panel, "offsetWidth", "get").mockReturnValue(200);
        vi.spyOn(panel, "offsetHeight", "get").mockReturnValue(100);
        vi.spyOn(anchor, "getBoundingClientRect").mockReturnValue(rectOf(50, window.innerWidth - 20));
        placePanel(panel, anchor);
        expect(declaredStyle(panel, "top")).toBe(`${String(60 + REFERENCE_GAP_PX)}px`);
        expect(declaredStyle(panel, "left")).toBe(`${String(window.innerWidth - 200 - REFERENCE_GAP_PX)}px`);
        expect(panel.classList.contains(REFERENCE_ABOVE_CLASS)).toBe(false);
        vi.spyOn(anchor, "getBoundingClientRect").mockReturnValue(rectOf(window.innerHeight - 20, 0));
        placePanel(panel, anchor);
        expect(panel.classList.contains(REFERENCE_ABOVE_CLASS)).toBe(true);
        expect(declaredStyle(panel, "top")).toBe(`${String(window.innerHeight - 20 - REFERENCE_GAP_PX - 100)}px`);
        expect(declaredStyle(panel, "left")).toBe(`${String(REFERENCE_GAP_PX)}px`);
    });

    it("clamps a panel that grew past the viewport back inside it", () => {
        const panel = createElement("div");
        vi.spyOn(panel, "offsetWidth", "get").mockReturnValue(200);
        vi.spyOn(panel, "offsetHeight", "get").mockReturnValue(window.innerHeight);
        vi.spyOn(panel, "offsetTop", "get").mockReturnValue(window.innerHeight - 50);
        vi.spyOn(panel, "offsetLeft", "get").mockReturnValue(window.innerWidth);
        clampPanel(panel);
        expect(declaredStyle(panel, "top")).toBe(`${String(REFERENCE_GAP_PX)}px`);
        expect(declaredStyle(panel, "left")).toBe(`${String(window.innerWidth - 200 - REFERENCE_GAP_PX)}px`);
    });
});

describe("armLink", () => {
    it("marks the link pending with a dial and an arrow, and the disposer restores it", () => {
        const link = createElement("a", { attributes: { href: "/ontology#architecture-x" }, text: "X" });
        const disarm = armLink(link);
        expect(link.classList.contains(REFERENCE_PENDING_CLASS)).toBe(true);
        expect(link.querySelectorAll("span")).toHaveLength(2);
        expect(link.querySelector("svg circle")).not.toBeNull();
        disarm();
        expect(link.classList.contains(REFERENCE_PENDING_CLASS)).toBe(false);
        expect(link.querySelectorAll("span")).toHaveLength(0);
        expect(link.textContent).toBe("X");
    });
});

describe("createRecordPanel", () => {
    it("renders the title with its code, the kind with its layer link, the summary and one labeled row per relation", () => {
        const nodes = createRecordPanel({
            code: "SRP",
            kind: "principle",
            layer: { label: "Structural Core", ref: "layer:structural-core" },
            name: "Single Responsibility Principle",
            relations: [
                {
                    edges: [
                        { label: "High Cohesion", ref: "architecture:high-cohesion" },
                        { label: "Unlinked", ref: null },
                    ],
                    relation: "requires",
                },
                { edges: [{ label: "Fail Fast", ref: "architecture:fail-fast" }], relation: "referenced-by" },
            ],
            summary: "One reason to change.",
        });
        const text = nodes.map((node) => node.textContent).join("|");
        expect(text).toContain("Single Responsibility Principle · SRP");
        expect(text).toContain("principle · Structural Core");
        expect(text).toContain("One reason to change.");
        expect(text).toContain("Requires: High Cohesion, Unlinked");
        expect(text).toContain("Referenced by: Fail Fast");
        const links = nodes.flatMap((node) => [...node.querySelectorAll("a")]).map((link) => link.getAttribute("href"));
        expect(links).toStrictEqual([
            hrefOf("layer:structural-core"),
            hrefOf("architecture:high-cohesion"),
            hrefOf("architecture:fail-fast"),
        ]);
    });

    it("renders one labeled row per check question and reads a declared absence as its reason", () => {
        const nodes = createRecordPanel({
            check: {
                answers: {
                    authority: "the declared boundary, which each module conforms to",
                    evidence: "fires: a planted cross-boundary import",
                    freshness: "a verdict stands until the module changes",
                    observation: "none: a cluster is a grouping of principles",
                    population: "every module in the codebase",
                    refusal: "the rule fails the build",
                },
                by: [{ label: "Fail Fast", ref: "architecture:fail-fast" }],
                dependsOn: [],
                shape: [],
            },
            code: null,
            kind: "principle",
            layer: null,
            name: "Modularity",
            relations: [],
            summary: null,
        });
        const text = nodes.map((node) => node.textContent).join("|");
        expect(text).toContain("Checked by: Fail Fast");
        expect(text).toContain("Depends on: Not answered");
        expect(text).toContain("Population: Every module in the codebase");
        expect(text).toContain("Freshness: A verdict stands until the module changes");
        expect(text).toContain("Refusal: The rule fails the build");
        expect(text).toContain("Observation: None, because a cluster is a grouping of principles");
        expect(text).toContain("Evidence: Watched to fire: a planted cross-boundary import");
        expect(text).toContain("Authoritative side: The declared boundary, which each module conforms to");
    });

    it("omits the summary and the relations when the record has none", () => {
        expect(
            createRecordPanel({
                code: null,
                kind: "layer",
                layer: null,
                name: "Structural Core",
                relations: [],
                summary: null,
            }),
        ).toHaveLength(2);
    });
});

describe("createChapterPanel", () => {
    it("renders the chapter title, the chapter kind, the intro and the principle", () => {
        const nodes = createChapterPanel({
            intro: "What a board holds.",
            principle: "State is derived.",
            relations: [{ edges: [{ label: "createElement", ref: null }], relation: "in this codebase" }],
            title: "The board",
        });
        const text = nodes.map((node) => node.textContent).join("|");
        expect(text).toContain("The board");
        expect(text).toContain("Chapter");
        expect(text).toContain("What a board holds.");
        expect(text).toContain("Principle: State is derived.");
        expect(text).toContain("In this codebase: createElement");
        expect(createChapterPanel({ intro: null, principle: null, relations: [], title: "Bare" })).toHaveLength(2);
    });
});
