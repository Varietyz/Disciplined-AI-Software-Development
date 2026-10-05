import { BINDING_PATH, SLOT_CONSUMERS } from "../core/constants/binding.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { drifted, misSectioned, unhonored, unresolvedSlot } from "../core/factories/binding.factory.ts";
import { enumeratesVocabulary, slotStates, slotsIn } from "../core/analyzers/binding.analyzer.ts";
import { renderBinding, writeBinding } from "../core/generators/binding.generator.ts";
import type { Finding } from "../core/types/segment.types.ts";
import type { Resolution } from "../core/types/binding.types.ts";
import { sameDocument } from "../core/normalizers/document.normalizer.ts";
import { underRoots } from "../core/filters/scope.filter.ts";

interface SlotKey {
    readonly namespace: string;
    readonly key: string;
}

const slotKey = function slotKey(name: string): SlotKey | null {
    const body = name.slice(1, -1);
    const dot = body.indexOf(".");
    return dot <= 0 ? null : { key: body.slice(dot + 1), namespace: body.slice(0, dot) };
};

interface Declared {
    readonly names: ReadonlySet<string>;
    readonly namespaces: ReadonlySet<string>;
    readonly byKey: ReadonlyMap<string, string>;
    readonly states: ReadonlyMap<string, Resolution>;
}

const declaredIn = function declaredIn(rendered: string): Declared {
    const names = slotsIn(rendered).map((slot) => slot.name);
    const keyed = names.flatMap((name) => {
        const parsed = slotKey(name);
        return parsed === null ? [] : [{ name, ...parsed }];
    });
    return {
        byKey: new Map(keyed.map((entry) => [entry.key, entry.name])),
        names: new Set(names),
        namespaces: new Set(keyed.map((entry) => entry.namespace)),
        states: slotStates(rendered),
    };
};

const blocksOf = function blocksOf(lines: readonly string[]): string[] {
    const blocks: string[] = [];
    let held: string[] = [];

    for (const line of [...lines, ""]) {
        if (line.trim().length > 0) {
            held.push(line);
        } else {
            blocks.push(held.join("\n"));
            held = [];
        }
    }

    return blocks;
};

const honoredIn = function honoredIn(lines: readonly string[], states: ReadonlyMap<string, Resolution>): Set<string> {
    return new Set(
        blocksOf(lines).flatMap((text) =>
            slotsIn(text)
                .filter((use) => {
                    const state = states.get(use.name);
                    return state !== undefined && text.includes(state);
                })
                .map((use) => use.name),
        ),
    );
};

type Slot = ReturnType<typeof slotsIn>[number];

const firstOf = function firstOf(slots: readonly Slot[]): Set<Slot> {
    return new Set(slots.filter((slot, index) => slots.findIndex((other) => other.name === slot.name) === index));
};

const undeclaredFinding = function undeclaredFinding(path: string, slot: Slot, declared: Declared): Finding[] {
    const parsed = slotKey(slot.name);
    if (declared.names.has(slot.name) || parsed === null || !declared.namespaces.has(parsed.namespace)) {
        return [];
    }

    const elsewhere = declared.byKey.get(parsed.key);
    return [
        elsewhere === undefined
            ? unresolvedSlot(path, slot.line, slot.name)
            : misSectioned(path, slot.line, slot.name, elsewhere),
    ];
};

const consumerFindings = function consumerFindings(path: string, source: string, declared: Declared): Finding[] {
    const lines = source.split("\n");
    const honored = honoredIn(lines, declared.states);
    const slots = slotsIn(source);
    const firstSeen = firstOf(slots);
    const firstUnmentioned = firstOf(slots.filter((slot) => !enumeratesVocabulary(lines[slot.line - 1] ?? "")));

    const unstated = (slot: Slot): Finding[] => {
        const state = declared.states.get(slot.name);
        const open = state !== undefined && state !== "RESOLVED" && !honored.has(slot.name);
        return open && firstUnmentioned.has(slot) ? [unhonored(path, slot.line, slot.name, state)] : [];
    };

    return slots.flatMap((slot) => [
        ...unstated(slot),
        ...(firstSeen.has(slot) ? undeclaredFinding(path, slot, declared) : []),
    ]);
};

const healBinding = function healBinding(context: RuleContext, rendered: string, fix: boolean): string[] {
    const onDisk = context.exists(BINDING_PATH) ? context.read(BINDING_PATH) : null;
    const drift = onDisk === null || !sameDocument(onDisk, rendered);
    if (!drift || !fix) {
        return [];
    }
    writeBinding(context.repoRoot, rendered);
    return [BINDING_PATH];
};

export const rule: RuleDeclaration = {
    check(context: RuleContext, fix: boolean): RuleResult {
        const rendered = renderBinding();
        const healed = healBinding(context, rendered, fix);
        const drift = healed.length > 0 ? [drifted(BINDING_PATH)] : [];

        if (!context.paths.includes(BINDING_PATH)) {
            return { derivations: { binding: "rendered" }, findings: drift, healed };
        }

        const declared = declaredIn(rendered);
        const scoped = underRoots(context.paths, SLOT_CONSUMERS);
        const findings = [
            ...scoped
                .filter((path) => path !== BINDING_PATH)
                .flatMap((path) => consumerFindings(path, context.read(path), declared)),
            ...drift,
        ];
        const names = [...declared.names].toSorted((left, right) => left.localeCompare(right, "en"));

        return { derivations: { consumers: scoped.length, declared: names }, findings, healed };
    },
    extensions: [".md"],
    heals: true,
    invariant:
        "every abstract slot a consumer names resolves through the adapter binding, and the binding is rendered from the configuration rather than authored beside it",
    jurisdiction: "taxonomy",
    kinds: ["unresolvedSlot", "slotInWrongSection", "stateNotHonored", "bindingDrift"],

    reads: [BINDING_PATH],

    stage: "content",
};
