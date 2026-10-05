import {
    DISTRIBUTION_STRINGS,
    NULL_MODEL_LABELS,
    PREDICTION_METHODS,
} from "#configuration/strings/representation.strings";
import { explanationFinding, makeFinding, reasonOf } from "#core/factories/finding.factory";
import type { DistributionSummary } from "#types/representation.types";
import type { Finding } from "#types/finding.types";
import { ROUNDING } from "#configuration/constants/math.constants";
import { coordinate } from "#core/factories/axis.factory";
import { withSupport } from "#core/converters/finding.converter";

const frequencyFinding = function frequencyFinding(field: string, summary: DistributionSummary): Finding {
    const { count, distinct, top, witnesses } = summary;
    return explanationFinding({
        analysis: "frequency",
        explained: DISTRIBUTION_STRINGS.freqExplained(summary.entropyBits.toFixed(ROUNDING.standard)),
        field,
        name: "frequency",
        observation: { count, distinct, top, witnesses },
        observed: DISTRIBUTION_STRINGS.freqObserved(String(count), String(distinct)),
        ontology: "probability",
        representation: "symbolic",
    });
};

const uniformityFinding = function uniformityFinding(field: string, summary: DistributionSummary): Finding {
    const { chiSquare, dof, pValue, uniform } = summary.uniformity;
    const verdict = uniform ? DISTRIBUTION_STRINGS.uniformUniform : DISTRIBUTION_STRINGS.uniformDeparts;
    const observed = DISTRIBUTION_STRINGS.uniformObserved(chiSquare.toFixed(ROUNDING.coarse), String(dof));
    const explained = DISTRIBUTION_STRINGS.uniformExplained(pValue.toFixed(ROUNDING.fine), verdict);
    return makeFinding({
        coordinate: coordinate({
            analysis: "statistical",
            ontology: "probability",
            reasoning: "explanation",
            representation: "probability",
        }),
        field,
        name: "uniformity",
        narrative: reasonOf(observed, explained),
        observation: { chiSquare, dof, pValue, uniform },
        significance: { nullModel: NULL_MODEL_LABELS.uniformity, pValue, significant: !uniform, statistic: chiSquare },
    });
};

const plainFindings = function plainFindings(field: string, summary: DistributionSummary): Finding[] {
    return [
        explanationFinding({
            analysis: "time",
            explained: DISTRIBUTION_STRINGS.recencyExplained,
            field,
            name: "recency",
            observation: { overdue: summary.overdue },
            observed: DISTRIBUTION_STRINGS.recencyObserved,
            ontology: "time",
            representation: "symbolic",
        }),
        explanationFinding({
            analysis: "frequency",
            explained: DISTRIBUTION_STRINGS.temperatureExplained,
            field,
            name: "temperature",
            observation: { cold: summary.cold, hot: summary.hot },
            observed: DISTRIBUTION_STRINGS.temperatureObserved,
            ontology: "change",
            representation: "number",
        }),
        explanationFinding({
            analysis: "change",
            explained: DISTRIBUTION_STRINGS.driftExplained,
            field,
            name: "drift",
            observation: { drift: summary.drift },
            observed: DISTRIBUTION_STRINGS.driftObserved,
            ontology: "change",
            representation: "number",
        }),
        explanationFinding({
            analysis: "complexity",
            explained: DISTRIBUTION_STRINGS.complexityExplained,
            field,
            name: "complexity",
            observation: { complexity: summary.complexity },
            observed: DISTRIBUTION_STRINGS.complexityObserved,
            ontology: "novelty",
            representation: "information-theory",
        }),
    ];
};

const seasonalityFinding = function seasonalityFinding(field: string, summary: DistributionSummary): Finding | null {
    const { temporal } = summary;
    if (temporal === null) {
        return null;
    }
    return explanationFinding({
        analysis: "time",
        explained: DISTRIBUTION_STRINGS.seasonalityExplained,
        field,
        name: "seasonality",
        observation: { temporal },
        observed: DISTRIBUTION_STRINGS.seasonalityObserved(temporal.first, temporal.last),
        ontology: "time",
        representation: "number",
    });
};

const predictionFinding = function predictionFinding(field: string, summary: DistributionSummary): Finding | null {
    const [top] = summary.top;
    if (!top) {
        return null;
    }
    const [mode] = top;
    const explained = DISTRIBUTION_STRINGS.predictionExplained(summary.modeAccuracy.toFixed(ROUNDING.standard));
    return makeFinding({
        coordinate: coordinate({
            analysis: "prediction",
            ontology: "probability",
            reasoning: "prediction",
            representation: "probability",
        }),
        field,
        name: "mode-prediction",
        narrative: reasonOf(DISTRIBUTION_STRINGS.predictionObserved(mode), explained),
        observation: { accuracy: summary.modeAccuracy, mode },
        prediction: { accuracy: summary.modeAccuracy, method: PREDICTION_METHODS.mode },
    });
};

export const distributionFindings = function distributionFindings(
    field: string,
    summary: DistributionSummary,
): Finding[] {
    return withSupport(
        [
            frequencyFinding(field, summary),
            uniformityFinding(field, summary),
            ...plainFindings(field, summary),
            seasonalityFinding(field, summary),
            predictionFinding(field, summary),
        ],
        summary.count,
    );
};
