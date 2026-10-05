import {
    AUTHORITY_ENDS,
    CREDENTIAL_AT,
    CREDENTIAL_COLON,
    SCHEME_MARK,
} from "#configuration/constants/detector.constants";
import { defineDetector } from "#core/registries/detector.registry";

const authorityOf = function authorityOf(value: string, start: number): string {
    let end = start;
    while (end < value.length && !AUTHORITY_ENDS.has(value.charAt(end))) {
        end += 1;
    }
    return value.slice(start, end);
};

const carriesCredentials = function carriesCredentials(authority: string): boolean {
    const at = authority.lastIndexOf(CREDENTIAL_AT);
    const colon = authority.indexOf(CREDENTIAL_COLON);
    return at > 0 && colon > 0 && colon < at;
};

defineDetector({
    detects: (value) => {
        let mark = value.indexOf(SCHEME_MARK);
        while (mark > 0) {
            if (carriesCredentials(authorityOf(value, mark + SCHEME_MARK.length))) {
                return true;
            }
            mark = value.indexOf(SCHEME_MARK, mark + SCHEME_MARK.length);
        }
        return false;
    },
    kind: "credential",
});
