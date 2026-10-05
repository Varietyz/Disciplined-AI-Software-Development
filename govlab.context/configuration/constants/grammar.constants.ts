export const GATE_MIN_CONDITIONS = 3;

export const GATE_MAX_CONDITIONS = 5;

export const HEADER_PREFIX = "# ";

export const NODE_HEAD = "NODE";

export const RETIRED_UNIT_HEADS = new Set(["PHASE"]);

export const DECLARATION_PREFIX = "THIS ";

export const META_MARKER = "%% META %%";

export const FRONTMATTER_FENCE = "---";

export const GATE_MARKER = "handoff gate";

export const RETIRED_GATE_MARKERS = ["validation gate", "## validation gate", "**validation gate"];

export const CHECK_MARKERS = ["[check]", "ASSERT ", "REQUIRE "];

export const RETIRED_CHECK_MARKERS = ["✅", "ANALYZE ", "[high]", "[medium]", "[low]"];

export const EVIDENCE_OPEN = "(evidence:";

export const POPULATION_MARKER = "over:";

export const MEASURED_MARKER = "measured:";

export const REFUSAL_PREFIX = "refuse:";

export const STANDING_PREFIX = "standing:";

export const RESULT_PREFIX = "result:";

export const RESULT_ARROWS: readonly string[] = ["→", "->"];

export const RESULT_PASS = "pass";

export const RESULT_REPAIR = "REPAIR";

export const RESULT_OWNER_OPEN = "(owner:";

export const RESULT_UNKNOWN = "unknown";

export const RESULT_BLOCKED = "BLOCKED";

export const INVARIANT_BLOCK_HEAD = "CROSS-NODE INVARIANTS";

export const INVARIANT_PREFIX = "INVARIANT ";

export const INVARIANT_SET = "over:";

export const INVARIANT_PARTIES = "binds:";

export const INVARIANT_OBJECTOR = "objector:";

export const BARE_INVARIANT_HEADS = new Set(["ALWAYS:", "NEVER:"]);

export const REPORT_HEAD = "REPORT:";

export const CONTRACT_HEAD = "CONTRACT:";

export const CONTRACT_INPUT = "input:";

export const CONTRACT_TRANSFORM = "transform:";

export const CONTRACT_FRESHNESS = "freshness:";

export const TAG_PURPOSE = "@purpose:";

export const TAG_CUE = "@cue:";

export const TAG_GENESIS = "@genesis:";

export const TAG_OPEN = "[";

export const TAG_CLOSE = "]";

export const TAG_SEPARATOR = "·";

export const TAG_YIELDS = "yields:";

export const NODE_TAG_SLOTS = 4;

export const ARTIFACT_SHAPE = "artifact";

export const WRITING_TOKENS = ["PERSIST_ARTIFACT", "EXECUTE_TOOL", "WRITE ", "DELETE ", "MOVE "];

export const SOURCE_TOKENS = ["NODE ", "{", "<"];

export const EM_DASH = "—";

export const REPAIR_EDGE_HEAD = "REPAIR EDGE";

export const HEAD_TOKEN_MIN = 2;

export const DECL_META_TOKENS = 2;

export const ARM_SEPARATOR = "|";

export const POPULATION_SLASH = "/";

export const BULLET = "- ";

export const LOWERCASE_KEYWORDS = ["if ", "for ", "while ", "set ", "declare ", "when ", "try:", "catch:", "else:"];

export const NEEDS_COLON = ["IF ", "ELSE IF ", "FOR EACH ", "WHILE ", "WHEN "];

export const FOR_HEAD = "FOR ";

export const FOR_EACH_HEAD = "FOR EACH ";

export const VAGUE_TERMS = [
    "looks good",
    "looks valid",
    "looks fine",
    "looks correct",
    "seems ok",
    "is fine",
    "all good",
    "everything works",
    "works fine",
];

export const DECLARING_PREFIXES = ["DECLARE ", "SET "];

export const JURISDICTION_KEY = "jurisdiction";

export const NAME_TERMINATORS = new Set([":", "=", " "]);

export const ZERO = "0";

export const REQUIRED_SECTIONS = ["frontmatter", "declaration", "meta", "nodes", "gates", "invariants", "report"];

export const KEYWORDS_FILE = "keyword.data.json";

export const DOCUMENT_TYPES_FILE = "document.kind.data.json";

export const PRODUCTIONS_FILE = "bnf.data.json";

export const TEMPLATE_FILE_PREFIX = "template.";

export const TEMPLATES_SOURCE = "templates";

export const TERMINALS_KEY = "terminals";

export const DOCUMENT_TYPE_CATEGORY = "document_type";

export const DOCUMENT_VERB_CATEGORY = "document_verb";

export const KEYWORD_SEPARATOR = ":";

export const NONTERMINAL_CLOSE = ">";

export const DEFAULT_SLOT_KIND = "string";

export const PAG_SUBJECT = "pag";
