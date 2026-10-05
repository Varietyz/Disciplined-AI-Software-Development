import type { ArgvSpec } from "@govlab/argv";

export const RATES_ARGV: ArgvSpec = {
    command: "npm run rates --",
    flags: [
        { describe: "your day rate in euro, placed as a percentile in each group", name: "--rate", takesValue: true },
        { describe: "months of records counted, from the newest one back", name: "--months", takesValue: true },
        { describe: "write the report here; the scratch folder by default", name: "--out", takesValue: true },
    ],
    summary:
        "Fetch the Belgian freelance day-rate benchmark, compute each peer group's spread, and place a day rate in it.",
};
