import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabKnipConfig } from "@govlab/quality/core/adapters/tool.knip.adapter.ts";

test("govlabKnipConfig declares the root workspace beside one workspace per member", async () => {
    const config = await govlabKnipConfig(ROOT);
    const { workspaces } = config;
    expect(typeof workspaces === "object" && workspaces !== null && "." in workspaces).toBe(true);
});
