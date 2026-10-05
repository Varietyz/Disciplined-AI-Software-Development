import { DRIFT_CODES, README_FILE } from "#configuration/constants/document.constants";
import type { DocModule, ModuleOutput, Spec, SpecEngine, SpecOutputsDeps } from "#types/document.output.types";
import { resolve, sep } from "node:path";
import type { Charts } from "#types/figure.types";
import type { DocumentDecl } from "#types/document.types";
import type { ManifestModule } from "#types/manifest.types";
import { REPO_METRICS_LAYER } from "#configuration/constants/layer.constants";
import { relativePath } from "@ssot/paths";
import { renderChartsFor } from "#core/coordinators/figure.coordinator";
import { stampGenerated } from "@govlab/canonical-write";
import { stripConcern } from "#core/converters/layer.converter";
import { validateCharts } from "#core/validators/diagram.validator";

const LABEL_SEPARATOR = "/";

const withoutRepoMetrics = function withoutRepoMetrics(text: string): string {
    return stripConcern(text, REPO_METRICS_LAYER);
};

const unchanged = function unchanged(text: string): string {
    return text;
};

const membersBelow = function membersBelow(all: readonly ManifestModule[], moduleDir: string): ManifestModule[] {
    const prefix = resolve(moduleDir) + sep;
    return all.filter((member) => resolve(member.dir).startsWith(prefix));
};

export class SpecOutputs {
    private readonly discoverAll: () => ManifestModule[];
    private readonly engine: SpecEngine;
    private readonly formatMarkdown: (markdown: string) => Promise<string>;
    private readonly root: string;

    public constructor(deps: SpecOutputsDeps) {
        this.discoverAll = deps.discoverAll;
        this.engine = deps.engine;
        this.formatMarkdown = deps.formatMarkdown;
        this.root = deps.root;
    }

    public async moduleOutputs(module: DocModule): Promise<ModuleOutput> {
        const members = membersBelow(this.discoverAll(), module.dir);
        const charts = await renderChartsFor(module.dir, module.label, members);
        const hasCharts = charts !== null;
        return {
            shared: { charts, hasCharts, isAggregate: members.length > 0 },
            specs: [
                ...this.readmeSpecs(module, hasCharts),
                ...this.documentSpecs(module),
                ...this.chartSpecs(module, charts),
            ],
        };
    }

    private async composeReadme(moduleDir: string, onDisk: string, hasCharts: boolean): Promise<string> {
        const body = await this.formatMarkdown(this.engine.generateReadme(moduleDir, hasCharts));
        return stampGenerated(body, onDisk, new Date(), withoutRepoMetrics);
    }

    private readmeSpecs(module: DocModule, hasCharts: boolean): Spec[] {
        if (module.manifest.docs === undefined) {
            return [];
        }
        return [
            {
                driftCode: DRIFT_CODES.readme,
                label: [module.label, README_FILE].join(LABEL_SEPARATOR),
                normalize: withoutRepoMetrics,
                path: resolve(module.dir, README_FILE),
                produce: async (onDisk) => this.composeReadme(module.dir, onDisk, hasCharts),
            },
        ];
    }

    private docLocation(doc: DocumentDecl): string | null {
        try {
            return this.engine.declaredDocLocation(doc);
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }
            return null;
        }
    }

    private documentSpec(doc: DocumentDecl): Spec[] {
        const rel = this.docLocation(doc);
        if (rel === null) {
            return [];
        }
        return [
            {
                driftCode: DRIFT_CODES.doc,
                label: rel,
                mkdir: true,
                normalize: unchanged,
                path: resolve(this.root, rel),
                produce: async (onDisk) =>
                    stampGenerated(await this.formatMarkdown(this.engine.renderDeclaredDoc(doc)), onDisk, new Date()),
            },
        ];
    }

    private documentSpecs(module: DocModule): Spec[] {
        const { documents } = module.manifest;
        return Array.isArray(documents) ? documents.flatMap((doc) => this.documentSpec(doc)) : [];
    }

    private chartSpecs(module: DocModule, charts: Charts | null): Spec[] {
        if (charts === null) {
            return [];
        }
        return [
            {
                driftCode: DRIFT_CODES.charts,
                gate: validateCharts,
                gateCode: DRIFT_CODES.chartSyntax,
                harden: true,
                label: [module.label, relativePath("moduleInfo.charts")].join(LABEL_SEPARATOR),
                mkdir: true,
                normalize: unchanged,
                path: charts.path,
                produce: async (onDisk) =>
                    stampGenerated(await this.formatMarkdown(charts.content), onDisk, new Date()),
            },
        ];
    }
}
