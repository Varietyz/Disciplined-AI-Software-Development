import { contactLeaf, contactOf } from "@banes-lab/build-scripts/core/converters/company.converter.ts";
import { describe, expect, it } from "vitest";

const COMPANY = {
    COMPANY_ADDRESS: "Somewhere 1",
    COMPANY_COUNTRY: "BE",
    COMPANY_EMAIL: "hello@x.test",
    COMPANY_FOUNDED: "2025",
    COMPANY_NAME: "Example Co",
    COMPANY_NUMBER: "1",
    COMPANY_OWNER: "Ada",
    GITHUB_LINK_TITLE: "Code repository",
    LINKEDIN_LINK_TITLE: "Profile",
    REPLY_NOTE: "Replies are best-effort.",
};

const LINKS = {
    AUTHOR_GITHUB: "https://code.x.test",
    AUTHOR_PROFILE: "https://profile.x.test",
    GRAMMAR_REPOSITORY: "https://grammar.x.test",
    METHODOLOGY_REPOSITORY: "https://method.x.test",
};

describe("contactOf", () => {
    it("reads the contact record out of the company and link modules and refuses a value that is not text", () => {
        const contact = contactOf({ company: COMPANY, links: LINKS });
        expect(contact.company).toBe("Example Co");
        expect(contact.links["Code repository"]).toBe("https://code.x.test");
        expect(Object.keys(contact.links)).toHaveLength(4);
        const unnamed = Object.fromEntries(Object.entries(COMPANY).filter(([key]) => key !== "COMPANY_NAME"));
        expect(() => contactOf({ company: unnamed, links: LINKS })).toThrow("COMPANY_NAME");
    });
});

describe("contactLeaf", () => {
    it("writes the contact record as a leaf at its catalog address with its Markdown form", () => {
        const leaf = contactLeaf(contactOf({ company: COMPANY, links: LINKS }), "https://x.test");
        expect(leaf.identity.title).toBe("Contact");
        expect(leaf.identity.address.markdown).toBe("/api/contact.md");
        expect(leaf.markdown).toContain("Email: hello@x.test");
    });
});
