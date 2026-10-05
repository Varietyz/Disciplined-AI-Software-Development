import {
    NOT_TEXT_MESSAGE,
    SOCKET_FAILED,
    browserStartFailed,
    consoleEcho,
    noReply,
    notObjectMessage,
    protocolFailed,
    socketClosed,
} from "@banes-lab/build-scripts/configuration/strings/browser.strings.ts";
import { describe, expect, it } from "vitest";

describe("the browser adapter errors", () => {
    it("name the method, the payload or the wait each failure is about", () => {
        expect([SOCKET_FAILED, NOT_TEXT_MESSAGE].every((text) => text.startsWith("browser adapter: "))).toBe(true);
        expect(protocolFailed("Page.navigate", "denied")).toBe("browser adapter: Page.navigate failed: denied");
        expect(socketClosed("Page.navigate")).toContain("closed while Page.navigate was pending");
        expect(notObjectMessage("[]")).toContain("not an object: []");
        expect(noReply("Page.navigate", 50)).toContain("got no reply within 50 ms");
        expect(consoleEcho("hello")).toBe("  · hello\n");
        expect(browserStartFailed("chrome", "ENOENT")).toBe("browser factory: chrome did not start: ENOENT\n");
    });
});
