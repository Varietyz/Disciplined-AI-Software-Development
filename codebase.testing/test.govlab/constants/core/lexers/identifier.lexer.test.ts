import { expect, test } from "vitest";
import { identifierParts } from "@govlab/constants";

test("identifierParts splits a camel or pascal identifier at each lower-to-upper boundary", () => {
    expect(identifierParts("questionCoverageView")).toStrictEqual(["question", "Coverage", "View"]);
    expect(identifierParts("CreateLinker")).toStrictEqual(["Create", "Linker"]);
});

test("identifierParts keeps an acronym, a digit run and a plain word whole", () => {
    expect(identifierParts("SRP")).toStrictEqual(["SRP"]);
    expect(identifierParts("utf8Decoder")).toStrictEqual(["utf8Decoder"]);
    expect(identifierParts("registry")).toStrictEqual(["registry"]);
    expect(identifierParts("")).toStrictEqual([]);
});
