import type { ActiveConcept, ConfigValue, EmitDescriptor, EmitInput } from "#types/emitter.types";
import { isConfigObject } from "#core/predicates/config.predicate";

const isNonEmpty = function isNonEmpty(value: string | null | undefined): value is string {
    return typeof value === "string" && value.length > 0;
};

export const hasValue = function hasValue(
    concept: ActiveConcept,
): concept is ActiveConcept & { knob: string; value: ConfigValue } {
    return concept.knob !== null && concept.value !== undefined;
};

const normalizeId = function normalizeId(value: string): string {
    return value.toLowerCase().replaceAll("-", "").replaceAll("_", "").replaceAll(".", "");
};

export const ownerRuleId = function ownerRuleId(canonicalId: string, ruleIds: string[]): string {
    const exact = ruleIds.find((id) => id === canonicalId);
    if (typeof exact === "string") {
        return exact;
    }
    const target = normalizeId(canonicalId);
    const matches = ruleIds.filter((id) => normalizeId(id).includes(target)).sort((a, b) => a.length - b.length);
    return matches[0] ?? ruleIds[0] ?? "";
};

const childObject = function childObject(current: ConfigValue | null): Record<string, ConfigValue> {
    return isConfigObject(current) ? current : {};
};

const setPath = function setPath(tree: Record<string, ConfigValue>, dotted: string, value: ConfigValue): void {
    const parts = dotted.split(".");
    let node: Record<string, ConfigValue> = tree;
    for (const key of parts.slice(0, -1)) {
        node[key] = childObject(node[key] ?? null);
        node = childObject(node[key] ?? null);
    }
    const leaf = parts.at(-1);
    if (typeof leaf === "string") {
        node[leaf] = value;
    }
};

const centralPath = function centralPath(descriptor: EmitDescriptor, knob: string): string {
    const section = descriptor.knobSection?.[knob] ?? descriptor.settingsContainer;
    const cased = descriptor.knobCase === "kebab" ? knob.replaceAll("_", "-") : knob;
    return isNonEmpty(section) ? `${section}.${cased}` : cased;
};

const collectCentral = function collectCentral(
    descriptor: EmitDescriptor,
    concepts: ActiveConcept[],
): { select: Set<string>; settings: [string, ConfigValue][] } {
    const select = new Set(concepts.flatMap((concept) => concept.ruleIds));
    const settings = concepts
        .filter(hasValue)
        .map((concept): [string, ConfigValue] => [centralPath(descriptor, concept.knob), concept.value]);
    return { select, settings };
};

const centralContainers = function centralContainers(
    descriptor: EmitDescriptor,
    select: Set<string>,
    ignore: string[],
): [string, ConfigValue][] {
    const out: [string, ConfigValue][] = [];
    if (isNonEmpty(descriptor.selectContainer) && select.size > 0) {
        out.push([descriptor.selectContainer, [...select].sort((a, b) => a.localeCompare(b))]);
    }
    if (isNonEmpty(descriptor.ignoreContainer) && ignore.length > 0) {
        out.push([descriptor.ignoreContainer, [...ignore]]);
    }
    return out;
};

const centralTree = function centralTree(input: EmitInput): ConfigValue {
    const tree: Record<string, ConfigValue> = {};
    const { select, settings } = collectCentral(input.descriptor, input.concepts);
    const preamble = Object.entries(input.descriptor.preamble ?? {});
    for (const [path, value] of [
        ...preamble,
        ...centralContainers(input.descriptor, select, input.ignore),
        ...settings,
    ]) {
        setPath(tree, path, value);
    }
    return tree;
};

const perRuleBlock = function perRuleBlock(
    descriptor: EmitDescriptor,
    concept: ActiveConcept,
    existing: ConfigValue,
): ConfigValue {
    const block: Record<string, ConfigValue> = isConfigObject(existing) ? existing : {};
    if (isNonEmpty(descriptor.enableKey)) {
        block[descriptor.enableKey] = true;
    }
    if (hasValue(concept)) {
        const key = isNonEmpty(descriptor.compoundSplit)
            ? (concept.knob.split(descriptor.compoundSplit)[0] ?? concept.knob)
            : concept.knob;
        block[key] = concept.value;
    }
    return block;
};

const perRuleTree = function perRuleTree(input: EmitInput): ConfigValue {
    const tree: Record<string, ConfigValue> = {};
    for (const concept of input.concepts) {
        for (const ruleId of concept.ruleIds) {
            tree[ruleId] = perRuleBlock(input.descriptor, concept, tree[ruleId] ?? null);
        }
    }
    return tree;
};

const containerEntries = function containerEntries(
    descriptor: EmitDescriptor,
    concept: ActiveConcept,
): [string, ConfigValue][] {
    if (hasValue(concept)) {
        const owner = ownerRuleId(concept.canonicalId, concept.ruleIds);
        const block = isNonEmpty(descriptor.argumentsKey)
            ? { [descriptor.argumentsKey]: [concept.value] }
            : { [concept.knob]: concept.value };
        return [[owner, block]];
    }
    return concept.ruleIds.map((ruleId): [string, ConfigValue] => [
        ruleId,
        isNonEmpty(descriptor.argumentsKey) ? {} : "enable",
    ]);
};

const rulesContainerTree = function rulesContainerTree(input: EmitInput): ConfigValue {
    const container = Object.fromEntries(
        input.concepts.flatMap((concept) => containerEntries(input.descriptor, concept)),
    );
    return { [input.descriptor.ruleContainer ?? "rules"]: container };
};

const IDIOM_TREES: Readonly<Record<EmitDescriptor["idiom"], (input: EmitInput) => ConfigValue>> = {
    central: centralTree,
    "per-rule": perRuleTree,
    "rules-container": rulesContainerTree,
};

export const treeFor = function treeFor(input: EmitInput): ConfigValue {
    return IDIOM_TREES[input.descriptor.idiom](input);
};
