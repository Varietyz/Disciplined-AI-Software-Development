export const UNKNOWN_PROFILE = "declares a profile the output config does not define.";

export const UNKNOWN_PAGE = "serves a page id the site does not register.";

export const DUPLICATE_CARD = "is registered more than once.";

export const FRAMES_OUT_OF_RANGE = "declares a frame count outside the allowed range.";

export const FPS_OUT_OF_RANGE = "declares a frame rate outside the allowed range.";

export const KEY_FRAME_OUT_OF_RANGE = "declares a key frame outside its timeline.";

export const NOT_FINITE = "resolves an expression to a value that is not a finite number.";

export const OUTSIDE_CANVAS = "places a layer outside the canvas.";

export const OPACITY_OUT_OF_RANGE = "resolves an opacity outside zero to one.";

export const STYLE_NOT_ALLOWED = "sets a style property the card schema does not allow.";

export const TOO_MANY_UNIFORMS = "declares more shader uniforms than the stage provides.";

export const SHADER_WITHOUT_ENTRY = "carries a shader that does not define the shade entry function.";

export const EMPTY_LAYERS = "declares no layers.";

export const EXPRESSION_FAILED = "has an expression that threw while resolving a frame:";

export const DUPLICATE_LAYER = "declares two layers with the same id.";

export const FOLDER_MISMATCH = "is registered from a folder whose name is not the card id.";

export const UNREGISTERED_PLUGIN = "has a plugin file that registers no card.";

export const NO_CARDS = "No card is registered; a card folder must hold a plugin that registers one.";

export const MISSING_IMAGE = "has no rendered image for its current spec; run the social export.";

export const STALE_IMAGE = "was rendered from an older spec than the registered one; run the social export.";

export const ORPHAN_IMAGE = "sits in the share folder but no registered card renders it; run the social export.";

export const MALFORMED_LEDGER = "The share ledger is not a list of card, profile and hash rows:";

export const PRUNED_PREFIX = "Removed ";

export const STALE_MAP = "The share map does not match the registered cards; run the social export.";

export const CARDS_VALID = "Every social card is valid and its rendered images are current.";

export const EXPORT_DONE = "Rendered the social share images.";

export const NO_BROWSER = "No Chrome or Edge binary was found to render the cards.";

export const NO_DEVTOOLS = "The browser's DevTools endpoint never came up.";

export const STAGE_NOT_READY = "The stage page never became ready.";

export const NEEDS_WEBGPU = "This card needs WebGPU, and the browser provides none.";

export const FFMPEG_MISSING =
    "The export encodes its animations with ffmpeg, and no ffmpeg binary is on the path; install ffmpeg and run the export again.";

export const FFMPEG_FAILED = "ffmpeg failed while encoding an animation:";

export const EMPTY_SEQUENCE = "An animation layer's image holds no frames with a duration.";

export const ANIMATION_FAILED = "The animation layer could not decode its image:";

export const LOOP_SEAM =
    "loops but its last frame does not lead back to its first; build every motion from whole cycles of the loop. The layers that break the seam:";

export const SHADER_READS_TIME =
    "loops but its shader reads the frame time, which never returns to its start; drive the shader from the loop progress.";

export const ANIMATION_OUT_OF_STEP =
    "loops for a duration that is not a whole number of its animation layer's own loops, so the layer jumps at the seam.";

export const SHADER_FAILED = "The shader failed to compile or link:";

export const MISSING_LAYER = "The compositor has no element for the layer";

export const UNKNOWN_ANCHOR = "The compositor knows no placement anchor named";

export const UNKNOWN_EFFECT = "The evaluator knows no effect named";

export const UNKNOWN_CURVE = "The expression vocabulary knows no easing curve named";

export const UNKNOWN_CARD = "No registered card has the id";

export const UNKNOWN_STAGE_PROFILE = "The output config defines no profile named";

export const NO_STAGE = "The stage page has no host element to render into.";

export const STAGE_FAILED = "The stage failed while rendering:";

export const NAVIGATION_FAILED = "The browser could not open the stage page:";

export const stageUnaddressed = function stageUnaddressed(address: string): string {
    return `The capture stage started but reports no network port (its address is ${address}), so no browser can open it.`;
};

export const EMPTY_SCREENSHOT = "The browser returned an empty screenshot for frame";

export const SHARE_TOO_LARGE =
    "has no animation at or below the share scale that fits the share size limit; simplify its motion or lower the scale.";

export const MISSING_SHARE_PROFILE = "does not render the share profile the site links for its page.";

export const PAGE_WITHOUT_CARD =
    "is a page of the site with no share card; add a card folder whose plugin builds the card for this page from the page template.";

export const PAGE_SHARED =
    "is served by more than one share card; every page has exactly one card, so remove or re-target the others:";

export const OFF_TONE =
    "renders in a tone other than its page's accent; build the card from the page template so it reads the tone from the page.";

export const OFF_BRAND =
    "does not show every part of the brand identity; build the card from the page template so it carries its page's brand mark, headline, tagline and address, and the site's name and byline. Missing:";

export const ADDRESS_OVERFLOWS =
    "shows its page's address wider than the space the address has on one line; widen the address slot or shorten the route. Profile:";

export const BYLINE_PREFIX = "by ";

export const RENDERED_PREFIX = "Rendered ";

export const CURRENT_PREFIX = "Up to date: ";

export const FORCE_FLAG = "render every card and profile, including those whose images are current";

export const MALFORMED_SHARE_MAP = "The share map module does not export the page-to-image map:";

export const EXPORT_RUNNING =
    "Another share image run holds the capture browser and the stage server; wait for it to finish rather than stopping it. Its process id:";

export const HEALING = "Some share images are out of date or missing; re-rendering only those.";

export const STAGE_HEADING = "Share cards";

export const UNKNOWN_PAGE_ENTRY = "The page template has no registered page with the id";

export const MISSING_COLUMN_ROW = "The page template's text column holds no row named";

export const SOCIAL_SUMMARY =
    "Render every registered social card to PNG and animated GIF, and write the share map the site reads.";

export const VALIDATION_SUMMARY =
    "Validate every registered social card and check that its rendered images and the share map are current.";

export const CARD_FLAG = "render only the card with this id";

export const GPU_FLAG = "render on the gpu, which WebGPU cards require";

export const CAPTION_SEPARATOR = " · ";

export const DIMENSION_SEPARATOR = "×";

export const LIST_SEPARATOR = ", ";

export const SUBJECT_SEPARATOR = " ";
