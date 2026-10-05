import {
    BAR_FULL,
    BAR_MIN,
    CELLS_ID,
    GENERATED_PAGE_SUFFIX,
    REPORT_SCRIPT,
    WALK_MAIN,
    WALK_NESTED,
} from "#configuration/constants/report.constants";
import type { CodeFinding, Distribution, SymbolStat, TypeStat } from "#types/code.types";
import type { Crumb, NestedChild, PageRender } from "#types/report.types";
import { DEPENDENTS_COLOR, FLOW_COLOR, MUTED_COLOR, SEVERITY_COLOR } from "#configuration/tokens/walk.tokens";
import { HEX_CLASS, HEX_STATE_PREFIX } from "#configuration/constants/walk.constants";
import {
    NESTED_COLUMNS,
    NO_DEFINITIONS,
    RARE_ROW,
    REPORT_HEADINGS,
    SYMBOL_COLUMNS,
    SYNTAX_COLUMNS,
    nestedCount,
    summaryLine,
} from "#configuration/strings/report.strings";
import { REPORT_STYLES } from "#configuration/styles/report.style";
import { STATE_LEGEND } from "#configuration/strings/walk.strings";
import { basename } from "node:path";
import { escapeXml as esc } from "#core/formatters/markup.formatter";
import { packCells } from "#core/converters/walk.converter";
import { relativePath } from "@ssot/paths";

const BACKSLASH = 0x5C;
const ESCAPED_LT = `${String.fromCodePoint(BACKSLASH)}u003c`;
const SEPARATOR = " &middot; ";

const baseName = function baseName(path: string): string {
    return path.split("/").pop() ?? path;
};

const headCell = function headCell(column: string): string {
    return `<th>${column}</th>`;
};

const head = function head(columns: readonly string[]): string {
    return `<thead><tr>${columns.map(headCell).join("")}</tr></thead>`;
};

const artifactLink = function artifactLink(key: string): string {
    const name = esc(basename(relativePath(key)));
    return `<a href="${name}">${name}</a>`;
};

const card = function card(heading: string, body: string): string {
    return `<div class="card"><h2>${heading}</h2>${body}</div>`;
};

const pageLink = function pageLink(page: string, label: string): string {
    return `<a href="${esc(page)}${GENERATED_PAGE_SUFFIX}">${esc(label)}</a>`;
};

const flaggedCell = function flaggedCell(count: number): string {
    return count > 0 ? `<span class="warn">&#9888; ${count}</span>` : `<span class="dim">0</span>`;
};

const nestedRow = function nestedRow(child: NestedChild): string {
    const label = child.page === "" ? esc(child.label) : pageLink(child.page, child.label);
    return `<tr><td>${label}</td><td class="num">${child.count}</td><td class="num">${child.defs}</td><td class="num">${flaggedCell(child.anomalies)}</td></tr>`;
};

export const renderNested = function renderNested(nestedFigure: string, children: readonly NestedChild[]): string {
    return card(
        REPORT_HEADINGS.nested,
        `${nestedFigure}<table>${head(NESTED_COLUMNS)}<tbody>${children.map(nestedRow).join("")}</tbody></table>`,
    );
};

const dependentsCell = function dependentsCell(fanIn: ReadonlyMap<string, number>, name: string): string {
    const count = fanIn.get(name) ?? 0;
    return count > 0
        ? `<span class="pill" style="--c:${DEPENDENTS_COLOR}">${count}</span>`
        : `<span class="dim">&mdash;</span>`;
};

const symbolRow = function symbolRow(stat: SymbolStat, fanIn: ReadonlyMap<string, number>): string {
    const flow = `<span class="pill" style="--c:${FLOW_COLOR.get(stat.flow) ?? MUTED_COLOR}">${stat.flow}</span>`;
    const where = `<span class="dim">${esc(baseName(stat.file))}:${stat.line}</span>`;
    return `<tr><td class="mono">${esc(stat.name)} ${where}</td><td>${flow}</td><td class="num">${stat.inDegree}</td><td class="num">${stat.outDegree}</td><td class="num">${dependentsCell(fanIn, stat.name)}</td></tr>`;
};

const findingRow = function findingRow(finding: CodeFinding): string {
    const where = finding.file.length > 0 ? `<span class="dim mono">${esc(finding.file)}:${finding.line}</span>` : "";
    const color = SEVERITY_COLOR.get(finding.severity) ?? MUTED_COLOR;
    return `<li style="--c:${color}"><b>${esc(finding.name)}</b> <span class="tag">${esc(finding.kind)}</span> <span class="kindtag">${esc(finding.confidence)}</span> ${where}<br><span class="dim">${esc(finding.detail)}</span><br><span class="dim">&#8627; ${esc(finding.remedy)}</span></li>`;
};

