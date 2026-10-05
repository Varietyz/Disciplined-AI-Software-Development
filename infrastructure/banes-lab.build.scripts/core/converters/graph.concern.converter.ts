import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { ConcernScope, ConcernSource } from "#types/graph.types";
import { FACE_SEPARATOR, LEX_CATEGORY_FACE, LEX_FACE } from "@govlab/constants";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import type { Term } from "@govlab/context";
import { tagOfTerm } from "@govlab/context/core/selectors/lexicon.selector.ts";

export const concernScopeOf = function concernScopeOf(context: ConcernSource): ConcernScope {
    return {
        fileRef: (path) => ANATOMY_PREFIX + context.ids.fileId(path),
        records: new Set(context.ontology.nodes.map((node) => node.ref)),
        roots: context.trees.map((tree) => tree.snapshot.tree),
        terms: context.built.context.lex.all(),
    };
};

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

const termsByTag = function termsByTag(terms: readonly Term[]): ReadonlyMap<string, Term> {
    return new Map(
        terms.flatMap((term) => {
            const tag = tagOfTerm(term);
            return tag === null ? [] : [[tag, term] as const];
        }),
    );
};

const edgesOf = function edgesOf(
    scope: ConcernScope,
    relation: string,
    targetOf: (file: AnatomyFile, term: Term) => string | null,
): readonly GraphEdge[] {
    const byTag = termsByTag(scope.terms);
    return scope.roots.flatMap(filesOf).flatMap((file): readonly GraphEdge[] => {
        const term = file.slots === null ? undefined : byTag.get(file.slots.concern);
        const to = term === undefined ? null : targetOf(file, term);
        return to === null || !scope.records.has(to) ? [] : [{ from: scope.fileRef(file.path), relation, to }];
    });
};

export const concernEdges = function concernEdges(scope: ConcernScope, relation: string): readonly GraphEdge[] {
    return edgesOf(scope, relation, (file, term) => (file.slots === null ? null : LEX_FACE + FACE_SEPARATOR + term.id));
};

export const concernLayerEdges = function concernLayerEdges(
    scope: ConcernScope,
    relation: string,
): readonly GraphEdge[] {
    return edgesOf(scope, relation, (file, term) =>
        file.layer === null ? null : LEX_CATEGORY_FACE + FACE_SEPARATOR + term.category,
    );
};
