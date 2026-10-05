import { describe, expect, it } from "vitest";
import { isVector } from "@banes-lab/web/core/predicates/resource.predicate.ts";

const VECTOR_TYPE = "image/svg+xml";
const PAGE_TYPE = "text/html";

describe("isVector", () => {
    it("accepts only a successful response whose content type names a vector", () => {
        expect(isVector(new Response("<svg></svg>", { headers: { "content-type": VECTOR_TYPE }, status: 200 }))).toBe(
            true,
        );
        expect(isVector(new Response("", { headers: { "content-type": PAGE_TYPE }, status: 200 }))).toBe(false);
        expect(isVector(new Response("", { headers: { "content-type": VECTOR_TYPE }, status: 404 }))).toBe(false);
        expect(isVector(new Response("", { status: 200 }))).toBe(false);
    });
});
