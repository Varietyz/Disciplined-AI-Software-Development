import { isUpperAlpha } from "@govlab/constants";

export const LOOKUP_VERBS: readonly string[] = [
    "dispose",
    "emit",
    "find",
    "get",
    "has",
    "load",
    "preload",
    "resolve",
    "subscribe",
    "unsubscribe",
];

export const REGISTER_VERBS: readonly string[] = ["register", "unregister"];

export const opensWith = function opensWith(name: string, verbs: readonly string[]): boolean {
    return verbs.some(
        (verb) => name.startsWith(verb) && name.length > verb.length && isUpperAlpha(name.charAt(verb.length)),
    );
};

export const isVerbOrOpensWith = function isVerbOrOpensWith(name: string, verbs: readonly string[]): boolean {
    return verbs.includes(name) || opensWith(name, verbs);
};

export const suffixAfterVerb = function suffixAfterVerb(name: string, verb: string): string | null {
    return opensWith(name, [verb]) ? name.slice(verb.length) : null;
};
