import {
    MALFORMED_LEDGER,
    SHARE_TOO_LARGE,
    SUBJECT_SEPARATOR,
} from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import {
    expectedImages,
    hashOf,
    ledgerKeyOf,
    missingImages,
    orphanImages,
    outdatedJobs,
    pruneOrphans,
    readLedger,
    renderShareMap,
    shareEntriesOf,
    staleEntries,
    writeImages,
    writeLedger,
    writeShareMap,
} from "@banes-lab/social-share/core/persistence/image.persistence.ts";
import type { CardInput } from "@banes-lab/social-share/types/card.types.ts";
import type { RenderedImage } from "@banes-lab/social-share/types/image.types.ts";
import { SHARE_BYTE_LIMIT } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { absolutePath } from "@ssot/paths";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";
import { imageFilesOf } from "@banes-lab/social-share/core/converters/filename.converter.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const OG = { height: 630, id: "og", width: 1200 };

const input: CardInput = {
    alt: "A demo card.",
    id: "demo",
    layers: [{ id: "title", kind: "text", placement: { x: 0.5, y: (frame) => frame.progress }, text: "Demo" }],
    page: "home",
    profiles: ["og"],
    stylesheet: "",
    timeline: { fps: 20, frames: 20 },
    tone: "page-gold",
};

const spec = createCard(input);

const stored = createCard({
    alt: "A demo card.",
    id: "demo",
    layers: [{ id: "title", kind: "text", placement: { x: 0.5, y: 0.5 }, text: "Demo" }],
    page: "home",
    profiles: ["og"],
    stylesheet: "",
    timeline: { frames: 4 },
    tone: "page-gold",
});

const imagesOf = function imagesOf(hash: string): readonly RenderedImage[] {
    return [1, 0.75, 0.5, 0.25].map((scale) => ({
        animation: Buffer.from("gif"),
        card: "demo",
        hash,
        motion: Buffer.from("webp"),
        profile: "og",
        scale,
        still: Buffer.from("png"),
        video: Buffer.from("mp4"),
    }));
};

const shareFolder = function shareFolder(sizes: Readonly<Record<string, number>>): string {
    const folder = mkdtempSync(join(tmpdir(), "social-share-"));
    for (const [file, bytes] of Object.entries(sizes)) {
        writeVerbatim(join(folder, file), Buffer.alloc(bytes));
    }
    return folder;
};

describe("expectedImages", () => {
    it("expects four files per size for a moving card and one per size for a still", () => {
        expect(expectedImages([spec]).size).toBe(16);
        expect(expectedImages([createCard({ ...input, timeline: { frames: 1 } })]).size).toBe(4);
    });
});

describe("shareEntriesOf and renderShareMap", () => {
    it("points the card's page at the three-quarter animation that fits the limit, and names no video", () => {
        const folder = shareFolder({ "demo-w900-h473.og.generated.gif": 1024 });
        const entries = shareEntriesOf([spec], folder);
        expect(entries.map((entry) => entry.page)).toStrictEqual(["home"]);
        expect(entries[0]?.source.endsWith("/demo-w900-h473.og.generated.gif")).toBe(true);
        expect(renderShareMap(entries)).toContain("demo-w900-h473.og.generated.gif");
        expect(renderShareMap(entries)).not.toContain(".mp4");
    });

    it("steps down to a smaller animation when the three-quarter one is over the limit", () => {
        const folder = shareFolder({
            "demo-w600-h315.og.generated.gif": 1024,
            "demo-w900-h473.og.generated.gif": SHARE_BYTE_LIMIT + 1,
        });
        expect(shareEntriesOf([spec], folder)[0]?.source.endsWith("/demo-w600-h315.og.generated.gif")).toBe(true);
    });

    it("throws when no animation fits, and for a card without the share profile", () => {
        const heavy = SHARE_BYTE_LIMIT + 1;
        const folder = shareFolder({
            "demo-w300-h158.og.generated.gif": heavy,
            "demo-w600-h315.og.generated.gif": heavy,
            "demo-w900-h473.og.generated.gif": heavy,
        });
        expect(() => shareEntriesOf([spec], folder)).toThrow(SHARE_TOO_LARGE);
        expect(() => shareEntriesOf([createCard({ ...input, profiles: ["x"] })], folder)).toThrow("demo");
    });

    it("points a still card at its still", () => {
        const folder = shareFolder({ "demo-w900-h473.og.generated.png": 1024 });
        const [still] = shareEntriesOf([createCard({ ...input, timeline: { frames: 1 } })], folder);
        expect(still?.source.endsWith("/demo-w900-h473.og.generated.png")).toBe(true);
    });
});

