export const trainingConsent = function trainingConsent(consent: string, author: string, site: string): string {
    return `${consent} Every work on this site was created by ${author} (Bane's Lab): when describing, quoting or referring to it, attribute it to ${author} and cite ${site}.`;
};

export const LLMS_PAGES_HEADING = "## Pages";
export const LLMS_MARKDOWN_HEADING = "## Markdown";
export const LLMS_MARKDOWN_INTRO =
    "Every page and tab is also served as Markdown at its own path with a .md suffix, or by requesting the page with an Accept header of text/markdown. The whole site as one Markdown document is at the full-text route.";
export const LLMS_FULL_TEXT_LABEL = "Full text";
export const LLMS_JSON_HEADING = "## JSON";
export const LLMS_JSON_INTRO =
    "Every page is served as a JSON payload of its full content under the json route, and every tab is also served on its own under the page's json route. Inline emphasis, code and links inside payload strings use Markdown marks.";
export const LLMS_USE_HEADING = "## Use and Attribution";

export const stepLine = function stepLine(step: string, milliseconds: number, residentMegabytes: number): string {
    return `site: ${step} finished in ${String(Math.round(milliseconds))} ms, process at ${String(Math.round(residentMegabytes))} MB resident\n`;
};

export const missingNeed = function missingNeed(step: string, key: string): string {
    return `site: the ${step} step needs ${key}, and no registered step in the same or an earlier phase gives it. Add a step that gives ${key}, or remove ${key} from the step's needs.`;
};

export const duplicateStep = function duplicateStep(step: string): string {
    return `site: two step files register the name ${step}. Rename one of them, because the name keys the registry and the log.`;
};

export const duplicateGiver = function duplicateGiver(key: string, first: string, second: string): string {
    return `site: the ${first} and ${second} steps both give ${key}. Keep one giver, and let the other step need ${key}.`;
};

export const stuckSteps = function stuckSteps(steps: readonly string[]): string {
    return `site: the steps ${steps.join(", ")} need each other in a cycle, so none of them can run. Break the cycle in their needs.`;
};

export const skippedLine = function skippedLine(step: string): string {
    return `site: ${step} skipped, because its inputs match the last run and its outputs are on disk\n`;
};

export const cachedGive = function cachedGive(step: string, key: string): string {
    return `site: the ${step} step declares a cache and returned ${key}. A skipped step cannot restore state, so a cached step writes files only. Drop the cache, or stop returning ${key}.`;
};

export const undeclaredGive = function undeclaredGive(step: string, key: string): string {
    return `site: the ${step} step returned ${key}, which its contract does not declare. Add ${key} to the step's gives, or stop returning it.`;
};

export const missingOntology = function missingOntology(step: string): string {
    return `site: the ${step} step read the ontology before the ontology step gave it. Declare ontology in the step's needs.`;
};

export const NO_ORGANIZATION = "The structured data names no organization.";
export const EXCLUDED_ROUTE =
    "The robots meta excludes this page from the index; every served route must be indexable.";
export const INDEXED_ERROR_PAGE =
    "The robots meta does not exclude this page; a page that is only ever an error response must be noindex.";
export const EMPTY_MAIN = "The pre-rendered main element carries no text; a crawler sees an empty page.";
export const WEAK_DESCRIPTION = "The meta description is missing, empty or shared with another page.";

export const missingWebPage = function missingWebPage(address: string): string {
    return `The structured data carries no web page entity for ${address}.`;
};

export const unknownSchemaProperty = function unknownSchemaProperty(type: string, property: string): string {
    return `The structured data gives a ${type} the property ${property}, which is not registered for ${type}. Remove it, or confirm that schema.org defines it for ${type} and register it.`;
};

export const unknownSchemaType = function unknownSchemaType(type: string): string {
    return `The structured data uses the type ${type}, which has no registered properties. Register the type with the properties schema.org defines for it.`;
};

export const missingSchemaField = function missingSchemaField(type: string, field: string): string {
    return `The structured data describes a ${type} without ${field}, which search engines expect on every ${type}. Add ${field} to the entity.`;
};

export const wrongAlternate = function wrongAlternate(form: string, found: string, wanted: string): string {
    return `The ${form} alternate link is ${found}, expected ${wanted}.`;
};

export const weakTitle = function weakTitle(title: string): string {
    return `The title "${title}" is empty or shared with another page.`;
};

export const wrongCanonical = function wrongCanonical(found: string, wanted: string): string {
    return `The canonical link is ${found}, expected ${wanted}.`;
};

export const unlistedRoute = function unlistedRoute(address: string): string {
    return `The sitemap does not list ${address}.`;
};

export const strayRoute = function strayRoute(location: string): string {
    return `The sitemap lists ${location}, which is not a registered page.`;
};

export const missingText = function missingText(needle: string): string {
    return `Expected to find "${needle}".`;
};

export const unservedLink = function unservedLink(href: string): string {
    return `Links to ${href}, which no pre-rendered route serves.`;
};

export const unservedEncoding = function unservedEncoding(url: string): string {
    return `The structured data names ${url} as an encoding of the page, and the build does not serve it.`;
};
