import { DATABASE_SCHEMES } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";

defineDetector({
    detects: (value) => DATABASE_SCHEMES.some((scheme) => value.startsWith(scheme) && value.length > scheme.length),
    kind: "database",
});
