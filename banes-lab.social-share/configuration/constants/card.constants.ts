export const MIN_FRAMES = 1;

export const MAX_FRAMES = 240;

export const MIN_FPS = 1;

export const MAX_FPS = 50;

export const UNIFORM_SLOTS = 16;

export const MILLISECONDS = 1000;

export const SHADER_ENTRY = "fn shade(";

export const SHADER_TIME_FIELD = ".time";

export const SEAM_TOLERANCE = 1e-6;

export const SEAM_VELOCITY_RATIO = 0.5;

export const WIDE_RATIO = 1.2;

export const DEFAULT_ALIGN = "left";

export const MONO_ADVANCE = 0.6;

export const ADDRESS_ADVANCE = 0.65;

export const CARD_CLASS_PREFIX = "card-";

export const CARD_CLASS = "stage-card";

export const LAYER_CLASS = "card-layer";

export const STAGE_ID = "stage";

export const GRID_CLASS = "stage-grid";

export const TILE_CLASS = "stage-tile";

export const CAPTION_CLASS = "stage-caption";

export const FINDINGS_CLASS = "stage-findings";

export const FRAME_CLASS = "stage-frame";

export const HEADER_CLASS = "stage-header";

export const KICKER_CLASS = "stage-kicker";

export const HEADING_CLASS = "stage-heading";

export const SPREAD_CLASS = "stage-spread";

export const SPREAD_TITLE_CLASS = "stage-spread-title";

export const SPREAD_META_CLASS = "stage-spread-meta";

export const SPREAD_ROW_CLASS = "stage-spread-row";

export const RENDER_HOOK = "renderFrame";

export const READY_FLAG = "stageReady";

export const ERROR_FLAG = "stageError";

export const STEP_FLAG = "stageStep";

export const STAGE_STEPS = { fonts: "fonts", mounting: "mounting", painting: "painting" } as const;

export const CARD_PARAMETER = "card";

export const PROFILE_PARAMETER = "profile";

export const FILE_SEPARATOR = ".";

export const WIDTH_MARK = "-w";

export const HEIGHT_MARK = "-h";

export const GENERATED_MARK = ".generated";

export const STILL_EXTENSION = ".png";

export const ANIMATION_EXTENSION = ".gif";

export const MOTION_EXTENSION = ".webp";

export const VIDEO_EXTENSION = ".mp4";

export const HASH_ALGORITHM = "sha256";

export const FFMPEG_BINARY = "ffmpeg";

export const FRAME_PREFIX = "frame-";

export const FRAME_DIGITS = 4;

export const FRAME_EXTENSION = ".png";

export const VIDEO_FILE = "loop.mp4";

export const WORK_FOLDER = ".social-frames";

export const LOCK_FILE = ".social-capture.lock";

export const CARD_OPTION = "--card";

export const GPU_OPTION = "--gpu";

export const FORCE_OPTION = "--force";

export const STAGE_SHEETS: readonly string[] = [
    "@banes-lab/web/presentation/tokens/base.tokens.css",
    "@banes-lab/web/presentation/tokens/asset.tokens.css",
    "@banes-lab/web/presentation/tokens/page.tokens.css",
    "@banes-lab/web/presentation/generated/icon.tokens.generated.css",
    "@banes-lab/web/presentation/styles/element.style.css",
    "@banes-lab/social-share/core/styles/stage.style.css",
];

export const SOCIAL_COMMAND = "npm run social --";

export const STAGE_MODE = "stage";

export const VALIDATION_COMMAND = "social card validation";

export const FINDING_INDENT = "  ";

export const PLUGIN_FOLDER = "plugins";

export const PLUGIN_SUFFIX = ".plugin.ts";
