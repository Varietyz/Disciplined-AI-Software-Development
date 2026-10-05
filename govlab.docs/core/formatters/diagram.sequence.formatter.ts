import type { MessageKind, SequenceModel, SequenceStep } from "#types/diagram.types";
import { idSanitize, label } from "#core/normalizers/diagram.normalizer";
import { accLines } from "#core/formatters/diagram.formatter";

const INDENT = "    ";

const arrow = function arrow(kind: MessageKind): string {
    return kind === "return" ? "-->>" : "->>";
};

const stepLine = function stepLine(step: SequenceStep): string[] {
    if (step.message) {
        const { message } = step;
        return [
            `${INDENT}${idSanitize(message.from)}${arrow(message.kind)}${idSanitize(message.to)}: ${label(message.text)}`,
        ];
    }
    if (step.note) {
        return [`${INDENT}Note over ${step.note.over.map(idSanitize).join(",")}: ${label(step.note.text)}`];
    }
    return [];
};

export const emitSequence = function emitSequence(model: SequenceModel): string {
    return [
        "sequenceDiagram",
        ...accLines(model),
        ...(model.autonumber === true ? [`${INDENT}autonumber`] : []),
        ...model.participants.map(
            (participant) => `${INDENT}participant ${idSanitize(participant.id)} as ${label(participant.label)}`,
        ),
        ...model.steps.flatMap(stepLine),
    ].join("\n");
};
