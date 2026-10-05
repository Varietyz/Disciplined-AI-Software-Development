import { describe, expect, it } from "vitest";
import {
    notABuildConfig,
    plaintextHeading,
    plaintextListener,
    transportHeld,
} from "@project/scripts/configuration/strings/server.strings.ts";
import { transportFindings, transportVerdict } from "@project/scripts/core/validators/server.validator.ts";
import { buildConfigFiles } from "@project/scripts/core/loaders/server.loader.ts";
import { join } from "node:path";
import { listenerSurfacesOf } from "@project/scripts/core/adapters/server.adapter.ts";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("transportFindings and transportVerdict", () => {
    it("flags a server or preview block that declares no encrypted transport, and passes middleware mode", () => {
        expect(transportFindings("a.ts", { preview: {}, server: {} })).toStrictEqual([
            { file: "a.ts", surface: "server" },
            { file: "a.ts", surface: "preview" },
        ]);
        expect(transportFindings("a.ts", { server: { middlewareMode: true } })).toStrictEqual([]);
        expect(transportFindings("a.ts", { preview: { https: {} }, server: { https: {} } })).toStrictEqual([]);
    });

    it("words a clean run and a listing of plaintext listeners", () => {
        expect(transportVerdict([], 2)).toStrictEqual({ held: true, text: transportHeld(2) });
        const verdict = transportVerdict([{ file: "a.ts", surface: "server" }], 1);
        expect(verdict.text).toContain(plaintextHeading(1));
        expect(verdict.text).toContain(plaintextListener("a.ts", "server"));
        expect(notABuildConfig("a.ts")).toContain("a.ts");
    });
});

describe("buildConfigFiles and listenerSurfacesOf", () => {
    it("finds the application's build config", () => {
        expect(buildConfigFiles().length).toBeGreaterThan(0);
    });

    it("loads the server and preview blocks of a build config", async () => {
        const folder = mkdtempSync(join(tmpdir(), "transport-"));
        const file = join(folder, "vite.config.ts");
        writeVerbatim(file, "export default { preview: {}, server: { middlewareMode: true } };\n");
        const surfaces = await listenerSurfacesOf(file);
        expect(surfaces.server?.middlewareMode).toBe(true);
        expect(surfaces.preview).toStrictEqual({});
    }, 60_000);
});
