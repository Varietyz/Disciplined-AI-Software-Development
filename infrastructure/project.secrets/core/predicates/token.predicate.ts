import { TOKEN_SHAPES } from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";
import { isInAlphabet } from "#core/predicates/character.predicate";

defineDetector({
    detects: (value) =>
        TOKEN_SHAPES.some((shape) =>
            shape.prefixes.some((prefix) => {
                const rest = value.slice(prefix.length);
                return value.startsWith(prefix) && rest.length >= shape.minRest && isInAlphabet(rest, shape.alphabet);
            }),
        ),
    kind: "token",
});
