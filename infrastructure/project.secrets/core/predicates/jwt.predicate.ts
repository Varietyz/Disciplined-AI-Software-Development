import { JWT_MIN_SEGMENT, JWT_OPENING, JWT_SEGMENTS, JWT_SEPARATOR } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";
import { isBase64Url } from "#core/predicates/character.predicate";

defineDetector({
    detects: (value) => {
        const segments = value.split(JWT_SEPARATOR);
        return (
            value.startsWith(JWT_OPENING) &&
            segments.length === JWT_SEGMENTS &&
            segments.every((segment) => segment.length >= JWT_MIN_SEGMENT && isBase64Url(segment))
        );
    },
    kind: "jwt",
});