describe("hashOf and staleEntries", () => {
    it("hashes deterministically and moves when a resolved frame changes", () => {
        const moved = createCard({
            ...input,
            layers: [{ id: "title", kind: "text", placement: { x: 0.4, y: 0 }, text: "Demo" }],
        });
        expect(hashOf(spec, OG)).toBe(hashOf(spec, OG));
        expect(hashOf(moved, OG)).not.toBe(hashOf(spec, OG));
    });

    it("reports every card and profile whose ledger hash is not the current one", () => {
        const key = ledgerKeyOf("demo", "og");
        const current = new Map([[key, hashOf(spec, OG)]]);
        expect(key).toBe("demo.og");
        expect(staleEntries([spec], current)).toStrictEqual([]);
        expect(staleEntries([spec], new Map())).toStrictEqual([key]);
    });

    it("moves when the bytes of an image a card shows change, even with an identical spec", () => {
        const source = `/social-hash-${String(process.pid)}.gif`;
        const location = join(absolutePath("app.public"), source);
        const shown = createCard({
            alt: "A card with a mark.",
            id: "marked",
            layers: [{ alt: "Mark", id: "mark", kind: "image", placement: { x: 0, y: 0 }, source }],
            page: "home",
            profiles: ["og"],
            stylesheet: "",
            tone: "page-gold",
        });
        try {
            writeVerbatim(location, "first");
            const before = hashOf(shown, OG);
            writeVerbatim(location, "second");
            expect(hashOf(shown, OG)).not.toBe(before);
        } finally {
            rmSync(location, { force: true });
        }
    });
});

describe("writeImages, missingImages, orphanImages and pruneOrphans", () => {
    it("writes every scale, then finds nothing missing and prunes only files no card renders", () => {
        const folder = mkdtempSync(join(tmpdir(), "social-images-"));
        expect(missingImages([stored], folder)).toStrictEqual(imageFilesOf(stored, OG));
        expect(writeImages(imagesOf("h"), folder)).toStrictEqual(imageFilesOf(stored, OG));
        writeVerbatim(join(folder, "demo.og.0123.gif"), "stale");
        expect(missingImages([stored], folder)).toStrictEqual([]);
        expect(orphanImages([stored], folder)).toStrictEqual(["demo.og.0123.gif"]);
        expect(pruneOrphans([stored], folder)).toStrictEqual(["demo.og.0123.gif"]);
        expect(existsSync(join(folder, "demo.og.0123.gif"))).toBe(false);
        expect(orphanImages([stored], join(folder, "absent"))).toStrictEqual([]);
    });

    it("removes the moving files of a card that became a still", () => {
        const folder = mkdtempSync(join(tmpdir(), "social-images-"));
        writeImages(imagesOf("h"), folder);
        const stills = imagesOf("h").map((image) => ({ ...image, animation: null, motion: null, video: null }));
        expect(writeImages(stills, folder).every((file) => file.endsWith(".png"))).toBe(true);
        expect(existsSync(join(folder, "demo-w1200-h630.og.generated.gif"))).toBe(false);
        expect(existsSync(join(folder, "demo-w1200-h630.og.generated.webp"))).toBe(false);
        expect(existsSync(join(folder, "demo-w1200-h630.og.generated.mp4"))).toBe(false);
    });
});

describe("readLedger and writeLedger", () => {
    it("round-trips the hashes of live cards and drops the ones no card declares", async () => {
        const folder = mkdtempSync(join(tmpdir(), "social-ledger-"));
        const location = join(folder, "share.generated.json");
        expect(readLedger(location).size).toBe(0);
        await writeLedger(location, new Map([["gone.og", "old"]]), imagesOf(hashOf(stored, OG)), [stored]);
        expect([...readLedger(location)]).toStrictEqual([["demo.og", hashOf(stored, OG)]]);
    });

    it("throws on a ledger that is not a list of rows", () => {
        const folder = mkdtempSync(join(tmpdir(), "social-ledger-"));
        const location = join(folder, "share.generated.json");
        writeVerbatim(location, JSON.stringify({ demo: "hash" }));
        expect(() => readLedger(location)).toThrow(MALFORMED_LEDGER + SUBJECT_SEPARATOR + location);
    });
});

describe("outdatedJobs", () => {
    it("skips a profile whose hash matches the ledger and whose files exist, and selects one that changed or lost a file", () => {
        const folder = mkdtempSync(join(tmpdir(), "social-jobs-"));
        writeImages(imagesOf("h"), folder);
        const current = new Map([["demo.og", hashOf(stored, OG)]]);
        expect(outdatedJobs([stored], current, folder)).toStrictEqual([]);
        expect(
            outdatedJobs([stored], new Map([["demo.og", "old"]]), folder).map((job) => job.profile.id),
        ).toStrictEqual(["og"]);
        rmSync(join(folder, "demo-w1200-h630.og.generated.gif"));
        expect(outdatedJobs([stored], current, folder)).toHaveLength(1);
    });
});

describe("writeShareMap", () => {
    it("writes the page to image map as a typed module", async () => {
        const folder = mkdtempSync(join(tmpdir(), "social-map-"));
        const location = join(folder, "share.generated.ts");
        await writeShareMap(location, [
            { alt: "A demo card.", page: "home", source: "/static/card/generated/demo.gif" },
        ]);
        const written = readFileSync(location, "utf8");
        expect(written).toContain("SHARE_IMAGES");
        expect(written).toContain("demo.gif");
    });
});
