import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProbe } from "@banes-lab/deploy/core/adapters/site.adapter.ts";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("fetchProbe", () => {
    it("reads the status and type without following a redirect, and the body only for a GET", async () => {
        const fetch = vi.fn(async () => {
            await Promise.resolve();
            return new Response("body", { headers: { "content-type": "text/markdown" }, status: 200 });
        });
        vi.stubGlobal("fetch", fetch);
        expect(await fetchProbe("https://x.test/a.md", "GET")).toStrictEqual({
            body: "body",
            status: 200,
            type: "text/markdown",
        });
        expect(await fetchProbe("https://x.test/a.md", "HEAD")).toMatchObject({ body: "", status: 200 });
        expect(fetch).toHaveBeenCalledWith("https://x.test/a.md", expect.objectContaining({ redirect: "manual" }));
    });
});
