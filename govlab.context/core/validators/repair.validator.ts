import {
    FORMED_BY_MISPLACED,
    FORMED_BY_MISSING,
    REPAIR_NO_RECORD,
    VIOLATED_BY_MISSING,
    repairWrongKind,
} from "#configuration/strings/validation.strings";
import { NEGATIVE_KIND, REPAIR_FIELDS, REPAIR_RANGES } from "#configuration/constants/architecture.constants";
import type { Principle, RepairField } from "#types/architecture.types";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";
import type { RepairDefect } from "#types/validation.types";

const REF_SEPARATOR = ":";
const FORMED_BY = "formed_by";
const VIOLATED_BY = "violated_by";

type KindLookup = (ref: string) => string | null;

export const repairKindLookup = function repairKindLookup(faces: Pick<Faces, "arch" | "lex">): KindLookup {
    return (ref) => {
        const at = ref.indexOf(REF_SEPARATOR);
        const collection = ref.slice(0, at);
        const id = ref.slice(at + 1);
        if (collection === COLLECTIONS.architecture) {
            return faces.arch.get(id)?.type ?? null;
        }
        return collection === COLLECTIONS.lexicon ? (faces.lex.get(id)?.kind ?? null) : null;
    };
};

const fieldDefects = function fieldDefects(
    kindOf: KindLookup,
    principle: Principle,
    field: RepairField,
): RepairDefect[] {
    const ref = `${COLLECTIONS.architecture}${REF_SEPARATOR}${principle.id}`;
    const admitted = REPAIR_RANGES[field];
    return (principle[field] ?? []).flatMap((target) => {
        const kind = kindOf(target);
        if (kind === null) {
            return [{ field, reason: REPAIR_NO_RECORD, ref, target }];
        }
        return admitted.has(kind) ? [] : [{ field, reason: repairWrongKind(kind, [...admitted]), ref, target }];
    });
};

const shapeDefects = function shapeDefects(principle: Principle): RepairDefect[] {
    const ref = `${COLLECTIONS.architecture}${REF_SEPARATOR}${principle.id}`;
    const negative = principle.type === NEGATIVE_KIND;
    const formed = principle.formed_by !== undefined;
    const violated = (principle.violated_by ?? []).length > 0;
    return [
        ...(negative && !formed ? [{ field: FORMED_BY, reason: FORMED_BY_MISSING, ref, target: "" }] : []),
        ...(!negative && formed ? [{ field: FORMED_BY, reason: FORMED_BY_MISPLACED, ref, target: "" }] : []),
        ...(!negative && !violated ? [{ field: VIOLATED_BY, reason: VIOLATED_BY_MISSING, ref, target: "" }] : []),
    ];
};

export const repairDefectsOf = function repairDefectsOf(
    principles: readonly Principle[],
    kindOf: KindLookup,
): RepairDefect[] {
    return principles.flatMap((principle) => [
        ...shapeDefects(principle),
        ...REPAIR_FIELDS.flatMap((field) => fieldDefects(kindOf, principle, field)),
    ]);
};
