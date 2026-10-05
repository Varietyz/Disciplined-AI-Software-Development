import { expect, test } from "vitest";
import { defineGovlabConfig } from "@govlab/quality/core/factories/config.factory.ts";

test("defineGovlabConfig returns the config it is given", () => {
    const config = { docs: { members: ["project"] } };
    expect(defineGovlabConfig(config)).toBe(config);
});
