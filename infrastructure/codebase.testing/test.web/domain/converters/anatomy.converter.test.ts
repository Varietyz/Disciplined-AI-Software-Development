import {
    ANATOMY_CHAPTER,
    MEASUREMENTS_TAG,
    STRUCTURE_TAG,
} from "@banes-lab/web/configuration/strings/anatomy.strings.ts";
import {
    CALLABLE_LABEL,
    FILES_LABEL,
    FILES_NOUN,
    FILE_NOUN,
    FINDINGS_LABEL,
    FLOW_SUFFIX,
    HEADINGS_LABEL,
    IMPORT_NOUN,
    NO_ANOMALIES,
    treeMeasureOf,
} from "@banes-lab/web/configuration/strings/folder.strings.ts";
import {
    CONFIG_TAB,
    COORDINATION_TAB,
    DERIVED_SECTION_ID,
    GOVERNANCE_TAB,
    PARTS_SECTION_ID,
    TREE_TAB,
} from "@banes-lab/web/core/ids/anatomy.ids.ts";
import { ANATOMY_MEASURES } from "@banes-lab/web/core/generated/anatomy.measures.generated.ts";
import {
    IMPORT_DIAGRAM_HEADER,
    STATS_SEPARATOR,
    STRUCTURE_ARROW,
    STRUCTURE_DIAGRAM_HEADER,
} from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { anatomyChapter, statsMetrics } from "@banes-lab/web/domain/converters/anatomy.fragment.converter.ts";
import { codeReferencesOf, targetIn, unquoted } from "@banes-lab/web/core/converters/code.converter.ts";
import { describe, expect, it } from "vitest";
import { documentBlocks, documentChips } from "@banes-lab/web/domain/converters/document.converter.ts";
import { importsDiagram, structureDiagram } from "@banes-lab/web/domain/converters/graph.converter.ts";
import {
    languageOf,
    nodeRoute,
    pathLabel,
    sourceTitle,
    treeLabelOf,
} from "@banes-lab/web/domain/converters/source.converter.ts";
import { localPath, parentPath, qualifiedPath, treeOf } from "@banes-lab/web/core/converters/folder.converter.ts";
import { ANATOMY } from "@banes-lab/web/core/generated/anatomy.generated.ts";
import { ANATOMY_TREES } from "@banes-lab/web/core/registries/anatomy.registry.ts";
import { ANATOMY_TREE_DECLARATIONS } from "@banes-lab/web/core/registries/anatomy.tree.registry.ts";
import type { DocumentView } from "@banes-lab/web/types/anatomy.types.ts";
import { NONE_LABEL } from "@banes-lab/web/configuration/strings/ontology.strings.ts";
import { TITLE_SEPARATOR } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { TYPESCRIPT_LANGUAGE } from "@banes-lab/web/configuration/constants/code.constants.ts";
import { citedDefinition } from "@banes-lab/web/core/loaders/definition.loader.ts";
import { definitionIndexOf } from "@banes-lab/web/core/converters/definition.converter.ts";
import { literalTarget } from "@banes-lab/web/core/converters/literal.converter.ts";
import { nounFor } from "@banes-lab/web/core/converters/text.converter.ts";
import { treeTab } from "@banes-lab/web/domain/converters/anatomy.converter.ts";

const DOCUMENT: DocumentView = {
    boundary: true,
    concern: null,
    constructs: 2,
    fields: ["name", "status"],
    findings: [{ category: "smell", code: "history-smell", col: 3, line: 4, text: "state current truth only" }],
    form: "readme",
    headings: 5,
    mermaid: 1,
    paths: 7,
};

describe("languageOf", () => {
    it("maps a file name to its code language by extension, falling back to plain text", () => {
        expect(languageOf("walk.component.ts")).toBe(TYPESCRIPT_LANGUAGE);
        expect(languageOf("README.md")).toBe("markdown");
        expect(languageOf("notes.unknown")).toBe("text");
    });
});

describe("nodeRoute and sourceTitle", () => {
    it("routes a file and a folder under their tree's tab, and titles a node with its tree and path", () => {
        const file = qualifiedPath(GOVERNANCE_TAB, "rules/a.ts");
        expect(nodeRoute(file, false).startsWith("/anatomy/governance/file-")).toBe(true);
        expect(nodeRoute(qualifiedPath(GOVERNANCE_TAB, "rules"), true).startsWith("/anatomy/governance/folder-")).toBe(
            true,
        );
        expect(sourceTitle(file)).toBe(
            `${treeLabelOf(GOVERNANCE_TAB)}${TITLE_SEPARATOR}rules/a.ts${TITLE_SEPARATOR}Bane's Lab`,
        );
    });
});

