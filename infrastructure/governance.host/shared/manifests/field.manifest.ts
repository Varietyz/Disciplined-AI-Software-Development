import { BUILD_SCOPE_LABEL, SITE_SCOPE_LABEL } from "../../codemods/strings/codemod.strings.ts";
import type { FieldScope } from "../../types/field.types.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const web = function web(...parts: string[]): string {
    return join(absolutePath("app.member"), ...parts);
};

const build = function build(...parts: string[]): string {
    return join(absolutePath("app.build"), ...parts);
};

const contextTypes = function contextTypes(file: string): string {
    return join(absolutePath("govlab.context"), "types", file);
};

export const CLOSED_SCOPE_LABEL = BUILD_SCOPE_LABEL;

export const FIELD_SCOPES: readonly FieldScope[] = [
    {
        label: CLOSED_SCOPE_LABEL,
        readerRoots: [build("core"), build("configuration"), build("runtime")],
        roots: [
            { file: contextTypes("architecture.types.ts"), name: "Principle" },
            { file: contextTypes("lexicon.types.ts"), name: "Term" },
            { file: contextTypes("algorithm.types.ts"), name: "Contract" },
            { container: true, file: contextTypes("reason.types.ts"), name: "ReasonData" },
            { container: true, file: contextTypes("grammar.types.ts"), name: "PagData" },
            { file: contextTypes("check.types.ts"), name: "CheckFacet" },
            { file: contextTypes("check.types.ts"), name: "CheckedRecord" },
            { file: contextTypes("check.types.ts"), name: "CollectionCoverage" },
        ],
        tsconfig: build("tsconfig.json"),
        typeRoots: [absolutePath("govlab.context")],
    },
    {
        label: SITE_SCOPE_LABEL,
        readerRoots: [web("core"), web("domain"), web("presentation"), web("configuration")],
        roots: [
            { file: web("types", "ontology.types.ts"), name: "OntologySnapshot" },
            { file: web("types", "reference.types.ts"), name: "ReferenceRecord" },
        ],
        tsconfig: web("tsconfig.json"),
        typeRoots: [web("types")],
    },
];

export const PLAIN_CLOSED_FIELDS: ReadonlyMap<string, string> = new Map();

export const CARRIED_FIELDS: ReadonlyMap<string, string> = new Map([
    ["PrincipleRecord.requires", "ResolveResult.edges.requires"],
    ["PrincipleRecord.reinforces", "ResolveResult.edges.reinforces"],
    ["PrincipleRecord.enables", "ResolveResult.edges.enables"],
    ["PrincipleRecord.conflicts_with", "ResolveResult.edges.conflictsWith"],
    ["PrincipleRecord.check", "CheckedRecord.facet"],
    ["ContractRecord.check", "CheckedRecord.facet"],
    ["TermRecord.check", "CheckedRecord.facet"],
    ["CheckFacet.by", "CheckedRecord.by"],
    ["Term.enforcedBy", "CheckedRecord.by"],
    ["Term.seeAlso", "CheckedRecord.dependsOn"],
]);

export const HIDDEN_FIELDS: ReadonlyMap<string, string> = new Map([
    [
        "CheckedRecord.ownBy",
        "the record's own check.by, which the context reports as a second home of by; the page shows the merged by",
    ],
    ["SubstrateNodeView.id", "identity: the page links the node by its anchor and titles it by its name"],
    ["ReasonNodeView.id", "identity: the page links the node by its anchor and titles it by its name"],
    ["InvariantView.id", "identity: the page links the invariant by its anchor and titles it by its name"],
    ["FailureShapeView.id", "identity: the page links the shape by its anchor and titles it by its name"],
    ["ReasonLayerView.id", "identity: the page links the layer by its anchor and titles it by its label"],
    ["DerivationLoopView.id", "identity: the page links the loop by its anchor and titles it by the section title"],
]);
