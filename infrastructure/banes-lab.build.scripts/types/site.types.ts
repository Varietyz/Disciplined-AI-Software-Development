import type { BuiltOntology } from "#types/ontology.types";
import type { DiagramWalk } from "#types/diagram.types";

export interface DiscoveredRoute {
    readonly description: string;
    readonly label: string;
    readonly markdown: string;
    readonly page: string;
    readonly path: string;
    readonly tab: string | null;
    readonly title: string;
}

export interface DiscoveredPage extends DiscoveredRoute {
    readonly content: unknown;
    readonly id: string;
}

export interface SitemapPart {
    readonly body: string;
    readonly route: string;
}

export interface Discovery {
    readonly author: string;
    readonly consent: string;
    readonly name: string;
    readonly pages: readonly DiscoveredPage[];
    readonly routes: readonly DiscoveredRoute[];
    readonly site: string;
    readonly summary: string;
}

export interface FullTextPart {
    readonly file: string;
    readonly label: string;
    readonly routes: readonly DiscoveredRoute[];
}

export type Inline = (markup: string) => string;

export type SiteMode = "build" | "serve";

export interface SiteState {
    readonly diagrams: DiagramWalk;
    readonly mode: SiteMode;
    readonly ontology: BuiltOntology | null;
    readonly outDir: string;
    readonly root: string;
}

export type SitePhase = "close" | "start";

export interface SiteOutcome {
    readonly gives: Partial<SiteState>;
    readonly line: string;
}

export interface CacheDecision {
    readonly key: string | null;
    readonly skip: boolean;
}

export interface StepCache {
    readonly key: (state: SiteState) => string;
    readonly outputs: readonly string[];
}

export interface SiteStep {
    readonly cache: StepCache | null;
    readonly gives: readonly string[];
    readonly modes: readonly SiteMode[];
    readonly name: string;
    readonly needs: readonly string[];
    readonly phase: SitePhase;
    readonly run: (state: SiteState) => Promise<SiteOutcome>;
}

export interface StepSpec {
    readonly cache: StepCache | null;
    readonly gives?: readonly string[];
    readonly modes?: readonly SiteMode[];
    readonly name: string;
    readonly needs?: readonly string[];
    readonly phase: SitePhase;
    readonly run: (state: SiteState) => Promise<SiteOutcome>;
}
