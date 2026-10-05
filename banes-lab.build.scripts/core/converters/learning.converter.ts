import type {
    Block,
    BlockStop,
    LearningRouter,
    SectionRecord,
    Stop,
    TabRecord,
    TabsFor,
    Unit,
} from "#types/learning.types";
import type { ContentGraph, GraphSection } from "@banes-lab/web/types/methodology.types.js";
import {
    FOLDED_CHARACTERS,
    SITE_PAGES,
    SPINE,
    UNSAFE_LABEL_CHARACTERS,
} from "#configuration/constants/learning.constants";
import { conceptTeachers, nodeOf } from "@banes-lab/content/core/converters/section.converter.ts";
import { isRecord } from "#core/selectors/base.selector";

const FRAGMENT = "#";
const SUBSTITUTE = "'";
const SEPARATOR = " - ";
const LOWEST = 32;
const HIGHEST = 126;
const TWO_DIGITS = 10;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const chunkCode = function chunkCode(index: number): string {
    const first = ALPHABET[Math.floor(index / ALPHABET.length) % ALPHABET.length] ?? "";
    const second = ALPHABET[index % ALPHABET.length] ?? "";
    return `${first}${second}`;
};

export const textOf = function textOf(value: unknown): string {
    return typeof value === "string" ? value : "";
};

export const sectionsIn = function sectionsIn(tab: TabRecord): readonly SectionRecord[] {
    const sections: unknown = tab.sections;
    if (!Array.isArray(sections)) {
        return [];
    }
    return sections.filter(isRecord).filter((section: SectionRecord) => textOf(section.title).length > 0);
};

export const safeLabel = function safeLabel(title: string): string {
    return Array.from(new Intl.Segmenter().segment(title), (part) => part.segment)
        .map((character) => FOLDED_CHARACTERS.get(character) ?? character)
        .map((character) => (UNSAFE_LABEL_CHARACTERS.has(character) ? SUBSTITUTE : character))
        .filter((character) => {
            const code = character.codePointAt(0) ?? 0;
            return code >= LOWEST && code <= HIGHEST;
        })
        .join("");
};

const ordinal = function ordinal(value: number): string {
    return value < TWO_DIGITS ? `0${String(value)}` : String(value);
};

export const heldIn = function heldIn(
    graph: ContentGraph,
    sections: readonly SectionRecord[],
): readonly GraphSection[] {
    const byId = new Map(Object.entries(graph.sections));
    return sections.flatMap((section) => {
        const held = byId.get(textOf(section.id));
        return held === undefined ? [] : [held];
    });
};

export const unitsOf = function unitsOf(
    page: string,
    graph: ContentGraph,
    tabs: readonly TabRecord[],
): readonly Unit[] {
    return tabs.flatMap((tab, index) => {
        const sections = sectionsIn(tab);
        const held = heldIn(graph, sections);
        const teaches = held.flatMap((entry) => entry.teaches);
        if (teaches.length === 0) {
            return [];
        }
        const inside = new Set(teaches);
        const external = [...new Set(held.flatMap((entry) => entry.requires))].filter(
            (concept) => !inside.has(concept),
        );
        return [
            { external, first: index === 0, label: textOf(tab.label), page, sections, tab: textOf(tab.id), teaches },
        ];
    });
};

const readyIn = function readyIn(pending: readonly Unit[], taught: ReadonlySet<string>): Unit | undefined {
    return pending.find((unit) => unit.external.every((concept) => taught.has(concept)));
};

export const orderUnits = function orderUnits(spine: readonly Unit[], others: readonly Unit[]): readonly Unit[] {
    const ordered: Unit[] = [];
    const taught = new Set<string>();
    let pending = [...others];
    const emit = function emit(unit: Unit): void {
        ordered.push(unit);
        for (const concept of unit.teaches) {
            taught.add(concept);
        }
    };
    const drain = function drain(): void {
        const ready = readyIn(pending, taught);
        if (ready === undefined) {
            return;
        }
        emit(ready);
        pending = pending.filter((unit) => unit !== ready);
        drain();
    };
    for (const unit of spine) {
        emit(unit);
        drain();
    }
    for (const unit of pending) {
        emit(unit);
    }
    return ordered;
};

interface Draft {
    readonly node: string;
    readonly requires: readonly string[];
    readonly stop: Omit<Stop, "requires">;
}

const draftsOf = function draftsOf(
    router: LearningRouter,
    units: readonly Unit[],
    graphs: readonly ContentGraph[],
): Draft[] {
    const byPage = new Map(graphs.map((graph) => [graph.page, graph]));
    const drafts: Draft[] = [];
    for (const [chunk, unit] of units.entries()) {
        for (const section of unit.sections) {
            const id = textOf(section.id);
            const number = drafts.length + 1;
            drafts.push({
                node: nodeOf(unit.page, id),
                requires: byPage.get(unit.page)?.sections[id]?.requires ?? [],
                stop: {
                    block: unit.label,
                    code: chunkCode(chunk),
                    id: `${chunkCode(chunk)}${String(drafts.length + 1)}`,
                    label: `${ordinal(number)}${SEPARATOR}${safeLabel(textOf(section.title))}`,
                    owner: unit.page,
                    path: unit.first
                        ? router.pagePath(unit.page) + FRAGMENT + id
                        : router.tabLink(unit.page, unit.tab, id),
                },
            });
        }
    }
    return drafts;
};

export const teachingRoute = function teachingRoute(
    router: LearningRouter,
    graphs: readonly ContentGraph[],
    tabsFor: TabsFor,
): readonly Stop[] {
    const byPage = new Map(graphs.map((graph) => [graph.page, graph]));
    const unitsFor = function unitsFor(page: string): readonly Unit[] {
        const graph = byPage.get(page);
        return graph === undefined ? [] : unitsOf(page, graph, tabsFor(page));
    };
    const others = SITE_PAGES.filter((page) => page !== SPINE).flatMap(unitsFor);
    const drafts = draftsOf(router, orderUnits(unitsFor(SPINE), others), graphs);
    const teachers = conceptTeachers(graphs);
    const idOf = new Map(drafts.map((draft) => [draft.node, draft.stop.id]));
    return drafts.map((draft) => {
        const required = draft.requires.flatMap((concept) => {
            const id = idOf.get(teachers.get(concept)?.at(-1) ?? "");
            return id === undefined || id === draft.stop.id ? [] : [id];
        });
        return { ...draft.stop, requires: [...new Set(required)] };
    });
};

export const teachingBlocks = function teachingBlocks(stops: readonly Stop[]): readonly Block[] {
    const blocks: { code: string; label: string; owner: string; stops: BlockStop[] }[] = [];
    let held: string | null = null;
    for (const stop of stops) {
        if (stop.code !== held) {
            blocks.push({ code: stop.code, label: stop.block, owner: stop.owner, stops: [] });
            held = stop.code;
        }
        blocks.at(-1)?.stops.push({ id: stop.id, label: stop.label, path: stop.path, requires: stop.requires });
    }
    return blocks;
};
