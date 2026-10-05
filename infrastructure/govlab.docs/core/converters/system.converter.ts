import type { DocumentDecl, DocumentSection } from "#types/document.types";
import { SYSTEM_DOC, SYSTEM_HEADINGS, systemTitle } from "#configuration/strings/system.strings";
import type { SystemModel, SystemSection } from "#types/system.types";
import {
    dataEntityDiagram,
    deploymentDiagram,
    dispatchDiagram,
    messageContractDiagram,
    securityDiagram,
    systemContextDiagram,
} from "#core/formatters/system.formatter";
import { bullets } from "#core/formatters/markdown.formatter";
import { mermaidFence } from "#configuration/strings/package.strings";

const SYSTEM_DOC_ID = {
    concern: "architecture",
    name: "system-architecture",
    status: "current",
    type: "reference",
} as const;

const SECTIONS: readonly SystemSection[] = [
    { heading: SYSTEM_HEADINGS.context, render: systemContextDiagram },
    { heading: SYSTEM_HEADINGS.messages, render: messageContractDiagram },
    { heading: SYSTEM_HEADINGS.data, render: dataEntityDiagram },
    { heading: SYSTEM_HEADINGS.deployment, render: deploymentDiagram },
    { heading: SYSTEM_HEADINGS.dispatch, render: dispatchDiagram },
    { heading: SYSTEM_HEADINGS.security, render: securityDiagram },
];

const systemBody = function systemBody(model: SystemModel): DocumentSection[] {
    const diagrams = SECTIONS.flatMap((section): DocumentSection[] => {
        const mermaid = section.render(model);
        return mermaid === null ? [] : [{ content: mermaidFence(mermaid), heading: section.heading }];
    });
    const deferred = model.runtimeDeferred ?? [];
    return deferred.length === 0
        ? diagrams
        : [...diagrams, { content: bullets(deferred), heading: SYSTEM_HEADINGS.deferred }];
};

export const systemDoc = function systemDoc(model: SystemModel): DocumentDecl {
    return {
        ...SYSTEM_DOC_ID,
        body: systemBody(model),
        generated: true,
        lead: SYSTEM_DOC.lead,
        summary: SYSTEM_DOC.summary,
        title: systemTitle(model.name),
    };
};
