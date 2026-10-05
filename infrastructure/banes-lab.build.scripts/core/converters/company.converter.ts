import {
    CONTACT_TITLE,
    GRAMMAR_REPOSITORY_LABEL,
    METHODOLOGY_REPOSITORY_LABEL,
    nonStringValue,
} from "#configuration/strings/catalog.strings";
import type { ContactData, Identity, Leaf } from "#types/catalog.types";
import { INDEX_KIND } from "#configuration/constants/catalog.constants";
import type { WebModules } from "#types/loader.types";
import { contactIndex } from "#core/resolvers/catalog.resolver";
import { renderContact } from "#core/formatters/company.formatter";

const CONTACT_REF = "api:contact";

const field = function field(module: Readonly<Record<string, unknown>>, key: string): string {
    const value = module[key];
    if (typeof value !== "string") {
        throw new TypeError(nonStringValue(key));
    }
    return value;
};

export const contactOf = function contactOf(web: Pick<WebModules, "company" | "links">): ContactData {
    const { company, links } = web;
    return {
        address: field(company, "COMPANY_ADDRESS"),
        company: field(company, "COMPANY_NAME"),
        country: field(company, "COMPANY_COUNTRY"),
        email: field(company, "COMPANY_EMAIL"),
        founded: field(company, "COMPANY_FOUNDED"),
        links: {
            [field(company, "GITHUB_LINK_TITLE")]: field(links, "AUTHOR_GITHUB"),
            [field(company, "LINKEDIN_LINK_TITLE")]: field(links, "AUTHOR_PROFILE"),
            [GRAMMAR_REPOSITORY_LABEL]: field(links, "GRAMMAR_REPOSITORY"),
            [METHODOLOGY_REPOSITORY_LABEL]: field(links, "METHODOLOGY_REPOSITORY"),
        },
        number: field(company, "COMPANY_NUMBER"),
        owner: field(company, "COMPANY_OWNER"),
        reply: field(company, "REPLY_NOTE"),
    };
};

export const contactLeaf = function contactLeaf(contact: ContactData, site: string): Leaf {
    const identity: Identity = {
        address: contactIndex(),
        href: null,
        kind: INDEX_KIND,
        ref: CONTACT_REF,
        summary: contact.reply,
        title: CONTACT_TITLE,
    };
    const data = { ...contact, ref: CONTACT_REF, site, title: contact.company };
    return { data, identity, markdown: renderContact(data, site) };
};
