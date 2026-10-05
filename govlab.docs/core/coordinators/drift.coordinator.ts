import type { HealResult, HealState, Spec } from "#types/document.output.types";
import {
    driftFinding,
    gateFinding,
    regenerated,
    selfHealed,
    unstableRegeneration,
} from "#configuration/strings/drift.strings";
import type { CheckResult } from "#types/finding.types";
import { DOC_HEAL_ATTEMPTS as HEAL_ATTEMPTS } from "#configuration/constants/invocation.constants";
import { readTextSafe } from "#core/loaders/base.loader";

const gateErrors = async function gateErrors(spec: Spec, content: string): Promise<string[]> {
    if (spec.gate === undefined) {
        return [];
    }
    const { findings } = await spec.gate(content);
    return findings.map((finding) => gateFinding(spec.label, finding.line, spec.gateCode ?? "", finding.message));
};

const healSpec = async function healSpec(spec: Spec, onDisk: string, state: HealState): Promise<HealResult> {
    if (state.remaining <= 0) {
        return { content: state.prior, outcome: "drift" };
    }
    const fresh = await spec.produce(onDisk);
    const normalized = spec.normalize(fresh);
    if (normalized === spec.normalize(onDisk)) {
        return { content: fresh, outcome: "healed" };
    }
    if (normalized === spec.normalize(state.prior)) {
        return { content: fresh, outcome: "rewritten" };
    }
    return healSpec(spec, onDisk, { prior: fresh, remaining: state.remaining - 1 });
};

const resolveHeal = async function resolveHeal(
    spec: Spec,
    result: HealResult,
    writeSpec: (spec: Spec, content: string) => void,
): Promise<CheckResult> {
    if (result.outcome === "drift") {
        return { errors: [unstableRegeneration(spec.label, spec.driftCode, HEAL_ATTEMPTS)], heals: [] };
    }
    const errors = await gateErrors(spec, result.content);
    if (errors.length > 0) {
        return { errors, heals: [] };
    }
    if (result.outcome === "healed") {
        return { errors: [], heals: [selfHealed(spec.label)] };
    }
    writeSpec(spec, result.content);
    return { errors: [], heals: [regenerated(spec.label)] };
};

export const checkSpec = async function checkSpec(
    spec: Spec,
    fix: boolean,
    writeSpec: (spec: Spec, content: string) => void,
): Promise<CheckResult> {
    const onDisk = readTextSafe(spec.path) ?? "";
    const content = await spec.produce(onDisk);
    if (spec.normalize(content) === spec.normalize(onDisk)) {
        return { errors: await gateErrors(spec, content), heals: [] };
    }
    if (!fix) {
        return { errors: [...(await gateErrors(spec, content)), driftFinding(spec.label, spec.driftCode)], heals: [] };
    }
    const result = await healSpec(spec, onDisk, { prior: content, remaining: HEAL_ATTEMPTS });
    return resolveHeal(spec, result, writeSpec);
};
