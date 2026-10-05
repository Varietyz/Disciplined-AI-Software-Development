import { describe, expect, it } from "vitest";
import { isValueOfKind } from "@ssot/secrets/core/validators/environment.validator.ts";

describe("isValueOfKind", () => {
    it("accepts a whole port number up to the ceiling and refuses anything else", () => {
        expect(isValueOfKind("port", "0")).toBe(true);
        expect(isValueOfKind("port", "65535")).toBe(true);
        expect(isValueOfKind("port", "65536")).toBe(false);
        expect(isValueOfKind("port", "12a")).toBe(false);
        expect(isValueOfKind("port", "")).toBe(false);
    });

    it("accepts a parsable address for a url and refuses text that is not one", () => {
        expect(isValueOfKind("url", "https://example.test/hook")).toBe(true);
        expect(isValueOfKind("url", "not an address")).toBe(false);
    });

    it("refuses a blank inside a host, a user or a path, and allows one inside a secret", () => {
        expect(isValueOfKind("host", "droplet.example.test")).toBe(true);
        expect(isValueOfKind("host", "two words")).toBe(false);
        expect(isValueOfKind("user", "deploy user")).toBe(false);
        expect(isValueOfKind("path", "/srv/site")).toBe(true);
        expect(isValueOfKind("secret", "a passphrase with spaces")).toBe(true);
        expect(isValueOfKind("secret", "")).toBe(false);
    });
});
