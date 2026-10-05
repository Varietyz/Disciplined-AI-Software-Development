export const LICENSE_MARKERS: readonly string[] = [
    "Copyright",
    "SPDX-License-Identifier",
    "Licensed under",
    "Permission is hereby granted",
    "This program is free software",
    "GNU General Public License",
];

export const COMMENT_PUNCTUATION: ReadonlySet<string> = new Set(["/", "*", "#", "-", "!", ";", "%", " ", "\t"]);

export const STRIP_CONCURRENCY = 24;

export const MAX_PARSE_BYTES = 2_000_000;

export const STRIP_INDEX = "comment-clean-index";

export const EXTRACT_OUT = "comments.generated.json";
