import type { Discovery, Inline } from "#types/site.types";
import type { SourceBody, SourceSubject } from "@banes-lab/web/types/page.types.js";
import type { ModuleRunner } from "vite/module-runner";
import type { SectionExporter } from "#types/section.types";

export interface PageHead {
    readonly description: string;
    readonly path: string;
    readonly robots: string;
    readonly title: string;
}

export interface PageDefinition {
    readonly content: unknown;
    readonly description: string;
    readonly id: string;
    readonly title: string;
}

export interface PageRegistry {
    readonly loadCompletePage: (id: string) => Promise<PageDefinition | undefined>;
    readonly loadPage: (id: string) => Promise<PageDefinition | undefined>;
    readonly loadedPage: (id: string) => PageDefinition | undefined;
}

export interface PageRenderer {
    readonly applyHead: (root: Document, head: PageHead) => void;
    readonly headOf: (page: string, definition?: PageDefinition, pathname?: string) => PageHead;
    readonly renderStaticPage: (page: string) => readonly Element[];
    readonly sourceHead: (subject: SourceSubject) => PageHead;
}

export interface Links {
    readonly SITE_URL: string;
    readonly pagePath: (page: string) => string;
    readonly tabLink: (page: string, tab: string, section?: string) => string;
}

export type RouteExporter = (path: string, page: string, sections: readonly string[]) => string;

export interface Loaded {
    readonly author: string;
    readonly consent: string;
    readonly exportSections: SectionExporter;
    readonly exportText: RouteExporter;
    readonly ids: readonly string[];
    readonly inline: Inline;
    readonly links: Links;
    readonly main: string;
    readonly name: string;
    readonly registry: PageRegistry;
    readonly renderer: PageRenderer;
    readonly runner: ModuleRunner;
    readonly summary: string;
    readonly visit: (path: string) => void;
}

export type SiteSource = Pick<Loaded, "author" | "consent" | "exportText" | "ids" | "inline" | "name" | "summary"> & {
    readonly links: Pick<Links, "SITE_URL" | "tabLink">;
    readonly registry: Pick<PageRegistry, "loadedPage">;
    readonly renderer: Pick<PageRenderer, "headOf">;
};

export type PageSource = Pick<Loaded, "main" | "visit"> & {
    readonly registry: Pick<PageRegistry, "loadedPage">;
    readonly renderer: Pick<PageRenderer, "applyHead" | "headOf" | "renderStaticPage">;
};

export interface SourceBodyRenderer {
    readonly renderSourceBody: (body: SourceBody, text: string | null) => Element;
}

export interface SourcePageSource {
    readonly body: SourceBodyRenderer;
    readonly main: string;
    readonly renderer: Pick<PageRenderer, "applyHead" | "sourceHead">;
    readonly site: string;
}

export interface TextConverter {
    readonly exportText: (element: Element) => string;
}

export interface TranscriptRenderer {
    readonly renderTranscripts: (root: Element, recordings: readonly unknown[]) => void;
}

export interface PageRoute {
    readonly page: string;
    readonly path: string;
}

export interface Prerendered {
    readonly catalog: number;
    readonly routes: number;
    readonly sources: number;
}

export interface DevState {
    readonly discovery: Discovery;
    readonly loaded: Loaded;
}
