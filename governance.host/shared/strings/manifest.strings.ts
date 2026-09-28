export const notValidJson = function notValidJson(location: string): string {
    return `manifest: ${location} is not valid JSON. Its parse error is attached as the cause.`;
};

export const notJsonObject = function notJsonObject(location: string): string {
    return `manifest: ${location} does not hold a JSON object. A package manifest is one object.`;
};

export const noPackageName = function noPackageName(location: string): string {
    return `manifest: ${location} declares no package name. Give the package a name.`;
};
