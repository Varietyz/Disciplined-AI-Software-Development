export interface PlatformCapability {
    readonly noun: string;
    readonly platformPath: string;
}

export interface PunctuationPolicy {
    readonly digitMetric: boolean;
    readonly longDash: boolean;
    readonly semicolon: boolean;
}

export interface OptionsCarrier {
    options: readonly unknown[];
}
