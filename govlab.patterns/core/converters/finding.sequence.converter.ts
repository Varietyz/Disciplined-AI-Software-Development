import { NULL_MODEL_LABELS, PREDICTION_METHODS, SEQUENCE_STRINGS } from "#configuration/strings/representation.strings";
import { explanationFinding, makeFinding, reasonOf } from "#core/factories/finding.factory";
import type { Finding } from "#types/finding.types";
import { ROUNDING } from "#configuration/constants/math.constants";
import type { SequenceSummary } from "#types/representation.types";
import { coordinate } from "#core/factories/axis.factory";
import { fixedTo } from "#core/normalizers/math.normalizer";
import { withSupport } from "#core/converters/finding.converter";

const transitionsFinding = function transitionsFinding(field: string, summary: SequenceSummary): Finding {
    const memory = summary.transitionSignificance;
    const verdict = memory.significant ? SEQUENCE_STRINGS.transitionsHasMemory : SEQUENCE_STRINGS.transitionsMemoryless;
    const observed = SEQUENCE_STRINGS.transitionsObserved(summary.changeRatio.toFixed(ROUNDING.standard));
    const explained = SEQUENCE_STRINGS.transitionsExplained(verdict, memory.pValue.toFixed(ROUNDING.fine));
    return makeFinding({
        coordinate: coordinate({
            analysis: "sequential",
            ontology: "change",
            reasoning: "explanation",
            representation: "symbolic",
        }),
        field,
        name: "transitions",
        narrative: reasonOf(observed, explained),
        observation: {
            changeRatio: fixedTo(summary.changeRatio, ROUNDING.fine),
            pValue: fixedTo(memory.pValue, ROUNDING.fine),
            significant: memory.significant,
            topTransitions: summary.topTransitions.map(([[from, to], count]) => ({ count, from, to })),
        },
        significance: {
            nullModel: NULL_MODEL_LABELS.transition,
            pValue: memory.pValue,
            significant: memory.significant,
            statistic: memory.statistic,
        },
    });
};

const runsFinding = function runsFinding(field: string, summary: SequenceSummary): Finding {
    return explanationFinding({
        analysis: "sequential",
        explained: SEQUENCE_STRINGS.runsExplained,
        field,
        name: "runs",
        observation: {
            longestRun: summary.longestRun,
            meanRun: fixedTo(summary.meanRun, ROUNDING.fine),
            runLengths: summary.runLengths.map(([length, count]) => ({ count, length })),
        },
        observed: SEQUENCE_STRINGS.runsObserved(summary.meanRun.toFixed(ROUNDING.standard), String(summary.longestRun)),
        ontology: "state",
        representation: "symbolic",
    });
};

const predictionFinding = function predictionFinding(field: string, summary: SequenceSummary): Finding | null {
    const [next] = summary.nextValue;
    if (!next || summary.lastValue === null) {
        return null;
    }
    const [value] = next;
    const observed = SEQUENCE_STRINGS.predictionObserved(summary.lastValue, value);
    const explained = SEQUENCE_STRINGS.predictionExplained(summary.markovAccuracy.toFixed(ROUNDING.standard));
    return makeFinding({
        coordinate: coordinate({
            analysis: "prediction",
            ontology: "change",
            reasoning: "prediction",
            representation: "dynamical-systems",
        }),
        field,
        name: "next-value-prediction",
        narrative: reasonOf(observed, explained),
        observation: { accuracy: summary.markovAccuracy, next: value },
        prediction: { accuracy: summary.markovAccuracy, method: PREDICTION_METHODS.markov },
    });
};

export const sequenceFindings = function sequenceFindings(field: string, summary: SequenceSummary): Finding[] {
    return withSupport(
        [transitionsFinding(field, summary), runsFinding(field, summary), predictionFinding(field, summary)],
        summary.count,
    );
};
