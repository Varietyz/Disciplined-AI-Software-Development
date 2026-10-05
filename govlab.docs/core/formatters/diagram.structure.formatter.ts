import type { ClassBox, ClassMember, ClassModel, ClassRelation, ClassRelationKind } from "#types/diagram.types";
import { idSanitize, label } from "#core/normalizers/diagram.normalizer";
import { accLines } from "#core/formatters/diagram.formatter";
import { byString } from "#core/selectors/base.selector";

const INDENT = "    ";

const RELATION_SYMBOLS: ReadonlyMap<ClassRelationKind, string> = new Map<ClassRelationKind, string>([
    ["composition", "*--"],
    ["aggregation", "o--"],
    ["realization", "<|.."],
    ["dependency", "..>"],
]);

const byBoxId = byString<ClassBox>((box) => box.id);
const byMemberName = byString<ClassMember>((member) => member.name);
const byRelation = byString<ClassRelation>((relation) => `${relation.from} ${relation.to} ${relation.kind}`);

const memberLines = function memberLines(box: ClassBox): string[] {
    const id = idSanitize(box.id);
    return [
        `${INDENT}class ${id}["${label(box.label)}"]`,
        ...box.members.toSorted(byMemberName).map((member) => `${INDENT}${id} : +${label(member.name)}`),
    ];
};

const relationLine = function relationLine(relation: ClassRelation): string {
    const suffix = typeof relation.label === "string" ? ` : ${label(relation.label)}` : "";
    const symbol = RELATION_SYMBOLS.get(relation.kind) ?? "";
    return `${INDENT}${idSanitize(relation.from)} ${symbol} ${idSanitize(relation.to)}${suffix}`;
};

export const emitClassDiagram = function emitClassDiagram(model: ClassModel): string {
    return [
        "classDiagram",
        ...accLines(model),
        ...model.classes.toSorted(byBoxId).flatMap(memberLines),
        ...model.relations.toSorted(byRelation).map(relationLine),
    ].join("\n");
};
