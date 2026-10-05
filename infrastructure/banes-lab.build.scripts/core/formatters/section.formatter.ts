import type { SectionData, SectionRoute } from "#types/section.types";
import { addressLines, blocks, heading, quote, section } from "#core/formatters/markdown.formatter";
import { linkList, linkText, placementLine, relationSections } from "#core/formatters/link.formatter";
import { routeStopSentence } from "@banes-lab/web/strings/catalog.strings";

const routeLines = function routeLines(route: SectionRoute | null): string | null {
    if (route === null) {
        return null;
    }
    const steps = [
        routeStopSentence(
            route.position,
            route.total,
            route.previous === null ? null : linkText(route.previous),
            route.next === null ? null : linkText(route.next),
        ),
        route.requires.length === 0 ? null : `It builds on ${linkList(route.requires)}.`,
    ];
    return steps.filter((step): step is string => step !== null).join(" ");
};

export const renderSectionPart = function renderSectionPart(
    title: string,
    json: string,
    whole: string,
    subsections: readonly string[],
): string {
    return blocks([
        heading(title),
        addressLines([
            ["Whole section", whole],
            ["This part as JSON", json],
        ]),
        section("Subsections", subsections),
    ]);
};

export const renderSectionLeaf = function renderSectionLeaf(
    data: SectionData,
    pageLabel: string,
    tabLabel: string,
    body: string,
): string {
    return blocks([
        heading(data.title),
        quote(data.summary),
        addressLines([
            ["Page", pageLabel === tabLabel ? pageLabel : `${pageLabel} · ${tabLabel}`],
            ["Canonical", data.href],
        ]),
        routeLines(data.route),
        placementLine(data),
        body,
        ...relationSections(data.relations),
    ]);
};
