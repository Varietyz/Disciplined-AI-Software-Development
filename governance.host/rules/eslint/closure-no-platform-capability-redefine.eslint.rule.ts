import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { MEMBER_ROOT, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { PRODUCT_PATH_PREFIXES } from "../../shared/manifests/layer.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { platformCapabilities } from "../../shared/manifests/capability.manifest.ts";

const ROOT = MEMBER_ROOT;
const CONSUMERS_DIR = join(ROOT, (PRODUCT_PATH_PREFIXES[0] ?? "").slice(0, -1));
const OWNS_STATE_MARKER = "export class";

const selfRegisteringFiles = function selfRegisteringFiles(): Set<string> {
    const graph = loadClosureGraph();
    return new Set<string>(graph === null ? [] : graph.registers.map((row) => row.file));
};

const SUPPLIERS = selfRegisteringFiles();

const relativeToProject = function relativeToProject(absPath: string): string {
    return normalizePath(absPath).slice(normalizePath(ROOT).length + 1);
};

const walk = function walk(dir: string): string[] {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) {
            out.push(...walk(p));
            continue;
        }
        if (p.endsWith(".ts")) {
            out.push(p);
        }
    }
    return out;
};

const nameSlots = function nameSlots(basename: string): Set<string> {
    const slots = new Set<string>();
    for (const dotted of basename.split(".")) {
        slots.add(dotted);
        for (const part of dotted.split("-")) {
            slots.add(part);
        }
    }
    return slots;
};

const consumerDirs = function consumerDirs(): string[] {
    if (!existsSync(CONSUMERS_DIR)) {
        return [];
    }
    const out: string[] = [];
    for (const name of readdirSync(CONSUMERS_DIR)) {
        const p = join(CONSUMERS_DIR, name);
        if (statSync(p).isDirectory()) {
            out.push(p);
        }
    }
    return out;
};

interface Offense {
    consumer: string;
    evidence: string;
    noun: string;
    platformPath: string;
}

interface Capability {
    noun: string;
    platformPath: string;
}

const basenameOf = function basenameOf(file: string): string {
    return (normalizePath(file).split("/").pop() ?? "").toLowerCase();
};

const readTexts = function readTexts(consumerDir: string): Map<string, string> {
    return new Map(walk(consumerDir).map((file) => [file, readFileSync(file, "utf8")]));
};

const redefinesCapability = function redefinesCapability(file: string, text: string, cap: Capability): boolean {
    if (!nameSlots(basenameOf(file)).has(cap.noun)) {
        return false;
    }
    return !SUPPLIERS.has(relativeToProject(file)) && text.includes(OWNS_STATE_MARKER);
};

const offencesForCapability = function offencesForCapability(
    texts: Map<string, string>,
    consumer: string,
    cap: Capability,
): [string, Offense][] {
    if ([...texts.values()].some((text) => text.includes(cap.platformPath))) {
        return [];
    }
    const out: [string, Offense][] = [];
    for (const [file, text] of texts) {
        if (redefinesCapability(file, text, cap)) {
            const evidence = basenameOf(file);
            out.push([file, { consumer, evidence, noun: cap.noun, platformPath: cap.platformPath }]);
        }
    }
    return out;
};

const findOffences = function findOffences(): Map<string, Offense[]> {
    const offences = new Map<string, Offense[]>();
    for (const consumerDir of consumerDirs()) {
        const texts = readTexts(consumerDir);
        const consumer = normalizePath(consumerDir).split("/").pop() ?? consumerDir;
        for (const cap of platformCapabilities()) {
            for (const [file, offense] of offencesForCapability(texts, consumer, cap)) {
                const list = offences.get(file) ?? [];
                list.push(offense);
                offences.set(file, list);
            }
        }
    }
    return offences;
};

const OFFENCES = findOffences();

export default {
    create(context: RuleContext): RuleListener {
        if (OFFENCES.size === 0) {
            return {};
        }
        const filename = normalizePath(context.filename);
        const hits = [...OFFENCES].find(([file]) => normalizePath(file) === filename)?.[1] ?? null;
        if (hits === null) {
            return {};
        }
        return listener({
            program(_view, node) {
                for (const hit of hits) {
                    const payload = {
                        consumer: hit.consumer,
                        evidence: hit.evidence,
                        noun: hit.noun,
                        platformPath: hit.platformPath,
                    };
                    context.report({ data: payload, messageId: "redefined", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:duplicate-code"] }),
            description:
                "A product module must not re-define a capability the platform tier already owns. Both halves are DERIVED, never listed. The capability set is every directory under the platform-side container. A file NAMES a capability when a whole filename slot equals the capability noun — the basename is split on the taxonomy separators and matched slot-wise. The re-implementation test is behavioral: a product file naming the capability is SUPPLYING content when it self-registers into a registry, read from the closure graph's register call sites, and OWNING it when it exports a class instead. A local variant registry is architecture, not re-implementation. Foundational primitives are exempt.",
        },
        messages: {
            redefined:
                "`{{ consumer }}` names the `{{ noun }}` capability (see `{{ evidence }}`) but never imports `{{ platformPath }}`, where that capability already exists. Compose it, or extend the platform module.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
