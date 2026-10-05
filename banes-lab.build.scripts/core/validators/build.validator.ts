import { fileOfAddress, localAddress } from "#core/resolvers/catalog.resolver";
import type { Finding } from "#types/validation.types";
import { MISSING_BUILD_FILE } from "#configuration/strings/validation.strings";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { readOrNull } from "#core/loaders/build.loader";

export const isServedUrl = function isServedUrl(url: string): boolean {
    return url.startsWith(SITE_URL) && readOrNull(fileOfAddress(localAddress(SITE_URL, url))) !== null;
};

export const checkFile = function checkFile(file: string, check: (text: string) => Finding[]): Finding[] {
    const text = readOrNull(file);
    return text === null ? [{ file, message: MISSING_BUILD_FILE }] : check(text);
};
