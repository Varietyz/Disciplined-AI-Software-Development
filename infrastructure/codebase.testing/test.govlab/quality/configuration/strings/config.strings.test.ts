import {
    configDriftClean,
    forbiddenConfig,
    unsanctionedConfig,
} from "@govlab/quality/configuration/strings/config.strings.ts";
import { describe, expect, it } from "vitest";

const SCANNED = 12;

describe("config strings", () => {
    it("name the config file and the registry each finding reports", () => {
        expect(forbiddenConfig(".eslintrc.json")).toContain(".eslintrc.json");
        expect(unsanctionedConfig(".golangci.yml", "config.allowlist.json")).toContain("config.allowlist.json");
        expect(configDriftClean(SCANNED)).toContain("12 files scanned");
    });
});
