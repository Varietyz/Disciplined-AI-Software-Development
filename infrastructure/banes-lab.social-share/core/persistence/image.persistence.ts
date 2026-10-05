import type { CardSpec, Profile } from "#types/card.types";
import { FILE_SEPARATOR, HASH_ALGORITHM, STAGE_SHEETS } from "#configuration/constants/card.constants";
import {
    GIF_COLORS,
    GIF_DITHER,
    GIF_PALETTE_STATS,
    OUTPUT_FRAME_MS,
    OUTPUT_RATE,
    OUTPUT_SCALES,
    SHARE_BYTE_LIMIT,
    SHARE_PROFILE,
    VIDEO_CRF,
    WEBP_QUALITY,
} from "#configuration/configs/card.config";
import {
    MALFORMED_LEDGER,
    MISSING_SHARE_PROFILE,
    SHARE_TOO_LARGE,
    SUBJECT_SEPARATOR,
} from "#configuration/strings/card.strings";
import type { RenderedImage, ShareEntry, ShareLedger } from "#types/image.types";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { imageFilesOf, outputsOf, profilesOf, shareCandidatesOf } from "#core/converters/filename.converter";
import { join, relative, sep } from "node:path";
import { writeCanonicalText, writeVerbatim } from "@govlab/canonical-write";
import type { CaptureJob } from "#types/stage.types";
import { absolutePath } from "@ssot/paths";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolveCard } from "#core/evaluators/card.evaluator";
import { samplesOf } from "#core/timers/stage.timer";

const SLASH = "/";
const HEX = "hex";
const TEXT = "utf8";

const sheetBytes = function sheetBytes(): readonly Buffer[] {
    return STAGE_SHEETS.map((sheet) => readFileSync(fileURLToPath(import.meta.resolve(sheet))));
};

const assetBytes = function assetBytes(spec: CardSpec): readonly Buffer[] {
    return spec.layers.flatMap((layer) =>
        layer.kind === "animation" || layer.kind === "image"
            ? [readFileSync(join(absolutePath("app.public"), layer.source))]
            : [],
    );
};

export const hashOf = function hashOf(spec: CardSpec, profile: Profile): string {
    const hash = createHash(HASH_ALGORITHM);
    const encoding = {
        colors: GIF_COLORS,
        crf: VIDEO_CRF,
        dither: GIF_DITHER,
        frameMs: OUTPUT_FRAME_MS,
        palette: GIF_PALETTE_STATS,
        quality: WEBP_QUALITY,
        scales: OUTPUT_SCALES,
    };
    hash.update(JSON.stringify({ encoding, timeline: spec.timeline }));
    for (const bytes of [...sheetBytes(), ...assetBytes(spec)]) {
        hash.update(bytes);
    }
    for (const sample of [spec.timeline.keyFrame, ...samplesOf(spec.timeline, OUTPUT_RATE)]) {
        hash.update(JSON.stringify(resolveCard(spec, profile, sample)));
    }
    return hash.digest(HEX);
};

export const ledgerKeyOf = function ledgerKeyOf(card: string, profile: string): string {
    return card + FILE_SEPARATOR + profile;
};

const publicRoot = function publicRoot(): string {
    return SLASH + relative(absolutePath("app.public"), absolutePath("app.shares")).split(sep).join(SLASH);
};

const shareFileIn = function shareFileIn(spec: CardSpec, profile: Profile, folder: string): string {
    const file = shareCandidatesOf(spec, profile).find(
        (candidate) => statSync(join(folder, candidate)).size <= SHARE_BYTE_LIMIT,
    );
    if (file === undefined) {
        throw new Error(spec.id + SUBJECT_SEPARATOR + SHARE_TOO_LARGE);
    }
    return file;
};

export const shareEntriesOf = function shareEntriesOf(
    specs: readonly CardSpec[],
    folder: string,
): readonly ShareEntry[] {
    return specs.map((spec) => {
        const profile = profilesOf(spec).find((candidate) => candidate.id === SHARE_PROFILE);
        if (profile === undefined) {
            throw new Error(spec.id + SUBJECT_SEPARATOR + MISSING_SHARE_PROFILE);
        }
        const source = publicRoot() + SLASH + shareFileIn(spec, profile, folder);
        return { alt: spec.alt, page: spec.page, source };
    });
};

