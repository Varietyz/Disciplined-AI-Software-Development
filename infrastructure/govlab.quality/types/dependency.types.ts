export type EmitterKind = "eslint" | "native" | "none" | "prettier" | "stylelint";

export type ToolDisposition = "advisory" | "excluded" | "full-gate" | "selectable";

export interface InstallRecord {
    tool: string;
    ecosystem: string;
    npm?: string;
    system?: string;
    ruleIdPrefix?: string;
    pluginNamespace?: string;
    isPlugin: boolean;
    configTarget: string;
    emitter: EmitterKind;
    installable?: boolean;
    reason?: string;
    catalogRules?: boolean;
    disposition?: ToolDisposition;
}

export interface InstallCoverage {
    noEngineSetting: string[];
    noNativeDescriptor: string[];
}

export interface InstallRegistry {
    records: InstallRecord[];
    coverage: InstallCoverage;
}

export interface InstallRequest {
    ecosystems: string[];
    auto: boolean;
    dryRun: boolean;
}

export interface SystemInstruction {
    tool: string;
    system: string;
}

export interface InstallPlan {
    ecosystems: string[];
    npmDeps: string[];
    systemInstructions: SystemInstruction[];
    eslintPlugins: string[];
    emitters: string[];
}

export interface InstallReport {
    installed: string[];
    systemInstructions: SystemInstruction[];
}
