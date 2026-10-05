import {
    GRAMMAR_EMBLEM_FLOAT,
    GRAMMAR_EMBLEM_SCALE,
    GRAMMAR_GLOW,
    GRAMMAR_GLOW_SWING,
} from "#configuration/data/grammar.data";
import { placeAt, swing } from "#core/evaluators/card.fragment.evaluator";
import { GRAMMAR_CARD } from "#core/ids/card.ids";
import { GRAMMAR_EMBLEM } from "@banes-lab/web/core/assets/image.assets.ts";
import { GRAMMAR_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { GRAMMAR_SHARE } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { PAGE_LAYOUT } from "#configuration/data/page.data";
import { createPageCard } from "#core/factories/page.factory";
import { registerCard } from "#core/registries/card.registry";
import shader from "../shaders/grammar.shader.wgsl?raw";
import stylesheet from "../styles/grammar.style.css?raw";

registerCard(
    createPageCard({
        field: [
            {
                id: "field",
                kind: "shader",
                placement: { height: 1, width: 1, x: 0, y: 0 },
                shader,
                uniforms: { glow: (frame) => GRAMMAR_GLOW + GRAMMAR_GLOW_SWING * swing(frame.progress) },
            },
        ],
        id: GRAMMAR_CARD,
        mark: {
            alt: GRAMMAR_SHARE.headline,
            className: "grammar-emblem",
            id: "mark",
            kind: "image",
            placement: placeAt(PAGE_LAYOUT, "mark", {
                grow: () => GRAMMAR_EMBLEM_SCALE,
                lift: (frame) => GRAMMAR_EMBLEM_FLOAT * swing(frame.progress),
                square: true,
            }),
            source: GRAMMAR_EMBLEM,
        },
        page: GRAMMAR_PAGE,
        stylesheet,
    }),
    import.meta.url,
);
