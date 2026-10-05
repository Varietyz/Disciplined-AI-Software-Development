import { enabledRuleIds } from "#core/resolvers/rule.resolver";
import { generateNativeConfigs } from "#core/coordinators/emitter.coordinator";
import { loadEmitInputs } from "#core/loaders/concern.loader";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { sectionOf } from "#core/selectors/config.selector";
import { selectableTools } from "#core/loaders/dependency.loader";
import { stringField } from "#core/selectors/record.selector";

export const toolSection = async function toolSection(root: string, key: string): Promise<Record<string, unknown>> {
    return sectionOf(await loadGovlabConfig(root), key);
};

export const toolSetting = async function toolSetting<Field extends string>(
    root: string,
    key: string,
    defaults: Readonly<Record<Field, string>>,
): Promise<Record<Field, string>> {
    const section = await toolSection(root, key);
    const resolved: Partial<Record<Field, string>> = {};
    for (const field of Object.keys(defaults).filter((name): name is Field => name in defaults)) {
        resolved[field] = stringField(section, field, defaults[field]);
    }
    return { ...defaults, ...resolved };
};

export const nativeToolConfig = async function nativeToolConfig(
    root: string,
    language: string,
    fileName: string,
): Promise<string> {
    const { concerns, owners } = await loadEmitInputs(root);
    const files = await generateNativeConfigs(concerns, [language], owners);
    const file = files.find((entry) => entry.path.endsWith(fileName));
    return file?.content ?? "";
};

export const enabledToolRules = async function enabledToolRules(
    root: string,
    language: string,
    tool: string,
): Promise<string[]> {
    const { concerns } = await loadEmitInputs(root);
    return enabledRuleIds(concerns, language, tool);
};

export const resolveActiveSelectable = async function resolveActiveSelectable(root: string): Promise<string[]> {
    const owners = (await loadGovlabConfig(root)).qualityMaster?.owners ?? {};
    const selectable = selectableTools();
    const elected = Object.values(owners).flatMap((languages) => Object.values(languages));
    return [...new Set(elected.filter((tool) => selectable.has(tool)))];
};

export const resolveActiveEcosystems = async function resolveActiveEcosystems(root: string): Promise<string[] | null> {
    const ecosystems = (await loadGovlabConfig(root)).qualityMaster?.ecosystems;
    return ecosystems && ecosystems.length > 0 ? ecosystems : null;
};
