import type { Finding } from "#types/finding.types";

export interface Intervention {
    field: string;
    finding: string;
    action: string;
    rationale: string;
}

export interface InterventionResult {
    intervention: Intervention;
    applied: boolean;
    detail: string;
}

export interface BridgeConfig {
    propose?: (finding: Finding) => Intervention | null;
    apply?: (intervention: Intervention) => Promise<InterventionResult>;
}

export interface InterventionBridge {
    propose: (findings: readonly Finding[]) => Intervention[];
    apply: (interventions: readonly Intervention[]) => Promise<InterventionResult[]>;
}
