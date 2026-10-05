export type EmitFormat = "ini" | "js-record" | "toml" | "xml" | "yaml";

export type ConfigValue = ConfigValue[] | boolean | number | string | { [key: string]: ConfigValue } | null;

export interface EmitFile {
    path: string;
    content: string;
}

export interface XmlElement {
    tag: string;
    attrs?: Record<string, string> | undefined;
    children?: XmlElement[] | undefined;
    text?: string | undefined;
}

type EmitIdiom = "central" | "per-rule" | "rules-container";

export interface EmitDescriptor {
    tool: string;
    idiom: EmitIdiom;
    format: EmitFormat;
    configTarget: string;
    selectContainer: string | null;
    settingsContainer: string | null;
    preamble?: Record<string, ConfigValue>;
    knobCase?: "kebab";
    knobSection?: Record<string, string>;
    ruleContainer?: string;
    argumentsKey?: string;
    xmlWrap?: { tag: string; attrs?: Record<string, string> }[];
    xmlRuleTag?: string;
    xmlNameAttr?: string;
    xmlPropsWrap?: string | null;
    xmlRefPrefix?: string;
    xmlDescription?: string;
    xmlDoctype?: string;
    ignoreContainer?: string | null;
    enableKey?: string | null;
    compoundSplit?: string;
}

export interface DescriptorFile {
    descriptors: EmitDescriptor[];
    pluginParent: Record<string, string>;
    deferred: { tool: string; reason: string }[];
}

interface EmitTokenEntry {
    ruleIds: string[];
    knob: string | null;
}

export type EmitTokens = Record<string, Record<string, EmitTokenEntry>>;

export interface ActiveConcept {
    canonicalId: string;
    ruleIds: string[];
    knob: string | null;
    value?: ConfigValue;
}

export interface EmitInput {
    descriptor: EmitDescriptor;
    concepts: ActiveConcept[];
    ignore: string[];
}

export interface ConfigFormatter {
    format: EmitFormat;
    render: (input: EmitInput) => string;
}
