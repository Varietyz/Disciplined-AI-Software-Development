import { addressLines, blocks, heading, quote, section } from "#core/formatters/markdown.formatter";
import type { ContactData } from "#types/catalog.types";

export const renderContact = function renderContact(data: ContactData, site: string): string {
    return blocks([
        heading(data.company),
        quote(data.reply),
        addressLines([
            ["Owner", data.owner],
            ["Address", data.address],
            ["Country", data.country],
            ["Company number", data.number],
            ["Founded", data.founded],
            ["Email", data.email],
            ["Website", site],
        ]),
        section(
            "Links",
            Object.entries(data.links).map(([label, url]) => `[${label}](${url})`),
        ),
    ]);
};
