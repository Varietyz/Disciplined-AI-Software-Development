import {
    dataEntityDiagram,
    deploymentDiagram,
    dispatchDiagram,
    messageContractDiagram,
    securityDiagram,
    systemContextDiagram,
} from "@govlab/docs/core/formatters/system.formatter.ts";
import { describe, expect, it } from "vitest";
import { SYSTEM_MODEL } from "./system.fixture.ts";

const RENDERERS = [
    systemContextDiagram,
    dataEntityDiagram,
    deploymentDiagram,
    dispatchDiagram,
    securityDiagram,
    messageContractDiagram,
];

describe("the system diagrams", () => {
    it("each render a diagram from a populated model", () => {
        expect(RENDERERS.map((render) => (render(SYSTEM_MODEL) ?? "").length > 0)).toStrictEqual(
            RENDERERS.map(() => true),
        );
    });

    it("each render nothing when their slice of the model is empty", () => {
        expect(RENDERERS.map((render) => render({ name: "Empty" }))).toStrictEqual(RENDERERS.map(() => null));
    });
});
