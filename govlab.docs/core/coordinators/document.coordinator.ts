import type {
    CheckOptions,
    DocChecksDeps,
    DocModule,
    ModuleOutput,
    ModuleSelection,
    Spec,
    WorkspaceMap,
} from "#types/document.output.types";
import { DRIFT_CODES, MANIFEST_FILE, README_FILE } from "#configuration/constants/document.constants";
import {
    checkSummary,
    duplicatePrinciple,
    generateSummary,
    healedCount,
    manifestMissing,
    noDocsBlock,
    noManifest,
    writtenLabel,
} from "#configuration/strings/package.strings";
import { driftFinding, healed } from "#configuration/strings/drift.strings";
import { print, printErr } from "#core/reporters/base.reporter";
import { readJsonSafe, readTextSafe } from "#core/loaders/base.loader";
import type { CheckResult } from "#types/finding.types";
import type { ManifestModule } from "#types/manifest.types";
import type { ModuleDocs } from "#types/readme.types";
import { ROOT } from "@ssot/paths";
import { analyzabilityMessages } from "#core/validators/barrel.validator";
import { checkSpec } from "#core/coordinators/drift.coordinator";
import { governanceMessages } from "#core/validators/readme.validator";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { membersWithoutManifest } from "#core/loaders/package.loader";
import { persistWorkspaceMap } from "#core/persistence/document.persistence";
import { resolve } from "node:path";
import { staleChartsMessages } from "#core/validators/figure.validator";

const EMPTY_RESULT: CheckResult = { errors: [], heals: [] };

const reportChecks = function reportChecks(result: CheckResult, fix: boolean): void {
    for (const message of result.errors) {
        printErr(message);
    }
    for (const message of result.heals) {
        print(message);
    }
    print(checkSummary(result.errors.length, fix ? healedCount(result.heals.length) : ""));
};

const selectModules = function selectModules(
    all: readonly ManifestModule[],
    selection: ModuleSelection,
): ManifestModule[] {
    const { only } = selection;
    if (selection.workspaceMapOnly) {
        return [];
    }
    return only === null ? [...all] : all.filter((module) => only.has(module.relPath));
};

const includesWorkspaceMap = function includesWorkspaceMap(selection: ModuleSelection): boolean {
    return selection.workspaceMapOnly || selection.only === null;
};

const merge = function merge(results: readonly CheckResult[]): CheckResult {
    return { errors: results.flatMap((result) => result.errors), heals: results.flatMap((result) => result.heals) };
};

export class DocChecks {
    private readonly discoverAll: () => ManifestModule[];
    private readonly engine: ModuleDocs;
    private readonly generatedPrefix: string;
    private readonly moduleOutputs: (module: DocModule) => Promise<ModuleOutput>;
    private readonly workspaceMapTarget: () => Promise<WorkspaceMap | null>;
    private readonly writeSpec: (spec: Spec, content: string) => void;

    public constructor(deps: DocChecksDeps) {
        this.discoverAll = deps.discoverAll;
        this.engine = deps.engine;
        this.generatedPrefix = deps.generatedPrefix;
        this.moduleOutputs = deps.moduleOutputs;
        this.workspaceMapTarget = deps.workspaceMapTarget;
        this.writeSpec = deps.writeSpec;
    }

    public async checkModules(options: CheckOptions): Promise<number> {
        const { fix } = options;
        const perModule = await Promise.all(
            selectModules(this.discoverAll(), options).map(async (module) => this.checkOneModule(module, fix)),
        );
        const mapResult = includesWorkspaceMap(options) ? await this.workspaceMapCheck(fix) : EMPTY_RESULT;
        const coverage = { errors: membersWithoutManifest(ROOT).map(manifestMissing), heals: [] };
        const result = merge([coverage, ...perModule, mapResult]);
        reportChecks(result, fix);
        return result.errors.length;
    }

    public async generateAll(selection: ModuleSelection): Promise<void> {
        const counts = await Promise.all(
            selectModules(this.discoverAll(), selection).map(async (module) =>
                this.writeSpecs((await this.moduleOutputs(module)).specs),
            ),
        );
        const mapRel = includesWorkspaceMap(selection) ? await this.writeWorkspaceMap() : null;
        if (mapRel !== null) {
            print(writtenLabel(mapRel));
        }
        const total = counts.reduce((sum, count) => sum + count, mapRel === null ? 0 : 1);
        print(generateSummary(total));
    }

    public async writeOne(targetDir: string): Promise<void> {
        const dir = resolve(targetDir);
        const manifest = readJsonSafe(resolve(dir, MANIFEST_FILE));
        if (!isPlainRecord(manifest)) {
            throw new Error(noManifest(targetDir));
        }
        if (manifest.docs === undefined) {
            throw new Error(noDocsBlock(targetDir));
        }
        const { specs } = await this.moduleOutputs({ dir, label: targetDir, manifest, relPath: targetDir });
        await this.writeSpecs(specs);
    }

    private async checkOneModule(module: ManifestModule, fix: boolean): Promise<CheckResult> {
        const { specs, shared } = await this.moduleOutputs(module);
        const onDiskReadme = readTextSafe(resolve(module.dir, README_FILE)) ?? "";
        const specResults = await Promise.all(specs.map(async (spec) => checkSpec(spec, fix, this.writeSpec)));
        const governance = governanceMessages(this.engine, module, {
            generatedPrefix: this.generatedPrefix,
            onDiskReadme,
        });
        return {
            errors: [
                ...governance,
                ...specResults.flatMap((result) => result.errors),
                ...analyzabilityMessages(module, shared.isAggregate),
                ...staleChartsMessages(module, shared.hasCharts),
            ],
            heals: specResults.flatMap((result) => result.heals),
        };
    }

    private async writeWorkspaceMap(): Promise<string | null> {
        const map = await this.workspaceMapTarget();
        if (map === null) {
            return null;
        }
        persistWorkspaceMap(map);
        return map.rel;
    }

    private async workspaceMapDrift(fix: boolean): Promise<CheckResult> {
        const map = await this.workspaceMapTarget();
        if (map === null || map.content === (readTextSafe(map.path) ?? "")) {
            return EMPTY_RESULT;
        }
        if (!fix) {
            return { errors: [driftFinding(map.rel, DRIFT_CODES.doc)], heals: [] };
        }
        persistWorkspaceMap(map);
        return { errors: [], heals: [healed(map.rel)] };
    }

    private async workspaceMapCheck(fix: boolean): Promise<CheckResult> {
        const ontology = { errors: this.engine.ontologyDuplicates().map(duplicatePrinciple), heals: [] };
        return merge([ontology, await this.workspaceMapDrift(fix)]);
    }

    private async writeSpecs(specs: readonly Spec[]): Promise<number> {
        await Promise.all(
            specs.map(async (spec) => {
                this.writeSpec(spec, await spec.produce(readTextSafe(spec.path) ?? ""));
                print(writtenLabel(spec.label));
            }),
        );
        return specs.length;
    }
}
