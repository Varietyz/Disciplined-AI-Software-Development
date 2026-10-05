import type { TermCategory, TermRecord } from "@govlab/context/types/lexicon.types.ts";

export const STORES = "stores";
export const STORE_NAME = "Store Tag";
export const STORE_ID = "store-tag";
export const CART_PATH = "stores/cart.store.ts";
export const MANAGER_PATH = "managers/cart.manager.ts";
export const PATH_LANG = "path";
export const CODE_MEDIUM = "code";

export const tag = (name: string, folder: string, extra: Partial<TermRecord> = {}): TermRecord => ({
    definition: `A formal definition of the tag for a file that is planted for the test, filed in a ${folder} folder.`,
    kind: "artifact",
    name,
    ...extra,
});

export const marker = (example: string): TermRecord => ({
    definition:
        "A formal definition of the compound marker for a planted file, which is exempt from the naming grammar and placed in its subject's mirrored concern folder.",
    example,
    kind: "artifact",
    name: "Test Tag",
});

export const rename = (before: string, after: string): TermRecord => ({
    definition: "Tagging a file with a planted refused word.",
    exemplar: { after, before, lang: PATH_LANG, medium: CODE_MEDIUM },
    kind: "anti-pattern",
    name: "Planted Refusal",
    seeAlso: [STORE_ID],
});

export const placedCategory = (records: TermRecord[]): TermCategory => ({
    category: "planted-placed",
    exampleShape: "placed-file",
    records,
});

export const CART = tag(STORE_NAME, STORES, { example: CART_PATH });
