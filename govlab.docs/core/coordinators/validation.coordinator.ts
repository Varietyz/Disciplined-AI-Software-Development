import type { Categories, Finding, NameFinding, PerDocEntry } from "#types/finding.types";
import type { DocGraph, DocMeta, DocNode } from "#types/document.types";
import { REF_COLLECTIONS, createGovlabContext } from "@govlab/context";
import {
    analyzeSync,
    docMeta,
    docNodeFor,
    locationEntryOf,
    nameFindingFor,
    refScanOf,
} from "#core/analyzers/document.analyzer";
import { countFindings, sumCategories } from "#core/counters/finding.counter";
import {
    deadGovernsEdge,
    deadNameEdge,
    dependsOnCycle,
    docNameFinding,
    duplicateDocName,
} from "#configuration/strings/document.strings";
import { declaredSlotsOf, slotFamiliesOf, slotRefs } from "#core/parsers/binding.parser";
import { expectedText, summaryLine } from "#core/formatters/finding.formatter";
import { print, printErr } from "#core/reporters/base.reporter";
import { unboundSlot, unresolvedOntologyRef } from "#configuration/strings/reference.strings";
import type { ChartChecker } from "#types/diagram.types";
import type { DocEntry } from "#types/location.types";
import type { ValidateCtx } from "#types/environment.types";
import { buildDocGraph } from "#core/analyzers/graph.analyzer";
import { collidePaths } from "#core/analyzers/location.analyzer";
import { createMermaidChecker } from "#core/validators/diagram.validator";
import { emitFindings } from "#core/reporters/finding.reporter";
import { existsSync } from "node:fs";
import { isGeneratedDoc } from "#core/predicates/document.predicate";
import { join } from "node:path";
import { ontologyRefs } from "#core/parsers/ontology.parser";
import { pathCollision } from "#configuration/strings/finding.strings";
import { readTextSafe } from "#core/loaders/base.loader";
import { resolveRefs } from "#core/validators/reference.validator";

const POSIX_SEPARATOR = "/";
const CYCLE_JOIN = " → ";
const SOURCE_JOIN = ", ";

interface SlotTable {
    declared: ReadonlySet<string>;
    families: ReadonlySet<string>;
}

export class DocValidator {
    private readonly context: ValidateCtx;
    private readonly docNodes: DocNode[] = [];
    private readonly locationEntries: DocEntry[] = [];
    private readonly mermaid: ChartChecker;
    private readonly nameFindings: NameFinding[] = [];
    private resolveRef: ((ref: string) => boolean) | null = null;
    private slots: SlotTable | null = null;

    public constructor(context: ValidateCtx, mermaid: ChartChecker = createMermaidChecker()) {
        this.context = context;
        this.mermaid = mermaid;
    }

    public async run(docs: readonly string[]): Promise<number> {
        const entries = await Promise.all(docs.map(async (doc) => this.analyze(doc)));
        const perDoc = entries.filter((entry): entry is PerDocEntry => entry !== null);
        return this.report(docs.length, perDoc);
    }

    private async analyze(doc: string): Promise<PerDocEntry | null> {
        const source = readTextSafe(doc) ?? "";
        if (isGeneratedDoc(source)) {
            return null;
        }
        const meta = docMeta(this.context, doc, source);
        this.register(meta);
        const all: Categories = {
            ...analyzeSync(this.context, meta),
            ontologyRefs: this.ontologyFindings(meta),
            refsResolved: this.refFindings(meta),
            slotRefs: this.slotFindings(meta),
            syntax: await this.mermaid.check(source),
        };
        return countFindings(all) === 0 ? null : { all, relDoc: meta.relDoc };
    }

    private refFindings(meta: DocMeta): Finding[] {
        const [segment = ""] = meta.relDoc.split(POSIX_SEPARATOR);
        const { root } = this.context;
        const roots = segment === "" ? [root] : [root, join(root, segment)];
        return resolveRefs(refScanOf(this.context, meta).constructs, { roots, verbs: this.context.userReg.refVerbs });
    }

