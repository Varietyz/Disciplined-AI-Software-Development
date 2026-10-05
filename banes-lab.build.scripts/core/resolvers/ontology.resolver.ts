import {
    ALGO_FACE,
    ARCH_CATEGORY_FACE,
    ARCH_FACE,
    FACE_SEPARATOR,
    FORCE_FACE,
    KIND_FACE,
    LAYER_FACE,
    LEX_CATEGORY_FACE,
    LEX_FACE,
    PAG_FACE,
    REASON_FACE,
    STAGE_FACE,
    TENSION_FACE,
    VOCABULARY_FACE,
} from "@govlab/constants";
import { CANONICAL_KINDS, CLOSED_VOCABULARIES, type GovlabContext, type Principle, slugify } from "@govlab/context";
import { LOOP_KIND, NODE_KIND } from "#configuration/constants/ontology.constants";
import { archIndexOf, categoryLabelsOf } from "#core/converters/architecture.index.converter";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { Resolver } from "#types/ontology.types";
import { reasonIndexOf } from "#core/converters/reason.index.converter";
import { unregisteredVocabulary } from "#configuration/strings/ontology.strings";

const SPACE = " ";
const HYPHEN = "-";
const PAIR_JOINER = " / ";

export const refOf = function refOf(face: string, id: string): string {
    return face + FACE_SEPARATOR + id;
};

export const faceOf = function faceOf(ref: string): string {
    return ref.slice(0, ref.indexOf(FACE_SEPARATOR));
};

export const idOf = function idOf(ref: string): string {
    return ref.slice(ref.indexOf(FACE_SEPARATOR) + 1);
};

export const reasonAnchor = function reasonAnchor(kind: string, id: string): string {
    return kind + HYPHEN + id;
};

export const vocabularyAnchor = function vocabularyAnchor(id: string, value: string): string {
    return id + HYPHEN + value;
};

const vocabulary = function vocabulary(id: string, value: string): EdgeRef {
    const held = CLOSED_VOCABULARIES.find((entry) => entry.id === id);
    if (held === undefined) {
        throw new Error(unregisteredVocabulary(id));
    }
    const known = held.entries.some((entry) => entry.value === value);
    return { label: value, ref: known ? refOf(VOCABULARY_FACE, vocabularyAnchor(id, value)) : null };
};

export const pagAnchor = function pagAnchor(kind: string, id: string): string {
    return kind + HYPHEN + slugify(id);
};

const pagAnchorsOf = function pagAnchorsOf(context: GovlabContext): ReadonlySet<string> {
    return new Set(
        context.checkedRecords().flatMap((record) => {
            if (record.collection !== PAG_FACE) {
                return [];
            }
            const at = record.id.indexOf(FACE_SEPARATOR);
            return [pagAnchor(record.id.slice(0, at), record.id.slice(at + FACE_SEPARATOR.length))];
        }),
    );
};

const titleCase = function titleCase(slug: string): string {
    return slug
        .split(HYPHEN)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(SPACE);
};

