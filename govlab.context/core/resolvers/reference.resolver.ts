import type {
    CollectionRefFaces,
    KindMembers,
    PagTargets,
    ReasonRef,
    TargetResolverFaces,
} from "#types/reference.types";
import {
    PAG_SUBCOLLECTIONS,
    REASON_COLLECTION_NAME,
    REASON_PREFIX,
    REF_SEPARATOR,
} from "#configuration/constants/reference.constants";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";

const resolvePagTarget = function resolvePagTarget(pag: PagTargets, localId: string): boolean {
    const colon = localId.indexOf(REF_SEPARATOR);
    if (colon === -1) {
        return pag.documentType(localId.toUpperCase()) !== null;
    }
    const sub = localId.slice(0, colon);
    const rest = localId.slice(colon + 1);
    if (sub === PAG_SUBCOLLECTIONS.keyword) {
        return pag.keyword(rest) !== null;
    }
    if (sub === PAG_SUBCOLLECTIONS.production) {
        return pag.production(rest) !== null;
    }
    const name = rest.toUpperCase();
    if (sub === PAG_SUBCOLLECTIONS.template) {
        return pag.template(name) !== null;
    }
    return (
        (sub === PAG_SUBCOLLECTIONS.documentType || sub === PAG_SUBCOLLECTIONS.doctype) &&
        pag.documentType(name) !== null
    );
};

type TargetResolver = (faces: TargetResolverFaces, localId: string) => boolean;

const TARGET_RESOLVERS: ReadonlyMap<string, TargetResolver> = new Map<string, TargetResolver>([
    [COLLECTIONS.algorithms, (faces, localId) => faces.algo.get(localId) !== null],
    [COLLECTIONS.architecture, (faces, localId) => (faces.arch?.get(localId) ?? null) !== null],
    [COLLECTIONS.lexicon, (faces, localId) => (faces.lex?.resolve(localId) ?? null) !== null],
    [COLLECTIONS.pag, (faces, localId) => (faces.pag ? resolvePagTarget(faces.pag, localId) : false)],
]);

export const REF_COLLECTIONS: ReadonlySet<string> = new Set([...TARGET_RESOLVERS.keys(), REASON_COLLECTION_NAME]);

export const resolveTarget = function resolveTarget(faces: TargetResolverFaces, to: string): boolean {
    const colon = to.indexOf(REF_SEPARATOR);
    if (colon === -1) {
        return false;
    }
    return TARGET_RESOLVERS.get(to.slice(0, colon))?.(faces, to.slice(colon + 1)) ?? false;
};

const parseReasonRef = function parseReasonRef(ref: string): ReasonRef | null {
    if (!ref.startsWith(REASON_PREFIX)) {
        return null;
    }
    const rest = ref.slice(REASON_PREFIX.length);
    const colon = rest.indexOf(REF_SEPARATOR);
    return colon === -1 ? null : { id: rest.slice(colon + 1), kind: rest.slice(0, colon) };
};

export const kindRefResolves = function kindRefResolves(kindMembers: KindMembers, target: string): boolean {
    const parsed = parseReasonRef(target);
    return parsed !== null && (kindMembers.get(parsed.kind)?.has(parsed.id) ?? false);
};

export const kindsHolding = function kindsHolding(kindMembers: KindMembers, id: string): string[] {
    return [...kindMembers].filter(([, ids]) => ids.has(id)).map(([kind]) => kind);
};

export const bareReasonId = function bareReasonId(target: string): string {
    return target.startsWith(REASON_PREFIX) ? target.slice(REASON_PREFIX.length) : target;
};

export const collectionRefResolver = function collectionRefResolver(
    faces: CollectionRefFaces,
): (ref: string) => boolean {
    const kindMembers = faces.reason.kindMembers();
    return (ref) => {
        if (!ref.startsWith(REASON_PREFIX)) {
            return resolveTarget(faces, ref);
        }
        const rest = ref.slice(REASON_PREFIX.length);
        return rest.includes(REF_SEPARATOR)
            ? kindRefResolves(kindMembers, ref)
            : kindsHolding(kindMembers, rest).length === 1;
    };
};
