import { describe, expect, it } from "vitest";
import { devCertificate } from "@banes-lab/build-scripts/core/factories/certificate.factory.ts";

const CERT_HEADER = "-----BEGIN CERTIFICATE-----";
const KEY_MARK = "PRIVATE KEY-----";

describe("devCertificate", () => {
    it("yields a PEM certificate and private key for the dev server", async () => {
        const { cert, key } = await devCertificate();
        expect(cert.startsWith(CERT_HEADER)).toBe(true);
        expect(key.includes(KEY_MARK)).toBe(true);
    });
});
