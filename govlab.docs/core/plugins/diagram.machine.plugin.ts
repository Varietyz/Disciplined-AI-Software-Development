import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_LEGENDS,
    DIAGRAM_TITLES,
    stateTitle,
} from "#configuration/strings/figure.strings";
import type { DiagramKind } from "#types/figure.types";
import type { StateModel } from "#types/diagram.types";
import { emitStateDiagram } from "#core/formatters/diagram.machine.formatter";

const MIN_STATES = 2;

export const diagram: DiagramKind = {
    appliesTo(context) {
        const state = context.codeGraph?.state ?? null;
        return state !== null && state.states.length >= MIN_STATES && state.transitions.length > 0;
    },
    id: "state",
    order: 4,
    render(context) {
        const state = context.codeGraph?.state ?? null;
        if (state === null || state.transitions.length === 0) {
            return null;
        }
        const model: StateModel = {
            accDescr: DIAGRAM_DESCRIPTIONS.state,
            accTitle: stateTitle(context.moduleName),
            nodes: state.states.map((name) => ({ id: name, label: name })),
            transitions: state.transitions.map((transition) => ({
                from: transition.from,
                label: transition.label,
                to: transition.to,
            })),
            ...(state.initial === null ? {} : { initial: state.initial }),
        };
        return { legend: DIAGRAM_LEGENDS.state, mermaid: emitStateDiagram(model), sources: [] };
    },
    title: DIAGRAM_TITLES.state,
};
