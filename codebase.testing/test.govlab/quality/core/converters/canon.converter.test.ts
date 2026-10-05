import {
    canonicalizeId,
    canonicalizeKind,
    isCanonicalId,
    isCanonicalKind,
} from "@govlab/quality/core/converters/canon.converter.ts";
import { describe, expect, it } from "vitest";
import { KIND_SET } from "@govlab/quality/configuration/constants/canon.constants.ts";
import { loadKindMap } from "@govlab/quality/core/loaders/kind.loader.ts";

const KIND_COUNT = 14;
const ARCH_TYPE_COUNT = 165;

describe("canonicalizeId — SOLID/DRY family + de-abbreviation", () => {
    it("folds every SRP spelling to one id", () => {
        expect(canonicalizeId("SRP")).toBe("single-responsibility");
        expect(canonicalizeId("Single Responsibility Principle (SRP)")).toBe("single-responsibility");
        expect(canonicalizeId("Single Responsibility")).toBe("single-responsibility");
    });

    it("maps the rest of the SOLID set", () => {
        expect(canonicalizeId("Open/Closed Principle (OCP)")).toBe("open-closed");
        expect(canonicalizeId("OCP")).toBe("open-closed");
        expect(canonicalizeId("Interface Segregation Principle (ISP)")).toBe("interface-segregation");
        expect(canonicalizeId("Dependency Inversion Principle (DIP)")).toBe("dependency-inversion");
    });

    it("merges Behavioral Subtyping into liskov-substitution", () => {
        expect(canonicalizeId("Liskov Substitution Principle (LSP)")).toBe("liskov-substitution");
        expect(canonicalizeId("Behavioral Subtyping")).toBe("liskov-substitution");
    });

    it("maps DRY to the quality concept duplicate-code", () => {
        expect(canonicalizeId("Do Not Repeat Yourself (DRY)")).toBe("duplicate-code");
        expect(canonicalizeId("DRY")).toBe("duplicate-code");
    });

    it("keeps SRP and SoC distinct", () => {
        expect(canonicalizeId("Separation of Concerns")).toBe("separation-of-concerns");
        expect(canonicalizeId("SRP")).not.toBe(canonicalizeId("SoC"));
    });

    it("de-abbreviates non-SOLID parentheticals to the descriptive name", () => {
        expect(canonicalizeId("Architecture Decision Records (ADR)")).toBe("architecture-decision-records");
        expect(canonicalizeId("Domain-Driven Design (DDD)")).toBe("domain-driven-design");
        expect(canonicalizeId("RBAC")).toBe("role-based-access-control");
    });
});

describe("canonicalizeId — default slugify + idempotency", () => {
    it("leaves an existing kebab concept id unchanged", () => {
        expect(canonicalizeId("type-safety")).toBe("type-safety");
        expect(canonicalizeId("separation-of-concerns")).toBe("separation-of-concerns");
    });

    it("slugifies a plain arch Title-Case name", () => {
        expect(canonicalizeId("Self-Describing Architecture")).toBe("self-describing-architecture");
        expect(canonicalizeId("Ports and Adapters Architecture")).toBe("ports-and-adapters-architecture");
    });

    it("is idempotent", () => {
        for (const term of ["SRP", "Do Not Repeat Yourself (DRY)", "type-safety", "Contract-First Design"]) {
            const once = canonicalizeId(term);
            expect(canonicalizeId(once)).toBe(once);
        }
    });

    it("treats the canonical form as a no-op", () => {
        expect(isCanonicalId("single-responsibility")).toBe(true);
        expect(isCanonicalId("SRP")).toBe(false);
        expect(isCanonicalId("Single Responsibility Principle (SRP)")).toBe(false);
    });
});

describe("canonicalizeKind — every arch type to one kind", () => {
    it("collapses the principle spellings", () => {
        expect(canonicalizeKind("Principle")).toBe("principle");
        expect(canonicalizeKind("Architecture Principle")).toBe("principle");
        expect(canonicalizeKind("Security Principle")).toBe("principle");
    });

    it("applies the ratified overrides", () => {
        expect(canonicalizeKind("Transaction Property")).toBe("constraint");
        expect(canonicalizeKind("Analysis Tool")).toBe("technique");
        expect(canonicalizeKind("Language Property")).toBe("quality-attribute");
    });

    it("returns null for an unknown type", () => {
        expect(canonicalizeKind("Totally Made Up Type")).toBeNull();
    });

    it("has a closed kind set and every mapped kind is in it", () => {
        expect(KIND_SET).toHaveLength(KIND_COUNT);
        for (const kind of loadKindMap().values()) {
            expect(isCanonicalKind(kind)).toBe(true);
        }
    });

    it("covers every distinct arch type value", () => {
        expect(loadKindMap().size).toBe(ARCH_TYPE_COUNT);
    });
});
