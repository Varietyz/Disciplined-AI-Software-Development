export const namelessLink = function namelessLink(href: string): string {
    return `A link to ${href} has no discernible name; give it text, an aria-label, or an image with alt text.`;
};

export const genericLink = function genericLink(href: string, text: string): string {
    return `The link to ${href} reads "${text}", which names nothing out of context; make its text say where it leads.`;
};
