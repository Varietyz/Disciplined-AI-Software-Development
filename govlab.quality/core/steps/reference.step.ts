import { CONCEPT_PREFIX, NONE_PREFIX } from "#configuration/constants/canon.constants";
import { absolutePath } from "@ssot/paths";
import { canonRefsModule } from "#core/formatters/canon.reference.formatter";
import { createGovlabContext } from "@govlab/context";
import { defineStep } from "#core/registries/step.registry";
import { unknownCanonRef } from "#configuration/strings/catalog.strings";

interface Declaration {
    canon: readonly string[];
    ref: string;
}

interface Join {
    concept: string;
    ref: string;
}

const declarationsOf = function declarationsOf(context: ReturnType<typeof createGovlabContext>): Declaration[] {
    return [
        ...context.arch
            .all()
            .map((principle) => ({ canon: principle.canon ?? [], ref: `architecture:${principle.id}` })),
        ...context.algo.all().map((contract) => ({ canon: contract.canon ?? [], ref: `algorithms:${contract.id}` })),
        ...context.reason
            .failureShapes()
            .map((shape) => ({ canon: shape.canon, ref: `reasoning:failure-shape:${shape.id}` })),
    ];
};

const joinsOf = function joinsOf(declarations: readonly Declaration[]): Join[] {
    return declarations.flatMap((declaration) =>
        declaration.canon
            .filter((concept) => !concept.startsWith(NONE_PREFIX))
            .map((concept) => ({ concept, ref: declaration.ref })),
    );
};

defineStep({
    gives: [],
    name: "reference",
    needs: ["concepts"],
    run: async (state, writer) => {
        const concepts = (state.concepts ?? []).map((concept) => concept.id);
        const known = new Set(concepts);
        const joins = joinsOf(declarationsOf(createGovlabContext()));
        const unknown = joins.filter((join) => !known.has(join.concept));
        if (unknown.length > 0) {
            throw new Error(unknown.map((join) => unknownCanonRef(join.ref, join.concept)).join(""));
        }
        const entries = concepts.map((concept): [string, string[]] => [
            concept,
            [
                `${CONCEPT_PREFIX}${concept}`,
                ...joins.filter((join) => join.concept === concept).map((join) => join.ref),
            ],
        ]);
        await writer.text(absolutePath("govlab.quality.generated.canon"), canonRefsModule(entries));
        return {};
    },
});
