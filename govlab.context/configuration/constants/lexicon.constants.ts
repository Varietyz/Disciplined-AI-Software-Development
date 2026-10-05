import type { ExampleShape } from "#types/lexicon.types";
import type { VocabularyEntry } from "#types/vocabulary.types";

export const EXAMPLE_SHAPE_VOCABULARY = [
    {
        definition:
            "A category whose every term carries one file its tag places, written as the folder, a slash and the filename.",
        value: "placed-file",
    },
    {
        definition:
            "A category whose every term carries a rename from the refused word to a covering tag, with the same subject before and after.",
        value: "renamed-file",
    },
] as const satisfies readonly VocabularyEntry[];

export const EXAMPLE_SHAPE_VALUES: readonly ExampleShape[] = EXAMPLE_SHAPE_VOCABULARY.map((entry) => entry.value);

export const EXAMPLE_SHAPES = { placed: "placed-file", renamed: "renamed-file" } as const satisfies Record<
    string,
    ExampleShape
>;

export const LEX_SUBJECT = "lexicon";

export const COLLECTION_CHECK_FILE = "check.data.json";

export const ENFORCED_BY_KEY = "enforcedBy";

export const EXAMPLE_SHAPE_KEY = "exampleShape";

export const FOLDER_SEPARATOR = "/";

export const SEGMENT_SEPARATOR = ".";

export const HYPHEN = "-";

export const TAG_SUFFIX = "-tag";

export const PLAIN_SEGMENTS = 3;

export const VARIANT_SEGMENTS = 4;

export const FILED_OPENINGS = [" filed in an ", " filed in a "] as const;

export const FOLDER_CLOSE = " folder";

export const SAME_NAME_CLAUSES = ["plural in both folder and tag", "singular in both folder and tag"] as const;

export const MIRRORED_CLAUSE = "placed in its subject's mirrored concern folder";

export const REFUSAL_OPENING = "Tagging ";

export const WORD_CHARS: ReadonlySet<string> = new Set("abcdefghijklmnopqrstuvwxyz0123456789-");
