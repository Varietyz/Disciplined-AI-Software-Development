import type { BuiltOntology, OntologyBuild } from "#types/ontology.types";
import { dirname, join } from "node:path";
import { renderReferenceFace, renderReferenceLoader } from "#core/formatters/reference.formatter";
import { absolutePath } from "@ssot/paths";
import { createGovlabContext } from "@govlab/context";
import { referenceFileOf } from "#core/resolvers/reference.resolver";
import { referencesOf } from "#core/converters/reference.converter";
import { renderSnapshot } from "#core/formatters/ontology.formatter";
import { renderVocabulary } from "#core/formatters/vocabulary.formatter";
import { snapshotOf } from "#core/converters/ontology.converter";
import { vocabularyOf } from "#core/converters/vocabulary.converter";
import { writeCanonicalText } from "@govlab/canonical-write";

export const composeOntology = function composeOntology(): BuiltOntology {
    const context = createGovlabContext();
    const snapshot = snapshotOf(context);
    return { collections: referencesOf(snapshot), context, snapshot };
};

export const buildOntology = async function buildOntology(): Promise<OntologyBuild> {
    const ontology = composeOntology();
    const { context, snapshot } = ontology;
    const vocabulary = vocabularyOf(context);
    const references = ontology.collections;
    const loaderPath = absolutePath("app.reference");
    const faces = [...references.entries()];
    const collections = faces.map(([face]) => face);
    await Promise.all([
        writeCanonicalText(absolutePath("app.ontology"), renderSnapshot(snapshot)),
        writeCanonicalText(absolutePath("app.vocabulary"), renderVocabulary(vocabulary)),
        writeCanonicalText(loaderPath, renderReferenceLoader(collections)),
        ...faces.map(async ([face, index]) => {
            const file = join(dirname(loaderPath), referenceFileOf(face));
            return writeCanonicalText(file, renderReferenceFace(index));
        }),
    ]);
    const records = faces.reduce((total, [, index]) => total + Object.keys(index).length, 0);
    return { ontology, phrases: vocabulary.length, references: records };
};
