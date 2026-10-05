import type { Finding } from "#types/finding.types";
import { GRID_STRINGS } from "#configuration/strings/representation.strings";
import type { GridSummary } from "#types/representation.types";
import { explanationFinding } from "#core/factories/finding.factory";
import { withSupport } from "#core/converters/finding.converter";

export const gridFindings = function gridFindings(field: string, summary: GridSummary): Finding[] {
    const { densestCell, densestCount, distinctCells, points } = summary;
    const density = explanationFinding({
        analysis: "space",
        explained: GRID_STRINGS.densityExplained(densestCell, String(densestCount)),
        field,
        name: "density",
        observation: { densestCell, densestCount, distinctCells, points },
        observed: GRID_STRINGS.densityObserved(String(points), String(distinctCells)),
        ontology: "space",
        representation: "geometry",
    });
    return withSupport([density], points);
};
