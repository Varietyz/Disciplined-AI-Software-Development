import {
    GHOST_DECAY_PROPERTY,
    GHOST_REFERENCE_CELLS,
    GHOST_STEP_MS,
    GHOST_TAIL_SHARE,
    WALK_CURRENT_CLASS,
    WALK_GHOST_CLASS,
    WALK_STATUS_CLASS,
} from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { LOCATION_RELATION, WALK_HINT } from "@banes-lab/web/configuration/strings/walk.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    cellRecord,
    cellText,
    createStatus,
    ghostPace,
    loadSnippet,
    runGhost,
} from "@banes-lab/web/presentation/components/walk.component.ts";
import { enableInspector, renderWalk } from "@banes-lab/web/presentation/renderers/walk.renderer.ts";
import { OPEN_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { WALK_PANEL_ID } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import type { WalkCellView } from "@banes-lab/web/types/anatomy.types.ts";
import { WalkInspector } from "@banes-lab/web/presentation/components/step.component.ts";
import { createVectorElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";

const CELL_FILE = ["core", "assets", "link.assets.ts"].join("/");

const CELL: WalkCellView = {
    depth: 2,
    file: CELL_FILE,
    label: "identifier",
    line: 19,
    name: "tabLink",
    ref: "0",
    severity: null,
    state: "call",
    text: "tabLink(page, tabs, id)",
};
const BARE: WalkCellView = { ...CELL, file: "", line: null, name: "", ref: "1", severity: "high", state: "structure" };
const MARKUP =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><polygon class="hex" data-ref="0" points="0,0 1,0 1,1"/><polygon class="hex" data-ref="1" points="2,0 3,0 3,1"/></svg>';

type Intersection = (entries: readonly { readonly isIntersecting: boolean }[]) => void;

class Observer {
    private readonly callback: Intersection;

    public constructor(callback: Intersection) {
        this.callback = callback;
    }

    public observe(): void {
        this.callback([{ isIntersecting: true }]);
    }

    public disconnect(): void {
        this.callback([]);
    }
}

afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("cellText and cellRecord", () => {
    it("summarizes a cell as location, kind and text, and records it with a linked location and a severity when flagged", () => {
        expect(cellText(CELL)).toBe(`${CELL_FILE}:19 · identifier · tabLink(page, tabs, id)`);
        expect(cellText(BARE)).toBe("depth 2 · identifier · tabLink(page, tabs, id)");
        const record = cellRecord(CELL);
        expect(record.name).toBe("tabLink");
        expect(record.code).toBe("call");
        expect(record.relations[0]?.relation).toBe(LOCATION_RELATION);
        expect(record.relations[0]?.edges[0]?.ref?.endsWith("#file-core-assets-link-assets-ts:19")).toBe(true);
        expect(record.relations).toHaveLength(2);
        const bare = cellRecord(BARE);
        expect(bare.name).toBe("identifier");
        expect(bare.relations[0]?.edges[0]?.ref).toBeNull();
        expect(bare.relations).toHaveLength(3);
    });
});

describe("createStatus and loadSnippet", () => {
    it("starts the status with the hint and answers no snippet when the source cannot be fetched", async () => {
        expect(createStatus().textContent).toBe(WALK_HINT);
        expect(createStatus().classList.contains(WALK_STATUS_CLASS)).toBe(true);
        vi.stubGlobal("fetch", async () => {
            await Promise.resolve();
            throw new Error("offline");
        });
        expect(await loadSnippet(CELL)).toBeNull();
        expect(await loadSnippet(BARE)).toBeNull();
    });
});

describe("runGhost", () => {
    it("moves a ghost head across the cells while visible and clears it on disposal", () => {
        vi.useFakeTimers();
        vi.stubGlobal("IntersectionObserver", Observer);
        const element = document.createElement("div");
        element.append(createVectorElement(MARKUP));
        document.body.append(element);
        const dispose = runGhost(element);
        vi.advanceTimersByTime(1);
        const cells = element.querySelectorAll("polygon");
        const pace = ghostPace(cells.length);
        expect(declaredStyle(element, GHOST_DECAY_PROPERTY)).toBe(`${String(pace.decay)}ms`);
        expect(cells[0]?.classList.contains(WALK_GHOST_CLASS)).toBe(true);
        vi.advanceTimersByTime(pace.step);
        expect(cells[1]?.classList.contains(WALK_GHOST_CLASS)).toBe(true);
        dispose();
        expect(element.querySelectorAll(`.${WALK_GHOST_CLASS}`)).toHaveLength(0);
    });

    it("paces the ghost by the cell count: the reference count keeps the base step, fewer cells slow it, and the tail is a quarter of the cells", () => {
        const decay = (GHOST_STEP_MS * GHOST_REFERENCE_CELLS) / GHOST_TAIL_SHARE;
        expect(ghostPace(GHOST_REFERENCE_CELLS)).toStrictEqual({ decay, step: GHOST_STEP_MS, stride: 1 });
        expect(ghostPace(GHOST_REFERENCE_CELLS / 10)).toStrictEqual({ decay, step: GHOST_STEP_MS * 10, stride: 1 });
        expect(ghostPace(GHOST_REFERENCE_CELLS * 4)).toStrictEqual({ decay, step: GHOST_STEP_MS, stride: 4 });
        expect(ghostPace(0).step).toBe(GHOST_STEP_MS * GHOST_REFERENCE_CELLS);
    });
});

describe("WalkInspector and attachInspector", () => {
    it("shows a cell's record in the shared panel, marks the cell, and steps to its neighbors", () => {
        vi.stubGlobal("IntersectionObserver", Observer);
        const element = document.createElement("div");
        element.append(createVectorElement(MARKUP));
        document.body.append(element);
        const status = createStatus();
        enableInspector(element, status, [CELL, BARE]);
        const inspector = new WalkInspector(element, status, [CELL, BARE]);
        inspector.show(0, true);
        const panel = document.getElementById(WALK_PANEL_ID);
        expect(panel?.classList.contains(OPEN_CLASS)).toBe(true);
        expect(panel?.textContent.includes("tabLink")).toBe(true);
        expect(element.querySelector<HTMLElement>(`.${WALK_CURRENT_CLASS}`)?.dataset.ref).toBe("0");
        expect(status.textContent).toBe(cellText(CELL));
        expect(inspector.isOpen()).toBe(true);
        inspector.show(1, false);
        expect(element.querySelector<HTMLElement>(`.${WALK_CURRENT_CLASS}`)?.dataset.ref).toBe("1");
        inspector.hide();
        expect(inspector.isOpen()).toBe(false);
        expect(panel?.classList.contains(OPEN_CLASS)).toBe(false);
    });
});

describe("renderWalk", () => {
    it("renders a diagram figure with the caption, the step count and a status line", () => {
        const figure = renderWalk({
            caption: "a walk",
            kind: "walk",
            walk: { cells: "c.json", steps: 13, vector: "v.svg" },
        });
        expect(figure.classList.contains("diagram-figure")).toBe(true);
        expect(figure.querySelector(".diagram-caption")?.textContent).toBe("a walk");
        expect(figure.querySelector(".walk-steps")?.textContent).toBe("13 steps");
        expect(figure.querySelector(`.${WALK_STATUS_CLASS}`)?.textContent).toBe(WALK_HINT);
    });
});
