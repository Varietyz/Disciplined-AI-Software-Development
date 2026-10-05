import { FILE_ANCHOR, TREE_TAB } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import {
    REFERENCE_ARROW_CLASS,
    REFERENCE_CHAIN_MS,
    REFERENCE_CHAIN_PROPERTY,
    REFERENCE_DIAL_CLASS,
    REFERENCE_HIDE_MS,
    REFERENCE_PENDING_CLASS,
    REFERENCE_SHOW_MS,
} from "@banes-lab/web/configuration/constants/reference.constants.ts";
import type { ReferenceIndex, ReferenceRecord } from "@banes-lab/web/types/reference.types.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ANATOMY_FACE } from "@banes-lab/web/configuration/constants/vocabulary.constants.ts";
import { ANATOMY_INDEX } from "@banes-lab/web/core/generated/anatomy.index.generated.ts";
import { ANATOMY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import type { AnatomyRecords } from "@banes-lab/web/types/record.types.ts";
import { ESCAPE_KEY } from "@banes-lab/web/configuration/constants/overlay.constants.ts";
import type { GraphChunk } from "@banes-lab/web/types/graph.types.ts";
import { REFERENCE_ARROW } from "@banes-lab/web/configuration/strings/reference.strings.ts";
import { REFERENCE_PANEL_ID } from "@banes-lab/web/core/ids/reference.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { fileId } from "@banes-lab/web/domain/converters/source.converter.ts";
import { hrefOf } from "@banes-lab/web/domain/converters/ontology.converter.ts";
import { loadReference } from "@banes-lab/web/domain/loaders/reference.loader.ts";
import { mountReference } from "@banes-lab/web/presentation/widgets/reference.widget.ts";
import { sourceLocation } from "@banes-lab/web/core/assets/walk.assets.ts";
import { tabLink } from "@banes-lab/web/core/assets/link.assets.ts";

const OPEN = "open";
const FACTORY = ["core", "factories", "element.factory.ts"].join("/");
const FACTORY_NAME = "element.factory.ts";
const CREATE = "createElement";
const LINE = "3";
const FAIL_FAST = "architecture:fail-fast";
const SUMMARY = "Stop at the first error.";
const INDEX: ReferenceIndex = {
    [FAIL_FAST]: {
        code: null,
        kind: "principle",
        layer: { label: "Correctness Core", ref: "layer:correctness-core" },
        name: "Fail Fast",
        relations: [
            {
                edges: [{ label: "Single Responsibility Principle", ref: "architecture:single-responsibility" }],
                relation: "requires",
            },
        ],
        summary: SUMMARY,
    },
    "architecture:single-responsibility": {
        code: "SRP",
        kind: "principle",
        layer: null,
        name: "Single Responsibility Principle",
        relations: [],
        summary: null,
    },
};

vi.mock("@banes-lab/web/core/generated/reference.generated.ts", () => ({
    loadReferences: async (face: string): Promise<ReferenceIndex | null> => {
        await Promise.resolve();
        return face === "architecture" ? INDEX : null;
    },
}));

const GRAPH: { chunk: GraphChunk | null } = { chunk: null };

vi.mock("@banes-lab/web/core/generated/graph.generated.ts", () => ({
    loadGraph: async (): Promise<GraphChunk | null> => {
        await Promise.resolve();
        return GRAPH.chunk;
    },
}));

const sourceRecord = function sourceRecord(name: string, kind: string): ReferenceRecord {
    return { code: null, kind, layer: null, name, relations: [], summary: null };
};

const anatomyContent = async function anatomyContent(fragment: string): Promise<ReferenceRecord | null> {
    const content = await loadReference(
        { face: ANATOMY_FACE, ref: `${ANATOMY_FACE}:${fragment}` },
        tabLink(ANATOMY_PAGE, TREE_TAB, fragment),
    );
    return content?.kind === "record" ? content.record : null;
};

const panel = function panel(): HTMLElement | null {
    return document.getElementById(REFERENCE_PANEL_ID);
};

const linkTo = function linkTo(ref: string): HTMLAnchorElement {
    const link = createElement("a", { attributes: { href: hrefOf(ref) ?? "" }, text: ref });
    document.body.append(link);
    return link;
};

const hover = async function hover(link: Element, wait: number): Promise<void> {
    link.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(wait);
};

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
});

