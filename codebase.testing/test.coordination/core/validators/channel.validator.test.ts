import {
    channelsIn,
    collidingScopes,
    misnamedChannels,
    removeChannel,
    staleChannels,
} from "coordination-surface/tools/core/validators/channel.validator.ts";
import { describe, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { channelReportName } from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const body = function body(scope: string): string {
    return JSON.stringify({ authoritative: false, scope, tool: "govern" });
};

describe("the channel checks", () => {
    it("read each narrowed run's channel, and name the stale, the misnamed and the colliding ones", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-channels-"));
        try {
            const dir = resolve(root, GENERATED_DIR);
            mkdirSync(dir, { recursive: true });
            writeVerbatim(join(dir, channelReportName("tools")), body("tools"));
            writeVerbatim(join(dir, channelReportName("gone")), body("gone"));
            writeVerbatim(join(dir, channelReportName("config")), body("tools"));
            writeVerbatim(join(dir, channelReportName("authoritative")), JSON.stringify({ tool: "govern" }));
            writeVerbatim(join(dir, "board.report.generated.json"), body("tools"));

            assert.deepEqual(
                channelsIn(root)
                    .map((channel) => channel.scope)
                    .toSorted(),
                ["config", "gone", "tools"],
            );
            assert.deepEqual(
                staleChannels(root, (scope) => scope !== "gone").map((channel) => [channel.scope, channel.removable]),
                [["gone", true]],
            );
            assert.deepEqual(misnamedChannels(root), [
                { declared: "tools", name: channelReportName("config"), named: "config" },
            ]);
            assert.deepEqual(collidingScopes(root), [
                {
                    names: [channelReportName("config"), channelReportName("tools")].toSorted((a, b) =>
                        a.localeCompare(b, "en"),
                    ),
                    scope: "tools",
                },
            ]);
            const gone = channelReportName("gone");
            removeChannel(root, gone);
            assert.equal(existsSync(join(dir, gone)), false);
            assert.deepEqual(channelsIn(join(root, "absent")), []);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
