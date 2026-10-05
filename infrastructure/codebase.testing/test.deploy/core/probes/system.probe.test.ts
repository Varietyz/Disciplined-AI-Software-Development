import {
    CPU_LABEL,
    MEMORY_LABEL,
    NODE_LABEL,
    OS_LABEL,
    UPTIME_LABEL,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import { describe, expect, it } from "vitest";
import { describeSystem } from "@banes-lab/deploy/core/probes/system.probe.ts";

describe("describeSystem", () => {
    it.each([OS_LABEL, NODE_LABEL, CPU_LABEL, MEMORY_LABEL, UPTIME_LABEL])("reports the %s entry", (label) => {
        expect(describeSystem()).toContain(label);
    });

    it("reports the running node version", () => {
        expect(describeSystem()).toContain(process.version);
    });
});
