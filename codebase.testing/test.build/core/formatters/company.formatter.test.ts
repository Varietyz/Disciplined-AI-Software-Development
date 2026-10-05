import { describe, expect, it } from "vitest";
import { renderContact } from "@banes-lab/build-scripts/core/formatters/company.formatter.ts";

describe("renderContact", () => {
    it("links each named address of the contact record", () => {
        const contact = renderContact(
            {
                address: "A",
                company: "C",
                country: "BE",
                email: "e@x.test",
                founded: "2025",
                links: { "Code repository": "https://c.test" },
                number: "1",
                owner: "O",
                reply: "R.",
            },
            "https://x.test",
        );
        expect(contact).toContain("[Code repository](https://c.test)");
    });
});
