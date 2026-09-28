import type { BranchFixture, FixtureRegistry, GateFixture } from "../types/fixture.types.ts";
import type { LoadedSource } from "../types/source.types.ts";

import { importSources } from "../readers/source.reader.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";
import { walk } from "../iterators/file.iterator.ts";

const FIXTURE_DIR = `${surfacePath("pipeline")}/core/fixtures`;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isBranch = function isBranch(entry: unknown): entry is BranchFixture {
    return isRecord(entry) && typeof entry["exercise"] === "function" && isRecord(entry["expect"]);
};

const isGate = function isGate(entry: unknown): entry is GateFixture {
    return !isBranch(entry) && isRecord(entry) && typeof entry["rule"] === "string";
};

const entriesOf = function entriesOf(source: LoadedSource): unknown[] {
    return Object.values(source.exports ?? {}).flatMap((exported): unknown[] =>
        Array.isArray(exported) ? exported : [],
    );
};

export const discoverFixtures = async function discoverFixtures(repoRoot: string): Promise<FixtureRegistry> {
    const loaded = await importSources(
        walk({ extensions: [".ts"], ignored: [], root: resolve(repoRoot, FIXTURE_DIR) }),
    );
    const entries = loaded.map((source) => ({ entries: entriesOf(source), file: source.file }));

    return {
        branches: entries.flatMap((source) => source.entries.filter(isBranch)),
        gates: entries.flatMap((source) => source.entries.filter(isGate)),
        sources: entries
            .filter((source) => source.entries.some((entry) => isBranch(entry) || isGate(entry)))
            .map((source) => source.file),
        unreadable: loaded.flatMap((source) => (source.error === null ? [] : [`${source.file}: ${source.error}`])),
    };
};
