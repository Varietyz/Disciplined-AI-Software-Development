import { artifactStem, readCaptureOptions, snapshotFor } from "@project/scripts/core/converters/route.converter.ts";
import { describe, expect, it, vi } from "vitest";
import { CAPTURE_ARGV } from "@project/scripts/configuration/configs/route.config.ts";
import { argvOf } from "@govlab/argv";
import { capturePage } from "@project/scripts/core/coordinators/snapshot.coordinator.ts";
import { captureRoutes } from "@project/scripts/core/coordinators/route.coordinator.ts";
import { join } from "node:path";
import spawn from "cross-spawn";

const DEV_PORT = 4202;
const DEV_ORIGIN = `https://localhost:${String(DEV_PORT)}`;

vi.mock("@ssot/secrets", () => ({ portOf: () => DEV_PORT }));

vi.mock("@banes-lab/build-scripts/core/adapters/server.adapter.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    holdersOf: vi.fn(() => ["4242"]),
}));

vi.mock("@project/scripts/core/coordinators/snapshot.coordinator.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    capturePage: vi.fn(async () => {
        await Promise.resolve();
        return true;
    }),
}));

vi.mock("cross-spawn", () => ({ default: vi.fn() }));

describe("readCaptureOptions", () => {
    it("refuses a call without a route or without an output folder", () => {
        expect(readCaptureOptions(argvOf(CAPTURE_ARGV, ["--out-dir", "shots"]))).toBeNull();
        expect(readCaptureOptions(argvOf(CAPTURE_ARGV, ["--route", "/"]))).toBeNull();
    });

    it("refuses a route a shell rewrote into a file path", () => {
        expect(
            readCaptureOptions(argvOf(CAPTURE_ARGV, ["--route", "C:/Program Files/Git/", "--out-dir", "shots"])),
        ).toBeNull();
    });

    it("keeps every repeated route in the order given", () => {
        const read = readCaptureOptions(
            argvOf(CAPTURE_ARGV, ["--route", "/", "--route", "/anatomy/tree", "--out-dir", "shots"]),
        );
        expect(read?.routes).toStrictEqual(["/", "/anatomy/tree"]);
        expect(read?.software).toBe(true);
    });
});

describe("artifactStem", () => {
    it("names the home route index and joins the words of any other route", () => {
        expect(artifactStem("/")).toBe("index");
        expect(artifactStem("/disciplined-methodology/build")).toBe("disciplined-methodology-build");
    });
});

describe("snapshotFor", () => {
    it("points the snapshot at the dev origin and writes both artifacts beside each other", () => {
        const options = { browser: null, outDir: "shots", routes: ["/faq"], settleMs: 1, software: true };
        const snapshot = snapshotFor(options, "/faq");
        expect(snapshot.url).toBe(`${DEV_ORIGIN}/faq`);
        expect(snapshot.out).toBe(`${join("shots", "faq")}.png`);
        expect(snapshot.log).toBe(`${join("shots", "faq")}.log`);
    });
});

describe("captureRoutes", () => {
    it("refuses when the port is already held, and starts nothing and captures nothing", async () => {
        const options = { browser: null, outDir: "shots", routes: ["/"], settleMs: 1, software: true };
        await expect(captureRoutes("browser", options)).resolves.toBe(false);
        expect(spawn).not.toHaveBeenCalled();
        expect(capturePage).not.toHaveBeenCalled();
    });
});
