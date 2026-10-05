import { NULL_MODEL_LABELS, VECTOR_STRINGS } from "#configuration/strings/representation.strings";
import { autocorrelationSignificance, normalSignificance } from "#core/analyzers/baseline.analyzer";
import { explanationFinding, makeFinding, reasonOf } from "#core/factories/finding.factory";
import type { Finding } from "#types/finding.types";
import { ROUNDING } from "#configuration/constants/math.constants";
import type { VectorSummary } from "#types/representation.types";
import { coordinate } from "#core/factories/axis.factory";
import { fixedTo } from "#core/normalizers/math.normalizer";
import { withSupport } from "#core/converters/finding.converter";

const distributionFinding = function distributionFinding(field: string, summary: VectorSummary): Finding {
    return explanationFinding({
        analysis: "statistical",
        explained: VECTOR_STRINGS.distributionExplained(
            summary.minimum.toFixed(ROUNDING.standard),
            summary.maximum.toFixed(ROUNDING.standard),
        ),
        field,
        name: "distribution",
        observation: {
            count: summary.count,
            max: fixedTo(summary.maximum, ROUNDING.fine),
            mean: fixedTo(summary.mean, ROUNDING.fine),
            min: fixedTo(summary.minimum, ROUNDING.fine),
            stddev: fixedTo(summary.stddev, ROUNDING.fine),
        },
        observed: VECTOR_STRINGS.distributionObserved(
            summary.mean.toFixed(ROUNDING.standard),
            summary.stddev.toFixed(ROUNDING.standard),
        ),
        ontology: "scale",
        representation: "number",
    });
};

const autocorrelationFinding = function autocorrelationFinding(field: string, summary: VectorSummary): Finding {
    const significance = autocorrelationSignificance(summary.autocorrelation, summary.count);
    const verdict = significance.significant ? VECTOR_STRINGS.autocorBeyond : VECTOR_STRINGS.autocorWithin;
    const explained = VECTOR_STRINGS.autocorExplained(verdict, significance.pValue.toFixed(ROUNDING.fine));
    return makeFinding({
        coordinate: coordinate({
            analysis: "sequential",
            ontology: "relation",
            reasoning: "explanation",
            representation: "dynamical-systems",
        }),
        field,
        name: "autocorrelation",
        narrative: reasonOf(VECTOR_STRINGS.autocorObserved, explained),
        observation: {
            autocorrelation: fixedTo(summary.autocorrelation, ROUNDING.fine),
            pValue: fixedTo(significance.pValue, ROUNDING.fine),
            significant: significance.significant,
        },
        significance: {
            nullModel: NULL_MODEL_LABELS.autocorrelation,
            pValue: significance.pValue,
            significant: significance.significant,
            statistic: significance.statistic,
        },
    });
};

const anomalyRows = function anomalyRows(summary: VectorSummary): Readonly<Record<string, unknown>>[] {
    return summary.outliers.map(([value, z, index]) => {
        const significance = normalSignificance(z);
        return {
            pValue: fixedTo(significance.pValue, ROUNDING.fine),
            record: index,
            significant: significance.significant,
            value: fixedTo(value, ROUNDING.fine),
            z: fixedTo(z, ROUNDING.fine),
        };
    });
};

const anomalyFinding = function anomalyFinding(field: string, summary: VectorSummary): Finding | null {
    if (summary.outliers.length === 0) {
        return null;
    }
    const rows = anomalyRows(summary);
    const extreme = rows.filter((row) => row["significant"] === true).length;
    return explanationFinding({
        analysis: "anomaly",
        explained: VECTOR_STRINGS.anomalyExplained(String(extreme)),
        field,
        name: "anomaly",
        observation: { outliers: rows, significant: extreme },
        observed: VECTOR_STRINGS.anomalyObserved,
        ontology: "probability",
        representation: "number",
    });
};

export const vectorFindings = function vectorFindings(field: string, summary: VectorSummary): Finding[] {
    return withSupport(
        [distributionFinding(field, summary), autocorrelationFinding(field, summary), anomalyFinding(field, summary)],
        summary.count,
    );
};
