import type { DocTypeSchema, MetaConcern } from "#types/document.types";
import { README_HEADINGS, README_SECTION_ALIASES } from "#configuration/strings/readme.strings";

const README_CONCERNS: readonly { aliases: readonly string[]; concern: string }[] = [
    { aliases: README_SECTION_ALIASES.purpose, concern: README_HEADINGS.purpose },
    { aliases: README_SECTION_ALIASES.whenToUse, concern: README_HEADINGS.whenToUse },
    { aliases: README_SECTION_ALIASES.whenNotToUse, concern: README_HEADINGS.whenNotToUse },
    { aliases: README_SECTION_ALIASES.install, concern: README_HEADINGS.install },
    { aliases: README_SECTION_ALIASES.quickStart, concern: README_HEADINGS.quickStart },
    { aliases: [], concern: README_HEADINGS.api },
    { aliases: README_SECTION_ALIASES.configuration, concern: README_HEADINGS.configuration },
    { aliases: [], concern: README_HEADINGS.dependencies },
    { aliases: README_SECTION_ALIASES.disposal, concern: README_HEADINGS.disposal },
];

const README_SECTIONS: MetaConcern[] = README_CONCERNS.map((section, index) => ({
    aliases: [...section.aliases],
    concern: section.concern,
    order: index + 1,
    required: true,
}));

export const DOC_TYPE_SCHEMAS: Readonly<Record<string, DocTypeSchema>> = {
    readme: { metaConcerns: README_SECTIONS, ordered: false, type: "readme" },
};
