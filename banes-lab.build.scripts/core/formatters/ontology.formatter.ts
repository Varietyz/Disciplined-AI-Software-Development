import type { OntologySnapshot } from "@banes-lab/web/types/ontology.types.js";

export const renderSnapshot = function renderSnapshot(snapshot: OntologySnapshot): string {
    return [
        'import type { OntologySnapshot } from "#types/ontology.types";',
        "",
        `export const ONTOLOGY: OntologySnapshot = JSON.parse(${JSON.stringify(JSON.stringify(snapshot))});`,
        "",
    ].join("\n");
};
