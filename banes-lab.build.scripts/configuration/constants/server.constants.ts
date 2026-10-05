import type { ArgvSpec } from "@govlab/argv";
import { DEV_SUMMARY } from "#configuration/strings/server.strings";

export const DEV_ARGV: ArgvSpec = { command: "npm run dev", flags: [], summary: DEV_SUMMARY };
