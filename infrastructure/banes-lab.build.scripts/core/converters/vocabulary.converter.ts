import { ALGO_FACE, ARCH_FACE, LAYER_FACE, LEX_FACE, PAG_FACE, REASON_FACE } from "@govlab/constants";
import {
    AXIS_KIND,
    DIMENSION_KIND,
    FAILURE_SHAPE_KIND,
    INVARIANT_KIND,
    LENS_KIND,
    MATH_DOMAIN_KIND,
    MATH_TYPE_KIND,
    MODEL_KIND,
    MODE_KIND,
    NODE_KIND,
    PATTERN_TYPE_KIND,
    REASON_LAYER_KIND,
    REPRESENTATION_KIND,
    SUBSTRATE_NODE_KIND,
    TECHNIQUE_KIND,
    TEST_SURFACE_KIND,
    UNIVERSAL_AXIS_KIND,
} from "#configuration/constants/ontology.constants";
import { type GovlabContext, PAG_KINDS, type Principle, type Term, keywordIdOf } from "@govlab/context";
import { pagAnchor, reasonAnchor, refOf } from "#core/resolvers/ontology.resolver";
import type { Phrase } from "#types/search.types";
import type { VocabularyEntry } from "@banes-lab/web/types/vocabulary.types.js";

const PAREN_OPEN = "(";
const PAREN_CLOSE = ")";
const SPACE = " ";
const CODE_LIMIT = 6;
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const KEY_SAFE = "abcdefghijklmnopqrstuvwxyz0123456789";

const isCode = function isCode(candidate: string): boolean {
    if (candidate.length === 0 || candidate.length > CODE_LIMIT) {
        return false;
    }
    let capitals = 0;
    for (const char of candidate) {
        if (UPPER.includes(char)) {
            capitals += 1;
        }
    }
    return capitals >= 2;
};

const splitName = function splitName(name: string): { readonly code: string | null; readonly plain: string } {
    const open = name.indexOf(PAREN_OPEN);
    const close = name.indexOf(PAREN_CLOSE, open);
    if (open === -1 || close === -1) {
        return { code: null, plain: name.trim() };
    }
    const inner = name.slice(open + 1, close).trim();
    const plain = (name.slice(0, open) + name.slice(close + 1)).trim();
    return { code: isCode(inner) ? inner : null, plain };
};

export const keyOf = function keyOf(phrase: string): string {
    let key = "";
    for (const char of phrase.toLowerCase()) {
        key += KEY_SAFE.includes(char) ? char : SPACE;
    }
    return key
        .split(SPACE)
        .filter((word) => word.length > 0)
        .join(SPACE);
};

const layerLabels = function layerLabels(context: GovlabContext): ReadonlyMap<string, string> {
    return new Map(context.layers().map((layer) => [layer.id, layer.label]));
};

const principleEntries = function principleEntries(
    principle: Principle,
    layer: string | null,
): readonly VocabularyEntry[] {
    const { code, plain } = splitName(principle.name);
    const ref = refOf(ARCH_FACE, principle.id);
    const base = { code, kind: principle.type, layer, prose: true, ref };
    const phrases = [plain, ...(code === null ? [] : [code]), ...(principle.aliases ?? [])];
    return phrases.map((phrase) => ({ ...base, phrase }));
};

const termEntries = function termEntries(term: Term, layer: string | null): readonly VocabularyEntry[] {
    const { code, plain } = splitName(term.name);
    const base = { code, kind: term.kind, layer, prose: false, ref: refOf(LEX_FACE, term.id) };
    return [plain, ...term.aliases].map((phrase) => ({ ...base, phrase }));
};

const reasonEntry = function reasonEntry(kind: string, id: string, name: string): VocabularyEntry {
    return {
        code: null,
        kind,
        layer: null,
        phrase: name,
        prose: name.trim().includes(SPACE),
        ref: refOf(REASON_FACE, reasonAnchor(kind, id)),
    };
};

const reasonEntries = function reasonEntries(context: GovlabContext): readonly VocabularyEntry[] {
    return [
        ...context.reason.invariants().map((invariant) => reasonEntry(INVARIANT_KIND, invariant.id, invariant.name)),
        ...context.reason.nodes().map((node) => reasonEntry(NODE_KIND, node.id, node.name)),
    ];
};

