import { describe, expect, it } from "vitest";
import { detectedKinds, loadDetectors } from "@ssot/secrets/core/loaders/detector.loader.ts";
import { DETECTOR_KINDS } from "@ssot/secrets/configuration/constants/detector.constants.ts";

const run = function run(character: string, length: number): string {
    return character.repeat(length);
};

const PLANTED: readonly (readonly [string, string])[] = [
    ["token", `sk-${run("a", 24)}`],
    ["token", `AKIA${run("Q", 16)}`],
    ["jwt", [`eyJ${run("h", 12)}`, run("b", 12), run("c", 12)].join(".")],
    ["bearer", `Bearer ${run("x", 24)}`],
    ["key", `-----BEGIN RSA PRIVATE KEY-----\n${run("m", 16)}`],
    ["ssh", `ssh-ed25519 ${run("A", 32)}`],
    ["database", `postgres://host/db`],
    ["credential", `https://user:pass@host.example/path`],
    ["address", ["203", "0", "113", "7"].join(".")],
];

const CLEAN: readonly string[] = [
    "a sentence about a token, a key and a bearer",
    "https://banes-lab.com/disciplined-methodology",
    "user@example.com",
    "sk-short",
    "eyJ.not.a.token",
    "1.2.3",
    "::",
    "0.0.0.0",
    "::1",
    ["127", "0", "0", "1"].join("."),
    "ssh-ed25519 ",
    "-----BEGIN CERTIFICATE-----",
];

describe("loadDetectors", () => {
    it("registers one detector for every declared kind, from the predicate files alone", async () => {
        const detectors = await loadDetectors();
        expect(detectors.map((detector) => detector.kind).toSorted()).toStrictEqual([...DETECTOR_KINDS].toSorted());
    });

    it("fires each kind on its planted shape", async () => {
        const detectors = await loadDetectors();
        for (const [kind, value] of PLANTED) {
            expect(detectedKinds(value, detectors)).toContain(kind);
        }
    });

    it("accepts text that only mentions a shape", async () => {
        const detectors = await loadDetectors();
        for (const value of CLEAN) {
            expect(detectedKinds(value, detectors)).toStrictEqual([]);
        }
    });
});
