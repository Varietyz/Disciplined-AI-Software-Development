import type { Extent, Measured } from "../types/snapshot.types.ts";
import { type Lifetime, lifetimeOf } from "../../../config/surface.config.ts";
import { delimitersIn } from "./fence.analyzer.ts";
import { readSource } from "../iterators/file.iterator.ts";
import { resolve } from "node:path";

const MARKDOWN = ".md";

const RECORD_ANCHOR = "record";

export const ANCHOR_KINDS: readonly string[] = [RECORD_ANCHOR];

const MARK_SEED = 5381;

const MARK_SHIFT = 33;

const MARK_MODULUS = 4_294_967_296;

const markOf = function markOf(source: string): string {
    let held = MARK_SEED;
    for (const character of source) {
        held = (held * MARK_SHIFT + (character.codePointAt(0) ?? 0)) % MARK_MODULUS;
    }
    return String(held);
};

export const sameKinds = function sameKinds(held: readonly string[]): boolean {
    if (held.length !== ANCHOR_KINDS.length) {
        return false;
    }
    for (const kind of ANCHOR_KINDS) {
        if (!held.includes(kind)) {
            return false;
        }
    }
    return true;
};

const anchorsOf = function anchorsOf(path: string, source: string): string[] {
    if (!path.endsWith(MARKDOWN)) {
        return [];
    }

    const out: string[] = [];
    for (const delimiter of delimitersIn(source)) {
        if (!delimiter.open) {
            continue;
        }
        out.push(`${RECORD_ANCHOR}:${delimiter.agent}`);
    }

    return out;
};

export const markedElsewhere = function markedElsewhere(
    mark: string,
    prior: Readonly<Record<string, Extent>>,
    current: ReadonlyMap<string, Extent>,
): string | null {
    if (mark.length === 0) {
        return null;
    }

    for (const [path, extent] of current) {
        if (prior[path] !== undefined) {
            continue;
        }
        if (extent.mark === mark) {
            return path;
        }
    }

    return null;
};

const forbidsRemoval = function forbidsRemoval(declared: Lifetime): boolean {
    return declared.removal === "none";
};

const isFrozen = function isFrozen(declared: Lifetime): boolean {
    return declared.mutability === "frozen";
};

const lifetimeLabel = function lifetimeLabel(declared: Lifetime): string {
    return `${declared.retention} · ${declared.mutability} · ${declared.removal}`;
};

export const measured = function measured(repoRoot: string, paths: readonly string[]): Measured {
    const current = new Map<string, Extent>();
    const frozen = new Set<string>();
    const frozenAnchors = new Set<string>();

    const governed = paths.flatMap((path) => {
        const declared = lifetimeOf(path);
        return declared !== null && (forbidsRemoval(declared) || isFrozen(declared)) ? [{ declared, path }] : [];
    });

    for (const { declared, path } of governed) {
        const source = readSource(resolve(repoRoot, path));
        const anchors = anchorsOf(path, source);
        current.set(path, { anchors, lifetime: lifetimeLabel(declared), mark: markOf(source) });
        if (isFrozen(declared)) {
            frozen.add(path);
            anchors.forEach((anchor) => {
                frozenAnchors.add(anchor);
            });
        }
    }

    return { current, frozen, frozenAnchors };
};
