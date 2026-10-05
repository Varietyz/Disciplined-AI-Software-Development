import { describe, expect, it } from "vitest";
import { devCertificate } from "@banes-lab/build-scripts/core/factories/certificate.factory.ts";
import { get } from "node:https";
import { openStage } from "@banes-lab/build-scripts/core/adapters/diagram.adapter.ts";

const CERTIFICATE_NAME = "localhost";

interface Reply {
    readonly body: string;
    readonly status: number;
    readonly type: string;
}

const fetchTrusted = async function fetchTrusted(url: string, ca: string): Promise<Reply> {
    return new Promise((settle, fail) => {
        const request = get(url, { ca, servername: CERTIFICATE_NAME }, (response) => {
            const chunks: Buffer[] = [];
            response.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });
            response.on("end", () => {
                settle({
                    body: Buffer.concat(chunks).toString("utf8"),
                    status: response.statusCode ?? 0,
                    type: String(response.headers["content-type"]),
                });
            });
        });
        request.on("error", fail);
    });
};

describe("openStage", () => {
    it("serves the stage page over the local certificate with the layout engine registered and refuses an unknown path", async () => {
        const { cert } = await devCertificate();
        const stage = await openStage();
        try {
            expect(stage.url.startsWith("https://")).toBe(true);
            const page = await fetchTrusted(stage.url, cert);
            expect(page.body).toContain("registerLayoutLoaders");
            expect(page.body).toContain("window.diagramsReady = true");
            expect(page.body).toContain("@font-face");
            const bundle = await fetchTrusted(`${stage.url}mermaid/mermaid.esm.min.mjs`, cert);
            expect(bundle.status).toBe(200);
            expect(bundle.type).toBe("text/javascript");
            const missing = await fetchTrusted(`${stage.url}nothing/here.js`, cert);
            expect(missing.status).toBe(404);
        } finally {
            stage.close();
        }
    });
});