    private ontologyFindings(meta: DocMeta): Finding[] {
        const refs = ontologyRefs(meta.source, REF_COLLECTIONS);
        if (refs.length === 0) {
            return [];
        }
        this.resolveRef ??= createGovlabContext().resolveRef;
        const resolves = this.resolveRef;
        return refs
            .filter((found) => !resolves(found.ref))
            .map((found) => ({ col: found.col, detail: unresolvedOntologyRef(found.ref), line: found.line }));
    }

    private slotTable(): SlotTable | null {
        const adapter = this.context.harnessAdapter;
        if (adapter === null) {
            return null;
        }
        if (this.slots === null) {
            const declared = declaredSlotsOf(readTextSafe(join(this.context.root, adapter)) ?? "");
            this.slots = { declared, families: slotFamiliesOf(declared) };
        }
        return this.slots;
    }

    private slotFindings(meta: DocMeta): Finding[] {
        const table = this.slotTable();
        if (table === null || meta.delegated || meta.relDoc === this.context.harnessAdapter) {
            return [];
        }
        return slotRefs(meta.source, table.families)
            .filter((found) => !table.declared.has(found.slot))
            .map((found) => ({ col: found.col, detail: unboundSlot(found.slot), line: found.line }));
    }

    private register(meta: DocMeta): void {
        const entry = locationEntryOf(this.context, meta);
        if (entry !== null) {
            this.locationEntries.push(entry);
        }
        const node = docNodeFor(this.context, meta);
        if (node !== null) {
            this.docNodes.push(node);
        }
        const names = nameFindingFor(this.context, meta);
        if (names !== null) {
            this.nameFindings.push(names);
        }
    }

    private report(scanned: number, perDoc: readonly PerDocEntry[]): number {
        for (const entry of perDoc) {
            emitFindings(entry.relDoc, entry.all);
        }
        const totals = {
            ...sumCategories(perDoc),
            collision: this.emitCollisions(),
            deadEdge: this.emitGraph(),
            name: this.emitNames(),
        };
        print(summaryLine(scanned, perDoc.length, totals));
        return Object.values(totals).reduce((sum, count) => sum + count, 0);
    }

    private emitCollisions(): number {
        const collisions = collidePaths(this.locationEntries, this.context.registries, this.context.locationOptions);
        for (const collision of collisions) {
            printErr(pathCollision(collision.path, collision.sources.length, collision.sources.join(SOURCE_JOIN)));
        }
        return collisions.length;
    }

    private emitGoverns(graph: DocGraph): number {
        const dead = graph.nodes.flatMap((node) =>
            node.governs
                .filter((target) => !existsSync(join(this.context.root, target)))
                .map((target) => ({ node, target })),
        );
        for (const { node, target } of dead) {
            printErr(deadGovernsEdge(node.relPath, target));
        }
        return dead.length;
    }

    private emitGraph(): number {
        const graph = buildDocGraph(this.docNodes);
        for (const edge of graph.deadEdges) {
            printErr(deadNameEdge(edge.relPath, edge.field, edge.target));
        }
        for (const cycle of graph.cycles) {
            printErr(dependsOnCycle(cycle.join(CYCLE_JOIN)));
        }
        for (const name of graph.duplicateNames) {
            printErr(duplicateDocName(name));
        }
        return this.emitGoverns(graph) + graph.deadEdges.length + graph.cycles.length + graph.duplicateNames.length;
    }

    private emitNames(): number {
        const flat = this.nameFindings.flatMap((finding) =>
            finding.names.map((hit) => ({ hit, relDoc: finding.relDoc })),
        );
        for (const { hit, relDoc } of flat) {
            printErr(docNameFinding(relDoc, hit.detail ?? "", expectedText(hit)));
        }
        return flat.length;
    }
}