describe("statsMetrics", () => {
    it("lays the counts out as cards, one card per flow class and per finding kind", () => {
        const metrics = statsMetrics({
            bytes: 1,
            callable: 2,
            definitions: 3,
            edges: 4,
            exported: 5,
            files: 6,
            findings: {},
            flows: { isolated: 2, relay: 9 },
            lines: { blank: 7, code: 8, total: 15 },
        });
        expect(metrics.find((metric) => metric.label === FILES_LABEL)?.value).toBe("6");
        expect(metrics.find((metric) => metric.label === CALLABLE_LABEL)?.value).toBe("2");
        expect(metrics.find((metric) => metric.label === `relay${FLOW_SUFFIX}`)?.value).toBe("9");
        expect(metrics.find((metric) => metric.label === FINDINGS_LABEL)?.value).toBe(NO_ANOMALIES);
    });
});

describe("importsDiagram and structureDiagram", () => {
    it("draws the container import graph and the folder tree from the snapshot", () => {
        expect(importsDiagram(ANATOMY).startsWith(IMPORT_DIAGRAM_HEADER)).toBe(true);
        expect(importsDiagram(ANATOMY).includes(` ${IMPORT_NOUN}`)).toBe(true);
        expect(importsDiagram(ANATOMY).includes("(s)")).toBe(false);
        expect(structureDiagram(ANATOMY).split(STRUCTURE_ARROW).length).toBeGreaterThan(ANATOMY.tree.folders.length);
    });
});

describe("treeTab", () => {
    it("emits one tree tab whose sections are the folders in disk order, the root first, each file a record", () => {
        const [source] = ANATOMY_TREES;
        if (source === undefined) {
            throw new Error(TREE_TAB);
        }
        const tab = treeTab(source);
        expect(tab.id).toBe(TREE_TAB);
        expect(tab.layout).toBe("tree");
        expect(tab.sections[0]?.title).toBe("root");
        expect(tab.sections.length).toBeGreaterThan(1);
        const withFiles = tab.sections.find((section) => section.subsections.length > 0);
        expect(withFiles?.subsections[0]?.id?.startsWith("file-")).toBe(true);
    });

    it("gives each tree its own tab, a root titled root, and anchors no other tree uses", () => {
        const tabs = ANATOMY_TREES.map(treeTab);
        expect(tabs.map((tab) => tab.id)).toStrictEqual(
            ANATOMY_TREE_DECLARATIONS.map((declaration) => declaration.tab),
        );
        expect(tabs.every((tab) => tab.sections[0]?.title === "root")).toBe(true);
        const ids = tabs.flatMap((tab) =>
            tab.sections.flatMap((section) => [section.id, ...section.subsections.map((sub) => sub.id)]),
        );
        expect(new Set(ids).size).toBe(ids.length);
    });
});

const COORDINATION_INDEX = definitionIndexOf(ANATOMY_TREES.map((tree) => tree.snapshot.tree));

const coordinationFile = function coordinationFile(name: string): string {
    const [found] = COORDINATION_INDEX.filesMatching([name], qualifiedPath(COORDINATION_TAB, name));
    return found ?? qualifiedPath(COORDINATION_TAB, name);
};

const QUALITY_STEP = coordinationFile("quality.step.ts");
const SURFACE_CONFIG = coordinationFile("surface.config.ts");

