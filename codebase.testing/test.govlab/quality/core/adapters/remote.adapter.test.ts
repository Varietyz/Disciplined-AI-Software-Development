import { afterEach, expect, test, vi } from "vitest";
import { firstRemoteText, remoteText } from "@govlab/quality/core/adapters/remote.adapter.ts";

const HTTP_OK = 200;
const HTTP_MISSING = 404;

const respond = function respond(pages: Readonly<Record<string, string>>): void {
    vi.stubGlobal("fetch", async (url: string) => {
        await Promise.resolve();
        const body = pages[url];
        return new Response(body ?? "", { status: body === undefined ? HTTP_MISSING : HTTP_OK });
    });
};

afterEach(() => {
    vi.unstubAllGlobals();
});

test("remoteText answers the body of a found page and null for a missing one", async () => {
    respond({ "https://a.test/x": "body" });
    expect(await remoteText("https://a.test/x")).toBe("body");
    expect(await remoteText("https://a.test/y")).toBeNull();
});

test("firstRemoteText answers the first page that exists, in order, and null when none does", async () => {
    respond({ "https://a.test/second": "two", "https://a.test/third": "three" });
    expect(await firstRemoteText(["https://a.test/first", "https://a.test/second", "https://a.test/third"])).toBe(
        "two",
    );
    expect(await firstRemoteText(["https://a.test/none"])).toBeNull();
});
