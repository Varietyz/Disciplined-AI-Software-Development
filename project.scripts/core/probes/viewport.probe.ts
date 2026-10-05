import type {
    ControlFindings,
    LayoutFindings,
    ProbePage,
    ViewportAudit,
    ViewportProbe,
    ViewportRules,
} from "#types/viewport.types";

export const pixelsOf = function pixelsOf(value: string): number {
    const unit = "px";
    return value.endsWith(unit) ? Number(value.slice(0, -unit.length)) : Number.NaN;
};

export const describeElement = function describeElement(element: Element): string {
    const classes = [...element.classList]
        .slice(0, 3)
        .map((name) => `.${name}`)
        .join("");
    const id = element.id.length > 0 ? `#${element.id}` : "";
    return `${element.tagName.toLowerCase()}${id}${classes}`;
};

export const countedEntries = function countedEntries(keys: readonly string[]): readonly string[] {
    const tally = new Map<string, number>();
    for (const key of keys) {
        tally.set(key, (tally.get(key) ?? 0) + 1);
    }
    return [...tally].map(([key, count]) => (count > 1 ? `${key} x${String(count)}` : key));
};

export const isAuditable = function isAuditable(page: ProbePage, rules: ViewportRules, element: Element): boolean {
    const style = page.getComputedStyle(element);
    const shown = style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    return shown && element.closest(rules.hiddenSelector) === null;
};

export const escapesScreen = function escapesScreen(page: ProbePage, rules: ViewportRules, element: Element): boolean {
    const right = page.innerWidth + rules.tolerancePx;
    const box = element.getBoundingClientRect();
    if (box.width === 0 || (box.right <= right && box.left >= -rules.tolerancePx)) {
        return false;
    }
    for (let parent = element.parentElement; parent !== null; parent = parent.parentElement) {
        if (parent.id === rules.scrollRootId || parent === page.document.body) {
            return true;
        }
        const frame = parent.getBoundingClientRect();
        const scrolls = page.getComputedStyle(parent).overflowX !== "visible";
        if (scrolls && frame.right <= right && frame.left >= -rules.tolerancePx) {
            return false;
        }
    }
    return true;
};

export const widestDescendant = function widestDescendant(element: Element): Element | null {
    let widest: Element | null = null;
    let widestRight = element.getBoundingClientRect().right;
    for (const inner of element.querySelectorAll("*")) {
        const { right } = inner.getBoundingClientRect();
        if (right > widestRight) {
            widest = inner;
            widestRight = right;
        }
    }
    return widest;
};

export const clippedEntry = function clippedEntry(
    page: ProbePage,
    rules: ViewportRules,
    probe: ViewportProbe,
    element: Element,
): string | null {
    const style = page.getComputedStyle(element);
    const hidesExtra = rules.cuttingOverflow.includes(style.overflowX) && style.textOverflow !== "ellipsis";
    if (!hidesExtra || element.scrollWidth <= element.clientWidth + rules.tolerancePx) {
        return null;
    }
    const widest = probe.widestDescendant(element);
    const cause = widest === null ? "" : ` by ${probe.describeElement(widest)}`;
    return `${probe.describeElement(element)} ${String(element.clientWidth)}/${String(element.scrollWidth)}${cause}`;
};

export const smallTextEntry = function smallTextEntry(
    page: ProbePage,
    rules: ViewportRules,
    probe: ViewportProbe,
    element: Element,
): string | null {
    const size = probe.pixelsOf(page.getComputedStyle(element).fontSize);
    const ownText = [...element.childNodes].some(
        (node) => node.nodeType === node.TEXT_NODE && (node.textContent ?? "").trim().length > 0,
    );
    const drawn = element.closest(rules.drawingSelector) !== null;
    return ownText && !drawn && size < rules.textMinPx ? `${probe.describeElement(element)} ${String(size)}px` : null;
};

