import type { CheckDeclarationDefect, DeclarationField, DeclaredCheck } from "#types/check.types";
import { DECLARATION_FIELDS, INVARIANT_KIND, RECORD_KEY_SEPARATOR } from "#configuration/constants/check.constants";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Faces } from "#types/context.types";
import { NEGATIVE_KIND } from "#configuration/constants/architecture.constants";
import { collectionRefResolver } from "#core/resolvers/reference.resolver";

const ARCH_PREFIX = `${COLLECTIONS.architecture}${RECORD_KEY_SEPARATOR}`;
const LEX_PREFIX = `${COLLECTIONS.lexicon}${RECORD_KEY_SEPARATOR}`;
const INVARIANT_PREFIX = `${COLLECTIONS.reasoning}${RECORD_KEY_SEPARATOR}${INVARIANT_KIND}${RECORD_KEY_SEPARATOR}`;

const isAntiPattern = function isAntiPattern(faces: Faces, ref: string): boolean {
    return ref.startsWith(ARCH_PREFIX) && faces.arch.get(ref.slice(ARCH_PREFIX.length))?.type === NEGATIVE_KIND;
};

const isPositive = function isPositive(faces: Faces, ref: string): boolean {
    if (ref.startsWith(ARCH_PREFIX)) {
        const record = faces.arch.get(ref.slice(ARCH_PREFIX.length)) ?? null;
        return record !== null && record.type !== NEGATIVE_KIND;
    }
    return ref.startsWith(LEX_PREFIX) || ref.startsWith(INVARIANT_PREFIX);
};

const OF_KIND: Readonly<Record<DeclarationField, (faces: Faces, ref: string) => boolean>> = {
    detects: isAntiPattern,
    enforces: isPositive,
};

export const checkDeclarationDefectsOf = function checkDeclarationDefectsOf(
    faces: Faces,
    checks: readonly DeclaredCheck[],
): CheckDeclarationDefect[] {
    const resolves = collectionRefResolver(faces);
    return checks.flatMap((declared) =>
        DECLARATION_FIELDS.flatMap((field) =>
            declared[field].flatMap((ref) => {
                const resolved = resolves(ref);
                return resolved && OF_KIND[field](faces, ref) ? [] : [{ check: declared.check, field, ref, resolved }];
            }),
        ),
    );
};

export const declaringChecksOf = function declaringChecksOf(
    checks: readonly DeclaredCheck[],
): ReadonlyMap<string, readonly string[]> {
    const declaring = new Map<string, string[]>();
    for (const declared of checks) {
        for (const ref of DECLARATION_FIELDS.flatMap((field) => declared[field])) {
            declaring.set(ref, [...(declaring.get(ref) ?? []), declared.check]);
        }
    }
    return declaring;
};
