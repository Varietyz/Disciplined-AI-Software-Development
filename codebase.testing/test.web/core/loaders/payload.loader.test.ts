import { afterEach, describe, expect, it, vi } from "vitest";
import { PAYLOAD_UNAVAILABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { loadPayload } from "@banes-lab/web/core/loaders/payload.loader.ts";

const PAYLOAD = { id: "methodology" };
const PATH = "/json/methodology";
const MISSING = "/json/missing";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("loadPayload", () => {
    it("fetches a payload once and serves every later request from the held promise", async () => {
        const fetched = vi.fn(async () => Response.json(PAYLOAD, { status: 200 }));
        vi.stubGlobal("fetch", fetched);
        expect(await loadPayload(PATH)).toStrictEqual(PAYLOAD);
        expect(await loadPayload(PATH)).toStrictEqual(PAYLOAD);
        expect(fetched).toHaveBeenCalledTimes(1);
        expect(fetched).toHaveBeenCalledWith(PATH);
    });

    it("reports a failed fetch, returns null and does not hold the failure", async () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const fetched = vi.fn(async () => new Response("", { status: 404 }));
        vi.stubGlobal("fetch", fetched);
        expect(await loadPayload(MISSING)).toBeNull();
        expect(await loadPayload(MISSING)).toBeNull();
        expect(fetched).toHaveBeenCalledTimes(2);
        expect(logged).toHaveBeenCalledWith(PAYLOAD_UNAVAILABLE, MISSING);
    });

    it("reports the error and returns null when the fetch itself throws", async () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const offline = new Error("offline");
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                await Promise.resolve();
                throw offline;
            }),
        );
        expect(await loadPayload("/json/offline")).toBeNull();
        expect(logged).toHaveBeenCalledWith(PAYLOAD_UNAVAILABLE, offline);
    });
});
