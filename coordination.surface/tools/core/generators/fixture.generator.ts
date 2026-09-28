import { dirname, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import type { FixtureTree } from "../types/fixture.types.ts";
import { tmpdir } from "node:os";

export const growFixtureTree = function growFixtureTree(
    samples: readonly { path: string; text: string }[],
): FixtureTree {
    const root = mkdtempSync(resolve(tmpdir(), "govern-fixture-"));

    for (const sample of samples) {
        const target = resolve(root, sample.path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, sample.text, "utf8");
    }

    return {
        release: (): void => {
            rmSync(root, { force: true, recursive: true });
        },
        root,
    };
};
