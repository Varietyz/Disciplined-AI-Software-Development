import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { builtRoutes } from "@project/scripts/core/loaders/viewport.loader.ts";
import { get } from "node:https";
import { join } from "node:path";
import { serveBuiltSite } from "@project/scripts/core/adapters/viewport.adapter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const builtSite = function builtSite(): string {
    const root = mkdtempSync(join(tmpdir(), "viewport-"));
    mkdirSync(join(root, "pag"));
    writeVerbatim(join(root, "index.html"), "home");
    writeVerbatim(join(root, "404.html"), "missing");
    writeVerbatim(join(root, "pag", "keywords.html"), "keywords");
    return root;
};

const statusOf = async function statusOf(url: string): Promise<{ status: number; body: string }> {
    return new Promise((settle, fail) => {
        get(url, { rejectUnauthorized: false }, (response) => {
            let body = "";
            response.setEncoding("utf8");
            response.on("data", (chunk: string) => {
                body += chunk;
            });
            response.on("end", () => {
                settle({ body, status: response.statusCode ?? 0 });
            });
        }).on("error", fail);
    });
};

describe("builtRoutes", () => {
    it("lists every built page as a route and leaves the missing page out", () => {
        expect(builtRoutes(builtSite())).toStrictEqual(["/", "/pag/keywords"]);
        const absent = join(tmpdir(), "viewport-absent");
        expect(builtRoutes(absent)).toStrictEqual([]);
    });
});

describe("serveBuiltSite", () => {
    it("serves a route from its page file and answers 404 outside the build", async () => {
        const site = await serveBuiltSite(builtSite());
        try {
            await expect(statusOf(`${site.origin}/`)).resolves.toStrictEqual({ body: "home", status: 200 });
            await expect(statusOf(`${site.origin}/pag/keywords`)).resolves.toStrictEqual({
                body: "keywords",
                status: 200,
            });
            await expect(statusOf(`${site.origin}/absent`)).resolves.toStrictEqual({ body: "", status: 404 });
        } finally {
            site.close();
        }
    });
});
