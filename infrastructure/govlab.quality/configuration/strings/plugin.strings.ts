export const pluginFolderUnreadable = function pluginFolderUnreadable(dir: string): string {
    return `govlab plugins: the plugin folder ${dir} cannot be read. The cause is attached to this error.`;
};

export const pluginLoadFailed = function pluginLoadFailed(file: string): string {
    return `govlab plugins: ${file} failed to load. The cause is attached to this error.`;
};

export const pluginWithoutDefault = function pluginWithoutDefault(file: string): string {
    return `govlab plugins: ${file} has no default-exported object. Export the plugin entry as the default export.`;
};

export const pluginShape = function pluginShape(file: string): string {
    return `govlab plugins: ${file} must default-export { tool: "eslint", plugins: { <namespace>: plugin } } or { tool: "stylelint", plugins: [...] }.`;
};

export const reservedNamespace = function reservedNamespace(file: string, namespace: string): string {
    return `govlab plugins: ${file} claims the reserved namespace "${namespace}". Give the plugin a namespace of its own.`;
};

export const namespaceWithoutPlugin = function namespaceWithoutPlugin(file: string, namespace: string): string {
    return `govlab plugins: ${file} declares the namespace "${namespace}" with no plugin object. Map the namespace to its plugin.`;
};

export const corePluginsMissing = function corePluginsMissing(names: string): string {
    return `govlab eslint: the core plugins ${names} did not load, and a lint without them would apply a partial ruleset with fixes on. Install or repair them, then lint again.`;
};
