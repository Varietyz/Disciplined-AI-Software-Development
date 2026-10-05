import type { StateModel, StateNode, StateTransition } from "#types/diagram.types";
import { idSanitize, label } from "#core/normalizers/diagram.normalizer";
import { accLines } from "#core/formatters/diagram.formatter";
import { byString } from "#core/selectors/base.selector";

const INDENT = "    ";

const byNodeId = byString<StateNode>((node) => node.id);
const byTransition = byString<StateTransition>(
    (transition) => `${transition.from} ${transition.to} ${transition.label ?? ""}`,
);

const transitionLine = function transitionLine(transition: StateTransition): string {
    const suffix = typeof transition.label === "string" ? ` : ${label(transition.label)}` : "";
    return `${INDENT}${idSanitize(transition.from)} --> ${idSanitize(transition.to)}${suffix}`;
};

export const emitStateDiagram = function emitStateDiagram(model: StateModel): string {
    return [
        "stateDiagram-v2",
        ...accLines(model),
        ...model.nodes
            .toSorted(byNodeId)
            .map((node) => `${INDENT}state "${label(node.label)}" as ${idSanitize(node.id)}`),
        ...(typeof model.initial === "string" ? [`${INDENT}[*] --> ${idSanitize(model.initial)}`] : []),
        ...model.transitions.toSorted(byTransition).map(transitionLine),
    ].join("\n");
};