describe("loadReference", () => {
    it("loads an ontology record by its collection and answers null for an unknown one", async () => {
        const loaded = await loadReference({ face: "architecture", ref: FAIL_FAST }, hrefOf(FAIL_FAST) ?? "");
        expect(loaded?.kind === "record" && loaded.record.name).toBe("Fail Fast");
        expect(
            await loadReference({ face: "lexicon", ref: "lexicon:nothing" }, hrefOf("lexicon:nothing") ?? ""),
        ).toBeNull();
    });

    it("adds the baked tooltip relations of the record and drops the ones a tooltip does not show", async () => {
        GRAPH.chunk = {
            [FAIL_FAST]: {
                kind: "principle",
                number: null,
                relations: [
                    { relation: "linked-from", targets: [{ href: "/method#loop", number: "3", title: "The loop" }] },
                    { relation: "contains", targets: [{ href: null, number: null, title: "hidden" }] },
                ],
                title: "Fail Fast",
            },
        };
        const loaded = await loadReference({ face: "architecture", ref: FAIL_FAST }, hrefOf(FAIL_FAST) ?? "");
        GRAPH.chunk = null;
        expect(loaded?.kind === "record" && loaded.record.relations.at(-1)).toStrictEqual({
            edges: [{ label: "The loop", ref: "chapter:/method#loop" }],
            relation: "linked-from",
        });
        expect(loaded?.kind === "record" && loaded.record.relations.map((held) => held.relation)).toStrictEqual([
            "requires",
            "linked-from",
        ]);
    });

    it("answers a tree node's record or its definition's record from the node's baked records file", async () => {
        const id = fileId(FACTORY);
        const name = ANATOMY_INDEX.nodes[id];
        const records: AnatomyRecords = {
            definitions: { [LINE]: sourceRecord(CREATE, "definition") },
            node: sourceRecord(FACTORY_NAME, "file"),
        };
        const fetched = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(async (url) =>
                url === sourceLocation(name ?? "") ? Response.json(records) : new Response("", { status: 404 }),
            );
        const node = await anatomyContent(id);
        const definition = await anatomyContent(`${id}:${LINE}`);
        const fallback = await anatomyContent(`${id}:0`);
        const missing = await anatomyContent(`${FILE_ANCHOR}nowhere`);
        fetched.mockRestore();
        expect(name).toBeDefined();
        expect(node).toStrictEqual(records.node);
        expect(definition).toStrictEqual(records.definitions[LINE]);
        expect(fallback).toStrictEqual(records.node);
        expect(missing).toBeNull();
    });
});

describe("mountReference", () => {
    it("opens a panel with the record's name, summary and relation links after the show delay", async () => {
        const dispose = mountReference();
        await hover(linkTo(FAIL_FAST), REFERENCE_SHOW_MS);
        const shown = panel();
        expect(shown?.classList.contains(OPEN)).toBe(true);
        expect(shown?.textContent).toContain("Fail Fast");
        expect(shown?.textContent).toContain(SUMMARY);
        const links = [...(shown?.querySelectorAll("a") ?? [])].map((link) => link.getAttribute("href"));
        expect(links).toStrictEqual([hrefOf("layer:correctness-core"), hrefOf("architecture:single-responsibility")]);
        dispose();
    });

    it("arms a relation link inside the panel with a dial and an arrow, and re-anchors only after the cooldown", async () => {
        const dispose = mountReference();
        await hover(linkTo(FAIL_FAST), REFERENCE_SHOW_MS);
        const inner = [...(panel()?.querySelectorAll("a") ?? [])].at(-1);
        expect(inner).toBeDefined();
        await hover(inner ?? document.body, REFERENCE_CHAIN_MS - 1);
        expect(inner?.classList.contains(REFERENCE_PENDING_CLASS)).toBe(true);
        expect(inner?.querySelector(`.${REFERENCE_DIAL_CLASS} svg circle`)).not.toBeNull();
        expect(inner?.querySelector(`.${REFERENCE_ARROW_CLASS}`)?.textContent).toBe(REFERENCE_ARROW);
        expect(panel()?.textContent).toContain(SUMMARY);
        await vi.advanceTimersByTimeAsync(1);
        expect(panel()?.textContent).toContain("SRP");
        expect(panel()?.textContent).not.toContain(SUMMARY);
        expect(declaredStyle(panel() ?? document.body, REFERENCE_CHAIN_PROPERTY)).toBe(
            `${String(REFERENCE_CHAIN_MS)}ms`,
        );
        dispose();
    });

    it("disarms a pending relation link when the pointer leaves it for the panel body, and arms it again on return", async () => {
        const dispose = mountReference();
        await hover(linkTo(FAIL_FAST), REFERENCE_SHOW_MS);
        const inner = [...(panel()?.querySelectorAll("a") ?? [])].at(-1);
        await hover(inner ?? document.body, REFERENCE_CHAIN_MS / 2);
        inner?.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: panel() }));
        await vi.advanceTimersByTimeAsync(REFERENCE_CHAIN_MS);
        expect(inner?.classList.contains(REFERENCE_PENDING_CLASS)).toBe(false);
        expect(inner?.querySelector(`.${REFERENCE_DIAL_CLASS}`)).toBeNull();
        expect(panel()?.textContent).toContain(SUMMARY);
        await hover(inner ?? document.body, REFERENCE_CHAIN_MS);
        expect(panel()?.textContent).toContain("SRP");
        dispose();
    });

    it("hides on mouse out after the hide delay, on escape, and stays closed for a link with no record", async () => {
        const dispose = mountReference();
        const link = linkTo(FAIL_FAST);
        await hover(link, REFERENCE_SHOW_MS);
        link.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
        await vi.advanceTimersByTimeAsync(REFERENCE_HIDE_MS);
        expect(panel()?.classList.contains(OPEN)).toBe(false);
        await hover(link, REFERENCE_SHOW_MS);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: ESCAPE_KEY }));
        expect(panel()?.classList.contains(OPEN)).toBe(false);
        await hover(linkTo("lexicon:nothing"), REFERENCE_SHOW_MS);
        expect(panel()?.classList.contains(OPEN)).toBe(false);
        dispose();
    });

    it("removes the panel and stops reacting once disposed", async () => {
        mountReference()();
        expect(panel()).toBeNull();
        await hover(linkTo(FAIL_FAST), REFERENCE_SHOW_MS);
        expect(panel()).toBeNull();
    });
});
