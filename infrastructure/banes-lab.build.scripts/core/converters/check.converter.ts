import { ALGO_FACE, ARCH_FACE, FACE_SEPARATOR, LEX_FACE, PAG_FACE, REASON_FACE } from "@govlab/constants";
import type { CheckFacet, CheckedRecord, GovlabContext } from "@govlab/context";
import type { RecordCheckEntryView, ResolutionView } from "@banes-lab/web/types/ontology.types.js";
import { pagAnchor, reasonAnchor, refOf } from "#core/resolvers/ontology.resolver";
import type { CheckView } from "@banes-lab/web/types/reference.types.js";
import type { CoverageView } from "@banes-lab/web/types/coverage.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { Resolver } from "#types/ontology.types";

const ANCHORED: ReadonlyMap<string, (kind: string, id: string) => string> = new Map([
    [REASON_FACE, reasonAnchor],
    [PAG_FACE, pagAnchor],
]);

export const recordRefOf = function recordRefOf(collection: string, id: string): string {
    const anchorOf = ANCHORED.get(collection);
    if (anchorOf === undefined) {
        return refOf(collection, id);
    }
    const at = id.indexOf(FACE_SEPARATOR);
    return refOf(collection, anchorOf(id.slice(0, at), id.slice(at + FACE_SEPARATOR.length)));
};

const answerOf = function answerOf(answer: string | undefined): string | null {
    return answer === undefined || answer.trim().length === 0 ? null : answer;
};

const answersOf = function answersOf(facet: CheckFacet | null): CheckView {
    return {
        authority: answerOf(facet?.authority),
        evidence: answerOf(facet?.evidence),
        freshness: answerOf(facet?.freshness),
        observation: answerOf(facet?.observation),
        population: answerOf(facet?.population),
        refusal: answerOf(facet?.refusal),
    };
};

const untypedResolvers = function untypedResolvers(resolve: Resolver): ReadonlyMap<string, (raw: string) => EdgeRef> {
    return new Map([
        [ARCH_FACE, resolve.arch],
        [LEX_FACE, (raw: string): EdgeRef => resolve.target(refOf(LEX_FACE, raw))],
        [ALGO_FACE, resolve.algo],
    ]);
};

const isTyped = function isTyped(raw: string, collections: ReadonlySet<string>): boolean {
    const at = raw.indexOf(FACE_SEPARATOR);
    return at > 0 && collections.has(raw.slice(0, at));
};

interface CheckRefs {
    readonly by: (raw: string) => EdgeRef;
    readonly within: (collection: string, raw: string) => EdgeRef;
}

const entryOf = function entryOf(record: CheckedRecord, answers: number, refs: CheckRefs): RecordCheckEntryView {
    const within = (values: readonly string[]): readonly EdgeRef[] =>
        values.map((raw) => refs.within(record.collection, raw));
    return { answers, by: record.by.map(refs.by), dependsOn: within(record.dependsOn), shape: within(record.shape) };
};

const coverageOf = function coverageOf(context: GovlabContext): readonly CoverageView[] {
    return context
        .checkGaps()
        .collections.map((collection) => ({
            collection: collection.collection,
            questions: collection.questions.map((question) => ({
                answered: question.answered,
                declaredAbsent: question.declaredAbsent,
                question: question.question,
            })),
            records: collection.records,
        }));
};

export const resolutionOf = function resolutionOf(context: GovlabContext, resolve: Resolver): ResolutionView {
    const records = context.checkedRecords();
    const collections = new Set(records.map((record) => record.collection));
    const untyped = untypedResolvers(resolve);
    const refs: CheckRefs = {
        by: (raw) => (isTyped(raw, collections) ? resolve.target(raw) : { label: raw, ref: null }),
        within: (collection, raw) =>
            isTyped(raw, collections)
                ? resolve.target(raw)
                : (untyped.get(collection)?.(raw) ?? { label: raw, ref: null }),
    };
    const answers: CheckView[] = [];
    const slots = new Map<string, number>();
    const byRecord: Record<string, RecordCheckEntryView> = {};
    for (const record of records) {
        const view = answersOf(record.facet);
        const key = JSON.stringify(view);
        const slot = slots.get(key) ?? answers.push(view) - 1;
        slots.set(key, slot);
        byRecord[recordRefOf(record.collection, record.id)] = entryOf(record, slot, refs);
    }
    return {
        answers,
        byRecord,
        coverage: coverageOf(context),
        defects: context.validateResolution().total,
        records: records.length,
    };
};
