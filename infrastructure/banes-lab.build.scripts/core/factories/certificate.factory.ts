import { existsSync, mkdirSync, readFileSync } from "node:fs";
import type { DevCertificate } from "#types/certificate.types";
import { absolutePath } from "@ssot/paths";
import { generate } from "selfsigned";
import { join } from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const CERTIFICATE_DIR = absolutePath("app.certificates");
const KEY_FILE = join(CERTIFICATE_DIR, "localhost-key.pem");
const CERT_FILE = join(CERTIFICATE_DIR, "localhost-cert.pem");
const VALIDITY_DAYS = 365;
const MS_PER_DAY = 86_400_000;
const KEY_BITS = 2048;

const expiry = function expiry(): Date {
    return new Date(Date.now() + VALIDITY_DAYS * MS_PER_DAY);
};

const writeCertificate = async function writeCertificate(): Promise<void> {
    const pems = await generate([{ name: "commonName", value: "localhost" }], {
        keySize: KEY_BITS,
        notAfterDate: expiry(),
    });
    mkdirSync(CERTIFICATE_DIR, { recursive: true });
    writeVerbatim(KEY_FILE, pems.private);
    writeVerbatim(CERT_FILE, pems.cert);
};

export const devCertificate = async function devCertificate(): Promise<DevCertificate> {
    if (!existsSync(KEY_FILE) || !existsSync(CERT_FILE)) {
        await writeCertificate();
    }
    return { cert: readFileSync(CERT_FILE, "utf8"), key: readFileSync(KEY_FILE, "utf8") };
};
