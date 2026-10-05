import { CSS_EXTENSIONS, PAGES_SEGMENT, SCRIPT_EXTENSIONS } from "#configuration/constants/validation.constants";
import type { FileInput, ProjectValidator } from "#types/validation.types";
import { componentsInFile, definedVars, scriptVarRefs, usedVars } from "#core/parsers/css.parser";
import {
    danglingVar,
    danglingVarFix,
    deadVar,
    deadVarFix,
    duplicateComponent,
    duplicateComponentFix,
} from "#configuration/strings/validation.strings";
import type { Finding } from "#types/finding.types";
import { defineValidator } from "#core/registries/validation.registry";
import { projectFinding } from "#core/factories/finding.factory";

const CSS_SET: ReadonlySet<string> = new Set(CSS_EXTENSIONS);
const VAR_AWARE_EXTENSIONS = [...CSS_EXTENSIONS, ...SCRIPT_EXTENSIONS];

interface VarGraph {
    defs: Map<string, Set<string>>;
    uses: Map<string, Set<string>>;
    scriptRefs: Set<string>;
}

const extensionOf = function extensionOf(path: string): string {
    const dot = path.lastIndexOf(".");
    return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
};

const add = function add(map: Map<string, Set<string>>, name: string, path: string): void {
    map.set(name, (map.get(name) ?? new Set<string>()).add(path));
};

const buildGraph = function buildGraph(files: readonly FileInput[]): VarGraph {
    const graph: VarGraph = { defs: new Map(), scriptRefs: new Set(), uses: new Map() };
    for (const file of files) {
        const isCss = CSS_SET.has(extensionOf(file.path));
        for (const name of isCss ? definedVars(file.content) : []) {
            add(graph.defs, name, file.path);
        }
        for (const name of isCss ? usedVars(file.content) : []) {
            add(graph.uses, name, file.path);
        }
        for (const name of isCss ? [] : scriptVarRefs(file.content)) {
            graph.scriptRefs.add(name);
        }
    }
    return graph;
};

const unmatched = function unmatched(
    source: Map<string, Set<string>>,
    other: Map<string, Set<string>>,
    scriptRefs: ReadonlySet<string>,
): [string, string][] {
    return [...source]
        .filter(([name]) => !other.has(name) && !scriptRefs.has(name))
        .flatMap(([name, paths]) => [...paths].map((path): [string, string] => [name, path]));
};

const isPage = function isPage(path: string): boolean {
    return `/${path.split("\\").join("/")}`.includes(PAGES_SEGMENT);
};

const duplicateComponents: ProjectValidator = {
    appliesTo: CSS_EXTENSIONS,
    id: "css-duplicate-components",
    meta: {
        canonical: ["duplicate-code", "css-architecture"],
        description: "Flag a base component defined across multiple component files",
    },
    validate(files): Finding[] {
        const byComponent = new Map<string, string[]>();
        for (const file of files.filter((entry) => !isPage(entry.path))) {
            for (const component of componentsInFile(file.content)) {
                byComponent.set(component, [...(byComponent.get(component) ?? []), file.path]);
            }
        }
        return [...byComponent]
            .filter(([, paths]) => paths.length > 1)
            .flatMap(([component, paths]) =>
                paths.map((path) =>
                    projectFinding({
                        file: path,
                        message: duplicateComponent(component, paths.length),
                        ruleId: "css-duplicate-components",
                        suggestion: duplicateComponentFix(component),
                    }),
                ),
            );
    },
};

const deadVars: ProjectValidator = {
    appliesTo: VAR_AWARE_EXTENSIONS,
    id: "css-dead-var",
    meta: {
        canonical: ["no-unused", "design-tokens"],
        description:
            "Flag a custom property defined but never referenced via var() anywhere, the members that import the definitions included",
    },
    validate(files, consumers): Finding[] {
        const own = buildGraph(files);
        const reached = buildGraph(consumers);
        const uses = new Map([...own.uses, ...reached.uses]);
        const scriptRefs = new Set([...own.scriptRefs, ...reached.scriptRefs]);
        return unmatched(own.defs, uses, scriptRefs).map(([name, path]) =>
            projectFinding({
                file: path,
                message: deadVar(name),
                ruleId: "css-dead-var",
                suggestion: deadVarFix(name),
            }),
        );
    },
};

const danglingVars: ProjectValidator = {
    appliesTo: VAR_AWARE_EXTENSIONS,
    id: "css-dangling-var",
    meta: {
        canonical: ["design-tokens"],
        description: "Flag a var() reference whose custom property is never defined anywhere",
    },
    validate(files): Finding[] {
        const { defs, scriptRefs, uses } = buildGraph(files);
        return unmatched(uses, defs, scriptRefs).map(([name, path]) =>
            projectFinding({
                file: path,
                message: danglingVar(name),
                ruleId: "css-dangling-var",
                suggestion: danglingVarFix(name),
            }),
        );
    },
};

const CSS_VALIDATORS: readonly ProjectValidator[] = Object.freeze([duplicateComponents, deadVars, danglingVars]);

for (const validator of CSS_VALIDATORS) {
    defineValidator(validator);
}
