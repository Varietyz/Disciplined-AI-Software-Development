import {
    DIAGRAM_DESCRIPTIONS,
    DIAGRAM_LEGENDS,
    DIAGRAM_TITLES,
    orchestrationTitle,
} from "#configuration/strings/figure.strings";
import type { DiagramKind } from "#types/figure.types";
import type { SequenceModel } from "#types/diagram.types";
import { emitSequence } from "#core/formatters/diagram.sequence.formatter";

const MIN_PARTICIPANTS = 2;
const MIN_MESSAGES = 2;

export const diagram: DiagramKind = {
    appliesTo(context) {
        const protocol = context.codeGraph?.protocol ?? null;
        return (
            protocol !== null &&
            protocol.participants.length >= MIN_PARTICIPANTS &&
            protocol.messages.length >= MIN_MESSAGES
        );
    },
    id: "sequence",
    order: 6,
    render(context) {
        const protocol = context.codeGraph?.protocol ?? null;
        if (protocol === null || protocol.messages.length < MIN_MESSAGES) {
            return null;
        }
        const model: SequenceModel = {
            accDescr: DIAGRAM_DESCRIPTIONS.sequence,
            accTitle: orchestrationTitle(context.moduleName),
            autonumber: true,
            participants: [
                { id: protocol.self, label: protocol.self },
                ...protocol.participants.map((participant) => ({ id: participant, label: participant })),
            ],
            steps: protocol.messages.map((message) => ({
                message: {
                    from: protocol.self,
                    kind: message.async ? "async" : "sync",
                    text: message.text,
                    to: message.to,
                },
            })),
        };
        return { legend: DIAGRAM_LEGENDS.sequence, mermaid: emitSequence(model), sources: [] };
    },
    title: DIAGRAM_TITLES.sequence,
};
