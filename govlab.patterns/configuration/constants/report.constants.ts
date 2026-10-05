import { DEPTH_PREFIX, INSPECT_HINT } from "#configuration/strings/report.strings";

export const WALK_MAIN = "main";

export const WALK_NESTED = "nested";

export const CELLS_ID = "hexcells";

export const NESTED_SUFFIX = ".nested";

export const HTML_SUFFIX = ".html";

export const GENERATED_PAGE_SUFFIX = ".generated.html";

export const SVG_SUFFIX = ".generated.svg";

export const SLUG_JOIN = "__";

export const ROOT_PAGE = "code";

export const MODULE_SCOPE = "root";

export const INLINE_THRESHOLD = 2500;

export const FALLBACK_STATE = "declare";

export const HIGH_SEVERITY = "high";

export const MEDIUM_SEVERITY = "medium";

export const ARTIFACT_SUFFIXES: readonly string[] = [".html", ".json"];

export const HEAL_ATTEMPTS = 4;

export const CACHE_NAME = "hex-modules";

export const BAR_MIN = 2;

export const BAR_FULL = 100;

export const REPORT_SCRIPT = `(function(){var b=document.createElement("div");b.className="hexbar";b.textContent="${INSPECT_HINT}";document.body.appendChild(b);var raw=document.getElementById("${CELLS_ID}");var cells=raw?JSON.parse(raw.textContent||"{}"):{};function tip(f,ref){var packed=cells[f.getAttribute("data-walk")];var row=packed?packed.rows[parseInt(ref,36)]:null;if(!row){return ""}return (row[3]?row[3]+":"+row[4]:"${DEPTH_PREFIX}"+row[1])+"  \\u00b7  "+row[2]+"  \\u00b7  "+row[6]}var figs=document.querySelectorAll("figure");for(var k=0;k<figs.length;k++){(function(f){var svg=f.querySelector("svg");if(!svg){return}f.className=(f.className+" pz").trim();var s=1,x=0,y=0,dn=false,px=0,py=0,mv=0;function ap(){svg.style.transform="translate("+x+"px,"+y+"px) scale("+s+")"}f.addEventListener("wheel",function(e){e.preventDefault();var r=f.getBoundingClientRect();var px=e.clientX-r.left,py=e.clientY-r.top;var g=e.deltaY<0?1.12:0.89;var ns=Math.min(12,Math.max(0.2,s*g));var k=ns/s;x=px-(px-x)*k;y=py-(py-y)*k;s=ns;ap()},{passive:false});svg.addEventListener("pointerdown",function(e){dn=true;mv=0;px=e.clientX-x;py=e.clientY-y;svg.setPointerCapture(e.pointerId)});svg.addEventListener("pointermove",function(e){if(!dn){return}var nx=e.clientX-px,ny=e.clientY-py;mv+=Math.abs(nx-x)+Math.abs(ny-y);x=nx;y=ny;ap()});svg.addEventListener("pointerup",function(e){dn=false;if(mv<4){var t=e.target&&e.target.closest?e.target.closest("[data-ref]"):null;if(t){b.textContent=tip(f,t.getAttribute("data-ref"))}}});f.addEventListener("dblclick",function(){s=1;x=0;y=0;ap()})})(figs[k])}})();`;
