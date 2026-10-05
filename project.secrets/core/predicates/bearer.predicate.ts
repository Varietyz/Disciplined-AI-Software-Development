import { BEARER_MIN_LENGTH, BEARER_PREFIX } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";

defineDetector({
    detects: (value) => value.startsWith(BEARER_PREFIX) && value.length > BEARER_MIN_LENGTH,
    kind: "bearer",
});