export const expectedImages = function expectedImages(specs: readonly CardSpec[]): ReadonlySet<string> {
    return new Set(specs.flatMap((spec) => profilesOf(spec).flatMap((profile) => imageFilesOf(spec, profile))));
};

export const missingImages = function missingImages(specs: readonly CardSpec[], folder: string): readonly string[] {
    return [...expectedImages(specs)].filter((file) => !existsSync(join(folder, file)));
};

export const orphanImages = function orphanImages(specs: readonly CardSpec[], folder: string): readonly string[] {
    if (!existsSync(folder)) {
        return [];
    }
    const expected = expectedImages(specs);
    return readdirSync(folder).filter((file) => !expected.has(file));
};

export const outdatedJobs = function outdatedJobs(
    specs: readonly CardSpec[],
    ledger: ShareLedger,
    folder: string,
): readonly CaptureJob[] {
    return specs.flatMap((spec) =>
        profilesOf(spec)
            .filter(
                (profile) =>
                    ledger.get(ledgerKeyOf(spec.id, profile.id)) !== hashOf(spec, profile) ||
                    imageFilesOf(spec, profile).some((file) => !existsSync(join(folder, file))),
            )
            .map((profile) => ({ profile, spec })),
    );
};

export const staleEntries = function staleEntries(specs: readonly CardSpec[], ledger: ShareLedger): readonly string[] {
    return specs.flatMap((spec) =>
        profilesOf(spec)
            .filter((profile) => ledger.get(ledgerKeyOf(spec.id, profile.id)) !== hashOf(spec, profile))
            .map((profile) => ledgerKeyOf(spec.id, profile.id)),
    );
};

const isLedgerRow = function isLedgerRow(row: unknown): row is readonly [string, string] {
    return Array.isArray(row) && row.length === 2 && row.every((cell) => typeof cell === "string");
};

export const readLedger = function readLedger(location: string): ShareLedger {
    if (!existsSync(location)) {
        return new Map();
    }
    const rows: unknown = JSON.parse(readFileSync(location, TEXT));
    if (!Array.isArray(rows) || !rows.every(isLedgerRow)) {
        throw new Error(MALFORMED_LEDGER + SUBJECT_SEPARATOR + location);
    }
    return new Map(rows);
};

export const writeImages = function writeImages(images: readonly RenderedImage[], folder: string): readonly string[] {
    mkdirSync(folder, { recursive: true });
    return images.flatMap((image) =>
        outputsOf(image).flatMap(([file, bytes]) => {
            if (bytes === null) {
                rmSync(join(folder, file), { force: true });
                return [];
            }
            writeVerbatim(join(folder, file), bytes);
            return [file];
        }),
    );
};

export const pruneOrphans = function pruneOrphans(specs: readonly CardSpec[], folder: string): readonly string[] {
    const orphans = orphanImages(specs, folder);
    for (const file of orphans) {
        rmSync(join(folder, file));
    }
    return orphans;
};

export const writeLedger = async function writeLedger(
    location: string,
    ledger: ShareLedger,
    images: readonly RenderedImage[],
    specs: readonly CardSpec[],
): Promise<void> {
    const live = new Set(specs.flatMap((spec) => profilesOf(spec).map((profile) => ledgerKeyOf(spec.id, profile.id))));
    const merged = new Map([...ledger].filter(([key]) => live.has(key)));
    for (const image of images) {
        merged.set(ledgerKeyOf(image.card, image.profile), image.hash);
    }
    const rows = [...merged].toSorted(([left], [right]) => left.localeCompare(right));
    await writeCanonicalText(location, JSON.stringify(rows));
};

export const renderShareMap = function renderShareMap(entries: readonly ShareEntry[]): string {
    const pairs = entries.map(({ page, ...share }) => [page, share]);
    return [
        'import type { ShareImage } from "#types/card.types";',
        "",
        `export const SHARE_IMAGES: ReadonlyMap<string, ShareImage> = new Map(JSON.parse(${JSON.stringify(JSON.stringify(pairs))}));`,
        "",
    ].join("\n");
};

export const writeShareMap = async function writeShareMap(
    location: string,
    entries: readonly ShareEntry[],
): Promise<void> {
    await writeCanonicalText(location, renderShareMap(entries));
};