describe("qualifiedPath", () => {
    it("marks a path with its tree and reads the tree and the local path back", () => {
        const path = qualifiedPath(GOVERNANCE_TAB, "core/a.ts");
        expect(treeOf(path)).toBe(GOVERNANCE_TAB);
        expect(localPath(path)).toBe("core/a.ts");
        expect(qualifiedPath(TREE_TAB, "core/a.ts")).toBe("core/a.ts");
        expect(treeOf("core/a.ts")).toBe(TREE_TAB);
        expect(parentPath(path)).toBe(qualifiedPath(GOVERNANCE_TAB, "core"));
        expect(parentPath(qualifiedPath(GOVERNANCE_TAB, "a.ts"))).toBe(qualifiedPath(GOVERNANCE_TAB, ""));
    });

    it("reads the baked Coordination tree as qualified, and labels a qualified path with its tree", () => {
        const qualified = ANATOMY_TREES.find((tree) => tree.tab === COORDINATION_TAB)?.snapshot ?? ANATOMY;
        const [file] = qualified.tree.folders.flatMap((folder) => folder.files);
        expect(treeOf(qualified.tree.path)).toBe(COORDINATION_TAB);
        expect(file === undefined ? COORDINATION_TAB : treeOf(file.path)).toBe(COORDINATION_TAB);
        const label = ANATOMY_TREE_DECLARATIONS.find((declaration) => declaration.tab === COORDINATION_TAB)?.label;
        expect(treeLabelOf(COORDINATION_TAB)).toBe(label);
        expect(pathLabel(qualifiedPath(COORDINATION_TAB, "tools/a.ts"))).toBe(
            `${label ?? ""}${TITLE_SEPARATOR}tools/a.ts`,
        );
        expect(() => treeLabelOf("undeclared")).toThrow();
        expect(pathLabel("core/a.ts")).toBe("core/a.ts");
    });

    it("links a path string to its file in the reading tree, and never a glob or a phrase", () => {
        const surface = localPath(SURFACE_CONFIG);
        const text = `const a = "${surface}";\nconst b = "tools/**/*.ts";\nconst c = "a phrase.";`;
        const { strings } = codeReferencesOf(COORDINATION_INDEX, QUALITY_STEP, text, false);
        expect(strings[surface]).toStrictEqual({ kind: "file", path: SURFACE_CONFIG });
        expect(strings["tools/**/*.ts"]).toBeUndefined();
        expect(strings["a phrase."]).toBeUndefined();
        expect(COORDINATION_INDEX.resolveOwnPath("surface.config.ts", QUALITY_STEP)).toBe(SURFACE_CONFIG);
        expect(unquoted(' "quoted" ')).toBe("quoted");
        expect(unquoted("bare")).toBe("bare");
    });

    it("links a template folded through its constants, and offers every file an open template can name", () => {
        const folded = `config/${["$", "{NAME}"].join("")}.config.ts`;
        const unbound = `config/${["$", "{other}"].join("")}.config.ts`;
        const text = `const NAME = "surface";\nconst a = \`${folded}\`;\nconst b = \`${unbound}\`;`;
        const { strings } = codeReferencesOf(COORDINATION_INDEX, QUALITY_STEP, text, false);
        expect(strings[folded]).toStrictEqual({ kind: "file", path: SURFACE_CONFIG });
        const open = strings[unbound];
        expect(open?.kind === "file" || open?.kind === "candidates").toBe(true);
    });

    it("links a local rule id to its rule file, and leaves an id with no rule file alone", () => {
        const index = definitionIndexOf(ANATOMY_TREES.map((tree) => tree.snapshot.tree));
        const text = 'const a = "local/no-comments";\nconst b = "local/no-such-rule";';
        const { strings } = codeReferencesOf(index, "core/a.ts", text, false);
        const governed = ANATOMY_TREES.some((tree) => tree.tab === GOVERNANCE_TAB);
        expect(strings["local/no-comments"]?.kind ?? (governed ? "missing" : "file")).toBe("file");
        expect(strings["local/no-such-rule"]).toBeUndefined();
    });

    it("links a catalogued rule id in a tool config to the record its lookup names, and a backticked record", () => {
        const index = definitionIndexOf(ANATOMY_TREES.map((tree) => tree.snapshot.tree));
        const record = "architecture:single-source-of-truth";
        const lookups = {
            bindings: () => null,
            records: new Set([record]),
            ruleRecord: (text: string) => (text === "tool/one-home" ? record : null),
            slotDeclaration: () => null,
        };
        const text = 'const a = "tool/one-home";';
        const config = codeReferencesOf(index, qualifiedPath(CONFIG_TAB, "eslint.json"), text, false, lookups);
        expect(config.strings["tool/one-home"]).toStrictEqual({ kind: "record", ref: record });
        const { strings } = codeReferencesOf(index, "core/a.ts", text, false, lookups);
        expect(strings["tool/one-home"]).toBeUndefined();
        const { spans } = codeReferencesOf(index, "core/a.md", `See \`${record}\`.`, true, lookups);
        expect(spans[record]).toStrictEqual({ kind: "record", ref: record });
        expect(literalTarget(index, lookups, "tool/one-home", "core/a.ts", text)).toBeNull();
        expect(targetIn(config.strings, "tool/one-home")).toStrictEqual({ kind: "record", ref: record });
        expect(targetIn(config.strings, "absent")).toBeNull();
    });

    it("links a slot key passed to a slot call to the configuration the tree's manifest declares", () => {
        const text = 'const root = slot("project.root");';
        const lookups = {
            bindings: () => null,
            records: new Set<string>(),
            ruleRecord: () => null,
            slotDeclaration: () => localPath(SURFACE_CONFIG),
        };
        const { strings } = codeReferencesOf(COORDINATION_INDEX, QUALITY_STEP, text, false, lookups);
        expect(strings["project.root"]).toStrictEqual({ kind: "file", path: SURFACE_CONFIG });
        const undeclared = codeReferencesOf(COORDINATION_INDEX, QUALITY_STEP, text, false);
        expect(undeclared.strings["project.root"]).toBeUndefined();
    });

    it("finds a name's definitions only in the tree it is read from", () => {
        const index = definitionIndexOf(ANATOMY_TREES.map((tree) => tree.snapshot.tree));
        const [site] = index.moduleDefinitionsNamedFrom("VOCABULARY", "core/a.ts");
        expect(site === undefined ? TREE_TAB : treeOf(site.file)).toBe(TREE_TAB);
        expect(index.moduleDefinitionsNamedFrom("declarationsIn", "core/a.ts")).toStrictEqual([]);
        const governed = index.moduleDefinitionsNamedFrom("declarationsIn", qualifiedPath(GOVERNANCE_TAB, "a.ts"));
        expect(governed.every((location) => treeOf(location.file) === GOVERNANCE_TAB)).toBe(true);
        const inSite = (name: string): ReturnType<typeof index.definitionsNamed> =>
            index.definitionsNamed(name).filter((location) => treeOf(location.file) === TREE_TAB);
        const shared = index
            .listDefinitions()
            .find((location) => treeOf(location.file) !== TREE_TAB && inSite(location.name).length === 1);
        expect(shared === undefined ? TREE_TAB : treeOf(citedDefinition(shared.name)?.file ?? "")).toBe(TREE_TAB);
    });
});