export const layoutFindings = function layoutFindings(
    page: ProbePage,
    rules: ViewportRules,
    probe: ViewportProbe,
): LayoutFindings {
    const escaping: Element[] = [];
    const clipped: string[] = [];
    const text: string[] = [];
    const shown = [...page.document.querySelectorAll("body *")].filter((element) =>
        probe.isAuditable(page, rules, element),
    );
    for (const element of shown) {
        if (!escaping.some((node) => node.contains(element)) && probe.escapesScreen(page, rules, element)) {
            escaping.push(element);
        }
        const cut = probe.clippedEntry(page, rules, probe, element);
        const small = probe.smallTextEntry(page, rules, probe, element);
        clipped.push(...(cut === null ? [] : [cut]));
        text.push(...(small === null ? [] : [small]));
    }
    const overflow = escaping.map((element) => {
        const box = element.getBoundingClientRect();
        return `${probe.describeElement(element)} ${String(Math.round(box.left))}..${String(Math.round(box.right))}`;
    });
    return { clipped, overflow, text: probe.countedEntries(text) };
};

export const controlFindings = function controlFindings(
    page: ProbePage,
    rules: ViewportRules,
    probe: ViewportProbe,
): ControlFindings {
    const inputs = [...page.document.querySelectorAll(rules.fieldSelector)]
        .filter((element) => probe.isAuditable(page, rules, element))
        .map((element) => ({
            name: probe.describeElement(element),
            size: probe.pixelsOf(page.getComputedStyle(element).fontSize),
        }))
        .filter((field) => field.size < rules.inputMinPx)
        .map((field) => `${field.name} ${String(field.size)}px`);
    const targets: string[] = [];
    for (const element of page.document.querySelectorAll(rules.targetSelector)) {
        const inline =
            page.getComputedStyle(element).display === "inline" && element.closest(rules.inlineSelector) !== null;
        const box = element.getBoundingClientRect();
        const small = box.width < rules.targetMinPx || box.height < rules.targetMinPx;
        if (!inline && small && probe.isAuditable(page, rules, element)) {
            targets.push(
                `${probe.describeElement(element)} ${String(Math.round(box.width))}x${String(Math.round(box.height))}`,
            );
        }
    }
    return { inputs, targets: probe.countedEntries(targets) };
};

export const auditPage = function auditPage(
    page: ProbePage,
    rules: ViewportRules,
    probe: ViewportProbe,
): ViewportAudit {
    const root = page.document.getElementById(rules.scrollRootId);
    const rootScrolls = root !== null && root.scrollWidth > root.clientWidth + rules.tolerancePx;
    const layout = probe.layoutFindings(page, rules, probe);
    const controls = probe.controlFindings(page, rules, probe);
    return {
        ...layout,
        ...controls,
        scrollsSideways: rootScrolls || page.document.documentElement.scrollWidth > page.innerWidth,
        viewport: page.innerWidth,
    };
};

export const scrollThrough = async function scrollThrough(page: ProbePage, rules: ViewportRules): Promise<number> {
    const root = page.document.getElementById(rules.scrollRootId) ?? page.document.documentElement;
    const step = Math.max(root.clientHeight, 1);
    const pause = async (): Promise<void> =>
        new Promise((settle) => {
            setTimeout(settle, rules.scrollPauseMs);
        });
    const visit = async (top: number, stops: number): Promise<number> => {
        if (top >= root.scrollHeight) {
            root.scrollTop = 0;
            return stops;
        }
        root.scrollTop = top;
        await pause();
        return visit(top + step, stops + 1);
    };
    const stops = await visit(0, 0);
    await pause();
    return stops;
};

export const VIEWPORT_PROBE: ViewportProbe = {
    clippedEntry,
    controlFindings,
    countedEntries,
    describeElement,
    escapesScreen,
    isAuditable,
    layoutFindings,
    pixelsOf,
    smallTextEntry,
    widestDescendant,
};
