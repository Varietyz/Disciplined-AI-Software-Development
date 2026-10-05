import { afterAll, describe, expect, it } from "vitest";
import { detectProtocol } from "@govlab/docs/core/analyzers/orchestration.analyzer.ts";
import { programFor } from "./program.fixture.ts";

const fixture = programFor({
    "pay.ts": [
        "declare const gateway: { charge(): Promise<void> };",
        "declare const vault: { store(): Promise<void> };",
        "export async function processPayment(): Promise<void> {",
        "    await gateway.charge();",
        "    await vault.store();",
        "    await gateway.charge();",
        "}",
        "export async function thin(): Promise<void> {",
        "    await vault.store();",
        "}",
    ].join("\n"),
});

afterAll(() => {
    fixture.dispose();
});

describe("detectProtocol", () => {
    it("picks the function with the most distinct awaited collaborator calls", () => {
        expect(detectProtocol(fixture.analysis)).toStrictEqual({
            messages: [
                { async: true, text: "charge", to: "gateway" },
                { async: true, text: "store", to: "vault" },
            ],
            participants: ["gateway", "vault"],
            self: "processPayment",
        });
    });
});