type Aliased = readonly { readonly aliases?: string[]; readonly id: string }[];

const phrasesOf = function phrasesOf(ref: string, aliases: readonly string[] | undefined): readonly Phrase[] {
    return (aliases ?? []).map((phrase) => ({ phrase, ref }));
};

const reasonPhrases = function reasonPhrases({ reason }: GovlabContext): readonly Phrase[] {
    const kinds: readonly (readonly [string, Aliased])[] = [
        [NODE_KIND, reason.nodes()],
        [AXIS_KIND, reason.axes()],
        [REASON_LAYER_KIND, reason.layers()],
        [MATH_TYPE_KIND, reason.mathTypes()],
        [SUBSTRATE_NODE_KIND, reason.substrate().nodes],
        [DIMENSION_KIND, reason.dimensions()],
        [LENS_KIND, reason.lenses()],
        [MODE_KIND, reason.modes()],
        [REPRESENTATION_KIND, reason.representations()],
        [MATH_DOMAIN_KIND, reason.mathDomains()],
        [PATTERN_TYPE_KIND, reason.patternTypes()],
        [MODEL_KIND, reason.models()],
        [UNIVERSAL_AXIS_KIND, reason.universalAxes()],
        [TEST_SURFACE_KIND, reason.testSurfaces()],
        [TECHNIQUE_KIND, reason.techniques()],
        [INVARIANT_KIND, reason.invariants()],
        [FAILURE_SHAPE_KIND, reason.failureShapes()],
    ];
    return kinds.flatMap(([kind, records]) =>
        records.flatMap((record) => phrasesOf(refOf(REASON_FACE, reasonAnchor(kind, record.id)), record.aliases)),
    );
};

const pagRef = function pagRef(kind: string, key: string): string {
    return refOf(PAG_FACE, pagAnchor(kind, key));
};

const pagPhrases = function pagPhrases({ pag }: GovlabContext): readonly Phrase[] {
    return [
        ...pag
            .keywords()
            .flatMap((record) => phrasesOf(pagRef(PAG_KINDS.keyword, keywordIdOf(record)), record.aliases)),
        ...pag.productions().flatMap((record) => phrasesOf(pagRef(PAG_KINDS.production, record.lhs), record.aliases)),
        ...pag
            .documentTypes()
            .flatMap((record) => phrasesOf(pagRef(PAG_KINDS.documentType, record.type), record.aliases)),
        ...pag.templates().flatMap((record) => phrasesOf(pagRef(PAG_KINDS.template, record.type), record.aliases)),
    ];
};

export const aliasPhrasesOf = function aliasPhrasesOf(context: GovlabContext): readonly Phrase[] {
    return [
        ...context.arch.all().flatMap((record) => phrasesOf(refOf(ARCH_FACE, record.id), record.aliases)),
        ...context.lex.all().flatMap((record) => phrasesOf(refOf(LEX_FACE, record.id), record.aliases)),
        ...context.algo.all().flatMap((record) => phrasesOf(refOf(ALGO_FACE, record.id), record.aliases)),
        ...pagPhrases(context),
        ...reasonPhrases(context),
    ];
};

export const vocabularyOf = function vocabularyOf(context: GovlabContext): readonly VocabularyEntry[] {
    const labels = layerLabels(context);
    const held = new Map<string, VocabularyEntry>();
    const admit = function admit(entry: VocabularyEntry): void {
        const key = keyOf(entry.phrase);
        if (key.length > 0 && !held.has(key)) {
            held.set(key, entry);
        }
    };
    const layerOf = function layerOf(id: string): string | null {
        const layerId = context.layerOf(id);
        return layerId === null ? null : (labels.get(layerId) ?? layerId);
    };
    for (const principle of context.arch.all()) {
        for (const entry of principleEntries(principle, layerOf(principle.id))) {
            admit(entry);
        }
    }
    for (const layer of context.layers()) {
        admit({
            code: null,
            kind: LAYER_FACE,
            layer: layer.label,
            phrase: layer.label,
            prose: true,
            ref: refOf(LAYER_FACE, layer.id),
        });
    }
    for (const term of context.lex.all()) {
        for (const entry of termEntries(term, layerOf(term.id))) {
            admit(entry);
        }
    }
    for (const entry of reasonEntries(context)) {
        admit(entry);
    }
    return [...held.values()];
};
