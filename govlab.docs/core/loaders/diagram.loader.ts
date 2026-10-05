import type { DiagramKind } from "#types/figure.types";
import { absolutePath } from "@ssot/paths";
import { isRecord } from "#core/predicates/record.predicate";
import { loadExports } from "#core/loaders/plugin.loader";

const EXPORT_KEY = "diagram";

const isDiagramKind = function isDiagramKind(value: unknown): value is DiagramKind {
    return isRecord(value) && typeof value["id"] === "string" && typeof value["order"] === "number";
};

const loadDiagramKinds = async function loadDiagramKinds(): Promise<DiagramKind[]> {
    const kinds = await loadExports(absolutePath("govlab.docs.plugins"), EXPORT_KEY, isDiagramKind);
    return kinds.toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
};

export const DIAGRAM_KINDS: readonly DiagramKind[] = await loadDiagramKinds();
