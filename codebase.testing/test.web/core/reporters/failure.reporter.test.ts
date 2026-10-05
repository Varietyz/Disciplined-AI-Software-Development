import { describe, expect, it, vi } from "vitest";
import { PAYLOAD_UNAVAILABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { reportFailure } from "@banes-lab/web/core/reporters/failure.reporter.ts";

describe("reportFailure", () => {
    it("writes the message and the failure itself to the console's error stream", () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const failure = new Error("offline");
        reportFailure(PAYLOAD_UNAVAILABLE, failure);
        expect(logged).toHaveBeenCalledWith(PAYLOAD_UNAVAILABLE, failure);
        logged.mockRestore();
    });
});
