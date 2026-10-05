import { COLOR_FALLBACK, FLAG_FALLBACK, SEVERITY_COLOR, STATE_COLOR } from "#configuration/tokens/walk.tokens";
import {
    HEX_ARROW_CLASS,
    HEX_CLASS,
    HEX_EMPTY_CLASS,
    HEX_FLAG_PREFIX,
    HEX_PATH_CLASS,
    HEX_STATE_PREFIX,
    HEX_WARN_PREFIX,
    HEX_WARN_TEXT_CLASS,
} from "#configuration/constants/walk.constants";
import { STATE_LEGEND } from "#configuration/strings/walk.strings";

const stateRules = function stateRules(): string {
    return STATE_LEGEND.map(
        (item) => `.${HEX_STATE_PREFIX}${item.state}{fill:${STATE_COLOR.get(item.state) ?? COLOR_FALLBACK}}`,
    ).join("");
};

const severityRules = function severityRules(): string {
    return [...SEVERITY_COLOR.keys()]
        .map((severity) => {
            const color = SEVERITY_COLOR.get(severity) ?? FLAG_FALLBACK;
            return `.${HEX_FLAG_PREFIX}${severity}{stroke:${color};stroke-width:2.2}.${HEX_WARN_PREFIX}${severity}{fill:${color}}`;
        })
        .join("");
};

export const HEX_STYLES = `.${HEX_CLASS}{fill-opacity:.92;stroke:#0d1117;stroke-width:.8}${stateRules()}${severityRules()}.${HEX_PATH_CLASS}{fill:none;stroke:#8b949e;stroke-width:1.1;stroke-opacity:.45}.${HEX_ARROW_CLASS}{fill:#e6edf3}.${HEX_WARN_TEXT_CLASS}{fill:#0d1117;font-weight:bold;font-family:sans-serif}.${HEX_EMPTY_CLASS}{fill:#c9d1d9;font-size:15px;font-family:sans-serif}
.hexhead{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin:0 0 8px;font-family:ui-monospace,Menlo,monospace}
.hexhead b{color:var(--ink);font-size:14px}.hexhead span{color:var(--muted);font-size:12px}
.legend{display:flex;flex-wrap:wrap;gap:12px;margin:8px 0 0;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--muted)}
.legend svg{width:10px;height:10px;vertical-align:middle;margin-right:4px}`;

export const REPORT_STYLES = `${HEX_STYLES}
:root{color-scheme:dark;--bg:#0d1117;--panel:#12171f;--border:#232b36;--ink:#e6edf3;--muted:#9aa4b2;--dim:#6e7681;--accent:#58a6ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;padding:clamp(16px,4vw,40px)}
.mono{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
h1{font-family:ui-monospace,Menlo,monospace;font-size:22px;margin:0 0 4px}
.sub{color:var(--muted);font-size:13px;margin:0 0 24px;font-family:ui-monospace,Menlo,monospace}
.crumb{font-family:ui-monospace,Menlo,monospace;font-size:12px;margin:0 0 14px;color:var(--dim)}
.crumb a{color:var(--accent);text-decoration:none}.crumb a:hover{text-decoration:underline}
.crumb span{color:var(--dim);margin:0 6px}
.grid{display:grid;grid-template-columns:minmax(320px,1fr) minmax(320px,1.1fr);gap:22px;align-items:start}
@media(max-width:820px){.grid{grid-template-columns:1fr}}
.card{border:1px solid var(--border);background:var(--panel);border-radius:10px;padding:14px 16px}
.card h2{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin:0 0 12px}
figure{margin:0;border:1px solid var(--border);border-radius:10px;background:var(--bg);overflow:auto;padding:6px;max-height:min(80vh,920px)}
figure svg{display:block;max-width:100%;height:auto;margin:0 auto}
table{width:100%;border-collapse:collapse;font-size:12.5px}
th{text-align:left;color:var(--dim);font-weight:600;font-family:ui-monospace,Menlo,monospace;font-size:11px;text-transform:uppercase;letter-spacing:.06em;padding:0 8px 6px;border-bottom:1px solid var(--border)}
td{padding:5px 8px;border-bottom:1px solid #1a2027}
td a{color:var(--accent);text-decoration:none}td a:hover{text-decoration:underline}
.num{text-align:right;font-variant-numeric:tabular-nums;font-family:ui-monospace,Menlo,monospace}
.dim{color:var(--dim)}
.pill{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;color:var(--c);border:1px solid var(--c);font-family:ui-monospace,Menlo,monospace}
.barcell{width:60%}.bar{display:block;height:9px;border-radius:3px;background:var(--accent)}
.stack{display:flex;flex-direction:column;gap:18px}
ul.anom{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
ul.anom li{border-left:3px solid var(--c);padding:6px 0 6px 12px;font-size:13px}
ul.anom .tag{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--c);border:1px solid var(--c);border-radius:4px;padding:0 5px;margin-left:6px}
.tablewrap{max-height:420px;overflow:auto}
.anomwrap{max-height:420px;overflow:auto}
.kindtag{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--dim);border:1px solid var(--border);border-radius:4px;padding:0 5px}
.warn{color:#f0c000}
.empty{color:var(--dim);font-size:13px;font-style:italic}
.hexbar{position:fixed;left:0;right:0;bottom:0;background:#0d1117ee;border-top:1px solid var(--border);color:var(--muted);font-family:ui-monospace,Menlo,monospace;font-size:12px;padding:8px 14px;white-space:nowrap;overflow:auto;z-index:9}
figure.pz{overflow:hidden;cursor:grab;touch-action:none}
figure.pz svg{max-width:none;transform-origin:0 0}
body:has(.hexbar){padding-bottom:44px}`;