const typeRow = function typeRow(stat: TypeStat, max: number): string {
    const width = Math.max(BAR_MIN, Math.round((stat.count / Math.max(1, max)) * BAR_FULL));
    return `<tr><td class="mono">${esc(stat.type)}</td><td class="barcell"><span class="bar" style="width:${width}%"></span></td><td class="num">${stat.count}</td></tr>`;
};

const symbolsTable = function symbolsTable(symbols: readonly SymbolStat[], fanIn: ReadonlyMap<string, number>): string {
    if (symbols.length === 0) {
        return `<p class="empty">${NO_DEFINITIONS}</p>`;
    }
    const rows = symbols.map((stat) => symbolRow(stat, fanIn)).join("");
    return `<div class="tablewrap"><table>${head(SYMBOL_COLUMNS)}<tbody>${rows}</tbody></table></div>`;
};

const distributionTable = function distributionTable(distribution: Distribution): string {
    const max = distribution.invariants[0]?.count ?? 1;
    const common = distribution.invariants.map((stat) => typeRow(stat, max)).join("");
    const rare =
        distribution.variants.length === 0
            ? ""
            : `<tr><td colspan="3" class="dim mono">${RARE_ROW}</td></tr>${distribution.variants.map((stat) => typeRow(stat, max)).join("")}`;
    return `<table>${head(SYNTAX_COLUMNS)}<tbody>${common}${rare}</tbody></table>`;
};

const crumbNav = function crumbNav(crumbs: readonly Crumb[], label: string): string {
    if (crumbs.length === 0) {
        return "";
    }
    const links = crumbs.map((crumb) => pageLink(crumb.page, crumb.label)).join(`<span>/</span>`);
    return `<p class="crumb">${links}<span>/</span>${esc(label)}</p>`;
};

const findingsCard = function findingsCard(findings: readonly CodeFinding[]): string {
    if (findings.length === 0) {
        return "";
    }
    return card(
        REPORT_HEADINGS.findings,
        `<div class="anomwrap"><ul class="anom">${findings.map(findingRow).join("")}</ul></div>`,
    );
};

const legend = function legend(): string {
    const items = STATE_LEGEND.map(
        (item) =>
            `<span><svg viewBox="0 0 10 10" role="img"><circle class="${HEX_CLASS} ${HEX_STATE_PREFIX}${item.state}" cx="5" cy="5" r="5"/></svg>${esc(item.text)}</span>`,
    );
    return `<div class="legend">${items.join("")}</div>`;
};

const hexFigure = function hexFigure(svg: string, walk: string, title: string, subtitle: string): string {
    return `<div class="hexhead"><b>${esc(title)}</b><span>${esc(subtitle)}</span></div><figure data-walk="${walk}">${svg}</figure>${legend()}`;
};

const cellsScript = function cellsScript(page: PageRender): string {
    const payload = JSON.stringify({
        [WALK_MAIN]: packCells(page.mainCells),
        [WALK_NESTED]: packCells(page.nestedCells),
    });
    return `<script type="application/json" id="${CELLS_ID}">${payload.split("<").join(ESCAPED_LT)}</script>`;
};

const codeGrid = function codeGrid(svg: string, page: PageRender): string {
    const walk = hexFigure(svg, WALK_MAIN, page.label, page.walkSubtitle);
    const syntax = card(REPORT_HEADINGS.distribution, distributionTable(page.distribution));
    const symbols = card(REPORT_HEADINGS.symbols, symbolsTable(page.symbols, page.fanIn));
    return `<div class="grid"><div class="stack">${walk}${syntax}</div><div class="stack">${symbols}</div></div>`;
};

const subLine = function subLine(page: PageRender): string {
    const definitions = page.definitions + page.nested.reduce((sum, child) => sum + child.defs, 0);
    const flagged = page.findings.length + page.nested.reduce((sum, child) => sum + child.anomalies, 0);
    const summary = summaryLine(definitions, flagged, page.nested.length > 0 ? nestedCount(page.nested.length) : "");
    return [summary, artifactLink("moduleInfo.findings"), artifactLink("moduleInfo.analysis")].join(SEPARATOR);
};

export const renderPage = function renderPage(page: PageRender): string {
    const nested =
        page.nested.length > 0
            ? renderNested(hexFigure(page.nestedSvg, WALK_NESTED, page.label, page.nestedSubtitle), page.nested)
            : "";
    const grid = page.mainSvg === "" ? "" : codeGrid(page.mainSvg, page);
    const findings = findingsCard(page.findings);
    const header = `<style>${REPORT_STYLES}</style>${crumbNav(page.crumbs, page.label)}<h1>${esc(page.label)}</h1>`;
    return `${header}<p class="sub">${subLine(page)}</p>${findings}${nested}${grid}${cellsScript(page)}<script>${REPORT_SCRIPT}</script>`;
};