export const createResolver = function createResolver(context: GovlabContext): Resolver {
    const archIndex = archIndexOf(context);
    const categoryLabels = categoryLabelsOf(context);
    const reasonIndex = reasonIndexOf(context);
    const stages = new Set(context.reason.derivationLoop().stages.map((stage) => stage.id));
    const archRef = function archRef(principle: Principle): EdgeRef {
        return { label: principle.name, ref: refOf(ARCH_FACE, principle.id) };
    };
    const lex = function lex(label: string): EdgeRef {
        const term = context.lex.resolve(label);
        return { label: term?.name ?? label, ref: term === null ? null : refOf(LEX_FACE, term.id) };
    };
    const arch = function arch(label: string): EdgeRef {
        const principle = archIndex.get(slugify(label));
        return principle === undefined ? lex(label) : archRef(principle);
    };
    const algo = function algo(label: string): EdgeRef {
        const id = slugify(label);
        const contract = context.algo.get(id);
        return { label: contract?.title ?? label, ref: contract === null ? null : refOf(ALGO_FACE, id) };
    };
    const reasonAs = function reasonAs(kind: string, id: string): EdgeRef {
        const local = reasonIndex.get(kind)?.has(id) === true ? id : slugify(id);
        const label = reasonIndex.get(kind)?.get(local);
        return { label: label ?? id, ref: label === undefined ? null : refOf(REASON_FACE, reasonAnchor(kind, local)) };
    };
    const reason = function reason(id: string): EdgeRef {
        const typed = id.indexOf(FACE_SEPARATOR);
        if (typed !== -1) {
            const kinded = reasonAs(id.slice(0, typed), id.slice(typed + FACE_SEPARATOR.length));
            return { label: id, ref: kinded.ref };
        }
        const local = context.reason.resolve(id) === null ? slugify(id) : id;
        const resolution = context.reason.resolve(local);
        return resolution === null ? { label: id, ref: null } : reasonAs(resolution.kind, local);
    };
    const stage = function stage(id: string): EdgeRef {
        return { label: id, ref: stages.has(id) ? refOf(STAGE_FACE, id) : null };
    };
    const archExact = function archExact(id: string): EdgeRef {
        const principle = context.arch.get(id);
        return principle === null ? { label: id, ref: null } : archRef(principle);
    };
    const pagAnchors = pagAnchorsOf(context);
    const pag = function pag(local: string): EdgeRef {
        const at = local.indexOf(FACE_SEPARATOR);
        const id = local.slice(at + FACE_SEPARATOR.length);
        const anchor = pagAnchor(local.slice(0, at), id);
        return { label: id, ref: at !== -1 && pagAnchors.has(anchor) ? refOf(PAG_FACE, anchor) : null };
    };
    const byFace: ReadonlyMap<string, (local: string) => EdgeRef> = new Map([
        [ALGO_FACE, algo],
        [ARCH_FACE, archExact],
        [LEX_FACE, lex],
        [PAG_FACE, pag],
        [REASON_FACE, reason],
        [STAGE_FACE, stage],
    ]);
    const edgeSource = function edgeSource(id: string): EdgeRef {
        const found = [stage(id), reasonAs(NODE_KIND, id), reasonAs(LOOP_KIND, id)].find(
            (candidate) => candidate.ref !== null,
        );
        return found ?? { label: id, ref: null };
    };
    const bare = function bare(raw: string): EdgeRef {
        const found = [reason(raw), arch(raw), algo(raw)].find((candidate) => candidate.ref !== null);
        return found ?? { label: raw, ref: null };
    };
    const target = function target(raw: string): EdgeRef {
        if (!raw.includes(FACE_SEPARATOR)) {
            return bare(raw);
        }
        const resolveIn = byFace.get(faceOf(raw));
        if (resolveIn === undefined) {
            return { label: raw, ref: null };
        }
        const resolved = resolveIn(idOf(raw));
        return resolved.ref === null ? { label: raw, ref: null } : resolved;
    };
    const labels = function labels(phrases: readonly string[]): readonly EdgeRef[] {
        return phrases.map((phrase) => ({ label: phrase, ref: bare(phrase).ref }));
    };
    const tension = function tension(a: EdgeRef, b: EdgeRef): EdgeRef {
        const pair = [slugify(a.label), slugify(b.label)].sort((left, right) => left.localeCompare(right));
        return { label: a.label + PAIR_JOINER + b.label, ref: refOf(TENSION_FACE, pair.join(HYPHEN)) };
    };
    return {
        algo,
        arch,
        archCategory: (label) => ({ label, ref: refOf(ARCH_CATEGORY_FACE, slugify(label)) }),
        archId: archExact,
        edgeSource,
        force: (force, known) => ({ label: force, ref: known.has(force) ? refOf(FORCE_FACE, slugify(force)) : null }),
        kind: (kind) => ({ label: kind, ref: CANONICAL_KINDS.has(kind) ? refOf(KIND_FACE, kind) : null }),
        labels,
        layer: (id) => ({ label: context.algo.get(id)?.title ?? id, ref: refOf(LAYER_FACE, id) }),
        lexCategory: (slug) => ({
            label: categoryLabels.get(slug) ?? titleCase(slug),
            ref: refOf(LEX_CATEGORY_FACE, slug),
        }),
        pag,
        reason,
        reasonAs,
        stage,
        target,
        tension,
        vocabulary,
    };
};
