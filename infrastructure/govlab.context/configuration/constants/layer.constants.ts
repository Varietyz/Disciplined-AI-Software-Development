import type { LayerEdgeKind, ResolutionMechanism } from "#types/layer.types";
import type { VocabularyEntry } from "#types/vocabulary.types";

export const LAYER_EDGE_KIND_VOCABULARY = [
    { definition: "An edge along which one layer's output becomes the next layer's input.", value: "feeds" },
    { definition: "An edge that returns a layer's results to the layer that feeds it.", value: "feedback" },
    {
        definition: "An edge from a cross-cutting domain to the structural core it applies across.",
        value: "cross-cuts",
    },
    { definition: "An edge along which one layer reads another layer's state without changing it.", value: "observe" },
] as const satisfies readonly VocabularyEntry[];

export const LAYER_EDGE_KIND_VALUES: readonly LayerEdgeKind[] = LAYER_EDGE_KIND_VOCABULARY.map((entry) => entry.value);

export const RESOLUTION_MECHANISM_VOCABULARY = [
    { definition: "A resolution in which each principle holds whole inside its own scope.", value: "scope-separation" },
    {
        definition: "A resolution in which an operating point is measured, chosen and written down beside the choice.",
        value: "irreducible-tradeoff",
    },
    {
        definition: "A resolution in which a rule names the discriminator between two things that share a scope.",
        value: "mitigation",
    },
] as const satisfies readonly VocabularyEntry[];

export const RESOLUTION_MECHANISM_VALUES: readonly ResolutionMechanism[] = RESOLUTION_MECHANISM_VOCABULARY.map(
    (entry) => entry.value,
);

export const GRAPH_FILE = "graph.data.json";

export const INDEX_FILE = "index.data.json";

export const TENSION_FILE = "tension.data.json";

export const EDGES_KEY = "edges";

export const MEMBERSHIP_KEY = "membership";

export const RESOLUTIONS_KEY = "resolutions";

export const PAIR_SEPARATOR = "|";
