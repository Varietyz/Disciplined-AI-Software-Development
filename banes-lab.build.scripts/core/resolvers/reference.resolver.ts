import { FACE_JOINER, REFERENCE_STEM, REFERENCE_SUFFIX } from "#configuration/constants/reference.constants";

export const referenceFileOf = function referenceFileOf(face: string): string {
    return REFERENCE_STEM + FACE_JOINER + face + REFERENCE_SUFFIX;
};
