import type { BridgeConfig, Intervention, InterventionBridge, InterventionResult } from "#types/operation.types";
import type { Finding } from "#types/finding.types";
import { NO_APPLY_HANDLER } from "#configuration/strings/operation.strings";

const noProposal = function noProposal(): null {
    return null;
};

const noApply = async function noApply(intervention: Intervention): Promise<InterventionResult> {
    await Promise.resolve();
    return { applied: false, detail: NO_APPLY_HANDLER, intervention };
};

export const proposerFromRules = function proposerFromRules(
    rules: ReadonlyMap<string, string>,
): (finding: Finding) => Intervention | null {
    return function propose(finding: Finding): Intervention | null {
        const action = rules.get(finding.name);
        if (action === undefined) {
            return null;
        }
        return { action, field: finding.field, finding: finding.name, rationale: finding.narrative.explanation };
    };
};

export const createInterventionBridge = function createInterventionBridge(
    config: BridgeConfig = {},
): InterventionBridge {
    const propose = config.propose ?? noProposal;
    const apply = config.apply ?? noApply;
    return {
        async apply(interventions: readonly Intervention[]): Promise<InterventionResult[]> {
            return Promise.all(interventions.map(apply));
        },
        propose(findings: readonly Finding[]): Intervention[] {
            return findings.map(propose).filter((value): value is Intervention => value !== null);
        },
    };
};