describe("anatomyChapter", () => {
    it("builds the reading chapter with one section per authored chapter section, each carrying panels", () => {
        const sections = anatomyChapter(ANATOMY, ANATOMY_MEASURES);
        expect(sections.map((section) => section.id)).toStrictEqual(ANATOMY_CHAPTER.map((section) => section.id));
        const paneled = sections.every(
            (section) =>
                (section.blocks ?? []).length + section.subsections.flatMap((sub) => sub.blocks ?? []).length > 0,
        );
        expect(paneled).toBe(true);
    });

    it("measures every tree in total and names each tree on its own row", () => {
        const derived = anatomyChapter(ANATOMY, ANATOMY_MEASURES).find((section) => section.id === DERIVED_SECTION_ID);
        const blocks = derived?.subsections.flatMap((sub) => sub.blocks ?? []) ?? [];
        const panel = blocks.find((block) => block.kind === "metric" && block.caption === MEASUREMENTS_TAG);
        const rows = panel?.kind === "metric" ? panel.metrics : [];
        expect(rows.find((row) => row.label === FILES_LABEL)?.value).toBe(String(ANATOMY_MEASURES.stats.files));
        expect(ANATOMY_MEASURES.stats.files).toBe(
            ANATOMY_MEASURES.trees.reduce((sum, tree) => sum + tree.stats.files, 0),
        );
        expect(ANATOMY_MEASURES.trees.length).toBeGreaterThan(1);
        for (const tree of ANATOMY_MEASURES.trees) {
            expect(rows.find((row) => row.label === tree.label)?.value).toBe(
                treeMeasureOf(tree.stats.files, tree.metrics.definitions),
            );
        }
    });

    it("draws the structure from the tree itself, one node per folder that holds files, beside the prose", () => {
        const parts = anatomyChapter(ANATOMY, ANATOMY_MEASURES).find((section) => section.id === PARTS_SECTION_ID);
        const blocks = parts?.subsections.flatMap((sub) => sub.blocks ?? []) ?? [];
        const structure = blocks.find((block) => block.kind === "mermaid" && block.caption === STRUCTURE_TAG);
        expect(structure?.kind === "mermaid" && structure.wide).toBeUndefined();
        expect(structure?.kind === "mermaid" && structure.text.startsWith(STRUCTURE_DIAGRAM_HEADER)).toBe(true);
        expect(
            structure?.kind === "mermaid" &&
                structure.text.includes(
                    `${STATS_SEPARATOR}${String(ANATOMY.tree.stats.files)} ${nounFor(ANATOMY.tree.stats.files, FILE_NOUN, FILES_NOUN)}`,
                ),
        ).toBe(true);
        expect(structure?.kind === "mermaid" && structure.text.includes(STRUCTURE_ARROW)).toBe(true);
    });
});

describe("documentChips and documentBlocks", () => {
    it("adds form, concern and boundary chips and lays the document facet out as cards plus a findings list", () => {
        expect(documentChips(null)).toStrictEqual([]);
        expect(documentChips(DOCUMENT)).toStrictEqual(["Form: readme", null, "boundary document"]);
        const [metrics, findings] = documentBlocks(DOCUMENT);
        expect(metrics?.kind).toBe("metric");
        expect(
            metrics?.kind === "metric" && metrics.metrics.find((metric) => metric.label === HEADINGS_LABEL)?.value,
        ).toBe("5");
        expect(findings?.kind === "glossary" && findings.entries[0]?.term).toBe("history-smell:4");
        const clean = documentBlocks({ ...DOCUMENT, findings: [] });
        expect(clean[1]?.kind === "glossary" && clean[1].entries[0]?.description).toBe(NONE_LABEL);
    });
});
