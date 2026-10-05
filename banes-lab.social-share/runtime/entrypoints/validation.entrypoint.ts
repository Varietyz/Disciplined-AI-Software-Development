import {
    CARDS_VALID,
    HEALING,
    MALFORMED_SHARE_MAP,
    MISSING_IMAGE,
    NO_CARDS,
    ORPHAN_IMAGE,
    PRUNED_PREFIX,
    RENDERED_PREFIX,
    STALE_IMAGE,
    STALE_MAP,
    SUBJECT_SEPARATOR,
    VALIDATION_SUMMARY,
} from "#configuration/strings/card.strings";
import { conclude, say } from "#core/reporters/card.reporter";
import {
    missingImages,
    orphanImages,
    readLedger,
    shareEntriesOf,
    staleEntries,
} from "#core/persistence/image.persistence";
import { strayShares, unpublishedShares } from "#core/persistence/export.persistence";
import type { CardFinding } from "#types/card.types";
import { PROFILES } from "#configuration/configs/card.config";
import type { ShareImage } from "@banes-lab/web/types/card.types.ts";
import { VALIDATION_COMMAND } from "#configuration/constants/card.constants";
import { absolutePath } from "@ssot/paths";
import { animationFindings } from "#core/probes/image.probe";
import { defineCheck } from "@govlab/context/check";
import { exportCards } from "#core/coordinators/export.coordinator";
import { openStage } from "#core/adapters/stage.adapter";
import { pathToFileURL } from "node:url";
import { resolveArgv } from "@govlab/argv";
import { validateCards } from "#core/validators/card.validator";

defineCheck({ detects: [], enforces: ["architecture:reproducibility"] });

interface ShareMapModule {
    readonly SHARE_IMAGES: ReadonlyMap<string, ShareImage>;
}

resolveArgv({ command: VALIDATION_COMMAND, flags: [], summary: VALIDATION_SUMMARY });

const RENDERS = absolutePath("app.cardRenders");
const SHARES = absolutePath("app.shares");
const FRESH_QUERY = "?read=";
const SHARE_EXPORT = "SHARE_IMAGES";

const loader = await openStage(false);
const loaded = await loader.cards();
await loader.close();

const specs = loaded.cards.map((card) => card.spec);

const specFindings: readonly CardFinding[] = [
    ...(loaded.cards.length === 0 ? [{ card: VALIDATION_COMMAND, message: NO_CARDS }] : []),
    ...validateCards(loaded.cards, loaded.plugins, {
        brand: loaded.brand,
        pages: loaded.pages,
        profiles: PROFILES,
        repeated: loaded.repeated,
    }),
    ...(await animationFindings(specs, absolutePath("app.public"))),
];

const isShareMapModule = function isShareMapModule(value: unknown): value is ShareMapModule {
    return typeof value === "object" && value !== null && Reflect.get(value, SHARE_EXPORT) instanceof Map;
};

const shareMap = async function shareMap(): Promise<ReadonlyMap<string, ShareImage>> {
    const location = pathToFileURL(absolutePath("app.shareMap")).href + FRESH_QUERY + String(Date.now());
    const module: unknown = await import(location);
    if (!isShareMapModule(module)) {
        throw new TypeError(MALFORMED_SHARE_MAP + SUBJECT_SEPARATOR + location);
    }
    return module.SHARE_IMAGES;
};

const mapFindings = async function mapFindings(): Promise<readonly CardFinding[]> {
    const expected = shareEntriesOf(specs, RENDERS);
    const held = await shareMap();
    const mapCurrent =
        expected.length === held.size &&
        expected.every(({ page, ...share }) => JSON.stringify(held.get(page)) === JSON.stringify(share));
    return [
        ...(mapCurrent ? [] : [{ card: VALIDATION_COMMAND, message: STALE_MAP }]),
        ...unpublishedShares(expected, SHARES).map((file) => ({ card: file, message: MISSING_IMAGE })),
        ...strayShares(expected, SHARES).map((file) => ({ card: file, message: ORPHAN_IMAGE })),
    ];
};

const outputFindings = async function outputFindings(): Promise<readonly CardFinding[]> {
    const missing = missingImages(specs, RENDERS).map((file) => ({ card: file, message: MISSING_IMAGE }));
    return [
        ...missing,
        ...orphanImages(specs, RENDERS).map((file) => ({ card: file, message: ORPHAN_IMAGE })),
        ...staleEntries(specs, readLedger(absolutePath("app.shareLedger"))).map((entry) => ({
            card: entry,
            message: STALE_IMAGE,
        })),
        ...(missing.length === 0 ? await mapFindings() : []),
    ];
};

const heal = async function heal(): Promise<void> {
    say(HEALING);
    const capture = await openStage(true);
    try {
        const result = await exportCards({ force: false, gpu: false, only: null, url: capture.url }, specs);
        for (const key of result.rendered) {
            say(RENDERED_PREFIX + key);
        }
        for (const file of result.pruned) {
            say(PRUNED_PREFIX + file);
        }
    } finally {
        await capture.close();
    }
};

if (specFindings.length === 0 && (await outputFindings()).length > 0) {
    await heal();
}

conclude([...specFindings, ...(specFindings.length === 0 ? await outputFindings() : [])], CARDS_VALID);
