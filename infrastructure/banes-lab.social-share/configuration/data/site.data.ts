import { BYLINE_PREFIX } from "#configuration/strings/card.strings";
import { COMPANY_OWNER } from "@banes-lab/web/configuration/strings/company.strings.ts";
import { SITE_NAME } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";

export const SITE_HOST = new URL(SITE_URL).host;

export const SITE_BYLINE = BYLINE_PREFIX + COMPANY_OWNER;

export const SITE_MARKS: readonly string[] = [SITE_NAME, SITE_BYLINE];
