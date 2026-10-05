import type { ConfigSection } from "#types/config.types";

const EXTENDS_KEY = "extends";

const sections = new Map<string, ConfigSection>();

export const defineConfigSection = function defineConfigSection(section: ConfigSection): ConfigSection {
    sections.set(section.key, section);
    return section;
};

export const registeredSections = function registeredSections(): ConfigSection[] {
    return [...sections.values()];
};

export const validateConfig = function validateConfig(config: Record<string, unknown>): string[] {
    const errors: string[] = [];
    const known = new Set<string>([EXTENDS_KEY, ...sections.keys()]);
    for (const key of Object.keys(config)) {
        if (!known.has(key)) {
            errors.push(`unknown config section "${key}"`);
        }
    }
    for (const section of sections.values()) {
        if (Object.hasOwn(config, section.key)) {
            for (const error of section.validate(config[section.key])) {
                errors.push(`${section.key}: ${error}`);
            }
        }
    }
    return errors;
};
